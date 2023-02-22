/*   
 * This the Dashboard JS of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.modal = (typeof $.wms.modal !== 'undefined') ? $.wms.modal : {};

$.wms.modal = (function() {

      var __attachModalEvent = function() {
    	$(".btn-modal-probation").unbind("click").on("click",function(){
    		console.log("Trigger");
    		var sel = $("#sel-modal-probation-forms").val();
    		var date = $("#modal-probation-date").val();
    		var field = $("#sel-modal-probation-field").val();
    		window.location.href="caseload?form="+sel+"&date="+date+"&field="+field
    	});

        $(".btn-modal-parole").unbind("click").on("click",function(){
            console.log("Trigger");
            var sel = $("#sel-modal-parole-forms").val();
            var date = $("#modal-parole-date").val();
            var field = $("#sel-modal-parole-field").val();
            window.location.href="caseload?form="+sel+"&date="+date+"&field="+field
        });


        $(".btn-modal-regional").unbind("click").on("click",function(){
            console.log("Trigger");
            var sel = $("#sel-modal-regional-forms").val();
            var date = $("#sel-modal-regional-quarter").val();
            window.location.href="report?form="+sel+"&date="+date
        });

        $(".btn-modal-field").unbind("click").on("click",function(){
            console.log("Trigger");
            var sel = $("#sel-modal-field-forms").val();
            var date = $("#sel-modal-field-quarter").val();
            var reg = $("#sel-modal-regional-field").val();
            var reg2 = $("#sel-modal-regional-field :selected").attr("id")
            window.location.href="report?form="+sel+"&date="+date+"&reg="+reg+"&reg2="+reg2
        });


        //PASSWD VALIDATION
        $("#d1").fadeOut();
        $('#txtPassword1').blur(function(){
            $("#d1").fadeOut();
        });
            ///////////
        $('#txtPassword1').focus(function(){
            $("#d1").show();
            $('#d12,#d13,#d14,#d15,#d16').css("color", "black");
        });

        ////////////////////
        $('#txtPassword1').keyup(function(){
        var str=$('#txtPassword1').val();
        var upper_text= new RegExp('[A-Z]');
        var lower_text= new RegExp('[a-z]');
        var number_check=new RegExp('[0-9]');
        var special_char= new RegExp('[!/\'^�$%&*()}{@#~?><>,|=_+�-\]');

        var flag='T';

        if(str.match(upper_text)){
        $('#d12').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Upper Case Letter ");
        $('#d12').css("color", "green");
        }else{$('#d12').css("color", "red");
        $('#d12').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter ");
        flag='F';}

        if(str.match(lower_text)){
        $('#d13').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Lower Case Letter ");
        $('#d13').css("color", "green");
        }else{$('#d13').css("color", "red");
        $('#d13').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter ");
        flag='F';}

        /*if(str.match(special_char)){
        $('#d14').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Special Char ");
        $('#d14').css("color", "green");
        }else{
        $('#d14').css("color", "red");
        $('#d14').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Special Char ");
        flag='F';}*/

        if(str.match(number_check)){
        $('#d15').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Number ");
        $('#d15').css("color", "green");
        }else{
        $('#d15').css("color", "red");
        $('#d15').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number ");
        flag='F';}


        if(str.length>7){
        $('#d16').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Length 8 Char ");

        $('#d16').css("color", "green");
        }else{
        $('#d16').css("color", "red");
        $('#d16').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char ");

        flag='F';}


        if(flag=='T'){
            $("#btnSavePassword").removeClass("disabled")

            $("#txtPassword1").removeClass("error_field")
            $("#d1").fadeOut();
            $('#display_box').css("color","green");
            $('#display_box').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> "+str);
        }else{
            $("#btnSavePassword").addClass("disabled")
            $("#txtPassword1").addClass("error_field")
            $("#d1").show();
            $('#display_box').css("color","red");
            $('#display_box').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> "+str);
        }
        });
        ///////////////////
        $('#txtPassword1').blur(function(){
        $("#d1").fadeOut();
        });
        ///////////
        $('#txtPassword1').focus(function(){
            $("#d1").show();
        });
        //PassWD Validation




        

       
    }
    return {
        attachModalEvent : __attachModalEvent
       
    };
}());
