<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default"">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-user-secret "></i>  Audit Trail </h3> </div>

								<div class="panel-body">
							    	Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> 
							    	<button class="btn btn-primary btnXLS">EXCEL</button>
							    	<button class="btn btn-primary btnPrint">Print</button>

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>Date</th>
								                <th>Name</th>
								                <th>User Level</th>
								                <th>Field Office</th>
								                <th>Module</th>
								                <th>Action</th>
								            </tr>
								        </thead>
								        <thead>
								            <tr>
								                <td id="head0">ID</th>
								                <th id="head1">Date</th>
								                <th id="head2">Name</th>
								                <th id="head3">User Level</th>
								                <th id="head4">Field Office</th>
								                <th id="head5">Module</th>
								                <th id="head6">Action</th>
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





</body>
<?php $this->load->view('templates/footer.php'); ?> 
<?php $this->load->view('templates/admin_footer.php'); ?> 

<script type="text/javascript">
	$( window ).ready(function() {
        setTimeout(function () {

        	$.wms.modal.attachModalEvent();
      		$('.filter-modal select').css('width', '100%')
      		$(".select2").select2()


          $.wms.widget.attachWidgetEvent();

    		$.wms.dashboard.attachPageEvent();
    		$.wms.dashboard.loadAuditTrail();
        }, 200);
   });
</script>