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
#sfModal .modal-content {
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
#sfModal .modal-header {
  position: relative;
  padding: 20px 56px 16px 24px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
}
#sfModal .sf-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #4b5565;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
}
#sfModal .sf-close:hover,
#sfModal .sf-close:focus {
  background: #eceff4;
  color: #111827;
  outline: none;
}
#sfModal .modal-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.2;
  color: #111827;
}
#sfModal .modal-body {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 16px 24px 24px;
}
#divSecondFactor,
#divSfFingerprint,
#divSfFutronic,
#divSfFace,
#divSfPin,
#divLoginOTP,
#pinEnter,
#pinSetup,
#pinChange {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
#sfModal .sf-kicker {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  color: #111827;
}
#sfModal .sf-note,
#sfModal #futronicLead,
#sfModal #futronicStep1,
#sfModal #futronicStep2,
#sfModal #sfDeviceNote,
#sfModal #faceGuideNote {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #4b5565;
}
#sfModal .sf-note:empty,
#sfModal #fpHint:empty,
#sfModal #sfDeviceNote:empty,
#sfModal #faceHint:empty {
  display: none;
}
#sfModal strong {
  font-weight: 500;
}
#sfModal .btn-block {
  text-align: left;
  padding-left: 16px;
  padding-right: 16px;
}
#sfModal .btn {
  min-height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: none;
  transition: background-color 160ms cubic-bezier(0.22, 1, 0.36, 1), border-color 160ms cubic-bezier(0.22, 1, 0.36, 1), color 160ms cubic-bezier(0.22, 1, 0.36, 1);
}
#sfModal .btn:focus {
  outline: 2px solid #255b89;
  outline-offset: 2px;
}
#sfModal .btn-primary {
  background: #255b89;
  border-color: #255b89;
  color: #fff;
}
#sfModal .btn-primary:hover,
#sfModal .btn-primary:focus {
  background: #1d4b73;
  border-color: #1d4b73;
  color: #fff;
}
#sfModal .sf-choice,
#sfModal .btn-default {
  background: #fff;
  color: #111827;
  border: 1px solid rgba(17, 24, 39, 0.1);
  text-align: left;
}
#sfModal .sf-choice:hover:not(:disabled),
#sfModal .btn-default:hover {
  background: #eceff4;
  color: #111827;
}
#sfModal .sf-choice:disabled {
  opacity: 0.45;
}
#sfModal .btn-link {
  min-height: 32px;
  padding: 4px 0;
  color: #255b89;
  text-align: left;
  border: 0;
  background: transparent;
}
#sfModal .alert {
  margin: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
