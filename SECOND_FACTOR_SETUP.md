# Second factor: fingerprint and Face ID

After a correct username and password, the sign-in screen asks for a second factor. SMS OTP is always available and is the fallback when fingerprint, Face ID, or PIN is not set up or fails. The one-time PIN is sent by SMS only. Login no longer emails an OTP.

Level 1 accounts still go straight to the dashboard after the password, the same as before.

Built-in fingerprint uses the browser WebAuthn API (`navigator.credentials.create` to enroll, `navigator.credentials.get` to sign in). The server stores the public key and checks the signed challenge. The private key stays on the device. The Futronic FS64 does not use WebAuthn. A helper on the scanner PC captures the finger, and the API stores that template.

Face ID uses only the camera you pick. Confirming the face on that camera finishes sign-in. It does not open Windows Hello and it does not ask for a fingerprint.

## What the browser can and cannot see

- **Built-in fingerprint.** Enabled when `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` is true. That means Windows Hello, Touch ID, or another platform authenticator is ready. If it is false, the built-in scanner choice stays disabled.
- **Futronic FS64.** Enabled when `http://127.0.0.1:17364/health` reports the scanner is open. **Connect Futronic FS64** starts the installed helper, then asks it again. It does not open a USB device picker. The page does not need to be HTTPS for this scanner. The browser asks once for permission to open the helper. After that, the person at the scanner does not start the program by hand. The helper closes after a successful sign-in, when they leave the Futronic step, when they switch to SMS OTP, and after 90 seconds with no scan.
- **Built-in camera and third-party webcam.** After camera permission, the page lists `videoinput` devices. Labels such as Integrated, Built-in, FaceTime, TrueVision, or IR Camera are treated as the built-in camera. Other cameras are treated as third-party webcams. A missing group is disabled. If no camera exists, Face ID is disabled.
- **PIN.** A 4 to 8 digit PIN stored as a hash. It can be created on first use and changed from the PIN screen before sign-in finishes.
- **SMS OTP.** Always shown. It is sent only after this method is chosen, to the contact number already on the account. Nothing is sent to email at login.

WebAuthn is used for the built-in fingerprint only. Windows Hello matches that fingerprint. The FS64 match is done by the Futronic SDK on the scanner PC. Face ID never calls WebAuthn, so choosing Face ID does not bring up a fingerprint prompt. The page turns Face ID on only when a camera is present, then matches the face on the camera you selected.

## Requirements

1. Use Chrome or Edge. Built-in fingerprint (WebAuthn) and the camera both need a secure page: `https://` or `http://localhost`. A plain `http://192.168.x.x` address disables those two. Futronic FS64, PIN, and SMS still work there.
2. PHP OpenSSL on the API (`ppa-api-uams`) so fingerprint signature checks and FS64 template encryption run.
3. The API creates these tables in `ppa_sso` on the first successful password check: `USER_2FA_SESSION`, `USER_PIN`, `USER_FACE`, `USER_WEBAUTHN`, `USER_WEBAUTHN_CHALLENGE`, `USER_FUTRONIC`.
4. For the FS64, run **Futronic Setup** once on the PC that has the scanner. That installs the helper and registers the `ppa-futronic:` link the login page uses to start it. Set the same `HmacSecret` in `appsettings.json` and `hmac_secret` in `ppa-api-uams/application/config/futronic.php` before building that setup file. The installed copy uses the secret from that build.

## Built-in fingerprint

1. On Windows, open **Settings > Accounts > Sign-in options**.
2. Turn on **Windows Hello Fingerprint** and enroll a finger on the laptop reader.
3. Sign in to UAMS with username and password.
4. Choose **Fingerprint**, then **Built-in fingerprint scanner**.
5. Windows opens **Choose a passkey**. Choose this computer, then confirm with the fingerprint already enrolled in Windows Hello. Do not choose a phone or a security key. The next sign-in on this computer asks for that same fingerprint.

The browser never receives the fingerprint image. Windows Hello is what decides the print matches. There is no shared passkey the site can install for every user.

## Futronic FS64

A fingerprint already saved in Windows Hello cannot be used on the FS64. Windows does not give that template to the browser or to the Futronic SDK, and Futronic’s Windows Hello driver covers the FS80 and FS88, not the FS64. Each person enrolls one new finger on the FS64 the first time they choose it. Later sign-ins match that scan to the stored template. The built-in choice still uses the Hello fingerprint.

