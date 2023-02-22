<div class="modal fade" id="form5modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
         
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
           <h4 class="modal-title" id="exampleModalLabel">Probation Caseload (FORM 5)</h4>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="" class="col-sm-2">Field Office</label>
            <div class="col-sm-10 filter-modal ">    
              <select class="form-control select2 modal sel_field_office" id="sel-modal-probation-field">
                
                <!-- <option value="">OFFICE 2</option> -->
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">Forms</label>
            <div class="col-sm-10 filter-modal ">  
              <select class="form-control select2 sel" id="sel-modal-probation-forms">
                <option value="F5PCS">PROBATION CASELOAD SUMMARY</option>
                <option value="F5T1">TABLE 1 - CARRY OVER PROBATION INVESTIGATION CASELOAD</option>
                <option value="F5T2">TABLE 2 - COURT INVESTIGATION REFERRALS RECEIVED, ACTED UPON, AND NOT ACTED UPON</option>
                <option value="F5T3">TABLE 3 - CARRY OVER PROBATION INVESTIGATION CASES PENDING DISPOSITION IN COURT</option>
                <option value="F5T4">TABLE 4 - PROBATION INVESTIGATION CASES DISPOSED OF BY THE COURT AND ISSUANCE OF</option>
                <option value="F5T5">TABLE 5 - CARRY OVER COURTESY PROBATION INVESTIGATION REFERRALS RECEIVED</option>
                <option value="F5T6">TABLE 6 - NEW COURTESY PROBATION INVESTIGATION REFERRALS RECEIVED, AND COMPLETED AND RETURNED</option>
                <option value="F5T7">TABLE 7 - CARRY OVER PROBATION SUPERVISION CASELOAD</option>
                <option value="F5T8">TABLE 8 - PROBATION SUPERVISION REFERRALS RECEIVED</option>
                <option value="F5T9">TABLE 9 - PROBATION SUPERVISION CASES ACTED UPON</option>
                <option value="F5T10">TABLE 10 - CARRY OVER PROBATION SUPERVISION CASES PENDING DISPOSITION IN COURT</option>
                <option value="F5T11">TABLE 11 - PROBATION SUPERVISION CASES DISPOSED OF BY THE COURT</option>
                <option value="F5T12">TABLE 12 - CARRY OVER COURTESY PROBATION SUPERVISION REFERRALS RECEIVED</option>
                <option value="F5T13">TABLE 13 - NEW COURTESY PROBATION SUPERVISION REFERRALS RECEIVED AND TERMINATED</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">Date</label>
            <div class="col-sm-10">    
              <input name="Date" id="modal-probation-date" class="sel_date date-picker form-control" value="<?php echo date("Y-m"); ?>" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-modal-probation">Proceed</button>
        </div>
      </div>
    </div>
  </div>




  <div class="modal fade"  id="form21modal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
       <div class="modal-header">
         
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
           <h4 class="modal-title" id="exampleModalLabel">Pre-Parole/Executive Clemency Caseload (FORM 21)</h4>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="" class="col-sm-2">Field Office</label>
            <div class="col-sm-10 filter-modal">    
             <select class="form-control select2 modal sel_field_office" id="sel-modal-parole-field">
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">Forms</label>
            <div class="col-sm-10 filter-modal">
              <select class="form-control select2" id="sel-modal-parole-forms">
                <option value="F21PCS">PRE-PAROLE/EXECUTIVE CLEMENCY CASELOAD SUMMARY</option>
                <option value="F21T1">Table 1 - CARRY OVER PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION CASELOAD</option>
                <option value="F21T2">Table 2 - PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION REFERRALS RECEIVED AND ACTED UPON</option>
                <option value="F21T3">Table 3 - CARRY OVER PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION CASES PENDING RESOLUTION BY THE BOARD</option>
                <option value="F21T4">Table 4 - PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION CASES RESOLVED BY THE BOARD</option>
                <option value="F21T5">Table 5 - CARRY OVER COURTESY PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION REFERRALS RECEIVED</option>
                <option value="F21T6">Table 6 - NEW COURTESY PRE-PAROLE/EXECUTIVE CLEMENCY INVESTIGATION REFERRALS RECEIVED AND COMPLETED AND RETURNED</option>
                <option value="F21T7">Table 7 - CARRY OVER PAROLE AND PARDON SUPERVISION CASELOAD</option>
                <option value="F21T8">Table 8 - PAROLE AND PARDON SUPERVISION REFERRALS RECEIVED</option>
                <option value="F21T9">Table 9 - PAROLE AND PARDON SUPERVISION CASES ACTED UPON</option>
                <option value="F21T10">Table 10 - CARRY OVER PAROLE AND PARDON SUPERVISION CASES PENDING RESOLUTION BY THE BOARD</option>
                <option value="F21T11">Table 11 - PAROLE AND PARDON SUPERVISION CASES RESOLVED BY THE BOARD</option>
                <option value="F21T12">Table 12 - CARRY OVER PAROLE AND PARDON SUPERVISION CASES PENDING RESOLUTION BY THE REGIONAL DIRECTOR</option>
                <option value="F21T13">Table 13 - PAROLE AND PARDON SUPVERVISION CASES RESOLVED BY THE REGIONAL DIRECTOR</option>
                <option value="F21T14">Table 14 - CARRY OVER COURTESY PAROLE AND PARDON SUPERVISION REFERRALS RECEIVED</option>
                <option value="F21T15">Table 15 - NEW COURTESY PAROLE AND PARDON SUPVERVISION REFERRALS RECEIVED AND TERMINATED</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">Date</label>
            <div class="col-sm-10">    
              <input name="Date" id="modal-parole-date" class="sel_date date-picker form-control" value="<?php echo date("Y-m"); ?>" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-modal-parole">Proceed</button>  
        </div>
      </div>
    </div>
  </div>




  <div class="modal fade" id="regionalmodal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
         
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
           <h4 class="modal-title" id="exampleModalLabel">Regional Reports</h4>
        </div>
        <div class="modal-body">
          

          <div class="form-group row">
            <label for="" class="col-sm-2">Report</label>
            <div class="col-sm-10 filter-modal ">  
              <select class="form-control select2 sel" id="sel-modal-regional-forms">
                <option value="f5_regional_pi_r1_p1">REGIONAL QUARTERLY PROBATION INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f5_regional_pi_r1_p2">REGIONAL QUARTERLY PROBATION INVESTIGATION CASELOAD PAGE 2</option>
                <option value="f5_regional_pi_r2">REGIONAL QUARTERLY COURT DISPOSITION OF PROBATION INVESTIGATION CASELOAD</option>
                <option value="f5_regional_pi_r3">REGIONAL QUARTERLY COURTESY PROBATION INVESTIGATION CASELOAD</option>
                <option value="f5_regional_pi_r4">REGIONAL QUARTERLY PROBATION INVESTIGATION DISPOSITION RATE</option>
                <option value="f5_regional_ps_r1_p1">REGIONAL QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 1</option>
                <option value="f5_regional_ps_r1_p2">REGIONAL QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 2</option>
                <option value="f5_regional_ps_r1_p3">REGIONAL QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 3</option>
                <option value="f5_regional_ps_r2_p1">REGIONAL QUARTERLY COURT DISPOSITION OF PROBATION SUPERVISION CASELOAD - PAGE 1</option>
                <option value="f5_regional_ps_r2_p2">REGIONAL QUARTERLY COURT DISPOSITION OF PROBATION SUPERVISION CASELOAD - PAGE 2</option>
                <option value="f5_regional_ps_r3">REGIONAL QUARTERLY COURTESY PROBATION SUPERVISION CASELOAD</option>
                <option value="f21_regional_ppi_r1_p1">REGIONAL QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f21_regional_ppi_r1_p2">REGIONAL QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 2</option>
                <option value="f21_regional_ppi_r1_p3">REGIONAL QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 3</option>
                <option value="f21_regional_ppi_r2_p1">REGIONAL QUARTERLY BOARD RESOLUTION OF PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f21_regional_ppi_r3">REGIONAL QUARTERLY COURTESY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD</option>
                <option value="f21_regional_ppi_r4_p1">REGIONAL QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION DISPOSITION RATE PAGE 1 </option>
                <option value="f21_regional_ppi_r4_p2">REGIONAL QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION DISPOSITION RATE PAGE 2</option>
                <option value="f21_regional_pr_pd_r1_p1">REGIONAL QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 1</option>
                <option value="f21_regional_pr_pd_r1_p2">REGIONAL QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 2</option>
                <option value="f21_regional_pr_pd_r1_p3">REGIONAL QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 3</option>
                <option value="f21_regional_pr_pd_r2_p1">REGIONAL QUARTERLY BOARD RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD PAGE 1</option>
                <option value="f21_regional_pr_pd_r2_p2">REGIONAL QUARTERLY BOARD RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD PAGE 2</option>
                <option value="f21_regional_pr_pd_r3">REGIONAL QUARTERLY REGIONAL DIRECTOR’S RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD</option>
                <option value="f21_regional_pr_pd_r4">REGIONAL QUARTERLY COURTESY PAROLE /PARDON SUPERVISION CASELOAD</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">As of:</label>
            <div class="col-sm-10 filter-modal">    
              <select class="select2" id="sel-modal-regional-quarter">
                <option value="2021-03">2021 1st Quarter</option>
                <option value="2020-12">2020 4th Quarter</option>
                <option value="2020-09">2020 3rd Quarter</option>
                <option value="2020-06">2020 2nd Quarter</option>
                <option value="2020-03">2020 1st Quarter</option>
                <option value="2019-12">2019 4th Quarter</option>
                <option value="2019-09">2019 3rd Quarter</option>
                <option value="2019-06">2019 2nd Quarter</option>
                <option value="2019-03">2019 1st Quarter</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-modal-regional">Proceed</button>
        </div>
      </div>
    </div>
  </div>




  <div class="modal fade" id="fieldmodal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
         
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
           <h4 class="modal-title" id="exampleModalLabel">Field Reports</h4>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="" class="col-sm-2">Regional Office</label>
            <div class="col-sm-10 filter-modal">    
             <select class="form-control select2 modal sel_regional_office" id="sel-modal-regional-field">
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">Report</label>
            <div class="col-sm-10 filter-modal ">  
              <select class="form-control select2 sel" id="sel-modal-field-forms">
                <option value="f5_field_office_pi_f1_p1">FIELD OFFICE QUARTERLY PROBATION INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f5_field_office_pi_f1_p2">FIELD OFFICE QUARTERLY PROBATION INVESTIGATION CASELOAD PAGE 2</option>
                <option value="f5_field_office_pi_f2">FIELD OFFICE QUARTERLY COURT DISPOSITION OF PROBATION INVESTIGATION CASELOAD</option>
                <option value="f5_field_office_pi_f3">FIELD OFFICE QUARTERLY COURTESY PROBATION INVESTIGATION CASELOAD</option>
                <option value="f5_field_office_pi_f4">FIELD OFFICE QUARTERLY PROBATION DISPOSITION RATE</option>
                <option value="f5_field_office_ps_f1_p1">FIELD OFFICE QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 1</option>
                <option value="f5_field_office_ps_f1_p2">FIELD OFFICE QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 2</option>
                <option value="f5_field_office_ps_f1_p3">FIELD OFFICE QUARTERLY PROBATION SUPERVISION CASELOAD PAGE 3</option>
                <option value="f5_field_office_ps_f2_p1">FIELD OFFICE QUARTERLY COURT DISPOSITION OF PROBATION SUPERVISION CASELOAD PAGE 1</option>
                <option value="f5_field_office_ps_f2_p2">FIELD OFFICE QUARTERLY COURT DISPOSITION OF PROBATION SUPERVISION CASELOAD PAGE 2</option>
                <option value="f5_field_office_ps_f3">FIELD OFFICE QUARTERLY COURTESY PROBATION SUPERVISION CASELOAD</option>

                <option value="f21_field_office_ppi_f1_p1">FIELD OFFICE QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f21_field_office_ppi_f1_p2">FIELD OFFICE QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 2</option>
                <option value="f21_field_office_ppi_f1_p3">FIELD OFFICE QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 3</option>
                <option value="f21_field_office_ppi_f2_p1">FIELD OFFICE QUARTERLY BOARD RESOLUTION OF PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 1</option>
                <option value="f21_field_office_ppi_f2_p2">FIELD OFFICE QUARTERLY BOARD RESOLUTION OF PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD PAGE 2</option>
                <option value="f21_field_office_ppi_f3">FIELD OFFICE QUARTERLY COURTESY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION CASELOAD</option>
                <option value="f21_field_office_ppi_f4_p1">FIELD OFFICE QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION DISPOSITION RATE PAGE 1</option>
                <option value="f21_field_office_ppi_f4_p2">FIELD OFFICE QUARTERLY PRE-PAROLE / EXECUTIVE CLEMENCY INVESTIGATION DISPOSITION RATE PAGE 2</option>
                <option value="f21_field_office_pr_pd_f1_p1">FIELD OFFICE QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 1</option>
                <option value="f21_field_office_pr_pd_f1_p2">FIELD OFFICE QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 2</option>
                <option value="f21_field_office_pr_pd_f1_p3">FIELD OFFICE QUARTERLY PAROLE /PARDON SUPERVISION CASELOAD PAGE 3</option>
                <option value="f21_field_office_pr_pd_f2_p1">FIELD OFFICE QUARTERLY BOARD RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD PAGE 1</option>
                <option value="f21_field_office_pr_pd_f2_p2">FIELD OFFICE QUARTERLY BOARD RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD PAGE 2</option>
                <option value="f21_field_office_pr_pd_f3">FIELD OFFICE QUARTERLY REGIONAL DIRECTOR’S RESOLUTION OF PAROLE /PARDON SUPERVISION CASELOAD</option>
                <option value="f21_field_office_pr_pd_f4">OFFICE QUARTERLY COURTESY PAROLE /PARDON SUPERVISION CASELOAD</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="" class="col-sm-2">As of:</label>
            <div class="col-sm-10 filter-modal">    
              <select class="select2" id="sel-modal-field-quarter">
                <option value="2021-03">2021 1st Quarter</option>
                <option value="2020-12">2020 4th Quarter</option>
                <option value="2020-09">2020 3rd Quarter</option>
                <option value="2020-06">2020 2nd Quarter</option>
                <option value="2020-03">2020 1st Quarter</option>
                <option value="2019-12">2019 4th Quarter</option>
                <option value="2019-09">2019 3rd Quarter</option>
                <option value="2019-06">2019 2nd Quarter</option>
                <option value="2019-03">2019 1st Quarter</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-modal-field">Proceed</button>
        </div>
      </div>
    </div>
  </div>




  <!-- Modal -->
