<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 
<br/>
<div class="row">
		<div class="col-md-12">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<span class="font_20"><i class="fa fa-search"></i> Search Probationer</b></span>
					<span class="font_20 pull-right sshow" style="cursor: pointer;"><i class="fa fa-caret-square-o-down"></i> <u>S</u>how</span>

					<span class="font_20 pull-right shide hidden" style="cursor: pointer;"><i class="fa fa-caret-square-o-up"></i> <u>H</u>ide</span>
				</div>
				<div class="panel-body p1 pp1" style="display:none"><br/>
					<div class="col-lg-12">
				      <div class="row">
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">REGION</label>
				            <div class="col-sm-3">
				              <input type="text" tabindex="-1" class="form-control input-sm upperCase" id="search_region" placeholder="">
				            </div>
				            <label for="" class="col-sm-2">YEAR</label>
				            <div class="col-sm-3">
				              <input type="text" tabindex="-1" class="form-control input-sm upperCase" id="search_year" placeholder="">
				            </div>
				          </div>
				        </div>
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">DOCKET NO</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="-1" class="form-control input-sm upperCase" id="search_docket" placeholder="">
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    <div class="col-lg-12">
				      <div class="row">
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">LAST NAME</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="1" class="form-control input-sm upperCase" id="search_lname" placeholder="">
				            </div>
				          </div>
				        </div>
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">SUPERVISING OFFICE</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="-1"  class="form-control input-sm upperCase" id="search_supervoffice" placeholder="">
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    <div class="col-lg-12">
				      <div class="row">
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">FIRST NAME</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="2" class="form-control input-sm upperCase" id="search_fname" placeholder="">
				            </div>
				          </div>
				        </div>
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">REMARKS</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="-1" class="form-control input-sm upperCase" id="search_remarks" placeholder="">
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    <div class="col-lg-12">
				      <div class="row">
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">MIDDLE NAME</label>
				            <div class="col-sm-8">
				              <input type="text" tabindex="3" class="form-control input-sm upperCase" id="search_mname" placeholder="">
				            </div>
				          </div>
				        </div>
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">START DATE</label>
				            <div class="col-sm-2 b">MM
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_start_mm" placeholder="MM">
				            </div>
				            <div class="col-sm-2 b">DD
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_start_dd" placeholder="DD">
				            </div>
				            <div class="col-sm-2 b">YYYY
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_start_yy" placeholder="YYYY">
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
				    <div class="col-lg-12">
				      <div class="row">
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">ALIAS</label>
				            <div class="col-sm-8">
				              <input type="text"  tabindex="-1" class="form-control input-sm" id="search_alias" placeholder="">
				            </div>
				          </div>
				        </div>
				        <div class="col-lg-6">
				          <div class="form-group row">
				            <div class="col-sm-1"></div>
				            <label for="" class="col-sm-3">END DATE</label>
							<div class="col-sm-2 b">MM
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_end_mm" placeholder="MM">
				            </div>
				            <div class="col-sm-2 b">DD
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_end_dd" placeholder="DD">
				            </div>
				            <div class="col-sm-2 b">YYYY
				              <input type="text"  tabindex="-1" class="form-control input-sm " id="search_end_yy" placeholder="YYYY">
				            </div>
				          </div>
				        </div>
				      </div>
				    </div>
	  				
				</div>
				<div class="panel-footer p1" style="display:none">
					
			     	<div class="row">
			     		<div class="col-lg-9">
		     			</div>
		     			<div class="col-lg-3">
		     				<span class="pull-right">
								<button type="button" class="btn btn btn-reset btn-danger">Reset</button>
			    				<button  tabindex="4" type="button" class="btn btn btn-primary btn-search"><i class="fa fa-search"></i> Search</button>
		    				</span>
    					</div>
					</div>
				</div>
			</div>
		</div>

	<div class="col-md-12">
		<div class="panel panel-primary">
			<div class="panel-heading">
				<span class="font_20"><i class="fa fa-users"></i> Masterlist of Probationers</b></span>

				<span class="pull-right">
					  <button type="button" class="access_ml_write btn btn-success adminTools" style="display: none;" data-toggle="modal" data-target="#modalAdd" id="openModal"><i class="fa fa-plus-circle"></i> Add Record</button>
				</span>
			</div>
			<div class="panel-body">
				<div class="form_loader center"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Processing.... </h2></div>

				Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnXLS">EXCEL</button>

				
				<div id="result_table" class="">
					<table id="probationer_table" class="display table-bordered table-condensed nowrap" style="width:100%">
				        <thead class="tb-header small">
				          <tr>
				            <th style="text-align: center;">ID</th>
				            <th style="text-align: center;">Last Name</th>
				            <th style="text-align: center;">First Name</th>
				            <th style="text-align: center;">Middle Name</th>
				            <th style="text-align: center;">Alias</th>
				            <th style="text-align: center;">Supervising Office</th>
				            <th style="text-align: center;">Remarks</th>
				            <th style="text-align: center;">Docket No</th>
				            <th style="text-align: center;">Region</th>
				            <th style="text-align: center;">Year</th>
				            <th style="text-align: center;">Start Date</th>
				            <th style="text-align: center;">End Date</th>
				            <th class="access_ml_write" style="text-align: center;">Options</th>
				          </tr>
				        </thead>
				        <tbody class="small">
				        </tbody>
			      	</table>
		      	</div>
			</div>
		</div>
	</div>
