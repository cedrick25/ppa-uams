<br/>
<div class="row ">
	<div class="col-md-12">
		<div class="panel panel-primary" >
        	<div class="panel-heading" >
				<span class="font_20">Feedback</span>

				<span class="pull-right"><button data-toggle="modal" data-target="#modal-addFeedback" class="btn btn-danger">Add Feedback</button></span>

			</div>
			<div class="panel-body">

				<table id="" class="table table-bordered table-darker table-condensed text-nowrap" style="width:100%">
 					<thead class="tb-header">
 						<th width="10%">Date</th>
 						<th>User</th>
 						<th>Field Office</th>
 						<th>Feedback Message</th>
 					</thead>
 					<tbody class="fb_msg">
 						
 					</tbody>
				</table>


				
			</div>
		</div>
	</div>
</div>






<!-- Add Modal -->
<div class="modal fade" id="modal-addFeedback"  role="dialog" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog" role="document">
    <form>
      <div class="modal-content">
        <div class="modal-header tb-header">
          <h4 class="modal-title" id=""><i class="fa fa-plus"></i> Add Feedback</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            
          </button>
        </div>
        <div class="modal-body modal-loader2 hidden">
          <div class="row b">
            <div><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Loading Data...</div>
          </div>
        </div>
        <div class="  modal-body modal-form">
          <div class="row" id="form_">
            <div class="col-lg-12">
              

            	<input type="hidden" id="addFeedbackForm">
            	<input type="hidden" id="addFeedbackField">
            	<input type="hidden" id="addFeedbackDate">
              <div class="form-group row">
                <label for="" class="col-sm-12">Feedback Message:</label>
                <div class="col-md-12">
                	<textarea class="form-control" id="addFeedbackMsg" ></textarea>
            	</div>
              </div>
             
              
            </div>
          </div>
          <div class="confirmFeedbackAdd hidden center">Make sure all details are correct. Click <b>Confirm</b> button to proceed: </div>
        </div>
        <div class="modal-footer" id="modal_footer">

          <button type="button" class="btn btn-sm btn-secondary addFeedbackCancelButton" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-sm btn-primary addFeedbackSubmitButton">Submit</button>
          <button type="button" class="btn btn-sm btn-primary hidden addFeedbackProceedButton">Confirm <span class="pull-right modal-loader hidden"><i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i></span></button>
        </div>
      </div>
      <input type="reset" class="hidden btn-reset">
    </form>
  </div>
</div>
<!-- Add Modal -->