<div id="modalChangePassword" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-body">
        <div class="panel panel-primary">
      <div class="panel-heading"> <h3 class="nav-pills" style="margin-top: 5px; margin-bottom: 5px;   font-size: 24px;"><i class="fa fa-pencil"></i>  Update Password <i class="pull-right fa fa-close"  data-dismiss="modal"></i></h3> </div>

      <div class="panel-body">

        

        <div class="" id="editBody">
           

          <div class="form-group">
            <label for="">User Name:</label>
            <input type="hidden" class="form-control" id="txtUserID">
            <input type="text" disabled="disabled" class="form-control" id="txtUsername_PW">
          </div>

          <div class="form-group">
            <label for="">Old Password: </label>
            <input type="password" class="form-control" id="txtPasswordOld">
          </div>

          <div class="form-group">
            <label for="">New Password: </label>
            <input type="password" class="form-control" id="txtPassword1">
            <div id=display_box class="msg1 hidden"></div>
          </div>

          <ul  id="d1" class="list-group">
            <li class="list-group-item list-group-item-success">Password Conditions</li>
            <li class="list-group-item" id=d12><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Upper Case Letter</li>
            <li class="list-group-item" id=d13 ><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Lower Case Letter </li>
            <li class="list-group-item" id=d15><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> One Number</li>
            <li class="list-group-item" id=d16><span class='glyphicon glyphicon-remove' aria-hidden='true'></span> Length 8 Char</li>
          </ul>

          <div class="form-group">
            <label for="">Retype Password: </label>
            <input type="password" class="form-control" id="txtPassword2">
          </div>

          <button class="btn btn-primary pull-right disabled" id="btnSavePassword">Save</button>
        </div>
      </div>

    </div>
      </div>
    </div>

  </div>
</div>



