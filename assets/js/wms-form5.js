/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.form5 = (typeof $.wms.form5 !== 'undefined') ? $.wms : {};

$.wms.form5 = (function() {


    var ___validateSave = function(allowedDocket,docket,requiredField,check,checkTable){
        $(".err_msg").remove()
        docket.removeClass("error_field")
        var dontSubmit = false;
        var docketSeries = docket.val().split("-")
        var error_msg = "";
        console.log(allowedDocket)
        console.log(docketSeries[0].toUpperCase())
        console.log(allowedDocket.indexOf(docketSeries[0].toUpperCase()));
        if(allowedDocket.indexOf(docketSeries[0].toUpperCase()) < 0 ){ 
            dontSubmit = true;
            docket.addClass("error_field")
            $("<p class='err_msg color-red font_12 i'>*Invalid Docket No.</p>").insertAfter(docket)
        }

        

        if(check != undefined){
            var payload = {
                "checkTable" : checkTable,
                "Y_M" : $.wms.urlParam('date'),
                "docket_no" : docket.val(),
                "field_office" : $.wms.urlParam('field')
            }

            requiredField.forEach(function(data){
                if($("#"+data).val() == ""){
                    dontSubmit = true;
                    $("#"+data).addClass("error_field");
                    $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter(("#"+data))
                }else{
                    $("#"+data).removeClass("error_field");
                }
            });
            var d = $.Deferred();
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/validateDocket',JSON.stringify(payload)).done(function (result2) {   
                if(result2.status == 'SUCCESS'){

                }else{
                    dontSubmit = true;
                    docket.addClass("error_field")
                    $("<p class='err_msg color-red font_12 i'>*Docket not found in "+checkTable.join("/")+"</p>").insertAfter(docket)
                }
               
                if(dontSubmit){
                    d.resolve(false);
                }else{
                     d.resolve(true);
                }

                
            });
            return d.promise();
            
            
           
        }else{
            requiredField.forEach(function(data){
            if($("#"+data).val() == ""){
                dontSubmit = true;
                $("#"+data).addClass("error_field");
                $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter(("#"+data))
            }else{
                $("#"+data).removeClass("error_field");
            }
            });

            if(dontSubmit){
                return false;
            }else{
                return true;    
            }

            
        }
            
       
        
        

    }



    var __attachF5T1PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field')
        }
        $('.F5T1_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T1ByYM',JSON.stringify(payload)).done(function (result) {
            
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T1_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+data.date_rcv+"</td>"+
                                                "<td>"+data.investigating_officer+"</td>"+
                                                "<td class='options field'>"+data.field_office+"</td>"+
                                                "<td class='options'>"+source+"</td>"+
                                                "<td align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
            }else{
                $('.F5T1_tbody').append("<tr>"+
                                                "<td colspan='7' class='center b'>NONE</td>"+
                                                "</tr>")
            }

            //Table Control Events
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "ID" : data_id
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T1ByID',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_petitioner").val(payload.petitioner)
                        $("#edit_date_rcv").val(payload.date_rcv)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_investigating_officer").val(payload.investigating_officer)
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

        });    

        $(".editSubmitButton").unbind("click").on("click",function(){
            $(".modal-form input").attr("disabled",true);
            $(".modal-form select").attr("disabled",true);
            $(".editSubmitButton").addClass("hidden");
            $(".confirmEdit").removeClass("hidden")
            $(".editProceedButton").removeClass("hidden")
        });

        $(".editCancelButton").unbind("click").on("click",function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".confirmEdit").addClass("hidden")
            $(".editSubmitButton").removeClass("hidden")
            $(".editProceedButton").addClass("hidden")
        });


        //Update
        $(".editProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "id" : $("#edit_id").val(),
                "docket_no" : $("#edit_docket_no").val(),
                "petitioner": $("#edit_petitioner").val(),
                "date_rcv": $("#edit_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "investigating_officer": $("#edit_investigating_officer").val(),
                "Y_M": $.wms.urlParam('date'),
                "created_by" : $.cookie("USER_ID")
            }
            console.log(payload)
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T1',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".editProceedButton").attr('disabled',false)
                $("#modal-edit").modal('toggle')
                if(result.status != undefined && result.status == "SUCCESS"){
                    __attachF5T1PageEvent();
                }else{
                    //Error Prompt
                }
            });    
        })

        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T1").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table1",
                filename: "Form5-Table1.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_petitioner', 'add_date_rcv', 'add_investigating_officer'];

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){
                $(".modal-form input").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            $(".modal-form input").attr("disabled",false);
            $(".confirmAdd").addClass("hidden")
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
            $(".btn-reset").trigger("click")
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "petitioner": $("#add_petitioner").val(),
                "date_rcv": $("#add_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "investigating_officer": $("#add_investigating_officer").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID")
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/upsertF5T1',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                $(".btn-reset").trigger("click")    
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T1PageEvent();
                    location.reload();

                }else{
                    //Error Prompt
                }
            });    
        })


        


        //Delete
        $(".deleteProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = {
                "id" : $(".sel-id").html(),
                "status" : "0"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T1',JSON.stringify(payload)).done(function (result) {
                $("#modal-delete").modal('toggle')
                $(".modal-loader").addClass("hidden")
                $(".deleteProceedButton").attr('disabled',false)
                if(result.status != undefined && result.status == "SUCCESS"){
                   __attachF5T1PageEvent();
                }
            });    
        })
    };


    var __attachF5T2PageEvent = function() {
        var __maxTableSize = 0;
        var __counter = 0;


        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field')
        }
        $('.F5T2_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_RCV_ByYM',JSON.stringify(payload)).done(function (result) {
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){

                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
                
                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1;
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            //console.log(data);
                            $("#r"+r+"c1").html(data.docket_no.toUpperCase());
                            $("#r"+r+"c2").html(data.petitioner_name.toUpperCase());
                            $("#r"+r+"c3").html(data.plea_bargain);
                            $("#r"+r+"c4").html(data.case_no);
                            $("#r"+r+"c5").html(data.court_origin);
                            $("#r"+r+"c6").html(data.offense);
                            $("#r"+r+"c7").html(data.sentence);
                            $("#r"+r+"c8").html(data.date_of_court_order);
                            $("#r"+r+"c9").html(data.received_date);
                            $("#r"+r+"c10").html(data.investigating_officer_name);
                            $("#r"+r+"c11").html(data.field_office).addClass("options");
                            $("#r"+r+"c12").html(source).addClass("options");
                            $("#r"+r+"c13").html("<button class='access_f5_write btn btn-success btn-xs btn-rcv-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-rcv-delete hidden' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___updateRCV_event();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });    

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field')
        }
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_ACTED_ByYM',JSON.stringify(payload)).done(function (result) {
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
               
                function checkPendingRequest() {
                    if ($.active > 0) {
                        //console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            //console.log(data);
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            ppo_recommendation = (data.ppo_recommendation == "PSIR - FOR GRANTED" ? "PSIR - FOR GRANT" : data.ppo_recommendation)
                            $("#r"+r+"c14").html("("+data.docket_no.toUpperCase()+") "+data.petitioner_name.toUpperCase());
                            
                            $("#r"+r+"c15").html(data.psir_date);
                            $("#r"+r+"c16").html(data.manifest_date);
                            $("#r"+r+"c17").html(ppo_recommendation);
                            $("#r"+r+"c18").html(data.transfer_date);
                            $("#r"+r+"c19").html(data.transfer_to);
                            $("#r"+r+"c20").html(data.field_office).addClass("options");
                            $("#r"+r+"c21").html(source).addClass("options");
                            $("#r"+r+"c22").html("<button class='access_f5_write btn btn-success btn-xs btn-acted-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-acted-delete hidden' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });

                        ___updateACTED_event();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "disposed_decision" : "Recall"
        }
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_NOTACTED_ByYM',JSON.stringify(payload)).done(function (result) {
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }

                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            // console.log(data);
                           
                            $("#r"+r+"c23").html("("+data.docket_no.toUpperCase()+") "+data.petitioner_name.toUpperCase());
                            $("#r"+r+"c24").html(data.received_date);
                            $("#r"+r+"c25").html(data.field_office).addClass("options");
                            $("#r"+r+"c26").html(source).addClass("options");
                            $("#r"+r+"c27").html("<button class='access_f5_write btn btn-success btn-xs btn-notacted-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-notacted-delete hidden' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            
                            r += 1;
                        });

                        ___updateNOTACTED_event();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);
            }
            ___checker();
        });   


        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "disposed_decision" : "Warrant of Arrest"
        }
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_NOTACTED_ByYM',JSON.stringify(payload)).done(function (result) {
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }

                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1
                        result.payload.forEach(function(data){
                           
                            // console.log(data);
                           data = $.wms.upper($.wms.sanitize(data))
                            
                            $("#r"+r+"c27").html("("+data.docket_no.toUpperCase()+") "+data.petitioner_name.toUpperCase());
                            $("#r"+r+"c28").html(data.received_date);
                            $("#r"+r+"c29").html(data.field_office).addClass("options");
                            $("#r"+r+"c30").html(source).addClass("options");
                            $("#r"+r+"c31").html("<button class='access_f5_write btn btn-success btn-xs btn-notacted-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-notacted-delete hidden' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            
                            r += 1;
                        });

                        ___updateNOTACTED_event();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);
            }
            ___checker();
        });  

        var ___checker = function(){
            if(__counter == 4){
                console.log("FINISH")
                console.log(__maxTableSize);
                if(__maxTableSize > 0){

                    $(".F5T2_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F5T2_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class=''>"+
                                "<td id='r"+i+"c10' >"+
                                "<td id='r"+i+"c11' class='options'>"+
                                "<td id='r"+i+"c12' class='options'>"+
                                "<td id='r"+i+"c13' class='options'>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class=''>"+
                                "<td id='r"+i+"c19' >"+
                                "<td id='r"+i+"c20' class='options'>"+
                                "<td id='r"+i+"c21' class='options'>"+
                                "<td id='r"+i+"c22' class='options'>"+
                                "<td id='r"+i+"c23' class=''>"+
                                "<td id='r"+i+"c24' >"+
                                "<td id='r"+i+"c25' class='options'>"+
                                "<td id='r"+i+"c26' class='options'>"+
                                "<td id='r"+i+"c27' class='options'>"+
                                "<td id='r"+i+"c28' class=''>"+
                                "<td id='r"+i+"c29' class=''>"+
                                "<td id='r"+i+"c30' class='options'>"+
                                "<td id='r"+i+"c31' class='options'>"+
                                "<td id='r"+i+"c32' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F5T2_tbody").append(
                            "<tr>"+
                                "<td colspan='20' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }

       


        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            ////$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }
        //Add RCV
        $(".addSubmitRCVButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_rcv_petitioner', 'add_date_rcv', 'add_rcv_date_of_court_order','add_rcv_date_rcv'];

            if(___validateSave(allowedDocket,$("#add_rcv_docket_no"),requiredField)){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitRCVButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedRCVButton").removeClass("hidden")
            }
        });

        $(".addCancelRCVButton").unbind("click").on("click",function(){
            ___modalReset();

            $(".addSubmitRCVButton").removeClass("hidden")
            $(".addProceedRCVButton").addClass("hidden")
            

        });

        $(".addProceedRCVButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_rcv_docket_no").val(),
                "petitioner_name": $("#add_rcv_petitioner").val(),
                "case_no": $("#add_rcv_case_no").val(),
                "plea_bargain": $("#add_rcv_plea_bargain").val(),
                "court_origin": $("#add_rcv_court_origin").val(),
                "offense": $("#add_rcv_offense").val(),
                "sentence" : $("#add_rcv_sentence").val(),
                "date_of_court_order": $("#add_rcv_date_of_court_order").val(),
                "received_date": $("#add_rcv_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "investigating_officer_name": $("#add_rcv_investigating_officer").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID")
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/upsertF5T2_RCV',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                ___modalReset();
               
                $(".addSubmitRCVButton").removeClass("hidden")
                $(".addProceedRCVButton").addClass("hidden")
                $("#modal-add-rcv").modal('toggle')
                
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T2PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })



        //Add ACTED
        $(".addSubmitACTEDButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_acted_petitioner'];
            var check = true
            var checkTable = ['F5T1', 'F5T2_RCV']

            ___validateSave(allowedDocket,$("#add_acted_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitACTEDButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedACTEDButton").removeClass("hidden")
                }
            });
        });

        $(".addCancelACTEDButton").unbind("click").on("click",function(){
            ___modalReset();
           
            $(".addSubmitACTEDButton").removeClass("hidden")
            $(".addProceedACTEDButton").addClass("hidden")
           
        });

         $(".addProceedACTEDButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_acted_docket_no").val(),
                "petitioner_name": $("#add_acted_petitioner").val(),
                "psir_date": $("#add_acted_psir").val(),
                "manifest_date": $("#add_acted_manifest").val(),
               
                "received_date": $("#add_acted_date_rcv").val(),
                "transfer_date": $("#add_acted_transfer_date").val(),
                "transfer_to": $("#add_acted_transfer_to").val(),
                "field_office": $.wms.urlParam('field'),
                "ppo_recommendation" : $("#add_acted_recommendation").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID")
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/upsertF5T2_ACTED',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                ___modalReset();

                $(".addSubmitACTEDButton").removeClass("hidden")
                $(".addProceedACTEDButton").addClass("hidden")
                $("#modal-add-acted").modal('toggle')
                
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T2PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        });


         //Add NOT ACTED
        $(".addSubmitNOTACTEDButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_notacted_petitioner', 'add_notacted_date'];
            var check = true
            var checkTable = ['F5T1', 'F5T2_RCV']

            ___validateSave(allowedDocket,$("#add_notacted_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addSubmitNOTACTEDButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addProceedNOTACTEDButton").removeClass("hidden")
                    $(".addProceedNOTACTEDButton").attr('disabled',false)
                }
            })
        });

        $(".addCancelNOTACTEDButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitNOTACTEDButton").removeClass("hidden")
            $(".addProceedNOTACTEDButton").addClass("hidden")
           
        });

        $(".addProceedNOTACTEDButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_notacted_docket_no").val(),
                "petitioner_name": $("#add_notacted_petitioner").val(),
                "received_date": $("#add_notacted_date").val(),
                "disposed_decision" : $("#add_notacted_decision").val(),
                "field_office": $.wms.urlParam('field'),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID")
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/upsertF5T2_NOTACTED',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                ___modalReset();
                $(".addSubmitNOTACTEDButton").removeClass("hidden")
                $(".addProceedNOTACTEDButton").addClass("hidden")
                $("#modal-add-notacted").modal('toggle')
                
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T2PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T2").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table2",
                filename: "Form5-Table2.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });


            $("#sel_please").unbind("change").on("change",function(){
              console.log($(this).val())
              if($(this).val() == "Yes"){
                $("#plea-classification").removeClass("hidden")
              }else{
                $("#plea-classification").addClass("hidden")
              }
            });


            $("#edit_sel_please").unbind("change").on("change",function(){
              console.log($(this).val())
              if($(this).val() == "Yes"){
                $("#edit_plea-classification").removeClass("hidden")
              }else{
                $("#edit_plea-classification").addClass("hidden")
                $("#edit_rcv_plea_bargain").val("")
              }
            });
              
            


        var ___updateRCV_event = function(){
            $(".btn-rcv-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-delete").modal();
            });    

            //Delete
            $(".deleteRCVProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update",
                    "created_by" : $.cookie("USER_ID")
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_RCV',JSON.stringify(payload)).done(function (result) {
                    $("#modal-rcv-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteRCVProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T2PageEvent();
                       location.reload();
                    }
                });    
            })


            $(".btn-rcv-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id")
                console.log(data_id);
                $("#modal-edit-rcv").modal('toggle')
                $(".modal-form").addClass('hidden')
                $(".modal-loader2").removeClass('hidden')
                var payload = {
                    "ID" : data_id
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_RCV_ByID',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_rcv_docket_no").val(payload.docket_no)
                        $("#edit_rcv_id").val(payload.id)
                        $("#edit_rcv_petitioner").val(payload.petitioner_name)
                        $("#edit_rcv_case_no").val(payload.case_no)
                        if(payload.plea_bargain != "" && payload.plea_bargain != null){
                            $("#edit_sel_please").val("Yes").trigger("change")
                            $("#edit_rcv_plea_bargain").val(payload.plea_bargain).trigger("change")
                            $("#edit_plea-classification").removeClass("hidden")
                        }
                        $("#edit_rcv_court_origin").val(payload.court_origin)
                        $("#edit_rcv_offense").val(payload.offense)
                        $("#edit_rcv_sentence").val(payload.sentence)
                        $("#edit_rcv_date_of_court_order").val(payload.date_of_court_order)
                        $("#edit_rcv_date_rcv").val(payload.received_date)
                        $("#edit_rcv_field_office").val(payload.field_office).trigger("change");
                        $("#edit_rcv_investigating_officer").val(payload.investigating_officer_name)
                        $("#edit_rcv_Y_M").val(payload.Y_M).attr("disabled",true)
                    
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            })

            $(".editSubmitRCVButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitRCVButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedRCVButton").removeClass("hidden")
            });

            $(".editCancelRCVButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitRCVButton").removeClass("hidden")
                $(".editProceedRCVButton").addClass("hidden")
            }); 

            $(".editProceedRCVButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
               
                
                $("#modal-edit-rcv").modal("toggle");
                var payload = { 
                    "id" : $("#edit_rcv_id").val(),
                    "docket_no" : $("#edit_rcv_docket_no").val(),
                    "petitioner_name": $("#edit_rcv_petitioner").val(),
                    "case_no" : $("#edit_rcv_case_no").val(),
                    "plea_bargain" : $("#edit_rcv_plea_bargain").val(),
                    "court_origin" : $("#edit_rcv_court_origin").val(),
                    "offense" : $("#edit_rcv_offense").val(),
                    "sentence" : $("#edit_rcv_sentence").val(),
                    "date_of_court_order" : $("#edit_rcv_date_of_court_order").val(),
                    "received_date" : $("#edit_rcv_date_rcv").val(),
                    "investigating_officer_name" : $("#edit_rcv_investigating_officer").val(),
                    "Y_M" : $("#edit_rcv_Y_M").val(),
                    "field_office":$.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "created_by" : $.cookie("USER_ID")
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_RCV',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedRCVButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                     ___modalReset();
                    $(".editSubmitRCVButton").removeClass("hidden")
                    $(".editProceedRCVButton").addClass("hidden")
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T2PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }


        //ACTED EVENTS
        var ___updateACTED_event = function(){
            $(".btn-acted-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-acted-delete").modal();
            });    

            //Delete
            $(".deleteACTEDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update",
                    "created_by" : $.cookie("USER_ID")
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_ACTED',JSON.stringify(payload)).done(function (result) {
                    $("#modal-acted-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteACTEDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T2PageEvent();
                       location.reload();
                    }
                });    
            })


            $(".btn-acted-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id")
                console.log(data_id);
                $("#modal-edit-acted").modal('toggle')
                $(".modal-form").addClass('hidden')
                $(".modal-loader2").removeClass('hidden')
                var payload = {
                    "ID" : data_id
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_ACTED_ByID',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_acted_docket_no").val(payload.docket_no)
                        $("#edit_acted_id").val(payload.id)
                        $("#edit_acted_petitioner").val(payload.petitioner_name)
                        $("#edit_acted_psir").val(payload.psir_date)
                        $("#edit_acted_manifest").val(payload.manifest_date)
                        $("#edit_acted_recommendation").val(payload.ppo_recommendation).trigger("change")
                        $("#edit_acted_transfer_date").val(payload.transfer_date)
                        $("#edit_acted_transfer_to").val(payload.transfer_to)
                        $("#edit_acted_field_office").val(payload.field_office).trigger("change")
                        $("#edit_acted_investigating_officer").val(payload.investigating_officer_name)
                        $("#edit_acted_Y_M").val(payload.Y_M).attr("disabled",true)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            })

            $(".editSubmitACTEDButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitACTEDButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedACTEDButton").removeClass("hidden")
            });

            $(".editCancelACTEDButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitACTEDButton").removeClass("hidden")
                $(".editProceedACTEDButton").addClass("hidden")
            }); 

            $(".editProceedACTEDButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
               
                
                $("#modal-edit-acted").modal("toggle");
                var payload = { 
                    "id" : $("#edit_acted_id").val(),
                    "docket_no" : $("#edit_acted_docket_no").val(),
                    "petitioner_name": $("#edit_acted_petitioner").val(),
                    "psir_date" : $("#edit_acted_psir").val(),
                    "manifest_date" : $("#edit_acted_manifest").val(),
                    "ppo_recommendation" : $("#edit_acted_recommendation").val(),
                    "transfer_date" :  $("#edit_acted_transfer_date").val(),
                    "transfer_to" : $("#edit_acted_transfer_to").val(),
                    "Y_M" : $("#edit_acted_Y_M").val(),
                    "field_office": $.wms.urlParam('field'),
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_ACTED',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedACTEDButton").attr('disabled',false)
                     ___modalReset();
                    $(".editSubmitACTEDButton").removeClass("hidden")
                    $(".editProceedACTEDButton").addClass("hidden")
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T2PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }


        //NOTACTED EVENTS
        var ___updateNOTACTED_event = function(){
            $(".btn-notacted-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-notacted-delete").modal();
            });    

            //Delete
            $(".deleteNOTACTEDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_NOTACTED',JSON.stringify(payload)).done(function (result) {
                    $("#modal-notacted-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteNOTACTEDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T2PageEvent();
                       location.reload();
                    }
                });    
            })


            $(".btn-notacted-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id")
                console.log(data_id);
                $("#modal-edit-notacted").modal('toggle')
                $(".modal-form").addClass('hidden')
                $(".modal-loader2").removeClass('hidden')
                var payload = {
                    "ID" : data_id
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/fetchF5T2_NOTACTED_ByID',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_notacted_docket_no").val(payload.docket_no)
                        $("#edit_notacted_id").val(payload.id)
                        $("#edit_notacted_petitioner").val(payload.petitioner_name)
                        $("#edit_notacted_decision").val(payload.disposed_decision).trigger("change");
                        $("#edit_notacted_date").val(payload.received_date)
                        $("#edit_notacted_field_office").val(payload.field_office).trigger("change")
                        $("#edit_notacted_investigating_officer").val(payload.investigating_officer_name)
                        $("#edit_notacted_Y_M").val(payload.Y_M).attr("disabled",true)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            })

            $(".editSubmitNOTACTEDButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitNOTACTEDButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedNOTACTEDButton").removeClass("hidden")
            });

            $(".editCancelNOTACTEDButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitNOTACTEDButton").removeClass("hidden")
                $(".editProceedNOTACTEDButton").addClass("hidden")
            }); 

            $(".editProceedNOTACTEDButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
               
                
                $("#modal-edit-notacted").modal("toggle");
                var payload = { 
                    "id" : $("#edit_notacted_id").val(),
                    "docket_no" : $("#edit_notacted_docket_no").val(),
                    "petitioner_name": $("#edit_notacted_petitioner").val(),
                    "disposed_decision" : $("#edit_notacted_decision").val(),
                    "received_date" : $("#edit_notacted_date").val(),
                    "Y_M" : $("#edit_notacted_Y_M").val(),
                    "field_office": $.wms.urlParam('field'),
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/updateF5T2_NOTACTED',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedNOTACTEDButton").attr('disabled',false)
                     ___modalReset();
                    $(".editSubmitNOTACTEDButton").removeClass("hidden")
                    $(".editProceedNOTACTEDButton").addClass("hidden")
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T2PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }



    };

    var __attachF5T3PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T3_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T3',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T3_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+(data.psir_rec == "PSIR - For Granted" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "PSIR - For Denial" ? data.psir_date : "")+"</td>"+
                                                "<td>"+data.manifest+"</td>"+
                                                "<td>"+data.investigating_officer.toUpperCase()+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write tn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T3_tbody").append(
                        "<tr>"+
                            "<td colspan='9' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T3").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table3",
                filename: "Form5-Table3.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_petitioner', 'add_investigating_officer'];

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){
                $(".modal-form input").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "petitioner": $("#add_petitioner").val(),
                "psir_date": $("#add_psir").val(),
                "psir_rec": $("#add_psir_rec").val(),
                "investigating_officer": $("#add_investigating_officer").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" : $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T3',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T3PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T3',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T3PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T3',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_petitioner").val(payload.petitioner)
                        $("#edit_manifestation").val(payload.manifest)
                        $("#edit_psir_rec").val(payload.psir_rec).trigger("change")
                        $("#edit_psir").val(payload.psir_date)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_investigating_officer").val(payload.investigating_officer)
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "petitioner": $("#edit_petitioner").val(),
                    "manifest": $("#edit_manifestation").val(),
                    "psir_rec": $("#edit_psir_rec").val(),
                    "psir_date": $("#edit_psir").val(),
                    "field_office": $.wms.urlParam('field'),
                    "investigating_officer": $("#edit_investigating_officer").val(),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T3',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T3PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };

    var __attachF5T4PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T4_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T4',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T4_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+(data.disposed_decision == "Granted" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Denied" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Dismissed" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Withdrawal" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Reinvestigation" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Others" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Warrant of Arrest" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Recall" ? data.disposed_date : "")+"</td>"+
                                                "<td class=' center'>"+data.reason_denial+"</td>"+
                                                "<td class=' center'>"+data.other_types+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T4_tbody").append(
                        "<tr>"+
                            "<td colspan='12' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T4").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table4",
                filename: "Form5-Table4.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPI', 'PI', 'JRPI', 'RPI', 'JTPI', 'TPI' ];
            var requiredField= [ 'add_petitioner','add_psir'];
            var check = true
            var checkTable = ['F5T2_ACTED', 'F5T3']

            ___validateSave(allowedDocket,$("#add_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addProceedButton").removeClass("hidden")
                }
            })
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "petitioner": $("#add_petitioner").val(),
                "reason_denial": $("#add_reason_denial").val(),
                "other_types": $("#add_other_types").val(),
                "disposed_date": $("#add_psir").val(),
                "disposed_decision": $("#add_psir_rec").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" :$.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T4',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T4PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T4',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T4PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T4',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_petitioner").val(payload.petitioner)
                        $("#edit_manifestation").val(payload.manifest)
                        $("#edit_reason_denial").val(payload.reason_denial)
                        $("#edit_other_types").val(payload.other_types)
                        $("#edit_psir_rec").val(payload.disposed_decision).trigger("change")
                        $("#edit_psir").val(payload.disposed_date)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "petitioner": $("#edit_petitioner").val(),
                    "other_types": $("#edit_other_types").val(),
                    "reason_denial": $("#edit_reason_denial").val(),
                    "petitioner": $("#edit_petitioner").val(),
                    "disposed_decision": $("#edit_psir_rec").val(),
                    "disposed_date": $("#edit_psir").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T4',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T4PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };


    var __attachF5T5PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T5_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T5',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T5_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                
                                                "<td class='center'>"+data.referring_office+"</td>"+
                                                "<td class='center'>"+data.received_date+"</td>"+
                                                "<td class='center'>"+data.investigating_officer+"</td>"+
                                                "<td class='center'>"+data.reasons+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T5_tbody").append(
                        "<tr>"+
                            "<td colspan='12' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T5").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table5",
                filename: "Form5-Table5.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPI', 'CPI', 'FBCI'];
            var requiredField= [ 'add_petitioner', 'add_date_rcv', 'add_investigating_officer'];

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "petitioner": $("#add_petitioner").val(),
                "referring_office" : $("#add_referring_office").val(),
                "received_date" : $("#add_date_rcv").val(),
                "investigating_officer" : $("#add_investigating_officer").val(),
                "reasons" : $("#add_reasons").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T5',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T5PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T5',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T5PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T5',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_petitioner").val(payload.petitioner)
                        $("#edit_referring_office").val(payload.referring_office).trigger("change")
                        $("#edit_date_rcv").val(payload.received_date)
                        $("#edit_investigating_officer").val(payload.investigating_officer)
                        $("#edit_reasons").val(payload.reasons)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "petitioner" : $("#edit_petitioner").val(),
                    "referring_office" : $("#edit_referring_office").val(),
                    "received_date" : $("#edit_date_rcv").val(),
                    "investigating_officer" : $("#edit_investigating_officer").val(),
                    "reasons" : $("#edit_reasons").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T5',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T5PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };



    var __attachF5T6PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T6_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_RCV',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
                
                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1;
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            //console.log(data);
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            $("#r"+r+"c1").html(data.docket_no.toUpperCase());
                            $("#r"+r+"c2").html(data.petitioner);
                            $("#r"+r+"c3").html(data.referring_office);
                            $("#r"+r+"c4").html(data.received_date);
                            $("#r"+r+"c5").html(data.reasons);
                            $("#r"+r+"c6").html(data.investigating_officer);
                            $("#r"+r+"c7").html(data.field_office).addClass("options");
                            $("#r"+r+"c8").html(source).addClass("options");
                            $("#r"+r+"c9").html("<button class='access_f5_write tn btn-success btn-xs btn-rcv-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-rcv-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControlsRCV();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });


        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
                
                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1;
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            //console.log(data);
                            //$("#r"+r+"c1").html(data.docket_no.toUpperCase());
                            $("#r"+r+"c10").html("("+data.docket_no.toUpperCase()+") "+data.petitioner);
                            $("#r"+r+"c11").html(data.completed_date);
                            $("#r"+r+"c12").html(data.field_office).addClass("options");
                            $("#r"+r+"c13").html(source).addClass("options");
                            $("#r"+r+"c14").html("<button class='access_f5_write btn btn-success btn-xs btn-cmpltd-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-cmpltd-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControlsCMPLTD();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var ___checker = function(){
            if(__counter == 2){
                console.log("FINISH")
                console.log(__maxTableSize);
                if(__maxTableSize > 0){

                    $(".F5T6_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F5T6_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class=''>"+
                                "<td id='r"+i+"c9' class=''>"+
                                "<td id='r"+i+"c10' class=''>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class='options'>"+
                                "<td id='r"+i+"c13' class='options'>"+
                                "<td id='r"+i+"c14' class='options'>"+
                            "</tr>"
                            )
                    }
                    $.wms.dashboard.formControlCheck()
                }else{
                    $(".F5T6_tbody").append(
                            "<tr>"+
                                "<td colspan='14' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T6").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table6",
                filename: "Form5-Table6.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //ADD
        
        $(".addRCVSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPI', 'CPI', 'FBCI'];
            var requiredField= [ 'add_rcv_docket_no', 'add_rcv_petitioner', 'add_rcv_date_rcv','add_rcv_investigating_officer','add_rcv_reasons'];

            if(___validateSave(allowedDocket,$("#add_rcv_docket_no"),requiredField)){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addRCVSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addRCVProceedButton").removeClass("hidden")
            }
        });

        $(".addRCVCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addRCVSubmitButton").removeClass("hidden")
            $(".addRCVProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addRCVProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_rcv_docket_no").val(),
                "petitioner": $("#add_rcv_petitioner").val(),
                "referring_office" : $("#add_rcv_referring_office").val(),
                "received_date" : $("#add_rcv_date_rcv").val(),
                "investigating_officer" : $("#add_rcv_investigating_officer").val(),
                "reasons" : $("#add_rcv_reasons").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" : $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_RCV',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addRCVProceedButton").attr('disabled',false)
                $("#modal-rcv-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T6PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })
        //ADD

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControlsRCV = function(){
            $(".btn-rcv-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-delete").modal();
            });    

            //Delete
            $(".deleteRCVProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_RCV',JSON.stringify(payload)).done(function (result) {
                    $("#modal-rcv-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteRCVProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T6PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-rcv-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_RCV',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editRCVSubmitButton").removeClass("hidden");
                    $(".editRCVroceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_rcv_docket_no").val(payload.docket_no)
                        $("#edit_rcv_id").val(payload.id)
                        $("#edit_rcv_petitioner").val(payload.petitioner)
                        $("#edit_rcv_referring_office").val(payload.referring_office).trigger("change")
                        $("#edit_rcv_date_rcv").val(payload.received_date)
                        $("#edit_rcv_investigating_officer").val(payload.investigating_officer)
                        $("#edit_rcv_reasons").val(payload.reasons)
                        $("#edit_rcv_field_office").val(payload.field_office).trigger("change");
                        $("#edit_rcv_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editRCVSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editRCVSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editRCVProceedButton").removeClass("hidden")
            });

            $(".editRCVCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editRCVSubmitButton").removeClass("hidden")
                $(".editRCVProceedButton").addClass("hidden")
            });


            //Update
            $(".editRCVProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_rcv_id").val(),
                    "docket_no" : $("#edit_rcv_docket_no").val(),
                    "petitioner" : $("#edit_rcv_petitioner").val(),
                    "referring_office" : $("#edit_rcv_referring_office").val(),
                    "received_date" : $("#edit_rcv_date_rcv").val(),
                    "investigating_officer" : $("#edit_rcv_investigating_officer").val(),
                    "reasons" : $("#edit_rcv_reasons").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_RCV',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editRCVProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-rcv-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T6PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

        //ADD_CMPLTD
        //ADD
        
        $(".addCMPLTDSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPI', 'CPI', 'FBCI'];
            var requiredField= [ 'add_cmpltd_docket_no','add_cmpltd_petitioner','add_cmpltd_date'];
            var check = true
            var checkTable = ['F5T5', 'F5T6_RCV']

            ___validateSave(allowedDocket,$("#add_cmpltd_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addCMPLTDSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addCMPLTDProceedButton").removeClass("hidden")
                }
            });
        });

        $(".addCMPLTDCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addCMPLTDSubmitButton").removeClass("hidden")
            $(".addCMPLTDProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addCMPLTDProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_cmpltd_docket_no").val(),
                "petitioner": $("#add_cmpltd_petitioner").val(),
                "completed_date" : $("#add_cmpltd_date").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" : $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addCMPLTDProceedButton").attr('disabled',false)
                $("#modal-cmpltd-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T6PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })
        //ADD
        //ADD_CMPLTD

        //CMPLTD

        var ___tableControlsCMPLTD = function(){
            $(".btn-cmpltd-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-cmpltd-delete").modal();
            });    

            //Delete
            $(".deleteCMPLTDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                    $("#modal-cmpltd-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteCMPLTDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T6PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-cmpltd-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-cmpltd-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_CMPLTD',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editCMPLTDSubmitButton").removeClass("hidden");
                    $(".editCMPLTDProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_cmpltd_docket_no").val(payload.docket_no)
                        $("#edit_cmpltd_id").val(payload.id)
                        $("#edit_cmpltd_petitioner").val(payload.petitioner)
                        $("#edit_cmpltd_date").val(payload.completed_date)
                        $("#edit_cmpltd_field_office").val(payload.field_office).trigger("change");
                        $("#edit_cmpltd_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editCMPLTDSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editCMPLTDSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editCMPLTDProceedButton").removeClass("hidden")
            });

            $(".editCMPLTDCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editCMPLTDSubmitButton").removeClass("hidden")
                $(".editCMPLTDProceedButton").addClass("hidden")
            });


            //Update
            $(".editCMPLTDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_cmpltd_id").val(),
                    "docket_no" : $("#edit_cmpltd_docket_no").val(),
                    "petitioner" : $("#edit_cmpltd_petitioner").val(),
                    "completed_date" : $("#edit_cmpltd_date").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editCMPLTDProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-cmpltd-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T6PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }

        //CMPLTD

    };


    var __attachF5T7PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T7_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T7',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T7_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer+"</td>"+
                                                
                                                "<td class='center'>"+data.case_classification+"</td>"+
                                                "<td class='center'>"+data.supervising_officer+"</td>"+
                                                "<td class='center'>"+data.received_date+"</td>"+
                                                "<td class='center'>"+data.probation_start+"</td>"+
                                                "<td class='center'>"+data.probation_end+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='btn btn-success btn-sm btn-edit access_f5_write' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T7_tbody").append(
                        "<tr>"+
                            "<td colspan='12' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T7").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table7",
                filename: "Form5-Table7.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [  'JPS', 'PS', 'JRPS', 'RPS', 'JTPS', 'TPS'];
            var requiredField= [ 'add_probationer','add_date_rcv','add_supervising','add_start','add_end'];          
            

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){          
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "received_date" : $("#add_date_rcv").val(),
                "case_classification" : $("#add_case_classification").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "probation_start" : $("#add_start").val(),
                "probation_end" : $("#add_end").val(),
                
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T7',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T7PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T7',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T7PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T7',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_date_rcv").val(payload.received_date)
                        $("#edit_case_classification").val(payload.case_classification).trigger("change")
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_start").val(payload.probation_start)
                        $("#edit_end").val(payload.probation_end)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "received_date" : $("#edit_date_rcv").val(),
                    "case_classification" : $("#edit_case_classification").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "probation_start" : $("#edit_start").val(),
                    "probation_end" : $("#edit_end").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T7',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T7PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };

    var __attachF5T8PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T8_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T8',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T8_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer+"</td>"+
                                                
                                                "<td class='center'>"+data.referral_type+"</td>"+
                                                "<td class='center'>"+data.cc_no+"</td>"+
                                                "<td class='center'>"+data.court_origin+"</td>"+
                                                "<td class='center'>"+data.case_classification+"</td>"+
                                                "<td class='center'>"+data.supervising_officer+"</td>"+
                                                "<td class='center'>"+data.received_date+"</td>"+
                                                "<td class='center'>"+data.probation_start+"</td>"+
                                                "<td class='center'>"+data.probation_end+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T8_tbody").append(
                        "<tr>"+
                            "<td colspan='13' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T8").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table8",
                filename: "Form5-Table8.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [  'JPS', 'PS', 'JRPS', 'RPS', 'JTPS', 'TPS'];
            var requiredField= [ 'add_probationer','add_cc_no','add_court_origin','add_date_rcv','add_supervising'];          
            
            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){      
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "cc_no": $("#add_cc_no").val(),
                "court_origin": $("#add_court_origin").val(),
                "referral_type": $("#add_type_referrals").val(),
                "case_classification": $("#add_case_classification").val(),
                "received_date" : $("#add_date_rcv").val(),
                "case_classification" : $("#add_case_classification").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "probation_start" : $("#add_start").val(),
                "probation_end" : $("#add_end").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T8',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T8PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T8',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T8PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T8',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_type_referrals").val(payload.referral_type).trigger("change");

                        $("#edit_date_rcv").val(payload.received_date)
                        $("#edit_cc_no").val(payload.cc_no)
                        $("#edit_court_origin").val(payload.court_origin)
                        $("#edit_case_classification").val(payload.case_classification).trigger("change")
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_start").val(payload.probation_start)
                        $("#edit_end").val(payload.probation_end)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "referral_type" : $("#edit_type_referrals").val(),
                    "received_date" : $("#edit_date_rcv").val(),
                    "case_classification" : $("#edit_case_classification").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "cc_no": $("#edit_cc_no").val(),
                    "court_origin": $("#edit_court_origin").val(),
                    "probation_start" : $("#edit_start").val(),
                    "probation_end" : $("#edit_end").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T8',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T8PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };
    var __attachF5T9PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T9_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        //OFFICE_FINDINGS_SUPV_TERMINATION
        //Termination - Full Term
        //Termination - Early Termination
        //Termination - Died
        //REVOC
        //Revocation - Abscond
        //Revocation - Commission of Another Offense
        //Revocation - Violation of Probation Conditions
        //Revocation - Other
        //
        //Extension of Probation Period
        //

        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T9',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);

                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F5T9_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer.toUpperCase()+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Full Term" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Early Termination" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Died" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Abscond" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Commission of Another Offense" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Violation of Probation Conditions" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Other" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Extension of Probation Period" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Transfer to Other Courts/PPO" ? data.disposed_date : "")+"</td>"+
                                                /*"<td class='center'>"+(data.disposed_decision == "Others" ? data.disposed_date : "")+"</td>"+*/
                                                "<td class='center'>"+data.reason_other+"</td>"+
                                                "<td class='center'>"+data.transfer+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='btn btn-success btn-sm btn-edit access_f5_write' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T9_tbody").append(
                        "<tr>"+
                            "<td colspan='14' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T9").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table9",
                filename: "Form5-Table9.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPS', 'PS', 'JRPS', 'RPS', 'JTPS', 'TPS' ];
            var requiredField= [ 'add_probationer','add_submitted'];
            var check = true
            var checkTable = ['F5T7', 'F5T8']

            ___validateSave(allowedDocket,$("#add_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addProceedButton").removeClass("hidden")
                }
            })
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "disposed_decision": $("#add_findings").val(),
                "disposed_date" : $("#add_submitted").val(),
                "Y_M": $.wms.urlParam('date'),
                "probationer" : $("#add_probationer").val(),
                "reason_other" : $("#add_reason_other").val(),
                "transfer" : $("#add_transfer").val(),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T9',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T9PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T9',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T9PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T9',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_findings").val(payload.disposed_decision).trigger("change")
                        $("#edit_reason_other").val(payload.reason_other)
                        $("#edit_transfer").val(payload.transfer)
                        $("#edit_submitted").val(payload.disposed_date)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "reason_other" : $("#edit_reason_other").val(),
                    "transfer" : $("#edit_transfer").val(),
                    "disposed_decision" : $("#edit_findings").val(),
                    "disposed_date" : $("#edit_submitted").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T9',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T9PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };
    
    var __attachF5T10PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T10_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        //OFFICE_FINDINGS_SUPV_TERMINATION
        //Termination - Full Term
        //Termination - Early Termination
        //Termination - Died
        //REVOC
        //Revocation - Abscond
        //Revocation - Commission of Another Offense
        //Revocation - Violation of Probation Conditions
        //Revocation - Other
        //
        //Extension of Probation Period
        //

        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T10',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    var termination = "";
                    var revocation = "";
                    var ext = "";
                    var transfer = "";
                    var Others = "";

                    switch(data.submitted_decision){
                        case "Termination - Full Term":
                        case "Termination - Early Termination":
                        case "Termination - Died": termination = data.submitted_date;break;
                        case "Revocation - Abscond":
                        case "Revocation - Commission of Another Offense":
                        case "Revocation - Violation of Probation Conditions":
                        case "Revocation - Other":  revocation = data.submitted_date; break;
                        case "Extension of Probation Period": ext = data.submitted_date; break;
                        case "Transfer to Other Courts/PPO": transfer = data.submitted_date; break;
                        case "Others": Others = data.submitted_date; break;
                    }
                    $('.F5T10_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer.toUpperCase()+"</td>"+
                                                "<td class='center'>"+termination+"</td>"+
                                                "<td class='center'>"+revocation+"</td>"+

                                                "<td class='center'>"+ext+"</td>"+
                                                "<td class='center'>"+transfer+"</td>"+
                                                "<td class='center'>"+Others+"</td>"+
                                                "<td class='center'>"+data.supervising_officer+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T10_tbody").append(
                        "<tr>"+
                            "<td colspan='14' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T10").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table10",
                filename: "Form5-Table10.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPS', 'PS', 'JRPS', 'RPS', 'JTPS', 'TPS' ]     
            var requiredField= [ 'add_probationer', 'add_submitted', 'add_supervising'];

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){

                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }

        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "submitted_decision": $("#add_findings").val(),
                "submitted_date" : $("#add_submitted").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T10',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T10PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T10',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T10PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T10',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_findings").val(payload.submitted_decision).trigger("change")
                        $("#edit_submitted").val(payload.submitted_date)
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "submitted_decision" : $("#edit_findings").val(),
                    "submitted_date" : $("#edit_submitted").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T10',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T10PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };
    
    
    var __attachF5T11PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T11_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        //OFFICE_FINDINGS_SUPV_TERMINATION
        //Termination - Full Term
        //Termination - Early Termination
        //Termination - Died
        //REVOC
        //Revocation - Abscond
        //Revocation - Commission of Another Offense
        //Revocation - Violation of Probation Conditions
        //Revocation - Other
        //
        //Extension of Probation Period
        //

        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T11',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    var termination = "";
                    var revocation = "";

                    switch(data.disposed_decision){
                        case "Termination - Full Term":
                        case "Termination - Early Termination":
                        case "Termination - Died": termination = data.disposed_date;break;
                        case "Revocation - Abscond":
                        case "Revocation - Commission of Another Offense":
                        case "Revocation - Violation of Probation Conditions":
                        case "Revocation - Other":  revocation = data.disposed_date; break;
                    }
                    
                    $('.F5T11_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer.toUpperCase()+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Full Term" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Early Termination" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Termination - Died" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Abscond" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Commission of Another Offense" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Violation of Probation Conditions" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Revocation - Other" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Extension of Probation Period" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+(data.disposed_decision == "Transfer to Other Courts/PPO" ? data.disposed_date : "")+"</td>"+
                                                "<td class='center'>"+data.reason_other+"</td>"+
                                                "<td class='center'>"+data.transfer+"</td>"+
                                                
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='btn btn-danger access_f5_write btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T11_tbody").append(
                        "<tr>"+
                            "<td colspan='16' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T11").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table11",
                filename: "Form5-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JPS', 'PS', 'JRPS', 'RPS', 'JTPS', 'TPS' ]       
            var requiredField= [ 'add_probationer','add_submitted'];
            var check = true
            var checkTable = ['F5T9', 'F5T10']

            ___validateSave(allowedDocket,$("#add_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addProceedButton").removeClass("hidden")
                }
            });
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "disposed_decision": $("#add_findings").val(),
                "disposed_date" : $("#add_submitted").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "reason_other" : $("#add_reason_other").val(),
                "transfer" : $("#add_transfer").val(),
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T11',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T11PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T11',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T11PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T11',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_findings").val(payload.disposed_decision).trigger("change")
                        $("#edit_reason_other").val(payload.reason_other)
                        $("#edit_transfer").val(payload.transfer)

                        $("#edit_submitted").val(payload.disposed_date)
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "disposed_decision" : $("#edit_findings").val(),
                    "reason_other" : $("#edit_reason_other").val(),
                    "transfer" : $("#edit_transfer").val(),
                    "disposed_date" : $("#edit_submitted").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T11',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T11PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };

    var __attachF5T12PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T12_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        //OFFICE_FINDINGS_SUPV_TERMINATION
        //Termination - Full Term
        //Termination - Early Termination
        //Termination - Died
        //REVOC
        //Revocation - Abscond
        //Revocation - Commission of Another Offense
        //Revocation - Violation of Probation Conditions
        //Revocation - Other
        //
        //Extension of Probation Period
        //

        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T12',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    var termination = "";
                    var revocation = "";

                    switch(data.disposed_decision){
                        case "Termination - Full Term":
                        case "Termination - Early Termination":
                        case "Termination - Died": termination = data.disposed_date;break;
                        case "Revocation - Abscond":
                        case "Revocation - Commission of Another Offense":
                        case "Revocation - Violation of Probation Conditions":
                        case "Revocation - Other":  revocation = data.disposed_date; break;
                    }
                    
                    $('.F5T12_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.probationer.toUpperCase()+"</td>"+
                                                "<td>"+data.referral_office+"</td>"+
                                                "<td>"+data.received_date+"</td>"+
                                                "<td>"+data.supervising_officer+"</td>"+
                                                "<td>"+data.reasons+"</td>"+
                                                "<td>"+data.case_classification+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f5_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f5_write btn btn-danger btn-sm btn-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F5T12_tbody").append(
                        "<tr>"+
                            "<td colspan='14' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T12").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table12",
                filename: "Form5-Table12.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPS', 'CPS'];
            var requiredField= [ 'add_probationer','add_reasons','add_date_rcv','add_supervising'];          
            

            if(___validateSave(allowedDocket,$("#add_docket_no"),requiredField)){   
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addProceedButton").removeClass("hidden")
            }
        });

        $(".addCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addSubmitButton").removeClass("hidden")
            $(".addProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_docket_no").val(),
                "probationer": $("#add_probationer").val(),
                "referral_office": $("#add_referring_office").val(),
                "reasons": $("#add_reasons").val(),
                "case_classification": $("#add_case_classification").val(),
                "received_date": $("#add_date_rcv").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T12',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T12PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T12',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T12PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T12',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_referring_office").val(payload.referral_office).trigger("change");
                        $("#edit_reasons").val(payload.reasons)
                        $("#edit_case_classification").val(payload.case_classification).trigger("change")
                        $("#edit_date_rcv").val(payload.received_date)
                        
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                        $("#edit_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editProceedButton").removeClass("hidden")
            });

            $(".editCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editSubmitButton").removeClass("hidden")
                $(".editProceedButton").addClass("hidden")
            });


            //Update
            $(".editProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_id").val(),
                    "docket_no" : $("#edit_docket_no").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "referral_office" : $("#edit_referring_office").val(),
                    "reasons" : $("#edit_reasons").val(),
                    "case_classification" : $("#edit_case_classification").val(),
                    "received_date" : $("#edit_date_rcv").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T12',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T12PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };

    var __attachF5T13PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F5T13_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_RCV',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
                
                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1;
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            //console.log(data);
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            $("#r"+r+"c1").html(data.docket_no.toUpperCase());
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.cc_no);
                            $("#r"+r+"c4").html(data.court_origin);
                            $("#r"+r+"c5").html(data.referral_office);
                            $("#r"+r+"c6").html(data.supervising_officer);
                            $("#r"+r+"c7").html(data.period);
                            $("#r"+r+"c8").html(data.received_date);
                            $("#r"+r+"c9").html(data.case_classification);
                            $("#r"+r+"c10").html(data.field_office).addClass("options");
                            $("#r"+r+"c11").html(source).addClass("options");
                            $("#r"+r+"c12").html("<button class='access_f5_write btn btn-success btn-xs btn-rcv-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-rcv-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControlsRCV();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });


        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_TERM',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            __counter += 1;
            if(result.status != undefined && result.status == "SUCCESS"){
                if(result.payload.length > __maxTableSize){
                    __maxTableSize = result.payload.length
                    // console.log(__maxTableSize);
                }
                
                function checkPendingRequest() {
                    if ($.active > 0) {
                        console.log("waiting...")
                        window.setTimeout(checkPendingRequest, 100);
                    }
                    else {
                        r = 1;
                        result.payload.forEach(function(data){
                           data = $.wms.upper($.wms.sanitize(data))
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            //console.log(data);
                            //$("#r"+r+"c1").html(data.docket_no.toUpperCase());
                            $("#r"+r+"c13").html("("+data.docket_no.toUpperCase()+") "+data.probationer);
                            $("#r"+r+"c14").html(data.terminated_date);
                            $("#r"+r+"c15").html(data.field_office).addClass("options");
                            $("#r"+r+"c16").html(source).addClass("options");
                            $("#r"+r+"c17").html("<button class='access_f5_write btn btn-success btn-xs btn-cmpltd-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f5_write btn btn-danger btn-xs btn-cmpltd-delete hidden'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControlsCMPLTD();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var ___checker = function(){
            if(__counter == 2){
                console.log("FINISH")
                console.log(__maxTableSize);
                if(__maxTableSize > 0){

                    $(".F5T13_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F5T13_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class=''>"+
                                "<td id='r"+i+"c9' class=''>"+
                                "<td id='r"+i+"c10' class='options'>"+
                                "<td id='r"+i+"c11' class='options'>"+
                                "<td id='r"+i+"c12' class='options'>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class='options'>"+
                                "<td id='r"+i+"c16' class='options'>"+
                                "<td id='r"+i+"c17' class='options'>"+
                            "</tr>"
                            )
                    }

                }else{
                    $(".F5T13_tbody").append(
                            "<tr>"+
                                "<td colspan='17' class='center b'>NONE</td>"+
                            "</tr>");
                }

            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F5T13").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form5-Table13",
                filename: "Form5-Table13.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //ADD
        
        $(".addRCVSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPS', 'CPS'];
            var requiredField= [ 'add_rcv_docket_no','add_rcv_probationer','add_rcv_case_no','add_rcv_court_origin','add_rcv_date_rcv','add_rcv_supervising','add_rcv_period'];          
            

            if(___validateSave(allowedDocket,$("#add_rcv_docket_no"),requiredField)){      

                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".addRCVSubmitButton").addClass("hidden");
                $(".confirmAdd").removeClass("hidden")
                $(".addRCVProceedButton").removeClass("hidden")
            }
        });

        $(".addRCVCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addRCVSubmitButton").removeClass("hidden")
            $(".addRCVProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addRCVProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_rcv_docket_no").val(),
                "probationer" : $("#add_rcv_probationer").val(),
                "referral_office" : $("#add_rcv_referring_office").val(),
                "received_date" : $("#add_rcv_date_rcv").val(),
                "court_origin" : $("#add_rcv_court_origin").val(),
                "cc_no" : $("#add_rcv_case_no").val(),
                "supervising_officer" : $("#add_rcv_supervising").val(),
                "period" : $("#add_rcv_period").val(),
                "case_classification" : $("#add_rcv_classification").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" : $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_RCV',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addRCVProceedButton").attr('disabled',false)
                $("#modal-rcv-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T13PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })
        //ADD

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            //$(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControlsRCV = function(){
            $(".btn-rcv-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-delete").modal();
            });    

            //Delete
            $(".deleteRCVProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_RCV',JSON.stringify(payload)).done(function (result) {
                    $("#modal-rcv-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteRCVProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T13PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-rcv-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_RCV',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editRCVSubmitButton").removeClass("hidden");
                    $(".editRCVroceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_rcv_docket_no").val(payload.docket_no)
                        $("#edit_rcv_id").val(payload.id)
                        $("#edit_rcv_probationer").val(payload.probationer)
                        $("#edit_rcv_referring_office").val(payload.referral_office).trigger("change")
                        $("#edit_rcv_court_origin").val(payload.court_origin)
                        $("#edit_rcv_case_no").val(payload.cc_no)
                        $("#edit_rcv_date_rcv").val(payload.received_date)
                        $("#edit_rcv_supervising").val(payload.supervising_officer)
                        $("#edit_rcv_period").val(payload.period)
                        $("#edit_rcv_classification").val(payload.case_classification)
                        $("#edit_rcv_field_office").val(payload.field_office).trigger("change");
                        $("#edit_rcv_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editRCVSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editRCVSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editRCVProceedButton").removeClass("hidden")
            });

            $(".editRCVCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editRCVSubmitButton").removeClass("hidden")
                $(".editRCVProceedButton").addClass("hidden")
            });


            //Update
            $(".editRCVProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_rcv_id").val(),
                    "docket_no" : $("#edit_rcv_docket_no").val(),
                    "probationer" : $("#edit_rcv_probationer").val(),
                    "referral_office" : $("#edit_rcv_referring_office").val(),
                    "received_date" : $("#edit_rcv_date_rcv").val(),
                    "court_origin" : $("#edit_rcv_court_origin").val(),
                    "cc_no" : $("#edit_rcv_case_no").val(),
                    "supervising_officer" : $("#edit_rcv_supervising").val(),
                    "period" : $("#edit_rcv_period").val(),
                    "case_classification" : $("#edit_rcv_classification").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_RCV',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editRCVProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-rcv-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T13PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

        //ADD_CMPLTD
        //ADD
        
        $(".addCMPLTDSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'JCPS', 'CPS' ];
            var requiredField= [ 'add_cmpltd_petitioner','add_cmpltd_date'];
            var check = true
            var checkTable = ['F5T12', 'F5T13_RCV']

            ___validateSave(allowedDocket,$("#add_cmpltd_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addCMPLTDSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addCMPLTDProceedButton").removeClass("hidden")
                }
            });
        });

        $(".addCMPLTDCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addCMPLTDSubmitButton").removeClass("hidden")
            $(".addCMPLTDProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addCMPLTDProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_cmpltd_docket_no").val(),
                "probationer": $("#add_cmpltd_petitioner").val(),
                "terminated_date" : $("#add_cmpltd_date").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office" : $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_TERM',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addCMPLTDProceedButton").attr('disabled',false)
                $("#modal-cmpltd-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF5T13PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })
        //ADD
        //ADD_CMPLTD

        //CMPLTD

        var ___tableControlsCMPLTD = function(){
            $(".btn-cmpltd-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-cmpltd-delete").modal();
            });    

            //Delete
            $(".deleteCMPLTDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_TERM',JSON.stringify(payload)).done(function (result) {
                    $("#modal-cmpltd-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteCMPLTDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF5T13PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-cmpltd-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-cmpltd-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_TERM',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editCMPLTDSubmitButton").removeClass("hidden");
                    $(".editCMPLTDProceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_cmpltd_docket_no").val(payload.docket_no)
                        $("#edit_cmpltd_id").val(payload.id)
                        $("#edit_cmpltd_petitioner").val(payload.probationer)
                        $("#edit_cmpltd_date").val(payload.terminated_date)
                        $("#edit_cmpltd_field_office").val(payload.field_office).trigger("change");
                        $("#edit_cmpltd_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editCMPLTDSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editCMPLTDSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editCMPLTDProceedButton").removeClass("hidden")
            });

            $(".editCMPLTDCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editCMPLTDSubmitButton").removeClass("hidden")
                $(".editCMPLTDProceedButton").addClass("hidden")
            });


            //Update
            $(".editCMPLTDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_cmpltd_id").val(),
                    "docket_no" : $("#edit_cmpltd_docket_no").val(),
                    "probationer" : $("#edit_cmpltd_petitioner").val(),
                    "terminated_date" : $("#edit_cmpltd_date").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/F5T13_TERM',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editCMPLTDProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-cmpltd-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF5T13PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }

        //CMPLTD

    };


    var __attachF5PCSPageEvent = function() {
        var field_office =  $.wms.urlParam('field')
        var date =  $.wms.urlParam('date')
        $(".office_selected").html(field_office)

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        var month = monthNames[date.substr(5,6)-1];
        $(".year_selected").html(date.substr(0,4))
        $(".month_selected").html(month)


    };

    

    return {
        attachF5T1PageEvent : __attachF5T1PageEvent,
        attachF5T2PageEvent : __attachF5T2PageEvent,
        attachF5T3PageEvent : __attachF5T3PageEvent,
        attachF5T4PageEvent : __attachF5T4PageEvent,
        attachF5T5PageEvent : __attachF5T5PageEvent,
        attachF5T6PageEvent : __attachF5T6PageEvent,
        attachF5T7PageEvent : __attachF5T7PageEvent,
        attachF5T8PageEvent : __attachF5T8PageEvent,
        attachF5T9PageEvent : __attachF5T9PageEvent,
        attachF5T10PageEvent : __attachF5T10PageEvent,
        attachF5T11PageEvent : __attachF5T11PageEvent,
        attachF5T12PageEvent : __attachF5T12PageEvent,
        attachF5T13PageEvent : __attachF5T13PageEvent,
        attachF5PCSPageEvent : __attachF5PCSPageEvent
    };
}());
