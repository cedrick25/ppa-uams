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
				 			<?php $this->load->view('templates/user_list_nav.php'); ?> 
				 		</div>
				 		<div class="col-md-9">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-plus"></i>  Add User </h3> </div>

								<div class="panel-body">

							    	<div class="form-group">
										<label for="">Full Name:</label>
										<input type="text" class="form-control" id="txtFullname">
									</div>

									<div class="form-group">
										<label for="">User Name:</label>
										<input type="text" class="form-control" id="txtUsername">
									</div>

									<div class="form-group">
										<label for="">Password:</label>
										<input type="password" class="form-control" id="txtPassword1">
									</div>

									<!-- <div class="form-group">
										<label for="">Password:</label>
										<input type="password" class="form-control" id="txtPassword2">
									</div> -->

									<div class="form-group">
										<label for="">Contact No.:</label>
										<input type="text" class="form-control" id="txtContact">
									</div>

									<div class="form-group">
										<label for="">Email Address:</label>
										<input type="text" class="form-control" id="txtEmail">
									</div>

									<div class="form-group">
										<label for="">Expiration:</label>
										<input type="date" class="form-control" id="txtExpiration">
									</div>

									<div class="form-group">
										<label for="">User Level:</label>
										<select class="form-control ddUserType" id="ddUserType">
										   
										</select>
									</div>

									<div class="form-group">
										<label for="">Status:</label>
										<select class="form-control" id="ddUserStatus">
										    <option value="1">ACTIVE</option>
										    <option value="0">INACTIVE</option>
										</select>
									</div>

									<div class="form-group">
										<label for="">Allowed Stations to be access:</label>
										<div class="chk"></div>
									</div>

									<button class="btn btn-primary pull-right" id="btnSubmit">Submit</button>
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

<script type="text/javascript">
	$( window ).ready(function() {
        setTimeout(function () {
        	if($.wms.dashboard.checkPermission("9")){
	    		$.wms.dashboard.attachPageEvent();
	    		$.wms.dashboard.loadUserType("ddUserType")
	    		$.wms.dashboard.loadStationListCB("chk");
	    		$.wms.dashboard.attachAddUserEvent();
    		}
    		//$.wms.dashboard.attachSensorAddEvent();
        }, 200);
   });
</script>