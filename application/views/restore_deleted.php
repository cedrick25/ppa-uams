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
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  Restore Deleted Data </h3> </div>

								<div class="panel-body">
							    	
								Table: <select id="table">
									<option>F5T1</option>
									<option>F5T2_ACTED</option>
									<option>F5T2_NOTACTED</option>
									<option>F5T2_RCV</option>
									<option>F5T3</option>
									<option>F5T4</option>
									<option>F5T5</option>
									<option>F5T6_CMPLTD</option>
									<option>F5T6_RCV</option>
									<option>F5T7</option>
									<option>F5T8</option>
									<option>F5T9</option>
									<option>F5T10</option>
									<option>F5T11</option>
									<option>F5T12</option>
									<option>F5T13_RCV</option>
									<option>F5T13_TERM</option>
									<option>F21T1</option>
									<option>F21T2_ACTED</option>
									<option>F21T2_RCV</option>
									<option>F21T3</option>
									<option>F21T4</option>
									<option>F21T5</option>
									<option>F21T6_CMPLTD</option>
									<option>F21T6_RCV</option>
									<option>F21T7_PAROL</option>
									<option>F21T7_PARDON</option>
									<option>F21T8_PAROL</option>
									<option>F21T8_PARDON</option>
									<option>F21T9_PAROL</option>
									<option>F21T9_PARDON</option>
									<option>F21T10_PAROL</option>
									<option>F21T10_PARDON</option>
									<option>F21T11_AROL</option>
									<option>F21T11_PARDON</option>
									<option>F21T12_PAROL</option>
									<option>F21T12_PARDON</option>
									<option>F21T13_PAROL</option>
									<option>F21T13_PARDON</option>
									<option>F21T14_PAROL</option>
									<option>F21T14_PARDON</option>
									<option>F21T15_RCV_PAROL</option>
									<option>F21T15_RCV_PARDON</option>
									<option>F21T15_TERM_PAROL</option>
									<option>F21T15_TERM_PARDON</option>
									
								</select>
								<button class="btn btn-success btnView">View</button>
							    	

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>docket_no</th>
								                <th>Petitioner</th>
								                <th>Field Office</th>
								                <th>Y_M</th>
								                <th>Option</th>
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
    		$.wms.dashboard.attachDeletedListEvent();
    		$(".btnView").unbind("click").on("click",function(){
    			$.wms.dashboard.attachDeletedListEvent();
    		});
    		/*$.wms.dashboard.loadStationListCB("chk");*/
        }, 200);
   });
</script>