/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.report = (typeof $.wms.report !== 'undefined') ? $.wms : {};

$.wms.report = (function() {

    var __load = function() {
        console.log("-LOAD-")
        var date = $.wms.urlParam('date')
        var form = $.wms.urlParam('form')
        var reg = $.wms.urlParam('reg')
        if(reg != ""){
            $(".curr_reg").html(reg);    
        }
        
        $(".curr_date").html(date);

        switch(form){
            
            case "f5_regional_pi_r1_p1":
                f5_regional_pi_r1_p1();
            break;

            case "f5_regional_pi_r1_p2":
                f5_regional_pi_r1_p2();
            break; 

            case "f5_regional_pi_r2":
                f5_regional_pi_r2();
            break;
            case "f5_regional_pi_r3":
                f5_regional_pi_r3();
            break;
            
            case "f5_regional_ps_r1_p1":
                f5_regional_ps_r1_p1();
            break;

            case "f5_regional_ps_r1_p2":
                f5_regional_ps_r1_p2();
            break;;

            case "f5_regional_ps_r1_p3":
                f5_regional_ps_r1_p3();
            break;

            case "f5_regional_ps_r2_p1":
                f5_regional_ps_r2_p1();
            break;

            case "f5_regional_ps_r2_p2":
                f5_regional_ps_r2_p2();
            break;

            case "f5_regional_ps_r3":
                f5_regional_ps_r3();
            break;

            case "f21_regional_ppi_r1_p1":
                f21_regional_ppi_r1_p1();

            case "f21_regional_ppi_r1_p2":
                //TODO
                //f21_regional_ppi_r1_p2();
            break;

            case "f21_regional_ppi_r1_p3":
                f21_regional_ppi_r1_p3();
            break;
            

            //FIELD

            case "f5_field_office_pi_f1_p1":
                    f5_field_office_pi_f1_p1();
            break;
            case "f5_field_office_pi_f1_p2":
                f5_field_office_pi_f1_p2();
                break;
            case "f5_field_office_pi_f2":
                f5_field_office_pi_f2();
            break;

            case "f5_field_office_pi_f3":
                f5_field_office_pi_f3();
            break;

            case "f5_field_office_ps_f1_p1":
                f5_field_office_ps_f1_p1();
            break;
            case "f5_field_office_ps_f1_p2":
                f5_field_office_ps_f1_p2();
            break;


            //FIELD OFFICE QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 3
            case "f5_field_office_ps_f1_p3":
                f5_field_office_ps_f1_p3();
            break;

            //TODO need to get DAYS in PIS
            case "f5_field_office_pi_f4":
                f5_field_office_pi_f4();
            break;

            case "f5_field_office_ps_f2_p1":
                f5_field_office_ps_f2_p1();
            break;
            case "f5_field_office_ps_f2_p2":
                f5_field_office_ps_f2_p2();
            break;
            case "f5_field_office_ps_f3":
                f5_field_office_ps_f3();
            break;

            case "f21_field_office_ppi_f1_p1":
                f21_field_office_ppi_f1_p1();
            break;

            case "f21_field_office_ppi_f1_p2":
                //TODO
                //f21_field_office_ppi_f1_p2();
            break; 

            case "f21_field_office_ppi_f1_p3":
                f21_field_office_ppi_f1_p3();
            break;




        }

        $(".btn-download").unbind("click").on("click",function(){
            $("#Table").table2excel({
                // exclude CSS class
                exclude: ".options",
                name: form,
                filename: form+".xls", //do not include extension
                fileext: ".xls",
                preserveColors: true
              }); 
        });

    };  




    var f5_regional_pi_r1_p1 = function(){
        var payload = { 
            method : "f5_regional_pi_r1_p1",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center b'>"+data.carryOver+"</td>"+
                                "<td class='center b'>"+data.totalRcv+"</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>"+data.totalRcv2+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }


    var f5_regional_pi_r1_p2 = function(){
        var payload = { 
            method : "f5_regional_pi_r1_p2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center'>"+data.totalGrant+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalDenial+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalManifest+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalTransfer+"</td>"+
                                "<td class='center'>"+data.totalActed+"</td>"+
                                "<td class='center'>"+data.totalRecall+"</td>"+
                                "<td class='center'>"+data.totalWarrant+"</td>"+
                                "<td class='center'>"+data.totalNotActed+"</td>"+
                                "<td class='center'>"+data.totalActive+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_pi_r2 = function(){
        var payload = { 
            method : "f5_regional_pi_r2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center'>"+data.totalCarryOver+"</td>"+
                                "<td class='center'>"+data.totalPSIR+"</td>"+
                                "<td class='center'>"+data.totalManifest+"</td>"+
                                "<td class='center'>"+data.totalSubmitted+"</td>"+
                                "<td class='center'>"+data.totalbeActed+"</td>"+
                                "<td class='center'>"+data.totalGrant+"</td>"+
                                "<td class='center'>"+data.totalDenial+"</td>"+
                                "<td class='center'>"+data.totalDismiss+"</td>"+
                                "<td class='center'>"+data.totalWithdraw+"</td>"+
                                "<td class='center'>"+data.totalReinv+"</td>"+
                                "<td class='center'>"+data.totalOther+"</td>"+
                                "<td class='center'>"+data.totalDisposed+"</td>"+
                                "<td class='center'>"+data.totalWarrant+"</td>"+
                                "<td class='center'>"+data.totalRecall+"</td>"+
                                "<td class='center'>"+data.totalNotActed+"</td>"+
                                "<td class='center'>"+data.totalPending+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_pi_r3 = function(){
        var payload = { 
            method : "f5_regional_pi_r3",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='b'>"+data.carryOver+"</td>"+
                                "<td class='b'>"+data.totalRcv+"</td>"+
                                "<td class='b'>"+data.totalInvestigation+"</td>"+
                                "<td class='b'>"+data.totalCmpltd+"</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>"+data.totalCmpltd+"</td>"+
                                "<td class='b'>"+data.totalActive+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_ps_r1_p1 = function(){
        var payload = { 
            method : "f5_regional_ps_r1_p1",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center b'>"+data.carryOver+"</td>"+
                                "<td class='center b'>"+data.totalRcv+"</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>"+data.totalRcv2+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_ps_r1_p2 = function(){
        var payload = { 
            method : "f5_regional_ps_r1_p2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                                "<td class='center b'>"+data.totalFullTerm+"</td>"+
                                "<td class='center b'>"+data.totalEarlyTerm+"</td>"+
                                "<td class='center b'>"+data.totalDiedTerm+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalAbs+"</td>"+
                                "<td class='center b'>"+data.totalComm+"</td>"+
                                "<td class='center b'>"+data.totalVio+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalTransfer+"</td>"+
                                "<td class='center b'>"+data.totalOthers+"</td>"+
                                "<td class='center b'>"+data.totalDropped+"</td>"+
                                "<td class='center b'>"+data.totalActive+"</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_ps_r1_p3 = function(){
        var payload = { 
            method : "f5_regional_ps_r1_p3",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center b'>"+data.totalFullTerm+"</td>"+
                                "<td class='center b'>"+data.totalEarlyTerm+"</td>"+
                                "<td class='center b'>"+data.totalDiedTerm+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalAbs+"</td>"+
                                "<td class='center b'>"+data.totalComm+"</td>"+
                                "<td class='center b'>"+data.totalVio+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalExt+"</td>"+
                                "<td class='center b'>"+data.totalTransfer+"</td>"+
                                "<td class='center b'>"+data.totalOthers+"</td>"+
                                "<td class='center b'>"+data.totalDropped+"</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_regional_ps_r2_p1 = function(){
        var payload = { 
            method : "f5_regional_ps_r2_p1",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.REGION+"</td>"+
                                "<td class='center b'>"+data.totalCarryTerm+"</td>"+
                                "<td class='center b'>"+data.totalCarryRevoc+"</td>"+
                                "<td class='center b'>"+data.totalCarryExt+"</td>"+
                                "<td class='center b'>"+data.totalCarryTrans+"</td>"+
                                "<td class='center b'>"+data.totalCarryOth+"</td>"+
                                "<td class='center b'>"+data.totalCarryOver+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalExt+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalTrans+"</td>"+
                                "<td class='center b'>"+data.totalSubmitted+"</td>"+
                                "<td class='center b'>"+data.totalCasesBeActed+"</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }
    var f5_regional_ps_r2_p2 = function(){
            var payload = { 
                method : "f5_regional_ps_r2_p2",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b'>"+data.REGION+"</td>"+
                                    "<td class='b center'>"+data.totalCasesBeActed+"</td>"+
                                    "<td class='b center'>"+data.totalFullTerm+"</td>"+
                                    "<td class='b center'>"+data.totalEarlyTerm+"</td>"+
                                    "<td class='b center'>"+data.totalDiedTerm+"</td>"+
                                    "<td class='b center'>"+data.totalTerm+"</td>"+
                                    "<td class='b center'>"+data.totalAbs+"</td>"+
                                    "<td class='b center'>"+data.totalComm+"</td>"+
                                    "<td class='b center'>"+data.totalVio+"</td>"+
                                    "<td class='b center'>"+data.totalOther+"</td>"+
                                    "<td class='b center'>"+data.totalRevoc+"</td>"+
                                    "<td class='b center'>"+data.totalExt+"</td>"+
                                    "<td class='b center'>"+data.totalTransfer+"</td>"+
                                    "<td class='b center'>"+data.totalOthers+"</td>"+
                                    "<td class='b center'>"+data.totalDisposed+"</td>"+
                                    "<td class='b center'>"+data.totalPending+"</td>"+
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }

        var f5_regional_ps_r3 = function(){
            var payload = { 
                method : "f5_regional_ps_r3",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.REGION+"</td>"+
                                    "<td class='b center'>"+data.totalCarryOver+"</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>"+data.totalCasesHandled+"</td>"+
                                    "<td class='b center'>"+data.totalCompltd+"</td>"+
                                    "<td class='b center'>"+data.totalCourtesy+"</td>"+
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }

        //REGIONAL -- FORM 21
        var f21_regional_ppi_r1_p1 = function(){
            var payload = { 
                method : "f21_regional_ppi_r1_p1",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.REGION+"</td>"+
                                    "<td class='b center'>"+data.totalCarryOver+"</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>"+data.totalCasesHandled+"</td>"+
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }


        var f21_regional_ppi_r1_p3 = function(){
            var payload = { 
                method : "f21_regional_ppi_r1_p3",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.REGION+"</td>"+
                                    "<td class='b center'>"+data.totalInvestigationReport+"</td>"+
                                    "<td class='b center'>"+data.totalTransfer+"</td>"+
                                    "<td class='b center'>"+data.totalOther+"</td>"+
                                    "<td class='b center'>"+data.totalActed+"</td>" +
                                    "<td class='b center'>"+data.totalActive+"</td>" + 
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }


    //FIELD//
    //@breakpoint

    var f5_field_office_pi_f1_p1 = function(){
        var payload = { 
            method : "f5_field_office_pi_f1_p1",
            Y_M : "2019-01",
            REGION : $.wms.urlParam('reg2'),
            END_Y_M : $.wms.urlParam('date')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center'>"+data.carryOver+"</td>"+
                                "<td class='center'>"+data.totalRcv+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalRcv+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    


    var f5_field_office_pi_f1_p2 = function(){
        var payload = { 
            method : "f5_field_office_pi_f1_p2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2'),
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center'>"+data.totalGrant+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalDenial+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalManifest+"</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>0</td>"+
                                "<td class='center'>"+data.totalTransfer+"</td>"+
                                "<td class='center b'>"+data.totalActed+"</td>"+
                                "<td class='center'>"+data.totalRecall+"</td>"+
                                "<td class='center'>"+data.totalWarrant+"</td>"+
                                "<td class='center b'>"+data.totalNotActed+"</td>"+
                                "<td class='center b'>"+data.totalActive+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }


    var f5_field_office_pi_f2 = function(){
        var payload = { 
            method : "f5_field_office_pi_f2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center'>"+data.totalCarryOver+"</td>"+
                                "<td class='center'>"+data.totalPSIR+"</td>"+
                                "<td class='center'>"+data.totalManifest+"</td>"+
                                "<td class='center'>"+data.totalSubmitted+"</td>"+
                                "<td class='center b'>"+data.totalbeActed+"</td>"+
                                "<td class='center'>"+data.totalGrant+"</td>"+
                                "<td class='center'>"+data.totalDenial+"</td>"+
                                "<td class='center'>"+data.totalDismiss+"</td>"+
                                "<td class='center'>"+data.totalWithdraw+"</td>"+
                                "<td class='center'>"+data.totalReinv+"</td>"+
                                "<td class='center'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalDisposed+"</td>"+
                                "<td class='center'>"+data.totalWarrant+"</td>"+
                                "<td class='center'>"+data.totalRecall+"</td>"+
                                "<td class='center'>"+data.totalNotActed+"</td>"+
                                "<td class='center b'>"+data.totalPending+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }


    var f5_field_office_pi_f3 = function(){
        var payload = { 
            method : "f5_field_office_pi_f3",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='b'>"+data.carryOver+"</td>"+
                                "<td class='b'>"+data.totalRcv+"</td>"+
                                "<td class='b'>"+data.totalInvestigation+"</td>"+
                                "<td class='b'>"+data.totalCmpltd+"</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>0</td>"+
                                "<td class='b'>"+data.totalCmpltd+"</td>"+
                                "<td class='b'>"+data.totalActive+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_field_office_ps_f1_p1 = function(){
        var payload = { 
            method : "f5_field_office_ps_f1_p1",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center b'>"+data.carryOver+"</td>"+
                                "<td class='center b'>"+data.totalRcv+"</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>0</td>"+
                                "<td class='center b'>"+data.totalRcv2+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_field_office_ps_f1_p2 = function(){
        var payload = { 
            method : "f5_field_office_ps_f1_p2",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center b'>"+data.totalInvestigation+"</td>"+
                                "<td class='center b'>"+data.totalFullTerm+"</td>"+
                                "<td class='center b'>"+data.totalEarlyTerm+"</td>"+
                                "<td class='center b'>"+data.totalDiedTerm+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalAbs+"</td>"+
                                "<td class='center b'>"+data.totalComm+"</td>"+
                                "<td class='center b'>"+data.totalVio+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalTransfer+"</td>"+
                                "<td class='center b'>"+data.totalOthers+"</td>"+
                                "<td class='center b'>"+data.totalDropped+"</td>"+
                                "<td class='center b'>"+data.totalActive+"</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_field_office_ps_f1_p3 = function(){
        var payload = { 
            method : "f5_field_office_ps_f1_p3",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center b'>"+data.totalFullTerm+"</td>"+
                                "<td class='center b'>"+data.totalEarlyTerm+"</td>"+
                                "<td class='center b'>"+data.totalDiedTerm+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalAbs+"</td>"+
                                "<td class='center b'>"+data.totalComm+"</td>"+
                                "<td class='center b'>"+data.totalVio+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalExt+"</td>"+
                                "<td class='center b'>"+data.totalTransfer+"</td>"+
                                "<td class='center b'>"+data.totalOthers+"</td>"+
                                "<td class='center b'>"+data.totalDropped+"</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }

    //@TODO
    var f5_field_office_pi_f4 = function(){
        var payload = { 
            method : "f5_field_office_ps_f1_p3",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                    data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                "<td class='b center'>0</td>"+
                                
                            "</tr>";

                    $(".repbody").append(data);

                })
            }
        });
    }


    var f5_field_office_ps_f2_p1 = function(){
        var payload = { 
            method : "f5_field_office_ps_f2_p1",
            Y_M : "2019-01",
            END_Y_M: $.wms.urlParam('date'),
            REGION : $.wms.urlParam('reg2')
        };
        $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){

                result.payload.forEach(function(data){
                    //console.log(field.NAME)

                   data = "<tr>"+
                                "<td class='b'>"+data.FIELD+"</td>"+
                                "<td class='center b'>"+data.totalCarryTerm+"</td>"+
                                "<td class='center b'>"+data.totalCarryRevoc+"</td>"+
                                "<td class='center b'>"+data.totalCarryExt+"</td>"+
                                "<td class='center b'>"+data.totalCarryTrans+"</td>"+
                                "<td class='center b'>"+data.totalCarryOth+"</td>"+
                                "<td class='center b'>"+data.totalCarryOver+"</td>"+
                                "<td class='center b'>"+data.totalTerm+"</td>"+
                                "<td class='center b'>"+data.totalRevoc+"</td>"+
                                "<td class='center b'>"+data.totalExt+"</td>"+
                                "<td class='center b'>"+data.totalOther+"</td>"+
                                "<td class='center b'>"+data.totalTrans+"</td>"+
                                "<td class='center b'>"+data.totalSubmitted+"</td>"+
                                "<td class='center b'>"+data.totalCasesBeActed+"</td>"+
                                
                            "</tr>";


                    $(".repbody").append(data);

                })
            }
        });
    }

    var f5_field_office_ps_f2_p2 = function(){
            var payload = { 
                method : "f5_field_office_ps_f2_p2",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
                REGION : $.wms.urlParam('reg2')
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b'>"+data.FIELD+"</td>"+
                                    "<td class='b center'>"+data.totalCasesBeActed+"</td>"+
                                    "<td class='b center'>"+data.totalFullTerm+"</td>"+
                                    "<td class='b center'>"+data.totalEarlyTerm+"</td>"+
                                    "<td class='b center'>"+data.totalDiedTerm+"</td>"+
                                    "<td class='b center'>"+data.totalTerm+"</td>"+
                                    "<td class='b center'>"+data.totalAbs+"</td>"+
                                    "<td class='b center'>"+data.totalComm+"</td>"+
                                    "<td class='b center'>"+data.totalVio+"</td>"+
                                    "<td class='b center'>"+data.totalOther+"</td>"+
                                    "<td class='b center'>"+data.totalRevoc+"</td>"+
                                    "<td class='b center'>"+data.totalExt+"</td>"+
                                    "<td class='b center'>"+data.totalTransfer+"</td>"+
                                    "<td class='b center'>"+data.totalOthers+"</td>"+
                                    "<td class='b center'>"+data.totalDisposed+"</td>"+
                                    "<td class='b center'>"+data.totalPending+"</td>"+
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }


        var f5_field_office_ps_f3 = function(){
            var payload = { 
                method : "f5_field_office_ps_f3",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
                REGION : $.wms.urlParam('reg2')
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.FIELD+"</td>"+
                                    "<td class='b center'>"+data.totalCarryOver+"</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>"+data.totalCasesHandled+"</td>"+
                                    "<td class='b center'>"+data.totalCompltd+"</td>"+
                                    "<td class='b center'>"+data.totalCourtesy+"</td>"+
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }

        //REGIONAL -- FORM 21
        var f21_field_office_ppi_f1_p1 = function(){
            var payload = { 
                method : "f21_field_office_ppi_f1_p1",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
                REGION : $.wms.urlParam('reg2')
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.FIELD+"</td>"+
                                    "<td class='b center'>"+data.totalCarryOver+"</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>0</td>"+
                                    "<td class='b center'>"+data.totalRcv+"</td>"+
                                    "<td class='b center'>"+data.totalCasesHandled+"</td>"
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }


        var f21_field_office_ppi_f1_p3 = function(){
            var payload = { 
                method : "f21_field_office_ppi_f1_p3",
                Y_M : "2019-01",
                END_Y_M: $.wms.urlParam('date'),
                REGION : $.wms.urlParam('reg2')
            };
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/reports',JSON.stringify(payload)).done(function (result) {
                if(result.status != undefined && result.status == "SUCCESS"){

                    result.payload.forEach(function(data){
                        //console.log(field.NAME)

                        data = "<tr>"+
                                    "<td class='b' width='15%'>"+data.FIELD+"</td>"+
                                    "<td class='b center'>"+data.totalInvestigationReport+"</td>"+
                                    "<td class='b center'>"+data.totalTransfer+"</td>"+
                                    "<td class='b center'>"+data.totalOther+"</td>"+
                                    "<td class='b center'>"+data.totalActed+"</td>" +
                                    "<td class='b center'>"+data.totalActive+"</td>" + 
                                    
                                "</tr>";

                        $(".repbody").append(data);

                    })
                }
            });
        }




   

   

    
    return {
       load : __load
    };
}());