1. Install the Futronic FS64 USB driver. Copy `ftrScanAPI.dll` into `ppa-uams/tools/futronic-agent` or next to the built helper, or set `SdkDirectory` in `appsettings.json` to the folder that contains it. The public FS64 package is 32-bit. Fingerprint matching also needs Futronic's ANSI template library (`ftrAnsiSDK.dll`); the public scan demo does not include it.
2. Put the same signing secret in `tools/futronic-agent/appsettings.json` (`HmacSecret`) and `ppa-api-uams/application/config/futronic.php` (`hmac_secret`). Leave `template_key` only on the API. Change both secrets from the defaults before relying on this outside a trusted workstation.
3. On the scanner PC, run **Futronic Setup** once (`FutronicSetup.exe` on the desktop of a machine where it was built, or the published file from `tools/futronic-setup`). It copies the helper to `%LOCALAPPDATA%\PPA\FutronicAgent`, registers the `ppa-futronic:` protocol for the current Windows user, and lists **Futronic Scanner Helper** in Settings, Apps, Installed apps. The helper listens only on `http://127.0.0.1:17364` and runs with no window. The website cannot download that folder. A second start while it is already running does nothing.
4. Plug in the FS64. On the second-factor screen, choose **Connect Futronic FS64**. The page opens `ppa-futronic://start`. Edge or Chrome asks the first time whether to open the helper. Choose to allow it, and allow it for this site if the browser offers that. The Futronic button enables only when `/health` says the scanner is open.
5. Choose **Fingerprint**, then **Futronic FS64**. The picture of the hand and scanner follows the helper phase. It stays on “ready” or “starting,” with the light off, until the helper is actually capturing. The first time, place the finger when the picture says place and the light is on, lift it when the picture says lift, then place the same finger again. The helper keeps the template only when those two scans match, then the API stores it encrypted. The next sign-in asks for that same finger and shows checking, then success or an error, from the helper phase. When sign-in finishes, when they leave this step, or when they switch to SMS OTP, the page tells the helper to exit. If the page is closed without that, the helper exits after 90 seconds with nothing to do.

For a managed fleet, the Edge policy `AutoLaunchProtocolsFromOrigins` can allow `ppa-futronic` from the UAMS origin so the browser does not ask. Re-run **Futronic Setup** after the signing secret changes so the installed helper gets the new `appsettings.json`.

Developers can still start it from `tools/futronic-agent` with `dotnet run` while changing the helper. That copy is separate from the installed one. Stop the installed helper first if port 17364 is already taken.

Five failed FS64 matches during one sign-in pause this method and ask for SMS OTP or a PIN. The password session stays open until a method succeeds. Images are discarded on the scanner PC. The API stores the template, not the picture.

Do not grant the page USB access to the FS64. That would take the device away from the Futronic driver the helper uses.

## Face ID

Face ID is a camera check. It does not use Windows Hello, and it does not ask for a fingerprint after you confirm.

1. Sign in with username and password, then choose **Face ID**.
2. Allow the camera. Pick **Built-in camera** or **Third-party webcam**. If several cameras are in that group, pick one from the list and check the preview.
3. Look at that camera. The oval turns green when your face is centered, large enough, evenly lit, sharp, and still. Follow the prompt if it asks you to move closer, move back, add light, turn toward the camera, or hold still. Sunglasses and anything covering the eyes stop the check. Remove them, or use SMS OTP or your PIN.
4. The first time, choose **Save Face ID** only after the oval is green. The page takes three samples a moment apart while you hold still. Later sign-ins match automatically against those samples when the oval is green. The match still requires a similarity of 0.82. Camera frames are discarded after the template is built. Only the numeric templates are stored.
5. A match on that camera opens the dashboard. After five failed matches, Face ID pauses for that sign-in and asks for SMS OTP or a PIN.

Use the same camera you enrolled. Before relying on it, try that laptop in normal room light, in a dim room, and from a closer and a farther seat. A fingerprint scanner is not part of this step.

## PIN and SMS

- **PIN.** Choose **PIN Code**. If none is stored, enter a new 4 to 8 digit PIN twice. That saves it and finishes sign-in. Next time, enter the PIN. **Change PIN** asks for the current PIN and the new one, then asks you to enter the new PIN.
- **SMS OTP.** Choose **SMS OTP** on the method screen, or **Use SMS OTP instead** after another method fails. The code goes to the user’s contact number. Resend stays available after 5 minutes. There is no email OTP on this step.

## Where it lives

- Login screen: `ppa-uams/application/views/login.php`
- Login script: `ppa-uams/assets/js/wms-login.js`
- API: `ppa-api-uams/application/controllers/wsv1/Api.php` and `application/models/API_model.php`
- FS64 signing and template key: `ppa-api-uams/application/config/futronic.php`
- FS64 helper: `ppa-uams/tools/futronic-agent`
- One-time installer: `ppa-uams/tools/futronic-setup` (`FutronicSetup.exe`)
- WebAuthn checks: `ppa-api-uams/application/libraries/Webauthn_rp.php`
