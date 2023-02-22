
<?php $this->load->view('templates/header.php'); ?> 

<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default"">
				 <div class="panel-body">
				 	
				 	<div class="row hidden">
				 		<div class="col-md-2">
				 		</div>
				 		<div class="col-md-8">

				 			<center>
				                <br>	
				                	<h4>WELCOME <u><b class="loggedUserName"></b></u> TO THE CASE MANAGEMENT INFORMATION SYSTEM! </h4>
			                </center>    
							
				            
		            		<div class="col-lg-12 hidden" style="text-align:justify"><br>
				                <br>Please note that every activity is monitored closely. For any problem in the system, contact <a href="mail:info@centricitgroup.com">AppCentric Solutions Inc.</a> for details. Click the links under NAVIGATION to select operation. It is recommended to logout by clicking the logout button everytime you leave your PC.
		                   	<br> <br>
		                    	If you do not agree with the terms and conditions or you are not <b class="loggedUserName"></b>, please <a class="lnkLogout">logout</a>.
		                 	<br><br>

		                    </div>


				 		</div>
				 		<div class="col-md-2">
				 		</div>
				 	</div>
			 	</div>
		 	</div>
	 	</div>
 	</div>






	<div class="row">
		<div class="col-md-12">
	        <div class="panel panel-primary">
	        	<div class="panel-heading">
	        		<?php 
	        		$current_form = "Form 21 - ";
	        		$current_table = "Caseload Summary";
	        		$current_type = "Parole/Executive Clemency ";
	        		$current_link = "#form21modal";
	        		$widget = "";
	        		$widget = "widget_filter_migration.php";

	        		
	        		?>
	            	<span class="font_20"><u><a href="#" class="text-white"  data-toggle="modal" data-target="<?= $current_link; ?>"><?= $current_type; ?>Caseload</a></u> > Migration</span>
	          	</div>
	          	<div class="panel-body">


	          			<?php $this->load->view('widgets/'.$widget); ?> 
	          		 
	          			<div class="form_loader hidden"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Processing.... </h2></div>
	          			<div class="result_form">

						<?php 
						if(isset($_GET['form'])){
							$form = $_GET['form'];

							#$this->load->view('forms-control/'.$form.'.php');

							?>

							<?php
							
							

							
						}
						?>
						</div>
					
				</div>
			</div>
		</div>
	</div>



		



</body>
<?php $this->load->view('templates/footer.php'); ?> 

<script type="text/javascript">
	$( window ).ready(function() {
        setTimeout(function () {
    		$.wms.dashboard.attachPageEvent();
    		$.wms.modal.attachModalEvent();

    		$(".loading-data").fadeOut();

    		$('.filter-modal select').css('width', '100%')
    		$(".select2").select2()
    		
    		$.wms.widget.attachWidgetEvent();
    		
    		$(".btn-migrate").unbind("click").on("click",function(){
    			console.log("Trigger");

	            var date = $("#filter_date").val();
	            var field = $("#filter_office").val();
	            let a= document.createElement('a');
				a.target= '_blank';
				a.href= "/ppa-api/wsv1/api/migrate_offline?submit=yes&field="+field+"&date="+date;
				a.click();
    		});

        }, 200);
   });
</script>