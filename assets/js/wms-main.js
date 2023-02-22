/* 
 * This the main API js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms = (typeof $.wms !== 'undefined') ? $.wms : {};

$.wms = (function() {

   var ___mode = true;
   var ___production = false;
    

    var __urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null) {
           return null;
        }
        return decodeURI(results[1]) || 0;
    }

    var __debug = function(){
        return ___mode;
    }

    var ___ctx = '';
    /*var ___ctx = 'http://cmis.probation.gov.ph';
    if(___production == true){
         ___ctx = "http://cmis.probation.gov.ph/api";
    }*/


    var __setContext = function(newctx) {
        ___ctx = newctx;
    };


    function upper(obj) {
      for (var prop in obj) {
      if (typeof obj[prop] === 'string') {
        obj[prop] = obj[prop].toUpperCase();
      }
      if (typeof obj[prop] === 'object') {
        upper(obj[prop]);
        }
      }
      return obj;
    }

    var __sanitize = function(data){
        var temp = JSON.stringify(data);
        temp = temp.replace(/\:null/gi, "\:\"\"")
        //console.log(temp);
        //temp = temp.toUpperCase();
        data = JSON.parse(temp);
        //console.log(data);
        return data;
    }

     var __upper = function(data){
        var temp = JSON.stringify(data);
        data = upper(JSON.parse(temp));
        //console.log(data);
        return data;
    }
    
    var __getContext = function() {
        return ___ctx;
    };

    var __getImgPath = function(){
        //return "/wms-portal/";
        return "/";
    }
	var __executeGet = function (path) {
        var dfd = $.Deferred();
        $.get(path, function(data) {})
        .done(function(data){
            dfd.resolve(data);
        })
        .fail(function(qXHR, textStatus, errorThrown){
            dfd.resolve({
                status : 'ERROR',
                message : errorThrown
            });
        })
        .always(function(data){

        });
        return dfd.promise();
    };
    var __executePost = function(path, jsonObj, customLoader) {
        path = $.wms.getContextPath() + path;
        var d = $.Deferred();
        if(customLoader != ""){
            $("#"+customLoader).show();
        }
        $.ajax({
            method: "POST",
            url: path,
            dataType: "json",
            data: jsonObj
        }).done(function (data, textStatus, jqXHR) {
            if(customLoader != ""){
                $("#"+customLoader).hide();
            }
            d.resolve(data)
        }).fail(function (jqXHR, textStatus, errorThrown,request) {
            console.log('---FAILED---');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log('---FAILED---');
            
            d.resolve({
                status : 'ERROR',
                message : request
            });
            
            if(customLoader != ""){
                $("#"+customLoader).hide();
            }
        });
        
        return d.promise();
    };

    var __executeExternalPost = function(path, jsonObj, customLoader) {
        path = $.wms.getContext() + path;
        var d = $.Deferred();
        if(customLoader != ""){
            $("#"+customLoader).show();
            $("#"+customLoader).removeClass("hide");
        }
        $.ajax({
            method: "POST",
            url: path,
            dataType: "json",
            data: jsonObj
        }).done(function (data, textStatus, jqXHR) {
            if(customLoader != ""){
                $("#"+customLoader).hide();
                $("#"+customLoader).addClass("hide");
            }
            d.resolve(data)
        }).fail(function (jqXHR, textStatus, errorThrown,request) {
            console.log('---FAILED---');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log('---FAILED---');
            
            d.resolve({
                status : 'ERROR',
                message : request
            });
            
            if(customLoader != ""){
                $("#"+customLoader).hide();
                $("#"+customLoader).addClass("hide");
            }
        });
        
        return d.promise();
    };

    var __executeExternalGet = function(path, customLoader) {
        // path = $.wms.getContextPath() + path;
        var d = $.Deferred();
        if(customLoader != ""){
            $("#"+customLoader).show();
            $("#"+customLoader).removeClass("hide");
        }
        $.ajax({
            method: "GET",
            url: path,
            dataType: "json",
        }).done(function (data, textStatus, jqXHR) {
            if(customLoader != ""){
                $("#"+customLoader).hide();
                $("#"+customLoader).addClass("hide");
            }
            d.resolve(data)
        }).fail(function (jqXHR, textStatus, errorThrown,request) {
            console.log('---FAILED---');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log('---FAILED---');
            
            d.resolve({
                status : 'ERROR',
                message : request
            });
            
            if(customLoader != ""){
                $("#"+customLoader).hide();
                $("#"+customLoader).addClass("hide");
            }
        });
        
        return d.promise();
    };



    var __executeFile = function(path, jsonObj) {
        var d = $.Deferred();
            $(".overlay-back").show();
            $(".loadDiv").show();
        $.ajax({
            method: "POST",
            url: path,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            /*data: JSON.stringify(jsonObj)*/
            data: jsonObj
        }).done(function (data, textStatus, jqXHR) {
            d.resolve(data);
            $(".loadDiv").hide();
            $(".overlay-back").hide();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('---FAILED---');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            console.log('---FAILED---');
            
            d.resolve({
                status : 'ERROR',
                message : errorThrown
            });
            $(".overlay-back").hide();
            $(".loadDiv").hide();
        });
        return d.promise();
    };
    
    var __CheckCookie = function() {
        if (typeof  $.cookie('userID') != "undefined"){
            //Redirect to logout page
        }
    }
    
    return {
        setContext:__setContext,
        getContext : __getContext,
        getImgPath : __getImgPath,
        executePost : __executePost,
        executeExternalPost : __executeExternalPost,
        executeGet : __executeGet,
        executeFile : __executeFile,
        executeExternalGet : __executeExternalGet,
        CheckCookie :__CheckCookie,
        debug : __debug,
        urlParam : __urlParam,
        sanitize : __sanitize,
        upper : __upper,
    };
}());
