
<?php $this->load->view('templates/header.php'); ?> 
<style>
	/* @media print{@page {size: 8.5in 13in; size: landscape;}}*/
</style>
<body style="background-color: #f1f1f1;">








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
	            


	          			<?php 

	          			$form = $_GET['form'];
						if(strpos($form,"regional") != false){
							#$this->load->view('widgets/widget_filter_report_regional.php');	
						}else{
							#$this->load->view('widgets/widget_filter_report_field.php'); 
						}

						?>
	          			
	          		 
	          			
	          			
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
	                $(".footer_notes").remove();
	                $(".div-table").removeClass("div-table")
	                $("table").removeClass("text-nowrap")
	                window.print();
	            
	            }
	        };
	        window.setTimeout(checkPendingRequest, 500);
    		
    		


        }, 200);
   });
</script>