<?php $this->load->view('templates/header.php'); ?> 
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
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  Forms </h3> </div>

								<div class="panel-body">
							    	Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button>

							    	

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>Form Title</th>
								                <th>Form Code</th>
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
<div id="modalEdit" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-pencil"></i>  Update Form <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				<div class="text-center" id="editLoading"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i><br>Populating Data...</h2></div>

				<div class="hidden" id="editBody">
			    	<div class="form-group">
						<label for="">Form Title:</label>
						<input type="text" class="form-control" id="txtformTitle" disabled="disabled">
						<input type="hidden" class="form-control" id="txtformID">
					</div>

					<div class="form-group">
						<label for="">Form Code:</label>
						<input type="text" class="form-control" id="txtformCaption">
					</div>
					
					<button class="btn btn-primary pull-right" id="btnSave">Save</button>
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
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-plus"></i>  Add User Level <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				

				<div class="" id="addBody">
			    	<div class="form-group">
						<label for="">User Level Name:</label>
						<input type="text" class="form-control" id="addtxtUserLevel">
					</div>
					<div class="form-group">
						<label for="">Modules:</label>
						<div class="add_modules"></div>
					</div>

					<div class="form-group">
						<label for="">Status:</label>
						<select class="form-control" id="addddUserStatus">
						    <option value="1">ACTIVE</option>
						    <option value="0">INACTIVE</option>
						</select>
					</div>

					
					<button class="btn btn-primary pull-right" id="btnAddSubmit">Save</button>
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
        	if($.wms.dashboard.checkPermission("9")){
	        	$.wms.modal.attachModalEvent();
	      		$('.filter-modal select').css('width', '100%')
	      		$(".select2").select2()


	         	$.wms.widget.attachWidgetEvent();

	    		$.wms.dashboard.attachPageEvent();
	    		$.wms.dashboard.attachFormsEvent();

    		}
        }, 200);
   });
</script>