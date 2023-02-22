/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.form21 = (typeof $.wms.form21 !== 'undefined') ? $.wms : {};

$.wms.form21 = (function() {


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
                dtype = $("#"+data).attr('type')
                if($("#"+data).val() == ""){
                    dontSubmit = true;
                    if(dtype == 'text'){
                        $("#"+data).addClass("error_field");
                        $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter(("#"+data))    
                    }else{
                        $("#select2-"+data+"-container").parent().addClass("error_field");
                        $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter($("#select2-"+data+"-container"))    

                    }
                    
                }else{
                    if(dtype == 'text'){
                        $("#"+data).removeClass("error_field");
                    }else{
                        $("#select2-"+data+"-container").parent().removeClass("error_field");
                    }
                }
                /*console.log($("#"+data).attr('type'))

                if($("#"+data).val() == ""){
                    dontSubmit = true;
                    $("#"+data).addClass("error_field");
                    $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter(("#"+data))
                }else{
                    $("#"+data).removeClass("error_field");
                }*/
            });
            var d = $.Deferred();
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/validateDocket',JSON.stringify(payload)).done(function (result2) {   
                if(result2.status == 'SUCCESS'){

                }else{
                    dontSubmit = true;
                    docket.addClass("error_field")
                    checkTable = checkTable.join("/")
                    $("<p class='err_msg color-red font_12 i'>*Docket not found in "+checkTable+"</p>").insertAfter(docket)
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
            dtype = $("#"+data).attr('type')
            if($("#"+data).val() == ""){
                dontSubmit = true;
                if(dtype == 'text'){
                    $("#"+data).addClass("error_field");
                    $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter(("#"+data))    
                }else{
                    $("#select2-"+data+"-container").parent().addClass("error_field");
                    $("<p class='err_msg color-red font_12 i'>*Required Field</p>").insertAfter($("#select2-"+data+"-container"))    

                }
                
            }else{
                if(dtype == 'text'){
                    $("#"+data).removeClass("error_field");
                }else{
                    $("#select2-"+data+"-container").parent().removeClass("error_field");
                }
            }
            });

            if(dontSubmit){
                return false;
            }else{
                return true;    
            }

            
        }
            
       
        
        

    }


    var __attachF21T1PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T1_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T1',JSON.stringify(payload)).done(function (result) {
            
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F21T1_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+data.date_rcv+"</td>"+
                                                "<td>"+data.investigating_officer+"</td>"+
                                                "<td class='options'>"+data.field_office+"</td>"+
                                                "<td class='options'>"+source+"</td>"+
                                                "<td align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f21_write btn btn-danger btn-sm btn-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
            }else{
                console.log("NO FOUND")
                $('.F21T1_tbody').append("<tr>"+
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
                    "ID" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T1',JSON.stringify(payload)).done(function (result2) {
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
                "method" : "update"
            }
            console.log(payload)
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T1',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".editProceedButton").attr('disabled',false)
                $("#modal-edit").modal('toggle')
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T1PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T1").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table1",
                filename: "Form21-Table1.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PPI', 'PECI', 'TPPI', 'TPECI' ];
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
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T1',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                $(".btn-reset").trigger("click")    
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T1PageEvent();
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
                "status" : "0",
                "method" : "update"
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T1',JSON.stringify(payload)).done(function (result) {
                $("#modal-delete").modal('toggle')
                $(".modal-loader").addClass("hidden")
                $(".deleteProceedButton").attr('disabled',false)
                if(result.status != undefined && result.status == "SUCCESS"){
                   //__attachF21T1PageEvent();
                   location.reload();
                }
            });    
        })
    };


    var __attachF21T2PageEvent = function() {
        var __maxTableSize = 0;
        var __counter = 0;


        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T2_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_RCV',JSON.stringify(payload)).done(function (result) {
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
                            //console.log(data);\
                            source = ((data.source==1) ? 'PIS' : 'MANUAL');
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.petitioner_name);
                            $("#r"+r+"c3").html(data.case_no);
                            $("#r"+r+"c4").html(data.prison_name + " (" + data.prison_type + ")");
                            $("#r"+r+"c5").html(data.offense);
                            $("#r"+r+"c6").html(data.received_date);
                            $("#r"+r+"c7").html(data.investigating_officer_name);
                            $("#r"+r+"c8").html(data.field_office);
                            $("#r"+r+"c9").html(source);
                            $("#r"+r+"c10").html("<td width='' align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-rcv-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                            "<button class='access_f21_write btn btn-danger btn-sm btn-rcv-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>");

                            r += 1;
                        });


                        ___updateRCV_event();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });    

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_ACTED',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c11").html(data.petitioner_name + " (" + data.docket_no +")");
                            $("#r"+r+"c12").html(data.psir_date);
                            $("#r"+r+"c13").html(data.ppo_recommendation);
                            $("#r"+r+"c14").html(data.transfer_date);
                            $("#r"+r+"c15").html(data.transfer_to);
                            $("#r"+r+"c16").html(data.field_office);
                            $("#r"+r+"c17").html(source);
                            $("#r"+r+"c18").html("<td width='' align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-acted-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                            "<button class='access_f21_write btn btn-danger btn-sm btn-acted-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>");

                            r += 1;
                        });

                        ___updateACTED_event();
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

                    $(".F21T2_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T2_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class='options'>"+
                                "<td id='r"+i+"c10' class='options'>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class='options'>"+
                                "<td id='r"+i+"c17' class='options'>"+
                                "<td id='r"+i+"c18' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T2_tbody").append(
                            "<tr>"+
                                "<td colspan='19' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }
        
        //Add RCV
        $(".addSubmitRCVButton").unbind("click").on("click",function(){

            var allowedDocket= [ 'PPI', 'PECI', 'TPPI', 'TPECI' ];
            var requiredField= [ 'add_rcv_petitioner', 'add_rcv_date_rcv', 'add_rcv_investigating_officer'];

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
                "prison_name": $("#add_rcv_court_origin").val(),
                "prison_type": $("#add_rcv_from").val(),
                "offense": $("#add_rcv_offense").val(),
                /*"sentence" : $("#add_rcv_sentence").val(),
                "date_of_court_order": $("#add_rcv_date_of_court_order").val(),*/
                "received_date": $("#add_rcv_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "investigating_officer_name": $("#add_rcv_investigating_officer").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_RCV',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                ___modalReset();
               
                $(".addSubmitRCVButton").removeClass("hidden")
                $(".addProceedRCVButton").addClass("hidden")
                $("#modal-add-rcv").modal('toggle')
                
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T2PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })



        //Add ACTED
        $(".addSubmitACTEDButton").unbind("click").on("click",function(){

            var allowedDocket= [ 'PPI', 'PECI', 'TPPI', 'TPECI' ];
            var requiredField= [ 'add_acted_petitioner'];

            var check = true
            var checkTable = ['F21T1', 'F21T2_RCV']

            ___validateSave(allowedDocket,$("#add_acted_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addSubmitACTEDButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addProceedACTEDButton").removeClass("hidden")
                }
            })
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
                "received_date": $("#add_acted_date_rcv").val(),
                "transfer_date": $("#add_acted_transfer_date").val(),
                "transfer_to": $("#add_acted_transfer_to").val(),
                "field_office":$.wms.urlParam('field'),
                "ppo_recommendation" : $("#add_acted_recommendation").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_ACTED',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                ___modalReset();

                $(".addSubmitACTEDButton").removeClass("hidden")
                $(".addProceedACTEDButton").addClass("hidden")
                $("#modal-add-acted").modal('toggle')
                
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T2PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        });


        


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T2").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table2",
                filename: "Form21-Table2.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        var ___updateRCV_event = function(){

            $(".btn-rcv-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-delete").modal('toggle');
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_RCV',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    ___modalReset();
                     $("#modal-rcv-delete").modal('toggle');
                    $(".deleteRCVProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T2PageEvent();
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
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_RCV',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_rcv_docket_no").val(payload.docket_no)
                        $("#edit_rcv_id").val(payload.id)
                        $("#edit_rcv_petitioner").val(payload.petitioner_name)
                        $("#edit_rcv_case_no").val(payload.case_no)
                        $("#edit_rcv_court_origin").val(payload.prison_name)
                        $("#edit_rcv_from").val(payload.prison_type).trigger("change");
                        $("#edit_rcv_offense").val(payload.offense)
                        /*$("#edit_rcv_sentence").val(payload.sentence)
                        $("#edit_rcv_date_of_court_order").val(payload.date_of_court_order)*/
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

            //Update
            //@TODO
            $(".editProceedRCVButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_rcv_id").val(),
                    "docket_no" : $("#edit_rcv_docket_no").val(),
                    "petitioner_name": $("#edit_rcv_petitioner").val(),
                    "date_rcv": $("#edit_date_rcv").val(),
                    "case_no" : $("#edit_rcv_case_no").val(),
                    "offense" :  $("#edit_rcv_offense").val(),
                    "received_date" : $("#edit_rcv_date_rcv").val(),
                    "prison_name": $("#edit_rcv_court_origin").val(),
                    "prison_type": $("#edit_rcv_from").val(),
                    "field_office": $.wms.urlParam('field'),
                    "investigating_officer_name": $("#edit_rcv_investigating_officer").val(),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_RCV',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    ___modalReset();
                    $("#modal-edit-rcv").modal('toggle')
                    $(".editSubmitRCVButton").removeClass("hidden")
                    $(".editProceedRCVButton").addClass("hidden")
                    $(".editProceedRCVButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T2PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }

        var ___updateACTED_event = function(){

            $(".btn-acted-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-acted-delete").modal('toggle');
            });    

            //Delete
            $(".deleteACTEDProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_ACTED',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    ___modalReset();
                     $("#modal-acted-delete").modal('toggle');
                    $(".deleteACTEDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T2PageEvent();
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
                    "id" : data_id,
                    "method" : "fetchByID"
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_ACTED',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#acted_acted_docket_no").val(payload.docket_no)
                        $("#acted_acted_id").val(payload.id)
                        $("#acted_acted_petitioner").val(payload.petitioner_name)
                        $("#acted_acted_psir").val(payload.psir_date)
                        $("#acted_acted_recommendation").val(payload.ppo_recommendation).trigger("change")
                        $("#acted_acted_transfer_date").val(payload.transfer_date)
                        $("#acted_acted_transfer_to").val(payload.transfer_to)
                        $("#acted_acted_field_office").val(payload.field_office).trigger("change");
                        $("#acted_acted_investigating_officer").val(payload.investigating_officer_name)
                        $("#acted_acted_Y_M").val(payload.Y_M).attr("disabled",true)
                       
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

            //Update
            //@TODO
            $(".editProceedACTEDButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#acted_acted_id").val(),
                    "docket_no" : $("#acted_acted_docket_no").val(),
                    "petitioner_name": $("#acted_acted_petitioner").val(),
                    "psir_date"  : $("#acted_acted_psir").val(),
                    "ppo_recommendation" : $("#acted_acted_recommendation").val(),
                    "transfer_date" : $("#acted_acted_transfer_date").val(),
                    "transfer_to" : $("#acted_acted_transfer_to").val(),
                    "field_office":$.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T2_ACTED',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    ___modalReset();
                    $("#modal-edit-acted").modal('toggle')
                    $(".editSubmitACTEDButton").removeClass("hidden")
                    $(".editProceedACTEDButton").addClass("hidden")
                    $(".editProceedACTEDButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T2PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }



    };

    var __attachF21T3PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T3_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T3',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F21T3_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+data.psir_date+"</td>"+
                                                "<td>"+(data.psir_rec == "Parole - For Granted" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Parole - For Denial" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Commutation - For Granted" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Commutation - For Denial" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Conditional Pardon - For Granted" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Conditional Pardon - For Denial" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Absolute Pardon - For Granted" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Absolute Pardon - For Denial" ? data.psir_date : "")+"</td>"+
                                                "<td>"+(data.psir_rec == "Other" ? data.psir_date : "")+"</td>"+
                                                /*"<td>"+data.manifest+"</td>"+*/
                                                "<td>"+data.investigating_officer+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f21_write btn btn-danger btn-sm btn-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F21T3_tbody").append(
                        "<tr>"+
                            "<td colspan='15' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T3").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table3",
                filename: "Form21-Table3.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PPI', 'PECI', 'TPPI', 'TPECI' ];
            var requiredField= [ 'add_petitioner', 'add_psir', 'add_psir_rec', 'add_investigating_officer'];

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
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T3',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T3PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T3',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T3PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T3',JSON.stringify(payload)).done(function (result2) {
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T3',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T3PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };

    var __attachF21T4PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T4_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T4',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                    data = $.wms.sanitize(data);
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F21T4_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                "<td>"+(data.disposed_decision == "PAROLE - Granted" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "COMMUTATION - Granted" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "CONDITIONAL - Granted" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "ABSOLUTE - Granted" ? data.disposed_date : "")+"</td>"+

                                                
                                                "<td>"+(data.disposed_decision == "PAROLE - Denial" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "COMMUTATION - Denial" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "CONDITIONAL - Denial" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "ABSOLUTE - Denial" ? data.disposed_date : "")+"</td>"+
                                                

                                                "<td>"+(data.disposed_decision == "PAROLE - Cancelled" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "COMMUTATION - Cancelled" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "CONDITIONAL - Cancelled" ? data.disposed_date : "")+"</td>"+
                                                /*"<td>"+(data.disposed_decision == "ABSOLUTE - Cancelled" ? data.disposed_date : "")+"</td>"+*/

                                                "<td>"+(data.disposed_decision == "Died" ? data.disposed_date : "")+"</td>"+
                                                "<td>"+(data.disposed_decision == "Others" ? data.disposed_date : "")+"</td>"+
                                                
                                                
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f21_write btn btn-danger btn-sm btn-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F21T4_tbody").append(
                        "<tr>"+
                            "<td colspan='17' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T4").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table4",
                filename: "Form21-Table4.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PPI', 'PECI', 'TPPI', 'TPECI' ];
            var requiredField= [ 'add_petitioner','add_psir', 'add_psir_rec'];
            var check = true
            var checkTable = ['F21T2_ACTED', 'F21T3']

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
                "petitioner": $("#add_petitioner").val(),
                "disposed_date": $("#add_psir").val(),
                "disposed_decision": $("#add_psir_rec").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert"
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T4',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T4PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T4',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T4PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T4',JSON.stringify(payload)).done(function (result2) {
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
                    "disposed_decision": $("#edit_psir_rec").val(),
                    "disposed_date": $("#edit_psir").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update"

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T4',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T4PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };


    var __attachF21T5PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T5_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T5',JSON.stringify(payload)).done(function (result) {
            console.log(result);
            $(".form_loader").addClass("hidden")
            $(".result_form").removeClass("hidden")
            if(result.status != undefined && result.status == "SUCCESS"){
                result.payload.forEach(function(data){
                   data = $.wms.upper($.wms.sanitize(data))
                    source = ((data.source==1) ? 'PIS' : 'MANUAL');
                    $('.F21T5_tbody').append("<tr>"+
                                                "<td><a class='docket_view' data-docket='"+data.docket_no.toUpperCase()+"' title='View Docket Investigation Record From PIS'>"+data.docket_no.toUpperCase()+"</a></td>"+
                                                "<td>"+data.petitioner.toUpperCase()+"</td>"+
                                                
                                                "<td class='center'>"+data.referring_office+"</td>"+
                                                "<td class='center'>"+data.received_date+"</td>"+
                                                "<td class='center'>"+data.investigating_officer+"</td>"+
                                                "<td class='center'>"+data.reasons+"</td>"+
                                                "<td class='options center'>"+data.field_office+"</td>"+
                                                "<td class='options center'>"+source+"</td>"+
                                                "<td width='15%' align='center' class='options'> <button class='access_f21_write btn btn-success btn-sm btn-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i> Update</button> "+
                                                "<button class='access_f21_write btn btn-danger btn-sm btn-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i> Delete</button> </td></tr>")
                });
                ___tableControls();
            }else{
                $(".F21T5_tbody").append(
                        "<tr>"+
                            "<td colspan='12' class='center b'>NONE</td>"+
                        "</tr>");
            }
        });


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T5").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table5",
                filename: "Form21-Table5.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'CPPI', 'CPECI' ];
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
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T5',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T5PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T5',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T5PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T5',JSON.stringify(payload)).done(function (result2) {
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T5',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T5PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };



    var __attachF21T6PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll"
        }
        $('.F21T6_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_RCV',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.petitioner);
                            $("#r"+r+"c3").html(data.referring_office);
                            $("#r"+r+"c4").html(data.received_date);
                            $("#r"+r+"c5").html(data.reasons);
                            $("#r"+r+"c6").html(data.investigating_officer);
                            $("#r"+r+"c7").html(data.field_office).addClass("options");
                            $("#r"+r+"c8").html(source).addClass("options");
                            $("#r"+r+"c9").html("<button class='access_f21_write btn btn-success btn-xs btn-rcv-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-rcv-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControlsRCV();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c10").html(data.petitioner + " (" + data.docket_no +")");
                            $("#r"+r+"c11").html(data.completed_date);
                            $("#r"+r+"c12").html(data.field_office).addClass("options");
                            $("#r"+r+"c13").html(source).addClass("options");
                            $("#r"+r+"c14").html("<button class='access_f21_write btn btn-success btn-xs btn-cmpltd-edit' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-cmpltd-delete'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
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

                    $(".F21T6_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T6_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class='options'>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class='options'>"+
                                "<td id='r"+i+"c10' class=''>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class='options'>"+
                                "<td id='r"+i+"c13' class='options'>"+
                                "<td id='r"+i+"c14' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T6_tbody").append(
                            "<tr>"+
                                "<td colspan='14' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T6").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table6",
                filename: "Form21-Table6.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //ADD
        
        $(".addRCVSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'CPPI', 'CPECI' ];
            var requiredField= [ 'add_rcv_petitioner', 'add_rcv_date_rcv', 'add_rcv_investigating_officer'];

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
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_RCV',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addRCVProceedButton").attr('disabled',false)
                $("#modal-rcv-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T6PageEvent();
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
            $(".modal-form select").val('').trigger('change');
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_RCV',JSON.stringify(payload)).done(function (result) {
                    $("#modal-rcv-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteRCVProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T6PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_RCV',JSON.stringify(payload)).done(function (result2) {
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_RCV',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editRCVProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-rcv-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T6PageEvent();
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
            var allowedDocket= [ 'CPPI', 'CPECI' ];
            var requiredField= [ 'add_cmpltd_petitioner','add_cmpltd_date'];
            var check = true
            var checkTable = ['F21T5', 'F21T6_RCV']

            ___validateSave(allowedDocket,$("#add_cmpltd_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addCMPLTDSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addCMPLTDProceedButton").removeClass("hidden")
                }
            })
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
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addCMPLTDProceedButton").attr('disabled',false)
                $("#modal-cmpltd-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T6PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                    $("#modal-cmpltd-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteCMPLTDProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T6PageEvent();
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_CMPLTD',JSON.stringify(payload)).done(function (result2) {
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
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T6_CMPLTD',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editCMPLTDProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-cmpltd-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T6PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }

        //CMPLTD

    };

    var __attachF21T7PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T7_PAROL"
        }
        $('.F21T7_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.case_classification);
                            $("#r"+r+"c4").html(data.supervising_officer);
                            $("#r"+r+"c5").html(data.received_date);
                            $("#r"+r+"c6").html(data.probation_start);
                            $("#r"+r+"c7").html(data.probation_end);
                            $("#r"+r+"c8").html(data.field_office).addClass("options");
                            $("#r"+r+"c9").html(source).addClass("options");
                            $("#r"+r+"c10").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T7_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T7_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T7_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c11").html(data.docket_no);
                            $("#r"+r+"c12").html(data.probationer);
                            $("#r"+r+"c13").html(data.case_classification);
                            $("#r"+r+"c14").html(data.supervising_officer);
                            $("#r"+r+"c15").html(data.received_date);
                            $("#r"+r+"c16").html(data.probation_start);
                            $("#r"+r+"c17").html(data.probation_end);
                            $("#r"+r+"c18").html(data.field_office).addClass("options");
                            $("#r"+r+"c19").html(source).addClass("options");
                            $("#r"+r+"c20").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T7_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T7_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();
                    }
                };
                window.setTimeout(checkPendingRequest, 100);
                  $.wms.dashboard.formControlCheck()

                
            }
            ___checker();
        });

        var ___checker = function(){
            if(__counter == 2){
                console.log("FINISH")
                console.log(__maxTableSize);
                if(__maxTableSize > 0){

                    $(".F21T7_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T7_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class='options'>"+
                                "<td id='r"+i+"c10' class=''>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class='options'>"+
                                "<td id='r"+i+"c19' class='options'>"+
                                "<td id='r"+i+"c20' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T7_tbody").append(
                            "<tr>"+
                                "<td colspan='20' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T7").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table7",
                filename: "Form21-Table7.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //ADD
        

        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_probationer', 'add_date_rcv', 'add_supervising','add_start','add_end'];

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
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-rcv-add").modal('toggle')
                ___modalReset();
                $("#modal-add").modal('toggle')
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T7PageEvent();
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
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


       
        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var data_table = $(this).data("table");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $(".sel-table").html(data_table)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T7PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var table = $(this).data("table");
                var docket_no = $(this).data("docket");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result2) {
                    console.log(result2);
                    $(".modal-form input").attr("disabled",false);
                    $(".modal-form select").attr("disabled",false);
                    $(".modal-loader2").addClass("hidden")
                    $(".modal-form").removeClass("hidden")
                    $(".confirmEdit").addClass("hidden")
                    $(".editSubmitButton").removeClass("hidden");
                    $(".editroceedButton").addClass("hidden")
                    if(result2.status != undefined && result2.status == "SUCCESS"){
                        var payload = result2.payload;
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_date_rcv").val(payload.received_date)
                        $("#edit_case_classification").val(payload.case_classification)
                        $("#edit_supervising").val(payload.supervising_officer)
                        $("#edit_start").val(payload.probation_start)
                        $("#edit_end").val(payload.probation_end)
                        $("#edit_field_office").val(payload.field_office).trigger("change");
                       
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
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T7',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").addClass("hidden").attr('disabled',false)

                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T7PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }


        

    };
   

    var __attachF21T8PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T8_PAROL"
        }
        $('.F21T8_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.referral_type);
                            $("#r"+r+"c4").html(data.received_date);
                            $("#r"+r+"c5").html(data.case_classification);
                            $("#r"+r+"c6").html(data.supervising_officer);
                            $("#r"+r+"c7").html(data.probation_start);
                            $("#r"+r+"c8").html(data.probation_end);
                            $("#r"+r+"c9").html(data.field_office).addClass("options");
                            $("#r"+r+"c10").html(source).addClass("options");
                            $("#r"+r+"c11").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T8_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T8_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T8_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c12").html(data.docket_no);
                            $("#r"+r+"c13").html(data.probationer);
                            $("#r"+r+"c14").html(data.referral_type);
                            $("#r"+r+"c15").html(data.received_date);
                            $("#r"+r+"c16").html(data.case_classification);
                            $("#r"+r+"c17").html(data.supervising_officer);
                            $("#r"+r+"c18").html(data.probation_start);
                            $("#r"+r+"c19").html(data.probation_end);
                            $("#r"+r+"c20").html(data.field_office).addClass("options");
                            $("#r"+r+"c21").html(source).addClass("options");
                            $("#r"+r+"c22").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T8_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T8_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();
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

                    $(".F21T8_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T8_tbody").append(
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
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class=''>"+
                                "<td id='r"+i+"c19' class=''>"+
                                "<td id='r"+i+"c20' class='options'>"+
                                "<td id='r"+i+"c21' class='options'>"+
                                "<td id='r"+i+"c22' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T8_tbody").append(
                            "<tr>"+
                                "<td colspan='22' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T8").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table8",
                filename: "Form21-Table8.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_probationer', 'add_date_rcv', 'add_supervising'];

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
                "referral_type": "SUPERVISION",
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
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T8PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $(".sel-table").html(table)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T8PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change")
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
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
                    "received_date" : $("#edit_date_rcv").val(),
                    "case_classification" : $("#edit_case_classification").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "cc_no": $("#edit_cc_no").val(),
                    "court_origin": $("#edit_court_origin").val(),
                    "probation_start" : $("#edit_start").val(),
                    "probation_end" : $("#edit_end").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T8',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T8PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
        

    };
    var __attachF21T9PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T9_PAROL"
        }
        $('.F21T9_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.disposed_decision == "SUMMARY" ? data.disposed_date : "");
                            $("#r"+r+"c4").html(data.disposed_decision == "INFRACTION" ? data.disposed_date : "");
                            $("#r"+r+"c5").html(data.disposed_decision == "DEATH" ? data.disposed_date : "");
                            $("#r"+r+"c6").html(data.disposed_decision == "OTHERS" ? data.disposed_date : "");
                            $("#r"+r+"c7").html(data.submitted_report);
                            $("#r"+r+"c8").html(data.transfer);
                            $("#r"+r+"c9").html(data.field_office).addClass("options");
                            $("#r"+r+"c10").html(source).addClass("options");
                            $("#r"+r+"c11").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T9_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T9_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T9_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c12").html(data.docket_no);
                            $("#r"+r+"c13").html(data.probationer);
                            $("#r"+r+"c14").html(data.disposed_decision == "SUMMARY" ? data.disposed_date : "");
                            $("#r"+r+"c15").html(data.disposed_decision == "INFRACTION" ? data.disposed_date : "");
                            $("#r"+r+"c16").html(data.disposed_decision == "DEATH" ? data.disposed_date : "");
                            $("#r"+r+"c17").html(data.disposed_decision == "OTHERS" ? data.disposed_date : "");
                            $("#r"+r+"c18").html(data.submitted_report);
                            $("#r"+r+"c19").html(data.transfer);
                            $("#r"+r+"c20").html(data.field_office).addClass("options");
                            $("#r"+r+"c21").html(source).addClass("options");
                            $("#r"+r+"c22").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T9_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T9_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();
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

                    $(".F21T9_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T9_tbody").append(
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
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class=''>"+
                                "<td id='r"+i+"c19' class=''>"+
                                "<td id='r"+i+"c20' class='options'>"+
                                "<td id='r"+i+"c21' class='options'>"+
                                "<td id='r"+i+"c22' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T9_tbody").append(
                            "<tr>"+
                                "<td colspan='22' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }

        


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T9").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table9",
                filename: "Form21-Table9.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_table','add_acted_petitioner','add_probationer', 'add_findings'];
            var check = true
            var checkTable = ['F21T7_PAROL','F21T7_PARDON','F21T8_PAROL','F21T8_PARDON']

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
                "submitted_report" : $("#add_submitted_report").val(),
                "transfer" : $("#add_transfer").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T9PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $(".sel-table").html(table)

                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T9PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_findings").val(payload.disposed_decision).trigger("change")
                        $("#edit_submitted").val(payload.disposed_date)
                        $("#edit_submitted_report").val(payload.submitted_report)
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
                    "disposed_date" : $("#edit_submitted").val(),
                    "submitted_report" : $("#edit_submitted_report").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T9',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T9PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };
    
    var __attachF21T10PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T10_PAROL"
        }
        $('.F21T10_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.submitted_decision == "SUMMARY" ? data.submitted_date : "");
                            $("#r"+r+"c4").html(data.submitted_decision == "INFRACTION" ? data.submitted_date : "");
                            $("#r"+r+"c5").html(data.submitted_decision == "DEATH" ? data.submitted_date : "");
                            $("#r"+r+"c6").html(data.supervising_officer);
                            $("#r"+r+"c7").html(data.field_office).addClass("options");
                            $("#r"+r+"c8").html(source).addClass("options");
                            $("#r"+r+"c9").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T10_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T10_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T10_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c10").html(data.docket_no);
                            $("#r"+r+"c11").html(data.probationer);
                            $("#r"+r+"c12").html(data.submitted_decision == "SUMMARY" ? data.submitted_date : "");
                            $("#r"+r+"c13").html(data.submitted_decision == "INFRACTION" ? data.submitted_date : "");
                            $("#r"+r+"c14").html(data.submitted_decision == "DEATH" ? data.submitted_date : "");
                            $("#r"+r+"c15").html(data.supervising_officer);
                            $("#r"+r+"c16").html(data.field_office).addClass("options");
                            $("#r"+r+"c17").html(source).addClass("options");
                            $("#r"+r+"c18").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T10_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T10_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();
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

                    $(".F21T10_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T10_tbody").append(
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
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class='options'>"+
                                "<td id='r"+i+"c17' class='options'>"+
                                "<td id='r"+i+"c18' class='options'>"+
                                
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T10_tbody").append(
                            "<tr>"+
                                "<td colspan='18' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }

        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T10").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table10",
                filename: "Form21-Table10.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_table', 'add_probationer', 'add_submitted', 'add_supervising', 'add_findings'];

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
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T10PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $(".sel-table").html(table)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T10PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $(".sel-table").html(table)
                $("#modal-edit").modal();
                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true);
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
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T10',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T10PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };
    
    
    var __attachF21T11PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T11_PAROL"
        }
        $('.F21T11_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.disposed_decision == "FINAL" ? data.disposed_date : "");
                            $("#r"+r+"c4").html(data.disposed_decision == "ARREST" ? data.disposed_date : "");
                            $("#r"+r+"c5").html(data.disposed_decision == "DEATH" ? data.disposed_date : "");
                            $("#r"+r+"c6").html(data.disposed_decision == "OTHERS" ? data.disposed_date : "");
                            $("#r"+r+"c7").html(data.submitted_report);
                            $("#r"+r+"c8").html(data.field_office).addClass("options");
                            $("#r"+r+"c9").html(source).addClass("options");
                            $("#r"+r+"c10").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T11_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T11_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();
                          $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T11_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c11").html(data.docket_no);
                            $("#r"+r+"c12").html(data.probationer);
                            $("#r"+r+"c13").html(data.disposed_decision == "FINAL" ? data.disposed_date : "");
                            $("#r"+r+"c14").html(data.disposed_decision == "ARREST" ? data.disposed_date : "");
                            $("#r"+r+"c15").html(data.disposed_decision == "DEATH" ? data.disposed_date : "");
                            $("#r"+r+"c16").html(data.disposed_decision == "OTHERS" ? data.disposed_date : "");
                            $("#r"+r+"c17").html(data.submitted_report);
                            
                            $("#r"+r+"c18").html(data.field_office).addClass("options");
                            $("#r"+r+"c19").html(source).addClass("options");
                            $("#r"+r+"c20").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T11_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T11_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();
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

                    $(".F21T11_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T11_tbody").append(
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
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class='options'>"+
                                "<td id='r"+i+"c19' class='options'>"+
                                "<td id='r"+i+"c20' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T11_tbody").append(
                            "<tr>"+
                                "<td colspan='18' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T11").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table11",
                filename: "Form21-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){


            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_probationer','add_submitted','add_findings'];
            var check = true
            if($("#add_table").val() == "F21T11_PARDON"){
                var checkTable = ['F21T9_PARDON', 'F21T10_PARDON']    
            }else{
                var checkTable = ['F21T9_PAROL', 'F21T10_PAROL']    
            }
            

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
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").attr('disabled',false)
                $(".addProceedButton").addClass("hidden")
                $(".addSubmitButton").removeClass("hidden")
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T11PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-table").html(table)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T11PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_findings").val(payload.disposed_decision).trigger("change")
                        $("#edit_submitted").val(payload.disposed_date)
                        $("#edit_submitted_report").val(payload.submitted_report)
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
                    "disposed_date" : $("#edit_submitted").val(),
                    "submitted_report" : $("#edit_submitted_report").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T11',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T11PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };

    var __attachF21T12PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T12_PAROL"
        }
        $('.F21T12_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.submitted_date);
                            $("#r"+r+"c4").html(data.supervising_officer);
                            $("#r"+r+"c5").html(data.field_office).addClass("options");
                            $("#r"+r+"c6").html(source).addClass("options");
                            $("#r"+r+"c7").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T12_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T12_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T12_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c8").html(data.docket_no);
                            $("#r"+r+"c9").html(data.probationer);
                            $("#r"+r+"c10").html(data.submitted_date);
                            $("#r"+r+"c11").html(data.supervising_officer);
                            $("#r"+r+"c12").html(data.field_office).addClass("options");
                            $("#r"+r+"c13").html(source).addClass("options");
                            $("#r"+r+"c14").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T12_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T12_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();  $.wms.dashboard.formControlCheck()
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

                    $(".F21T12_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T12_tbody").append(
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
                }else{
                    $(".F21T12_tbody").append(
                            "<tr>"+
                                "<td colspan='18' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T12").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table11",
                filename: "Form21-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
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
                "submitted_date" : $("#add_submitted").val(),
                "supervising_officer": $("#add_supervising").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").addClass("hidden")
                $(".addSubmitButton").removeClass("hidden")

                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T12PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-table").html(table)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T12PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
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
                    
                    "submitted_date" : $("#edit_submitted").val(),
                    "field_office": $.wms.urlParam('field'),
                    "supervising_officer": $("#edit_supervising").val(),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T12',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T12PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };

    var __attachF21T13PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T13_PAROL"
        }
        $('.F21T13_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.disposed_date);
                            $("#r"+r+"c4").html(data.field_office).addClass("options");
                            $("#r"+r+"c5").html(source).addClass("options");
                            $("#r"+r+"c6").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T13_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T13_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T13_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result) {
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
                            //$("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c7").html(data.docket_no);
                            $("#r"+r+"c8").html(data.probationer);
                            $("#r"+r+"c9").html(data.disposed_date);
                            $("#r"+r+"c10").html(data.field_office).addClass("options");
                            $("#r"+r+"c11").html(source).addClass("options");
                            $("#r"+r+"c12").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T13_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T13_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();  $.wms.dashboard.formControlCheck()
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

                    $(".F21T13_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T13_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class='options'>"+
                                "<td id='r"+i+"c5' class='options'>"+
                                "<td id='r"+i+"c6' class='options'>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class=''>"+
                                "<td id='r"+i+"c9' class=''>"+
                                "<td id='r"+i+"c10' class='options'>"+
                                "<td id='r"+i+"c11' class='options'>"+
                                "<td id='r"+i+"c12' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T13_tbody").append(
                            "<tr>"+
                                "<td colspan='18' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T13").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table11",
                filename: "Form21-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'PR', 'PD', 'TPR', 'TPD' ];
            var requiredField= [ 'add_probationer','add_submitted'];
            var check = true
            if($("#add_table").val() == "F21T11_PARDON"){
                var checkTable = ['F21T9_PARDON', 'F21T12_PARDON']    
            }else{
                var checkTable = ['F21T9_PAROL', 'F21T12_PAROL']    
            }
            

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
                "disposed_date" : $("#add_submitted").val(),
                "Y_M": $.wms.urlParam('date'),
                "source" : "2",
                "field_office": $.wms.urlParam('field'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").addClass("hidden")
                $(".addSubmitButton").removeClass("hidden")

                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T13PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-table").html(table)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T13PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
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
                    "disposed_date" : $("#edit_submitted").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val()

                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T13',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T13PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };

    var __attachF21T14PageEvent = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T14_PAROL"
        }
        $('.F21T14_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.referral_office);
                            $("#r"+r+"c4").html(data.received_date);
                            $("#r"+r+"c5").html(data.supervising_officer);
                            $("#r"+r+"c6").html(data.reasons);
                            $("#r"+r+"c7").html(data.case_classification);

                            $("#r"+r+"c8").html(data.field_office).addClass("options");
                            $("#r"+r+"c9").html(source).addClass("options");
                            $("#r"+r+"c10").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T14_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T14_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T14_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result) {
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
                            
                            $("#r"+r+"c11").html(data.docket_no);
                            $("#r"+r+"c12").html(data.probationer);
                            $("#r"+r+"c13").html(data.referral_office);
                            $("#r"+r+"c14").html(data.received_date);
                            $("#r"+r+"c15").html(data.supervising_officer);
                            $("#r"+r+"c16").html(data.reasons);
                            $("#r"+r+"c17").html(data.case_classification);
                            $("#r"+r+"c18").html(data.field_office).addClass("options");
                            $("#r"+r+"c19").html(source).addClass("options");
                            $("#r"+r+"c20").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T14_PARDON' data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T14_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();  $.wms.dashboard.formControlCheck()
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

                    $(".F21T14_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T14_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class='options'>"+
                                "<td id='r"+i+"c10' class='options'>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class=''>"+
                                "<td id='r"+i+"c14' class=''>"+
                                "<td id='r"+i+"c15' class=''>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class='options'>"+
                                "<td id='r"+i+"c19' class='options'>"+
                                "<td id='r"+i+"c20' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T14_tbody").append(
                            "<tr>"+
                                "<td colspan='18' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T14").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table11",
                filename: "Form21-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //Add
        $(".addSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'CPD', 'CPR'    ];
            var requiredField= [ 'add_probationer', 'add_date_rcv', 'add_supervising'];

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
                "case_classification": $("#add_case_classification").val(),
                "probationer" : $("#add_probationer").val(),
                "received_date" : $("#add_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "Y_M": $.wms.urlParam('date'),
                "method" : "update",
                "table" : $("#add_table").val(),
                "referral_office" : $("#add_referring_office").val(),
                "reasons" : $("#add_reasons").val(),
                "supervising_officer" : $("#add_supervising").val(),
                "Y_M" : $.wms.urlParam('date'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
                "table" : $("#add_table").val()
            }
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addProceedButton").addClass("hidden")
                $(".addSubmitButton").removeClass("hidden")

                $(".addProceedButton").attr('disabled',false)
                $("#modal-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T14PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-table").html(table)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T14PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_docket_no").val(payload.docket_no)
                        $("#edit_id").val(payload.id)
                        $("#edit_probationer").val(payload.probationer)
                        $("#edit_referring_office").val(payload.referral_office).trigger("change")
                        $("#edit_date_rcv").val(payload.received_date)
                        $("#edit_reasons").val(payload.reasons)
                        $("#edit_case_classification").val(payload.case_classification)
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
                    "case_classification": $("#edit_case_classification").val(),
                    "probationer" : $("#edit_probationer").val(),
                    "received_date" : $("#edit_date_rcv").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_table").val(),
                    "referral_office" : $("#edit_referring_office").val(),
                    "reasons" : $("#edit_reasons").val(),
                    "supervising_officer" : $("#edit_supervising").val(),
                    "Y_M" : $("#edit_Y_M").val()
                    
                    
                    


                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T14',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editProceedButton").attr('disabled',false)
                    $("#modal-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T14PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };


    var __attachF21T15PageEvent = function() {
        
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T15_RCV_PAROL"
        }
        $('.F21T15_tbody').empty();
        $(".form_loader").removeClass("hidden")
        $(".result_form").addClass("hidden")
        $(".sel_field_office2").select2({
           placeholder: "Select Field Office",
        });

        var __maxTableSize = 0;
        var __counter = 0;


        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
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
                            $("#r"+r+"c1").html(data.docket_no);
                            $("#r"+r+"c2").html(data.probationer);
                            $("#r"+r+"c3").html(data.referral_office);
                            $("#r"+r+"c4").html(data.supervising_officer);
                            $("#r"+r+"c5").html(data.period);
                            
                            $("#r"+r+"c6").html(data.received_date);
                            $("#r"+r+"c7").html(data.case_classification);

                            $("#r"+r+"c8").html(data.field_office).addClass("options");
                            $("#r"+r+"c9").html(source).addClass("options");
                            $("#r"+r+"c10").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T15_RCV_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T15_RCV_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });

        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T15_RCV_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
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
                            
                            $("#r"+r+"c16").html(data.docket_no);
                            $("#r"+r+"c17").html(data.probationer);
                            $("#r"+r+"c18").html(data.referral_office);
                            $("#r"+r+"c19").html(data.supervising_officer);
                            $("#r"+r+"c20").html(data.period);
                            
                            $("#r"+r+"c21").html(data.received_date);
                            $("#r"+r+"c22").html(data.case_classification);

                            $("#r"+r+"c23").html(data.field_office).addClass("options");
                            $("#r"+r+"c24").html(source).addClass("options");
                            $("#r"+r+"c25").html("<button class='access_f21_write btn btn-success btn-xs btn-edit' data-table='F21T15_RCV_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T15_RCV_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });


        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T15_TERM_PAROL"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
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
                            
                            
                            $("#r"+r+"c11").html(data.probationer  + " (" + data.docket_no +")");
                            $("#r"+r+"c12").html(data.terminated_date);
                            
                            $("#r"+r+"c13").html(data.field_office).addClass("options");
                            $("#r"+r+"c14").html(source).addClass("options");
                            $("#r"+r+"c15").html("<button class='access_f21_write btn btn-success btn-xs btn-term-edit' data-table='F21T15_TERM_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T15_TERM_PAROL'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });


                        
                        ___tableControls();  $.wms.dashboard.formControlCheck()
                    }
                };
                window.setTimeout(checkPendingRequest, 100);

                
            }
            ___checker();
        });


        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field'),
            "method" : "fetchAll",
            "table" : "F21T15_TERM_PARDON"
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
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
                            
                            
                            $("#r"+r+"c26").html(data.probationer  + " (" + data.docket_no +")");
                            $("#r"+r+"c27").html(data.terminated_date);
                            
                            $("#r"+r+"c28").html(data.field_office).addClass("options");
                            $("#r"+r+"c29").html(source).addClass("options");
                            $("#r"+r+"c30").html("<button class='access_f21_write btn btn-success btn-xs btn-term-edit' data-table='F21T15_TERM_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-pencil'></i></button> "+
                                                "<button class='access_f21_write btn btn-danger btn-xs btn-delete' data-table='F21T15_TERM_PARDON'  data-docket='"+data.docket_no.toUpperCase()+"' data-id='"+data.id+"'><i class='fa fa-trash'></i></button> </td></tr>").addClass("options");
                            r += 1;
                        });
                        ___tableControls();  $.wms.dashboard.formControlCheck()
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

                    $(".F21T15_tbody").empty()
                    for(i=1;i<=__maxTableSize;i++){
                        $(".F21T15_tbody").append(
                            "<tr>"+
                                "<td id='r"+i+"c1' class=''>"+
                                "<td id='r"+i+"c2' class=''>"+
                                "<td id='r"+i+"c3' class=''>"+
                                "<td id='r"+i+"c4' class=''>"+
                                "<td id='r"+i+"c5' class=''>"+
                                "<td id='r"+i+"c6' class=''>"+
                                "<td id='r"+i+"c7' class=''>"+
                                "<td id='r"+i+"c8' class='options'>"+
                                "<td id='r"+i+"c9' class='options'>"+
                                "<td id='r"+i+"c10' class='options'>"+
                                "<td id='r"+i+"c11' class=''>"+
                                "<td id='r"+i+"c12' class=''>"+
                                "<td id='r"+i+"c13' class='options'>"+
                                "<td id='r"+i+"c14' class='options'>"+
                                "<td id='r"+i+"c15' class='options'>"+
                                "<td id='r"+i+"c16' class=''>"+
                                "<td id='r"+i+"c17' class=''>"+
                                "<td id='r"+i+"c18' class=''>"+
                                "<td id='r"+i+"c19' class=''>"+
                                "<td id='r"+i+"c20' class=''>"+
                                "<td id='r"+i+"c21' class=''>"+
                                "<td id='r"+i+"c22' class=''>"+
                                "<td id='r"+i+"c23' class='options'>"+
                                "<td id='r"+i+"c24' class='options'>"+
                                "<td id='r"+i+"c25' class='options'>"+
                                "<td id='r"+i+"c26' class=''>"+
                                "<td id='r"+i+"c27' class=''>"+
                                "<td id='r"+i+"c28' class='options'>"+
                                "<td id='r"+i+"c29' class='options'>"+
                                "<td id='r"+i+"c30' class='options'>"+
                            "</tr>"
                            )
                    }
                }else{
                    $(".F21T15_tbody").append(
                            "<tr>"+
                                "<td colspan='30' class='center b'>NONE</td>"+
                            "</tr>");
                }
            }
        }


        //Download
        $(".btn-download").unbind("click").on("click",function(){
            $("#T_F21T15").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: "Form21-Table11",
                filename: "Form21-Table11.xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

        //RCV
        //Add
        $(".addRCVSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'CPD', 'CPR'    ];
            var requiredField= [ 'add_rcv_probationer', 'add_rcv_date_rcv', 'add_rcv_supervising'];

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
                "case_classification": $("#add_rcv_case_classification").val(),
                "probationer" : $("#add_rcv_probationer").val(),
                "received_date" : $("#add_rcv_date_rcv").val(),
                "field_office": $.wms.urlParam('field'),
                "Y_M": $.wms.urlParam('date'),
                "method" : "update",
                "table" : $("#add_rcv_table").val(),
                "referral_office" : $("#add_rcv_referring_office").val(),
                "period" : $("#add_rcv_period").val(),
                "supervising_officer" : $("#add_rcv_supervising").val(),
                "Y_M" : $.wms.urlParam('date'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addRCVProceedButton").addClass("hidden")
                $(".addRCVSubmitButton").removeClass("hidden")

                $(".addRCVProceedButton").attr('disabled',false)
                $("#modal-rcv-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T15PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        //ADD TERM
        //RCV
        //Add
        $(".addTERMSubmitButton").unbind("click").on("click",function(){
            var allowedDocket= [ 'CPD', 'CPR'    ];
            var requiredField= [ 'add_term_probationer','add_term_date_terminated'];
            var check = true
            if($("#add_table").val() == "F21T15_TERM_PARDON"){
                var checkTable = ['F21T14_PARDON', 'F21T15_RCV_PARDON']    
            }else{
                var checkTable = ['F21T14_PAROL', 'F21T15_RCV_PAROL']    
            }
            

            ___validateSave(allowedDocket,$("#add_term_docket_no"),requiredField,check,checkTable).done(function(result){
                if(result){
                    $(".modal-form input").attr("disabled",true);
                    $(".modal-form select").attr("disabled",true);
                    $(".addTERMSubmitButton").addClass("hidden");
                    $(".confirmAdd").removeClass("hidden")
                    $(".addTERMProceedButton").removeClass("hidden")
                }
            });
        });

        $(".addTERMCancelButton").unbind("click").on("click",function(){
            ___modalReset();
            $(".addTERMSubmitButton").removeClass("hidden")
            $(".addTERMProceedButton").addClass("hidden")
           
        });

        //Add
        $(".addTERMProceedButton").unbind("click").on("click",function(){
            $(this).attr('disabled',true)
            $(".modal-loader").removeClass("hidden")
            var payload = { 
                "docket_no" : $("#add_term_docket_no").val(),
                "probationer" : $("#add_term_probationer").val(),
                "terminated_date" : $("#add_term_date_terminated").val(),
                "field_office": $.wms.urlParam('field'),
               
                "method" : "update",
                "table" : $("#add_term_table").val(),
                "Y_M" : $.wms.urlParam('date'),
                "created_by" : $.cookie("USER_ID"),
                "method" : "insert",
            }
            console.log(payload);
            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
                $(".modal-loader").addClass("hidden")
                $(".addTERMProceedButton").addClass("hidden")
                $(".addTERMSubmitButton").removeClass("hidden")

                $(".addTERMProceedButton").attr('disabled',false)
                $("#modal-term-add").modal('toggle')
                ___modalReset();
                if(result.status != undefined && result.status == "SUCCESS"){
                    //__attachF21T15PageEvent();
                    location.reload();
                }else{
                    //Error Prompt
                }
            });    
        })

        var ___modalReset = function(){
            $(".modal-form input").attr("disabled",false);
            $(".modal-form select").attr("disabled",false);
            $(".modal-form select").val('').trigger('change');
            $(".confirmAdd").addClass("hidden")
            $(".btn-reset").trigger('click');
        }


        var ___tableControls = function(){
            $(".btn-delete").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-table").html(table)
                $(".sel-id").html(data_id)
                $("#modal-delete").modal();
            });    

            //Delete
            $(".deleteProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = {
                    "id" : $(".sel-id").html(),
                    "table" : $(".sel-table").html(),
                    "status" : "0",
                    "method" : "update"
                }
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
                    $("#modal-delete").modal('toggle')
                    $(".modal-loader").addClass("hidden")
                    $(".deleteProceedButton").attr('disabled',false)
                    if(result.status != undefined && result.status == "SUCCESS"){
                       //__attachF21T15PageEvent();
                       location.reload();
                    }
                });    
            })

            $(".btn-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-rcv-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_rcv_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_rcv_docket_no").val(payload.docket_no)
                        $("#edit_rcv_id").val(payload.id)
                        $("#edit_rcv_probationer").val(payload.probationer)
                        $("#edit_rcv_referring_office").val(payload.referral_office).trigger("change")
                        $("#edit_rcv_date_rcv").val(payload.received_date)
                        $("#edit_rcv_period").val(payload.period)
                        $("#edit_rcv_case_classification").val(payload.case_classification)
                        $("#edit_rcv_supervising").val(payload.supervising_officer)
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

            $(".editCancelButton").unbind("click").on("click",function(){
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
                    "case_classification": $("#edit_rcv_case_classification").val(),
                    "probationer" : $("#edit_rcv_probationer").val(),
                    "received_date" : $("#edit_rcv_date_rcv").val(),
                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_rcv_table").val(),
                    "referral_office" : $("#edit_rcv_referring_office").val(),
                    "period" : $("#edit_rcv_period").val(),
                    "supervising_officer" : $("#edit_rcv_supervising").val(),
                   
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editRCVProceedButton").attr('disabled',false)
                    $(".editRCVProceedButton").addClass("hidden")
                    $(".editRCVSubmitButton").removeClass("hidden")
                    $("#modal-rcv-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T15PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })



            $(".btn-term-edit").unbind("click").on("click",function(){
                var data_id = $(this).data("id");
                var docket_no = $(this).data("docket");
                var table = $(this).data("table");
                console.log(docket_no)
                //console.log(data);
                $(".sel-docket").html(docket_no)
                $(".sel-id").html(data_id)
                $("#modal-term-edit").modal();

                var payload = {
                    "id" : data_id,
                    "method" : "fetchByID",
                    "table" : table
                }
                $(".modal-loader2").removeClass("hidden")
                $(".modal-form").addClass("hidden")
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result2) {
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
                        $("#edit_term_table").val(table).trigger("change").attr("disabled",true)
                        $("#edit_term_docket_no").val(payload.docket_no)
                        $("#edit_term_id").val(payload.id)
                        $("#edit_term_probationer").val(payload.probationer)
                        $("#edit_term_date_terminated").val(payload.terminated_date)
                        $("#edit_term_field_office").val(payload.field_office).trigger("change");
                        $("#edit_term_Y_M").val(payload.Y_M)
                       
                    }else{
                        alert("[Error] Please try again...")
                    }
                });
            });

            $(".editTERMSubmitButton").unbind("click").on("click",function(){
                $(".modal-form input").attr("disabled",true);
                $(".modal-form select").attr("disabled",true);
                $(".editTERMSubmitButton").addClass("hidden");
                $(".confirmEdit").removeClass("hidden")
                $(".editTERMProceedButton").removeClass("hidden")
            });

            $(".editTERMCancelButton").unbind("click").on("click",function(){
                ___modalReset();
                $(".editTERMSubmitButton").removeClass("hidden")
                $(".editTERMProceedButton").addClass("hidden")
            });


            //Update
            $(".editTERMProceedButton").unbind("click").on("click",function(){
                $(this).attr('disabled',true)
                $(".modal-loader").removeClass("hidden")
                var payload = { 
                    "id" : $("#edit_term_id").val(),
                    "docket_no" : $("#edit_term_docket_no").val(),
                    "case_classification": $("#edit_term_case_classification").val(),
                    "probationer" : $("#edit_term_probationer").val(),
                    "terminated_date" : $("#edit_term_date_terminated").val(),

                    "field_office": $.wms.urlParam('field'),
                    "Y_M": $.wms.urlParam('date'),
                    "method" : "update",
                    "table" : $("#edit_term_table").val(),
                    "Y_M" : $("#edit_term_Y_M").val()
                }
                console.log(payload)
                $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21T15',JSON.stringify(payload)).done(function (result) {
                    $(".modal-loader").addClass("hidden")
                    $(".editTERMProceedButton").attr('disabled',false)
                    $(".editTERMProceedButton").addClass("hidden")
                    $(".editTERMSubmitButton").removeClass("hidden")
                    $("#modal-term-edit").modal('toggle')
                    ___modalReset();
                    if(result.status != undefined && result.status == "SUCCESS"){
                        //__attachF21T15PageEvent();
                        location.reload();
                    }else{
                        //Error Prompt
                    }
                });    
            })
        }
    };




    var __attachF21PCSPageEvent = function() {
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
        attachF21T1PageEvent : __attachF21T1PageEvent,
        attachF21T2PageEvent : __attachF21T2PageEvent,
        attachF21T3PageEvent : __attachF21T3PageEvent,
        attachF21T4PageEvent : __attachF21T4PageEvent,
        attachF21T5PageEvent : __attachF21T5PageEvent,
        attachF21T6PageEvent : __attachF21T6PageEvent,
        attachF21T7PageEvent : __attachF21T7PageEvent,
        attachF21T8PageEvent : __attachF21T8PageEvent,
        attachF21T9PageEvent : __attachF21T9PageEvent,
        attachF21T10PageEvent : __attachF21T10PageEvent,
        attachF21T11PageEvent : __attachF21T11PageEvent,
        attachF21T12PageEvent : __attachF21T12PageEvent,
        attachF21T13PageEvent : __attachF21T13PageEvent,
        attachF21T14PageEvent : __attachF21T14PageEvent,
        attachF21T15PageEvent : __attachF21T15PageEvent,
        attachF21PCSPageEvent : __attachF21PCSPageEvent
    };
}());
