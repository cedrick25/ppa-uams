/* 
 * This the Login js of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.widget = (typeof $.wms.widget !== 'undefined') ? $.wms : {};

$.wms.widget = (function() {

    var __attachWidgetEvent = function() {

        $(".panel-widget").lobiPanel({
           reload: false,
            close: false,
            editTitle: false,
            sortable: true,
            stateful: 500,
            expand: false,
            unpin : false,
        })
        
        if($.cookie("USER_LEVEL_ID") == 1 || $.cookie("USER_LEVEL_ID") == 2 || $.cookie("USER_LEVEL_ID") == 8 || $.cookie("USER_LEVEL_ID") == 9){
            /*$(".sel_field_office").append($('<option>', {
                value: "ALL",
                text: 'All'
            }));    */
        }


       
    var payload = {
        
    }
    $.wms.executeExternalPost('/ppa-api-uams/wsv1/Api/getIs',JSON.stringify(payload)).done(function (result) {
        console.log(result)
        if(result.status == 'SUCCESS'){
            result.payload.forEach(function(data){
                //console.log(data);
                status = (data.INFO_SYSTEM_STATUS == 1 ? "Active" : "Inactive")
                $("#tbody_list_is").append(`
                    <tr>
                        <td class="b">`+data.INFO_SYSTEM_NAME+`</td>
                        
                        <td align="center" class=" b">`+status+`</td>
                      </tr>
                    `)
            });
            $("#tbody_list_is").append(`
                <tr>
                        <td class=" b" align="right">Total</td>
                        <td align="center" class=" b">`+result.payload.length+`</td>
                      </tr>
                      `)
            $(".loading-data-list-is").addClass("hidden");
        }
        
    });


    var payload = {
        
    }
    $.wms.executeExternalPost('/ppa-api-uams/wsv1/Api/getIS_Users',JSON.stringify(payload)).done(function (result) {
        console.log(result)
        if(result.status == 'SUCCESS'){
            result.payload.forEach(function(data){
                //console.log(data);
                
                $("#tbody_users_is").append(`
                    <tr>
                        <td class="b">`+data.INFO_SYSTEM_NAME+`</td>
                        
                        <td align="center" class=" b">`+data.USERS+`</td>
                      </tr>
                    `)
            });
         
            $(".loading-users-is").addClass("hidden");
        }
        
    });
        
                
              

       

        function checkPendingRequest() {
            if ($.active > 0) {
                console.log("waiting...")
                window.setTimeout(checkPendingRequest, 250);
            }
            else {
                /*$(".btn-workload").trigger("click")
                $(".btn-nr").trigger("click")
                $(".btn-CmpltdInv").trigger("click")
                $(".btn-CmpltdSupv").trigger("click")
                $(".btn-cd").trigger("click")
                $(".btn-pbargain").trigger("click")

                //@TODO
                $(".btn-rspr").trigger("click");
                $(".btn-rsib").trigger("click");
                $(".btn-rsic").trigger("click");
                $(".btn-disp").trigger("click");*/
            }
        };
        window.setTimeout(checkPendingRequest, 500);

        



    };  

    var __attachWidgetFilterEvent = function() {

       
    }

    var __getFeedback = function(){
       
    }


    var __getRcvFeedback = function(){
        

    }



    
    return {
        attachWidgetFilterEvent : __attachWidgetFilterEvent,
        attachWidgetEvent : __attachWidgetEvent,
        getFeedback : __getFeedback,
        getRcvFeedback : __getRcvFeedback
    };
}());
