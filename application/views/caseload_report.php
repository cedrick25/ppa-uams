<?php $this->load->view('templates/header.php'); ?> 
<style>
  #sortable1, #sortable2, #sortable3 { list-style-type: none; margin: 0; float: left; margin-right: 10px; background: #eee; padding: 5px; width: 100%;}
  #sortable1 li, #sortable2 li, #sortable3 li { margin: 5px; padding: 5px; font-size: 10px; width: 100%; }
  </style>
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default"">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<!-- <div class="col-md-3">
				 			<?php $this->load->view('templates/user_list_nav.php'); ?>
				 		</div> -->
				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 18;"><i class="fa fa-list"></i>  Created Caseload Report </h3> </div>

								<div class="panel-body">
							    	<!-- Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button> -->

							    	<span class="pull-right "><button class="btn btn-primary" data-toggle="modal" data-target="#modalAdd">Add Report</button></span>

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>Report Name</th>
								                <th>Created Date</th>
								                <th>Status</th>
								                <th>Option</th>
								            </tr>
								        </thead>
								        <tbody id="TBsensorList">
								        </tbody>
								    </table>
								</div>

							</div>

				 		</div>

				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 18;"><i class="fa fa-list"></i>  Sent Caseload Report </h3> </div>

								<div class="panel-body">
							    	<!-- Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button> -->

							    	

						 		<br/><br/>
						 			<table id="fwdList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>Report Name</th>
								                <th>To</th>
								                <th>Field</th>
								                <th>Sent Date</th>
								                <th>Status</th>
								                <th>Option</th>
								            </tr>
								        </thead>
								        <tbody id="TBsensorList">
								        </tbody>
								    </table>
								</div>

							</div>

				 		</div>


				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 18;"><i class="fa fa-list"></i>  Received Caseload Report </h3> </div>

								<div class="panel-body">
							    	<!-- Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button> -->

							    	

						 		<br/><br/>
						 			<table id="rcvList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>Report Name</th>
								                <th>From</th>
								                <th>Field</th>
								                <th>Received Date</th>
								                <th>Status</th>
								                <th>Option</th>
								            </tr>
								        </thead>
								        <tbody id="TBsensorList">
								        </tbody>
								    </table>
								</div>

							</div>

				 		</div>


				 	</div>
				 </div>
			</div>
		</div>
	</div>
</div>



