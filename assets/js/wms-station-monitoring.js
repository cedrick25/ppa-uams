/* 
 * This the Monitoring JS of WMS 
 *  Portal web services.
 */

$ = (typeof $ !== 'undefined') ? $ : {};
$.wms.monitoring = (typeof $.wms.monitoring !== 'undefined') ? $.wms.monitoring : {};

$.wms.monitoring = (function() {



    var __attachPageWLDashboard = function() {
        ___debug("Water Level Monitoring Dashboard")
        //$("#station_list").empty();
        //$(".loading").removeClass("hidden");
        $(".loading").fadeIn();
        var payload = { "SENSOR_ID" : "2" , "STATUS" : "1"} //<-- SENSOR_ID 2 for WATER LEVEL
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            ___debug(result)

            //$(".loading").addClass("hidden");
            $(".loading").fadeOut("3000");

            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var count = $("span[id*='sp_rain_update"+STATION_SENSOR_ID+"']").length;

                    if(count == 0){
                        $("#station_list").append(
                        '<div class="col-md-4">'+
                            '<div class="panel panel-primary">'+
                                '<div class="panel-heading"> '+
                                    '<i class="fa fa-podcast"></i> '+ STATION_NAME +
                                    '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                                '</div>'+
                                '<div class="panel-body  sensor_height">'+
                                    '<div class="col-md-12 text-center" >'+
                                        '<span class="sensor_value text-default" id="sensor_value'+STATION_SENSOR_ID+'">-</span>'+
                                    '</div>'+
                                    '<div class="col-md-6 text-center hidden" >'+
                                        '<span class=" text-default">'+
                                            '<b>Last 24 Hours</b>'+
                                            '<br/>'+
                                            '<i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_SENSOR_ID+'"></i>'+
                                            '<span class="sensor_value sensor_value24H'+STATION_SENSOR_ID+' text-success" id="sensor_value24H'+STATION_SENSOR_ID+'"">-</span>'+
                                        '</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="panel-footer panel-primary text-center panel-custom"><small>Data as of: <span id="sensor_value_date'+STATION_SENSOR_ID+'"></span></small></div>'
                        );
                    }

                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID);
                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H");
                }
            }
        });
    }


    var __attachPageWLGraphEvent = function() {
        var today = new Date();
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        __attachPageWLGraph();

        // var interval = setInterval(function(){ __attachPageWLGraph(); }, 60000);

        $(".btn-search").unbind("click").on("click",function(){
            ___debug("Trigger Search Button")
            //clearInterval(interval);
            $(".fa-close").click()
            __attachPageWLGraph();
            
            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            /*if(selected_date == today_format){
                interval = setInterval(function(){ __attachPageWLGraph(); }, 90000);
            }*/
            
        });
    }

    var __attachPageWLGraph = function() {
        ___debug("Water Level Monitoring Station Graph")
        $(".loading").fadeIn();

        var payload = { "SENSOR_ID" : "2" , "STATUS" : "1"} //<-- SENSOR_ID  WATER LEVEL
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            $(".loading").fadeOut("1000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    var count = $("canvas[id*='sensor_data_graph"+STATION_SENSOR_ID+"']").length;
                    var READING_NORMAL = result.payload[i].READING_NORMAL
                    var READING_AVERAGE = result.payload[i].READING_AVERAGE;
                    var READING_HIGH = result.payload[i].READING_HIGH;
                    var readings = [];
                        readings["NORMAL"] = READING_NORMAL;
                        readings["AVE"] = READING_AVERAGE;
                        readings["HIGH"] = READING_HIGH;

                    if(count == 0){
                        $(".station_list").append(
                            '<div class="col-md-6" style="display:block">'+
                                '<br/>'+
                                
                                '<div class="panel panel-primary" style="display:block;width:100%">'+
                                    '<div class="panel-heading"> '+

                                        '<i class="fa fa-podcast"></i> <span data-ss-id="'+STATION_SENSOR_ID+'" data-id="'+STATION_ID+'" data-name="'+STATION_NAME+'"><b>'+STATION_NAME+'</b></span>'+
                                        


                                        '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw loading-populating'+STATION_SENSOR_ID+'"></i></span>'+

                                    '</div>'+
                                    '<div class="panel-body sensor_data_div'+STATION_SENSOR_ID+'">'+
                                            '<canvas id="sensor_data_graph'+STATION_SENSOR_ID+'"></canvas>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div>'+
                                
                            '</div>'
                            );
                    }else{
                        $("#sensor_data_graph"+STATION_SENSOR_ID).remove();
                        $(".sensor_data_div"+STATION_SENSOR_ID).append(
                            '<canvas id="sensor_data_graph'+STATION_SENSOR_ID+'"></canvas>');
                    }

                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = null;
                    if(selected_date != today_format){
                        date = selected_date;
                    }
                    var interval = $(".interval").val();
                    ___retrieveGraphDataChartsJS(STATION_SENSOR_ID,interval,date,"sensor_data_graph",readings,SENSOR_ID);
                    
                }   

            }
        });


        ___retrieveGraphDataChartsJS = function(ss_id,interval,end_date=null,container,readings,sensor_id){
            //Charts JS
            // console.log(readings);
            console.log("Retrieve")
            $(".loading-populating"+ss_id).removeClass("hidden");
            // $(".selected-station-result").addClass("hidden");
            // $(".station-data").removeClass("hidden")

            var payload = { "STATION_SENSOR_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date, "SENSOR_ID" : sensor_id}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationSensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                result.payload.shift();
                // $(".selected-station-result").removeClass("hidden");

                // $(".time-populate").empty();
                if(result.status === 'SUCCESS'){

                    //<!-- PLUGIN FOR CUSTOM TOOLTIP -->
                    Chart.plugins.register({
                      // need to manipulate tooltip visibility before its drawn (but after update)
                      beforeDraw: function(chartInstance, easing) {
                        // check and see if the plugin is active (its active if the option exists)
                        if (chartInstance.config.options.tooltips.onlyShowForDatasetIndex) {
                          // get the plugin configuration
                          var tooltipsToDisplay = chartInstance.config.options.tooltips.onlyShowForDatasetIndex;

                          // get the active tooltip (if there is one)
                          var active = chartInstance.tooltip._active || [];

                          // only manipulate the tooltip if its just about to be drawn
                          if (active.length > 0) {
                            // first check if the tooltip relates to a dataset index we don't want to show
                            if (tooltipsToDisplay.indexOf(active[0]._datasetIndex) === -1) {
                              // we don't want to show this tooltip so set it's opacity back to 0
                              // which causes the tooltip draw method to do nothing
                              chartInstance.tooltip._model.opacity = 0;
                            }
                          }
                        }
                      }
                    });
                    //<!-- PLUGIN FOR CUSTOM TOOLTIP -->


                    var label1 = [], data1 = [], data2 = [], data3 = []; data4 = []
                    if(typeof(result.payload) != "undefined" && result.payload.length > 0){
                        for(i=result.payload.length-1;i>=0;i--){
                            var time_start = result.payload[i].START_DATE.split(" ")
                            var time = result.payload[i].END_DATE.split(" ")
                            if(result.payload[i].VALUES != ""){

                                label1.push(time[1].slice(0,-3));
                                data1.push( (result.payload[i].VALUES == "" ? 0 : result.payload[i].VALUES ));
                                data2.push(readings["NORMAL"])
                                data3.push(readings["AVE"])
                                data4.push(readings["HIGH"])

                            }
                        }
                    }else{
                                label1.push("00:00");
                                data2.push(readings["NORMAL"])
                                data3.push(readings["AVE"])
                                data4.push(readings["HIGH"])

                                label1.push("24:00");
                                data2.push(readings["NORMAL"])
                                data3.push(readings["AVE"])
                                data4.push(readings["HIGH"])
                    }


                    
                    var chartData = {
                        labels: label1,
                        datasets: [{
                            type: 'line',
                            label: 'Water Level',
                            borderColor: window.chartColors.blue,
                            borderWidth: 2,
                            backgroundColor: "rgba(100,176,241,0.4)",
                            data: data1,
                            pointRadius : 0,
                            yAxisID: 'A',
                            lineTension : 0
                        },{
                            type: 'line',
                            label: 'Alert Level',
                            borderColor: "rgb(120, 67, 198)",
                            backgroundColor:  "rgb(120, 67, 198)",
                            borderWidth: 2,
                            fill: false,
                            pointRadius : 0,
                            data: data2,
                        }, {
                            type: 'line',
                            label: 'Alarm Level',
                            borderColor: "rgb(206, 103, 0)",
                            backgroundColor:  "rgb(206, 103, 0)",
                            borderWidth: 2,
                            fill: false,
                            pointRadius : 0,
                            data: data3,
                            tooltip: false
                        },
                        {
                            type: 'line',
                            label: 'Critical Level',
                            borderColor: "rgb(255, 0, 0)",
                            backgroundColor: "rgb(255, 0, 0)",
                            borderWidth: 2,
                            fill: false,
                            pointRadius : 0,
                            yAxisID: 'B',
                            data: data4,
                            tooltip: false
                        }

                        
                        ]
                    };
        
                        var max = 0;
                        var max2 = 0;

                        if(data2.length > 0){
                            max = data4.reduce(function(a, b) {
                                return Math.max(a, b);
                            });

                            max2 = data1.reduce(function(a, b) {
                                return Math.max(a, b);
                            });
                        }

                        if(data1.length > 0){
                            min2 = data1.reduce(function(a, b) {
                                return Math.min(a, b);
                            });
                        }
                        max = (max > max2 ? max : max2);

                        lastData = 0;
                        if(data1[0] != undefined){
                            lastData = data1[data1.length-1];    
                        }

                        var total =0
                        var diff = []
                        for(var i = 0; i < data1.length; i++) {
                            total += data1[i];
                            if(i+1 != data1.length){
                                diff.push( data1[i] - data1[i+1] );
                            }
                        }

                        for(var i = 0; i < diff.length; i++) {
                            total += diff[i];
                        }

                        var avg = total / diff.length;
                        avg = 0.01
                        

                        var ctx = document.getElementById(container+ss_id).getContext("2d");

                        var selected_date = $(".selected-date").val();
                        var today = new Date();
                        var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                        var date = today_format;
                        if(selected_date != today_format){
                            date = selected_date;
                        }
                        var interval = $(".interval").val();
                       

                        var myChart = new Chart(ctx, {
                            type: 'line',
                            data: chartData,
                            options: {
                                legend: {
                                    display : false
                                },
                                hover: {
                                    intersect: false
                                  },
                                animation : false,
                                responsive : true,
                                pointDotRadius: 1,
                                pointHitDetectionRadius: 20,
                                pointDotStrokeWidth: 8,
                                title: {
                                    display: true,
                                    text: 'Water Level: '+lastData+' m'
                                },
                                tooltips: {
                                    position: 'nearest',
                                    mode: 'index',

                                     intersect: false,
                                    // onlyShowForDatasetIndex: [0],
                                    /*callbacks: {
                                        label: function (tooltipItems, data) {
                                            return  " " + tooltipItems.yLabel.toFixed(2) + " m";
                                        }
                                    },*/

                                },
                                scales: {
                                    yAxes: [{
                                        id:'B',
                                        position: 'right',
                                        scaleLabel: {
                                        display: true,
                                        labelString: 'Water Level (ELm)',
                                      },ticks: {
                                          max: Math.round(parseFloat(max+1)),
                                          min: Math.round(parseFloat(min2-1)),
                                          callback: function(label, index, labels) {
                                                return label+' m';
                                            }
                                        },
                                    },{
                                        id: 'A',
                                        position: 'left',
                                        scaleLabel : {
                                        labelString: 'Water Level (ELm)',
                                        display : true,
                                        },
                                        ticks: {
                                          max: Math.round(parseFloat(max+1)),
                                          min: Math.round(parseFloat(min2-1)),
                                            callback: function(label, index, labels) {
                                                return label+' m';
                                            }
                                        },
                                      }],
                                    xAxes: [{
                                        type: "time",
                                        time: {
                                            format: "HH:mm",
                                            unit: 'hour',
                                            unitStepSize: 0,
                                            //min: "00:00",
                                            displayFormats: {
                                                'minute': 'hh:mm',
                                                'hour': 'hh:mm A',
                                                },
                                        tooltipFormat: 'hh:mm A'
                                        },
                                       
                                        }]
                                }
                            }
                        });
                        myChart.update();
                        $(".loading-populating"+ss_id).addClass("hidden");
       
                }
            });
        }


        
    }



    var __attachPageWLTable = function() {
        ___debug("Water Level Monitoring Station Table")
        $(".loading").fadeIn();

        var payload = { "SENSOR_ID" : "2", "STATUS" : "1" } //<-- SENSOR_ID FOR WL
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            $(".loading").fadeOut("3000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var SS_ALERT = result.payload[i].READING_NORMAL;
                    var SS_ALARM = result.payload[i].READING_AVERAGE;
                    var SS_CRITICAL = result.payload[i].READING_HIGH;

                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    var count = $("span[id*='sensor_value10M"+STATION_SENSOR_ID+"']").length;

                    if(count == 0){
                        $(".station_list").append(
                            '<tr>'+
                                '<td class="station-name stat'+STATION_SENSOR_ID+'" data-s-id="'+SENSOR_ID+'" data-ss-id="'+STATION_SENSOR_ID+'" data-id="'+STATION_ID+'" data-name="'+STATION_NAME+'" style="cursor:pointer"><b>'+STATION_NAME+'</b></td>'+
                                '<td class="text-center stat'+STATION_SENSOR_ID+'"><span id="sensor_value10M'+STATION_SENSOR_ID+'" style="font-weight:bolder"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin10M'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value30M'+STATION_SENSOR_ID+'" style="font-weight:bolder"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin30M'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value1H'+STATION_SENSOR_ID+'" style="font-weight:bolder"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value3H'+STATION_SENSOR_ID+'" style="font-weight:bolder"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin3H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value6H'+STATION_SENSOR_ID+'" style="font-weight:bolder"></span> <i class="fa fa-refresh fa-spin fa-1x fa-fw spin6H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center alerttd'+STATION_SENSOR_ID+'"><input class="editWL editAlert'+STATION_SENSOR_ID+' hidden text-center" type="text" value="'+SS_ALERT+'"><span class="text-yellow valWL alert'+STATION_SENSOR_ID+'" style="font-weight:bolder">'+SS_ALERT+'</span></td>'+
                                '<td class="text-center alarmtd'+STATION_SENSOR_ID+'"><input class="editWL editAlarm'+STATION_SENSOR_ID+' hidden text-center" type="text" value="'+SS_ALARM+'"><span class="text-orange valWL alarm'+STATION_SENSOR_ID+'" style="font-weight:bolder">'+SS_ALARM+'</span></td>'+
                                '<td class="text-center criticaltd'+STATION_SENSOR_ID+'"><input class="editWL editCritical'+STATION_SENSOR_ID+' hidden text-center" type="text" value="'+SS_CRITICAL+'"><span class="text-red valWL critical'+STATION_SENSOR_ID+'" style="font-weight:bolder">'+SS_CRITICAL+'</span></td>'+
                            '</tr>'
                        );
                    }


                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    //var date = null;
                     var date = $(".servertime").html();
                    if(selected_date != today_format){
                        date = selected_date;
                    }


                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,10,"sensor_value10M","spin10M",false,date).done(function (result) {
                            console.log(result);
                            if(result.status ==='SUCCESS'){
                                var ss_id = result.STATION_SENSOR_ID
                                var curr = result.payload.SENSOR_DATA_INPUT_0_RAW;
                                var alert = parseFloat($(".alert"+ss_id).html());
                                var alarm = parseFloat($(".alarm"+ss_id).html());
                                var critical = parseFloat($(".critical"+ss_id).html());
                                /*console.log(curr)
                                console.log(alert)
                                console.log(alarm)
                                console.log(critical)*/
                                $(".stat"+ss_id).removeClass("blinking");
                                $(".stat"+ss_id).removeClass("bg-red");
                                $(".stat"+ss_id).removeClass("bg-orange");
                                $(".stat"+ss_id).removeClass("bg-yellow");
                                $(".stat"+ss_id).removeClass("blinking-yellow");
                                $(".stat"+ss_id).removeClass("blinking-yellow");
                                $(".stat"+ss_id).removeClass("blinking-yellow");
                                $(".critical"+ss_id).removeClass("blinking");
                                $(".critical"+ss_id).removeClass("blinking");
                                $(".critical"+ss_id).removeClass("blinking");

                                $(".alerttd"+ss_id).removeClass("bg-yellow");
                                $(".alarmtd"+ss_id).removeClass("bg-orange");
                                $(".criticaltd"+ss_id).removeClass("bg-red");



                                if(curr >= critical){
                                    //console.log("critical")
                                    $(".stat"+ss_id).addClass("blinking-red");
                                    $(".stat"+ss_id).addClass("bg-red");
                                    
                                    $(".critical"+ss_id).addClass("blinking");
                                    $(".criticaltd"+ss_id).addClass("bg-red");
                                }else if(curr >= alarm){
                                    //console.log("alarm")
                                    $(".stat"+ss_id).addClass("blinking-orange");
                                    $(".stat"+ss_id).addClass("bg-orange")
                                    $(".alarm"+ss_id).addClass("blinking");;
                                    $(".alarmtd"+ss_id).addClass("bg-orange");
                                }else if(curr >= alert){
                                    //console.log("alert")
                                    $(".stat"+ss_id).addClass("blinking-yellow");
                                    $(".stat"+ss_id).addClass("bg-yellow");

                                    $(".alert"+ss_id).addClass("blinking");;
                                    $(".alerttd"+ss_id).addClass("bg-yellow");
                                }else{
                                    //console.log("else")
                                    $(".stat"+ss_id).removeClass("blinking");
                                }
                            }
                        });
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,30,"sensor_value30M","spin30M",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin1H",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,180,"sensor_value3H","spin3H",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,360,"sensor_value6H","spin6H",false,date);

                    
                }   


                if ($(window).width() < 700){
                    console.log("G")

                    if ( ! ($.fn.DataTable.isDataTable('.table-wl') ) ){
                        console.log("G")
                        $(".table-wl").DataTable({
                            width: "800px",
                            "paging" : false,
                            "info" : false,
                            searching: false,
                            ordering : false,
                            scrollY:        "400px",
                            scrollX:        true,
                            scrollCollapse: true,
                            paging:         false,
                            fixedColumns:   {
                                leftColumns: 1,
                           
                            },
                            "columnDefs": [ {
                                "targets": [0],
                                "width": "150px"
                            }]
                        });
                    }
                }


                
                ___getIntervalDataWL(10);
                


                $(".btnEditWL").on("click",function(){
                    $(".btnEditWL").addClass("hidden")
                    $(".editWL").removeClass("hidden");
                    $(".valWL").addClass("hidden");

                    $(".btnSaveWL").removeClass("hidden")
                });

                //2018-12-11
                $(".btnSaveWL").on("click",function(){
                    //$(".btnEditWL").removeClass("hidden")
                    
                    //$(".editWL").addClass("hidden");
                    //$(".valWL").removeClass("hidden");

                    //$(".btnSaveWL").addClass("hidden")
                    finish = 0;
                    updateLength = result.payload.length
                    for(i=0;i<result.payload.length;i++){

                        var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                         


                        var payload = {
                            "STATION_SENSOR_ID" : STATION_SENSOR_ID,
                            "READING_NORMAL" : $(".editAlert"+STATION_SENSOR_ID).val(),
                            "READING_AVERAGE" : $(".editAlarm"+STATION_SENSOR_ID).val(),
                            "READING_HIGH" : $(".editCritical"+STATION_SENSOR_ID).val()
                        }                
                        
                        $.wms.executeExternalPost('/wms/wsv1/api/updateStationSensor',JSON.stringify(payload)).done(function (result) {
                            console.log(result);
                            if(result.status === 'SUCCESS'){
                                finish += 1;
                            }else{
                                finish += 1;
                            }

                            if(finish == updateLength){
                                if(!alert('Update Success!')){window.location.reload();}
                                //alert("Update Success");
                                //windows.

                            }
                        });
                    }
                });


            }
        })


    }


    var ___getIntervalDataWL = function(interval1){
        var intervalTrigger;
        $(".station-name").unbind('click').on('click',function(){
            var station_id = $(this).data('id');
            var ss_id = $(this).data('ss-id');
            var station_name = $(this).data('name');
            var sensor_id = $(this).data('s-id');

            ___debug("Selected Station ID: " +station_id)
            clearInterval(intervalTrigger);
            //Adjust Panels
            $(".tb-result").removeClass("col-md-12");
            $(".tb-result").addClass("col-md-8");


            $(".fa-close").unbind("click").on("click",function(){
                ___debug("Close Data");
                $(".station-data").addClass("hidden")
                $(".tb-result").removeClass("col-md-8");
                $(".tb-result").addClass("col-md-12");
                clearInterval(intervalTrigger);
            })
            //End of Adjust Panels

            $(".selected-station").html(station_name)

            
            var interval = interval1; //<-- Temporary Interval

            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            //var date = null;
            var date = $(".servertime").html();
            if(selected_date != today_format){
                date = selected_date;
            }

            ___retrieveData(ss_id,interval,date,sensor_id);            
            
            


            intervalTrigger = setInterval(function(){ ___retrieveData(ss_id,interval,date,sensor_id);   }, 60000);
        });


        ___retrieveData = function(ss_id,interval,end_date=null,sensor_id){
            $(".loading-populating").removeClass("hidden");
            $(".selected-station-result").addClass("hidden");
            $(".station-data").removeClass("hidden")

            var payload = { "STATION_SENSOR_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date, "SENSOR_ID" : sensor_id}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationSensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                $(".loading-populating").addClass("hidden");
                $(".selected-station-result").removeClass("hidden");

                $(".time-populate").empty();
                if(result.status === 'SUCCESS'){


                    if ( $.fn.DataTable.isDataTable('#table-populate') ) {
                      $('#table-populate').DataTable().destroy();
                      $('#table-populate tbody').empty();
                    }

                    var accvalue = 0.00;

                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)

                    console.log(selected_date)
                    console.log(today_format)
                    if(selected_date == today_format){
                        result.payload.shift();
                    }else{

                    }
                    
                    for(i=0;i<result.payload.length;i++){
                        var time_start = result.payload[i].START_DATE.split(" ")
                        var time = result.payload[i].END_DATE.split(" ")
                        $(".date-pop").html(time[0]);
                        //accvalue += parseFloat(result.payload[i].VALUES != null ? result.payload[i].VALUES : 0);
                        var value = ( result.payload[i].VALUES != "" ? result.payload[i].VALUES : "-");
                        var endTime = time[1].slice(0,-3)
                        var DEVIATION = ( result.payload[i].DEVIATION != "" ? result.payload[i].DEVIATION : "-");

                        if(selected_date != today_format){
                            if(i == 0){
                                console.log("Changed end Time")
                                endTime = "23:59"     
                            }
                           
                        }

                        $(".time-populate").append(
                                '<tr>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[0]+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[1].slice(0,-3)+'-'+endTime+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[0]+" "+time_start[1].slice(0,-3)+'-'+endTime+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+value+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+DEVIATION+'</td>'+
                                '</tr>');

                    }


                    var dt = $("#table-populate").DataTable({
                        dom: 'Brti',
                         "scrollY": "350px", "scrollCollapse": true,
                        paging : false,
                        "bInfo" : false,
                         "columnDefs": [ { "targets": [ 0,1 ], "visible": false, "searchable": false }],
                         "order": [],
                        buttons: [
                            {   extend: 'csv',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'pdfHtml5',
                                /*
                                customize: function ( doc ) {
                                    // Splice the image in after the header, but before the table
                                    doc.content.splice( 1, 0, {
                                        margin: [ 0, 0, 0, 12 ],
                                        alignment: 'center',
                                        image: 'data:image/png;base64,'
                                    } );
                                    // Data URL generated by http://dataurl.net/#dataurlmaker
                                },*/
                                customize: function (doc) {
                                    //console.log(doc);
                                    doc.styles.tableBodyEven.alignment = 'center';
                                    doc.styles.tableBodyOdd.alignment = 'center';
                                    doc.content[1].table.widths = 
                                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                                },
                                exportOptions: {
                                   columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+"  Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'excelHtml5',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                        ],
                        "columns": [
                            { "width": "25%" },
                            { "width": "25%" },
                            { "width": "40%" },
                            { "width": "30%" },
                            { "width": "30%" }
                          ]
                    });

                    $(".dt-buttons").addClass("hidden")
                    $(".btnCSV").unbind('click').on("click",function(){ $(".buttons-csv").click(); })
                    $(".btnPDF").unbind('click').on("click",function(){ $(".buttons-pdf").click(); })
                    $(".btnXLS").unbind('click').on("click",function(){ $(".buttons-excel").click(); })

                }
            });
        }
    }



    var __attachPageWLTableEvent = function() {
        var today = new Date();
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        

        var payload = {  } 
        $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
            if(result.status === 'SUCCESS'){
                //console.log(result.payload.date);
                $(".servertime").html(result.payload.date)
                __attachPageWLTable(result.payload.date)
            }
        });


        

        var interval = setInterval(function(){ 
            var payload = {  } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".servertime").html(result.payload.date)
                    __attachPageWLTable(result.payload.date)
                }
            });

        }, 60000);
        

        $(".btn-search").unbind("click").on("click",function(){
            ___debug("Trigger Search Button")
            clearInterval(interval);
            $(".fa-close").click()
            var payload = {  } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".servertime").html(result.payload.date)
                    __attachPageWLTable(result.payload.date)
                }
            });

            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            if(selected_date == today_format){
                interval = setInterval(function(){ 
                    var payload = {  } 
                    $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                        if(result.status === 'SUCCESS'){
                            //console.log(result.payload.date);
                            $(".servertime").html(result.payload.date)
                            __attachPageWLTable(result.payload.date)
                        }
                    });

                }, 60000);
            }

            
        });
    }

    var __attachPageWlMap = function() {
        ___debug("Water Level Monitoring Station Map")
        $(".loading").fadeIn();


        var payload = {  } 
        $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
            if(result.status === 'SUCCESS'){
                //console.log(result.payload.date);
                $(".servertime").html(result.payload.date)
                __loadwlmap(result.payload.date)
            }
        });


    }


    var __loadwlmap = function(){
         var payload = { "SENSOR_ID" : "2" , "STATUS" : "1"} //<-- SENSOR_ID for WATER LEVEL
        var station = [];
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            
            if(result.status === 'SUCCESS'){

                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");

                    station.push({position:  new google.maps.LatLng(STATION_LAT, STATION_LON),
                    label: STATION_NAME, type : STATION_TYPE_NAME, STATION_SENSOR_ID : STATION_SENSOR_ID, SENSOR_ID : SENSOR_ID})

                    
                }






                console.log(station);
                initMap(station)
                
            }
        });

        function initMap(station) {
            

            var map = new google.maps.Map(document.getElementById('station_map'), {
                // mapTypeId: 'hybrid'
                mapTypeId: 'roadmap'
            });

            var bounds = new google.maps.LatLngBounds();
            var infowindow = new google.maps.InfoWindow()
            var icons = "http://162.253.225.18/FFWS/29022-200_-copy.png";
            // Create markers.
            station.forEach(function(feature) {
                bounds.extend(feature.position);
                var marker = new google.maps.Marker({
                    position: feature.position,
                    //icon : icons,
                    map: map,
                    
                });

                contentString = '<div><b>'+feature.label+'</b>: <b><span id="sensor_value10M'+feature.STATION_SENSOR_ID+'">-</span> m</b></div>';
                infowindow = new google.maps.InfoWindow({
                  content: contentString,
                  //maxWidth : 90
                });
                marker.addListener('click', function() {
                infowindow.open(map, marker);
                });

                infowindow.open(map, marker);

                
            });

            map.fitBounds(bounds);
            var listener = google.maps.event.addListener(map, "idle", function () {
                //map.setZoom(11);
                $(".loading").fadeOut();
                google.maps.event.removeListener(listener);
            });
        
            setTimeout(function () {
                
                station.forEach(function(station) {
                    ___getLatestReading(station.STATION_SENSOR_ID,station.SENSOR_ID,5,"sensor_value10M","spin10M",false,null);
                })
            },3000);

            interval = setInterval(function(){ 

                station.forEach(function(station) {
                    ___getLatestReading(station.STATION_SENSOR_ID,station.SENSOR_ID,5,"sensor_value10M","spin10M",false,null);
                })
            }, 30000);

        }
    }

    var __attachPageWLStation = function() {
        ___debug("Water Level Monitoring Station List")
        //$("#station_list").empty();
        //$(".loading").removeClass("hidden");
        $(".loading").fadeIn();
        var payload = { "SENSOR_ID" : "2", "STATUS" : "1" } //<-- SENSOR_ID for WATER LEVEL
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            ___debug(result)
            $(".loading").fadeOut("3000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    $("#station_list").append(
                        '<div class="col-md-6">'+
                            '<div class="panel panel-primary">'+
                                '<div class="panel-heading"> '+
                                    '<h3><i class="fa fa-podcast"></i> '+STATION_NAME +
                                    '<span class="pull-right"><i class="fa fa-refresh hidden fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                                '</div>'+
                                '<div class="panel-body  sensor_height">'+
                                '<div class="row">'+
                                    '<div class="col-md-12">'+
                                        '<h4>'+
                                            '<b>STATION DESC:</b> <br/>'+
                                            '<span class="st_desc">'+STATION_DESC+'</span>'+
                                        '</h4>'+
                                    '</div>'+
                                    '<div class="col-md-12">'+
                                        '<h4>'+
                                            '<b>STATION TYPE:</b> <br/>'+
                                            '<span class="st_type">'+STATION_TYPE_NAME+'</span>'+
                                        '</h4>'+
                                    '</div>'+
                                    '<div class="col-md-12">'+
                                        '<h4>'+
                                            '<b>STATION ADDRESS:</b> <br/>'+
                                            '<span class="st_addr">'+STATION_ADDRESS+'</span>'+
                                        '</h4>'+
                                    '</div>'+

                                    '<div class="col-md-6">'+
                                        '<h4>'+
                                            '<b>LATITUDE:</b> <br/>'+
                                            '<span class="st_lat">'+STATION_LAT+'</span>'+
                                        '</h4>'+
                                    '</div>'+
                                    '<div class="col-md-6">'+
                                        '<h4>'+
                                            '<b>LONGITUDE:</b> <br/>'+
                                            '<span class="st_lon">'+STATION_LON+'</span>'+
                                        '</h4>'+
                                    '</div>'+

                                    '<div class="col-md-12">'+
                                        '<h4>'+
                                            '<b>STATION SENSOR:</b> <br/>'+
                                            '<span class="st_sen">'+SENSOR_NAME+'</span>'+
                                        '</h4>'+
                                    '</div>'+

                                    '<div class="col-md-12">'+
                                        '<h4>'+
                                            '<b>STATION SENSOR STATUS:</b> <br/>'+
                                            '<span class="st_stat">'+STATUS+'</span>'+
                                        '</h4>'+
                                    '</div>'+

                                    '<div class="col-md-12 hidden">'+
                                        '<h4>'+
                                            '<b>ASSIGNED USERS:</b> <br/>'+
                                            '<span>--</span>'+
                                        '</h4>'+
                                    '</div>'+

                                '</div>'+
                            '</div>'
                               
                    );
                }
            }

        });
    }

    

    var __attachPageRainFallGraphEvent = function() {
        var today = new Date();
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        __attachPageRainFallGraph();

        //var interval = setInterval(function(){ __attachPageRainFallGraph(); }, 60000);

        $(".btn-search").unbind("click").on("click",function(){
            ___debug("Trigger Search Button")
            //clearInterval(interval);
            $(".fa-close").click()
            __attachPageRainFallGraph();
            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            if(selected_date == today_format){
                //interval = setInterval(function(){ __attachPageRainFallGraph(); }, 120000);
            }
            
        });
    }

    var __attachPageRainFallGraph = function() {
        ___debug("Rain Fall Monitoring Station Graph")
        $(".loading").fadeIn();

        var payload = { "SENSOR_ID" : "1", "STATUS" : "1" } //<-- SENSOR_ID 1 for RAIN GAUGE
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            $(".loading").fadeOut("1000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    var count = $("canvas[id*='sensor_data_graph"+STATION_SENSOR_ID+"']").length;
                    var selected_date = $(".selected-date").val();
                    if(count == 0){
                        $(".station_list").append(
                            '<div class="col-md-6" style="display:block" id="div'+STATION_SENSOR_ID+'">'+
                                '<br/>'+
                                
                                '<div class="panel panel-primary" style="display:block;width:100%">'+
                                    '<div class="panel-heading"> '+

                                        '<i class="fa fa-podcast"></i> <span data-ss-id="'+STATION_SENSOR_ID+'" data-id="'+STATION_ID+'" data-name="'+STATION_NAME+'"><b>'+STATION_NAME+'</b></span>'+

                                        '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw loading-populating'+STATION_SENSOR_ID+'"></i>'+
                                            '<span class="export-'+STATION_SENSOR_ID+'  "><b class="hidden-xs">Export: </b>'+
                                                // '<button class="btn btn-xs btn-warning btnCSV">CSV</button>'+
                                                '<button data-station="'+STATION_NAME+'" data-date="'+selected_date+'" class="btn hidden-xs btn-xs btn-warning btnPDF btnPDF-'+STATION_SENSOR_ID+'">PDF</button>'+
                                                ' <button class="btn btn-xs btn-warning btnIMG btnIMG-'+STATION_SENSOR_ID+'" >IMG</button>'+
                                            '</span>'+
                                        '</span>'+

                                    '</div>'+
                                    '<div class="panel-body sensor_data_div'+STATION_SENSOR_ID+'" >'+
                                            '<canvas id="sensor_data_graph'+STATION_SENSOR_ID+'"></canvas>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div>'+
                                
                            '</div>'
                            );
                    }else{
                        $("#sensor_data_graph"+STATION_SENSOR_ID).remove();
                        $(".sensor_data_div"+STATION_SENSOR_ID).append(
                            '<canvas id="sensor_data_graph'+STATION_SENSOR_ID+'"></canvas>');
                    }

                    
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = null;
                    if(selected_date != today_format){
                        date = selected_date;
                    }
                    var interval = $(".interval").val();
                    ___retrieveGraphDataChartsJS(STATION_SENSOR_ID,interval,date,"sensor_data_graph",SENSOR_ID,STATION_NAME);
                    

                }   

                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var interval = $(".interval").val();
                    
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = null;
                    if(selected_date != today_format){
                        date = selected_date;
                    }

                    var intval = setInterval(function(){ ___retrieveGraphDataChartsJS(STATION_SENSOR_ID,interval,date,"sensor_data_graph",SENSOR_ID,STATION_NAME); }, 300000);
                }
            }
        });


        ___retrieveGraphDataChartsJS = function(ss_id,interval,end_date=null,container,sensor_id,station_name){
            //Google Charts JS
            $(".loading-populating"+ss_id).removeClass("hidden");
            $(".export-"+ss_id).addClass("hidden");
            // $(".selected-station-result").addClass("hidden");
            // $(".station-data").removeClass("hidden")

            var payload = { "STATION_SENSOR_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date, "SENSOR_ID" : sensor_id}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationSensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                
                // $(".selected-station-result").removeClass("hidden");

                // $(".time-populate").empty();
                if(result.status === 'SUCCESS'){
                    var label1 = [], data1 = [], data2 = [];
                    var cumulative = 0;
                    //result.payload.shift();
                    //console.log(result.payload);
                    for(i=result.payload.length-1;i>=0;i--){
                        var time_start = result.payload[i].START_DATE.split(" ")
                        var time = result.payload[i].END_DATE.split(" ")
                        console.log(time);
                        //row[0] = time[1].slice(0,-3);
                        if(time[1].slice(0,-3) == "00:00"){
                            label1.push("24:00");
                        }else{
                            label1.push(time[1].slice(0,-3));
                        }
                        
                        x = ( result.payload[i].VALUES == null ? 0.0 : result.payload[i].VALUES )
                        //console.log(parseFloat(x))
                        data1.push( x );
                        cumulative += parseFloat((result.payload[i].VALUES == null ? 0 : result.payload[i].VALUES ));
                        data2.push(cumulative)
                    }
                    

                    /*console.log(data1);
*/
                    /*console.log(label1);*/
                    /*console.log(data1);
                    console.log(data2);
*/

                    var maxCum = data2.reduce(function(a, b) {
                        return Math.max(a, b);
                    });

                    var maxRF = data1.reduce(function(a, b) {
                        return Math.max(a, b);
                    });
                    var chartData = {
                        labels: label1,
                        datasets: [{
                            type: 'line',
                            label: 'Cumulative Rainfall',
                            borderColor: window.chartColors.red,
                            borderWidth: 2,
                            fill: false,
                            yAxisID: 'B',

                            data: data2,
                            options: {
                                tooltips: {
                                    mode: 'nearest'
                                }
                            },
                            lineTension : 0
                        },{
                            type: 'bar',
                            label: 'Rain Value',
                            backgroundColor: window.chartColors.blue,
                            data: data1,
                            yAxisID: 'A',
                            borderColor: 'white',
                            borderWidth: 2,


                        } ]

                    };
        
                        //Reference: https://stackoverflow.com/questions/30464750/chart-js-line-chart-set-background-color
                        Chart.plugins.register({
                          beforeDraw: function(chartInstance) {
                            var ctx = chartInstance.chart.ctx;
                            ctx.fillStyle = "white";
                            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
                          }
                        });


                        // console.log(container+ss_id)
                        var ctx = document.getElementById(container+ss_id).getContext("2d");
                        var selected_date = $(".selected-date").val();
                        var today = new Date();
                        var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                        var date = today_format;
                        if(selected_date != today_format){
                            date = selected_date;
                        }
                        var interval = $(".interval").val();
                        step = (parseFloat(interval)/parseFloat(60))
                        // console.log(step);

                        maxCum = (parseFloat(maxCum)+parseFloat(2))
                        maxCum = (maxCum > 100 ? parseFloat(maxCum)+parseFloat(10) : maxCum)
                        
                        stepCum = (maxCum > 5 ? 1 : 0.5)
                        stepCum = (maxCum > 10 ? 5 : 0.5)

                        stepCum = (maxCum > 50 ? 5 : stepCum)
                        stepCum = (maxCum > 100 ? 10 : stepCum)

                        maxRF = (parseFloat(maxRF)+parseFloat(5))
                        stepRF =  0.5
                        stepRF = (maxRF > 5 ? 1 : stepRF)
                        stepRF = (maxRF > 10 ? 2 : stepRF)
                        stepRF = (maxRF > 15 ? 5 : stepRF)
                        stepRF = (maxRF > 50 ? 5 : stepRF)
                        stepRF = (maxRF > 100 ? 10 : stepRF)
                        var myChart = new Chart(ctx, {
                            type: 'bar',
                            data: chartData,
                            options: {
                                animation : false,
                                //maintainAspectRatio: true,
                                responsive : true,
                                //showScale: true,
                                title: {
                                    display: true,
                                    text: station_name + ' - Rainfall Reading '+date+''
                                },
                                tooltips: {
                                    mode: 'nearest',
                                    intersect: false,
                                    callbacks: {
                                        label: function (tooltipItems, data) {
                                            return  " " + tooltipItems.yLabel.toFixed(2) + " mm";
                                        }
                                    }
                                },
                                scales: {
                                    yAxes: [{
                                        id:'B',
                                        position: 'left',
                                        scaleLabel: {
                                        display: true,
                                        labelString: 'Cumulative Rain Fall (mm)',

                                      },ticks: {
                                          max: maxCum,
                                          min: 0,
                                          stepSize : stepCum
                                        },

                                      
                                    },{
                                        id: 'A',
                                        
                                        position: 'right',
                                        scaleLabel : {
                                        labelString: 'Rain Fall Value (mm)',
                                        display : true,
                                        },

                                        ticks: {
                                            
                                          max: maxRF,
                                          min: 0,
                                          stepSize : stepRF,
                                          reverse: true

                                        },

                                      }],
                                    xAxes: [{
                                        type: "time",
                                        time: {
                                            parser: "HH:mm",
                                            unit: 'hour',
                                            unitStepSize: 0,
                                            //min: "00:00",
                                            displayFormats: {
                                                'minute': 'hh:mm',
                                                'hour': 'hh:mm A',
                                                },
                                        tooltipFormat: 'hh:mm A'
                                        },
                                       
                                        }]
                                },

                            }
                        });
                        myChart.update();
                        
                        $(".export-"+ss_id).removeClass("hidden");
                        $(".loading-populating"+ss_id).addClass("hidden");

                        $(".btnIMG-"+ss_id).unbind("click").on("click",function(){
                            var url_base64 = document.getElementById('sensor_data_graph'+ss_id).toDataURL('image/png');
                            //window.open(url_base64);

                            var a = $("<a>")
                                .attr("href", url_base64)
                                .attr("download", "Export Data.png")
                                .appendTo("body");

                            a[0].click();

                            a.remove();

                            //$("#btnLink").attr( 'target', '_blank' );
                            //window.location= $("#btnLink").attr("href")


                           
                        });


                        $(".btnPDF-"+ss_id).unbind("click").on("click",function(){
                            console.log(ss_id)
                            var reportPageHeight = $('#sensor_data_graph'+ss_id).innerHeight();
                            var reportPageWidth = $('#sensor_data_graph'+ss_id).innerWidth();
                            var station = $(this).data('station')
                            var date = $(this).data('date')

                            // create a new canvas object that we will populate with all other canvas objects
                            var pdfCanvas = $('<canvas />').attr({
                            id: "canvaspdf",
                            width: reportPageWidth,
                            height: reportPageHeight
                            });
                            console.log(reportPageWidth);
                            console.log(reportPageHeight);

                            // keep track canvas position
                            var pdfctx = $(pdfCanvas)[0].getContext('2d');
                            var pdfctxX = 0;
                            var pdfctxY = 0;
                            var buffer = 5;

                            // for each chart.js chart
                            $("#sensor_data_graph"+ss_id).each(function(index) {
                                // get the chart height/width
                                var canvasHeight = $(this).innerHeight();
                                var canvasWidth = $(this).innerWidth();

                                // draw the chart into the new canvas
                                pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
                                pdfctxX += canvasWidth + buffer;
                            });

                            // create new pdf and add our new canvas as an image
                            //var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);
                            var pdf = new jsPDF('l', 'pt',  [612,   792]);
                            pdf.addImage($(pdfCanvas)[0], 'JPG', 10, 10);
                            pdf.save(''+station+' '+ date +' Export Data.pdf');
                        });
       
                    
                }
            });
        }


        ___retrieveGraphDataGoogleCharts = function(ss_id,interval,end_date=null,container){
            //Google Charts JS
            $(".loading-populating"+ss_id).removeClass("hidden");
            // $(".selected-station-result").addClass("hidden");
            // $(".station-data").removeClass("hidden")

            var payload = { "STATION_SENSOR_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationSensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                
                // $(".selected-station-result").removeClass("hidden");

                // $(".time-populate").empty();
                if(result.status === 'SUCCESS'){
                    var data = [];
                    var cumulative = 0;
                    for(i=result.payload.length-1;i>0;i--){
                        var time_start = result.payload[i].START_DATE.split(" ")
                        var time = result.payload[i].END_DATE.split(" ")
                        var row = [];
                        row[0] = time[1].slice(0,-3);
                        row[1] = parseInt(result.payload[i].VALUES);
                        cumulative += parseInt(result.payload[i].VALUES);
                        row[2] = cumulative;
                        data.push(row);
                    }

                    google.charts.load('current', {'packages':['corechart']} );
                    google.charts.setOnLoadCallback(function() {
                        drawChart(ss_id,container,data);
                    });

                    function drawChart(ss_id,container,data){
                        var selected_date = $(".selected-date").val();
                        // console.log(data);
                        // console.log(ss_id) 
                        // console.log(container)
                        var datatable = new google.visualization.DataTable();
                        datatable.addColumn('datetime', 'LoggedDate');
                        datatable.addColumn('number', 'Cumulative Rain');
                        datatable.addColumn( {"type":"string", "role":"style"});
                        datatable.addColumn('number', 'Rain Value');

                        datatable.addColumn( {"type":"string", "role":"style"});

                        for(i=0;i<data.length;i++){
                             var row = Array(4);
                            row[0] = ___format(selected_date+" "+data[i][0])
                            row[1] = data[i][1]
                            row[2] = '';
                            row[3] = data[i][2]
                            row[4] = '{width :5px}';

                            datatable.addRow(row);
                        }


                        

                        datatable.addRow(row);
                       
                        var options = {
                          title : 'Rain Fall - Last 24 Hours ('+selected_date+')',
                          vAxes : {
                                0 : {
                                    title: 'Rain Value (mm)',
                                    format: '#.## mm',
                                    viewWindow: { min: 0, max: 20 }
                                },
                                1 : {
                                    title: 'Cumulative (mm)',
                                    direction: -1,
                                    format: '#.## mm',
                                    viewWindow: { min: 0, max: 200 }
                                }
                              },
                          hAxis: {
                            title: 'Rainfall Cumulative',
                            //viewWindow : {min: new Date(2017,9,16,6,0,0), max: new Date(2017,9,17,23,0,0)},
                            //textStyle : {fontSize: 12},
                            format: 'HH:MM'
                          },
                          seriesType: 'bars',
                          series: {
                                0: {
                                    type: "bars",
                                    targetAxisIndex: 0,
                                },
                                1: {
                                    type: 'line',
                                    pointSize: 5,
                                    targetAxisIndex: 1
                                    }
                                },
                            crosshair : {trigger: 'both'},
                            bar : {
                                groupWidth: '80%'
                            }
                            
                        };

                        var chart = new google.visualization.ComboChart(document.getElementById(container+ss_id));
                        chart.draw(datatable, options);

                        $(".loading-populating"+ss_id).addClass("hidden");
                    }

                }
            });
        }
    }

    var ___format = function(date){
        //console.log(date);
        var datefixed = date.substring(0, 19);
        //console.log("trimmed date " + datefixed);
        var headerDate = Date.parseExact(datefixed, 'yyyy-MM-dd HH:mm');
        var date = new Date(headerDate );
        //console.log(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        var hour = ('0' + (date.getHours() + 1)).slice(-2) ;
        var min = date.getMinutes();
        var secs = date.getSeconds();
        var mil = date.getMilliseconds();
        //console.log(new Date(year,month,day,hour,min,secs,mil));
        return new Date(year,month,day,hour,min,secs,mil);
      }



    var __attachPageAWSTableEvent = function() {
        var today = new Date();
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        

        var payload = {  } 
        $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
            if(result.status === 'SUCCESS'){
                $(".servertime").html(result.payload.date)
                __attachPageAWSTable(result.payload.date)
            }
        });
        
        var interval = setInterval(function(){
            
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    __attachPageAWSTable(result.payload.date)
                }
            });
        }, 60000);
        

        $(".btn-search").unbind("click").on("click",function(){
            ___debug("Trigger Search Button")
            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            var date = $(".servertime").html();


            clearInterval(interval);
            $(".fa-close").click()


            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    __attachPageAWSTable(result.payload.date)
                }
            });


            
            if(selected_date == today_format){

                
                interval = setInterval(function(){
                    $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                        if(result.status === 'SUCCESS'){
                            $(".servertime").html(result.payload.date)
                            __attachPageAWSTable(result.payload.date)
                        }
                    });
                }, 60000); 
                $(".servdate").removeClass("hidden")
            }else{
                $(".servdate").addClass("hidden")
            }

            
        });
    }



    var __attachPageAWSTable = function(datetime) {
        ___debug("Rain Fall Monitoring Station Table")
        $(".loading").fadeIn();

        var payload = { "SENSOR_ID" : "10" , "STATUS" : "1"} //<-- SENSOR_ID 1 for RAIN GAUGE
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            $(".loading").fadeOut("3000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    var count = $("span[id*='sensor_value10M"+STATION_ID+"']").length;
                    
                    if(count == 0){
                        $(".station_list").append(
                            '<tr>'+
                                '<td class="station-name" data-s-id="'+1+'" data-ss-id="'+STATION_SENSOR_ID+'" data-id="'+STATION_ID+'" data-name="'+STATION_NAME+'" style="cursor:pointer"><b>'+STATION_NAME+'</b></td>'+
                                '<td class="text-center"><span id="sensor_value10M'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin10M'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value24H'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="windsec'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw windspd'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="winddeg'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw windspd'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="windspd'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw windspd'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="air'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw air'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="rel'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw air'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="vapor'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw air'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="dew'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw air'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sbp'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw sbp'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="mslp'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw sbp'+STATION_ID+'"></i></td>'+
                                '<td class="text-center"><span id="solar'+STATION_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw solar'+STATION_ID+'"></i></td>'+
                                
                                
                            '</tr>'
                        );
                    }

                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = $(".servertime").html();
                    var date = $(".servertime").html();
                    if(selected_date != today_format){
                        date = selected_date;
                    }
                        ___getLatestReadingByStationID(STATION_ID,1,10,"sensor_value10M","spin10M",false,date);
                        ___getLatestReadingByStationID(STATION_ID,1,1440,"sensor_value24H","spin24H",false,date);
                        ___getLatestReadingByStationID(STATION_ID,10,10,"windspd","windspd",false,date).done(function(result){
                            if(result.status === 'SUCCESS'){
                                $("#winddeg"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_2_RAW)
                                $("#windsec"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_1_RAW)
                            }
                        });

                        ___getLatestReadingByStationID(STATION_ID,8,10,"air","air",false,date).done(function(result){
                            if(result.status === 'SUCCESS'){
                                $("#rel"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_1_RAW)
                                $("#vapor"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_2_RAW)
                                $("#dew"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_3_RAW)    
                            }
                            
                            
                        });

                        ___getLatestReadingByStationID(STATION_ID,9,10,"sbp","sbp",false,date).done(function(result){
                            if(result.status === 'SUCCESS'){
                                $("#mslp"+STATION_ID).html(result.payload.SENSOR_DATA_INPUT_1_RAW)
                            }
                        });

                        ___getLatestReadingByStationID(STATION_ID,11,10,"solar","solar",false,date);
                        
                        

                }   

                ___getIntervalAWSData(10);
            }
        })
    }

    var ___getIntervalAWSData = function(interval1){
        var intervalTrigger;
        $(".station-name").unbind('click').on('click',function(){
            var station_id = $(this).data('id');
            var ss_id = $(this).data('ss-id');
            var station_name = $(this).data('name');
            var sensor_id = $(this).data('s-id');

            ___debug("Selected Station ID: " +station_id)
            clearInterval(intervalTrigger);
            //Adjust Panels
            /*$(".tb-result").removeClass("col-md-12");
            $(".tb-result").addClass("col-md-8");*/


            $(".fa-close").unbind("click").on("click",function(){
                ___debug("Close Data");
                $(".station-data").addClass("hidden")
                $(".tb-result").removeClass("col-md-8");
                $(".tb-result").addClass("col-md-12");
                clearInterval(intervalTrigger);
            })
            //End of Adjust Panels

            $(".selected-station").html(station_name)

            
            var interval = interval1; //<-- Temporary Interval

            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            var date = null;
            if(selected_date != today_format){
                date = selected_date;
            }

            ___retrieveData(station_id,interval,date,sensor_id);            
            
            

            if(selected_date == today_format){
               // intervalTrigger = setInterval(function(){ ___retrieveData(ss_id,interval,date,sensor_id);   }, 60000);
            }
        });


        ___retrieveData = function(ss_id,interval,end_date=null,sensor_id){
            //ss_id = 
            $(".loading-populating").removeClass("hidden");
            var sensor_id = 1;
            $(".selected-station-result").addClass("hidden");
            $(".station-data").removeClass("hidden")

            var payload = { "STATION_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date, "SENSOR_ID" : sensor_id}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                $(".loading-populating").addClass("hidden");
                $(".selected-station-result").removeClass("hidden");

                $(".time-populate").empty();
                if(result.status === 'SUCCESS'){


                    if ( $.fn.DataTable.isDataTable('#table-populate') ) {
                      $('#table-populate').DataTable().destroy();
                      $('#table-populate tbody').empty();
                    }

                    var accvalue = 0.00;
                    for(i=0;i<result.payload.length;i++){
                        var time_start = result.payload[i].START_DATE.split(" ")
                        var time = result.payload[i].END_DATE.split(" ")
                        $(".date-pop").html(time[0]);
                        //accvalue += parseFloat(result.payload[i].VALUES != null ? result.payload[i].VALUES : 0);
                        var value = (result.payload[i].VALUES != null ? result.payload[i].VALUES : "-");
                        var rf10 = "-";
                        var rf24 = "-";
                        var winsec = "-";
                        var winddeg = "-";
                        var winspd = "-";

                        var airtemp = "-";
                        var relhum = "-";
                        var vapPres = "-";
                        var dewpoint = "-";

                        var stationbar = "-";
                        var mslbar = "-";


                        var pyra = "-";

                        if(typeof(result.payload[i]['RAIN GAUGE SENSOR']) != "undefined"){
                            rf10 = result.payload[i]['RAIN GAUGE SENSOR'][0];
                        }

                        if(typeof(result.payload[i]['ANEMOMETER']) != "undefined"){
                            winsec = result.payload[i]['ANEMOMETER'][1];
                            winddeg = result.payload[i]['ANEMOMETER'][2];
                            winspd = result.payload[i]['ANEMOMETER'][0];
                        }


                        if(typeof(result.payload[i]['THERMOMETER AND HYGROMETER']) != "undefined"){
                            airtemp = result.payload[i]['THERMOMETER AND HYGROMETER'][0];
                            relhum = result.payload[i]['THERMOMETER AND HYGROMETER'][1];
                            vapPres = result.payload[i]['THERMOMETER AND HYGROMETER'][2];
                            dewpoint = result.payload[i]['THERMOMETER AND HYGROMETER'][3];
                        }

                        if(typeof(result.payload[i]['BAROMETRIC PRESSURE SENSOR']) != "undefined"){
                            stationbar = result.payload[i]['BAROMETRIC PRESSURE SENSOR'][0];
                            mslbar = result.payload[i]['BAROMETRIC PRESSURE SENSOR'][1];
                            
                        }

                        if(typeof(result.payload[i]['PYRANOMETER']) != "undefined"){
                            pyra = result.payload[i]['PYRANOMETER'][0];
                        }
                        




                        $(".time-populate").append(
                                '<tr>'+
                                   '<td style="" class="font_12" align="center">'+time_start[0]+'</td>'+
                                    '<td style="" class="font_12" align="center">'+time_start[1].slice(0,-3)+'-'+time[1].slice(0,-3)+'</td>'+
                                    '<td style="" class="font_12" align="center">'+time_start[0]+" "+time_start[1].slice(0,-3)+'-'+time[1].slice(0,-3)+'</td>'+
                                    '<td style="" class="font_12" align="center">'+rf10+'</td>'+
                                    '<td style="" class="font_12" align="center">'+rf24+'</td>'+
                                    '<td style="" class="font_12" align="center">'+winsec+'</td>'+
                                    '<td style="" class="font_12" align="center">'+winddeg+'</td>'+
                                    '<td style="" class="font_12" align="center">'+winspd+'</td>'+
                                    '<td style="" class="font_12" align="center">'+airtemp+'</td>'+
                                    '<td style="" class="font_12" align="center">'+relhum+'</td>'+
                                    '<td style="" class="font_12" align="center">'+vapPres+'</td>'+
                                    '<td style="" class="font_12" align="center">'+dewpoint+'</td>'+
                                    '<td style="" class="font_12" align="center">'+stationbar+'</td>'+
                                    '<td style="" class="font_12" align="center">'+mslbar+'</td>'+
                                    '<td style="" class="font_12" align="center">'+pyra+'</td>'+
                                '</tr>');

                    }

                    
                    var dt = $("#table-populate").DataTable({
                        dom: 'Brti',
                         "scrollY": "350px", "scrollCollapse": true,
                        paging : false,
                        "bInfo" : false,
                         "columnDefs": [ { "targets": [ 0,1 ], "visible": false, "searchable": false }],
                         "order": [],
                        buttons: [
                            {   extend: 'csv',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'pdfHtml5',
                                
                                customize: function (doc) {
                                    doc.styles.tableBodyEven.alignment = 'center';
                                    doc.styles.tableBodyOdd.alignment = 'center';
                                    doc.content[1].table.widths = 
                                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                                },
                                exportOptions: {
                                   columns: [ 0, 1, 3, 4, 5 ,6 ,7,8,9,10,11,12,13,14]
                                }, title: "Station: "+$(".selected-station").html()+"  Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'excelHtml5',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4, 5 ,6 ,7,8,9,10,11,12,13,14]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                        ],
                  
                    });
                    

                    $(".dt-buttons").addClass("hidden")
                    $(".btnCSV").unbind('click').on("click",function(){ $(".buttons-csv").click(); })
                    $(".btnPDF").unbind('click').on("click",function(){ $(".buttons-pdf").click(); })
                    $(".btnXLS").unbind('click').on("click",function(){ $(".buttons-excel").click(); })

                }
            });
        }
    }


    var __attachPageRainFallTableEvent = function(advanced) {
        var today = new Date();
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        


        var payload = { "SENSOR_ID" : 1  } 
        $.wms.executeExternalPost('/wms/wsv1/api/getAllRiverBasinBySensorID',JSON.stringify(payload)).done(function (result) {
            if(result.status === 'SUCCESS'){
                console.log(result)
                for(i=0;i<result.payload.length;i++){

                    var addedcolumns = "";
                    var addedcolumnsSpacing = "";
                    if(advanced){
                        addedcolumnsSpacing = "<th class='adv' colspan='7'>&nbsp;</th>";
                        addedcolumns = '<th width="5%" class="text-center font_10">10 Days (mm)</th>'+
                                        '<th width="5%" class="text-center font_10">Day 1-10<br/>(mm)</th>'+
                                        '<th width="5%" class="text-center font_10">Day 11-20<br/>(mm)</th>'+
                                        '<th width="5%" class="text-center font_10">Day 21-31<br/>(mm)</th>'+
                                        '<th width="5%" class="text-center font_10">1 Month<br/>(mm)</th>'+
                                        '<th width="5%" class="text-center font_8">NO. OF DAYS WITH RAIN PER MONTH</th>'+
                                        '<th width="5%" class="text-center font_8">NO. OF DAYS WITH RAIN IN YEAR</th>';
                    }


                    $(".river_list").append(
                        '<div class="col-md-12 ">'+
                            '<div class="panel panel-primary">'+
                                '<div class="panel-heading" style="cursor:pointer" data-toggle="collapse" href="#collapse'+result.payload[i].RIVER_BASIN_ID+'"> '+
                                    '<h4 class="b"><i class="fa fa-angle-double-down"></i> '+result.payload[i].RIVER_BASIN_NAME+' </h4> '+
                                '</div>'+
                                '<div id="collapse'+result.payload[i].RIVER_BASIN_ID+'" class="panel-collapse collapse in">'+
                                    '<div class="panel-body">'+
                                        '<table class="table table-bordered table-striped table-hover table-rainfall">'+
                                            '<thead class="tb-header ">'+
                                                '<tr>'+
                                                    '<th >&nbsp;</th>'+
                                                    '<th colspan="1" class="text-center" >RF [mm]</th>'+
                                                    '<th colspan="6" class="text-center" >Accumulated Rainfall [mm]</th>'+ addedcolumnsSpacing +
                                                '</tr>'+
                                                '<tr>'+
                                                    '<th width="20%">Station Name</th>'+
                                                    '<th width="5%" class="text-center font_12">10 min</th>'+
                                                    '<th width="5%" class="text-center font_12">30 min</th>'+
                                                    '<th width="5%" class="text-center font_12">1 Hour</th>'+
                                                    '<th width="5%" class="text-center font_12">3 Hour</th>'+
                                                    '<th width="5%" class="text-center font_12">6 Hour</th>'+
                                                    '<th width="5%" class="text-center font_12">12 Hour</th>'+
                                                    '<th width="5%" class="text-center font_12">24 Hour</th>'+ addedcolumns +
                                                '</tr>'+
                                            '</thead>'+
                                            '<tbody class="station_list station_list_'+result.payload[i].RIVER_BASIN_ID+'">'+
                                                
                                            '</tbody>'+
                                        '</table>'+
                                        '<div class="pull-right hidden"><i>Data as of <span id="sensor_value_date1"></span></i></div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>');


                }
                // $(".servertime").html(result.payload.date)
                // __attachPageRainFallTable(result.payload.date).done(function(result2){

                //     ___debug(result2)
                //     //For AutoTrigger of loading
                //     $(".station-name").eq(1).trigger("click")
                // })
            }
        });


        var payload = {  } 
        $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
            if(result.status === 'SUCCESS'){
                $(".servertime").html(result.payload.date)
                __attachPageRainFallTable(result.payload.date).done(function(result2){

                    ___debug(result2)
                    //For AutoTrigger of loading
                    //$(".station-name").eq(0).trigger("click")
                })
            }
        });
        if(advanced){ refresh = 300000  }else{ refresh = 60000 }
        var interval = setInterval(function(){
            
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    __attachPageRainFallTable(result.payload.date)
                }
            });
        }, refresh);
        

        $(".btn-search").unbind("click").on("click",function(){
            ___debug("Trigger Search Button")
            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            var date = $(".servertime").html();


            clearInterval(interval);
            $(".fa-close").click()


            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    __attachPageRainFallTable(result.payload.date);
                }
            });


            
            if(selected_date == today_format){

                if(advanced){ refresh = 300000  }else{ refresh = 60000 }
                interval = setInterval(function(){
                    $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                        if(result.status === 'SUCCESS'){
                            $(".servertime").html(result.payload.date)
                            __attachPageRainFallTable(result.payload.date)
                        }
                    });
                }, refresh); 
                $(".servdate").removeClass("hidden")
            }else{
                $(".servdate").addClass("hidden")
            }

            
        });
    }


    var __attachPageRainFallTable = function(datetime) {
        ___debug("Rain Fall Monitoring Station Table")
        var def = $.Deferred();
        $(".loading").fadeIn();

        var payload = { "SENSOR_ID" : "1", "STATUS" : "1" } //<-- SENSOR_ID 1 for RAIN GAUGE
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            $(".loading").fadeOut("3000");
            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var RIVER_BASIN_ID = result.payload[i].RIVER_BASIN_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                    var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                    var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                    var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                    var STATION_LON = result.payload[i].STATION_LONG;
                    var STATION_LAT = result.payload[i].STATION_LAT;
                    var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                    var count = $("span[id*='sensor_value10M"+STATION_SENSOR_ID+"']").length;
                    var count2 = $("th[class*='adv']").length;
                    console.log(count2);

                    var adv_cols = "";
                    if(count2 > 0){
                        adv_cols = '<td class="text-center"><span id="sensor_value10D'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin10D'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_value1_10D'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1_10D'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_value11_20D'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin11_20D'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_value21_31D'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin21_31D'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_value1M'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1M'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_valueRM'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spinRM'+STATION_SENSOR_ID+'"></i></td>'+
                                    '<td class="text-center"><span id="sensor_valueRY'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spinRY'+STATION_SENSOR_ID+'"></i></td>'
                    }

                    if(count == 0){
                        $(".station_list_"+RIVER_BASIN_ID).append(
                            '<tr>'+
                                '<td class="station-name stat'+STATION_SENSOR_ID+'" data-s-id="'+SENSOR_ID+'" data-ss-id="'+STATION_SENSOR_ID+'" data-id="'+STATION_ID+'" data-name="'+STATION_NAME+'" style="cursor:pointer"><b>'+STATION_NAME+'</b></td>'+
                                '<td class="text-center stat'+STATION_SENSOR_ID+'"><span id="sensor_value10M'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin10M'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center stat'+STATION_SENSOR_ID+'"><span id="sensor_value30M'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin30M'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center stat'+STATION_SENSOR_ID+'"><span id="sensor_value1H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value3H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin3H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value6H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin6H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value12H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin12H'+STATION_SENSOR_ID+'"></i></td>'+
                                '<td class="text-center"><span id="sensor_value24H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_SENSOR_ID+'"></i></td>'+adv_cols+
                            '</tr>'
                        );
                    }

                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = $(".servertime").html();
                    var date = $(".servertime").html();
                    if(selected_date != today_format){
                        date = selected_date;
                    }
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,10,"sensor_value10M","spin10M",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,30,"sensor_value30M","spin30M",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin1H",false,date).done(function (result) {
                            //console.log(result);
                            if(result.status ==='SUCCESS'){
                                var ss_id = result.station_sensor_id
                                var curr = parseFloat(result.payload.SENSOR_DATA_INPUT_0_RAW);
                                var alert = 8
                                var alarm = 15.5
                                var critical = 30.5
                                $(".stat"+ss_id).removeClass("bg-orange")
                                $(".stat"+ss_id).removeClass("bg-red")
                                $(".stat"+ss_id).removeClass("bg-yellow")
                                $(".stat"+ss_id).removeClass("blinking")


                                if(curr >= critical){
                                    //console.log("critical")
                                    $(".stat"+ss_id).addClass("blinking");
                                    $(".stat"+ss_id).addClass("bg-red");
                                }else if(curr >= alarm){
                                    //console.log("alarm")
                                    $(".stat"+ss_id).addClass("blinking");
                                    $(".stat"+ss_id).addClass("bg-orange")
                                }else if(curr >= alert){
                                    //console.log("alert")
                                    $(".stat"+ss_id).addClass("blinking");
                                    $(".stat"+ss_id).addClass("bg-yellow");
                                }else{
                                    //console.log("else")
                                    $(".stat"+ss_id).removeClass("blinking");
                                }
                            }
                        });



                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,180,"sensor_value3H","spin3H",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,360,"sensor_value6H","spin6H",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,720,"sensor_value12H","spin12H",false,date);
                        ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H",false,date);
                        if(count2 > 0){
                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,14400,"sensor_value10D","spin10D",false,date);
                            var new_date = date.substring(0, 8)+"10";
                            //console.log(new_date);
                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,14400,"sensor_value1_10D","spin1_10D",false,new_date);
                            var new_date = date.substring(0, 8)+"20";
                            //console.log(new_date);
                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,14400,"sensor_value11_20D","spin11_20D",false,new_date);
                            
                            
                           
                            var dd = new Date(date.substring(0, 4), date.substring(5, 7), 0).getDate();
                           

                            var new_date = date.substring(0, 8)+dd;
                            //console.log(new_date);
                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440*(dd-20),"sensor_value21_31D","spin21_31D",false,new_date);

                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440*(dd),"sensor_value1M","spin1M",false,new_date);

                             var new_date = date.substring(0, 7);
                            ___getRainyDays(STATION_SENSOR_ID,SENSOR_ID,"","sensor_valueRM","spinRM",false,new_date);

                             var new_date = date.substring(0, 4);
                            ___getRainyDays(STATION_SENSOR_ID,SENSOR_ID,"","sensor_valueRY","spinRY",false,new_date);
                                
                        }

                }   

                
                if ($(window).width() < 700){


                    if ( ! ($.fn.DataTable.isDataTable('.table-rainfall') ) ){
                      
                        $(".table-rainfall").DataTable({
                            width: "800px",
                            "paging" : false,
                            "info" : false,
                            searching: false,
                            ordering : false,
                            scrollY:        "400px",
                            scrollX:        true,
                            scrollCollapse: true,
                            paging:         false,
                            fixedColumns:   {
                                leftColumns: 1,
                           
                            }
                        });
                    }
                }

                ___getIntervalData(10);
                def.resolve(result);

                
                
                
                
            }
        })
        return def.promise();
    }

    var ___getIntervalData = function(interval1){
        var intervalTrigger;
        $(".station-name").unbind('click').on('click',function(){
            var station_id = $(this).data('id');
            var ss_id = $(this).data('ss-id');
            var station_name = $(this).data('name');
            var sensor_id = $(this).data('s-id');

            ___debug("Selected Station ID: " +station_id)
            clearInterval(intervalTrigger);
            //Adjust Panels
            $(".tb-result").removeClass("col-md-12");
            $(".tb-result").addClass("col-md-8");


            $(".fa-close").unbind("click").on("click",function(){
                ___debug("Close Data");
                $(".station-data").addClass("hidden")
                $(".tb-result").removeClass("col-md-8");
                $(".tb-result").addClass("col-md-12");
                clearInterval(intervalTrigger);
            })
            //End of Adjust Panels

            $(".selected-station").html(station_name)

            
            var interval = interval1; //<-- Temporary Interval

            var selected_date = $(".selected-date").val();
            var today = new Date();
            var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
            var date = null;
            if(selected_date != today_format){
                date = selected_date;
            }

            ___retrieveData(ss_id,interval,date,sensor_id);            
            
            

            if(selected_date == today_format){
                intervalTrigger = setInterval(function(){ ___retrieveData(ss_id,interval,date,sensor_id);   }, 90000);
            }
        });


        ___retrieveData = function(ss_id,interval,end_date=null,sensor_id){
            $(".loading-populating").removeClass("hidden");
            $(".selected-station-result").addClass("hidden");
            $(".station-data").removeClass("hidden")

            var payload = { "STATION_SENSOR_ID" : ss_id, "INTERVAL" : interval, "END_DATE" : end_date, "SENSOR_ID" : sensor_id}
            $.wms.executeExternalPost('/wms/wsv1/api/getStationSensorRawDataByStationSensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result);
                $(".loading-populating").addClass("hidden");
                $(".selected-station-result").removeClass("hidden");

                $(".time-populate").empty();
                if(result.status === 'SUCCESS'){


                    if ( $.fn.DataTable.isDataTable('#table-populate') ) {
                      $('#table-populate').DataTable().destroy();
                      $('#table-populate tbody').empty();
                    }

                    var accvalue = 0.00;
                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)



                    if(selected_date == today_format){
                        result.payload.shift();
                    }else{

                    }


                    for(i=0;i<result.payload.length;i++){
                        var time_start = result.payload[i].START_DATE.split(" ")
                        var time = result.payload[i].END_DATE.split(" ")
                        $(".date-pop").html(time[0]);
                        //accvalue += parseFloat(result.payload[i].VALUES != null ? result.payload[i].VALUES : 0);
                        var value = (result.payload[i].VALUES != null ? result.payload[i].VALUES : "-");
                        var endTime = time[1].slice(0,-3)

                        var selected_date = $(".selected-date").val();
                        var today = new Date();
                        var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)

                        if(selected_date != today_format){
                            if(i == 0){
                                console.log("Changed end Time")
                                endTime = "23:59"     
                            }
                           
                        }

                        $(".time-populate").append(
                                '<tr>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[0]+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[1].slice(0,-3)+'-'+endTime+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+time_start[0]+" "+time_start[1].slice(0,-3)+'-'+endTime+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+value+'</td>'+
                                    '<td style="padding: 5px" class="font_12" align="center">'+result.payload[i].ACCUMULATIVE+'</td>'+
                                '</tr>');

                    }

                    var paneheight = $(".tb-result").height();
                    paneheight = parseInt(paneheight)-155+"px"
                    //console.log(paneheight)
                    var dt = $("#table-populate").DataTable({
                        dom: 'Brti',
                         "scrollY": paneheight, "scrollCollapse": true,
                        paging : false,
                        "bInfo" : false,
                         "columnDefs": [ { "targets": [ 0,1 ], "visible": false, "searchable": false }],
                         "order": [],
                        buttons: [
                            {   extend: 'csv',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'pdfHtml5',
                                /*
                                customize: function ( doc ) {
                                    // Splice the image in after the header, but before the table
                                    doc.content.splice( 1, 0, {
                                        margin: [ 0, 0, 0, 12 ],
                                        alignment: 'center',
                                        image: 'data:image/png;base64,'
                                    } );
                                    // Data URL generated by http://dataurl.net/#dataurlmaker
                                },*/
                                customize: function (doc) {
                                    //console.log(doc);
                                    doc.styles.tableBodyEven.alignment = 'center';
                                    doc.styles.tableBodyOdd.alignment = 'center';
                                    doc.content[1].table.widths = 
                                        Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                                },
                                exportOptions: {
                                   columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+"  Date: "+ $(".selected-date").val(), download: 'open'
                            },
                            {   extend: 'excelHtml5',
                                exportOptions: {
                                    columns: [ 0, 1, 3, 4]
                                }, title: "Station: "+$(".selected-station").html()+" Date: "+ $(".selected-date").val(), download: 'open'
                            },
                        ],
                        "columns": [
                            { "width": "25%" },
                            { "width": "25%" },
                            { "width": "40%" },
                            { "width": "30%" },
                            { "width": "30%" }
                          ]
                    });

                    $(".dt-buttons").addClass("hidden")
                    $(".btnCSV").unbind('click').on("click",function(){ $(".buttons-csv").click(); })
                    $(".btnPDF").unbind('click').on("click",function(){ $(".buttons-pdf").click(); })
                    $(".btnXLS").unbind('click').on("click",function(){ $(".buttons-excel").click(); })

                }
            });
        }
    }

    function hasMap( id ) {
        return !! document.getElementById(id).firstChild;
    }

    var __attachPageRainFallMap = function(element) {
        ___debug("Rain Fall Monitoring Station Map")
        $(".loading").fadeIn();
        if(typeof element === "undefined"){
             element = "station_map";
        }

        if($("#"+element).children().length > 0){

        }else{



            var payload = { "nexthour" : true } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".servernewtime").html(result.payload.date)
                    //__attachPageRainFallTable(result.payload.date)
                }
            });


            var payload = { "basehourly" : true } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".basetime").html(result.payload.date)
                   
                }
            });

            var payload = { } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".currenttime").html(result.payload.date)
                   
                }
            });



            var payload = { "nexthourly" : true } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    //console.log(result.payload.date);
                    $(".servertime").html(result.payload.date)
                    
                    var payload = { "SENSOR_ID" : "1" , "STATUS" : "1"} //<-- SENSOR_ID 1 for RAIN GAUGE
                    var station = [];
                    $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
                    var pointMarkerImage = new Array();//store image of marker in array
                    var pointMarker = [];//store marker in array

                        if(result.status === 'SUCCESS'){
                            for(i=0;i<result.payload.length;i++){
                                var STATION_ID = result.payload[i].STATION_ID;
                                var STATION_NAME = result.payload[i].STATION_NAME;
                                var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                                var SENSOR_ID = result.payload[i].SENSOR_ID;
                                var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                                var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                                var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                                var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                                var STATION_LON = result.payload[i].STATION_LONG;
                                var STATION_LAT = result.payload[i].STATION_LAT;
                                var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");

                                station.push({position:  new google.maps.LatLng(STATION_LAT, STATION_LON),
                                label: STATION_NAME, type : STATION_TYPE_NAME, payload: result.payload[i], position2: new google.maps.LatLng(parseFloat(STATION_LAT), parseFloat(STATION_LON)) })

                                var station_content = "<tr style='cursor:pointer'  class='identify1"+STATION_SENSOR_ID+"'><td><input type='checkbox' class='cb"+STATION_SENSOR_ID+"'></td><td class='identify"+STATION_SENSOR_ID+"'>"+STATION_NAME+"</td>"+
                                        '<td class="text-center"><span id="sensor_value1H'+STATION_SENSOR_ID+'"></span><span class="g'+STATION_SENSOR_ID+'"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin12H'+STATION_SENSOR_ID+'"></i></span><span class="n'+STATION_SENSOR_ID+'"></span><span class="b'+STATION_SENSOR_ID+'"></span><span class="o'+STATION_SENSOR_ID+'"></span><span class="y'+STATION_SENSOR_ID+'"></span><span class="r'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center"><span id="sensor_value1HM'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center">'+
                                        '<span class="hidden" id="sensor_valuePD'+STATION_SENSOR_ID+'"></span>'+
                                        '<span class="hidden" id="sensor_value1M'+STATION_SENSOR_ID+'"></span>'+
                                        '<span id="sensor_value24H'+STATION_SENSOR_ID+'"></span><i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_SENSOR_ID+'"></i></td>'                                      ;
                                        

                                $(".station-populate").append(station_content);

                                /*
                                date = $(".servertime").html()
                                
                                ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H",false,date)
                                ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin12H",false,date).done(function(result){
                                    if(result.status === 'SUCCESS'){
                                        if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 30){
                                            $(".r"+result.station_sensor_id).trigger("click");
                                        }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 15){
                                            $(".o"+result.station_sensor_id).trigger("click");
                                        }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 7.5){
                                            $(".y"+result.station_sensor_id).trigger("click");
                                        }else if(result.payload.SENSOR_DATA_INPUT_0_RAW > 0){
                                            $(".b"+result.station_sensor_id).trigger("click");
                                        }else{
                                            $(".n"+result.station_sensor_id).trigger("click");
                                        }
                                    }
                                });
                                */
                                
                            }

                            var interval = setInterval(function(){
                                for(i=0;i<result.payload.length;i++){
                                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                                    var SENSOR_ID = result.payload[i].SENSOR_ID;

                                    date = $(".servertime").html()
                                    current_date = $(".currenttime").html()
                                    /*___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin12H",false,date);*/
                                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","",false,date);
                                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1HM","",false,current_date);
                                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","",false,date).done(function(result){
                                        //console.log(result);
                                        if(result.status === 'SUCCESS'){
                                            if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 30){
                                                $(".r"+result.station_sensor_id).trigger("click");
                                            }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 15){
                                                $(".o"+result.station_sensor_id).trigger("click");
                                            }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 7.5){
                                                $(".y"+result.station_sensor_id).trigger("click");
                                            }else if(result.payload.SENSOR_DATA_INPUT_0_RAW > 0){
                                                $(".b"+result.station_sensor_id).trigger("click");
                                            }else{
                                                $(".n"+result.station_sensor_id).trigger("click");
                                            }
                                        }
                                    });

                                    
                                     var new_date = date.substring(0, 7);
                                    ___getRainyDays(STATION_SENSOR_ID,SENSOR_ID,"","sensor_value1M","spin1M",false,new_date);

                                    var date = new Date();
                                    date.setDate(date.getDate()-1);
                                    var new_date = date.getFullYear()+"-"+ ('0' + (date.getMonth()+1)).slice(-2) + '-' +date.getDate();
                                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440*3,"sensor_valuePD","spinPD",false,new_date)

                                }
                            },60000);

                            //console.log(station);
                            initMap(station,element,pointMarkerImage,pointMarker)
                        }
                    });
                }
            });
            //KMSJ13

            var interval = setInterval(function(){
                
                var payload = { "nexthour" : true } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".servernewtime").html(result.payload.date)
                        //__attachPageRainFallTable(result.payload.date)
                    }
                });


                var payload = { "basehourly" : true } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".basetime").html(result.payload.date)
                        //__attachPageRainFallTable(result.payload.date)
                    }
                });

                 var payload = { "nexthourly" : true } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".servertime").html(result.payload.date)
                    }
                });

                var payload = { } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".currenttime").html(result.payload.date)
                       
                    }
                });


            }, 60000);
            


           
            

            function initMap(station,element,pointMarkerImage,pointMarker) {
                
                
                var map = new google.maps.Map(document.getElementById(element), {
                    mapTypeId: 'roadmap',
                    disableDefaultUI: true,
                    zoomControl: true,
                    //mapTypeControl: true,
                    scaleControl: true,
                    rotateControl: true,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        
                    },
                    //mapTypeId : google.maps.MapTypeId.ROADMAP
                });

                function newPolyLine(path) {
                    var polyLine = new google.maps.Polygon({
                      paths: path,
                      strokeColor: 'black',
                      strokeOpacity: 0.9,
                      strokeWeight: 2,
                      fillColor: 'blue',
                      fillOpacity: 0.05,
                      clickable: false
                    });
                    polyLine.setMap(map);
                    return polyLine;
                  };

              

                
                setTimeout(function () {

                    map.data.loadGeoJson('assets/geojson/River.geojson');
        
                    map.data.loadGeoJson('assets/geojson/Basins.geojson');
                    map.data.loadGeoJson('assets/geojson/IponanSteam.geojson');
                    map.data.loadGeoJson('assets/geojson/Iponan.geojson');

                    map.data.setStyle(function(feature) {
                        var selected = feature.getGeometry().getType()
                        console.log(selected)
                        if(selected =='MultiLineString'){
                          return {
                            strokeColor: "#009bff",
                            strokeWeight: 1,
                            strokeOpacity: 1,
                          }  
                        }

                        if(selected == 'MultiPolygon'){
                          return{
                            fillColor: "Blue",
                            strokeWeight: 2,
                            fillOpacity:0
                          }
                        }
                    })

                    var bounds = new google.maps.LatLngBounds();
                    var infowindow = []
                    //var infowindow = new google.maps.InfoWindow()
                    var location = document.location.href.substring(0, document.location.href.lastIndexOf("/") + 1);
                    //var icons = location+"/assets/img/map-marker.png";
                    var icons = {
                      url :  location+"/assets/img/map/wi-rain-gray.png",
                    
                    }
                   
                    
                    i = 0;
                    pointMarker = []
                    
                    station.forEach(function(feature) {
                        id = feature.payload.STATION_SENSOR_ID
                        pointMarkerImage[i] = icons
                        infowindow[feature.payload.STATION_SENSOR_ID] =  new google.maps.InfoWindow()

                        bounds.extend(feature.position2);
                   
                        pointMarker[id] = new google.maps.Marker({
                            position: feature.position,
                            icon : icons,
                            map: map,
                            content : ''
                            
                        });

                        //pointMarker[id].infowindow = new google.maps.InfoWindow()
                        

                        
                        var marker = pointMarker[feature.payload.STATION_SENSOR_ID]

                        //console.log("ADDED" )
                       
                       

                      
                        $(".identify1"+feature.payload.STATION_SENSOR_ID).on("mouseover",function(){
                            if ($(this).hasClass("b")){
                            }else{

                                var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                                var d2 = $('#sensor_value24H'+feature.payload.STATION_SENSOR_ID).html();
                                var d3 = $('#sensor_valuePD'+feature.payload.STATION_SENSOR_ID).html();
                                var d4 = $('#sensor_value1M'+feature.payload.STATION_SENSOR_ID).html();
                                
                                
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                        '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                        /*'<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr>'+
                                                        '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr></table>'*/
                                                        '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span>'+d2+'</span></td>'+
                                                        '<tr class="bold"><td >PREVIOUS 3 DAYS RAINFALL [mm]</td><td><span>'+d3+'</span></td>'+
                                                        '<tr class="bold"><td >NUMBER OF DAYS WITH RAIN PER MONTH (DAY)</td><td><span>'+d4+'</span></td></tr></table>';
            
                                                               
                                pointMarker[id].infowindow = new google.maps.InfoWindow({
                                  content: contentString
                                });
                                pointMarker[id].infowindow.setZIndex(99);
                                pointMarker[id].infowindow.open(map, marker);
                            }

                        })
                        //console.log(feature.payload.STATION_SENSOR_ID);
                        $(".cb"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            
                            if($(this).is(":checked")){
                                
                                
                                var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                                var d2 = $('#sensor_value24H'+feature.payload.STATION_SENSOR_ID).html();
                                var d3 = $('#sensor_valuePD'+feature.payload.STATION_SENSOR_ID).html();
                                var d4 = $('#sensor_value1M'+feature.payload.STATION_SENSOR_ID).html();
                                
                               
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                        '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                        '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span class="sensor_value1H'+feature.payload.STATION_SENSOR_ID+'">'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span class="sensor_value24H'+feature.payload.STATION_SENSOR_ID+'">'+d2+'</span></td></tr>'+
                                                        '<tr class="bold"><td >PREVIOUS 3 DAYS RAINFALL [mm]</td><td><span>'+d3+'</span></td>'+
                                                        '<tr class="bold"><td >NUMBER OF DAYS WITH RAIN PER MONTH (DAY)</td><td><span>'+d4+'</span></td></tr></table>';
            
                                                               
                       
                                

                                infowindow[feature.payload.STATION_SENSOR_ID].setContent(contentString);
                                infowindow[feature.payload.STATION_SENSOR_ID].open(map, marker);


                            }else{
                                //console.log("B")
                               
                                infowindow[feature.payload.STATION_SENSOR_ID].close()
                            }   
                                
                            
                            
                        })

                      

                        $(".identify1"+feature.payload.STATION_SENSOR_ID).on("mouseout",function(){
                                pointMarker[id].infowindow.close();  
                                 //console.log( feature.payload.STATION_SENSOR_ID);
                        });


                        $(".n"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-gray.png",
                            marker.setIcon(url)
                        })


                        $(".b"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-blue.gif",
                            marker.setIcon(url)
                        })

                        $(".r"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-red.gif",
                            marker.setIcon(url)
                        })

                        $(".y"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-yellow.gif",
                            marker.setIcon(url)
                        })

                        $(".o"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-orange.gif",
                            marker.setIcon(url)
                        })

                        

                        

                        
                        marker.addListener('mouseover', function() {
                            var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                            var d2 = $('#sensor_value24H'+feature.payload.STATION_SENSOR_ID).html();
                            var d3 = $('#sensor_valuePD'+feature.payload.STATION_SENSOR_ID).html();
                            var d4 = $('#sensor_value1M'+feature.payload.STATION_SENSOR_ID).html();
                            //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                            contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr></table>'
                                                    '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span>'+d1+'</span></td></tr>'+
                                                    '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span>'+d2+'</span></td></tr>'+
                                                    '<tr class="bold"><td >PREVIOUS 3 DAYS RAINFALL [mm]</td><td><span>'+d3+'</span></td>'+
                                                        '<tr class="bold"><td >NUMBER OF DAYS WITH RAIN PER MONTH (DAY)</td><td><span>'+d4+'</span></td></tr></table>';
        
                                                           
                            infowindow[i] = new google.maps.InfoWindow({
                              content: contentString
                            });
                            

                            //url :  location+"/assets/img/map/wi-rain-blue.png",
                            //marker.setIcon(url)
                            
                            infowindow[i].open(map, marker);
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value_1H","spin1H",false, $(".servertime").html());
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440,"sensor_value_24H","spin24H",false, $(".servertime").html());

                        });

                        marker.addListener('click', function() {
                            console.log("CLICKED")
                            var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                            var d2 = $('#sensor_value24H'+feature.payload.STATION_SENSOR_ID).html();
                            var d3 = $('#sensor_valuePD'+feature.payload.STATION_SENSOR_ID).html();
                            var d4 = $('#sensor_value1M'+feature.payload.STATION_SENSOR_ID).html();
                            //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                            contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr></table>'
                                                    '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span>'+d1+'</span></td></tr>'+
                                                    '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span>'+d2+'</span></td></tr>'+
                                                    '<tr class="bold"><td >PREVIOUS 3 DAYS RAINFALL [mm]</td><td><span>'+d3+'</span></td>'+
                                                     '<tr class="bold"><td >NUMBER OF DAYS WITH RAIN PER MONTH (DAY)</td><td><span>'+d4+'</span></td></tr></table>';
        
                                                           
                            infowindow[i] = new google.maps.InfoWindow({
                              content: contentString
                            });
                            

                            //url :  location+"/assets/img/map/wi-rain-blue.png",
                            //marker.setIcon(url)
                            
                            infowindow[i].open(map, marker);
                        });

                        marker.addListener('mouseout', function() {
                            console.log("OUT")
                            infowindow[i].close();
                        });
                       

                        i++;


                        //2018-11-22
                        date = $(".servertime").html()
                                
                        ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440,"sensor_value24H","spin24H",false,date)
                         current_date = $(".currenttime").html()
                        ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value1HM","",false,current_date);

                        ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value1H","spin12H",false,date).done(function(result){
                            if(result.status === 'SUCCESS'){
                                if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 30){
                                    $(".r"+result.station_sensor_id).trigger("click");
                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 15){
                                    $(".o"+result.station_sensor_id).trigger("click");
                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 7.5){
                                    $(".y"+result.station_sensor_id).trigger("click");
                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW > 0){
                                    $(".b"+result.station_sensor_id).trigger("click");
                                }else{
                                    $(".n"+result.station_sensor_id).trigger("click");
                                }
                            }
                        });

                        //@TODO
                        var new_date = date.substring(0, 7);
                        ___getRainyDays(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,"","sensor_value1M","spin1M",false,new_date);

                        var date = new Date();
                        date.setDate(date.getDate()-1);
                        var new_date = date.getFullYear()+"-"+ ('0' + (date.getMonth()+1)).slice(-2) + '-' +date.getDate();
                        ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440*3,"sensor_valuePD","spinPD",false,new_date)


                    });

                    map.fitBounds(bounds);


                    var control = document.getElementById('over');
                    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

                    $(".over").removeClass("hidden")
                    var listener = google.maps.event.addListener(map, "idle", function () {
                        google.maps.event.trigger(map, 'resize');
                        google.maps.event.removeListener(listener);
                         $(".loading-map").fadeOut();

                    });

                },1000);

              

            }

        }
    }


    var __attachPageWlMap2 = function(element) {
        ___debug("Water Level Monitoring Station Map")
        $(".loading").fadeIn();
        if(typeof element === "undefined"){
             element = "station_map";
        }

        if($("#"+element).children().length > 0){

        }else{

            var payload = {  } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    
                    var payload = { "SENSOR_ID" : "2" , "STATUS" : "1"} //<-- SENSOR_ID 1 for RAIN GAUGE
                    var station = [];
                    $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
                    var pointMarkerImage = new Array();//store image of marker in array
                    var pointMarker = [];//store marker in array

                        if(result.status === 'SUCCESS'){
                            for(i=0;i<result.payload.length;i++){
                                var STATION_ID = result.payload[i].STATION_ID;
                                var STATION_NAME = result.payload[i].STATION_NAME;
                                var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                                var SENSOR_ID = result.payload[i].SENSOR_ID;
                                var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                                var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                                var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                                var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                                var STATION_LON = result.payload[i].STATION_LONG;
                                var STATION_LAT = result.payload[i].STATION_LAT;
                                var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");

                                station.push({position:  new google.maps.LatLng(STATION_LAT, STATION_LON),
                                label: STATION_NAME, type : STATION_TYPE_NAME, payload: result.payload[i], position2: new google.maps.LatLng(parseFloat(STATION_LAT), parseFloat(STATION_LON)) })

                                var station_content = 
                                        "<tr style='cursor:pointer'  class='identify1"+STATION_SENSOR_ID+"'><td><input type='checkbox' class='cb"+STATION_SENSOR_ID+"'></td><td class='identify"+STATION_SENSOR_ID+"'>"+STATION_NAME+"</td>"+
                                        '<td class="text-center"><span id="sensor_value1H'+STATION_SENSOR_ID+'"></span><span class="g'+STATION_SENSOR_ID+'"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin12H'+STATION_SENSOR_ID+'"></i></span><span class="nd'+STATION_SENSOR_ID+'"></span><span class="u'+STATION_SENSOR_ID+'"></span><span class="o'+STATION_SENSOR_ID+'"></span><span class="d'+STATION_SENSOR_ID+'"></span><span class="nc'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center"><span id="sensor_valuedev'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_SENSOR_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value24H'+STATION_SENSOR_ID+'"></span></td>';


                                $(".station-populate").append(station_content);

                                date = $(".servertime").html()
                                
                                // ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H",false,date)
                                ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,10,"sensor_value1H","spin12H",false,date).done(function(result){
                                    //console.log(result);
                                    if(result.status === 'SUCCESS'){
                                        if (result.deviation != undefined){
                                                $("#sensor_valuedev"+result.station_sensor_id).html(result.deviation)
                                        }else{
                                            $(".nd"+result.station_sensor_id).trigger("click");
                                        }

                                        if(result.deviation > 0){
                                            $(".u"+result.station_sensor_id).trigger("click");
                                        }

                                        if(result.deviation < 0){
                                            $(".d"+result.station_sensor_id).trigger("click");
                                        }

                                        if(result.deviation == 0){
                                            $(".nc"+result.station_sensor_id).trigger("click");
                                        }
                                    }
                                });

                                
                            }

                            var interval = setInterval(function(){
                                for(i=0;i<result.payload.length;i++){
                                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                                    var SENSOR_ID = result.payload[i].SENSOR_ID;

                                    date = $(".servertime").html()
                                    /*___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin12H",false,date);*/
                                    
                                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,10,"sensor_value1H","",false,date).done(function(result){
                                        //console.log(result);
                                        if(result.status === 'SUCCESS'){
                                            if (result.deviation != undefined){
                                                    $("#sensor_valuedev"+result.station_sensor_id).html(result.deviation)
                                            }else{
                                                $(".nd"+result.station_sensor_id).trigger("click");
                                            }

                                            if(result.deviation > 0){
                                                $(".u"+result.station_sensor_id).trigger("click");
                                            }

                                            if(result.deviation < 0){
                                                $(".d"+result.station_sensor_id).trigger("click");
                                            }

                                            if(result.deviation == 0.00){
                                                $(".nc"+result.station_sensor_id).trigger("click");
                                            }


                                        }
                                    });

                                }
                            },5000);


                            

                            //console.log(station);
                            initMap(station,element,pointMarkerImage,pointMarker)
                        }
                    });
                }
            });
            //KMSJ13

            var interval = setInterval(function(){
                
                

                 var payload = {  } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".servertime").html(result.payload.date)
                    }
                });


            }, 30000);
            


           
            

            function initMap(station,element,pointMarkerImage,pointMarker) {
                function newPolyLine(path) {
                    var polyLine = new google.maps.Polygon({
                      paths: path,
                      strokeColor: 'black',
                      strokeOpacity: 0.9,
                      strokeWeight: 2,
                      fillColor: 'transparent',
                      fillOpacity: 0.05,
                      clickable: false
                    });
                    polyLine.setMap(map);
                    return polyLine;
                  };

                
                var map = new google.maps.Map(document.getElementById(element), {
                    mapTypeId: 'roadmap',
                    disableDefaultUI: true,
                    zoomControl: true,
                    scaleControl: true,
                    rotateControl: true,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        
                    },

                    //mapTypeId : google.maps.MapTypeId.ROADMAP
                });
                
                setTimeout(function () {


                    map.data.loadGeoJson('assets/geojson/River.geojson');
        
                    map.data.loadGeoJson('assets/geojson/Basins.geojson');

                    map.data.loadGeoJson('assets/geojson/IponanSteam.geojson');
                    map.data.loadGeoJson('assets/geojson/Iponan.geojson');

                    map.data.setStyle(function(feature) {
                        var selected = feature.getGeometry().getType()
                        console.log(selected)
                        if(selected =='MultiLineString'){
                          return {
                            strokeColor: "#009bff",
                            strokeWeight: 1,
                            strokeOpacity: 1,
                          }  
                        }

                        if(selected == 'MultiPolygon'){
                          return{
                            fillColor: "Blue",
                            strokeWeight: 2,
                            fillOpacity:0
                          }
                        }
                    })

                    var bounds = new google.maps.LatLngBounds();
                    infowindow = []
                    //var infowindow = new google.maps.InfoWindow()
                    var location = document.location.href.substring(0, document.location.href.lastIndexOf("/") + 1);
                    //var icons = location+"/assets/img/map-marker.png";
                    var icons = {
                      url :  location+"/assets/img/map/wl-orange.png",
                    
                    }
                   
                    // Create markers.
                    i = 0;
                    pointMarker = []
                    station.forEach(function(feature) {
                        id = feature.payload.STATION_SENSOR_ID
                        pointMarkerImage[i] = icons
                        infowindow[feature.payload.STATION_SENSOR_ID] =  new google.maps.InfoWindow()

                        bounds.extend(feature.position2);
                        /*var marker = new google.maps.Marker({
                            position: feature.position,
                            icon : icons,
                            map: map,
                            content : ''
                            
                        });*/

                        pointMarker[id] = new google.maps.Marker({
                            position: feature.position,
                            icon : icons,
                            map: map,
                            content : ''
                            
                        });

                        //pointMarker[id].infowindow = new google.maps.InfoWindow()

                        

                        var marker = pointMarker[feature.payload.STATION_SENSOR_ID]

                        
                       

                      
                        $(".identify1"+feature.payload.STATION_SENSOR_ID).on("mouseover",function(){
                            if ($(this).hasClass("b")){
                            }else{

                                var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                                var d2 = $('#sensor_valuedev'+feature.payload.STATION_SENSOR_ID).html();
                                
                                //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                        '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                        '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
            
                                                               
                                pointMarker[id].infowindow = new google.maps.InfoWindow({
                                  content: contentString
                                });
                                pointMarker[id].infowindow.setZIndex(99);
                                pointMarker[id].infowindow.open(map, marker);
                            }

                        })
                        
                        $(".cb"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            
                            if($(this).is(":checked")){
                                
                                // infowindow[i].close(map, marker);
                                var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                                var d2 = $('#sensor_valuedev'+feature.payload.STATION_SENSOR_ID).html();
                                
                                //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                        '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                        /*'<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr>'+
                                                        '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr></table>'*/
                                                        '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
            
                                                               
                                /*pointMarker[feature.payload.STATION_SENSOR_ID].infowindow = new google.maps.InfoWindow({
                                    content: contentString
                                });*/
                                

                                infowindow[feature.payload.STATION_SENSOR_ID].setContent(contentString);
                                infowindow[feature.payload.STATION_SENSOR_ID].open(map, marker);

                            }else{
                                console.log("B")
                               
                                
                                infowindow[feature.payload.STATION_SENSOR_ID].close()
                            }   
                                
                            
                            
                        })

                      

                        $(".identify1"+feature.payload.STATION_SENSOR_ID).on("mouseout",function(){
                                pointMarker[id].infowindow.close();  
                                 console.log( feature.payload.STATION_SENSOR_ID);
                        });


                        $(".nc"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-gray.png",
                            marker.setIcon(url)
                        })


                        $(".d"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-green.png",
                            marker.setIcon(url)
                        })

                        $(".u"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-red.png",
                            marker.setIcon(url)
                        })

                        $(".nd"+feature.payload.STATION_SENSOR_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-orange.png",
                            marker.setIcon(url)
                        })


                        
                        marker.addListener('mouseover', function() {
                            var d1 = $('#sensor_value1H'+feature.payload.STATION_SENSOR_ID).html();
                            var d2 = $('#sensor_valuedev'+feature.payload.STATION_SENSOR_ID).html();
                            //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                            contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></td></tr></table>'
                                                    '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
        
                                                           
                            infowindow[i] = new google.maps.InfoWindow({
                              content: contentString
                            });
                            

                            //url :  location+"/assets/img/map/wi-rain-blue.png",
                            //marker.setIcon(url)
                            
                            infowindow[i].open(map, marker);
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value_1H","spin1H",false, $(".servertime").html());
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440,"sensor_value_24H","spin24H",false, $(".servertime").html());

                        });

                        marker.addListener('click', function() {
                            console.log("CLICKED")
                            // contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                            // infowindow = new google.maps.InfoWindow({
                            //   content: contentString,
                            //   maxWidth : 75
                            // });
                            //infowindow.open(map, marker);
                            //___getLatestReadingNew(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value_1H","spin1H",false);
                            //___getLatestReadingNew(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440,"sensor_value_24H","spin24H",false);
                            //alert(feature.payload.STATION_SENSOR_ID)
                        });

                        marker.addListener('mouseout', function() {
                            console.log("OUT")
                            infowindow[i].close();
                        });
                       

                        i++;
                    });
                    //map.setCenter(bounds.getCenter())
                    map.fitBounds(bounds);
                    map.panToBounds(bounds);

                    var control = document.getElementById('over');
                    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

                    $(".over").removeClass("hidden")
                    var listener = google.maps.event.addListener(map, "idle", function () {
                        //google.maps.event.trigger(map, 'resize');
                        google.maps.event.removeListener(listener);
                         $(".loading-map").fadeOut();

                    });

                },1000);

              

            }

        }
    }


    var __attachPageStationMap = function(element,health_show) {
        ___debug("Water Level Monitoring Station Map")
        $(".loading").fadeIn();
        if(typeof element === "undefined"){
             element = "station_map";
        }

        if($("#"+element).children().length > 0){

        }else{

            var payload = {  } 
            $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                if(result.status === 'SUCCESS'){
                    $(".servertime").html(result.payload.date)
                    
                    var payload = { "STATUS" : "1" } //<-- SENSOR_ID 1 for RAIN GAUGE
                    var station = [];
                    $.wms.executeExternalPost('/wms/wsv1/api/getAllStationList',JSON.stringify(payload)).done(function (result) {
                    var pointMarkerImage = new Array();//store image of marker in array
                    var pointMarker = [];//store marker in array

                        if(result.status === 'SUCCESS'){
                            for(i=0;i<result.payload.length;i++){

                                var STATION_ID = result.payload[i].STATION_ID;
                                var STATION_NAME = result.payload[i].STATION_NAME;
                                var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                                var SENSOR_ID = 0;
                                var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                                var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                                var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                                var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                                var STATION_LON = result.payload[i].STATION_LONG;
                                var STATION_LAT = result.payload[i].STATION_LAT;
                                var RX_STATION_LON = result.payload[i].RX_STATION_LON;
                                var RX_STATION_LAT = result.payload[i].RX_STATION_LAT;
                                var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");
                                var type = result.payload[i].STATION_TYPE_ID                                        
                                var station_content = ""
                               
                                //if(RX_STATION_LAT != undefined && RX_STATION_LON)
                                station.push({position:  new google.maps.LatLng(STATION_LAT, STATION_LON),
                                label: STATION_NAME, type : STATION_TYPE_NAME, payload: result.payload[i], position2: new google.maps.LatLng(parseFloat(STATION_LAT), parseFloat(STATION_LON)), positionRX: new google.maps.LatLng(RX_STATION_LAT,RX_STATION_LON) })
                                date = $(".servertime").html()
                                
                                    if(type == 1){
                                        //RPT
                                        
                                    }

                                    if(type == 2 || type == 3 || type == 11 ){
                                        //ARG
                                        SENSOR_ID = 1
                                        station_content = 
                                        "<tr style='cursor:pointer'  class='identify1"+STATION_ID+"' id='identify1"+STATION_ID+"'>"+
                                        "<td><input type='checkbox' class='flatcb cb"+STATION_ID+"'></td>"+
                                        "<td>"+STATION_NAME+"</td>"+
                                        '<td class="text-center"><span id="sensor_value1H'+SENSOR_ID+"_"+STATION_ID+'"></span><span class="g'+STATION_ID+'"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1H'+STATION_ID+'"></i></span>'+
                                        
                                        '<span class="nr'+STATION_ID+'"></span>'+
                                        '<span class="b'+STATION_ID+'"></span>'+
                                        '<span class="y'+STATION_ID+'"></span>'+
                                        '<span class="o'+STATION_ID+'"></span>'+
                                        '<span class="r'+STATION_ID+'"></span></td>'+
                                        

                                        '<td class="text-center"><span id="sensor_valuedev'+SENSOR_ID+"_"+STATION_ID+'">-</span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value24H'+STATION_ID+'"></span></td>';
                                        '<td class="text-center hidden"><span id="sensor_valuePD'+STATION_ID+'"></span></td>';
                                        '<td class="text-center hidden"><span id="sensor_value1M'+STATION_ID+'"></span></td>';
                                        //console.log(health_show)
                                        if(health_show == true){
                                            station_content  += '<td class="text-center "><span id="sensor_battery'+STATION_ID+'">-</span></td>'+
                                                                '<td class="text-center "><span id="sensor_temperature'+STATION_ID+'">-</span></td>';
                                        }

                                        $(".station-populate-arg").append(station_content);
                                        
                                    }

                                    if(type == 5 || type == 6 | type == 11){
                                        //WLG
                                        SENSOR_ID =  2
                                        station_content = 
                                        "<tr style='cursor:pointer'  class='identify1"+STATION_ID+"' id='identify1"+STATION_ID+"'><td><input type='checkbox' class='flatcb cb"+STATION_ID+"'></td><td>"+STATION_NAME+"</td>"+
                                        '<td class="text-center"><span id="sensor_value1H'+SENSOR_ID+"_"+STATION_ID+'"></span><span class="g'+STATION_ID+'"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin1H'+STATION_ID+'"></i></span>'+

                                        '<span class="nd'+STATION_ID+'"></span>'+
                                        '<span class="u'+STATION_ID+'"></span>'+
                                        '<span class="d'+STATION_ID+'"></span>'+
                                        '<span class="nc'+STATION_ID+'"></span></td>'+
                                        
                                        
                                        '<td class="text-center"><span id="sensor_valuedev'+SENSOR_ID+"_"+STATION_ID+'">-</span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value1H'+STATION_ID+'"></span></td>'+
                                        '<td class="text-center hidden"><span id="sensor_value24H'+STATION_ID+'"></span></td>';

                                        if(health_show == true){
                                            station_content  += '<td class="text-center "><span id="sensor_battery'+STATION_ID+'">-</span></td>'+
                                                                '<td class="text-center "><span id="sensor_temperature'+STATION_ID+'">-</span></td>';
                                        }


                                        $(".station-populate-wl").append(station_content);

                                        

                                    }

                                    if(type == 7 || type == 8){
                                        //AWS
                                        $(".station-populate-aws").append(station_content);
                                    }

                                    if(type == 9){
                                        //PAGASA
                                    }    
                                    
                                    if(type == 10){
                                        //DDRM
                                        
                                    }


                                
                            }

                            //12-06-2018

                            var interval = setInterval(function(){
                                for(i=0;i<result.payload.length;i++){
                                    var STATION_ID = result.payload[i].STATION_ID;
                                    var SENSOR_ID = 0;

                                    date = $(".servertime").html()
                                    type = result.payload[i].STATION_TYPE_ID                                        
                                
                                    ___getLatestReadingByStationID(STATION_ID,6,10,"sensor_battery","spin1H",false,date);
                                    ___getLatestReadingByStationID(STATION_ID,5,10,"sensor_temperature","spin1H",false,date);
                                    if(type == 2 || type == 3 || type == 11 ){
                                        
                                        SENSOR_ID = 1;
                                        ___getLatestReadingByStationID(STATION_ID,1,60,"sensor_value1H"+SENSOR_ID+"_","spin1H",false,date).done(function(result){
                                            if(result.status == 'SUCCESS'){
                                                if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 30){
                                                    $(".r"+result.station_id).trigger("click");
                                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 15){
                                                    $(".o"+result.station_id).trigger("click");
                                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 7.5){
                                                    $(".y"+result.station_id).trigger("click");
                                                }else if(result.payload.SENSOR_DATA_INPUT_0_RAW > 0){
                                                    $(".b"+result.station_id).trigger("click");
                                                }else{
                                                    $(".n"+result.station_id).trigger("click");
                                                }
                                            }else{
                                                $(".nd"+result.station_id).trigger("click");
                                            }
                                        });
                                        ___getLatestReadingByStationID(STATION_ID,1,1440,"sensor_valuedev"+SENSOR_ID+"_","spin1H",false,date);


                                        //var new_date = date.substring(0, 7);
                                        //___getRainyDaysByStationID(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,"","sensor_value1M","spin1M",false,new_date);

                                        var date = new Date();
                                        //date.setDate(date.getDate()-1);
                                        //var new_date = date.getFullYear()+"-"+ ('0' + (date.getMonth()+1)).slice(-2) + '-' +date.getDate();
                                        //___getLatestReadingByStationID(STATION_ID,feature.payload.SENSOR_ID,1440,"sensor_valuePD","spinPD",false,new_date)
                                        //@TODO
                                    }

                                    if(type == 5 || type == 6 | type == 11){
                                        SENSOR_ID = 2;
                                        ___getLatestReadingByStationID(STATION_ID,2,30,"sensor_value1H"+SENSOR_ID+"_","spin1H",false,date).done(function(result){
                                            if (result.status === 'SUCCESS'){
                                                if (result.deviation != undefined){
                                                    var dev = result.deviation;
                                                    if (result.deviation > 0.00){
                                                        dev = "+"+result.deviation;
                                                    }
                                                    $("#sensor_valuedev"+SENSOR_ID+"_"+result.station_id).html(dev)

                                                    if(result.deviation != undefined){

                                                    }else{
                                                        $(".nd"+result.station_id).trigger("click");
                                                    }

                                                    if(result.deviation > 0){
                                                        $(".u"+result.station_id).trigger("click");
                                                    }

                                                    if(result.deviation < 0){
                                                        $(".d"+result.station_id).trigger("click");
                                                    }

                                                    if(result.deviation == 0.00){
                                                        $(".nc"+result.station_id).trigger("click");
                                                    }


                                                };
                                            }else{
                                                $(".nd"+result.station_id).trigger("click");
                                            }
                                            
                                        
                                        })
                                    }


                                   
                                    
                                }
                            },30000);
                            //console.log(station);
                            initMap(station,element,pointMarkerImage,pointMarker)
                        }
                    });
                }
            });
            //KMSJ13

            var interval = setInterval(function(){
                
                

                var payload = {  } 
                $.wms.executeExternalPost('/wms/wsv1/api/getDatetime',JSON.stringify(payload)).done(function (result) {
                    if(result.status === 'SUCCESS'){
                        //console.log(result.payload.date);
                        $(".servertime").html(result.payload.date)
                    }
                });


            }, 10000);
            


           
            

            function initMap(station,element,pointMarkerImage,pointMarker) {
                


                function newPolyLine2(path) {
                    var polyLine = new google.maps.Polygon({
                      paths: path,
                      strokeColor: 'red',
                      strokeOpacity: 0.9,
                      strokeWeight: 1,
                      /*fillColor: 'transparent',
                      fillOpacity: 0.05,*/
                      clickable: false
                    });

                    $(".cb_shownetwork").on("click",function(){
                        if ($(this).is(":checked")) {
                            polyLine.setMap(map);
                        }else{
                            polyLine.setMap(null);
                        }
                    })
                };

                

             
                
                var map = new google.maps.Map(document.getElementById(element), {
                    mapTypeId: 'roadmap',
                    disableDefaultUI: true,
                    zoomControl: true,
                    /*zoomControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_RIGHT
                    },*/
                    fullscreenControl : true,
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.BOTTOM_LEFT
                    },
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        
                    },
                    scaleControl: true,
                    rotateControl: true,

                    //mapTypeId : google.maps.MapTypeId.ROADMAP
                });
                
                setTimeout(function () {

                    //show Network Map
                    //multipolyX = newPolyLine2(pathx);


                    var bounds = new google.maps.LatLngBounds();
                    infowindow = []
                    //var infowindow = new google.maps.InfoWindow()
                    var location = document.location.href.substring(0, document.location.href.lastIndexOf("/") + 1);
                    //var icons = location+"/assets/img/map-marker.png";
                    var iconARG = {
                      url :  location+"/assets/img/map/wi-rain-gray.png",
                    
                    }

                    var iconWLG = {
                      url :  location+"/assets/img/map/wl-orange.png",
                    
                    }

                    var iconAWS = {
                      url :  location+"/assets/img/map/aws.png",
                        size: new google.maps.Size(20, 20),
                        scaledSize: new google.maps.Size(20, 20), // size
                    }

                    var iconRPT = {
                      url :  location+"/assets/img/map/repeater.png",
                        size: new google.maps.Size(20, 20),
                        scaledSize: new google.maps.Size(20, 20), // size
                    }

                    var iconPAG = {
                      url :  location+"/assets/img/map/pagasa-icon.png",
                        size: new google.maps.Size(40, 40),
                        scaledSize: new google.maps.Size(40, 40), // size
                    }

                    var iconNDRRMC = {
                      url :  location+"/assets/img/map/ndrrmc.png",
                        size: new google.maps.Size(30, 30),
                        scaledSize: new google.maps.Size(30, 30), // size
                    }
                   
                    // Create markers.
                    i = 0;
                    pointMarker = []
                    station.forEach(function(feature) {

                        //console.log(feature)


                        var pathx = [ {lat : parseFloat(feature.payload.STATION_LAT), lng: parseFloat(feature.payload.STATION_LONG) },
                                       {lat : parseFloat(feature.payload.RX_STATION_LAT), lng: parseFloat(feature.payload.RX_STATION_LONG) }]

                        newPolyLine2(pathx);
                       
                       



                        id = feature.payload.STATION_ID
                        type = feature.payload.STATION_TYPE_ID
                        sensor = 0;
                        if(type == 1){
                            //RPT
                            pointMarkerImage[i] = iconRPT
                        }else if(type == 2 || type == 3){
                            //ARG
                            sensor=1;
                            pointMarkerImage[i] = iconARG
                        }else if(type == 5 || type == 6){
                            //WLG
                            sensor=2;
                            pointMarkerImage[i] = iconWLG
                        }else if(type == 7 || type == 8){
                            //AWS
                            pointMarkerImage[i] = iconAWS
                        }else if(type == 9){
                            //PAGASA
                            pointMarkerImage[i] = iconPAG
                        }else if(type == 10){
                            //PAGASA
                            pointMarkerImage[i] = iconNDRRMC
                        }else if(type == 11){
                            //ARG/WLG
                            pointMarkerImage[i] = iconARG
                        }



                        //pointMarkerImage[i] = icons

                        infowindow[feature.payload.STATION_ID] =  new google.maps.InfoWindow()

                        bounds.extend(feature.position2);
                        /*var marker = new google.maps.Marker({
                            position: feature.position,
                            icon : icons,
                            map: map,
                            content : ''
                            
                        });*/

                        pointMarker[id] = new google.maps.Marker({
                            position: feature.position,
                            icon : pointMarkerImage[i],
                            map: map,
                            content : ''
                            
                        });

                        //pointMarker[id].infowindow = new google.maps.InfoWindow()

                        

                        var marker = pointMarker[feature.payload.STATION_ID]
                        

                        $(".nc"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-gray.png",
                            marker.setIcon(url)
                        })


                        $(".d"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-green.png",
                            marker.setIcon(url)
                        })

                        $(".u"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-red.png",
                            marker.setIcon(url)
                        })

                        $(".nd"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wl-orange.png",
                            marker.setIcon(url)
                        })


                        $(".nr"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-gray.png",
                            marker.setIcon(url)
                        })


                        $(".b"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-blue.gif",
                            marker.setIcon(url)
                        })

                        $(".r"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-red.gif",
                            marker.setIcon(url)
                        })

                        $(".y"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-yellow.gif",
                            marker.setIcon(url)
                        })

                        $(".o"+feature.payload.STATION_ID).on("click",function(){
                            url =  location+"/assets/img/map/wi-rain-orange.gif",
                            marker.setIcon(url)
                        })
                        
                        var selector = document.getElementById(".identify1"+feature.payload.STATION_ID);

                        //google.maps.event.addListener(selector, 'mouseover', function() {
                        $(".identify1"+feature.payload.STATION_ID).on("mouseover",function(){
                            //console.log(feature.payload.STATION_ID)\

                            type = feature.payload.STATION_TYPE_ID
                            if(type == 2 || type == 3){
                                //ARG
                                sensor=1;
                                
                                var d1 = $('#sensor_value1H'+sensor+"_"+feature.payload.STATION_ID).html();
                                var d2 = $('#sensor_valuedev'+sensor+"_"+feature.payload.STATION_ID).html();
                                
                                //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
            
                              

                            
                            }
                            if(type == 5 || type == 6){
                                //WLG
                                sensor=2;
                                var d1 = $('#sensor_value1H'+sensor+"_"+feature.payload.STATION_ID).html();
                                var d2 = $('#sensor_valuedev'+sensor+"_"+feature.payload.STATION_ID).html();
                                
                                contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
            
                         
                                
                            }

                            if(type == 11){
                                var d11 = $('#sensor_value1H1'+"_"+feature.payload.STATION_ID).html();
                                var d12 = $('#sensor_valuedev1'+"_"+feature.payload.STATION_ID).html();
                                var d21 = $('#sensor_value1H2'+"_"+feature.payload.STATION_ID).html();
                                var d22 = $('#sensor_valuedev2'+"_"+feature.payload.STATION_ID).html();

                                var contentString ='<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">'+d11+'</span></td></tr>'+
                                                '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">'+d12+'</span></td></tr>'+
                                                '<tr class="bold"><td>Current [ELm]</td><td><span>'+d21+'</span></td></tr>'+
                                                '<tr class="bold"><td>Deviation</td><td><span>'+d22+'</span></td></tr></table>'
                            }

                                
                            //feature if PAN is ON
                            //map.panTo(marker.getPosition());   

                            pointMarker[id].infowindow = new google.maps.InfoWindow({
                              content: contentString
                            });
                            pointMarker[id].infowindow.setZIndex(99);
                            pointMarker[id].infowindow.open(map, marker);
                            
                           
                          
                            

                        })
                        
                        $(".cb"+feature.payload.STATION_ID).on("click",function(){
                            
                            if($(this).is(":checked")){

                                type = feature.payload.STATION_TYPE_ID
                                if(type == 2 || type == 3){
                                    //ARG
                                    sensor=1;
                                    
                                    var d1 = $('#sensor_value1H'+sensor+"_"+feature.payload.STATION_ID).html();
                                    var d2 = $('#sensor_valuedev'+sensor+"_"+feature.payload.STATION_ID).html();
                                    
                                    //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                                    contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                    '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
                                               
                                }
                                if(type == 5 || type == 6){
                                    //WLG
                                    sensor=2;
                                    var d1 = $('#sensor_value1H'+sensor+"_"+feature.payload.STATION_ID).html();
                                    var d2 = $('#sensor_valuedev'+sensor+"_"+feature.payload.STATION_ID).html();
                                    
                                    contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                    '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'
                
                             
                                }

                                if(type == 11){
                                    var d11 = $('#sensor_value1H1'+"_"+feature.payload.STATION_ID).html();
                                    var d12 = $('#sensor_valuedev1'+"_"+feature.payload.STATION_ID).html();
                                    var d21 = $('#sensor_value1H2'+"_"+feature.payload.STATION_ID).html();
                                    var d22 = $('#sensor_valuedev2'+"_"+feature.payload.STATION_ID).html();

                                    var contentString ='<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                    '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+
                                                    '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">'+d11+'</span></td></tr>'+
                                                    '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">'+d12+'</span></td></tr>'+
                                                    '<tr class="bold"><td>Current [ELm]</td><td><span>'+d21+'</span></td></tr>'+
                                                    '<tr class="bold"><td>Deviation</td><td><span>'+d22+'</span></td></tr></table>'
                                }

                                infowindow[feature.payload.STATION_ID].setContent(contentString);
                                infowindow[feature.payload.STATION_ID].open(map, marker);


                            }else{
                                console.log("B")
                               
                                
                                infowindow[feature.payload.STATION_ID].close()
                            }   
                                
                            
                            
                        })

                      

                        $(".identify1"+feature.payload.STATION_ID).on("mouseout",function(){
                                pointMarker[id].infowindow.close();  
                               
                        });


                        

                        

                        google.maps.event.addListener(marker, 'mouseover', function() {
                            type = feature.payload.STATION_TYPE_ID
                            if(type == 2 || type == 3){
                                //ARG
                                sensor=1;
                            }
                            if(type == 5 || type == 6){
                                //WLG
                                sensor=2;
                            }

                            
                            console.log("TRIG")
                            var d1 = $('#sensor_value1H'+sensor+"_"+feature.payload.STATION_ID).html();
                            var d2 = $('#sensor_valuedev'+sensor+"_"+feature.payload.STATION_ID).html();
                            var addedContent = ""
                           
                            if(type == 1){
                                //RPT
                            }else if(type == 2 || type == 3){
                                //ARG
                                var addedContent ='<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">'+d1+'</span></td></tr>'+
                                                '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">'+d2+'</span></td></tr>'
                            }else if(type == 5 || type == 6){
                                //WLG
                                var addedContent = '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr>'
                            }else if(type == 7 || type == 8){
                                var addedContent ='<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">-</span></td></tr>'+
                                                '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">-</span></td></tr>'
                            }else if(type == 9){
                                //PAGASA
                            }else if(type == 11){
                                //ARG & WLG

                                var d11 = $('#sensor_value1H1'+"_"+feature.payload.STATION_ID).html();
                                var d12 = $('#sensor_valuedev1'+"_"+feature.payload.STATION_ID).html();
                                var d21 = $('#sensor_value1H2'+"_"+feature.payload.STATION_ID).html();
                                var d22 = $('#sensor_valuedev2'+"_"+feature.payload.STATION_ID).html();

                                var addedContent ='<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">'+d11+'</span></td></tr>'+
                                                '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">'+d12+'</span></td></tr>'+
                                                '<tr class="bold"><td>Current [ELm]</td><td><span>'+d21+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d22+'</span></td></tr>'
                            }

                            //contentString = '<div class="font_12"><b class="font_12">'+feature.label+'</b><br/>Hourly: <span id="sensor_value_1H'+feature.payload.STATION_SENSOR_ID+'">-</span> <br/>Daily: <span id="sensor_value_24H'+feature.payload.STATION_SENSOR_ID+'">-</span></div>';
                            contentString = '<table class="table table-condensed table-bordered" style="font-family:Quicksand, "Helvetica Neue";font-size:18px;width:100%;padding:0px">'+
                                                '<tr style="background:#009bff;color:#fff;font-weight:bolder">'+
                                                    '<td colspan="2" style="font-size:20px;font-family:Quicksand, "Helvetica Neue";">'+feature.label+'</td></tr>'+addedContent
                                                    // '<tr class="bold"><td >Rain Fall [mm] 1 Hour</td><td><span id="sensor_value_1H'+feature.payload.STATION_ID+'">-</span></td></tr>'+
                                                    // '<tr class="bold"><td >Rain Fall [mm] 24 Hour Daily Sum</td><td><span id="sensor_value_24H'+feature.payload.STATION_ID+'">-</span></td></tr></table>'
                                                   /* '<tr class="bold"><td>Current [ELm]</td><td><span>'+d1+'</span></td></tr>'+
                                                        '<tr class="bold"><td>Deviation</td><td><span>'+d2+'</span></td></tr></table>'*/
        
                                                           
                            infowindow[i] = new google.maps.InfoWindow({
                              content: contentString
                            });
                            

                            //url :  location+"/assets/img/map/wi-rain-blue.png",
                            //marker.setIcon(url)
                            
                            infowindow[i].open(map, marker);
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,60,"sensor_value_1H","spin1H",false, $(".servertime").html());
                            // ___getLatestReading(feature.payload.STATION_SENSOR_ID,feature.payload.SENSOR_ID,1440,"sensor_value_24H","spin24H",false, $(".servertime").html());

                        });
                            

                        google.maps.event.addListener(marker, 'click', function() {
                             //map.setCenter(marker.getPosition());   
                        });


                        //when the map zoom changes, resize the icon based on the zoom level so the marker covers the same geographic area
                        google.maps.event.addListener(map, 'zoom_changed', function() {

                            var pixelSizeAtZoom0 = 8; //the size of the icon at zoom level 0
                            var maxPixelSize = 15   ; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels

                            var zoom = map.getZoom();
                            console.log(zoom);
                            var relativePixelSize = Math.round(pixelSizeAtZoom0*Math.pow(2,zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in

                           

                            if(zoom <= 6){
                                maxPixelSize = 5;
                            }

                            if(zoom == 7){
                                maxPixelSize = 10;
                            }

                            if(zoom == 8){
                                maxPixelSize = 15;
                            }

                            if(zoom == 9){
                                maxPixelSize = 17.5;
                            }

                            if(zoom >= 10){
                                maxPixelSize = 20;
                            }
                            console.log(maxPixelSize)
                            //change the size of the icon
                            marker.setIcon(
                                new google.maps.MarkerImage(
                                    marker.getIcon().url, //marker's same icon graphic
                                    null,//size
                                    null,//origin
                                    null, //anchor
                                    new google.maps.Size(maxPixelSize, maxPixelSize) //changes the scale
                                )
                            );        
                        });

                        marker.addListener('click', function() {
                            console.log("CLICKED")

                            
                        });

                        marker.addListener('mouseout', function() {
                            console.log("OUT")
                            infowindow[i].close();
                        });
                       

                        i++;


                        


                    });

                    map.data.loadGeoJson('assets/geojson/IponanSteam.geojson');
                    map.data.loadGeoJson('assets/geojson/Iponan.geojson');
                    map.data.loadGeoJson('assets/geojson/River.geojson');
        
                    map.data.loadGeoJson('assets/geojson/Basins.geojson');

                    var showRiver = false;
                    var showBoundary = false;

                    function toggleOptions(){
                        console.log("TOGGLE")

                        showRiver = $(".cb_showriverbasin").is(':checked')
                        showBoundary = $(".cb_showriverboundary").is(':checked')


                        map.data.setStyle(function(feature) {

                            var selected = feature.getGeometry().getType()
                            //console.log(selected)
                            if(selected =='MultiLineString'){
                                
                                if(showRiver){
                                   
                                    return {
                                        strokeColor: "#009bff",
                                        strokeWeight: 1,
                                        strokeOpacity: 1,
                                    }  
                                }else{
                                    
                                    return {
                                        strokeColor: "#009bff",
                                        strokeWeight: 1,
                                        strokeOpacity: 0,
                                    }  
                                }

                                
                            }
                            if(selected == 'MultiPolygon'){

                                if(showBoundary){
                                    return{
                                        fillColor: "Blue",
                                        strokeWeight: 2,
                                        strokeOpacity: 1,
                                        fillOpacity:0
                                    }
                                }else{
                                    return{
                                        fillColor: "Blue",
                                        strokeWeight: 2,
                                        strokeOpacity: 0,
                                        fillOpacity:0
                                    }
                                }
                              
                            }

                        })
                    }

                    $(".cb_showriverbasin").on("click",function(){
                        toggleOptions();
                    })

                    $(".cb_showriverboundary").on("click",function(){
                        toggleOptions();
                    })
                    


                    map.data.setStyle(function(feature) {
                        var selected = feature.getGeometry().getType()
                        //console.log(selected)
                        if(selected =='MultiLineString'){
                            return {
                                strokeColor: "#009bff",
                                strokeWeight: 1,
                                strokeOpacity: 1,
                            }  
                        }

                        if(selected == 'MultiPolygon'){
                          return{
                            fillColor: "Blue",
                            strokeWeight: 2,
                            fillOpacity:0
                          }
                        }
                    })

                    //map.setCenter(bounds.getCenter())
                    map.fitBounds(bounds);
                    map.panToBounds(bounds);





                   
                    
                    

                    var control = document.getElementById('over');
                    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

                    /*var control2 = document.getElementById('over2');
                    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(control2);*/

                    var control3 = document.getElementById('over3');
                    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(control3);

                    $(".over").removeClass("hidden")
                    $(".over2").removeClass("hidden")
                    
                    $(".over3").removeClass("hidden")
                    var listener = google.maps.event.addListener(map, "idle", function () {
                        //google.maps.event.trigger(map, 'resize');
                        google.maps.event.removeListener(listener);
                         $(".loading-map").fadeOut();

                    });


                    //console.log(station)

                    station.forEach(function(feature) {
                        STATION_ID = feature.payload.STATION_ID;
                        type = feature.payload.STATION_TYPE_ID;
                        ___getLatestReadingByStationID(STATION_ID,6,10,"sensor_battery","spin1H",false,date);
                        ___getLatestReadingByStationID(STATION_ID,5,10,"sensor_temperature","spin1H",false,date);

                        if(type == 2 || type == 3 || type == 11 ){
                            
                            SENSOR_ID = 1;
                            ___getLatestReadingByStationID(STATION_ID,1,60,"sensor_value1H"+SENSOR_ID+"_","spin1H",false,date).done(function(result){
                                if(result.status == 'SUCCESS'){
                                    if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 30){
                                        $(".r"+result.station_id).trigger("click");
                                    }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 15){
                                        $(".o"+result.station_id).trigger("click");
                                    }else if(result.payload.SENSOR_DATA_INPUT_0_RAW >= 7.5){
                                        $(".y"+result.station_id).trigger("click");
                                    }else if(result.payload.SENSOR_DATA_INPUT_0_RAW > 0){
                                        $(".b"+result.station_id).trigger("click");
                                    }else{
                                        $(".n"+result.station_id).trigger("click");
                                    }
                                }
                            });
                            ___getLatestReadingByStationID(STATION_ID,1,1440,"sensor_valuedev"+SENSOR_ID+"_","spin1H",false,date);
                            

                        }

                        if(type == 5 || type == 6 | type == 11){
                            SENSOR_ID = 2;
                            ___getLatestReadingByStationID(STATION_ID,2,30,"sensor_value1H"+SENSOR_ID+"_","spin1H",false,date).done(function(result){

                                if (result.deviation != undefined){
                                    var dev = result.deviation;
                                    if (result.deviation > 0.00){
                                        dev = "+"+result.deviation;
                                    }
                                    $("#sensor_valuedev"+SENSOR_ID+"_"+result.station_id).html(dev)

                                    if(result.deviation != undefined){

                                    }else{
                                        $(".nd"+result.station_id).trigger("click");
                                    }

                                    if(result.deviation > 0){
                                        $(".u"+result.station_id).trigger("click");
                                    }

                                    if(result.deviation < 0){
                                        $(".d"+result.station_id).trigger("click");
                                    }

                                    if(result.deviation == 0.00){
                                        $(".nc"+result.station_id).trigger("click");
                                    }


                                };
                            
                            })
                        }
                    });
                          

                },1000);

              

            }

        }
    }


    var __attachPageRainFallStation = function(element) {
        ___debug("Rain Fall Monitoring Station List")
        //$("#station_list").empty();
        //$(".loading").removeClass("hidden");
        

        if(typeof element === "undefined"){
             element = "station_list";
        }

        if($("#"+element).children().length > 0){

        }else{
            $(".loading").fadeIn();
            var payload = { "SENSOR_ID" : "1", "STATUS" : "1" } //<-- SENSOR_ID 1 for RAIN GAUGE
            $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
                ___debug(result)
                $(".loading").fadeOut("3000");
                if(result.status === 'SUCCESS'){
                    $("#"+element).empty();
                    for(i=0;i<result.payload.length;i++){
                        var STATION_ID = result.payload[i].STATION_ID;
                        var STATION_NAME = result.payload[i].STATION_NAME;
                        var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                        var SENSOR_ID = result.payload[i].SENSOR_ID;
                        var SENSOR_NAME = result.payload[i].SENSOR_NAME;
                        var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;
                        var STATION_DESC = (result.payload[i].STATION_DESC == null ? "N/A" : result.payload[i].STATION_DESC);
                        var STATION_ADDRESS = (result.payload[i].STATION_ADDRESS == null ? "N/A" : result.payload[i].STATION_ADDRESS) ;
                        var STATION_LON = result.payload[i].STATION_LONG;
                        var STATION_LAT = result.payload[i].STATION_LAT;
                        var STATUS = (result.payload[i].STATUS == '1' ? "ACTIVE" : "INACTIVE");



                        $("#"+element).append(
                            '<div class="col-md-6">'+
                                '<div class="panel panel-primary">'+
                                    '<div class="panel-heading"> '+
                                        '<h3><i class="fa fa-podcast"></i> '+STATION_NAME +
                                        '<span class="pull-right"><i class="fa fa-refresh hidden fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                                    '</div>'+
                                    '<div class="panel-body  sensor_height">'+
                                    '<div class="row">'+
                                        '<div class="col-md-12">'+
                                            '<h4>'+
                                                '<b>STATION DESC:</b> <br/>'+
                                                '<span class="st_desc">'+STATION_DESC+'</span>'+
                                            '</h4>'+
                                        '</div>'+
                                        '<div class="col-md-12">'+
                                            '<h4>'+
                                                '<b>STATION TYPE:</b> <br/>'+
                                                '<span class="st_type">'+STATION_TYPE_NAME+'</span>'+
                                            '</h4>'+
                                        '</div>'+
                                        '<div class="col-md-12">'+
                                            '<h4>'+
                                                '<b>STATION ADDRESS:</b> <br/>'+
                                                '<span class="st_addr">'+STATION_ADDRESS+'</span>'+
                                            '</h4>'+
                                        '</div>'+

                                        '<div class="col-md-6">'+
                                            '<h4>'+
                                                '<b>LATITUDE:</b> <br/>'+
                                                '<span class="st_lat">'+STATION_LAT+'</span>'+
                                            '</h4>'+
                                        '</div>'+
                                        '<div class="col-md-6">'+
                                            '<h4>'+
                                                '<b>LONGITUDE:</b> <br/>'+
                                                '<span class="st_lon">'+STATION_LON+'</span>'+
                                            '</h4>'+
                                        '</div>'+

                                        '<div class="col-md-12">'+
                                            '<h4>'+
                                                '<b>STATION SENSOR:</b> <br/>'+
                                                '<span class="st_sen">'+SENSOR_NAME+'</span>'+
                                            '</h4>'+
                                        '</div>'+

                                        '<div class="col-md-12">'+
                                            '<h4>'+
                                                '<b>STATION SENSOR STATUS:</b> <br/>'+
                                                '<span class="st_stat">'+STATUS+'</span>'+
                                            '</h4>'+
                                        '</div>'+

                                        '<div class="col-md-12 hidden">'+
                                            '<h4>'+
                                                '<b>ASSIGNED USERS:</b> <br/>'+
                                                '<span>--</span>'+
                                            '</h4>'+
                                        '</div>'+

                                    '</div>'+
                                '</div>'
                                   
                        );
                    }
                }

            });

        }
    }


    var __attachPageRainFallDashboard = function() {
        ___debug("Rain Fall Monitoring Dashboard")
        //$("#station_list").empty();
        //$(".loading").removeClass("hidden");
        $(".loading").fadeIn();
        var payload = { "SENSOR_ID" : "1" , "STATUS" : "1"} //<-- SENSOR_ID 1 for RAIN GAUGE
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            ___debug(result)

            //$(".loading").addClass("hidden");
            $(".loading").fadeOut("3000");

            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var count = $("span[id*='sp_rain_update"+STATION_SENSOR_ID+"']").length;

                    if(count == 0){
                        $("#station_list").append(
                        '<div class="col-md-4">'+
                            '<div class="panel panel-primary">'+
                                '<div class="panel-heading"> '+
                                    '<i class="fa fa-podcast"></i> '+ STATION_NAME +
                                    '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                                '</div>'+
                                '<div class="panel-body  sensor_height">'+
                                    '<div class="col-md-6 text-center" >'+
                                        '<span class="sensor_value text-default" id="sensor_value'+STATION_SENSOR_ID+'">-</span>'+
                                    '</div>'+
                                    '<div class="col-md-6 text-center" >'+
                                        '<span class=" text-default">'+
                                            '<b>Last 24 Hours</b>'+
                                            '<br/>'+
                                            '<i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_SENSOR_ID+'"></i>'+
                                            '<span class="sensor_value sensor_value24H'+STATION_SENSOR_ID+' text-success" id="sensor_value24H'+STATION_SENSOR_ID+'"">-</span>'+
                                        '</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="panel-footer panel-primary text-center panel-custom"><small>Data as of: <span id="sensor_value_date'+STATION_SENSOR_ID+'"></span></small></div>'
                        );
                    }

                    var selected_date = $(".selected-date").val();
                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = null;
                    if(selected_date != today_format){
                        date = selected_date;
                    }

                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID);
                    ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H");
                }
            }
        });


        //Event for View
        $("#selView").unbind("change").on("change",function(){
            var selected = $(this).val();
            ___debug("Selected :" + selected);
            if(selected == 'compact'){
                $("#station_list").removeClass("hidden");
                $("#station_list_tabular").addClass("hidden")
                __attachPageRainFallDashboard();
            }else{
                $("#station_list").addClass("hidden");
                $("#station_list_tabular").removeClass("hidden")
            }
        });

    }

    var __attachPageRainFallDashboardNew = function() {
        ___debug("Rain Fall Monitoring Dashboard New")
        //$("#station_list").empty();
        //$(".loading").removeClass("hidden");

        var today = new Date();
        $(".selected-date").html(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));
        $(".selected-date").val(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2));

        var d = new Date(),
              h = (d.getHours()<10?'0':'') + d.getHours(),
              m = (d.getMinutes()<10?'0':'') + d.getMinutes();
        var timenow = h + ':' + m;
         $(".current-time").val(timenow);

        $(".loading-dashboard").fadeIn();
        var payload = { "SENSOR_ID" : "1" , "STATUS" : "1"} //<-- SENSOR_ID 1 for RAIN GAUGE
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationBySensorID',JSON.stringify(payload)).done(function (result) {
            ___debug(result)

            //$(".loading").addClass("hidden");
            $(".loading-dashboard").fadeOut("3000");

            if(result.status === 'SUCCESS'){
                for(i=0;i<result.payload.length;i++){
                    var STATION_ID = result.payload[i].STATION_ID;
                    var STATION_NAME = result.payload[i].STATION_NAME;
                    var STATION_SENSOR_ID = result.payload[i].STATION_SENSOR_ID;
                    var SENSOR_ID = result.payload[i].SENSOR_ID;
                    var count = $("span[id*='sensor_value1H"+STATION_SENSOR_ID+"']").length;

                    if(count == 0){
                        $("#station_list_tbody").append(
                        '<tr class="">'+
                            '<td class="font_24 b">'+STATION_NAME+'</td>'+
                            '<td class="font_16 b text-center"><span class="sensor_value sensor_value1H'+STATION_SENSOR_ID+' " id="sensor_value1H'+STATION_SENSOR_ID+'"">-</span></td>'+
                            '<td class="font_16 b text-center"><span class="sensor_value sensor_value24H'+STATION_SENSOR_ID+' " id="sensor_value24H'+STATION_SENSOR_ID+'"">-</span></td>'+
                        '</tr>');

                        // '<div class="col-md-4">'+
                        //     '<div class="panel panel-primary">'+
                        //         '<div class="panel-heading"> '+
                        //             '<i class="fa fa-podcast"></i> '+ STATION_NAME +
                        //             '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                        //         '</div>'+
                        //         '<div class="panel-body  sensor_height">'+
                        //             '<div class="col-md-6 text-center" >'+
                        //                 '<span class="sensor_value text-default" id="sensor_value'+STATION_SENSOR_ID+'">-</span>'+
                        //             '</div>'+
                        //             '<div class="col-md-6 text-center" >'+
                        //                 '<span class=" text-default">'+
                        //                     '<b>Last 24 Hours</b>'+
                        //                     '<br/>'+
                        //                     '<i class="fa fa-refresh fa-spin fa-1x fa-fw spin24H'+STATION_SENSOR_ID+'"></i>'+
                        //                     '<span class="sensor_value sensor_value24H'+STATION_SENSOR_ID+' text-success" id="sensor_value24H'+STATION_SENSOR_ID+'"">-</span>'+
                        //                 '</span>'+
                        //             '</div>'+
                        //         '</div>'+
                        //         '<div class="panel-footer panel-primary text-center panel-custom"><small>Data as of: <span id="sensor_value_date'+STATION_SENSOR_ID+'"></span></small></div>'
                        // );
                    }  

                    //var selected_date = $(".selected-date").val();
                    var selected_date = $("#dashboard-selected-date").val();

                    var today = new Date();
                    var today_format = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)
                    var date = null;
                    if(selected_date != today_format){
                        date = selected_date;
                    }

                    ___getLatestReadingNew(STATION_SENSOR_ID,SENSOR_ID,60,"sensor_value1H","spin1H",false);
                    ___getLatestReadingNew(STATION_SENSOR_ID,SENSOR_ID,1440,"sensor_value24H","spin24H",false,selected_date);
                }
            }
        });

    }

    var __attachPageStationMonitoring = function(element) {
        ___debug("Station Monitoring")

        ___debug("Load Station List")

        var payload = { }
        $.wms.executeExternalPost('/wms/wsv1/api/getAllStationList',JSON.stringify(payload)).done(function (result) {
            ___debug(result)
            
            for(i=0;i<result.payload.length;i++){
                var STATION_ID = result.payload[i].STATION_ID;
                var STATION_NAME = result.payload[i].STATION_NAME;
                var STATION_TYPE_NAME = result.payload[i].STATION_TYPE_NAME;

                $("#station_list").append(
                    '<div class="panel panel-primary">'+
                        '<div class="panel-heading"> <i class="fa fa-podcast"></i>  '+STATION_NAME+' <span class="pull-right">STATION TYPE: '+STATION_TYPE_NAME+'</span></div>'+
                        '<div class="panel-body station_sensors'+STATION_ID+'">'+
                        '</div>'
                );

                 ___debug("Station's Sensor List Event")
                var payload2 = { STATION_ID : STATION_ID }
                $.wms.executeExternalPost('/wms/wsv1/api/getAllStationSensorByStationID',JSON.stringify(payload2)).done(function (result2) {
                    ($.wms.debug() ? console.log(result2) : "" )
                    if(result2.status === 'SUCCESS'){
                        for(i=0;i<result2.payload.length;i++){
                            var STATION_ID = result2.payload[i].STATION_ID;
                            var SENSOR_ID = result2.payload[i].SENSOR_ID;
                            var STATION_SENSOR_ID = result2.payload[i].STATION_SENSOR_ID;
                            var SENSOR_NAME = result2.payload[i].SENSOR_NAME;
                            var SENSOR_ICON = ___getIconBySensor(SENSOR_ID);
                            $(".station_sensors"+STATION_ID).append(
                            '<div class="col-md-4">'+
                                '<div class="panel panel-primary">'+
                                    '<div class="panel-heading"> '+
                                        '<i class="fa '+SENSOR_ICON+'"></i>  '+SENSOR_NAME+
                                        '<span class="pull-right"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin'+STATION_SENSOR_ID+'"></i></span>'+
                                    '</div>'+
                                    '<div class="panel-body text-center sensor_height">'+
                                        '<span class="sensor_value text-default" id="sensor_value'+STATION_SENSOR_ID+'">-</span>'+
                                    '</div>'+
                                    '<div class="panel-footer panel-primary panel-custom"><small>Data as of: <span id="sensor_value_date'+STATION_SENSOR_ID+'">-</span></small></div>'+
                                '</div>'+
                            '</div>');

                            ___getLatestReading(STATION_SENSOR_ID,SENSOR_ID);
                        }
                    }
                });
            }
        });

    };

   

    // ################ COMMON METHODS ################# //
    
    var ___debug = function(msg){
        ($.wms.debug() ? console.log(msg) : "" )      
    }

    var ___getIconBySensor = function(sensor){
        var ret = "";
        switch(sensor){
            case '1' : case '2' : ret="fa-tint"; break;
            case '3' : case '4' : ret="fa-lock"; break;
            case '6' : ret="fa-bolt"; break;
            case '7' : ret="fa-fa-battery-three-quarters"; break;
        }
        return ret;
    }

    var ___attachRainUpdate = function(station_sensor_id,sensor_id){
        $(".rain_update"+station_sensor_id).unbind("change").on("change",function(){
            //console.log($(this).val());
            //console.log($(this).data('id'));
            //$("#sp_rain_update"+$(this).data('id')).remove();
            ___getLatestReading(station_sensor_id,sensor_id,$(this).val());
        });
    };

    var ___attachWLUpdate = function(station_sensor_id,sensor_id){
        $(".wl_update"+station_sensor_id).unbind("change").on("change",function(){
            //console.log($(this).val());
            //console.log($(this).data('id'));
            //$("#sp_wl_update"+$(this).data('id')).remove();
            ___getLatestReading(station_sensor_id,sensor_id,$(this).val());
        });
    };


    var ___getLatestReadingTable = function(station_sensor_id,sensor_id,interval,element,spin_element,show_unit,date){
        $.wms.executeExternalPost('/wms/wsv1/api/getLatestReading',JSON.stringify(payload)).done(function (result) {
            var payload = { SENSOR_ID : sensor_id, STATION_SENSOR_ID : station_sensor_id, INTERVAL : interval, DATE: date }
            ($.wms.debug() ? console.log(result) : "" )
            if(result.status === 'SUCCESS'){

            }
        });
    }

    var ___getLatestReading = function(station_sensor_id,sensor_id,interval,element,spin_element,show_unit,date){
        var def = $.Deferred();
        var payload = { SENSOR_ID : sensor_id, STATION_SENSOR_ID : station_sensor_id, INTERVAL : interval, DATE: date }
        //console.log(payload)
        if(sensor_id == '1'){
            interval = (interval > 0 ? interval : 10);
        }else{
            interval = (interval > 0 ? interval : 0);
        }
        $("#sensor_value"+station_sensor_id).html("-")
        if(typeof element !== 'undefined'){
            if(spin_element != ""){
                $("#"+element+station_sensor_id).html("-")
            }
        }

        if(typeof spin_element !== 'undefined'){
            $("."+spin_element+station_sensor_id).removeClass("hidden");
        }else{
            $(".spin"+station_sensor_id).removeClass("hidden");    
        }
        
        $.wms.executeExternalPost('/wms/wsv1/api/getLatestReading',JSON.stringify(payload)).done(function (result) {
            //($.wms.debug() ? console.log(result) : "" )
            if(result.status === 'SUCCESS'){
                
                var sensor_value0 = result.payload.SENSOR_DATA_INPUT_0_RAW;
                //If not RAIN
                if(sensor_id != 1){
                    var sensor_value1 = result.payload.SENSOR_DATA_INPUT_1_RAW;
                    var sensor_value2 = result.payload.SENSOR_DATA_INPUT_2_RAW;
                    var sensor_value3 = result.payload.SENSOR_DATA_INPUT_3_RAW;
                    var sensor_value4 = result.payload.SENSOR_DATA_INPUT_4_RAW;
                }
                var sensor_value_date = result.payload.LOGGED_DATE;

                var sensor_color = "";
                var sensor_value = ""
                //console.log(result.payload.SENSOR_DATA_INPUT_0_RAW);
                switch(sensor_id){

                    //RAIN GAUGE
                    case '1':
                        sensor_color = "text-success"
                        if(sensor_value0 == null){
                            sensor_value0 = "-"
                        }
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"mm";
                        }else if (show_unit == false){

                            sensor_value = sensor_value0;
                        }
                        var count = $("span[id*='sp_rain_update"+station_sensor_id+"']").length;
                        if(count == 0){
                         $("#sensor_value"+station_sensor_id).before('<span id="sp_rain_update'+station_sensor_id+'">Last '+
                                                                        '<select data-id="'+station_sensor_id+'" class="rain_update'+station_sensor_id+'">'+
                                                                            '<option value=10>10 Min</option>'+
                                                                            '<option value=30>30 Min</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }

                        if(typeof element === 'undefined'){
                            $(".rain_update"+station_sensor_id).val(interval);  
                        }
                        
                        ___attachRainUpdate(station_sensor_id,sensor_id);
                        break;

                    //WATER LEVEL
                    case '2':
                        sensor_color = "text-success"
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"m"; 
                        }else if (show_unit == false){
                            sensor_value = sensor_value0;
                        }
                        
                         var count = $("span[id*='sp_wl_update"+station_sensor_id+"']").length;
                        if(count == 0){
                        $("#sensor_value"+station_sensor_id).before('<span id="sp_wl_update'+station_sensor_id+'">Last '+
                                                                        '<select data-id="'+station_sensor_id+'" class="wl_update'+station_sensor_id+'">'+
                                                                            '<option value=0>Current</option>'+
                                                                            '<option value=30>30 Minutes</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }
                        $(".wl_update"+station_sensor_id).val(interval);
                        ___attachWLUpdate(station_sensor_id,sensor_id);
                        break;

                    //LOCK SENSORS
                    case '3' : case '4' :
                        sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                        sensor_value = (sensor_value0 == 1 ? "CLOSED" : "OPEN"); 
                        break;

                    //VOLTAGE SENSOR
                    case '6' :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+'V</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/
                        break;

                    case '5' :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+' &deg;C</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/

                        break;
                    default :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+'</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/
                                                break;
                }
                //console.log(element);
                if(typeof element === 'undefined'){
                    $("#sensor_value"+station_sensor_id).html(sensor_value)
                    $("#sensor_value"+station_sensor_id).addClass(sensor_color)
                    $("#sensor_value_date"+station_sensor_id).html(sensor_value_date)
                }else{
                    //console.log(sensor_value)
                    if(sensor_value != null){
                        $("#"+element+station_sensor_id).html(sensor_value)    
                        $("."+element+station_sensor_id).html(sensor_value)    
                    }else{
                        //$("#"+element+station_sensor_id).html(sensor_value)    
                    }
                    
                    $("#sensor_value_date"+station_sensor_id).html(sensor_value_date)
                }
                

            }

            //Hide Spinner
            //$(".spin"+station_sensor_id).addClass("hidden");
            if(typeof spin_element !== 'undefined'){
                //console.log(spin_element)
                $("."+spin_element+station_sensor_id).addClass("hidden");
            }else{
                $(".spin"+station_sensor_id).addClass("hidden");    
            }

            //var resolve = { payload : result, station_sensor_id : station_sensor_id } 
            result['station_sensor_id'] = station_sensor_id;
            def.resolve(result);
        });
        return def.promise();
    }


    var ___getRainyDays = function(station_sensor_id,sensor_id,interval,element,spin_element,show_unit,date){
        var def = $.Deferred();
        var payload = { SENSOR_ID : sensor_id, STATION_SENSOR_ID : station_sensor_id, INTERVAL : interval, DATE: date }
        //console.log(payload)
        if(sensor_id == '1'){
            interval = (interval > 0 ? interval : 10);
        }else{
            interval = (interval > 0 ? interval : 0);
        }
        $("#sensor_value"+station_sensor_id).html("-")
        if(typeof element !== 'undefined'){
            if(spin_element != ""){
                $("#"+element+station_sensor_id).html("-")
            }
        }

        if(typeof spin_element !== 'undefined'){
            $("."+spin_element+station_sensor_id).removeClass("hidden");
        }else{
            $(".spin"+station_sensor_id).removeClass("hidden");    
        }
        
        $.wms.executeExternalPost('/wms/wsv1/api/getRainyDays',JSON.stringify(payload)).done(function (result) {
            //($.wms.debug() ? console.log(result) : "" )
            if(result.status === 'SUCCESS'){
                
                var sensor_value0 = result.count;
                var sensor_color = "";
                var sensor_value = result.count;
                
                if(typeof element === 'undefined'){
                    $("#sensor_value"+station_sensor_id).html(sensor_value)
                    $("#sensor_value"+station_sensor_id).addClass(sensor_color)
                    
                }else{
                    if(sensor_value != null){
                        $("#"+element+station_sensor_id).html(sensor_value)    
                        $("."+element+station_sensor_id).html(sensor_value)    
                    }
                }
                

            }

            //Hide Spinner
            //$(".spin"+station_sensor_id).addClass("hidden");
            if(typeof spin_element !== 'undefined'){
                //console.log(spin_element)
                $("."+spin_element+station_sensor_id).addClass("hidden");
            }else{
                $(".spin"+station_sensor_id).addClass("hidden");    
            }

            //var resolve = { payload : result, station_sensor_id : station_sensor_id } 
            result['station_sensor_id'] = station_sensor_id;
            def.resolve(result);
        });
        return def.promise();
    }

    var ___getLatestReadingByStationID = function(station_id,sensor_id,interval,element,spin_element,show_unit,date){
        var def = $.Deferred();
        var payload = { SENSOR_ID : sensor_id, STATION_ID : station_id, INTERVAL : interval, DATE: date }
        //console.log(payload)
        if(sensor_id == '1'){
            interval = (interval > 0 ? interval : 10);
        }else{
            interval = (interval > 0 ? interval : 0);
        }
        $("#sensor_value"+station_id).html("-")
        if(typeof element !== 'undefined'){
            if(spin_element != ""){
                $("#"+element+station_id).html("-")
            }
        }

        if(typeof spin_element !== 'undefined'){
            $("."+spin_element+station_id).removeClass("hidden");
        }else{
            $(".spin"+station_id).removeClass("hidden");    
        }
        
        $.wms.executeExternalPost('/wms/wsv1/api/getLatestReadingByStationID',JSON.stringify(payload)).done(function (result) {
            //($.wms.debug() ? console.log(result) : "" )
            if(result.status === 'SUCCESS'){
                
                var sensor_value0 = result.payload.SENSOR_DATA_INPUT_0_RAW;
                //If not RAIN
                if(sensor_id != 1){
                    var sensor_value1 = result.payload.SENSOR_DATA_INPUT_1_RAW;
                    var sensor_value2 = result.payload.SENSOR_DATA_INPUT_2_RAW;
                    var sensor_value3 = result.payload.SENSOR_DATA_INPUT_3_RAW;
                    var sensor_value4 = result.payload.SENSOR_DATA_INPUT_4_RAW;
                }
                var sensor_value_date = result.payload.LOGGED_DATE;

                var sensor_color = "";
                var sensor_value = ""
                //console.log(result.payload.SENSOR_DATA_INPUT_0_RAW);

                //console.log(sensor_id);
                switch(sensor_id){

                    //RAIN GAUGE
                    case 1:
                        sensor_color = "text-success"
                        //console.log(sensor_value0);
                        if(sensor_value0 == null){
                            sensor_value0 = "-"
                        }
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"mm";
                        }else if (show_unit == false){

                            sensor_value = sensor_value0;
                        }
                        var count = $("span[id*='sp_rain_update"+station_id+"']").length;
                        if(count == 0){
                         $("#sensor_value"+station_id).before('<span id="sp_rain_update'+station_id+'">Last '+
                                                                        '<select data-id="'+station_id+'" class="rain_update'+station_id+'">'+
                                                                            '<option value=10>10 Min</option>'+
                                                                            '<option value=30>30 Min</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }

                        if(typeof element === 'undefined'){
                            $(".rain_update"+station_id).val(interval);  
                        }
                        
                        ___attachRainUpdate(station_id,sensor_id);
                        break;

                    //WATER LEVEL
                    case '2':
                        sensor_color = "text-success"
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"m"; 
                        }else if (show_unit == false){
                            sensor_value = sensor_value0;
                        }
                        
                         var count = $("span[id*='sp_wl_update"+station_id+"']").length;
                        if(count == 0){
                        $("#sensor_value"+station_id).before('<span id="sp_wl_update'+station_id+'">Last '+
                                                                        '<select data-id="'+station_id+'" class="wl_update'+station_sensor_id+'">'+
                                                                            '<option value=0>Current</option>'+
                                                                            '<option value=30>30 Minutes</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }
                        $(".wl_update"+station_id).val(interval);
                        ___attachWLUpdate(station_id,sensor_id);
                        break;

                    //LOCK SENSORS
                    case '3' : case '4' :
                        sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                        sensor_value = (sensor_value0 == 1 ? "CLOSED" : "OPEN"); 
                        break;

                    //VOLTAGE SENSOR
                    case '6' :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+'V</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/
                        break;

                    case '5' :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+' &deg;C</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/

                        break;
                    default :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+'</span> '
                                 /*+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';*/
                                                break;
                }
                //console.log(element);
                if(typeof element === 'undefined'){
                    $("#sensor_value"+station_id).html(sensor_value)
                    $("#sensor_value"+station_id).addClass(sensor_color)
                    $("#sensor_value_date"+station_id).html(sensor_value_date)
                }else{
                    //console.log(sensor_value)
                    if(sensor_value != null){
                        $("#"+element+station_id).html(sensor_value)    
                        //$("."+element+station_id).html(sensor_value)    
                    }else{
                        //$("#"+element+station_sensor_id).html(sensor_value)    
                    }
                    
                    $("#sensor_value_date"+station_id).html(sensor_value_date)
                }
                

            }

            //Hide Spinner
            //$(".spin"+station_sensor_id).addClass("hidden");
            if(typeof spin_element !== 'undefined'){
                //console.log(spin_element)
                $("."+spin_element+station_id).addClass("hidden");
            }else{
                $(".spin"+station_id).addClass("hidden");    
            }

            //var resolve = { payload : result, station_sensor_id : station_sensor_id } 
            result['station_id'] = station_id;
            def.resolve(result);
        });
        return def.promise();
    }

    var ___getLatestReadingNew = function(station_sensor_id,sensor_id,interval,element,spin_element,show_unit,date){
        var payload = { SENSOR_ID : sensor_id, STATION_SENSOR_ID : station_sensor_id, INTERVAL : interval, DATE: date }
        if(sensor_id == '1'){
            interval = (interval > 0 ? interval : 10);
        }else{
            interval = (interval > 0 ? interval : 0);
        }
        $("#sensor_value"+station_sensor_id).html("-")
        if(typeof element !== 'undefined'){
            $("#"+element+station_sensor_id).html("-")
        }

        if(typeof spin_element !== 'undefined'){
            $("."+spin_element+station_sensor_id).removeClass("hidden");
        }else{
            $(".spin"+station_sensor_id).removeClass("hidden");    
        }
        
        $.wms.executeExternalPost('/wms/wsv1/api/getLatestReadingNew',JSON.stringify(payload)).done(function (result) {
            ($.wms.debug() ? console.log(result) : "" )
            if(result.status === 'SUCCESS'){
                
                var sensor_value0 = result.payload.SENSOR_DATA_INPUT_0_RAW;
                //If not RAIN
                if(sensor_id != 1){
                    var sensor_value1 = result.payload.SENSOR_DATA_INPUT_1_RAW;
                    var sensor_value2 = result.payload.SENSOR_DATA_INPUT_2_RAW;
                    var sensor_value3 = result.payload.SENSOR_DATA_INPUT_3_RAW;
                    var sensor_value4 = result.payload.SENSOR_DATA_INPUT_4_RAW;
                }
                var sensor_value_date = result.payload.LOGGED_DATE;

                var sensor_color = "";
                var sensor_value = ""
                //console.log(result.payload.SENSOR_DATA_INPUT_0_RAW);
                switch(sensor_id){

                    //RAIN GAUGE
                    case '1':
                        sensor_color = "text-success"
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"mm";
                        }else if (show_unit == false){
                            sensor_value = sensor_value0;
                        }
                        var count = $("span[id*='sp_rain_update"+station_sensor_id+"']").length;
                        if(count == 0){
                         $("#sensor_value"+station_sensor_id).before('<span id="sp_rain_update'+station_sensor_id+'">Last '+
                                                                        '<select data-id="'+station_sensor_id+'" class="rain_update'+station_sensor_id+'">'+
                                                                            '<option value=10>10 Min</option>'+
                                                                            '<option value=30>30 Min</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }

                        if(typeof element === 'undefined'){
                            $(".rain_update"+station_sensor_id).val(interval);  
                        }
                        
                        ___attachRainUpdate(station_sensor_id,sensor_id);
                        break;

                    //WATER LEVEL
                    case '2':
                        sensor_color = "text-success"
                        if(typeof show_unit === "undefined"){
                            sensor_value = sensor_value0+"m"; 
                        }else if (show_unit == false){
                            sensor_value = sensor_value0;
                        }
                        
                         var count = $("span[id*='sp_wl_update"+station_sensor_id+"']").length;
                        if(count == 0){
                        $("#sensor_value"+station_sensor_id).before('<span id="sp_wl_update'+station_sensor_id+'">Last '+
                                                                        '<select data-id="'+station_sensor_id+'" class="wl_update'+station_sensor_id+'">'+
                                                                            '<option value=0>Current</option>'+
                                                                            '<option value=30>30 Minutes</option>'+
                                                                            '<option value=60>1 Hour</option>'+
                                                                            '<option value=180>3 Hours</option>'+
                                                                            '<option value=360>6 Hours</option>'+
                                                                            '<option value=720>12 Hours</option>'+
                                                                            '<option value=1440>24 Hours</option>'+
                                                                        '</select>'+
                                                                        '<br/></span>');
                        }
                        $(".wl_update"+station_sensor_id).val(interval);
                        ___attachWLUpdate(station_sensor_id,sensor_id);
                        break;

                    //LOCK SENSORS
                    case '3' : case '4' :
                        sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                        sensor_value = (sensor_value0 == 1 ? "CLOSED" : "OPEN"); 
                        break;

                    //VOLTAGE SENSOR
                    case '6' :  //sensor_color = (sensor_value0 == 1 ? "text-danger" : "text-success")
                                 sensor_value = '<span>'+sensor_value0+'V</span> '+
                                                '<span>'+sensor_value1+'V</span><br/>'+
                                                '<span>'+sensor_value2+'V</span> '+
                                                '<span>'+sensor_value3+'V</span>';
                        break;
                }
                //console.log(element);
                if(typeof element === 'undefined'){
                    $("#sensor_value"+station_sensor_id).html(sensor_value)
                    $("#sensor_value"+station_sensor_id).addClass(sensor_color)
                    $("#sensor_value_date"+station_sensor_id).html(sensor_value_date)
                }else{
                    
                    
                    /*console.log("#"+element+station_sensor_id);
                    console.log(sensor_value);*/
                    if(sensor_value != null){
                        //console.log("TRUE")
                        var num = parseFloat(sensor_value)
                        var n = num.toFixed(1)

                        if(sensor_id )
                        $("#"+element+station_sensor_id).html(n)
                    }
                    $("#sensor_value_date"+station_sensor_id).html(sensor_value_date)

                }
                

            }

            //Hide Spinner
            //$(".spin"+station_sensor_id).addClass("hidden");
            if(typeof spin_element !== 'undefined'){
                //console.log(spin_element)
                $("."+spin_element+station_sensor_id).addClass("hidden");
            }else{
                $(".spin"+station_sensor_id).addClass("hidden");    
            }
        });
    }


    return {
        attachPageStationMonitoring : __attachPageStationMonitoring,

        attachPageRainFallDashboard : __attachPageRainFallDashboard,
        attachPageRainFallStation : __attachPageRainFallStation,
        attachPageRainFallMap : __attachPageRainFallMap,
        attachPageRainFallTable : __attachPageRainFallTable,
        attachPageRainFallTableEvent : __attachPageRainFallTableEvent,
        attachPageRainFallGraphEvent : __attachPageRainFallGraphEvent,

        attachPageAWSTableEvent : __attachPageAWSTableEvent,
        getRainyDays : ___getRainyDays,

        attachPageWLStation : __attachPageWLStation,
        attachPageWlMap : __attachPageWlMap,
        attachPageWlMap2 : __attachPageWlMap2,
        attachPageWLTableEvent : __attachPageWLTableEvent,
        attachPageWLGraphEvent : __attachPageWLGraphEvent,
        attachPageWLDashboard : __attachPageWLDashboard,
        attachPageStationMap : __attachPageStationMap,

        attachPageRainFallDashboardNew : __attachPageRainFallDashboardNew

    };
}());
