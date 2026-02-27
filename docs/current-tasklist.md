# Project Tasklist — Requirements

## 📧 Email Tasks

### ~~Create Opportunity~~ — DONE
*Triggered after a TEAM/ADMIN creates a new MA or Real Estate opportunity and its status becomes `ACTIVE`.*

- [x] Design an email template that shows the opportunity name, type (MA or Real Estate), cover image, and a button linking to the deal page
- [x] When an opportunity is created with status `ACTIVE`, automatically email all matching investors in the background without blocking the save action
- [x] The same notification fires when an existing opportunity is manually promoted from `INACTIVE` to `ACTIVE`
- [x] Failed email deliveries are logged via Sentry and visible to the operations team
- [ ] *(Future — other dev)* Optionally filter which investors receive the email based on their investment strategy and segment preferences

---

### ~~Forget Password~~ — DONE
*Triggered when a user requests a password reset from the login page.*

- [x] The login page must have a "Forgot Password?" link
- [x] Users enter their email; if the email belongs to a valid user, the server generates a temporary password, updates credentials via Better Auth, and sets `passwordChanged: false`
- [x] If the email does not exist in the database, show a generic error (e.g., "If this email is registered, you will receive instructions") — do NOT reveal whether the email is registered
- [x] The user receives an email with the temporary password and a link to the login page
- [x] After logging in with the temp password, `PasswordChangeProvider` forces the user to set a real password — `passwordChanged` is then set to `true`
- [x] Design a "Forgot Password" email template (bilingual PT/EN) showing the temporary password and a login button

---

### Invite to Platform
*Triggered after an Admin approves an `AccessRequest`.*

- [ ] Merge the "Approve" and "Invite" actions into a single atomic flow: approving an access request immediately creates the user and sends the invitation email
- [ ] Auto-populate the new `User` record from the `AccessRequest` fields: `name`, `email`, `company` → `companyName`, `phone` → `phoneNumber`, `position`
- [ ] The "Reject" action remains separate
- [ ] All new UI text must be available in both Portuguese and English
- [x] *(Already done)* Invite email template exists (`src/lib/emails/invite-email.tsx`) — bilingual, shows credentials + login link
- [x] *(Already done)* `investorsRouter.invite` creates user via Better Auth, generates temp password, sends email via Resend

---

## 📄 NDA — Flow com PandaDocs

### ⚙️ Setup
*One-time setup before any feature work begins.*

- [ ] Store PandaDocs API credentials and the NDA template ID securely as environment variables
- [ ] Prepare the NDA feature module with its own folder, API routes, UI components, and translations

---

### 🖱️ User clica em "Assinar NDA"
*Button rendered on the MA and RE opportunity detail pages.*

- [ ] Each MA and Real Estate deal page must show an NDA signing button to investors
- [ ] The button state must reflect the current NDA status for that specific investor + deal combination:
  - No record → "Assinar NDA"
  - Signing in progress → "NDA Pendente — Continuar Assinatura"
  - Signed → "NDA Assinado ✓" + download option
  - Declined → "NDA Recusado" + option to restart

---

### 🔧 Backend cria documento no PandaDocs
*Triggered when the user clicks "Assinar NDA".*

- [ ] Clicking the button must create a new NDA document in PandaDocs using the pre-configured NDA template, pre-filled with the investor's name and email and the deal name
- [ ] If the investor has already signed this deal's NDA, the action must be blocked with a clear error
- [ ] If the investor has a signing already in progress, the platform must resume it without creating a duplicate document

---

### 🔀 User redirecionado para PandaDocs
*Client-side transition after the mutation resolves.*

- [ ] After the document is created, the investor must be redirected to the PandaDocs signing page in the same browser tab
- [ ] The button must show a loading state and be disabled while the document is being prepared

---

### 🔔 PandaDocs notifica o backend (Webhook)
*PandaDocs calls this route after the investor signs or declines.*

- [ ] The platform must receive webhook notifications from PandaDocs
- [ ] When an investor completes signing, trigger the PDF retrieval process in the background
- [ ] When an investor declines, update the button state accordingly
- [ ] The investor must be notified in real-time on the deal page via Pusher when either event occurs, without needing to refresh

---

### 📦 Background Job — PDF Download
*Runs asynchronously after the webhook confirms the document is complete.*

- [ ] After signing is confirmed, the platform must automatically retrieve the signed PDF from PandaDocs and save it to a drive (not the database)
- [ ] The investor must receive a confirmation email with the signed PDF download link and the deal name
- [ ] The PDF retrieval must retry automatically if PandaDocs is not immediately ready to serve it
- [ ] All steps must be logged so failures are visible to the operations team (Sentry)

---

### 🔁 User redirecionado de volta ao website
*Handling the return from PandaDocs via the redirect URL.*

- [ ] After signing on PandaDocs, the investor must be redirected back to the deal page they came from
- [ ] The deal page must show a success message confirming the NDA was signed and that the PDF will be sent by email
- [ ] If the platform has not yet received the webhook confirmation by the time the investor returns, the page must show a "waiting for confirmation" state that resolves automatically via Pusher when the confirmation arrives
- [ ] The URL must be cleaned up after the confirmation is shown (no leftover query params)

---

### 📥 Download do PDF assinado
*Available to investors on the deal page and visible to TEAM/ADMIN in the backoffice.*

- [ ] Investors must be able to download their signed NDA PDF directly from the deal page after signing
- [ ] TEAM and ADMIN users must be able to see, per investor profile, all NDAs signed across all deals — including their status and a download link for each