</div>




	<div class="modal fade" id="modalEdit" role="dialog" aria-labelledby="modalSaveLabel" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h4 class="modal-title" id="exampleModalLabel"><fa class="fa fa-pencil"></fa> Edit Probationer</h4>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <!-- <span aria-hidden="true">&times;</span> -->
	        </button>
	      </div>
	      <div class="modal-body">
	        <div class="row" id="form_">
	          <div class="col-lg-12">
	            <div class="form-group row">
	              <label for="" class="col-sm-3">REGION</label>
	              <div class="col-sm-3">
	                <input type="text" class="form-control input-sm" id="edit_region" placeholder="">
	                <input type="hidden" class="form-control input-sm" id="edit_id" placeholder="">
	              </div>
	              <label for="" class="col-sm-2">YEAR</label>
	              <div class="col-sm-4">
	                <input type="text" class="form-control input-sm" id="edit_year" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">DOCKET NO</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_docket" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">FIRST NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_fname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">MIDDLE NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_mname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">LAST NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_lname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">ALIAS</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_alias" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">SUPERVOFFICE</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_superv" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">REMARKS</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="edit_remarks" placeholder="">
	              </div>
	            </div>

	            <div class="form-group row">
	              <label for="" class="col-sm-3">START DATE</label>
	              <div class="form-group row">
		            <div class="col-sm-2 b">MM
		              <input type="text" class="form-control input-sm " id="edit_start_mm" placeholder="MM">
		            </div>
		            <div class="col-sm-2 b">DD
		              <input type="text" class="form-control input-sm " id="edit_start_dd" placeholder="DD">
		            </div>
		            <div class="col-sm-2 b">YYYY
		              <input type="text" class="form-control input-sm " id="edit_start_yy" placeholder="YYYY">
		            </div>
		          </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">END DATE</label>
	              <div class="form-group row">
		            <div class="col-sm-2 b">MM
		              <input type="text" class="form-control input-sm " id="edit_end_mm" placeholder="MM">
		            </div>
		            <div class="col-sm-2 b">DD
		              <input type="text" class="form-control input-sm " id="edit_end_dd" placeholder="DD">
		            </div>
		            <div class="col-sm-2 b">YYYY
		              <input type="text" class="form-control input-sm " id="edit_end_yy" placeholder="YYYY">
		            </div>
		          </div>
	            </div>
	          </div>
	        </div>
	        <div class="hidden confirm center b">
	          Make Sure all field are correct. Click Proceed to Continue
	        </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-sm btn-primary saveBtn adminTools" id="">Save</button>
	        <button type="button" class="btn btn-sm btn-primary hidden proceedBtn" id="">Proceed</button>
	      </div>
	    </div>
	  </div>
	</div>

	<div class="modal fade" id="modalAdd" role="dialog" aria-labelledby="modalSaveLabel" aria-hidden="true">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h4 class="modal-title" id="exampleModalLabel"><fa class="fa fa-pencil"></fa> Add Probationer</h4>
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	          <!-- <span aria-hidden="true">&times;</span> -->
	        </button>
	      </div>
	      <div class="modal-body">
	        <div class="row" id="form_">
	          <div class="col-lg-12">
	            <div class="form-group row">
	              <label for="" class="col-sm-3">REGION</label>
	              <div class="col-sm-3">
	                <input type="text" class="form-control input-sm" id="add_region" placeholder="">
	                <input type="hidden" class="form-control input-sm" id="add_id" placeholder="">
	              </div>
	              <label for="" class="col-sm-2">YEAR</label>
	              <div class="col-sm-4">
	                <input type="text" class="form-control input-sm" id="add_year" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">DOCKET NO</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_docket" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">FIRST NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_fname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">MIDDLE NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_mname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">LAST NAME</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_lname" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">ALIAS</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_alias" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">SUPERVOFFICE</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_superv" placeholder="">
	              </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">REMARKS</label>
	              <div class="col-sm-9">
	                <input type="text" class="form-control input-sm" id="add_remarks" placeholder="">
	              </div>
	            </div>

	            <div class="form-group row">
	              <label for="" class="col-sm-3">START DATE</label>
	              <div class="form-group row">
		            <div class="col-sm-2 b">MM
		              <input type="text" class="form-control input-sm " id="add_start_mm" placeholder="MM">
		            </div>
		            <div class="col-sm-2 b">DD
		              <input type="text" class="form-control input-sm " id="add_start_dd" placeholder="DD">
		            </div>
		            <div class="col-sm-2 b">YYYY
		              <input type="text" class="form-control input-sm " id="add_start_yy" placeholder="YYYY">
		            </div>
		          </div>
	            </div>
	            <div class="form-group row">
	              <label for="" class="col-sm-3">END DATE</label>
	              <div class="form-group row">
		            <div class="col-sm-2 b">MM
		              <input type="text" class="form-control input-sm " id="add_end_mm" placeholder="MM">
		            </div>
		            <div class="col-sm-2 b">DD
		              <input type="text" class="form-control input-sm " id="add_end_dd" placeholder="DD">
		            </div>
		            <div class="col-sm-2 b">YYYY
		              <input type="text" class="form-control input-sm " id="add_end_yy" placeholder="YYYY">
		            </div>
		          </div>
	            </div>
	          </div>
	        </div>
	        <div class="hidden confirm center b">
	          Make Sure all field are correct. Click Proceed to Continue
	        </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-add-cancel btn-sm btn-secondary" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-sm btn-primary saveAddBtn" id="">Save</button>
	        <button type="button" class="btn btn-sm btn-primary hidden proceedAddBtn" id="">Proceed</button>
	      </div>
	    </div>
	  </div>
	</div>
