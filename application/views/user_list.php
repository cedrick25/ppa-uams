<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 

<div class="container loggedBody" hidden>
	<div class="row">
		<div class="col-md-12">
			<div class="panel panel-default">
				 <div class="panel-body">
				 	
				 	<div class="row">
				 		<!-- <div class="col-md-3">
				 			<?php $this->load->view('templates/user_list_nav.php'); ?>
				 		</div> -->
				 		<div class="col-md-12">


				 			<div class="panel panel-primary">
								<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-list"></i>  Users List </h3> </div>

								<div class="panel-body">
							    	Export: <button class="btn btn-primary btnCSV">CSV</button> <button class="btn btn-primary btnPDF">PDF</button> <button class="btn btn-primary btnXLS">EXCEL</button>

							    	<span class="pull-right "><button id="btnAddModal" class="btn btn-primary" data-toggle="modal" data-target="#modalAdd">Add User</button></span>

						 		<br/><br/>
						 			<table id="tableSensorList" class="display " cellspacing="0" width="100%">
								        <thead>
								            <tr>
								                <th>ID</th>
								                <th>First Name</th>
								                <th>Middle Name</th>
								                <th>Last Name</th>
								                <th>E-mail</th>
								                <th>User Level</th>
								                <th>Field Office</th>
								                <th>Position</th>
								                <th>Status</th>
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



<!-- Modal -->
<div id="modalEdit" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-pencil"></i>  Update User Account <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				<div class="text-center" id="editLoading"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i><br>Populating Data...</h2></div>

				<div class="hidden" id="editBody">
			    	<div class="form-group col-md-4">
						<label for="">First Name:</label>
						<input type="text" class="form-control" id="txtFname">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Middle Name:</label>
						<input type="text" class="form-control" id="txtMname">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Last Name:</label>
						<input type="text" class="form-control" id="txtLname">
					</div>

					<div class="form-group col-md-6">
						<label for="">User Name:</label>
						<input type="hidden" class="form-control" id="txtUserID">
						<input type="text" disabled="disabled" class="form-control" id="txtUsername">
					</div>

					<div class="form-group col-md-6">
						<label for="">Password: (Leave blank if no changes) </label>
						<input type="password" class="form-control" id="txtUpdatePassword1">
						<ul  id="dU1" class="list-group">
			            <li class="list-group-item list-group-item-success">Password Conditions</li>
			            <li class="list-group-item" id=dU12><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter</li>
			            <li class="list-group-item" id=dU13 ><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter </li>
			            <li class="list-group-item" id=dU15><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number</li>
			            <li class="list-group-item" id=dU16><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char</li>
		            </ul>

					</div>

					<!-- <div class="form-group">
						<label for="">Password:</label>
						<input type="password" class="form-control" id="txtPassword2">
					</div> -->

					<div class="form-group col-md-6">
						<label for="">Email Address:</label>
						<input type="text" class="form-control" disabled="disabled" id="txtEmail">
					</div>

					<div class="form-group col-md-6">
						<label for="">Contact No.:</label>
						<input type="text" class="form-control" id="txtContact">
					</div>

					

					<div class="form-group col-md-12">
						<label for="">User Level:</label>
						<select class="form-control ddUserType" id="ddUserType">
						   
						</select>
					</div>

					<div class="form-group col-md-6">
						<label for="">Field Office:</label>
						<select style="width: 100%" class="form-control sel_field_office select2" id="ddSelOffice">
						   
						</select>
					</div>
					<div class="form-group col-md-6">
						<label for="">Office Position:</label>
						<select style="width: 100%" class="form-control sel_office_position select2" id="ddSelPosition">
						   
						</select>
					</div>

					<div class="form-group">
						<label for="">Status:</label>
						<select class="form-control" id="ddUserStatus">
						    <option value="1">ACTIVE</option>
						    <option value="0">INACTIVE</option>
						</select>
					</div>
					<button class="btn btn-primary pull-right" id="btnSave">Save</button>
				</div>
			</div>

		</div>
      </div>
    </div>

  </div>
</div>


