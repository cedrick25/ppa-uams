<?php $this->load->view('templates/header.php'); ?> 
<body style="background-color: #f1f1f1;">
<?php $this->load->view('templates/nav.php'); ?> 
<style>
.container {
  background: url(assets/img/bg-uams.jpg);
  /* Full height */
  height: 100%; 

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#sfModal.in {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
#sfModal .modal-dialog {
  width: 560px;
  max-width: calc(100vw - 24px);
  margin: 0;
}
#sfModal .modal-body {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
#sfModal .modal-body > div > div:not([class]):not([id]) {
  height: 8px;
  line-height: 8px;
  overflow: hidden;
}
#faceStage {
  position: relative;
  width: 100%;
  height: 280px;
  background: #111;
  overflow: hidden;
  display: none;
}
#facePreview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #111;
}
#faceGuide {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 148px;
  height: 196px;
  transform: translate(-50%, -52%);
  pointer-events: none;
}
#faceOval {
  position: absolute;
  inset: 0;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.28);
}
#faceGrid {
  position: absolute;
  left: 18%;
  right: 18%;
  top: 8%;
  bottom: 8%;
  display: none;
  grid-template-columns: repeat(16, 1fr);
  grid-template-rows: repeat(16, 1fr);
}
#faceGrid.on {
  display: grid;
}
#faceGrid span.mismatch {
  background: rgba(214, 40, 40, 0.72);
}
</style>

<div class="container" >

	<div class="row" >
		<div class="col-md-12" style="height: 650px;">
				<div class="">
					 <div class="">
					 	<div class="col-md-6">
							</div>		

							<div class="col-md-6">
								<div class="panel panel-default panel-primary" style="
    margin-top: 180px!important;
    margin-left: auto!important;
    margin-right: auto!important;
    width: 630px!important ;">
								  <div class="panel-heading ppa-f24"><center>Unified Access Management Solution<br/>Information System</center></div>
								  <div class="panel-body">
									

								  	
								  	<div class="alert alert-info" role="alert"  style="font-weight: bolder" id="divLoading">
									  <i class="fa fa-refresh fa-spin fa-1x fa-fw spin"></i> Loading...
									</div>

									<div id="divLogin" style="display:none">

									  	<div class="alert alert-danger hidden" role="alert" id="divAlert">
										  <i class="fa fa-exclamation-triangle"></i>
										  <span class="sr-only">Error:</span>
										  Enter a valid Username/Password
										</div>

										<div class="alert alert-danger hidden" role="alert" id="divInactive">
										  <i class="fa fa-exclamation-triangle"></i>
										  <span class="sr-only">Error:</span>
										  User is currently inactive. Please contact System Administrator!
										</div>

										<div class="alert alert-success hidden" role="alert" id="divSuccess">
										  <i class="fa fa-check"></i>
										  Success! Redirecting...
										</div>


										<div class="input-group">
											<span class="input-group-addon" ><i class="fa fa-user"></i>&nbsp;</span>
											<input id="txtUsername" type="text" class="form-control font_18" placeholder="Email">

										</div>

										<div>&nbsp;</div>

										<div class="input-group">
											<span class="input-group-addon" ><i class="fa fa-key"></i></span>
											<input id="txtPassword" type="password" class="form-control font_18" placeholder="Password">
										</div>

										<div>&nbsp;</div>

										<div><button id="btnLogin" class="btn btn-primary btn-block pull-right font_20">Log In</button></div>
									</div>
								  </div>
								</div>
							</div>
					 </div>
				 </div>
		 </div>
	</div>
</div>

