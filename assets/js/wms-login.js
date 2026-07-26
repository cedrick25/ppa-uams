/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.login = (typeof $.wms.login !== 'undefined') ? $.wms : {};

$.wms.login = (function() {

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
                //console.log(result);
                $("#divLoading").addClass("hidden");
                if(result.status == 'SUCCESS'){

                    if(result.payload.USER_STATUS === '0'){
                        $("#divInactive").removeClass("hidden")
                    }else{
                        OTP_KEY = Math.floor(Math.random()*90000) + 10000;
                        $("#otpkeygen").val(OTP_KEY)
                        $("#otpkeygen").val(OTP_KEY)
                        if(result.payload.USER_LEVEL_ID == 1){
                            var payload2 = {
                                LEVEL_ID : result.payload.USER_LEVEL_ID
                            }
                            var date = new Date();
                            date.setTime(date.getTime() + (180 * 1440 * 60 * 1000));
                            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/getUserTypeByModulesByID',JSON.stringify(payload2)).done(function (result2) {
                            if(result2.status == 'SUCCESS'){
                                $.cookie("PERMISSIONS", JSON.stringify(result2.payload), {expires: date});

                            }

                                $("#divOtpEnter").addClass("hidden");
                                $("#divSuccess").removeClass("hidden");
                                //alert("Login Success!")
                                var USER_ID = result.payload.USER_ID
                                var USER_NAME = result.payload.USER_NAME
                                var USER_STATUS = result.payload.USER_STATUS
                                var USER_LEVEL_ID = result.payload.USER_LEVEL_ID
                                var USER_FULLNAME = result.payload.USER_FULLNAME
                                var USER_EMAIL = result.payload.USER_EMAIL
                                var FIELD_OFFICE = result.payload.FIELD_OFFICE
                                var H = result.payload.HASH

                                
                                $.cookie("USER_ID", USER_ID, {expires: date});
                                $.cookie("USER_NAME", USER_NAME, {expires: date});
                                $.cookie("USER_FULLNAME", USER_FULLNAME, {expires: date});
                                $.cookie("USER_EMAIL", USER_EMAIL, {expires: date});
                                $.cookie("FIELD_OFFICE", FIELD_OFFICE, {expires: date});
                                $.cookie("USER_STATUS", USER_STATUS, {expires: date});
                                $.cookie("USER_LEVEL_ID", USER_LEVEL_ID, {expires: date});
                                $.cookie("H", H, {expires: date});
                                setTimeout(function () {
                                    window.location.href="dashboard"
                                },1000);
                            });
                        }else{
                            var myDate = new Date();
                            dt = (myDate.getFullYear() + '-' +('0' + (myDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + myDate.getDate()).slice(-2) + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds());
                                    
                        var payload3  = {
                            api_key : "75244494920210907035428",
                            message_CONTENT : "Hi " + result.payload.USER_FULLNAME + ", your OTP KEY is " + $("#otpkeygen").val() +".",
                            message_TO : result.payload.USER_CONTACT,
                            CREATED_BY : "1",
                            message_DATETIME : dt
                        }
                        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/insertSMSManually',JSON.stringify(payload3)).done(function (result2) {
                            
                        });

                        var payloadEmail  = {
                            "message_CONTENT" : "Hi " + result.payload.USER_FULLNAME + ", your OTP KEY is " + $("#otpkeygen").val() +".",
                            "message_TO" : result.payload.USER_EMAIL,
                            // "message_TO" : "notification@probation.gov.ph",
                        }
                        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/email',JSON.stringify(payloadEmail)).done(function (resultemail) {
                           
                        });
                        $("#divLogin").addClass("hidden");
                        $("#divLoginOTP").removeClass("hidden");

                        $("#btnResendOtp").unbind("click").on("click",function(){
                            $("#btnResendOtp").addClass("hidden");
                            var payload3  = {
                                api_key : "75244494920210907035428",
                                message_CONTENT : "Hi " + result.payload.USER_FULLNAME + ", your OTP KEY is " + $("#otpkeygen").val() +".",
                                message_TO : result.payload.USER_CONTACT,
                                CREATED_BY : "1",
                                message_DATETIME : dt
                            }
                            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/insertSMSManually',JSON.stringify(payload3)).done(function (result2) {
                            });


                            var payloadEmail  = {
                                "message_CONTENT" : "Hi " + result.payload.USER_FULLNAME + ", your OTP KEY is " + $("#otpkeygen").val() +".",
                                "message_TO" : result.payload.USER_EMAIL,
                            }
                            $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/email',JSON.stringify(payloadEmail)).done(function (resultemail) {
                            
                            });

                            setTimeout(function(){
                                $("#btnResendOtp").removeClass("hidden");
                            }, 60*1000*5);
                            
                        });


                        setTimeout(function(){
                            $("#btnResendOtp").removeClass("hidden");
                        }, 60*1000*5);
                        

                        $("#btnLoginOtp").unbind("click").on("click",function(){
                            //if($("#txtLoginOtp").val() == 'ppa2021'){
                            if($("#txtLoginOtp").val() == $("#otpkeygen").val()){


                                        var payload2 = {
                                            LEVEL_ID : result.payload.USER_LEVEL_ID
                                        }
                                        var date = new Date();
                                        date.setTime(date.getTime() + (180 * 1440 * 60 * 1000));
                                        $.wms.executeExternalPost('/ppa-api-uams/wsv1/api/getUserTypeByModulesByID',JSON.stringify(payload2)).done(function (result2) {
                                        if(result2.status == 'SUCCESS'){
                                            $.cookie("PERMISSIONS", JSON.stringify(result2.payload), {expires: date});
                                           
                                        }             

                                            $("#divOtpEnter").addClass("hidden");
                                            $("#divOtpSuccess").removeClass("hidden");
                                            //alert("Login Success!")
                                            var USER_ID = result.payload.USER_ID
                                            var USER_NAME = result.payload.USER_NAME
                                            var USER_STATUS = result.payload.USER_STATUS
                                            var USER_LEVEL_ID = result.payload.USER_LEVEL_ID
                                            var USER_FULLNAME = result.payload.USER_FULLNAME
                                            var FIELD_OFFICE = result.payload.FIELD_OFFICE
                                            var H = result.payload.HASH
                                            var USER_EMAIL = result.payload.USER_EMAIL
                                            $.cookie("USER_EMAIL", USER_EMAIL, {expires: date});
                                            $.cookie("USER_ID", USER_ID, {expires: date});
                                            $.cookie("USER_NAME", USER_NAME, {expires: date});
                                            $.cookie("USER_FULLNAME", USER_FULLNAME, {expires: date});
                                            $.cookie("FIELD_OFFICE", FIELD_OFFICE, {expires: date});
                                            $.cookie("USER_STATUS", USER_STATUS, {expires: date});
                                            $.cookie("USER_LEVEL_ID", USER_LEVEL_ID, {expires: date});
                                            $.cookie("H", H, {expires: date});
                                            setTimeout(function () {
                                                window.location.href="dashboard"
                                            },1000);
                                        });
                                }else{
                                    alert("Invalid OTP");
                                }
                            });

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