#sfModal .form-control {
  min-height: 44px;
  border-radius: 8px;
  font-size: 15px;
  box-shadow: none;
}
#sfModal .form-control.pin-mask {
  -webkit-text-security: disc;
  text-security: disc;
}
#pinNumpad {
  display: grid;
  grid-template-columns: repeat(3, 76px);
  justify-content: center;
  gap: 14px 18px;
  padding: 4px 0 8px;
}
#sfModal #pinNumpad .pin-key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  min-height: 76px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #eceff4;
  color: #111827;
  box-shadow: none;
  text-align: center;
  line-height: 1;
}
#sfModal #pinNumpad .pin-key:hover {
  background: #e2e7ef;
  color: #111827;
}
#sfModal #pinNumpad .pin-key:active {
  background: #d3dae4;
}
#sfModal #pinNumpad .pin-digit {
  font-size: 28px;
  font-weight: 500;
  line-height: 1;
}
#sfModal #pinNumpad .pin-letters {
  margin-top: 3px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  color: #6b7487;
}
#sfModal #pinNumpad .pin-key-spacer {
  visibility: hidden;
  pointer-events: none;
}
#sfModal #pinNumpad .pin-key-back {
  background: transparent;
}
#sfModal #pinNumpad .pin-key-back svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
#sfModal #pinNumpad .pin-key-back:hover,
#sfModal #pinNumpad .pin-key-back:active {
  background: #eceff4;
}
#sfModal .input-group-addon {
  border-radius: 8px 0 0 8px;
  background: #f5f7fa;
  color: #4b5565;
  border-color: rgba(17, 24, 39, 0.1);
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
#faceOval.ready {
  border-color: #2e9e4f;
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
#futronicVisual {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0 12px;
  color: #111827;
}
#futronicVisual .fp-icon {
  width: 72px;
  height: 72px;
  color: #6b7487;
}
#futronicVisual[data-phase="waiting"] .fp-icon,
#futronicVisual[data-phase="place"] .fp-icon,
#futronicVisual[data-phase="place-again"] .fp-icon,
#futronicVisual[data-phase="match"] .fp-icon {
  color: #255b89;
}
#futronicVisual[data-phase="lift"] .fp-icon { color: #9a6b12; }
#futronicVisual[data-phase="done"] .fp-icon { color: #16a34a; }
#futronicVisual[data-phase="error"] .fp-icon { color: #dc2626; }
#futronicVisualCaption {
  margin: 8px 0 0;
  font-size: 20px;
  line-height: 1.25;
  font-weight: 500;
  text-align: center;
  color: #111827;
}
#futronicScanCount {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  color: #6b7487;
  font-variant-numeric: tabular-nums;
}
#futronicStatus {
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #4b5565;
}
#futronicStatus.alert-danger { color: #dc2626; }
#futronicStatus.alert-success { color: #16a34a; }
@media (max-width: 480px) {
  #sfModal .modal-body { padding: 16px; }
  #futronicVisual { padding: 12px; }
  #futronicVisualCaption { font-size: 18px; }
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
				<button type="button" class="sf-close" id="btnSfClose" aria-label="Close">&times;</button>
				<h4 class="modal-title" id="sfModalTitle">Second authentication</h4>
			</div>
			<div class="modal-body">
									<div class="alert alert-danger hidden" role="alert" id="divSfAlert"></div>

									<div id="divSecondFactor" class="hidden">
										<div class="alert alert-success hidden" role="alert" id="divSfSuccess">
										  <i class="fa fa-check"></i>
										  Verified. Redirecting to the dashboard
										</div>
										<div class="alert alert-warning hidden" role="alert" id="divSfSecure">
										  Built-in fingerprint and Face ID require a secure page (HTTPS, or localhost). Futronic FS64, PIN, and SMS OTP stay available.
										</div>
										<p class="sf-kicker">Choose a second authentication method</p>
										<p class="sf-note" id="sfDeviceNote"></p>
										<button type="button" id="btnSfFingerprint" class="btn btn-block sf-choice" disabled>Fingerprint</button>
										<button type="button" id="btnSfFace" class="btn btn-block sf-choice" disabled>Face ID</button>
										<button type="button" id="btnSfPin" class="btn btn-block sf-choice">PIN</button>
										<button type="button" id="btnSfSms" class="btn btn-block sf-choice">SMS OTP</button>
									</div>

									<div id="divSfFingerprint" class="hidden">
										<p class="sf-kicker">Choose a fingerprint scanner</p>
										<div class="alert alert-info" role="alert" id="fpHint"></div>
										<button type="button" id="btnFpBuiltin" class="btn btn-block sf-choice" disabled>Built-in fingerprint scanner</button>
										<button type="button" id="btnFpFutronic" class="btn btn-block sf-choice" disabled>Futronic FS64</button>
										<button type="button" id="btnFpBack" class="btn btn-default btn-block">Back</button>
										<button type="button" id="btnFpSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divSfFutronic" class="hidden">
										<p class="sf-kicker" id="futronicTitle">Register your fingerprint</p>
										<p class="sf-note" id="futronicLead">Registration uses two scans of the same finger. A fingerprint saved in Windows Hello is not used.</p>
						<div id="futronicVisual" data-phase="idle" data-purpose="enroll">
							<svg class="fp-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
								<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
									<path d="M32 44.5c0-5.2 3.4-7.6 3.4-12.4a3.4 3.4 0 0 0-6.8 0"/>
									<path d="M23.2 43.2c.3-6.4 2.8-10.2 8.8-13.6 6 3.4 8.5 7.2 8.8 13.6"/>
									<path d="M17.6 40.4c.8-9.2 4.8-15.6 14.4-19.8 9.6 4.2 13.6 10.6 14.4 19.8"/>
									<path d="M13 36.2c1.4-12 6.6-20.4 19-25 12.4 4.6 17.6 13 19 25"/>
									<path d="M32 44.8v5.2"/>
									<path d="M24.4 48.6c1.1 3 3.8 5 7.6 5s6.5-2 7.6-5"/>
								</g>
							</svg>
							<p id="futronicVisualCaption">Ready to register</p>
							<p id="futronicScanCount" class="hidden"></p>
						</div>
						<p id="futronicLive" class="sr-only" aria-live="polite" aria-atomic="true"></p>
										<p id="futronicStep1"><strong>1.</strong> When the picture says place and the light is on, put one finger flat on the glass and hold still.</p>
										<p id="futronicStep2"><strong>2.</strong> When it says lift, take that finger off. Then place the same finger again when the light comes back on.</p>
										<div class="alert alert-info" id="futronicStatus" aria-live="off">Starting the scanner. Keep your finger off the glass until the picture says to place it.</div>
										<button type="button" id="btnFutronicStart" class="btn btn-primary btn-block hidden">Scan fingerprint</button>
										<button type="button" id="btnFutronicBack" class="btn btn-default btn-block">Back</button>
										<button type="button" id="btnFutronicOther" class="btn btn-default btn-block hidden">Other authentication options</button>
									</div>

									<div id="divSfFace" class="hidden">
										<p class="sf-note hidden" id="faceHint"></p>
										<button type="button" id="btnFaceBuiltin" class="btn btn-block sf-choice" disabled>Built-in camera</button>
										<button type="button" id="btnFaceWebcam" class="btn btn-block sf-choice" disabled>Third-party webcam</button>
										<select id="selFaceCamera" class="form-control hidden"></select>
										<div id="faceStage">
											<video id="facePreview" autoplay playsinline muted></video>
											<div id="faceGuide">
												<div id="faceOval"></div>
												<div id="faceGrid"></div>
											</div>
										</div>
										<p class="sf-note" id="faceGuideNote" style="display:none;"></p>
										<button type="button" id="btnFaceContinue" class="btn btn-primary btn-block hidden">Confirm Face ID</button>
										<button type="button" id="btnFaceBack" class="btn btn-default btn-block">Back</button>
										<button type="button" id="btnFaceSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divSfPin" class="hidden">
										<div class="alert alert-info" role="alert" id="divPinInfo">Enter your PIN</div>
										<div id="pinEnter">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPin" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="PIN" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<button type="button" id="btnPinChangeShow" class="btn btn-default btn-block">Change PIN</button>
										</div>
										<div id="pinSetup" class="hidden">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinNew" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="New PIN, 4 digits" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinConfirm" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="Confirm PIN" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<button type="button" id="btnPinSave" class="btn btn-primary btn-block">Save PIN and continue</button>
										</div>
										<div id="pinChange" class="hidden">
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinCurrent" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="Current PIN" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinChangeNew" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="New PIN, 4 digits" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<div class="input-group">
												<span class="input-group-addon"><i class="fa fa-lock"></i></span>
												<input id="txtPinChangeConfirm" type="text" inputmode="numeric" maxlength="4" class="form-control pin-mask" placeholder="Confirm new PIN" autocomplete="off" spellcheck="false" autocapitalize="off" data-lpignore="true" data-1p-ignore="true">
											</div>
											<button type="button" id="btnPinUpdate" class="btn btn-primary btn-block">Update PIN</button>
										</div>
										<div id="pinNumpad" class="hidden" role="group" aria-label="PIN keypad">
											<button type="button" class="pin-key" data-digit="1"><span class="pin-digit">1</span></button>
											<button type="button" class="pin-key" data-digit="2"><span class="pin-digit">2</span><span class="pin-letters">ABC</span></button>
											<button type="button" class="pin-key" data-digit="3"><span class="pin-digit">3</span><span class="pin-letters">DEF</span></button>
											<button type="button" class="pin-key" data-digit="4"><span class="pin-digit">4</span><span class="pin-letters">GHI</span></button>
											<button type="button" class="pin-key" data-digit="5"><span class="pin-digit">5</span><span class="pin-letters">JKL</span></button>
											<button type="button" class="pin-key" data-digit="6"><span class="pin-digit">6</span><span class="pin-letters">MNO</span></button>
											<button type="button" class="pin-key" data-digit="7"><span class="pin-digit">7</span><span class="pin-letters">PQRS</span></button>
											<button type="button" class="pin-key" data-digit="8"><span class="pin-digit">8</span><span class="pin-letters">TUV</span></button>
											<button type="button" class="pin-key" data-digit="9"><span class="pin-digit">9</span><span class="pin-letters">WXYZ</span></button>
											<span class="pin-key pin-key-spacer" aria-hidden="true"></span>
											<button type="button" class="pin-key" data-digit="0"><span class="pin-digit">0</span></button>
											<button type="button" class="pin-key pin-key-back" data-action="back" aria-label="Delete"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.4 5.2h11.1A1.6 1.6 0 0 1 21.1 6.8v10.4a1.6 1.6 0 0 1-1.6 1.6H8.4c-.5 0-.9-.2-1.2-.6L2.4 12.7a1 1 0 0 1 0-1.4l4.8-5.5c.3-.4.7-.6 1.2-.6z"/><path d="M11.1 9.2l4.8 5.6M15.9 9.2l-4.8 5.6"/></svg></button>
										</div>
										<button type="button" id="btnPinBack" class="btn btn-default btn-block">Back</button>
										<button type="button" id="btnPinSms" class="btn btn-link">Use SMS OTP instead</button>
									</div>

									<div id="divLoginOTP"  class="hidden">

									  	
										<input type="hidden" id="otpkeygen" value="">
										<div class="alert alert-danger hidden" role="alert" id="divInactive">
										  <i class="fa fa-exclamation-triangle"></i>
										  <span class="sr-only">Error:</span>
										  This account is inactive. Contact the system administrator.
										</div>

										<div class="alert alert-success hidden" role="alert" id="divOtpSuccess">
										  <i class="fa fa-check"></i>
										  OTP verified. Redirecting to the dashboard
										</div>

										<div class="alert alert-info" role="alert" id="divOtpEnter">
										  <i class="fa fa-info"></i>
										  A one-time PIN was sent to your contact number. It expires in 5 minutes.
										</div>

										<div class="input-group">
											<span class="input-group-addon"><i class="fa fa-key"></i></span>
											<input id="txtLoginOtp" type="text" class="form-control" placeholder="One-time PIN" autocomplete="one-time-code">
										</div>

										<button id="btnLoginOtp" class="btn btn-primary btn-block">Submit OTP</button>
										<button id="btnResendOtp" class="hidden btn btn-default btn-block">Resend OTP</button>
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
