/*   
 * This the Dashboard JS of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.reports = (typeof $.wms.reports !== 'undefined') ? $.wms.reports : {};

$.wms.reports = (function() {


    var __attachF21PCS = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field')
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F21SUMMARY',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){
                console.log(result);
                payload = result.payload
                $(".totalCarryOverInvestigation").html(payload.totalCarryOverInvestigation.count)
                $(".totalRcvTotalInvestigation").html(payload.totalRcvTotalInvestigation.count)
                $(".totalRcvPrisonInvestigation").html(payload.totalRcvPrisonInvestigation.count)
                $(".totalCarryOverSupvIV").html(payload.totalCarryOverSupvIV.count)
                $(".totalCarryOverSupvParolIV").html(payload.totalCarryOverSupvParolIV.count)
                $(".totalCarryOverSupvPardonIV").html(payload.totalCarryOverSupvPardonIV.count)
                $(".totalRcvJailInvestigation").html(payload.totalRcvJailInvestigation.count)
                $(".totalRcvPenalInvestigation").html(payload.totalRcvPenalInvestigation.count)
                $(".totalCasesHandled").html(payload.totalCasesHandled.count)
                $(".totalRefActed").html(payload.totalRefActed.count)
                $(".totalReportSubmitted").html(payload.totalReportSubmitted.count)
                $(".totalRefParoleActed").html(payload.totalRefParoleActed.count)
                $(".totalRefParoleGrantActed").html(payload.totalRefParoleGrantActed.count)
                $(".totalRefParoleDeniedActed").html(payload.totalRefParoleDeniedActed.count)
                $(".totalRefCommActed").html(payload.totalRefCommActed.count)
                $(".totalRefCommGrantActed").html(payload.totalRefCommGrantActed.count)
                $(".totalRefCommDeniedActed").html(payload.totalRefCommDeniedActed.count)
                $(".totalRefCondActed").html(payload.totalRefCondActed.count)
                $(".totalRefCondGrantActed").html(payload.totalRefCondGrantActed.count)
                $(".totalRefCondDeniedActed").html(payload.totalRefCondDeniedActed.count)
                $(".totalRefAbsActed").html(payload.totalRefAbsActed.count)
                $(".totalRefAbsGrantActed").html(payload.totalRefAbsGrantActed.count)
                $(".totalRefAbsDeniedActed").html(payload.totalRefAbsDeniedActed.count)
                $(".totalRefOthers").html(payload.totalRefOthers.count)
                $(".totalTransferredSubmitted").html(payload.totalTransferredSubmitted.count)
                $(".totalActivePreParole").html(payload.totalActivePreParole.count)
                $(".totalCarryOverPendingResolution").html(payload.totalCarryOverPendingResolution.count)
                $(".totalCasestobeActed").html(payload.totalCasestobeActed.count)
                $(".totalCasesResolvedGrantedParole").html(payload.totalCasesResolvedGrantedParole.count)
                $(".totalCasesResolvedGrantedComm").html(payload.totalCasesResolvedGrantedComm.count)
                $(".totalCasesResolvedGrantedCond").html(payload.totalCasesResolvedGrantedCond.count)
                $(".totalCasesResolvedGrantedAbs").html(payload.totalCasesResolvedGrantedAbs.count)
                $(".totalCasesResolvedGranted").html(payload.totalCasesResolvedGranted.count)
                $(".totalCasesResolvedDenied").html(payload.totalCasesResolvedDenied.count)
                $(".totalCasesResolvedDeniedParole").html(payload.totalCasesResolvedDeniedParole.count)
                $(".totalCasesResolvedDeniedComm").html(payload.totalCasesResolvedDeniedComm.count)
                $(".totalCasesResolvedDeniedCond").html(payload.totalCasesResolvedDeniedCond.count)
                $(".totalCasesResolvedDeniedAbs").html(payload.totalCasesResolvedDeniedAbs.count)
                $(".totalCasesResolvedCancelled").html(payload.totalCasesResolvedCancelled.count)
                $(".totalCasesResolvedCancelledParole").html(payload.totalCasesResolvedCancelledParole.count)
                $(".totalCasesResolvedCancelledComm").html(payload.totalCasesResolvedCancelledComm.count)
                $(".totalCasesResolvedCancelledCond").html(payload.totalCasesResolvedCancelledCond.count)
                $(".totalCasesResolvedCancelledAbs").html(payload.totalCasesResolvedCancelledAbs.count)
                $(".totalCasesResolvedDied").html(payload.totalCasesResolvedDied.count)
                $(".totalCasesResolvedOther").html(payload.totalCasesResolvedOther.count)
                $(".totalCasesResolvedCount").html(payload.totalCasesResolvedCount.count)
                $(".totalCasesResolvedPSOther").html(payload.totalCasesResolvedPSOther.count)
                $(".totalCasesPendingResolution").html(payload.totalCasesPendingResolution.count)
                $(".totalCarryOverCI").html(payload.totalCarryOverCI.count)
                $(".totalRcvCI").html(payload.totalRcvCI.count)
                $(".totalCountCI").html(payload.totalCountCI.count)
                $(".totalCmpltdCI").html(payload.totalCmpltdCI.count)
                $(".totalCountActiveCI").html(payload.totalCountActiveCI.count)
                $(".totalCarryOverSupv").html(payload.totalCarryOverSupv.count)
                $(".totalCarryOverSupvParol").html(payload.totalCarryOverSupvParol.count)
                $(".totalCarryOverSupvPardon").html(payload.totalCarryOverSupvPardon.count)
                $(".totalRefRcvSupv").html(payload.totalRefRcvSupv.count)
                $(".totalRefRcvSupvParol").html(payload.totalRefRcvSupvParol.count)
                $(".totalRefRcvSupvPardon").html(payload.totalRefRcvSupvPardon.count)
                $(".totalSupvCasesHandled").html(payload.totalSupvCasesHandled.count)
                $(".totalSupvCasesHandledParol").html(payload.totalSupvCasesHandledParol.count)
                $(".totalSupvCasesHandledPardon").html(payload.totalSupvCasesHandledPardon.count)
                $(".totalCasesResolvedFinalParol").html(payload.totalCasesResolvedFinalParol.count)
                $(".totalCasesResolvedFinalPardon").html(payload.totalCasesResolvedFinalPardon.count)
                $(".totalCasesResolvedFinal").html(payload.totalCasesResolvedFinal.count)
                $(".totalCasesResolvedArrestParol").html(payload.totalCasesResolvedArrestParol.count)
                $(".totalCasesResolvedArrestPardon").html(payload.totalCasesResolvedArrestPardon.count)
                $(".totalCasesResolvedArrest").html(payload.totalCasesResolvedArrest.count)
                $(".totalCasesResolvedDeathParol").html(payload.totalCasesResolvedDeathParol.count)
                $(".totalCasesResolvedDeathPardon").html(payload.totalCasesResolvedDeathPardon.count)
                $(".totalCasesResolvedDeath").html(payload.totalCasesResolvedDeath.count)
                $(".totalCasesResolvedRegionalParol").html(payload.totalCasesResolvedRegionalParol.count)
                $(".totalCasesResolvedRegionalPardon").html(payload.totalCasesResolvedRegionalPardon.count)
                $(".totalCasesResolvedRegional").html(payload.totalCasesResolvedRegional.count)
                $(".totalSupervisionCasesDropped").html(payload.totalSupervisionCasesDropped.count)
                $(".SupvActedSummaryTotal").html(payload.SupvActedSummaryTotal.count)
                $(".SupvActedSummaryParol").html(payload.SupvActedSummaryParol.count)
                $(".SupvActedSummaryPardon").html(payload.SupvActedSummaryPardon.count)
                $(".SupvActedInfraTotal").html(payload.SupvActedInfraTotal.count)
                $(".SupvActedInfraParol").html(payload.SupvActedInfraParol.count)
                $(".SupvActedInfraPardon").html(payload.SupvActedInfraPardon.count)
                $(".SupvActedDeathTotal").html(payload.SupvActedDeathTotal.count)
                $(".SupvActedDeathParol").html(payload.SupvActedDeathParol.count)
                $(".SupvActedDeathPardon").html(payload.SupvActedDeathPardon.count)
                $(".totalReportSubmittedtoBoard").html(payload.totalReportSubmittedtoBoard.count)
                $(".totalReportSubmittedRegional").html(payload.totalReportSubmittedRegional.count)
                $(".totalReportSubmittedRegionalParol").html(payload.totalReportSubmittedRegionalParol.count)
                $(".totalReportSubmittedRegionalPardon").html(payload.totalReportSubmittedRegionalPardon.count)
                $(".totalSupervisionCasesActed").html(payload.totalSupervisionCasesActed.count)
                $(".totalActiveSupervisionCasesParole").html(payload.totalActiveSupervisionCasesParole.count)
                $(".totalActiveSupervisionCasesPardon").html(payload.totalActiveSupervisionCasesPardon.count)
                $(".totalActiveSupervisionCases").html(payload.totalActiveSupervisionCases.count)
                $(".totalCarryOverPendingParol").html(payload.totalCarryOverPendingParol.count)
                $(".totalCarryOverPendingPardon").html(payload.totalCarryOverPendingPardon.count)
                $(".totalCarryOverPending").html(payload.totalCarryOverPending.count)
                $(".totalCasesToActedByBoardParol").html(payload.totalCasesToActedByBoardParol.count)
                $(".totalCasesToActedByBoardPardon").html(payload.totalCasesToActedByBoardPardon.count)
                $(".totalCasesToActedByBoard").html(payload.totalCasesToActedByBoard.count)
                $(".totalCasesResolvedBoard").html(payload.totalCasesResolvedBoard.count)
                $(".totalCasesPendingResolutionBoardParol").html(payload.totalCasesPendingResolutionBoardParol.count)
                $(".totalCasesPendingResolutionBoardPardon").html(payload.totalCasesPendingResolutionBoardPardon.count)
                $(".totalCasesPendingResolutionBoard").html(payload.totalCasesPendingResolutionBoard.count)
                $(".totalCarryOverPendingRegionalParol").html(payload.totalCarryOverPendingRegionalParol.count)
                $(".totalCarryOverPendingRegionalPardon").html(payload.totalCarryOverPendingRegionalPardon.count)
                $(".totalCarryOverPendingRegional").html(payload.totalCarryOverPendingRegional.count)
                $(".totalCasesToActedByRegionalPardon").html(payload.totalCasesToActedByRegionalPardon.count)
                $(".totalCasesToActedByRegionalParol").html(payload.totalCasesToActedByRegionalParol.count)
                $(".totalCasesToActedByRegional").html(payload.totalCasesToActedByRegional.count)
                
                $(".totalCarryOverSupvParol").html(payload.totalCarryOverSupvParol.count)
                $(".totalCarryOverSupvPardon").html(payload.totalCarryOverSupvPardon.count)
                $(".totalCarryOverSupv").html(payload.totalCarryOverSupv.count)
                $(".totalRcvSupvParol").html(payload.totalRcvSupvParol.count)
                $(".totalRcvSupvPardon").html(payload.totalRcvSupvPardon.count)
                $(".totalRcvSupv").html(payload.totalRcvSupv.count)
                $(".totalCourtesySupvParol").html(payload.totalCourtesySupvParol.count)
                $(".totalCourtesySupvPardon").html(payload.totalCourtesySupvPardon.count)
                $(".totalCourtesySupvTotal").html(payload.totalCourtesySupvTotal.count)
                $(".totalTermSupvParol").html(payload.totalTermSupvParol.count)
                $(".totalTermSupvPardon").html(payload.totalTermSupvPardon.count)
                $(".totalTermSupv").html(payload.totalTermSupv.count)
                $(".totalActCourtesySupvParol").html(payload.totalActCourtesySupvParol.count)
                $(".totalActCourtesySupvPardon").html(payload.totalActCourtesySupvPardon.count)
                $(".totalActCourtesySupv").html(payload.totalActCourtesySupv.count)


                $(".SupvActedOtherParol").html(payload.SupvActedOtherParol.count)
                $(".SupvActedOtherPardon").html(payload.SupvActedOtherPardon.count)
                $(".SupvActedOtherTotal").html(payload.SupvActedOtherTotal.count)

                $(".totalCasesResolvedPSOtherParolCount").html(payload.totalCasesResolvedPSOtherParolData.length)
                $(".totalCasesResolvedPSOtherPardonCount").html(payload.totalCasesResolvedPSOtherPardonData.length)


                totalCasesActedUponParol = parseInt(payload.totalCarryOverPendingRegionalParol.count) + parseInt(payload.totalReportSubmittedRegionalParol.count)
                totalCasesActedUponPardon = parseInt(payload.totalCarryOverPendingRegionalPardon.count) + parseInt(payload.totalReportSubmittedRegionalPardon.count)
                totalCasesActedUpon = totalCasesActedUponParol + totalCasesActedUponPardon
                $(".totalCasesActedUponParol").html(totalCasesActedUponParol)
                $(".totalCasesActedUponPardon").html(totalCasesActedUponPardon)
                $(".totalCasesActedUpon").html(totalCasesActedUpon)

                totalCasesPendingResolutionRegionalParol = parseInt(totalCasesActedUponParol) - parseInt(payload.totalCasesResolvedRegionalParol.count)
                totalCasesPendingResolutionRegionalPardon = parseInt(totalCasesActedUponPardon) - parseInt(payload.totalCasesResolvedRegionalPardon.count)
                totalCasesPendingResolutionRegional = totalCasesPendingResolutionRegionalParol + totalCasesPendingResolutionRegionalPardon
                $(".totalCasesPendingResolutionRegionalParol").html(totalCasesPendingResolutionRegionalParol)
                $(".totalCasesPendingResolutionRegionalPardon").html(totalCasesPendingResolutionRegionalPardon)
                $(".totalCasesPendingResolutionRegional").html(totalCasesPendingResolutionRegional)


                
                for(i=0;i<payload.SupvActedOtherParolData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".iv_e_d_1").append(
                         '<div class="row">'+
                            '<div class="col-lg-9 col-md-9 col-sm-9 col-print-9">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              (i+1)+". " + payload.SupvActedOtherParolData[i].submitted_report +
                            '</div>' +
                            '<div class="col-lg-3 col-md-3 col-sm-3 col-print-3">' +
                            '</div>' +
                          '</div>'
                        )

                }
                for(i=0;i<payload.SupvActedOtherPardonData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".iv_e_d_2").append(
                         '<div class="row">'+
                            '<div class="col-lg-9 col-md-9 col-sm-9 col-print-9">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              (i+1)+". " + payload.SupvActedOtherPardonData[i].submitted_report +
                            '</div>' +
                            '<div class="col-lg-3 col-md-3 col-sm-3 col-print-3">' +
                            '</div>' +
                          '</div>'
                        )

                }


                for(i=0;i<payload.totalCasesResolvedPSOtherParolData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".v_d_4_1").append(
                         '<div class="row">'+
                            '<div class="col-lg-9 col-md-9 col-sm-9 col-print-9">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              (i+1)+". " + payload.totalCasesResolvedPSOtherParolData[i].submitted_report +
                            '</div>' +
                            '<div class="col-lg-3 col-md-3 col-sm-3 col-print-3">' +
                            '</div>' +
                          '</div>'
                        )

                }

                for(i=0;i<payload.totalCasesResolvedPSOtherPardonData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".v_d_4_2").append(
                         '<div class="row">'+
                            '<div class="col-lg-9 col-md-9 col-sm-9 col-print-9">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              (i+1)+". " + payload.totalCasesResolvedPSOtherPardonData[i].submitted_report +
                            '</div>' +
                            '<div class="col-lg-3 col-md-3 col-sm-3 col-print-3">' +
                            '</div>' +
                          '</div>'
                        )

                }

            }
        });
    }

    var __attachF5PCS = function() {
        var payload = {
            "Y_M" : $.wms.urlParam('date'),
            "field_office" : $.wms.urlParam('field')
        }
        $.wms.executeExternalPost('/ppa-api-uams/wsv1/Cmis/F5SUMMARY',JSON.stringify(payload)).done(function (result) {
            if(result.status != undefined && result.status == "SUCCESS"){
                console.log(result);
                payload = result.payload
                $(".carryOverInvestigationJICL").html(payload.carryOverInvestigationJICL)
                $(".carryOverInvestigationAdult").html(payload.carryOverInvestigationAdult)
                $(".carryOverInvestigationTotal").html(payload.carryOverInvestigationTotal)

                $(".rcvInvestigationAdult").html(payload.rcvInvestigationAdult);
                $(".rcvInvestigationJICL").html(payload.rcvInvestigationJICL);
                $(".rcvInvestigationTotal").html(payload.rcvInvestigationTotal);
                
                $(".CaseHandledAdult").html(payload.CaseHandledAdult);
                $(".CaseHandledJICL").html(payload.CaseHandledJICL);
                $(".CaseHandledTotal").html(payload.CaseHandledTotal);

                $(".rcvInvestigationJICLCivilNew").html(payload.rcvInvestigationJICLCivilNew.count);
                $(".rcvInvestigationAdultCivilNew").html(payload.rcvInvestigationAdultCivilNew.count);
                $(".rcvInvestigationTotalCivilNew").html(payload.rcvInvestigationTotalCivilNew.count);

                $(".rcvInvestigationJICLMilNew").html(payload.rcvInvestigationJICLMilNew.count);
                $(".rcvInvestigationAdultMilNew").html(payload.rcvInvestigationAdultMilNew.count);
                $(".rcvInvestigationTotalMilNew").html(payload.rcvInvestigationTotalMilNew.count);

                $(".rcvInvestigationAdultRPI").html(payload.rcvInvestigationAdultRPI.count);
                $(".rcvInvestigationJICLRPI").html(payload.rcvInvestigationJICLRPI.count);
                $(".rcvInvestigationTotalRPI").html(payload.rcvInvestigationTotalRPI.count);


                $(".actedInvestigationJICL").html(payload.actedInvestigationJICL);
                $(".actedInvestigationAdult").html(payload.actedInvestigationAdult);
                $(".actedInvestigationTotal").html(payload.actedInvestigationTotal);
                

                $(".actedInvestigationJICLGrant").html(payload.actedInvestigationJICLGrant);
                $(".actedInvestigationAdultGrant").html(payload.actedInvestigationAdultGrant);
                $(".actedInvestigationTotalGrant").html(payload.actedInvestigationTotalGrant);

                $(".actedInvestigationJICLDenial").html(payload.actedInvestigationJICLDenial);
                $(".actedInvestigationAdultDenial").html(payload.actedInvestigationAdultDenial);
                $(".actedInvestigationTotalDenial").html(payload.actedInvestigationTotalDenial);


                $(".actedInvestigationTotalJICL").html(payload.actedInvestigationTotalJICL);
                $(".actedInvestigationTotalADULT").html(payload.actedInvestigationTotalADULT);
                $(".actedInvestigationTotalTOTAL").html(payload.actedInvestigationTotalTOTAL);


                $(".actedInvestigationTotalReportJICL").html(payload.actedInvestigationTotalReportJICL);
                $(".actedInvestigationTotalReportADULT").html(payload.actedInvestigationTotalReportADULT);
                $(".actedInvestigationTotalReportTOTAL").html(payload.actedInvestigationTotalReportTOTAL);


                $(".actedInvestigationJICLManifest").html(payload.actedInvestigationJICLManifest);
                $(".actedInvestigationAdultManifest").html(payload.actedInvestigationAdultManifest);
                $(".actedInvestigationTotalManifest").html(payload.actedInvestigationTotalManifest);

                $(".actedInvestigationJICLTransfer").html(payload.actedInvestigationJICLTransfer);
                $(".actedInvestigationAdultTransfer").html(payload.actedInvestigationAdultTransfer);
                $(".actedInvestigationTotalTransfer").html(payload.actedInvestigationTotalTransfer); 


                $(".actedInvestigationTotalJICLSubmitted").html(payload.actedInvestigationTotalJICLSubmitted);
                $(".actedInvestigationTotalADULTSubmitted").html(payload.actedInvestigationTotalADULTSubmitted);
                $(".actedInvestigationTotalTOTALSubmitted").html(payload.actedInvestigationTotalTOTALSubmitted);


                $(".notactedInvestigationJICLTotal").html(payload.notactedInvestigationJICLTotal);
                $(".notactedInvestigationAdultTotal").html(payload.notactedInvestigationAdultTotal);
                $(".notactedInvestigationTotal").html(payload.notactedInvestigationTotal);

                $(".notactedJICLInvestigationRecalled").html(payload.notactedJICLInvestigationRecalled);
                $(".notactedAdultInvestigationRecalled").html(payload.notactedAdultInvestigationRecalled);
                $(".notactedTotalInvestigationRecalled").html(payload.notactedTotalInvestigationRecalled);

                $(".notactedJICLInvestigationWarrant").html(payload.notactedJICLInvestigationWarrant);
                $(".notactedAdultInvestigationWarrant").html(payload.notactedAdultInvestigationWarrant);
                $(".notactedTotalInvestigationWarrant").html(payload.notactedTotalInvestigationWarrant);
                
                $(".activeInvestigationTotalJICL").html(payload.activeInvestigationTotalJICL);
                $(".activeInvestigationTotalADULT").html(payload.activeInvestigationTotalADULT);
                $(".activeInvestigationTotalTOTAL").html(payload.activeInvestigationTotalTOTAL);

                $(".carryOverDispositionTotalJICL").html(payload.carryOverDispositionTotalJICL.count);
                $(".carryOverDispositionTotalAdult").html(payload.carryOverDispositionTotalAdult.count);
                $(".carryOverDispositionTotalTotal").html(payload.carryOverDispositionTotalTotal.count);
               

                /*$(".submittedDispositionTotalJICL").html(payload.submittedDispositionTotalJICL.count);
                $(".submittedDispositionTotalAdult").html(payload.submittedDispositionTotalAdult.count);
                $(".submittedDispositionTotalTotal").html(payload.submittedDispositionTotalTotal.count);
                */
                $(".tobeactedDispositionTotalJICL").html(payload.tobeactedDispositionTotalJICL.count);
                $(".tobeactedDispositionTotalAdult").html(payload.tobeactedDispositionTotalAdult.count);
                $(".tobeactedDispositionTotalTotal").html(payload.tobeactedDispositionTotalTotal.count);

                $(".casedDispositionTotalJICL").html(payload.casedDispositionTotalJICL.count);
                $(".casedDispositionTotalAdult").html(payload.casedDispositionTotalAdult.count);
                $(".casedDispositionTotalTotal").html(payload.casedDispositionTotalTotal.count);


                $(".casedDispositionGrantJICL").html(payload.casedDispositionGrantJICL.count);
                $(".casedDispositionGrantAdult").html(payload.casedDispositionGrantAdult.count);
                $(".casedDispositionGrantTotal").html(payload.casedDispositionGrantTotal.count);

                $(".casedDispositionDeniedJICL").html(payload.casedDispositionDeniedJICL.count);
                $(".casedDispositionDeniedAdult").html(payload.casedDispositionDeniedAdult.count);
                $(".casedDispositionDeniedTotal").html(payload.casedDispositionDeniedTotal.count);

                //console.log(payload.casedDispositionDeniedData.length);
                for(i=0;i<payload.casedDispositionDeniedData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".denialReasons").append(
                         '<div class="row">'+
                            '<div class="col-lg-7 col-md-7 col-sm-7 col-print-7">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              numberToLetters(i)+". " + payload.casedDispositionDeniedData[i].reason_denial +
                            '</div>' +
                            '<div class="col-lg-5 col-md-5 col-sm-5 col-print-5">' +
                            '</div>' +
                          '</div>'
                        )

                }

                //console.log(payload.casedDispositionDeniedData.length);
                for(i=0;i<payload.casedDispositionDismissedData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".dismissedReasons").append(
                         '<div class="row">'+
                            '<div class="col-lg-7 col-md-7 col-sm-7 col-print-7">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              numberToLetters(i)+". " + payload.casedDispositionDismissedData[i].reason_denial +
                            '</div>' +
                            '<div class="col-lg-5 col-md-5 col-sm-5 col-print-5">' +
                            '</div>' +
                          '</div>'
                        )

                }


                for(i=0;i<payload.casedDispositionOtherData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".kindOthers").append(
                         '<div class="row">'+
                            '<div class="col-lg-7 col-md-7 col-sm-7 col-print-7">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              numberToLetters(i)+". " + payload.casedDispositionOtherData[i].other_types +
                            '</div>' +
                            '<div class="col-lg-5 col-md-5 col-sm-5 col-print-5">' +
                            '</div>' +
                          '</div>'
                        )

                }


                for(i=0;i<payload.totalDrpSupvOtherRevocData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".revocreasons").append(
                         '<div class="row">'+
                            '<div class="col-lg-7 col-md-7 col-sm-7 col-print-7">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              numberToLetters(i)+". " + payload.totalDrpSupvOtherRevocData[i].reason_other +
                            '</div>' +
                            '<div class="col-lg-5 col-md-5 col-sm-5 col-print-5">' +
                            '</div>' +
                          '</div>'
                        )

                }


                //revocreasons_IVD2D
                for(i=0;i<payload.totalSubSupvOtherRevocData.length;i++){
                    //console.log(numberToLetters(i));
                    $(".revocreasons_IVD2D").append(
                         '<div class="row">'+
                            '<div class="col-lg-7 col-md-7 col-sm-7 col-print-7">' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              '&nbsp;&nbsp;&nbsp;' +
                              numberToLetters(i)+". " + payload.totalSubSupvOtherRevocData[i].reason_other +
                            '</div>' +
                            '<div class="col-lg-5 col-md-5 col-sm-5 col-print-5">' +
                            '</div>' +
                          '</div>'
                        )

                }


                $(".casedDispositionDiedJICL").html(payload.casedDispositionDiedJICL.count);
                $(".casedDispositionDiedAdult").html(payload.casedDispositionDiedAdult.count);
                $(".casedDispositionDiedTotal").html(payload.casedDispositionDiedTotal.count);

                $(".casedDispositionWithJICL").html(payload.casedDispositionWithJICL.count);
                $(".casedDispositionWithAdult").html(payload.casedDispositionWithAdult.count);
                $(".casedDispositionWithTotal").html(payload.casedDispositionWithTotal.count);

               $(".totalRcvSupvJICLLocal").html(payload.totalRcvSupvJICLLocal.count);
                $(".totalRcvSupvAdultLocal").html(payload.totalRcvSupvAdultLocal.count);
                $(".totalRcvSupvLocal").html(payload.totalRcvSupvLocal.count);

                
               $(".totalRcvSupvJICLDirect").html(payload.totalRcvSupvJICLDirect.count);
                $(".totalRcvSupvAdultDirect").html(payload.totalRcvSupvAdultDirect.count);
                $(".totalRcvSupvDirect").html(payload.totalRcvSupvDirect.count);

                $(".totalRcvSupvJICLTransfer").html(payload.totalRcvSupvJICLTransfer.count);
                $(".totalRcvSupvAdultTransfer").html(payload.totalRcvSupvAdultTransfer.count);
                $(".totalRcvSupvTransfer").html(payload.totalRcvSupvTransfer.count);
                
                $(".totalRcvSupvJICLMilitar").html(payload.totalRcvSupvJICLMilitar.count);
                $(".totalRcvSupvAdultMilitar").html(payload.totalRcvSupvAdultMilitar.count);
                $(".totalRcvSupvMilitar").html(payload.totalRcvSupvMilitar.count);
                

                $(".carryOverDispTransSupvJICL").html(payload.carryOverDispTransSupvJICL.count);
                $(".carryOverDispTransSupvAdult").html(payload.carryOverDispTransSupvAdult.count);
                $(".carryOverDispTransSupvTotal").html(payload.carryOverDispTransSupvTotal.count);


                $(".totalRcvSupvJICLRecon").html(payload.totalRcvSupvJICLRecon.count);
                $(".totalRcvSupvAdultRecon").html(payload.totalRcvSupvAdultRecon.count);
                $(".totalRcvSupvRecon").html(payload.totalRcvSupvRecon.count);

                $(".casedDispositionReinvJICL").html(payload.casedDispositionReinvJICL.count);
                $(".casedDispositionReinvAdult").html(payload.casedDispositionReinvAdult.count);
                $(".casedDispositionReinvTotal").html(payload.casedDispositionReinvTotal.count);

                /*New 2021-01-16*/
                $(".casedDispositionOtherJICL").html(payload.casedDispositionOtherJICL.count);
                $(".casedDispositionOtherAdult").html(payload.casedDispositionOtherAdult.count);
                $(".casedDispositionOtherTotal").html(payload.casedDispositionOtherTotal.count);
                /*New 2021-01-16*/


                $(".casePendingDispositionJICLTotal").html(payload.casePendingDispositionJICLTotal.count);
                $(".casePendingDispositionAdultTotal").html(payload.casePendingDispositionAdultTotal.count);
                $(".casePendingDispositionTotalTotal").html(payload.casePendingDispositionTotalTotal.count);

                $(".totalCarryOverCPIJICL").html(payload.totalCarryOverCPIJICL.count);
                $(".totalCarryOverCPIAdult").html(payload.totalCarryOverCPIAdult.count);
                $(".totalCarryOverCPITotal").html(payload.totalCarryOverCPITotal.count);


                $(".totalRcvCPIJICL").html(payload.totalRcvCPIJICL.count);
                $(".totalRcvCPIAdult").html(payload.totalRcvCPIAdult.count);
                $(".totalRcvCPITotal").html(payload.totalRcvCPITotal.count);


                $(".totalHandledCPIJICL").html(payload.totalHandledCPIJICL.count);
                $(".totalHandledCPIAdult").html(payload.totalHandledCPIAdult.count);
                $(".totalHandledCPITotal").html(payload.totalHandledCPITotal.count);


                $(".totalCmpltdCPIJICL").html(payload.totalCmpltdCPIJICL.count);
                $(".totalCmpltdCPIAdult").html(payload.totalCmpltdCPIAdult.count);
                $(".totalCmpltdCPITotal").html(payload.totalCmpltdCPITotal.count);


                $(".totalActiveCPIJICL").html(payload.totalActiveCPIJICL.count);
                $(".totalActiveCPIAdult").html(payload.totalActiveCPIAdult.count);
                $(".totalActiveCPITotal").html(payload.totalActiveCPITotal.count);

                $(".totalCarryOverSupvJICL").html(payload.totalCarryOverSupvJICL.count);
                $(".totalCarryOverSupvAdult").html(payload.totalCarryOverSupvAdult.count);
                $(".totalCarryOverSupvTotal").html(payload.totalCarryOverSupvTotal.count);

                $(".totalRcvSupvJICL").html(payload.totalRcvSupvJICL.count);
                $(".totalRcvSupvAdult").html(payload.totalRcvSupvAdult.count);
                $(".totalRcvSupvTotal").html(payload.totalRcvSupvTotal.count);

                $(".totalHandledPSJICL").html(payload.totalHandledPSJICL.count);
                $(".totalHandledPSAdult").html(payload.totalHandledPSAdult.count);
                $(".totalHandledPSTotal").html(payload.totalHandledPSTotal.count);

                /*$(".totalDrpSupvJICL").html(payload.totalDrpSupvJICL.count);
                $(".totalDrpSupvAdult").html(payload.totalDrpSupvAdult.count);
                $(".totalDrpSupvTotal").html(payload.totalDrpSupvTotal.count);*/
                
                totalDrpSupvJICL = parseInt(payload.totalDrpSupvTermJICL.count) + parseInt(payload.totalDrpSupvRevocJICL.count) + parseInt(payload.totalDrpSupvTransferJICL.count)
                totalDrpSupvAdult= parseInt(payload.totalDrpSupvTermAdult.count) + parseInt(payload.totalDrpSupvRevocAdult.count) + parseInt(payload.totalDrpSupvTransferAdult.count)
                totalDrpSupvTotal =  totalDrpSupvAdult + totalDrpSupvJICL
                $(".totalDrpSupvJICL").html(totalDrpSupvJICL);
                $(".totalDrpSupvAdult").html(totalDrpSupvAdult);
                $(".totalDrpSupvTotal").html(totalDrpSupvTotal);


                VtotalDrpSupvJICL = parseInt(totalDrpSupvJICL) + parseInt(payload.totalDrpSupvExtRevocJICL.count)
                VtotalDrpSupvAdult= parseInt(totalDrpSupvAdult) + parseInt(payload.totalDrpSupvExtRevocAdult.count) 
                VtotalDrpSupvTotal =  VtotalDrpSupvAdult + VtotalDrpSupvJICL
                $(".VtotalDrpSupvJICL").html(VtotalDrpSupvJICL);
                $(".VtotalDrpSupvAdult").html(VtotalDrpSupvAdult);
                $(".VtotalDrpSupvTotal").html(VtotalDrpSupvTotal);

                $(".totalDrpSupvTermJICL").html(payload.totalDrpSupvTermJICL.count);
                $(".totalDrpSupvTermAdult").html(payload.totalDrpSupvTermAdult.count);
                $(".totalDrpSupvTermTotal").html(payload.totalDrpSupvTermTotal.count);


                $(".totalDrpSupvFullTermJICL").html(payload.totalDrpSupvFullTermJICL.count);
                $(".totalDrpSupvFullTermAdult").html(payload.totalDrpSupvFullTermAdult.count);
                $(".totalDrpSupvFullTermTotal").html(payload.totalDrpSupvFullTermTotal.count);

                $(".totalDrpSupvEarlyTermJICL").html(payload.totalDrpSupvEarlyTermJICL.count);
                $(".totalDrpSupvEarlyTermAdult").html(payload.totalDrpSupvEarlyTermAdult.count);
                $(".totalDrpSupvEarlyTermTotal").html(payload.totalDrpSupvEarlyTermTotal.count);

                $(".totalDrpSupvDiedTermJICL").html(payload.totalDrpSupvDiedTermJICL.count);
                $(".totalDrpSupvDiedTermAdult").html(payload.totalDrpSupvDiedTermAdult.count);
                $(".totalDrpSupvDiedTermTotal").html(payload.totalDrpSupvDiedTermTotal.count);

                $(".totalDrpSupvRevocJICL").html(payload.totalDrpSupvRevocJICL.count);
                $(".totalDrpSupvRevocAdult").html(payload.totalDrpSupvRevocAdult.count);
                $(".totalDrpSupvRevocTotal").html(payload.totalDrpSupvRevocTotal.count);

                $(".totalDrpSupvAbsRevocJICL").html(payload.totalDrpSupvAbsRevocJICL.count);
                $(".totalDrpSupvAbsRevocAdult").html(payload.totalDrpSupvAbsRevocAdult.count);
                $(".totalDrpSupvAbsRevocTotal").html(payload.totalDrpSupvAbsRevocTotal.count);


                $(".totalDrpSupvCommRevocJICL").html(payload.totalDrpSupvCommRevocJICL.count);
                $(".totalDrpSupvCommRevocAdult").html(payload.totalDrpSupvCommRevocAdult.count);
                $(".totalDrpSupvCommRevocTotal").html(payload.totalDrpSupvCommRevocTotal.count);

                $(".totalDrpSupvViolRevocJICL").html(payload.totalDrpSupvViolRevocJICL.count);
                $(".totalDrpSupvViolRevocAdult").html(payload.totalDrpSupvViolRevocAdult.count);
                $(".totalDrpSupvViolRevocTotal").html(payload.totalDrpSupvViolRevocTotal.count);


                $(".totalDrpSupvOtherRevocJICL").html(payload.totalDrpSupvOtherRevocJICL.count);
                $(".totalDrpSupvOtherRevocAdult").html(payload.totalDrpSupvOtherRevocAdult.count);
                $(".totalDrpSupvOtherRevocTotal").html(payload.totalDrpSupvOtherRevocTotal.count);

                $(".totalDrpSupvExtRevocJICL").html(payload.totalDrpSupvExtRevocJICL.count);
                $(".totalDrpSupvExtRevocAdult").html(payload.totalDrpSupvExtRevocAdult.count);
                $(".totalDrpSupvExtRevocTotal").html(payload.totalDrpSupvExtRevocTotal.count);

                $(".totalDrpSupvTransferJICL").html(payload.totalDrpSupvTransferJICL.count);
                $(".totalDrpSupvTransferAdult").html(payload.totalDrpSupvTransferAdult.count);
                $(".totalDrpSupvTransferTotal").html(payload.totalDrpSupvTransferTotal.count);

                /*$(".totalActivePSJICL").html(payload.totalActivePSJICL.count);
                $(".totalActivePSAdult").html(payload.totalActivePSAdult.count);
                $(".totalActivePSTotal").html(payload.totalActivePSTotal.count);*/
                totalActivePSJICL = parseInt(payload.totalHandledPSJICL.count) - parseInt(totalDrpSupvJICL)
                totalActivePSAdult  = parseInt(payload.totalHandledPSAdult.count) - parseInt(totalDrpSupvAdult)
                totalActivePSTotal = totalActivePSJICL + totalActivePSAdult
                $(".totalActivePSJICL").html(totalActivePSJICL);
                $(".totalActivePSAdult").html(totalActivePSAdult);
                $(".totalActivePSTotal").html(totalActivePSTotal);
                //
                $(".totalSubSupvJICL").html(payload.totalSubSupvJICL.count);
                $(".totalSubSupvAdult").html(payload.totalSubSupvAdult.count);
                $(".totalSubSupvTotal").html(payload.totalSubSupvTotal.count);


                $(".totalSubSupvTermJICL").html(payload.totalSubSupvTermJICL.count);
                $(".totalSubSupvTermAdult").html(payload.totalSubSupvTermAdult.count);
                $(".totalSubSupvTermTotal").html(payload.totalSubSupvTermTotal.count);


                $(".totalSubSupvFullTermJICL").html(payload.totalSubSupvFullTermJICL.count);
                $(".totalSubSupvFullTermAdult").html(payload.totalSubSupvFullTermAdult.count);
                $(".totalSubSupvFullTermTotal").html(payload.totalSubSupvFullTermTotal.count);

                $(".totalSubSupvEarlyTermJICL").html(payload.totalSubSupvEarlyTermJICL.count);
                $(".totalSubSupvEarlyTermAdult").html(payload.totalSubSupvEarlyTermAdult.count);
                $(".totalSubSupvEarlyTermTotal").html(payload.totalSubSupvEarlyTermTotal.count);

                $(".totalSubSupvDiedTermJICL").html(payload.totalSubSupvDiedTermJICL.count);
                $(".totalSubSupvDiedTermAdult").html(payload.totalSubSupvDiedTermAdult.count);
                $(".totalSubSupvDiedTermTotal").html(payload.totalSubSupvDiedTermTotal.count);

                $(".totalSubSupvRevocJICL").html(payload.totalSubSupvRevocJICL.count);
                $(".totalSubSupvRevocAdult").html(payload.totalSubSupvRevocAdult.count);
                $(".totalSubSupvRevocTotal").html(payload.totalSubSupvRevocTotal.count);

                $(".totalSubSupvAbsRevocJICL").html(payload.totalSubSupvAbsRevocJICL.count);
                $(".totalSubSupvAbsRevocAdult").html(payload.totalSubSupvAbsRevocAdult.count);
                $(".totalSubSupvAbsRevocTotal").html(payload.totalSubSupvAbsRevocTotal.count);


                $(".totalSubSupvCommRevocJICL").html(payload.totalSubSupvCommRevocJICL.count);
                $(".totalSubSupvCommRevocAdult").html(payload.totalSubSupvCommRevocAdult.count);
                $(".totalSubSupvCommRevocTotal").html(payload.totalSubSupvCommRevocTotal.count);

                $(".totalSubSupvViolRevocJICL").html(payload.totalSubSupvViolRevocJICL.count);
                $(".totalSubSupvViolRevocAdult").html(payload.totalSubSupvViolRevocAdult.count);
                $(".totalSubSupvViolRevocTotal").html(payload.totalSubSupvViolRevocTotal.count);


                $(".totalSubSupvOtherRevocJICL").html(payload.totalSubSupvOtherRevocJICL.count);
                $(".totalSubSupvOtherRevocAdult").html(payload.totalSubSupvOtherRevocAdult.count);
                $(".totalSubSupvOtherRevocTotal").html(payload.totalSubSupvOtherRevocTotal.count);

                $(".totalSubSupvExtRevocJICL").html(payload.totalSubSupvExtRevocJICL.count);
                $(".totalSubSupvExtRevocAdult").html(payload.totalSubSupvExtRevocAdult.count);
                $(".totalSubSupvExtRevocTotal").html(payload.totalSubSupvExtRevocTotal.count);

                //
                $(".carryOverDispSupvJICL").html(payload.carryOverDispSupvJICL.count);
                $(".carryOverDispSupvAdult").html(payload.carryOverDispSupvAdult.count);
                $(".carryOverDispSupvTotal").html(payload.carryOverDispSupvTotal.count);

                $(".carryOverDispTermSupvJICL").html(payload.carryOverDispTermSupvJICL.count);
                $(".carryOverDispTermSupvAdult").html(payload.carryOverDispTermSupvAdult.count);
                $(".carryOverDispTermSupvTotal").html(payload.carryOverDispTermSupvTotal.count);


                $(".carryOverDispRevocSupvJICL").html(payload.carryOverDispRevocSupvJICL.count);
                $(".carryOverDispRevocSupvAdult").html(payload.carryOverDispRevocSupvAdult.count);
                $(".carryOverDispRevocSupvTotal").html(payload.carryOverDispRevocSupvTotal.count);


                $(".carryOverDispExtSupvJICL").html(payload.carryOverDispExtSupvJICL.count);
                $(".carryOverDispExtSupvAdult").html(payload.carryOverDispExtSupvAdult.count);
                $(".carryOverDispExtSupvTotal").html(payload.carryOverDispExtSupvTotal.count);


                $(".tobeactedPSJICL").html(payload.tobeactedPSJICL.count);
                $(".tobeactedPSAdult").html(payload.tobeactedPSAdult.count);
                $(".tobeactedPSTotal").html(payload.tobeactedPSTotal.count);


                $(".totalPendingDispPSJICL").html(payload.totalPendingDispPSJICL.count);
                $(".totalPendingDispPSAdult").html(payload.totalPendingDispPSAdult.count);
                $(".totalPendingDispPSTotal").html(payload.totalPendingDispPSTotal.count);


                $(".carryOverCPSJICL").html(payload.carryOverCPSJICL.count);
                $(".carryOverCPSAdult").html(payload.carryOverCPSAdult.count);
                $(".carryOverCPSTotal").html(payload.carryOverCPSTotal.count);

                $(".rcvCPSJICL").html(payload.rcvCPSJICL.count);
                $(".rcvCPSAdult").html(payload.rcvCPSAdult.count);
                $(".rcvCPSTotal").html(payload.rcvCPSTotal.count);
                
                $(".totalHandledCPSJICL").html(payload.totalHandledCPSJICL.count);
                $(".totalHandledCPSAdult").html(payload.totalHandledCPSAdult.count);
                $(".totalHandledCPSTotal").html(payload.totalHandledCPSTotal.count);

                $(".actCPSJICL").html(payload.actCPSJICL.count);
                $(".actCPSAdult").html(payload.actCPSAdult.count);
                $(".actCPSTotal").html(payload.actCPSTotal.count);

                $(".totalActiveCPSJICL").html(payload.totalActiveCPSJICL.count);
                $(".totalActiveCPSAdult").html(payload.totalActiveCPSAdult.count);
                $(".totalActiveCPSTotal").html(payload.totalActiveCPSTotal.count);


                $(".totalSubSupvTransRevocJICL").html(payload.totalSubSupvTransRevocJICL.count)
                $(".totalSubSupvTransRevocAdult").html(payload.totalSubSupvTransRevocAdult.count)
                $(".totalSubSupvTransRevocTotal").html(payload.totalSubSupvTransRevocTotal.count)
                
            }
        });
    }



    function numberToLetters(num) {
        let letters = ''
        while (num >= 0) {
            letters = 'abcdefghijklmnopqrstuvwxyz'[num % 26] + letters
            num = Math.floor(num / 26) - 1
        }
        return letters
    }



    return {
        attachF5PCS : __attachF5PCS,
        attachF21PCS : __attachF21PCS
       
    };
}());