<!-- Modal -->
<div id="modalAdd" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-plus"></i>  Add Report <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				

				<div class="" id="addBody">
			    	<div class="form-group">
						<label for="">Report Name:</label>
						<input type="text" class="form-control" id="addtxtFullname">
					</div>

					<div class="form-group filter-modal ">
						<label for="">Field Office:</label>
						<select class="form-control select2 modal sel_field_office3" id="field"></select>
					</div>

					<div class="form-group">
						<label for="">Year-Month</label>
						
						<select class="form-control" id="addreport_YM">
						<?php for($i = 2019; $i<= date("Y"); $i++){
							?>
							<?php if($i != date("Y")){
								for($y=1; $y<=12;$y++){
									?><option><?= $i."-".str_pad($y, 2, '0', STR_PAD_LEFT); ?></option> <?php
								}
							}else{  
								for($y=1; $y<=date("m");$y++){
									?><option><?= $i."-".str_pad($y, 2, '0', STR_PAD_LEFT); ?></option> <?php
								}
							} ?>
							<?php
						} ?>
						</select>
					</div>



					<div class="form-group">
						<div class="col-md-6">
						<label for="">Available Report</label>
						
						<ul id="sortable1" class="droptrue" style="font-size:10px">
				   		 <li data-id="F5PCS" class="ui-state-default">PROBATION CASELOAD SUMMARY</li>
		                 <li data-id="F5T1" class="ui-state-default">TABLE 1 - CARRY OVER PROBATION INVESTIGATION CASELOAD</li>
		                 <li data-id="F5T2"  class="ui-state-default">TABLE 2 - COURT INVESTIGATION REFERRALS RECEIVED, ACTED UPON, AND NOT ACTED UPON</li>
		                 <li data-id="F5T3" class="ui-state-default">TABLE 3 - CARRY OVER PROBATION INVESTIGATION CASES PENDING DISPOSITION IN COURT</li>
		                 <li data-id="F5T4"  class="ui-state-default">TABLE 4 - PROBATION INVESTIGATION CASES DISPOSED OF BY THE COURT AND ISSUANCE OF</li>
		                 <li  data-id="F5T5" class="ui-state-default">TABLE 5 - CARRY OVER COURTESY PROBATION INVESTIGATION REFERRALS RECEIVED</li>
		                 <li  data-id="F5T6" class="ui-state-default">TABLE 6 - NEW COURTESY PROBATION INVESTIGATION REFERRALS RECEIVED, AND COMPLETED AND RETURNED</li>
		                 <li  data-id="F5T7" class="ui-state-default">TABLE 7 - CARRY OVER PROBATION SUPERVISION CASELOAD</li>
		                 <li  data-id="F5T8" class="ui-state-default">TABLE 8 - PROBATION SUPERVISION REFERRALS RECEIVED</li>
		                 <li  data-id="F5T9" class="ui-state-default">TABLE 9 - PROBATION SUPERVISION CASES ACTED UPON</li>
		                 <li  data-id="F5T10" class="ui-state-default">TABLE 10 - CARRY OVER PROBATION SUPERVISION CASES PENDING DISPOSITION IN COURT</li>
		                 <li  data-id="F5T11" class="ui-state-default">TABLE 11 - PROBATION SUPERVISION CASES DISPOSED OF BY THE COURT</li>
		                 <li  data-id="F5T12" class="ui-state-default">TABLE 12 - CARRY OVER COURTESY PROBATION SUPERVISION REFERRALS RECEIVED</li>
		                 <li  data-id="F5T13" class="ui-state-default">TABLE 13 - NEW COURTESY PROBATION SUPERVISION REFERRALS RECEIVED AND TERMINATED</li>



						</ul>
						 
						</div>
						<div class="col-md-6">
							<label for="">Selected Report</label>
							
							<ul id="sortable3" class="droptrue" style="    min-height: 200px;">
							</ul>
						</div>
					</div>

					<!-- <div class="form-group">
						<label for="">Password:</label>
						<input type="password" class="form-control" id="txtPassword2">
					</div> -->

					<br style="clear:both">

					<!-- <div class="form-group">
						<label for="">Email Address:</label>
						<input type="text" class="form-control" id="addtxtEmail">
					</div>

					<div class="form-group">
						<label for="">User Level:</label>
						<select class="form-control ddUserType" id="addddUserType">
						   
						</select>
					</div>

					<div class="form-group">
						<label for="">Field Office:</label>
						<select style="width: 100%" class="form-control sel_field_office select2" id="addddSelOffice">
						   
						</select>
					</div>

					<div class="form-group">
						<label for="">Status:</label>
						<select class="form-control" id="addddUserStatus">
						    <option value="1">ACTIVE</option>
						    <option value="0">INACTIVE</option>
						</select>
					</div> -->
					<button class="btn btn-primary pull-right" id="btnAddSubmit">Save</button>
				</div>
			</div>

		</div>
      </div>
    </div>

  </div>
</div>


<!-- Modal -->
<div id="modalFwd" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-plus"></i>  Forward Report <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				

				<div class="" id="addBody">

			    	<div class="form-group">
						<label for="">Report Name:</label>
						<input type="text" class="form-control" id="fwdReportName" disabled="disabled">
						<input type="hidden" class="form-control" id="fwdReportID">
					</div>

					<div class="form-group filter-modal ">
						<label for="">To:</label>
						<select class="form-control select2 modal " id="fwdUsers"><option>Please select</option></select>
					</div>

					


					
					<button class="btn btn-secondary pull-right" data-dismiss="modal">Cancel</button>
					<button class="btn btn-primary pull-right" id="btnFwdSubmit">Save</button>
				</div>
			</div>

		</div>
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


	    $( "ul.droptrue" ).sortable({
	      connectWith: "ul"
	    });
	 
	    $( "ul.dropfalse" ).sortable({
	      connectWith: "ul",
	      dropOnEmpty: false
	    });
	 
	    $( "#sortable1, #sortable2, #sortable3" ).disableSelection();


        	$.wms.modal.attachModalEvent();
      		$('.filter-modal select').css('width', '100%')
      		$(".select2").select2()


          	$.wms.widget.attachWidgetEvent();

    		$.wms.dashboard.attachPageEvent();
    		$.wms.dashboard.attachCaseloadListEvent();
    		
        }, 200);
   });
</script>