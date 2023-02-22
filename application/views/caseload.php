
<?php $this->load->view('templates/header.php'); ?> 

<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default">
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
	        		if(isset($_GET['form'])){
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

	        			

	        		}
	        		?>
	            	<span class="font_20"><u><a href="#" class="text-white"  data-toggle="modal" data-target="<?= $current_link; ?>"><?= $current_type; ?>Caseload</a></u> > <?php echo $current_form.$current_table; ?> </span>
	          	</div>
	          	<div class="panel-body">


	          			<?php $this->load->view('widgets/'.$widget); ?> 
	          		 
	          			<div class="form_loader hidden"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Processing.... </h2></div>
	          			<div class="result_form">

						<?php 
						if(isset($_GET['form'])){
							$form = $_GET['form'];

							$this->load->view('forms-control/'.$form.'.php');

							?>

							<?php
							
							$this->load->view('forms/'.$form.'.php'); 

							$this->load->view('widgets/feedback.php'); 
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

    		$("[id$=Y_M]").parent().parent().addClass("hidden")
    		$("[id$=_field_office]").parent().parent().addClass("hidden")


            var form = "Visited Caseload Form: "+$.wms.urlParam('form')+", Field: "+ $.wms.urlParam('field')+", Date:"+ $.wms.urlParam('date')
    		var payload = {
    			"created_by" : $.cookie("USER_ID"),
    			"module" : "CASELOAD",
    			"action" : form
                
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/AuditInsert',JSON.stringify(payload)).done(function (result) {
            });


            function checkPendingRequest() {
            if ($.active > 0) {
                console.log("waiting...")
                window.setTimeout(checkPendingRequest, 500);
            }
            else {
                console.log("done2...")
                if($.cookie('USER_LEVEL_ID') != "undefined" && $.cookie('USER_LEVEL_ID') == 1){
                	
	                $(".btn-delete").removeClass("hidden")
	                $(".btn-rcv-delete").removeClass("hidden")
	                $(".btn-acted-delete").removeClass("hidden")
	                $(".btn-notacted-delete").removeClass("hidden")
	                $(".btn-rcv").removeClass("hidden")
            	}

                $(".PETITIONER_LINK").unbind("click").bind("click",function(){
		            
		            var payload = {
		            	"docket_no" : $(this).data("id")
		            }
		            $.wms.executeExternalPost('/ppa-api/wsv1/Pis/getFactSheet',JSON.stringify(payload)).done(function (result) {
		            	console.log(result);
		            	if(result.status === "SUCCESS"){
		            		var URL = "http://pis.probation.gov.ph/petitioner/profile/"+result.payload.PETITIONER
		            		window.open(URL, '_blank');
		            	}else{
		            		alert("Data Not Found in Probation Information System")
		            	}
		            })
		            
		        })

		        $(".PETITIONER_LINK").unbind("click").bind("click",function(){
		            
		            var payload = {
		            	"docket_no" : $(this).data("id")
		            }
		            $.wms.executeExternalPost('/ppa-api/wsv1/Pis/getFactSheet',JSON.stringify(payload)).done(function (result) {
		            	console.log(result);
		            	if(result.status === "SUCCESS"){
		            		var URL = "http://pis.probation.gov.ph/petitioner/profile/"+result.payload.PETITIONER
		            		window.open(URL, '_blank');
		            	}else{
		            		alert("Data Not Found in Probation Information System")
		            	}
		            })
		            
		        })

		        $(".docket_link").unbind("click").bind("click",function(){
		            
		            var payload = {
		            	"docket_no" : $(this).data("id")
		            }
		            $.wms.executeExternalPost('/ppa-api/wsv1/Pis/getDocketInvID',JSON.stringify(payload)).done(function (result) {
		            	console.log(result);
		            	if(result.status === "SUCCESS"){
		            		var URL = "http://pis.probation.gov.ph/docketbook/view/investigation/"+result.payload.PETITIONER
		            		window.open(URL, '_blank');
		            	}else{
		            		alert("Data Not Found in Probation Information System")
		            	}
		            })
		            
		        })

		        $(".docket_view").unbind("click").bind("click",function(){
		            
		            var payload = {
		            	"docket_no" : $(this).data("docket")
		            }
		            $.wms.executeExternalPost('/ppa-api/wsv1/Pis/getDocketInvID',JSON.stringify(payload)).done(function (result) {
		            	console.log(result);
		            	if(result.status === "SUCCESS"){
		            		var URL = "http://pis.probation.gov.ph/docketbook/view/investigation/"+result.payload.PETITIONER
		            		window.open(URL, '_blank');
		            	}else{
		            		alert("Data Not Found in Probation Information System")
		            	}
		            })
		            
		        })
            }
        };
        window.setTimeout(checkPendingRequest, 1500);
    		


        }, 200);


		
		var payload = { form_page : $.wms.urlParam('form') }

        $.wms.executeExternalPost('/ppa-api/wsv1/api/getFormByPage',JSON.stringify(payload)).done(function (result) {
            
            if(result.status == 'SUCCESS'){
            	//alert(result.payload.form_CAPTION)
            	$(".form_caption").html(result.payload.form_CAPTION)
            }
        });
   });
</script>