<div id="modalEditSystem" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-pencil"></i>  Update User Account Systems <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				<div class="text-center" id="editLoading2"><h2><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i><br>Populating Data...</h2></div>

				<div class="hidden" id="editBody2">
			    	<div class="form-group col-md-4">
						<label for="">First Name:</label>
						<input type="text" disabled="disabled" class="form-control" id="txtFname2">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Middle Name:</label>
						<input type="text" disabled="disabled" class="form-control" id="txtMname2">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Last Name:</label>
						<input type="text" disabled="disabled" class="form-control" id="txtLname2">
					</div>

					<div class="form-group col-md-6">
						<label for="">User Name:</label>
						<input type="hidden" class="form-control" id="txtUserID2">
						<input type="text" disabled="disabled" class="form-control" id="txtUsername2">
					</div>

					

					<div class="form-group col-md-6">
						<label for="">Email Address:</label>
						<input type="text" disabled="disabled" class="form-control" disabled="disabled" id="txtEmail2">
					</div>

					<div class="form-group col-md-12">
						<label for="">Information Systems:</label>
						<table class="table">
							<thead>
								<th width="50%">System</th>
								<th>Enrolment</th>
							</thead>
							<tbody id="user_sys">
							</tbody>
							
						</table>
					</div>
					
					<button class="btn btn-primary pull-right" id="btnSave2">Save</button>
				</div>
			</div>

		</div>
      </div>
    </div>

  </div>
</div>

