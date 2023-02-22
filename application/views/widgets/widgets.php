<div class="row widgets_container hidden">
      <div class="col-md-12">
        <div class="panel panel-primary">
          <div class="panel-heading">
            <span class="font_20">Dashboard Widgets</span>
          </div>
          <div class="widget-panel panel-body" data-inner-id="widget-panel">
            <div class="col-md-6" data-inner-id="panel-w-1">


              <div class=" panel panel-primary panel-widget" id="widget_workload" data-inner-id="panel-1">
                <div class="panel-heading font_18"><i class="fa fa-bar-chart"></i> 
                  List of PPA Information System

                  <span class="pull-right loading-data-list-is"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> <span class="hidden-xs">Retrieving Data...</span></span> 
                 
                  
                </div>
                <div class="panel-body map-wrapper">

                  <span class="pull-right hidden">
                    <b>Field Office:</b> <select class="form-control sel_field_office select2" id="widget_workload_field_office">

                      
                    </select>
                    <b>Date:</b> <input type="text" id="widget_workload_date" class="sel_date">
                    <button class="btn btn-success btn-sm btn-workload">Filter</button>
                  </span>
                  
                  <span class="pull-left hidden">
                    <ul class="nav nav-tabs">
                      <li class="active"><a data-toggle="tab" href="#wl_table"><i class="fa fa-table"></i> Tabular</a></li>
                      <li><a data-toggle="tab" href="#wl_graph" class="wl_graph"><i class="fa fa-pie-chart"></i> Graph</a></li>  
                    </ul>

                  </span> 
                  <span class="pull-right hidden"><button class="btn btn-primary btn-sm btnXLS">XLS</button> <button  class="btn btn-primary btn-sm btnPDF">PDF</button> <button class="btn btn-primary btn-sm btnPrint">Print</button></span>
                  <div class="tab-content">

                    <div id="wl_table" class="tab-pane fade in active">
                    <table class="table table-bordered table-condensed" id="t1">
                      <thead>
                        <tr class="tb-header">
                          <td>Information System</td>
                          <td align="center" class="b">SSO - Status</td>
                        </tr>
                      </thead>
                      <tbody id="tbody_list_is">
                      
                      
                     
                      
                      </tbody>
                    </table>
                    </div>

                    <div id="wl_graph" class="tab-pane fade">
                        <canvas id="wl_graph1" width="250px"></canvas>

                        <canvas id="wl_graph2" width="250px"></canvas>
                    </div>

                  </div>
                </div>
              </div>



            </div>

            <div class="col-md-6" data-inner-id="panel-w-2">
              <div class="panel panel-primary panel-widget " id="widget_nrr" data-inner-id="panel-2">
                <div class="panel-heading font_18"><i class="fa fa-bar-chart"></i> Information System Users<span class="pull-right loading-users-is"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> <span class="hidden-xs">Retrieving Data...</span></span> </div>
                <div class="panel-body map-wrapper">

                  <span class="pull-right hidden">
                    <b>Field Office:</b> <select class="form-control sel_field_office select2" id="widget_nrr_field_office">
                      </select>
                    <b>Date:</b> <input type="text" id="widget_nrr_date" class="sel_date">
                    <button class="btn btn-success btn-sm btn-nr">Filter</button>
                  </span>

                  <span class="pull-left hidden">
                    <ul class="nav nav-tabs">
                      <li class="active"><a data-toggle="tab" href="#nr_table"><i class="fa fa-table"></i> Tabular</a></li>
                      <li><a data-toggle="tab" href="#nr_graph" class="nr_graph"><i class="fa fa-pie-chart"></i> Graph</a></li>  
                    </ul>
                  </span> 
                  <span class="pull-right hidden"><button class="btn btn-primary btn-sm btnXLS">XLS</button> <button  class="btn btn-primary btn-sm btnPDF">PDF</button> <button class="btn btn-primary btn-sm btnPrint">Print</button></span>
                  <div class="tab-content">
                    
                    <div id="nr_table" class="tab-pane fade in active">
                      <table class="table table-bordered table-condensed" id="t2">
                         <thead>
                        <tr class="tb-header">
                          <td>Information System</td>
                          <td align="center" class="b"># of Users</td>
                        </tr>
                      </thead>
                      <tbody id="tbody_users_is">
                      
                      
                      </tbody>
                    </table>
                      </table>
                    </div>

                     <div id="nr_graph" class="tab-pane fade">
                        <canvas id="nr_graph1" width="250px"></canvas>

                        <canvas id="nr_graph2" width="250px"></canvas>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            
            <div class="col-md-6" data-inner-id="panel-w-3">
             
            </div>

            <div class="col-md-6" data-inner-id="panel-w-4">
              
            </div><br/>
          </div>


            <div class="col-md-6" data-inner-id="panel-w-5">
              
            </div>

            <div class="col-md-6" data-inner-id="panel-w-6">
              
            </div>

            <div class="col-md-6" data-inner-id="panel-w-7">
              
            </div>

            <div class="col-md-6" data-inner-id="panel-w-8">
              
            </div>

            <div class="col-md-6" data-inner-id="panel-w-9">
              
            </div>

            <div class="col-md-6" data-inner-id="panel-w-9">
             
            </div>

            <!-- <div class="col-md-6">
              <div class="panel panel-primary panel-widget">
                <div class="panel-heading"><i class="fa fa-bar-chart"></i> Other widgets which are deemed necessary which were gathered during the systems investigation and design<span class="pull-right loading-data"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> <span class="hidden-xs">Retrieving Data...</span></span> </div>
                <div class="panel-body map-wrapper">
                  No Available Data
                </div>
              </div>
            </div> -->
            
          </div>
        </div>
      </div>
    </div>


<div class="row sso_container hidden">
  
  <!-- <div class="col-md-8 col-md-offset-2"> -->
  <div class="col-md-10 col-md-offset-1">
          <div class="panel panel-primary">
            <div class="panel-heading">
              <span style="font-size:24px;">PPA Information Systems</span>
            </div>
            <div class="panel-body ">
              <div class="col-md-6 sso_body">
                
              </div>
              <div class="col-md-6 sso_body_notallowed">
                
              </div>
            </div>
          </div>
        </div>

</div>