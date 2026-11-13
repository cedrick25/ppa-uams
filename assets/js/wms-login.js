/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.login = (typeof $.wms.login !== 'undefined') ? $.wms : {};

$.wms.login = (function() {

    var pendingLogin = null;
    var factorStatus = { pin_set: false, methods: {} };
    var devices = {
        secure: false,
        platform: false,
        futronic: false,
        builtinCams: [],
        externalCams: [],
        noCamera: false
    };
    var faceSelection = null;
    var faceStream = null;
    var faceWatch = null;
    var faceCollectTimer = null;
    var faceCheckBusy = false;
    var faceCollecting = false;
    var faceLocked = false;
    var faceStableCount = 0;
    var facePreviousRaw = null;
    var faceRetryAt = 0;
    var faceServerMessage = "";
    var FUTRONIC_AGENT = "http://127.0.0.1:17364";
    var FUTRONIC_PROTOCOL = "ppa-futronic://start";
    var futronicBusy = false;
    var futronicPoll = null;
    var futronicPurpose = "enroll";
    var futronicAnnouncement = "";
    var futronicAnnounceTimer = null;
    var futronicCaptureSeen = null;
    var futronicCaptureActive = null;
    var futronicCaptureArmed = false;
    var futronicUseCaptureGeneration = false;
    var futronicFailCount = 0;
    var futronicRetryTimer = null;
    var futronicGeneration = 0;

    var b64urlToBuf = function(value) {
        var text = String(value).replace(/-/g, '+').replace(/_/g, '/');
        while (text.length % 4) {
            text += '=';
        }
        var binary = atob(text);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    };

    var bufToB64url = function(buffer) {
        var bytes = new Uint8Array(buffer);
        var binary = '';
        for (var i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
    };

    var isBuiltinCamera = function(device) {
        var label = (device.label || '').toLowerCase();
        if (!label) {
            return false;
        }
        return /integrated|built-?in|facetime|truevision|easy camera|hp hd|ir camera|internal|front camera/.test(label);
    };

    var stopFaceWatch = function() {
        if (faceWatch) {
            clearInterval(faceWatch);
            faceWatch = null;
        }
        if (faceCollectTimer) {
            clearTimeout(faceCollectTimer);
            faceCollectTimer = null;
        }
        faceCheckBusy = false;
        faceCollecting = false;
    };

    var stopFacePreview = function() {
        stopFaceWatch();
        if (faceStream) {
            faceStream.getTracks().forEach(function(track) {
                track.stop();
            });
            faceStream = null;
        }
        var video = document.getElementById('facePreview');
        if (video) {
            video.srcObject = null;
        }
        $("#faceStage,#faceGuideNote").hide();
        $("#faceGrid").removeClass("on").empty();
    };

    var ensureFaceGrid = function() {
        var grid = $("#faceGrid");
        if (grid.children().length === 256) {
            return grid;
        }
        grid.empty();
        for (var i = 0; i < 256; i++) {
            grid.append("<span></span>");
        }
        return grid;
    };

    var paintFaceMismatch = function(mismatch) {
        var grid = ensureFaceGrid();
        grid.addClass("on");
        var max = 0;
        var values = mismatch || [];
        for (var i = 0; i < values.length; i++) {
            if (values[i] > max) {
                max = values[i];
            }
        }
        grid.children().each(function(index) {
            var hot = max > 0 && values[index] / max >= 0.55;
            this.className = hot ? "mismatch" : "";
        });
    };

    var showFaceGuide = function(enrolled) {
        $("#faceStage,#faceGuideNote").show();
        $("#faceGrid").removeClass("on");
        $("#faceOval").removeClass("ready");
        if (enrolled) {
            $("#faceGuideNote").text("Fit your face inside the guide. It turns green when the picture is clear enough to check.");
        } else {
            $("#faceGrid").empty();
            $("#faceGuideNote").text("Fit your face inside the guide. It turns green when you can save Face ID.");
        }
    };

    var setFacePrompt = function(message, ready) {
        $("#faceHint").removeClass("hidden").text(message);
        $("#faceOval").toggleClass("ready", !!ready);
        var enrolled = faceSelection && factorStatus.methods && factorStatus.methods[faceSelection.method];
        if (!enrolled) {
            $("#btnFaceContinue").prop("disabled", !ready || faceCollecting || faceLocked);
        }
    };

    var faceMovement = function(previous, current) {
        if (!previous || !current || previous.length !== current.length) {
            return 999;
        }
        var sum = 0;
        for (var i = 0; i < previous.length; i++) {
            sum += Math.abs(previous[i] - current[i]);
        }
        return sum / previous.length;
    };

    var showSfAlert = function(message) {
        $("#divSfAlert").removeClass("hidden").text(message);
    };

    var hideSfPanels = function() {
        $("#divSecondFactor,#divSfFingerprint,#divSfFutronic,#divSfFace,#divSfPin,#divLoginOTP").addClass("hidden");
    };

    var openSecondFactorModal = function() {
        var modal = $("#sfModal");
        if (!modal.hasClass("in")) {
            modal.modal({ backdrop: "static", keyboard: false, show: true });
        }
    };

    var closeSecondFactorModal = function() {
        if (!$("#divSfSuccess").hasClass("hidden") || !$("#divOtpSuccess").hasClass("hidden")) {
            return;
        }
        stopFacePreview();
        abandonFutronic();
        shutdownFutronic();
        hidePinNumpad();
        $("#txtPin").val("");
        $("#divSfAlert").addClass("hidden").text("");
        $("#sfModal").modal("hide");
    };

    var showFactorHome = function() {
        stopFacePreview();
        abandonFutronic();
        hideSfPanels();
        $("#divSecondFactor").removeClass("hidden");
        applyDeviceState();
        openSecondFactorModal();
    };

    var applyDeviceState = function() {
        var builtinOk = devices.secure && devices.platform;
        var futronicOk = devices.futronic === true;
        $("#btnSfFingerprint").prop("disabled", false);
        var facePossible = devices.secure && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !devices.noCamera;
        $("#btnSfFace").prop("disabled", !facePossible);
        $("#btnFpBuiltin").prop("disabled", !builtinOk);
        $("#btnFpFutronic").prop("disabled", !futronicOk || futronicBusy);
        $("#btnFaceBuiltin").prop("disabled", devices.builtinCams.length === 0);
        $("#btnFaceWebcam").prop("disabled", devices.externalCams.length === 0);

        if (!devices.secure) {
            $("#divSfSecure").removeClass("hidden");
        } else {
            $("#divSfSecure").addClass("hidden");
        }
        $("#sfDeviceNote").text("");
    };

    var classifyCameras = function(cameras) {
        var labeled = cameras.filter(function(camera) {
            return camera.label;
        });
        if (labeled.length === 0) {
            devices.builtinCams = cameras.length ? [cameras[0]] : [];
            devices.externalCams = cameras.slice(1);
            return;
        }
        devices.builtinCams = cameras.filter(isBuiltinCamera);
        devices.externalCams = cameras.filter(function(camera) {
            return !isBuiltinCamera(camera);
        });
        if (devices.builtinCams.length === 0 && devices.externalCams.length === 0 && cameras.length) {
            devices.builtinCams = [cameras[0]];
            devices.externalCams = cameras.slice(1);
        }
    };

    var detectFutronic = function() {
        var done = $.Deferred();
        $.ajax({
            url: FUTRONIC_AGENT + "/health",
            method: "GET",
            dataType: "json",
            timeout: 2000
        }).done(function(data) {
            devices.futronic = !!(data && data.scannerOpen === true && data.hmacConfigured === true);
            devices.futronicMessage = data && data.message ? data.message : "";
        }).fail(function() {
            devices.futronic = false;
            devices.futronicMessage = "Futronic FS64 was not detected.";
        }).always(function() {
            done.resolve();
        });
        return done.promise();
    };

    var launchFutronicHelper = function() {
        var frame = document.getElementById("futronicLauncher");
        if (!frame) {
            frame = document.createElement("iframe");
            frame.id = "futronicLauncher";
            frame.setAttribute("aria-hidden", "true");
            frame.style.display = "none";
            document.body.appendChild(frame);
        }
        frame.src = FUTRONIC_PROTOCOL + "?" + Date.now();
    };

    var shutdownFutronic = function() {
        devices.futronic = false;
        if (window.fetch) {
            fetch(FUTRONIC_AGENT + "/shutdown", { method: "POST", keepalive: true }).catch(function() {});
        }
    };

    var waitForFutronic = function(attempts) {
        var done = $.Deferred();
        var tries = 0;
        var poll = function() {
            $.ajax({
                url: FUTRONIC_AGENT + "/health",
                method: "GET",
                dataType: "json",
                timeout: 8000
            }).done(function(data) {
                devices.futronic = !!(data && data.scannerOpen === true && data.hmacConfigured === true);
                devices.futronicMessage = data && data.message ? data.message : "";
                done.resolve(data);
            }).fail(function() {
                tries += 1;
                if (tries >= attempts) {
                    devices.futronic = false;
                    devices.futronicMessage = "The Futronic helper did not start. Run Futronic Setup once on this computer, allow the browser to open it, and connect the FS64.";
                    done.reject();
                    return;
                }
                setTimeout(poll, 1000);
            });
        };
        poll();
        return done.promise();
    };

    var detectDevices = function() {
        devices.secure = window.isSecureContext === true;
        var jobs = [];

        if (devices.secure && window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            jobs.push(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(function(available) {
                devices.platform = available === true;
            }).catch(function() {
                devices.platform = false;
            }));
        } else {
            devices.platform = false;
        }

        return $.when.apply($, jobs).always(function() {
            applyDeviceState();
        });
    };

    var loadFactorStatus = function() {
        if (!pendingLogin) {
            return;
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/secondFactorStatus', JSON.stringify({
            TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN
        })).done(function(result) {
            if (result.status === 'SUCCESS') {
                factorStatus = result.payload;
            }
        });
    };

    var finishSession = function(result, successBox) {
        shutdownFutronic();
        var payload2 = {
            LEVEL_ID : result.payload.USER_LEVEL_ID
        };
        var date = new Date();
        date.setTime(date.getTime() + (180 * 1440 * 60 * 1000));
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/getUserTypeByModulesByID', JSON.stringify(payload2)).done(function (result2) {
            if(result2.status == 'SUCCESS'){
                $.cookie("PERMISSIONS", JSON.stringify(result2.payload), {expires: date});
            }
            if (successBox === "#divSfSuccess") {
                hideSfPanels();
                $("#divSecondFactor").removeClass("hidden");
                $("#divSfAlert").addClass("hidden");
                openSecondFactorModal();
            }
            $(successBox).removeClass("hidden");
            var p = result.payload;
            $.cookie("USER_ID", p.USER_ID, {expires: date});
            $.cookie("USER_NAME", p.USER_NAME, {expires: date});
            $.cookie("USER_FULLNAME", p.USER_FULLNAME, {expires: date});
            $.cookie("USER_EMAIL", p.USER_EMAIL, {expires: date});
            $.cookie("FIELD_OFFICE", p.FIELD_OFFICE, {expires: date});
            $.cookie("USER_STATUS", p.USER_STATUS, {expires: date});
            $.cookie("USER_LEVEL_ID", p.USER_LEVEL_ID, {expires: date});
            $.cookie("H", p.HASH, {expires: date});
            setTimeout(function () {
                window.location.href="dashboard";
            },1000);
        });
    };

    var methodLabel = function(method) {
        if (factorStatus.methods && factorStatus.methods[method]) {
            return "Verify";
        }
        return "Set up";
    };

    var runWebAuthn = function(method, deviceLabel) {
        if (!pendingLogin) {
            return;
        }
        $("#divSfAlert").addClass("hidden").text("");
        if (!window.PublicKeyCredential) {
            showFactorHome();
            showSfAlert("This browser cannot use a fingerprint. Use PIN or SMS OTP.");
            return;
        }
        startWebAuthn(method, deviceLabel);
    };

    var startWebAuthn = function(method, deviceLabel) {
        var token = pendingLogin.payload.SECOND_FACTOR_TOKEN;
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/webauthnLoginOptions', JSON.stringify({
            TOKEN: token,
            METHOD: method
        })).done(function(result) {
            if (result.status === 'SETUP') {
                if (!factorStatus.methods) {
                    factorStatus.methods = {};
                }
                factorStatus.methods[method] = false;
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/webauthnRegisterOptions', JSON.stringify({
                    TOKEN: token,
                    METHOD: method
                })).done(function(registerResult) {
                    if (registerResult.status !== 'SUCCESS') {
                        showFactorHome();
                        showSfAlert(registerResult.message || 'Unable to start fingerprint sign-in.');
                        return;
                    }
                    runWebAuthnCeremony(method, deviceLabel, registerResult.payload, false);
                });
                return;
            }
            if (result.status !== 'SUCCESS') {
                showFactorHome();
                showSfAlert(result.message || 'Unable to start fingerprint sign-in.');
                return;
            }
            if (!factorStatus.methods) {
                factorStatus.methods = {};
            }
            factorStatus.methods[method] = true;
            runWebAuthnCeremony(method, deviceLabel, result.payload, true);
        });
    };

    var runWebAuthnCeremony = function(method, deviceLabel, options, enrolled) {
        var token = pendingLogin.payload.SECOND_FACTOR_TOKEN;
            var request;
            if (!enrolled) {
                request = navigator.credentials.create({
                    publicKey: {
                        challenge: b64urlToBuf(options.challenge),
                        rp: { name: options.rpName, id: options.rpId },
                        user: {
                            id: b64urlToBuf(options.userId),
                            name: options.userName,
                            displayName: options.displayName
                        },
                        pubKeyCredParams: [
                            { type: 'public-key', alg: -7 },
                            { type: 'public-key', alg: -257 }
                        ],
                        authenticatorSelection: {
                            authenticatorAttachment: 'platform',
                            residentKey: 'discouraged',
                            requireResidentKey: false,
                            userVerification: 'required'
                        },
                        timeout: 60000,
                        attestation: 'none'
                    }
                });
            } else {
                request = navigator.credentials.get({
                    publicKey: {
                        challenge: b64urlToBuf(options.challenge),
                        rpId: options.rpId,
                        allowCredentials: (options.allowCredentials || []).map(function(id) {
                            return { type: 'public-key', id: b64urlToBuf(id), transports: ['internal'] };
                        }),
                        userVerification: 'required',
                        timeout: 60000
                    }
                });
            }

            request.then(function(credential) {
                var body = {
                    TOKEN: token,
                    METHOD: method,
                    id: bufToB64url(credential.rawId),
                    DEVICE_LABEL: deviceLabel || ''
                };
                var verifyPath;
                if (!enrolled) {
                    body.clientDataJSON = bufToB64url(credential.response.clientDataJSON);
                    body.attestationObject = bufToB64url(credential.response.attestationObject);
                    verifyPath = '/ppa-api-uams/wsv1/api/webauthnRegisterVerify';
                } else {
                    body.clientDataJSON = bufToB64url(credential.response.clientDataJSON);
                    body.authenticatorData = bufToB64url(credential.response.authenticatorData);
                    body.signature = bufToB64url(credential.response.signature);
                    verifyPath = '/ppa-api-uams/wsv1/api/webauthnLoginVerify';
                }
                $.wms.executeExternalPost(verifyPath, JSON.stringify(body)).done(function(verified) {
                    stopFacePreview();
                    if (verified.status === 'SUCCESS') {
                        $("#divOtpEnter").addClass("hidden");
                        finishSession(pendingLogin, "#divSfSuccess");
                    } else {
                        showFactorHome();
                        showSfAlert((verified.message || 'Verification failed.') + ' You can use SMS OTP instead.');
                    }
                });
            }).catch(function(error) {
                stopFacePreview();
                hideSfPanels();
                $("#divSfFingerprint").removeClass("hidden");
                openSecondFactorModal();
                $("#fpHint").addClass("hidden");
                var cancelled = error && (error.name === "NotAllowedError" || error.name === "AbortError");
                showSfAlert(cancelled
                    ? "Fingerprint was cancelled. Try again, or use PIN or SMS OTP."
                    : "The built-in fingerprint could not be used. Try again, or use PIN or SMS OTP.");
            });
    };

    var stopFutronicPoll = function() {
        if (futronicPoll) {
            clearInterval(futronicPoll);
            futronicPoll = null;
        }
    };

    var resetFutronicCaptureWatch = function() {
        futronicCaptureSeen = null;
        futronicCaptureActive = null;
        futronicCaptureArmed = false;
        futronicUseCaptureGeneration = false;
    };

    var startFutronicPoll = function() {
        stopFutronicPoll();
        futronicPoll = setInterval(function() {
            $.ajax({
                url: FUTRONIC_AGENT + "/status",
                method: "GET",
                dataType: "json",
                timeout: 1500
            }).done(function(data) {
                applyFutronicStatus(data);
            }).fail(function() {
                if (futronicCaptureArmed && futronicBusy) {
                    setFutronicPhase("error", "The scanner is unavailable. Check that the FS64 is plugged in. You can use SMS OTP instead.");
                }
            });
        }, 500);
    };

    var applyFutronicStatus = function(data) {
        if (!data || !futronicBusy) {
            return;
        }
        var capture = typeof data.capture === "number" ? data.capture : null;
        if (!futronicCaptureArmed) {
            if (capture !== null) {
                futronicCaptureSeen = capture;
            }
            return;
        }
        if (!futronicUseCaptureGeneration || capture === null) {
            setFutronicPhase(data.phase, data.message);
            return;
        }
        if (futronicCaptureActive === null) {
            if (futronicCaptureSeen === null || capture === futronicCaptureSeen) {
                if (futronicCaptureSeen === null) {
                    futronicCaptureSeen = capture;
                }
                return;
            }
            futronicCaptureActive = capture;
        }
        if (capture !== futronicCaptureActive) {
            return;
        }
        setFutronicPhase(data.phase, data.message);
    };

    var futronicPhaseCopy = function(phase) {
        var enroll = futronicPurpose !== "login";
        var captions = enroll ? {
            idle: "Ready to register",
            waiting: "Starting the scanner",
            place: "Place your finger",
            lift: "Lift your finger",
            "place-again": "Place the same finger again",
            match: "Checking both scans",
            done: "Fingerprint captured",
            error: "Registration did not finish"
        } : {
            idle: "Ready to sign in",
            waiting: "Starting the scanner",
            place: "Place your registered finger",
            lift: "Lift your finger",
            "place-again": "Place the same finger again",
            match: "Checking your fingerprint",
            done: "Fingerprint matched",
            error: "Sign-in did not finish"
        };
        var counts = {
            idle: "",
            waiting: "",
            place: enroll ? "Scan 1 of 2" : "One scan",
            lift: enroll ? "Scan 1 of 2" : "",
            "place-again": "Scan 2 of 2",
            match: enroll ? "Scan 2 of 2" : "One scan",
            done: enroll ? "Both scans accepted" : "Scan accepted",
            error: ""
        };
        return {
            caption: captions[phase] || captions.idle,
            count: counts[phase] || ""
        };
    };

    var announceFutronic = function(announcement) {
        if (announcement === futronicAnnouncement) {
            return;
        }
        futronicAnnouncement = announcement;
        var node = document.getElementById("futronicLive");
        if (!node) {
            return;
        }
        node.textContent = "";
        if (futronicAnnounceTimer) {
            clearTimeout(futronicAnnounceTimer);
        }
        futronicAnnounceTimer = setTimeout(function() {
            node.textContent = announcement;
        }, 50);
    };

    var setFutronicPhase = function(phase, message) {
        var known = {
            idle: true,
            waiting: true,
            place: true,
            lift: true,
            "place-again": true,
            match: true,
            done: true,
            error: true
        };
        if (!known[phase]) {
            phase = "idle";
        }
        if (futronicBusy && phase === "idle") {
            phase = "waiting";
            if (!message || message === "Ready.") {
                message = "Starting the scanner. Keep your finger off the glass until it says to place it.";
            }
        }
        var copy = futronicPhaseCopy(phase);
        var detail = message || "";
        var announcement = copy.caption;
        if (copy.count) {
            announcement += ". " + copy.count;
        }
        if (detail) {
            announcement += ". " + detail;
        }
        var tone = {
            idle: "alert-info",
            waiting: "alert-info",
            place: "alert-info",
            lift: "alert-warning",
            "place-again": "alert-info",
            match: "alert-info",
            done: "alert-success",
            error: "alert-danger"
        };
        var $visual = $("#futronicVisual");
        if ($visual.attr("data-phase") !== phase) {
            $visual.attr("data-phase", phase);
        }
        if ($visual.attr("data-purpose") !== futronicPurpose) {
            $visual.attr("data-purpose", futronicPurpose);
        }
        if ($("#futronicVisualCaption").text() !== copy.caption) {
            $("#futronicVisualCaption").text(copy.caption);
        }
        var $count = $("#futronicScanCount");
        if ($count.text() !== copy.count) {
            $count.text(copy.count);
        }
        $count.toggleClass("hidden", !copy.count);
        var $status = $("#futronicStatus");
        if (phase === "error" || phase === "done") {
            $status.addClass("hidden").text("");
        } else {
            $status.removeClass("hidden");
            if (detail && $status.text() !== detail) {
                $status.text(detail);
            }
        }
        $status
            .removeClass("alert-info alert-warning alert-success alert-danger")
            .addClass(tone[phase] || "alert-info");
        announceFutronic(announcement);
    };

    var syncFutronicOther = function() {
        if (futronicFailCount >= 5) {
            $("#btnFutronicOther").removeClass("hidden");
        } else {
            $("#btnFutronicOther").addClass("hidden");
        }
    };

    var clearFutronicRetry = function() {
        if (futronicRetryTimer) {
            clearTimeout(futronicRetryTimer);
            futronicRetryTimer = null;
        }
    };

    var abandonFutronic = function() {
        futronicGeneration += 1;
        clearFutronicRetry();
        endFutronicAttempt();
    };

    var scheduleFutronicRetry = function() {
        clearFutronicRetry();
        var mark = futronicGeneration;
        futronicRetryTimer = setTimeout(function() {
            futronicRetryTimer = null;
            if (mark !== futronicGeneration || $("#divSfFutronic").hasClass("hidden")) {
                return;
            }
            runFutronic();
        }, 2000);
    };

    var futronicNote = function() {
        $("#divSfAlert").addClass("hidden").text("");
        setFutronicPhase("error", "");
        futronicFailCount += 1;
        syncFutronicOther();
        scheduleFutronicRetry();
    };

    var showFutronicPurpose = function(enrolling) {
        $("#btnFutronicStart").addClass("hidden");
        if (!enrolling) {
            futronicPurpose = "login";
            $("#futronicTitle").text("Confirm your fingerprint");
            $("#futronicLead").text("The scanner is ready. Place the finger you already registered. Sign-in continues when it matches.");
            $("#futronicStep1").html("<strong>1.</strong> When it says place your finger, put that same finger flat on the glass.");
            $("#futronicStep2").addClass("hidden");
            return;
        }
        futronicPurpose = "enroll";
        $("#futronicTitle").text("Register your fingerprint");
        $("#futronicLead").text("The scanner is ready. Registration uses two scans of the same finger. A fingerprint saved in Windows Hello is not used.");
        $("#futronicStep1").html("<strong>1.</strong> When it says place your finger, put one finger flat on the glass and hold still.");
        $("#futronicStep2").removeClass("hidden").html("<strong>2.</strong> When it says lift, take that finger off. Place the same finger again when it asks.");
    };

    var openFutronicPanel = function() {
        var enrolled = factorStatus.methods && factorStatus.methods.fingerprint_futronic;
        hideSfPanels();
        $("#divSfAlert").addClass("hidden").text("");
        $("#divSfFutronic").removeClass("hidden");
        openSecondFactorModal();
        futronicAnnouncement = "";
        showFutronicPurpose(!enrolled);
        syncFutronicOther();
        setFutronicPhase("waiting", "Starting the scanner. Keep your finger off the glass until it says to place it.");
        runFutronic();
    };

    var finishFutronic = function(verified, generation) {
        if (generation !== futronicGeneration) {
            return;
        }
        if (verified.status === 'SUCCESS') {
            if (!factorStatus.methods) {
                factorStatus.methods = {};
            }
            factorStatus.methods.fingerprint_futronic = true;
            clearFutronicRetry();
            $("#divSfAlert").addClass("hidden").text("");
            setFutronicPhase("done", "");
            var mark = futronicGeneration;
            setTimeout(function() {
                if (mark !== futronicGeneration) {
                    return;
                }
                finishSession(pendingLogin, "#divSfSuccess");
            }, 900);
            return;
        }
        futronicNote();
    };

    var endFutronicAttempt = function() {
        futronicBusy = false;
        resetFutronicCaptureWatch();
        stopFutronicPoll();
        $("#btnFutronicStart").prop("disabled", false);
        applyDeviceState();
    };

    var runFutronic = function() {
        if (!pendingLogin || futronicBusy) {
            return;
        }
        clearFutronicRetry();
        var generation = ++futronicGeneration;
        launchFutronicHelper();
        $("#divSfAlert").addClass("hidden").text("");
        $("#btnFutronicStart").addClass("hidden").prop("disabled", true);
        futronicBusy = true;
        resetFutronicCaptureWatch();
        setFutronicPhase("waiting", "Starting the scanner. Keep your finger off the glass until it says to place it.");
        startFutronicPoll();
        applyDeviceState();
        var startScan = function() {
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/futronicOptions', JSON.stringify({
            TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN
        })).done(function(result) {
            if (generation !== futronicGeneration) {
                return;
            }
            if (!result || result.status === 'ERROR' || result.locked || result.status !== 'SUCCESS' || !result.payload || !result.payload.challenge) {
                endFutronicAttempt();
                futronicNote();
                return;
            }
            var enrolling = result.payload.purpose !== 'login';
            showFutronicPurpose(enrolling);
            if (($("#futronicVisual").attr("data-phase") || "") === "waiting") {
                setFutronicPhase("waiting", "Starting the scanner. Keep your finger off the glass until it says to place it.");
            }
            var agentBody = { challenge: result.payload.challenge };
            var agentPath = "/enroll";
            if (!enrolling) {
                agentBody.template = result.payload.template;
                agentPath = "/verify";
            }
            var sendAgent = function() {
                futronicCaptureActive = null;
                futronicCaptureArmed = true;
                $.ajax({
                url: FUTRONIC_AGENT + agentPath,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(agentBody),
                dataType: "json",
                timeout: 120000
            }).done(function(scan) {
                if (generation !== futronicGeneration) {
                    return;
                }
                var verifyPath = enrolling
                    ? '/ppa-api-uams/wsv1/api/futronicEnroll'
                    : '/ppa-api-uams/wsv1/api/futronicVerify';
                var body = {
                    TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                    challenge: result.payload.challenge,
                    mac: scan.mac
                };
                if (enrolling) {
                    body.template = scan.template;
                    body.finger = scan.finger || 0;
                } else {
                    body.match = scan.match === true;
                }
                $.wms.executeExternalPost(verifyPath, JSON.stringify(body)).done(function(verified) {
                    if (generation !== futronicGeneration) {
                        return;
                    }
                    endFutronicAttempt();
                    if (!verified || verified.status === 'ERROR') {
                        futronicNote();
                        return;
                    }
                    finishFutronic(verified, generation);
                });
            }).fail(function() {
                if (generation !== futronicGeneration) {
                    return;
                }
                endFutronicAttempt();
                futronicNote();
            });
            };
            $.ajax({
                url: FUTRONIC_AGENT + "/status",
                method: "GET",
                dataType: "json",
                timeout: 1500
            }).done(function(data) {
                if (data && typeof data.capture === "number") {
                    futronicCaptureSeen = data.capture;
                    futronicUseCaptureGeneration = true;
                } else {
                    futronicUseCaptureGeneration = false;
                }
            }).fail(function() {
                futronicUseCaptureGeneration = false;
            }).always(function() {
                if (generation !== futronicGeneration || !futronicBusy) {
                    return;
                }
                sendAgent();
            });
        });
        };
        waitForFutronic(12).done(function(data) {
            if (generation !== futronicGeneration || !futronicBusy) {
                return;
            }
            if (!data || data.scannerOpen !== true || data.hmacConfigured !== true) {
                endFutronicAttempt();
                futronicNote();
                return;
            }
            startScan();
        }).fail(function() {
            if (generation !== futronicGeneration || !futronicBusy) {
                return;
            }
            endFutronicAttempt();
            futronicNote();
        });
    };

    var sendSmsOtp = function(result) {
        OTP_KEY = Math.floor(Math.random()*90000) + 10000;
        $("#otpkeygen").val(OTP_KEY);
        var myDate = new Date();
        var dt = (myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds());
        var payload3  = {
            api_key : "75244494920210907035428",
            message_CONTENT : "Hi " + result.payload.USER_FULLNAME + ", your OTP KEY is " + $("#otpkeygen").val() +".",
            message_TO : result.payload.USER_CONTACT,
            CREATED_BY : "1",
            message_DATETIME : dt
        };
        $.wms.executeExternalPost('https://otp.probation.gov.ph/ppa-api-uams/wsv1/api/insertSMSManually', JSON.stringify(payload3));
        return dt;
    };

    var openSmsOtp = function() {
        if (!pendingLogin) {
            return;
        }
        shutdownFutronic();
        stopFacePreview();
        var dt = sendSmsOtp(pendingLogin);
        hideSfPanels();
        $("#divLoginOTP").removeClass("hidden");
        openSecondFactorModal();
        $("#divOtpEnter").removeClass("hidden");
        $("#divOtpSuccess").addClass("hidden");

        $("#btnResendOtp").unbind("click").on("click", function(){
            $("#btnResendOtp").addClass("hidden");
            sendSmsOtp(pendingLogin);
            setTimeout(function(){
                $("#btnResendOtp").removeClass("hidden");
            }, 60*1000*5);
        });

        setTimeout(function(){
            $("#btnResendOtp").removeClass("hidden");
        }, 60*1000*5);

        $("#btnLoginOtp").unbind("click").on("click", function(){
            if($("#txtLoginOtp").val() == $("#otpkeygen").val()){
                $("#divOtpEnter").addClass("hidden");
                finishSession(pendingLogin, "#divOtpSuccess");
            }else{
                alert("Invalid OTP");
            }
        });
        return dt;
    };

    var pinPadTarget = null;
    var pinPadPointerDown = false;

    var hidePinNumpad = function() {
        pinPadTarget = null;
        $("#pinNumpad").addClass("hidden");
    };

    var showPinNumpad = function(input) {
        pinPadTarget = input;
        $("#pinNumpad").insertAfter($(input).closest(".input-group")).removeClass("hidden");
    };

    var pinVerifySerial = 0;

    var submitEnteredPin = function() {
        var serial = ++pinVerifySerial;
        var input = document.getElementById("txtPin");
        if (!input || $("#pinEnter").hasClass("hidden")) {
            return;
        }
        var pin = input.value || "";
        if (pin.length === 1) {
            $("#divSfAlert").addClass("hidden").text("");
            $("#divPinInfo").removeClass("hidden");
        }
        if (!pendingLogin || !pendingLogin.payload || !/^[0-9]{4}$/.test(pin)) {
            return;
        }
        $("#divSfAlert").addClass("hidden").text("");
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/pinVerify', JSON.stringify({
            TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
            PIN: pin
        })).done(function(result) {
            if (serial !== pinVerifySerial) {
                return;
            }
            if (result && result.status === "SUCCESS") {
                finishSession(pendingLogin, "#divSfSuccess");
                return;
            }
            if ((document.getElementById("txtPin").value || "") !== pin) {
                return;
            }
            $("#txtPin").val("");
            $("#divPinInfo").addClass("hidden");
            showSfAlert((result && result.message ? result.message : "Invalid PIN.") + " You can try again or use SMS OTP.");
        });
    };

    var openPin = function() {
        stopFacePreview();
        hidePinNumpad();
        hideSfPanels();
        $("#divSfPin").removeClass("hidden");
        openSecondFactorModal();
        $("#pinEnter,#pinSetup,#pinChange").addClass("hidden");
        $("#divSfAlert").addClass("hidden").text("");
        $("#divPinInfo").removeClass("hidden");
        if (factorStatus.pin_set) {
            $("#divPinInfo").text("Enter your PIN code. SMS OTP stays available if this fails.");
            $("#pinEnter").removeClass("hidden");
        } else {
            $("#divPinInfo").text("No PIN is set up yet. Create a 4 digit PIN, or use SMS OTP.");
            $("#pinSetup").removeClass("hidden");
        }
    };

    var prepareFaceCameras = function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            devices.builtinCams = [];
            devices.externalCams = [];
            devices.noCamera = true;
            showFactorHome();
            showSfAlert("No camera was found, so Face ID is disabled. Use SMS OTP.");
            return;
        }
        navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function(stream) {
            stream.getTracks().forEach(function(track) { track.stop(); });
            return navigator.mediaDevices.enumerateDevices();
        }).then(function(list) {
            var cameras = (list || []).filter(function(device) {
                return device.kind === 'videoinput';
            });
            classifyCameras(cameras);
            if (cameras.length === 0) {
                devices.noCamera = true;
                showFactorHome();
                showSfAlert("No built-in camera or webcam was found, so Face ID is disabled. Use SMS OTP.");
                return;
            }
            hideSfPanels();
            $("#divSfFace").removeClass("hidden");
            openSecondFactorModal();
            $("#btnFaceBuiltin").prop("disabled", devices.builtinCams.length === 0);
            $("#btnFaceWebcam").prop("disabled", devices.externalCams.length === 0);
            $("#faceHint").addClass("hidden").text("");
        }).catch(function() {
            showFactorHome();
            showSfAlert("Camera access was blocked, so Face ID cannot start. Allow the camera, or use SMS OTP.");
        });
    };

    var startFacePreview = function(group, method) {
        var cams = group === 'builtin' ? devices.builtinCams : devices.externalCams;
        if (!cams.length) {
            return;
        }
        faceSelection = { method: method, cams: cams, deviceId: cams[0].deviceId, label: cams[0].label || method };
        var select = $("#selFaceCamera");
        select.empty();
        if (cams.length > 1) {
            cams.forEach(function(camera, index) {
                select.append($('<option></option>').val(camera.deviceId).text(camera.label || ('Camera ' + (index + 1))));
            });
            select.removeClass("hidden");
        } else {
            select.addClass("hidden");
        }
        var enrolled = factorStatus.methods && factorStatus.methods[method];
        showFaceGuide(enrolled);
        faceLocked = false;
        faceStableCount = 0;
        facePreviousRaw = null;
        faceRetryAt = 0;
        faceServerMessage = "";
        if (enrolled) {
            $("#btnFaceContinue").addClass("hidden");
            $("#faceHint").removeClass("hidden").text("Center your face in the guide.");
        } else {
            $("#btnFaceContinue").removeClass("hidden").text("Save Face ID").prop("disabled", true);
            $("#faceHint").removeClass("hidden").text("Center your face in the guide.");
        }
        openPreview(faceSelection.deviceId);
    };

    var captureFaceSample = function(video) {
        if (!video || !video.videoWidth || video.readyState < 2) {
            return { issue: "Center your face in the guide." };
        }
        var width = 160;
        var height = 120;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
        var pixels = context.getImageData(0, 0, width, height).data;
        var skin = new Uint8Array(width * height);
        var skinCount = 0;
        var lumaSum = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var offset = (y * width + x) * 4;
                var red = pixels[offset];
                var green = pixels[offset + 1];
                var blue = pixels[offset + 2];
                lumaSum += red * 0.299 + green * 0.587 + blue * 0.114;
                var cb = 128 - 0.168736 * red - 0.331264 * green + 0.5 * blue;
                var cr = 128 + 0.5 * red - 0.418688 * green - 0.081312 * blue;
                if (cr > 133 && cr < 173 && cb > 77 && cb < 127 && red > 60 && green > 40 && red > green && red > blue) {
                    skin[y * width + x] = 1;
                    skinCount++;
                }
            }
        }
        if (skinCount < width * height * 0.008) {
            if (lumaSum / (width * height) < 55) {
                return { issue: "The light is too low. Face a lamp or a window." };
            }
            return { issue: "Center your face in the guide." };
        }
        var seen = new Uint8Array(width * height);
        var best = null;
        var stack = [];
        for (var index = 0; index < skin.length; index++) {
            if (!skin[index] || seen[index]) {
                continue;
            }
            var minX = width;
            var minY = height;
            var maxX = 0;
            var maxY = 0;
            var area = 0;
            stack.push(index);
            seen[index] = 1;
            while (stack.length) {
                var current = stack.pop();
                var cx = current % width;
                var cy = (current - cx) / width;
                area++;
                if (cx < minX) { minX = cx; }
                if (cy < minY) { minY = cy; }
                if (cx > maxX) { maxX = cx; }
                if (cy > maxY) { maxY = cy; }
                var neighbors = [current - 1, current + 1, current - width, current + width];
                for (var n = 0; n < neighbors.length; n++) {
                    var next = neighbors[n];
                    if (next < 0 || next >= skin.length || seen[next] || !skin[next]) {
                        continue;
                    }
                    if ((n < 2) && (Math.floor(next / width) !== cy)) {
                        continue;
                    }
                    seen[next] = 1;
                    stack.push(next);
                }
            }
            if (!best || area > best.area) {
                best = { minX: minX, minY: minY, maxX: maxX, maxY: maxY, area: area };
            }
        }
        if (!best || best.area < 80) {
            return { issue: "Center your face in the guide." };
        }
        var boxWidth = best.maxX - best.minX + 1;
        var boxHeight = best.maxY - best.minY + 1;
        if (boxWidth < 18 || boxHeight < 18) {
            return { issue: "Move closer to the camera." };
        }
        var centerX = (best.minX + best.maxX) / 2;
        var centerY = (best.minY + best.maxY) / 2;
        var qualityIssue = faceQualityIssue(pixels, skin, width, best, boxWidth, boxHeight, centerX, centerY);
        if (qualityIssue) {
            return { issue: qualityIssue };
        }
        var size = Math.max(boxWidth, boxHeight);
        var left = Math.round(centerX - size / 2);
        var top = Math.round(centerY - size / 2);
        if (left < 0) { left = 0; }
        if (top < 0) { top = 0; }
        if (left + size > width) { left = Math.max(0, width - size); }
        if (top + size > height) { top = Math.max(0, height - size); }
        var sample = [];
        var raw = [];
        var total = 0;
        var cells = 16;
        for (var gy = 0; gy < cells; gy++) {
            for (var gx = 0; gx < cells; gx++) {
                var sx = Math.min(width - 1, Math.floor(left + (gx + 0.5) * size / cells));
                var sy = Math.min(height - 1, Math.floor(top + (gy + 0.5) * size / cells));
                var pixel = (sy * width + sx) * 4;
                var gray = pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114;
                raw.push(gray);
                sample.push(gray);
                total += gray;
            }
        }
        var mean = total / sample.length;
        var variance = 0;
        for (var s = 0; s < sample.length; s++) {
            var delta = sample[s] - mean;
            variance += delta * delta;
        }
        var spread = Math.sqrt(variance / sample.length) || 1;
        var length = 0;
        for (var s = 0; s < sample.length; s++) {
            sample[s] = (sample[s] - mean) / spread;
            length += sample[s] * sample[s];
        }
        length = Math.sqrt(length) || 1;
        for (var s = 0; s < sample.length; s++) {
            sample[s] = Math.round((sample[s] / length) * 10000) / 10000;
        }
        return { sample: sample, raw: raw, issue: null };
    };

    var faceQualityIssue = function(pixels, skin, width, best, boxWidth, boxHeight, centerX, centerY) {
        var grayAt = function(x, y) {
            var pixel = (y * width + x) * 4;
            return pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114;
        };
        var midX = centerX;
        var eyeY0 = best.minY + boxHeight * 0.18;
        var eyeY1 = best.minY + boxHeight * 0.42;
        var cheekY0 = best.minY + boxHeight * 0.55;
        var cheekY1 = best.minY + boxHeight * 0.82;
        var eyeLX0 = best.minX + boxWidth * 0.12;
        var eyeLX1 = best.minX + boxWidth * 0.42;
        var eyeRX0 = best.minX + boxWidth * 0.58;
        var eyeRX1 = best.minX + boxWidth * 0.88;
        var boxGray = 0;
        var boxCount = 0;
        var lapSum = 0;
        var lapCount = 0;
        var leftSkin = 0;
        var rightSkin = 0;
        var leftCount = 0;
        var rightCount = 0;
        var eyeLeftSkin = 0;
        var eyeLeftCount = 0;
        var eyeLeftGray = 0;
        var eyeRightSkin = 0;
        var eyeRightCount = 0;
        var eyeRightGray = 0;
        var cheekSkin = 0;
        var cheekCount = 0;
        var cheekGray = 0;
        for (var y = best.minY; y <= best.maxY; y++) {
            for (var x = best.minX; x <= best.maxX; x++) {
                var gray = grayAt(x, y);
                var isSkin = skin[y * width + x] === 1;
                boxGray += gray;
                boxCount++;
                if (x < midX) {
                    leftCount++;
                    if (isSkin) { leftSkin++; }
                } else {
                    rightCount++;
                    if (isSkin) { rightSkin++; }
                }
                if (y >= eyeY0 && y <= eyeY1 && x >= eyeLX0 && x <= eyeLX1) {
                    eyeLeftCount++;
                    eyeLeftGray += gray;
                    if (isSkin) { eyeLeftSkin++; }
                }
                if (y >= eyeY0 && y <= eyeY1 && x >= eyeRX0 && x <= eyeRX1) {
                    eyeRightCount++;
                    eyeRightGray += gray;
                    if (isSkin) { eyeRightSkin++; }
                }
                if (y >= cheekY0 && y <= cheekY1 && x >= eyeLX0 && x <= eyeRX1) {
                    cheekCount++;
                    cheekGray += gray;
                    if (isSkin) { cheekSkin++; }
                }
                if (x > best.minX && x < best.maxX && y > best.minY && y < best.maxY) {
                    var lap = Math.abs((4 * gray) - grayAt(x - 1, y) - grayAt(x + 1, y) - grayAt(x, y - 1) - grayAt(x, y + 1));
                    lapSum += lap;
                    lapCount++;
                }
            }
        }
        if (boxWidth >= 34 && boxHeight >= 40 && eyeLeftCount > 8 && eyeRightCount > 8 && cheekCount > 8) {
            var eyeLeftRatio = eyeLeftSkin / eyeLeftCount;
            var eyeRightRatio = eyeRightSkin / eyeRightCount;
            var cheekRatio = cheekSkin / cheekCount;
            var eyeLeftMean = eyeLeftGray / eyeLeftCount;
            var eyeRightMean = eyeRightGray / eyeRightCount;
            var cheekMean = cheekGray / cheekCount;
            if (eyeLeftRatio < 0.75 && eyeRightRatio < 0.75 && cheekRatio > 0.45 && cheekMean - eyeLeftMean > 30 && cheekMean - eyeRightMean > 30) {
                return "Sunglasses are covering your eyes. Remove them, or use SMS OTP or your PIN.";
            }
        }
        if (boxWidth < 34 || boxHeight < 40) {
            return "Move closer to the camera.";
        }
        if (boxWidth > 148 || boxHeight > 112) {
            return "Move back from the camera.";
        }
        if (Math.abs(centerX - 80) > 26 || Math.abs(centerY - 56) > 22) {
            return "Center your face in the guide.";
        }
        var mean = boxCount ? boxGray / boxCount : 0;
        if (mean < 52) {
            return "The light is too low. Face a lamp or a window.";
        }
        if (mean > 212) {
            return "The light is too strong. Turn slightly away from the glare.";
        }
        var sharpness = lapCount ? lapSum / lapCount : 0;
        if (sharpness < 8) {
            return "The image is blurry. Hold still and face the camera.";
        }
        var leftRatio = leftCount ? leftSkin / leftCount : 0;
        var rightRatio = rightCount ? rightSkin / rightCount : 0;
        var balance = leftRatio / (rightRatio || 0.001);
        if (leftRatio + rightRatio > 0.3 && (balance < 0.45 || balance > 2.2)) {
            return "Turn your face toward the camera.";
        }
        return null;
    };

    var faceIsEnrolled = function() {
        return !!(faceSelection && factorStatus.methods && factorStatus.methods[faceSelection.method]);
    };

    var pauseFaceForLock = function(message) {
        faceLocked = true;
        stopFacePreview();
        $("#faceHint").removeClass("hidden").text(message || "Face ID is paused after 5 tries. Use SMS OTP or your PIN.");
    };

    var submitMatchedFace = function(sample) {
        if (!faceSelection || !pendingLogin || faceCheckBusy || faceLocked || !faceIsEnrolled()) {
            return;
        }
        faceCheckBusy = true;
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/faceVerify', JSON.stringify({
            TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
            METHOD: faceSelection.method,
            EMBEDDING: sample,
            DEVICE_LABEL: faceSelection.label || ''
        })).done(function(result) {
            if (result.status === 'SUCCESS') {
                stopFacePreview();
                factorStatus.methods[faceSelection.method] = true;
                finishSession(pendingLogin, "#divSfSuccess");
                return;
            }
            faceCheckBusy = false;
            if (result.status === 'ERROR') {
                setFacePrompt("The face check could not be sent. Try again, or use SMS OTP or your PIN.", false);
                return;
            }
            if (result.locked) {
                pauseFaceForLock(result.message);
                return;
            }
            faceStableCount = 0;
            faceRetryAt = Date.now() + 1600;
            faceServerMessage = result.message || "Face did not match. Adjust your position in the guide, or use SMS OTP or your PIN.";
            if (result.mismatch) {
                paintFaceMismatch(result.mismatch);
            }
            $("#faceOval").removeClass("ready");
            $("#faceHint").removeClass("hidden").text(faceServerMessage);
        });
    };

    var submitEnrollment = function(samples) {
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/faceRegister', JSON.stringify({
            TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
            METHOD: faceSelection.method,
            EMBEDDING: samples,
            DEVICE_LABEL: faceSelection.label || ''
        })).done(function(result) {
            faceCollecting = false;
            if (result.status === 'SUCCESS') {
                stopFacePreview();
                factorStatus.methods[faceSelection.method] = true;
                finishSession(pendingLogin, "#divSfSuccess");
                return;
            }
            faceStableCount = 0;
            if (result.status === 'ERROR') {
                setFacePrompt("Face ID could not be saved. Try again, or use SMS OTP or your PIN.", false);
            } else {
                setFacePrompt(result.message || "Face ID was not saved. Hold still and try again.", false);
            }
            startFaceGuide();
        });
    };

    var collectFaceSamples = function() {
        var samples = [];
        var previous = null;
        faceCollecting = true;
        $("#btnFaceContinue").prop("disabled", true);
        var take = function() {
            if (faceLocked || !faceSelection) {
                faceCollecting = false;
                return;
            }
            var reading = captureFaceSample(document.getElementById('facePreview'));
            if (!reading || reading.issue || !reading.sample) {
                faceCollecting = false;
                faceStableCount = 0;
                setFacePrompt(reading && reading.issue ? reading.issue : "Center your face in the guide.", false);
                startFaceGuide();
                return;
            }
            if (previous && faceMovement(previous, reading.raw) > 16) {
                faceCollecting = false;
                faceStableCount = 0;
                setFacePrompt("Hold still.", false);
                startFaceGuide();
                return;
            }
            previous = reading.raw;
            samples.push(reading.sample);
            if (samples.length >= 3) {
                setFacePrompt("Checking the three samples.", true);
                submitEnrollment(samples);
                return;
            }
            setFacePrompt("Saved sample " + samples.length + " of 3. Hold still.", true);
            faceCollectTimer = setTimeout(take, 700);
        };
        take();
    };

    var tickFaceGuide = function() {
        if (faceCollecting || faceCheckBusy || faceLocked || !faceSelection) {
            return;
        }
        if (Date.now() < faceRetryAt) {
            $("#faceOval").removeClass("ready");
            $("#faceHint").removeClass("hidden").text(faceServerMessage);
            return;
        }
        var reading = captureFaceSample(document.getElementById('facePreview'));
        if (!reading || reading.issue || !reading.sample) {
            faceStableCount = 0;
            facePreviousRaw = null;
            $("#faceGrid").removeClass("on");
            setFacePrompt(reading && reading.issue ? reading.issue : "Center your face in the guide.", false);
            return;
        }
        if (facePreviousRaw && faceMovement(facePreviousRaw, reading.raw) > 16) {
            faceStableCount = 0;
            facePreviousRaw = reading.raw;
            setFacePrompt("Hold still.", false);
            return;
        }
        facePreviousRaw = reading.raw;
        faceStableCount++;
        if (faceStableCount < 2) {
            setFacePrompt("Hold still.", false);
            return;
        }
        if (faceIsEnrolled()) {
            setFacePrompt("Hold still. Checking your face.", true);
            submitMatchedFace(reading.sample);
            return;
        }
        setFacePrompt("Ready. Choose Save Face ID and hold still.", true);
    };

    var startFaceGuide = function() {
        if (faceWatch) {
            clearInterval(faceWatch);
            faceWatch = null;
        }
        if (faceLocked) {
            setFacePrompt("Face ID is paused after 5 tries. Use SMS OTP or your PIN.", false);
            return;
        }
        faceWatch = setInterval(tickFaceGuide, 400);
    };

    var openPreview = function(deviceId) {
        stopFacePreview();
        faceStableCount = 0;
        facePreviousRaw = null;
        var constraints = { video: deviceId ? { deviceId: { exact: deviceId } } : true, audio: false };
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            faceStream = stream;
            var video = document.getElementById('facePreview');
            video.srcObject = stream;
            showFaceGuide(faceIsEnrolled());
            startFaceGuide();
        }).catch(function() {
            showSfAlert("That camera could not be opened. Pick another one or use SMS OTP.");
        });
    };

    var __attachLoginEvent = function() {
        
        $("#divLoading").addClass("hidden");
        $("#divLogin").fadeIn();


        $("#txtUsername").focus();
        $.wms.dashboard.navHighlight();
        $("#txtUsername,#txtPassword").keyup(function(event){
            if(event.keyCode == 13){
                $("#btnLogin").click();
            }
        });

        $("#btnSfClose").on("click", closeSecondFactorModal);
        $("#btnSfFingerprint").on("click", function(){
            if ($(this).prop("disabled")) {
                return;
            }
            $("#divSfAlert").addClass("hidden").text("");
            $("#fpHint").removeClass("hidden");
            hideSfPanels();
            $("#divSfFingerprint").removeClass("hidden");
            openSecondFactorModal();
            devices.futronic = false;
            $("#btnFpFutronic").prop("disabled", true);
            var builtinLabel = devices.secure && devices.platform ? "available, " + methodLabel('fingerprint_builtin') : "not available";
            $("#fpHint").text("Built-in uses the fingerprint already saved in Windows Hello (" + builtinLabel + "). Checking the Futronic FS64.");
            launchFutronicHelper();
            waitForFutronic(12).always(function() {
                applyDeviceState();
                var futronicText = devices.futronic
                    ? "is connected (" + methodLabel("fingerprint_futronic") + ")."
                    : (devices.futronicMessage || "was not detected, so that choice stays off.");
                $("#fpHint").text("Built-in uses the fingerprint already saved in Windows Hello (" + builtinLabel + "). Futronic FS64 " + futronicText);
            });
        });
        $("#btnFpBack,#btnFaceBack,#btnPinBack").on("click", function(){
            showFactorHome();
        });
        $("#btnFutronicBack").on("click", function(){
            if (futronicBusy) {
                return;
            }
            abandonFutronic();
            shutdownFutronic();
            hideSfPanels();
            $("#divSfAlert").addClass("hidden").text("");
            $("#divSfFingerprint").removeClass("hidden");
        });
        $("#btnFutronicOther").on("click", function(){
            showFactorHome();
        });
        $("#btnFpBuiltin").on("click", function(){
            $("#divSfAlert").addClass("hidden").text("");
            $("#fpHint").removeClass("hidden");
            runWebAuthn('fingerprint_builtin', 'Built-in fingerprint scanner');
        });
        $("#btnFpFutronic").on("click", function(){
            if ($(this).prop("disabled")) {
                return;
            }
            openFutronicPanel();
        });
        $("#btnFutronicStart").on("click", function(){
            runFutronic();
        });
        $("#btnSfFace").on("click", function(){
            if ($(this).prop("disabled")) {
                return;
            }
            prepareFaceCameras();
        });
        $("#btnFaceBuiltin").on("click", function(){
            startFacePreview('builtin', 'face_builtin');
        });
        $("#btnFaceWebcam").on("click", function(){
            startFacePreview('webcam', 'face_webcam');
        });
        $("#selFaceCamera").on("change", function(){
            if (!faceSelection) {
                return;
            }
            faceSelection.deviceId = $(this).val();
            var match = faceSelection.cams.filter(function(camera) {
                return camera.deviceId === faceSelection.deviceId;
            })[0];
            faceSelection.label = match && match.label ? match.label : faceSelection.method;
            openPreview(faceSelection.deviceId);
        });
        $("#btnFaceContinue").on("click", function(){
            if (!faceSelection || !pendingLogin || faceCollecting || faceLocked || faceIsEnrolled()) {
                return;
            }
            if ($(this).prop("disabled")) {
                return;
            }
            collectFaceSamples();
        });
        $("#btnSfPin").on("click", openPin);
        $("#divSfPin").on("mousedown", ".input-group", function() {
            pinPadPointerDown = true;
        });
        $("#divSfPin").on("focusin", "input", function() {
            if (pinPadPointerDown) {
                return;
            }
            showPinNumpad(this);
        });
        $("#divSfPin").on("click", ".input-group", function() {
            var input = $(this).find("input").get(0);
            pinPadPointerDown = false;
            if (!input) {
                return;
            }
            showPinNumpad(input);
        });
        $("#pinNumpad").on("mousedown", ".pin-key", function(event) {
            event.preventDefault();
            if (!pinPadTarget) {
                return;
            }
            var max = parseInt(pinPadTarget.getAttribute("maxlength"), 10) || 4;
            var value = (pinPadTarget.value || "").replace(/\D/g, "");
            if ($(this).data("action") === "back") {
                pinPadTarget.value = value.slice(0, -1);
                if (pinPadTarget.id === "txtPin") {
                    submitEnteredPin();
                }
                return;
            }
            var digit = $(this).data("digit");
            if (digit === undefined || !/^\d$/.test(String(digit)) || value.length >= max) {
                return;
            }
            pinPadTarget.value = value + String(digit);
            if (pinPadTarget.id === "txtPin") {
                submitEnteredPin();
            }
        });
        $(document).on("mouseup", function() {
            pinPadPointerDown = false;
        });
        $(document).on("click", function(event) {
            if ($(event.target).closest("#pinNumpad, #divSfPin .input-group").length) {
                return;
            }
            hidePinNumpad();
        });
        $("#btnPinChangeShow").on("click", function(){
            hidePinNumpad();
            $("#divSfAlert").addClass("hidden").text("");
            $("#divPinInfo").removeClass("hidden");
            $("#pinEnter,#pinSetup").addClass("hidden");
            $("#pinChange").removeClass("hidden");
            $("#divPinInfo").text("Enter the current PIN, then the new PIN.");
        });
        $("#txtPin").on("input", function() {
            var cleaned = (this.value || "").replace(/\D/g, "").slice(0, 4);
            if (cleaned !== this.value) {
                this.value = cleaned;
            }
            submitEnteredPin();
        });
        $("#btnPinSave").on("click", function(){
            if (!/^[0-9]{4}$/.test($("#txtPinNew").val()) || $("#txtPinNew").val() !== $("#txtPinConfirm").val()) {
                $("#divPinInfo").text($("#txtPinNew").val() !== $("#txtPinConfirm").val() ? "The PIN confirmation does not match." : "PIN must be 4 digits.");
                return;
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/pinSet', JSON.stringify({
                TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                PIN: $("#txtPinNew").val()
            })).done(function(result) {
                if (result.status === 'SUCCESS') {
                    factorStatus.pin_set = true;
                    finishSession(pendingLogin, "#divSfSuccess");
                } else {
                    $("#divPinInfo").text(result.message || 'Unable to save the PIN.');
                }
            });
        });
        $("#btnPinUpdate").on("click", function(){
            if (!/^[0-9]{4}$/.test($("#txtPinCurrent").val()) || !/^[0-9]{4}$/.test($("#txtPinChangeNew").val()) || $("#txtPinChangeNew").val() !== $("#txtPinChangeConfirm").val()) {
                $("#divPinInfo").text($("#txtPinChangeNew").val() !== $("#txtPinChangeConfirm").val() ? "The new PIN confirmation does not match." : "PIN must be 4 digits.");
                return;
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/pinChange', JSON.stringify({
                TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                CURRENT_PIN: $("#txtPinCurrent").val(),
                NEW_PIN: $("#txtPinChangeNew").val()
            })).done(function(result) {
                if (result.status === 'SUCCESS') {
                    factorStatus.pin_length = $("#txtPinChangeNew").val().length;
                    $("#txtPin,#txtPinCurrent,#txtPinChangeNew,#txtPinChangeConfirm").val("");
                    hidePinNumpad();
                    $("#divPinInfo").text("PIN updated. Enter the new PIN to continue.");
                    $("#pinChange").addClass("hidden");
                    $("#pinEnter").removeClass("hidden");
                } else {
                    $("#divPinInfo").text(result.message || 'Unable to update the PIN.');
                }
            });
        });
        $("#btnSfSms,#btnFpSms,#btnFaceSms,#btnPinSms").on("click", function(){
            openSmsOtp();
        });

        $("#btnLogin").unbind("click").on("click",function(){
            $("#divLoading").removeClass("hidden");
            //init
            $("#divAlert,#divInactive").addClass("hidden");

            var username = $("#txtUsername").val();
            var password = $("#txtPassword").val();

            var payload = {
                   USERNAME : username,
                   PASSWORD : password
            }

            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/authenticate',JSON.stringify(payload)).done(function (result) {
                $("#divLoading").addClass("hidden");
                if(result.status == 'SUCCESS'){

                    if(result.payload.USER_STATUS === '0'){
                        $("#divInactive").removeClass("hidden")
                    }else{
                        if(result.payload.USER_LEVEL_ID == 1){
                            $("#divOtpEnter").addClass("hidden");
                            finishSession(result, "#divSuccess");
                        }else{
                            pendingLogin = result;
                            futronicFailCount = 0;
                            $("#btnFutronicOther").addClass("hidden");
                            loadFactorStatus();
                            detectDevices();
                            showFactorHome();
                        }
                    }

                    
                }else{
                    $("#divAlert").removeClass("hidden");
                    $("#txtPassword").focus();
                }
            });
        });
    };



    
    return {
        attachLoginEvent : __attachLoginEvent
    };
}());
