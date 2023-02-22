<div class="container header2" >
  <div class="row" style="background-color: #22313f">
    <div class="col-md-12" style="height:20px">

    </div>
  </div>
	<div class="row" style="background-color: #f8f8f8;box-shadow: 0 0 10px black;">
    <div class="col-lg-4 col-md-6 col-xs-8">
      
      
        <img height="96" style="padding:10px; display:inline-block; float:left;" src="<?php echo BASE_URL(); ?>assets/img/ppa-logo.png"> 
        <div style="float:left; padding-top:15px" class="pagasa-text">
          <span class="republic">Republic of the Philippines</span><br/>
          <span class="republic">Department of Justice</span><br/>
          <span class="pagasa">Parole and Probation Administration</span>
        </div>

         <nav class="visible-xs navbar navbar-default navbar-static-top" role="navigation" style="width:100%;float:left;">


          <div class="navbar-header">
            <span class="loggedin" style="display: none">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-2" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand visible-xs loggedin" style="display: none" href="#">Navigation</a>
             </span>
          </div>

               <div class="collapse navbar-collapse" id="navbar-collapse-2"  >
                    <ul class="nav navbar-nav" >
                       <li id="navHome1" class="loggedin"  style="display: none"><a href="dashboard"><i class="fa fa-home"></i> Dashboard</a></li>   

                      <!--  <li id="navRF" class="loggedin" style="display: none"><a href="rainfall_dashboard"><i class="fa fa-tint"></i> Rain Fall Monitoring</a></li>    -->
                       <li class="dropdown loggedin" id="navRF" style="display: none">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-tint"></i> Caseload  <b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               
                                <li><a href="#" data-toggle="modal" data-target="#form5modal">Probation Caseload</a></li>
                                <li><a href="#">Parole/Executive Clemency Caseload</a></li> 
                            </ul>
                        </li>

                        <li class="dropdown loggedin" id="navRF1" style="display: none">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-tint"></i> Reports  <b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               
                                <li><a href="#">Probation Caseload</a></li>
                                <li><a href="#">Parole/Executive Clemency Caseload</a></li> 
                            </ul>
                        </li>
<!-- 
                         <li class="dropdown loggedin" id="navRF1" style="display: none">
                               <a href="probationer" ><i class="fa fa-users"></i> Master List  </a>
                              
                        </li> -->

                        

                        <li class="dropdown adminTools" id="navMT1" style="display: none">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-wrench"></i> Maintenance <b class="caret"></b></a>
                              <ul class="dropdown-menu">
                                <li><a href="user_list">User Accounts</a></li>
                                <li><a href="audit">Audit Trail</a></li>
                            </ul>
                        </li>


                        <li class="loggedin" id="btnLogout" style="display: none"><a href="#"><i class="fa fa-sign-out"></i>  Logout</a></li>   
                    </ul>

              </div>
       </nav>
    </div>
    <div class="col-md-12 col-lg-8 col-xs-4 ">
      <div style="padding-top:20px" class="hidden-xs"></div>
      <nav class="navbar navbar-default navbar-static-top hidden-xs" role="navigation" style="float:left;">


          <div class="navbar-header">
            <span class="loggedin" style="display: none">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand visible-xs loggedin" style="display: none" href="#"> </a>
             </span>
          </div>

              <div class="collapse navbar-collapse" id="navbar-collapse-1"  >
                    <ul class="nav navbar-nav" >
                       <li id="navHome" class="loggedin"  style="display: none"><a href="dashboard"><i class="fa fa-home"></i> Dashboard</a></li>   

                      <!--  <li id="navRF" class="loggedin" style="display: none"><a href="rainfall_dashboard"><i class="fa fa-tint"></i> Rain Fall Monitoring</a></li>    -->
                        <li class="dropdown adminTools access_maintenance" id="navMT" style="display: none">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-wrench"></i> Data Operations <b class="caret"></b></a>
                              <ul class="dropdown-menu">
                                <li><a href="information_systems">Information Systems</a></li>
                                <li><a href="user_system_list">System Users Status</a></li>
                                <li><a href="user_list">User Accounts</a></li>
                                <li><a href="user_position">User Position</a></li>
                                <li><a href="user_level">User Level</a></li>
                                <li><a href="field_offices">Field Offices</a></li>
                                 <li><a href="audit">Audit Trail</a></li>
                                <!--<li><a href="backup_restore">Backup & Restore</a></li> -->
                                
                            </ul>
                        </li>

<!-- 
                        <li class="dropdown loggedin reports hidden" id="navRF" style="display: none">
                              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-tint"></i> Reports  <b class="caret"></b></a>
                              <ul class="dropdown-menu">
                               
                                <li><a href="#" class="access_report_regional" data-toggle="modal" data-target="#regionalmodal">Regional</a></li>
                                <li><a href="#" class="access_report_field" data-toggle="modal" data-target="#fieldmodal">Field</a></li> 
                            </ul>
                        </li> -->


                        <li class="loggedin" id="btnChangepassword" style="display: none"><a href="#"><i class="fa fa-gear"></i>  Change Password</a></li>   
                        <li class="loggedin" id="btnLogout" style="display: none"><a href="#"><i class="fa fa-sign-out"></i>  Logout</a></li>   
                    </ul>

              </div>
       </nav>
   
        <span class="pull-right">
         
         <!--  <iframe frameBorder="0" width="200px" height="90px" src="https://oras.pagasa.dost.gov.ph/widget.shtml" scrolling="no"></iframe> -->
        </span>
       


       


    </div>

	</div>

</div>
 <div class="row" style="background-color: #22313f">
    <div class="col-md-12" style="height:20px">

    </div>
  </div>