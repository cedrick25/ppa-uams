# Second factor: fingerprint and Face ID

After a correct username and password, the sign-in screen asks for a second factor. SMS OTP is always available and is the fallback when fingerprint, Face ID, or PIN is not set up or fails. The one-time PIN is sent by SMS only. Login no longer emails an OTP.

Level 1 accounts still go straight to the dashboard after the password, the same as before.

Fingerprint uses the browser WebAuthn API (`navigator.credentials.create` to enroll, `navigator.credentials.get` to sign in). The server stores the public key and checks the signed challenge. The private key stays on the device.

Face ID uses only the camera you pick. Confirming the face on that camera finishes sign-in. It does not open Windows Hello and it does not ask for a fingerprint.

## What the browser can and cannot see

- **Built-in fingerprint.** Enabled when `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` is true. That means Windows Hello, Touch ID, or another platform authenticator is ready. If it is false, the built-in scanner choice stays disabled.
- **Futronic FS64.** Enabled when the browser can see a USB device with Futronic vendor id `0x1491` (the FS64 and other Futronic scanners). Browsers do not list USB devices until the user allows access, so **Check for Futronic FS64** opens the browser device picker. If the scanner is not plugged in, that choice stays disabled.
- **Built-in camera and third-party webcam.** After camera permission, the page lists `videoinput` devices. Labels such as Integrated, Built-in, FaceTime, TrueVision, or IR Camera are treated as the built-in camera. Other cameras are treated as third-party webcams. A missing group is disabled. If no camera exists, Face ID is disabled.
- **PIN.** A 4 to 8 digit PIN stored as a hash. It can be created on first use and changed from the PIN screen before sign-in finishes.
- **SMS OTP.** Always shown. It is sent only after this method is chosen, to the contact number already on the account. Nothing is sent to email at login.

WebAuthn is used for fingerprint only. Windows Hello matches the fingerprint. Face ID never calls WebAuthn, so choosing Face ID does not bring up a fingerprint prompt. The page turns Face ID on only when a camera is present, then matches the face on the camera you selected.

## Requirements

1. Use Chrome or Edge. Fingerprint (WebAuthn) and the camera both need a secure page: `https://` or `http://localhost`. A plain `http://192.168.x.x` address will disable fingerprint and Face ID. PIN and SMS still work there.
2. PHP OpenSSL on the API (`ppa-api-uams`) so fingerprint signature checks run.
3. The API creates these tables in `ppa_sso` on the first successful password check: `USER_2FA_SESSION`, `USER_PIN`, `USER_FACE`, `USER_WEBAUTHN`, `USER_WEBAUTHN_CHALLENGE`.

## Built-in fingerprint

1. On Windows, open **Settings > Accounts > Sign-in options**.
2. Turn on **Windows Hello Fingerprint** and enroll a finger on the laptop reader.
3. Sign in to UAMS with username and password.
4. Choose **Fingerprint**, then **Built-in fingerprint scanner**.
5. Windows opens **Choose a passkey**. Choose this computer, then confirm with the fingerprint already enrolled in Windows Hello. Do not choose a phone or a security key. The next sign-in on this computer asks for that same fingerprint.

The browser never receives the fingerprint image. Windows Hello is what decides the print matches. There is no shared passkey the site can install for every user.

## Futronic FS64

1. Install the Futronic FS64 driver from Futronic. For WebAuthn, also install the Windows Biometric Framework / Windows Hello driver for that scanner if Futronic provides one, then enroll a finger under **Settings > Accounts > Sign-in options > Fingerprint**.
2. Plug in the FS64.
3. On the second-factor screen, choose **Check for Futronic FS64** and allow the Futronic device in the browser prompt.
4. Choose **Fingerprint**, then **Futronic FS64**, and complete the Windows Hello prompt.

If another fingerprint reader is also enrolled in Windows Hello, Windows may offer that reader. Keep the FS64 as the fingerprint sign-in method you want the prompt to use.

The USB check only confirms the Futronic device is attached. Windows Hello still performs the match.

## Face ID

Face ID is a camera check. It does not use Windows Hello, and it does not ask for a fingerprint after you confirm.

1. Sign in with username and password, then choose **Face ID**.
2. Allow the camera. Pick **Built-in camera** or **Third-party webcam**. If several cameras are in that group, pick one from the list and check the preview.
3. Look at that camera. The first time, choose **Save Face ID**. Later sign-ins, stay in view of that camera. Face ID signs you in when the face matches, without another button.
4. A match on that camera opens the dashboard. If the face is not recognized, stay on the camera and try again, or use SMS OTP.

Use the same camera you enrolled. A fingerprint scanner is not part of this step.

## PIN and SMS

- **PIN.** Choose **PIN Code**. If none is stored, enter a new 4 to 8 digit PIN twice. That saves it and finishes sign-in. Next time, enter the PIN. **Change PIN** asks for the current PIN and the new one, then asks you to enter the new PIN.
- **SMS OTP.** Choose **SMS OTP** on the method screen, or **Use SMS OTP instead** after another method fails. The code goes to the user’s contact number. Resend stays available after 5 minutes. There is no email OTP on this step.

## Where it lives

- Login screen: `ppa-uams/application/views/login.php`
- Login script: `ppa-uams/assets/js/wms-login.js`
- API: `ppa-api-uams/application/controllers/wsv1/Api.php` and `application/models/API_model.php`
- WebAuthn checks: `ppa-api-uams/application/libraries/Webauthn_rp.php`
