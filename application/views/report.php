
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
	        		$current_form = "";
	        		$current_table = "";
	        		$current_type = "";
	        		$current_link = "";
	        		$widget = "";
	        		/*if(isset($_GET['form'])){
	        			$str1 = explode("F",$_GET['form']);
	        			if($str1[1][0] == "5"){
	        				$current_form = "Form 5 - ";
	        				$current_type = "Probation ";
	        				$current_link = "#form5modal";
	        				
	        			}else{
	        			
	        			}
	        			$widget = "widget_filter_probation.php";
	        			$str2 = explode("T",$str1[1]);
	        			
	        			if(sizeof($str2) > 1){
	        				$current_table = "Table ".$str2[1];	
	        			}

	        			

	        		}*/
	        		?>
	            	<span class="font_20"><u><a href="#" class="text-white"  data-toggle="modal" data-target="<?= $current_link; ?>"><?= $current_type; ?>Reports</a></u>  <?php echo $current_form.$current_table; ?> </span>
	          	</div>
	          	<div class="panel-body">
		          		 


	          			<?php 

	          			$form = $_GET['form'];
						if(strpos($form,"regional") != false){
							$this->load->view('widgets/widget_filter_report_regional.php');	
						}else{
							$this->load->view('widgets/widget_filter_report_field.php'); 
						}

						?>
	          			<div class="row">
						    <div class="col-lg-12 col-sm-12 col-md-12">
						    	<span class="pull-right" style="padding-right: 10px;">
						    		
						        <button type="button" class="btn btn-sm btn-primary btn-download"><i class="fa fa-cloud-download"></i> Download</button>
						    		<button type="button" class="btn btn-sm btn-primary btn-print-report"><i class="fa fa-print"></i> Print</button>
						    	</span>
						    </div>
						  </div>
	          		 
	          			<div class="form_loader hidden"><h1><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Processing.... </h1></div>
	          			<div class="result_form">
						<?php 
						if(isset($_GET['form'])){
							$form = $_GET['form'];
							if(strpos($form,"regional") != false){

							}
							$this->load->view('report/'.$form.'.php');
							#$this->load->view('forms-control/'.$form.'.php');
							
							#$this->load->view('forms/'.$form.'.php'); 
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
    		$.wms.widget.attachWidgetFilterEvent();

    		$.wms.report.load();


    		
    		


        }, 200);
   });
</script>