</div>


 <div class="modal fade" id="modal-search" role="dialog" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
    
      <div class="modal-content">
        <div class="modal-header tb-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title ppa-f24"><b><i class="fa fa-search"></i> No Record Found</b></h4>
        </div>
        <div class="modal-body ppa-f24">
          <p><b>Search Another?</b></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btnSearchNo"><u>N</u>o</button>
          <button type="button" class="btn btn-danger btnSearchYes" ><u>Y</u>es </button>


        </div>
        
      </div>

      
    </div>
  </div>

</body>
<?php $this->load->view('templates/footer.php'); ?> 
<?php $this->load->view('templates/admin_footer.php'); ?> 
<script type="text/javascript">
	$( window ).ready(function() {
        setTimeout(function () {
        	if($.wms.dashboard.checkPermission("7")){
	      		$.wms.dashboard.attachPageEvent();
	         	$.wms.modal.attachModalEvent();
	      		
	      		$(".loading-data").fadeOut();
	      		$('.filter-modal select').css('width', '100%')
	      		$(".select2").select2()
	      		//$(".sel-date2").datepicker()


	          $.wms.widget.attachWidgetEvent();
	          $.wms.probationer.attachProbationerEvent();
      		}
        }, 200);


        shortcuts.add('alt+r',function() {
        	$(".btn-reset").focus();
        	 setTimeout(function () {
		    $(".btn-reset").trigger("click")
			    $("input").val('');
			    $("#search_lname").focus();
			});

		})

		shortcuts.add('alt+s',function() {
		    $(".sshow").trigger("click")
		    setTimeout(function () {
		    $("#search_lname").focus();
			},10)
		})

		shortcuts.add('alt+h',function() {
		    $(".shide").trigger("click")
		})
   });
</script>