<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<!-- <div class="col-md-3">
				 			<?php $this->load->view('templates/user_list_nav.php'); ?>
				 		</div> -->
				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  System Users Status </h3> </div>

								<div class="panel-body">
							    	Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button>

							    	

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr class="thead_tr">
								                <th>ID</th>
								                <th>Name</th>
								                <th>E-mail</th>
								                <th>Field Office</th>
								                
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
        	if($.wms.dashboard.checkPermission("9")){
        		$.wms.modal.attachModalEvent();
	      		$('.filter-modal select').css('width', '100%')
	      		$(".select2").select2()


	          	$.wms.widget.attachWidgetEvent();

	    		$.wms.dashboard.attachPageEvent();
	    		$.wms.dashboard.attachUserSysListEvent();
        	}
        	
        }, 200);

   });
</script>