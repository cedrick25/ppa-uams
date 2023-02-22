<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default"">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<div class="col-md-3">
				 			<?php $this->load->view('templates/backup_list_nav.php'); ?>
				 		</div>
				 		<div class="col-md-9">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  Restoring of  Record from range date</h3> </div>

								<div class="panel-body">
							    	
									<h4 style="color:black;">You must restore data from back-ups from "Back-Up of Record from Range Date" Page. Please Proceed with cautions.</h4><br/>
									
							    	<form action="/ppa-api/wsv1/Api/full_restore" method="post" enctype="multipart/form-data">
									    Select SQL to upload:
									    <input class="form-control" type="file" name="fileToUpload" id="fileToUpload">
										<center>
									    	<input type="submit" value="Upload Image" name="submit" class="btn btn-success">
										</center>
									</form>

						 		<br/><br/>
						 			
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
    		
    		/*$.wms.dashboard.loadStationListCB("chk");*/
        }, 200);
   });
</script>