<!-- Modal -->
<div id="modalAdd" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
       	<div class="panel panel-primary">
			<div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-plus"></i>  Add User Account <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

			<div class="panel-body">

				

				<div class="" id="addBody">

			    	<div class="form-group col-md-4">
						<label for="">First Name:</label>
						<input type="text" class="form-control" id="addtxtFname">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Middle Name:</label>
						<input type="text" class="form-control" id="addtxtMname">
					</div>
			    	<div class="form-group col-md-4">
						<label for="">Last Name:</label>
						<input type="text" class="form-control" id="addtxtLname">
					</div>

					<div class="form-group col-md-6">
						<label for="">User Name:</label>
						<input type="text"  class="form-control" id="addtxtUsername">
					</div>

					<div class="form-group col-md-6">
						<label for="">Password:  </label>
						<input type="password" class="form-control" id="addtxtPassword1">
						<div id=Adisplay_box class="msg1 hidden"></div>

						<ul  id="dA1" class="list-group">
			            <li class="list-group-item list-group-item-success">Password Conditions</li>
			            <li class="list-group-item" id=dA12><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter</li>
			            <li class="list-group-item" id=dA13 ><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter </li>
			            <li class="list-group-item" id=dA15><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number</li>
			            <li class="list-group-item" id=dA16><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char</li>
		            </ul>
					</div>

					

					<!-- <div class="form-group">
						<label for="">Password:</label>
						<input type="password" class="form-control" id="txtPassword2">
					</div> -->

					<div class="form-group col-md-6">
						<label for="">Email Address:</label>
						<input type="text" class="form-control" id="addtxtEmail">
					</div>
					<div class="form-group col-md-6">
						<label for="">Contact No.:</label>
						<input type="text" class="form-control" id="addtxtContact">
					</div>

					

					<div class="form-group col-md-12">
						<label for="">User Level:</label>
						<select class="form-control ddUserType" id="addddUserType">
						   
						</select>
					</div>

					<div class="form-group col-md-6">
						<label for="">Field Office:</label>
						<select style="width: 100%" class="form-control sel_field_office select2" id="addddSelOffice">
						   <option>Please choose</option>
						</select>
					</div>

					<div class="form-group col-md-6">
						<label for="">Office Position:</label>
						<select style="width: 100%" class="form-control sel_office_position select2" id="addddSelPosition">
						   <option>Please choose</option>
						</select>
					</div>

					<div class="form-group col-md-6">
						<label for="">Status:</label>
						<select class="form-control" id="addddUserStatus">
						    <option value="1">ACTIVE</option>
						    <option value="0">INACTIVE</option>
						</select>
					</div>

					<div class="form-group col-md-12">
						<button class="btn btn-primary pull-right" id="btnAddSubmit">Save</button>
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
        	if($.wms.dashboard.checkPermission("9")){
        		$.wms.modal.attachModalEvent();
	      		$('.filter-modal select').css('width', '100%')
	      		$(".select2").select2()


	          	$.wms.widget.attachWidgetEvent();

	    		$.wms.dashboard.attachPageEvent();
	    		$.wms.dashboard.attachUserListEvent();
	    		$.wms.dashboard.loadUserType("ddUserType")
	    		/*$.wms.dashboard.loadStationListCB("chk");*/	
        	}
        	
        }, 200);



        //PASSWD VALIDATION
        $("#dA1").fadeOut();
        $('#addtxtPassword1').blur(function(){
            $("#dA1").fadeOut();
        });
            ///////////
        $('#addtxtPassword1').focus(function(){
            $("#dA1").show();
            $('#dA12,#dA13,#dA14,#dA15,#dA16').css("color", "black");
        });


        //PASSWD VALIDATION
        $("#dU1").fadeOut();
        $('#txtUpdatePassword1').blur(function(){
            $("#dU1").fadeOut();
        });
            ///////////
        $('#txtUpdatePassword1').focus(function(){
            $("#dU1").show();
            $('#dU12,#dU13,#dU14,#dU15,#dU16').css("color", "black");
        });

        ////////////////////
        $('#addtxtPassword1').keyup(function(){
	        var str=$('#addtxtPassword1').val();
	        var upper_text= new RegExp('[A-Z]');
	        var lower_text= new RegExp('[a-z]');
	        var number_check=new RegExp('[0-9]');
	        var special_char= new RegExp('[!/\'^�$%&*()}{@#~?><>,|=_+�-\]');

	        var flag='T';

	        if(str.match(upper_text)){
	        $('#dA12').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Upper Case Letter ");
	        $('#dA12').css("color", "green");
	        }else{$('#dA12').css("color", "red");
	        $('#dA12').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter ");
	        flag='F';}

	        if(str.match(lower_text)){
	        $('#dA13').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Lower Case Letter ");
	        $('#dA13').css("color", "green");
	        }else{$('#dA13').css("color", "red");
	        $('#dA13').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter ");
	        flag='F';}

	        /*if(str.match(special_char)){
	        $('#d14').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Special Char ");
	        $('#d14').css("color", "green");
	        }else{
	        $('#d14').css("color", "red");
	        $('#d14').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Special Char ");
	        flag='F';}*/

	        if(str.match(number_check)){
	        $('#dA15').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Number ");
	        $('#dA15').css("color", "green");
	        }else{
	        $('#dA15').css("color", "red");
	        $('#dA15').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number ");
	        flag='F';}


	        if(str.length>7){
	        $('#dA16').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Length 8 Char ");

	        $('#dA16').css("color", "green");
	        }else{
	        $('#dA16').css("color", "red");
	        $('#dA16').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char ");

	        flag='F';}


	        if(flag=='T'){
	            $("#btnAddSubmit").removeClass("disabled")
	            
	            $("#addtxtPassword1").removeClass("error_field")
	            $("#dA1").fadeOut();
	            $('#display_box').css("color","green");
	            $('#display_box').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> "+str);
	        }else{
	            $("#btnAddSubmit").addClass("disabled")
	            $("#addtxtPassword1").addClass("error_field")
	            $("#dA1").show();
	            $('#display_box').css("color","red");
	            $('#display_box').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> "+str);
	        }
        });
        ///////////////////


        ////////////////////
        $('#txtUpdatePassword1').keyup(function(){
	        var str=$('#txtUpdatePassword1').val();
	        var upper_text= new RegExp('[A-Z]');
	        var lower_text= new RegExp('[a-z]');
	        var number_check=new RegExp('[0-9]');
	        var special_char= new RegExp('[!/\'^�$%&*()}{@#~?><>,|=_+�-\]');

	        var flag='T';

	        if(str.match(upper_text)){
	        $('#dU12').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Upper Case Letter ");
	        $('#dU12').css("color", "green");
	        }else{$('#dU12').css("color", "red");
	        $('#dU12').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter ");
	        flag='F';}

	        if(str.match(lower_text)){
	        $('#dU13').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Lower Case Letter ");
	        $('#dU13').css("color", "green");
	        }else{$('#dU13').css("color", "red");
	        $('#dU13').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter ");
	        flag='F';}


	        if(str.match(number_check)){
	        $('#dU15').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> One Number ");
	        $('#dU15').css("color", "green");
	        }else{
	        $('#dU15').css("color", "red");
	        $('#dU15').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number ");
	        flag='F';}


	        if(str.length>7){
	        $('#dU16').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Length 8 Char ");

	        $('#dU16').css("color", "green");
	        }else{
	        $('#dU16').css("color", "red");
	        $('#dU16').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char ");

	        flag='F';}


	        if(flag=='T'){
	        	if($(this).val().length>=1){
		            $("#btnSave").removeClass("disabled")
		            $("#txtUpdatePassword1").removeClass("error_field")
	        	}
	            $("#dU1").fadeOut();
	            $('#display_box').css("color","green");
	            $('#display_box').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> "+str);
	        }else{
	        	console.log()
	        	if($(this).val().length>=1){
		            $("#btnSave").addClass("disabled")
		            $("#txtUpdatePassword1").addClass("error_field")
	        	}
	            $("#dU1").show();
	            $('#display_box').css("color","red");
	            $('#display_box').html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span> "+str);
	        }
        });
        ///////////////////













        $('#addtxtPassword1').blur(function(){
        	$("#dA1").fadeOut();
        });
        ///////////
        $('#addtxtPassword1').focus(function(){
            $("#dA1").show();
        }); 


        $('#txtUpdatePassword1').blur(function(){
        	$("#dU1").fadeOut();
        });
        ///////////
        $('#txtUpdatePassword1').focus(function(){
            $("#dU1").show();
        });
        //PassWD Validation
   });
</script>