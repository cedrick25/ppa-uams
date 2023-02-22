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
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  Back-Up of All Record</h3> </div>

								<div class="panel-body">
							    	
									<h3 style="color:black;">Backing-up of all record might take several moments... <br/>Click "Back-Up Now" to proceed.</h3><br/>
							    	<center><a href="/ppa-api/wsv1/Api/backup" target="_new" class="btn btn-large btn-success btnBackup">Back-Up Now</a></center>

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