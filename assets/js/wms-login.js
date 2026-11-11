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
    var faceCheckBusy = false;
    var FUTRONIC_VENDOR_ID = 0x1491;

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
        faceCheckBusy = false;
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
        if (enrolled) {
            ensureFaceGrid().addClass("on");
            $("#faceGuideNote").text("Fit your face inside the guide. Red marks the parts that do not match the saved Face ID.");
        } else {
            $("#faceGrid").removeClass("on").empty();
            $("#faceGuideNote").text("Fit your face inside the guide, then choose Save Face ID.");
        }
    };

    var showSfAlert = function(message) {
        $("#divSfAlert").removeClass("hidden").text(message);
    };

    var hideSfPanels = function() {
        $("#divSecondFactor,#divSfFingerprint,#divSfFace,#divSfPin,#divLoginOTP").addClass("hidden");
    };

    var openSecondFactorModal = function() {
        var modal = $("#sfModal");
        if (!modal.hasClass("in")) {
            modal.modal({ backdrop: "static", keyboard: false, show: true });
        }
    };

    var showFactorHome = function() {
        stopFacePreview();
        hideSfPanels();
        $("#divSecondFactor").removeClass("hidden");
        applyDeviceState();
        openSecondFactorModal();
    };

    var applyDeviceState = function() {
        var fingerprintAvailable = devices.platform || devices.futronic;
        $("#btnSfFingerprint").prop("disabled", !devices.secure || !fingerprintAvailable);
        var facePossible = devices.secure && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !devices.noCamera;
        $("#btnSfFace").prop("disabled", !facePossible);
        $("#btnFpBuiltin").prop("disabled", !devices.platform);
        $("#btnFpFutronic").prop("disabled", !devices.futronic);
        $("#btnFaceBuiltin").prop("disabled", devices.builtinCams.length === 0);
        $("#btnFaceWebcam").prop("disabled", devices.externalCams.length === 0);

        var notes = [];
        if (!devices.secure) {
            $("#divSfSecure").removeClass("hidden");
            notes.push("Fingerprint and Face ID are off because this page is not a secure context.");
        } else {
            $("#divSfSecure").addClass("hidden");
        }
        if (!devices.platform && !devices.futronic) {
            notes.push("No built-in fingerprint authenticator or Futronic FS64 was found, so fingerprint sign-in is disabled.");
        } else if (!devices.futronic) {
            notes.push("Futronic FS64 was not detected. Use Check for Futronic FS64 if the scanner is plugged in.");
        }
        $("#sfDeviceNote").text(notes.join(" "));
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

        if (navigator.usb && navigator.usb.getDevices) {
            jobs.push(navigator.usb.getDevices().then(function(list) {
                devices.futronic = list.some(function(device) {
                    return device.vendorId === FUTRONIC_VENDOR_ID;
                });
            }).catch(function() {
                devices.futronic = false;
            }));
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
                            residentKey: 'preferred',
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
            }).catch(function() {
                stopFacePreview();
                showFactorHome();
                showSfAlert('In the Windows passkey window, choose this computer and use the fingerprint already saved on it. A phone or a security key is not required. You can also use PIN or SMS OTP.');
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

    var openPin = function() {
        stopFacePreview();
        hideSfPanels();
        $("#divSfPin").removeClass("hidden");
        openSecondFactorModal();
        $("#pinEnter,#pinSetup,#pinChange").addClass("hidden");
        if (factorStatus.pin_set) {
            $("#divPinInfo").text("Enter your PIN code. SMS OTP stays available if this fails.");
            $("#pinEnter").removeClass("hidden");
        } else {
            $("#divPinInfo").text("No PIN is set up yet. Create a 4 to 8 digit PIN, or use SMS OTP.");
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
        if (enrolled) {
            $("#btnFaceContinue").addClass("hidden");
            $("#faceHint").removeClass("hidden").text("Look at the camera. Face ID continues automatically when your face matches.");
        } else {
            $("#btnFaceContinue").removeClass("hidden").text("Save Face ID");
            $("#faceHint").addClass("hidden").text("");
        }
        openPreview(faceSelection.deviceId);
    };

    var captureFaceSample = function(video) {
        if (!video || !video.videoWidth || video.readyState < 2) {
            return null;
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
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var offset = (y * width + x) * 4;
                var red = pixels[offset];
                var green = pixels[offset + 1];
                var blue = pixels[offset + 2];
                var cb = 128 - 0.168736 * red - 0.331264 * green + 0.5 * blue;
                var cr = 128 + 0.5 * red - 0.418688 * green - 0.081312 * blue;
                if (cr > 133 && cr < 173 && cb > 77 && cb < 127 && red > 60 && green > 40 && red > green && red > blue) {
                    skin[y * width + x] = 1;
                    skinCount++;
                }
            }
        }
        if (skinCount < width * height * 0.03) {
            return null;
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
            return null;
        }
        var boxWidth = best.maxX - best.minX + 1;
        var boxHeight = best.maxY - best.minY + 1;
        if (boxWidth < 18 || boxHeight < 18) {
            return null;
        }
        var size = Math.max(boxWidth, boxHeight);
        var centerX = (best.minX + best.maxX) / 2;
        var centerY = (best.minY + best.maxY) / 2;
        var left = Math.round(centerX - size / 2);
        var top = Math.round(centerY - size / 2);
        if (left < 0) { left = 0; }
        if (top < 0) { top = 0; }
        if (left + size > width) { left = Math.max(0, width - size); }
        if (top + size > height) { top = Math.max(0, height - size); }
        var sample = [];
        var total = 0;
        var cells = 16;
        for (var gy = 0; gy < cells; gy++) {
            for (var gx = 0; gx < cells; gx++) {
                var sx = Math.min(width - 1, Math.floor(left + (gx + 0.5) * size / cells));
                var sy = Math.min(height - 1, Math.floor(top + (gy + 0.5) * size / cells));
                var pixel = (sy * width + sx) * 4;
                var gray = pixels[pixel] * 0.299 + pixels[pixel + 1] * 0.587 + pixels[pixel + 2] * 0.114;
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
        return sample;
    };

    var submitMatchedFace = function(sample) {
        if (!faceSelection || !pendingLogin || faceCheckBusy) {
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
            if (result.mismatch) {
                paintFaceMismatch(result.mismatch);
            }
            $("#faceHint").removeClass("hidden").text(result.message || "Red areas differ from the saved Face ID. Adjust your face inside the guide.");
        });
    };

    var watchForMatchingFace = function() {
        stopFaceWatch();
        faceWatch = setInterval(function() {
            if (faceCheckBusy || !faceSelection) {
                return;
            }
            if (!(factorStatus.methods && factorStatus.methods[faceSelection.method])) {
                return;
            }
            var sample = captureFaceSample(document.getElementById('facePreview'));
            if (!sample) {
                paintFaceMismatch([]);
                $("#faceHint").removeClass("hidden").text("Move your face into the guide.");
                return;
            }
            submitMatchedFace(sample);
        }, 900);
    };

    var openPreview = function(deviceId) {
        stopFacePreview();
        var constraints = { video: deviceId ? { deviceId: { exact: deviceId } } : true, audio: false };
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            faceStream = stream;
            var video = document.getElementById('facePreview');
            video.srcObject = stream;
            showFaceGuide(faceSelection && factorStatus.methods && factorStatus.methods[faceSelection.method]);
            if (faceSelection && factorStatus.methods && factorStatus.methods[faceSelection.method]) {
                watchForMatchingFace();
            }
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

        $("#btnSfFingerprint").on("click", function(){
            if ($(this).prop("disabled")) {
                return;
            }
            hideSfPanels();
            $("#divSfFingerprint").removeClass("hidden");
            openSecondFactorModal();
            $("#fpHint").text("Windows opens Choose a passkey. Choose this computer, then use the fingerprint already saved on it. Built-in is " + (devices.platform ? "available (" + methodLabel('fingerprint_builtin') + ")." : "not reported by the browser.") + " Futronic FS64 is " + (devices.futronic ? "connected (" + methodLabel('fingerprint_futronic') + ")." : "not detected."));
        });
        $("#btnFpBack,#btnFaceBack,#btnPinBack").on("click", function(){
            showFactorHome();
        });
        $("#btnFpBuiltin").on("click", function(){
            runWebAuthn('fingerprint_builtin', 'Built-in fingerprint scanner');
        });
        $("#btnFpFutronic").on("click", function(){
            runWebAuthn('fingerprint_futronic', 'Futronic FS64');
        });
        $("#btnSfCheckFutronic").on("click", function(){
            if (!navigator.usb || !navigator.usb.requestDevice) {
                showSfAlert("This browser cannot check USB scanners. Fingerprint stays disabled unless a built-in scanner is present.");
                return;
            }
            navigator.usb.requestDevice({ filters: [{ vendorId: FUTRONIC_VENDOR_ID }] }).then(function() {
                devices.futronic = true;
                applyDeviceState();
                showSfAlert("");
                $("#divSfAlert").addClass("hidden");
                $("#sfDeviceNote").text("Futronic FS64 is connected. You can use fingerprint sign-in.");
            }).catch(function() {
                devices.futronic = false;
                applyDeviceState();
            });
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
            if (!faceSelection || !pendingLogin) {
                return;
            }
            var sample = captureFaceSample(document.getElementById('facePreview'));
            if (!sample) {
                $("#faceHint").removeClass("hidden").text("No face was found. Look straight at the selected camera, then confirm again.");
                return;
            }
            var enrolled = factorStatus.methods && factorStatus.methods[faceSelection.method];
            var path = enrolled ? '/ppa-api-uams/wsv1/api/faceVerify' : '/ppa-api-uams/wsv1/api/faceRegister';
            $("#btnFaceContinue").prop("disabled", true);
            $.wms.executeExternalPost(path, JSON.stringify({
                TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                METHOD: faceSelection.method,
                EMBEDDING: sample,
                DEVICE_LABEL: faceSelection.label || ''
            })).done(function(result) {
                $("#btnFaceContinue").prop("disabled", false);
                if (result.status === 'SUCCESS') {
                    stopFacePreview();
                    factorStatus.methods[faceSelection.method] = true;
                    finishSession(pendingLogin, "#divSfSuccess");
                } else {
                    if (result.mismatch) {
                        paintFaceMismatch(result.mismatch);
                    }
                    $("#faceHint").removeClass("hidden").text((result.message || 'Face ID did not match.') + ' Stay on this camera and try again, or use SMS OTP.');
                }
            });
        });
        $("#btnSfPin").on("click", openPin);
        $("#btnPinChangeShow").on("click", function(){
            $("#pinEnter,#pinSetup").addClass("hidden");
            $("#pinChange").removeClass("hidden");
            $("#divPinInfo").text("Enter the current PIN, then the new PIN.");
        });
        $("#btnPinSubmit").on("click", function(){
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/pinVerify', JSON.stringify({
                TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                PIN: $("#txtPin").val()
            })).done(function(result) {
                if (result.status === 'SUCCESS') {
                    finishSession(pendingLogin, "#divSfSuccess");
                } else {
                    showFactorHome();
                    showSfAlert((result.message || 'Invalid PIN.') + ' You can use SMS OTP instead.');
                }
            });
        });
        $("#btnPinSave").on("click", function(){
            if ($("#txtPinNew").val() !== $("#txtPinConfirm").val()) {
                $("#divPinInfo").text("The PIN confirmation does not match.");
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
            if ($("#txtPinChangeNew").val() !== $("#txtPinChangeConfirm").val()) {
                $("#divPinInfo").text("The new PIN confirmation does not match.");
                return;
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/pinChange', JSON.stringify({
                TOKEN: pendingLogin.payload.SECOND_FACTOR_TOKEN,
                CURRENT_PIN: $("#txtPinCurrent").val(),
                NEW_PIN: $("#txtPinChangeNew").val()
            })).done(function(result) {
                if (result.status === 'SUCCESS') {
                    $("#txtPin,#txtPinCurrent,#txtPinChangeNew,#txtPinChangeConfirm").val("");
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
