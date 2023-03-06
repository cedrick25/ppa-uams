<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<div class="col-md-2">
				 		</div>
				 		<div class="col-md-8">

				 			<center>
				                <br>	
				                	<h4>WELCOME <u><b class="loggedUserName"></b></u> TO THE UNIFIED ACCESS MANAGEMENT SOLUTION INFORMATION SYSTEM! </h4>
			                </center>    
							
				            
		            		<div class="col-lg-12 " style="text-align:justify"><br>
				                <br>Please note that every activity is monitored closely. For any problem in the system, contact <a href="mail:support@probation.gov.ph">CASE RECORD MANAGEMENT DEPARTMENT SUPPORT.</a> for details. Click the links under NAVIGATION to select operation. It is recommended to logout by clicking the logout button everytime you leave your PC.
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



  <?php $this->load->view('widgets/feedback_rcv.php'); ?> 


  <?php $this->load->view('widgets/widgets.php'); ?> 

		



</body>
<?php $this->load->view('templates/footer.php'); ?> 

<script type="text/javascript">
	$( window ).ready(function() {
        setTimeout(function () {
      		$.wms.dashboard.attachPageEvent();
            $.wms.modal.attachModalEvent();
      		
      		
      		//$(".loading-data").fadeOut();

      		$('.filter-modal select').css('width', '100%')
      		$(".select2").select2()
      		/*$('.sel_date').datepicker( {
  		        changeMonth: true,
  		        changeYear: true,
  		        showButtonPanel: true,
  		        dateFormat: 'yy-mm',
  		        onClose: function(dateText, inst) { 
  		            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
  		        }
  		    });*/


          
          $.wms.widget.getRcvFeedback()

          if($.cookie("USER_LEVEL_ID") == 1){
          		$(".widgets_container").removeClass("hidden")
          		$.wms.widget.attachWidgetEvent();
          }else{
          		$(".widgets_container").remove()
          		$(".sso_container").removeClass("hidden")


          		var payload = {
	                USER_ID : $.cookie("USER_ID")
	            }
	            
	            $.wms.executeExternalPost('/ppa-api-uams/wsv1/Api/getISUserByID',JSON.stringify(payload)).done(function (result2) {
	            	console.log(result2);
	            	for(i=0;i<result2.payload.length;i++){
	            		console.log(result2.payload[i]);

	            		if(result2.payload[i].STATUS == 1){
	            			if(result2.payload[i].IS_UPDATE == 1){
	            				$(".sso_body").append(`
	            				<div class="col-md-6">
	            				<button disabled="disabled"  style="border-color:black;white-space: normal !important;word-wrap: break-word;width: 100%;height:120px;align-items: center;display: flex;"  class='btn btn-lg btn-danger text-wrap'>`+result2.payload[i].INFO_SYSTEM_NAME+`\n(For Enrolling...)</button></div>
	            				`)		
	            			}else{
	            				$(".sso_body").append(`
	            					<div class="col-md-6">
	            				<a target="_blank" href="`+result2.payload[i].INFO_SYSTEM_LOGIN_URL+`?key=`+$.cookie("H")+`" style="border-color:black;white-space: normal !important;word-wrap: break-word;width: 100%;height:120px;align-items: center;display: flex;"  class='btn btn-lg btn-danger text-wrap'>`+result2.payload[i].INFO_SYSTEM_NAME+`</a>
	            				</div>`)		
	            			}
	            			
	            		}else{
	        				$(".sso_body_notallowed").append(`
	        				<div class="col-md-6">
	        				<button disabled="disabled" style="border-color:white;white-space: normal !important;word-wrap: break-word;width: 100%;height:120px;align-items: center;display: flex; background-color:#2e2f30; color:#fff"  class='btn btn-lg btn-secondary text-wrap'>`+result2.payload[i].INFO_SYSTEM_NAME+`</button></div>
	        				`)	
	            		}	
	            		

	            	}
	            });



          }

        }, 200);
   });
</script>