
<?php $this->load->view('templates/header.php'); ?> 

<?php 
	$current_form = "Form 21 -";
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
			#$widget = "widget_filter_probation.php";
		}

		$str2 = explode("T",$str1[1]);
		
		if(sizeof($str2) > 1){
			?>
			
			<?php
			#$current_table = "Table ".$str2[1];	
		}else{
			?>
			
			<?php
			#$current_tabl
		}

		

	}
	?>



<body  style="background-color: #f1f1f1;">
<?php #$this->load->view('templates/nav.php'); ?> 



	
	        	
	        		
	          	
	          	


	          			<?php #$this->load->view('widgets/'.$widget); ?> 
	          		


						<?php 
						if(isset($_GET['form'])){
							$form = $_GET['form'];
							$path = "application/views/forms/".$form."_print.php";
							#echo $path;
							if(file_exists($path)){
								$this->load->view('forms/'.$form.'_print.php'); 
							}else{
								$this->load->view('forms/'.$form.'.php'); 	
							}
							
						}
						?>
					
				
			

		



</body>
<?php $this->load->view('templates/footer.php'); ?> 

<script type="text/javascript">
	$( window ).ready(function() {
		$(".footer_notes").remove();
        setTimeout(function () {
    		$.wms.dashboard.attachPageEvent();
    		$.wms.modal.attachModalEvent();

    		$(".loading-data").fadeOut();

    		$('.filter-modal select').css('width', '100%')
    		$(".select2").select2()
    		$('.sel_date').datepicker( {
		        changeMonth: true,
		        changeYear: true,
		        showButtonPanel: true,
		        dateFormat: 'yy-mm',
		        onClose: function(dateText, inst) { 
		            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
		        }
		    });
		    var pathname = window.location.pathname

    		//$.wms.widget.attachWidgetEvent();
    		$.wms.widget.attachWidgetFilterEvent();

    		function checkPendingRequest() {
	            if ($.active > 0) {
	                console.log("waiting...")
	                window.setTimeout(checkPendingRequest, 250);
	            }
	            else {
	                console.log("done...")
	                $(".options").remove();
	                $(".tb-header").removeClass("tb-header")
	                $(".source").remove();
	                $(".div-table").removeClass("div-table")
	                $("table").removeClass("text-nowrap")
	                //window.print();
	            
	            }
	        };
	        window.setTimeout(checkPendingRequest, 500);
    		
    		var form = "Printed Caseload Form: "+$.wms.urlParam('form')+", Field: "+ $.wms.urlParam('field')+", Date:"+ $.wms.urlParam('date')
    		var payload = {
    			"created_by" : $.cookie("USER_ID"),
    			"module" : "CASELOAD",
    			"action" : form
                
            }
            $.wms.executeExternalPost('/ppa-api/wsv1/Cmis/AuditInsert',JSON.stringify(payload)).done(function (result) {
            });


        }, 200);
   });
</script>