<div class="modal fade" id="sfModal" tabindex="-1" role="dialog" aria-labelledby="sfModalTitle">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title" id="sfModalTitle">Second authentication</h4>
			</div>
			<div class="modal-body">
									<div class="alert alert-danger hidden" role="alert" id="divSfAlert"></div>

									<div id="divSecondFactor" class="hidden">
										<div class="alert alert-success hidden" role="alert" id="divSfSuccess">
										  <i class="fa fa-check"></i>
										  Verified. Redirecting to dashboard...
										</div>
										<div class="alert alert-warning hidden" role="alert" id="divSfSecure">
										  Fingerprint and Face ID require a secure page (HTTPS, or localhost). PIN and SMS OTP stay available.
										</div>
										<p class="font_18" style="font-weight:bold;">Choose a second authentication method</p>
										<p class="text-muted" id="sfDeviceNote"></p>
										<button type="button" id="btnSfFingerprint" class="btn btn-primary btn-block font_20" disabled>Fingerprint</button>
										<div>&nbsp;</div>
										<button type="button" id="btnSfFace" class="btn btn-primary btn-block font_20" disabled>Face ID</button>
										<div>&nbsp;</div>
										<button type="button" id="btnSfPin" class="btn btn-primary btn-block font_20">PIN Code</button>
										<div>&nbsp;</div>
										<button type="button" id="btnSfSms" class="btn btn-default btn-block font_20">SMS OTP</button>
										<div>&nbsp;</div>
										<button type="button" id="btnSfCheckFutronic" class="btn btn-link">Check for Futronic FS64</button>
									</div>

									<div id="divSfFingerprint" class="hidden">
										<p class="font_18" style="font-weight:bold;">Choose a fingerprint scanner</p>
										<p class="text-muted" id="fpHint"></p>
										<button type="button" id="btnFpBuiltin" class="btn btn-primary btn-block font_20" disabled>Built-in fingerprint scanner</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFpFutronic" class="btn btn-primary btn-block font_20" disabled>Futronic FS64</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFpBack" class="btn btn-default btn-block font_20">Back</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFpSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divSfFace" class="hidden">
										<p class="text-muted hidden" id="faceHint"></p>
										<button type="button" id="btnFaceBuiltin" class="btn btn-primary btn-block font_20" disabled>Built-in camera</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFaceWebcam" class="btn btn-primary btn-block font_20" disabled>Third-party webcam</button>
										<div>&nbsp;</div>
										<select id="selFaceCamera" class="form-control font_18 hidden"></select>
										<div>&nbsp;</div>
										<div id="faceStage">
											<video id="facePreview" autoplay playsinline muted></video>
											<div id="faceGuide">
												<div id="faceOval"></div>
												<div id="faceGrid"></div>
											</div>
										</div>
										<p class="text-muted" id="faceGuideNote" style="display:none;"></p>
										<div>&nbsp;</div>
										<button type="button" id="btnFaceContinue" class="btn btn-primary btn-block font_20 hidden">Confirm Face ID</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFaceBack" class="btn btn-default btn-block font_20">Back</button>
										<div>&nbsp;</div>
										<button type="button" id="btnFaceSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divSfPin" class="hidden">
										<div class="alert alert-info" role="alert" id="divPinInfo">Enter your PIN code.</div>
										<div id="pinEnter">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPin" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="PIN code" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<button type="button" id="btnPinSubmit" class="btn btn-primary btn-block font_20">Submit PIN</button>
											<div>&nbsp;</div>
											<button type="button" id="btnPinChangeShow" class="btn btn-default btn-block font_20">Change PIN</button>
										</div>
										<div id="pinSetup" class="hidden">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinNew" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="New PIN (4 to 8 digits)" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinConfirm" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="Confirm PIN" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<button type="button" id="btnPinSave" class="btn btn-primary btn-block font_20">Save PIN and continue</button>
										</div>
										<div id="pinChange" class="hidden">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinCurrent" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="Current PIN" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinChangeNew" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="New PIN (4 to 8 digits)" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinChangeConfirm" type="password" inputmode="numeric" maxlength="8" class="form-control font_18" placeholder="Confirm new PIN" autocomplete="off">
											</div>
											<div>&nbsp;</div>
											<button type="button" id="btnPinUpdate" class="btn btn-primary btn-block font_20">Update PIN</button>
										</div>
										<div>&nbsp;</div>
										<button type="button" id="btnPinBack" class="btn btn-default btn-block font_20">Back</button>
										<div>&nbsp;</div>
										<button type="button" id="btnPinSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divLoginOTP"  class="hidden">

									  	
										<input type="hidden" id="otpkeygen" value="">
										<div class="alert alert-danger hidden" role="alert" id="divInactive">
										  <i class="fa fa-exclamation-triangle"></i>
										  <span class="sr-only">Error:</span>
										  User is currently inactive. Please contact System Administrator!
										</div>

										<div class="alert alert-success hidden" role="alert" id="divOtpSuccess">
										  <i class="fa fa-check"></i>
										  OTP verified Success! Redirecting to dashboard...
										</div>

										<div class="alert alert-info " role="alert" id="divOtpEnter">
										  <i class="fa fa-info"></i>
										  One Time PIN (OTP) key has been sent to your Contact Number. The key will be expire in 5 Minutes.
										</div>
										

										<div class="input-group">
											<span class="input-group-addon" ><i class="fa fa-key"></i></span>
											<input id="txtLoginOtp" type="text" class="form-control font_18" placeholder="One Time PIN">
										</div>

										<div>&nbsp;</div>

										<div>
											<button id="btnResendOtp" class="hidden btn btn-success btn-block pull-right font_20">Resend OTP</button>
											<button id="btnLoginOtp" class="btn btn-primary btn-block pull-right font_20">Submit OTP</button>

											
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
        		$.wms.login.attachLoginEvent();

            }, 150);
       });
	</script>