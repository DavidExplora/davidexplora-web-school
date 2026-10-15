# Trip enquiry email delivery

Updated 15 October 2026.

## Configured behaviour

The main enquiry form at https://davidexplora.com/#contact posts to `https://formsubmit.co/info@davidexplora.com`. It works without a configured customer email app and has a native HTML fallback when JavaScript is unavailable. JavaScript validates the complete request and adds a readable trip summary. The required customer `email` field supplies the reply address; the email subject is `New Tanzania trip enquiry — David Explora`.

FormSubmit's default anti-spam check remains enabled and a hidden honeypot is included. After the submission step the provider redirects to `https://davidexplora.com/enquiry-submitted.html`. That page is noindex and excluded from the sitemap. It never presents an enquiry as a confirmed booking or proof of inbox receipt.

The WhatsApp option prepares drafts without sending an email. Direct mail links and the separate support, payment-instruction and education partnership forms retain their existing draft workflow. No card checkout, inventory reservation or booking database is added.

## Owner activation and end-to-end test — pending

1. Open the published main contact form and submit a clearly labelled setup test using David's own contact details. Complete the anti-spam check.
2. Open `info@davidexplora.com` in Private Email. Look in Inbox and Spam for FormSubmit's activation message. Confirm only the expected form for `davidexplora.com` using the activation link in that message.
3. Submit a fresh test enquiry after activation. Confirm its name, reply address, tour, dates/flexibility, starting location, party size, budget, language and message arrive in the professional inbox.
4. Reply from Private Email and verify that Reply addresses the sender correctly. Check Spam if a submission is missing. Do not describe end-to-end email delivery as verified until the fresh enquiry is actually received.

FormSubmit says it holds submissions for up to 30 days while a form awaits activation, and forwards held submissions after confirmation. Do not depend on this for launch: complete activation and the fresh test before directing customers to the form.

The main-form privacy notice explains third-party email processing and the documented 30-day submission retention. No payment details, passport documents or medical records should be sent through this enquiry form. Provider activation links and account passwords must not be committed to GitHub.

## Verification limits

Local behaviour and structural checks can verify the recipient, POST configuration, payload, validation, WhatsApp separation and return page. They cannot prove that FormSubmit has activated this mailbox or that a message reached Private Email. Browser QA is unavailable in the current managed editing environment. The owner must perform the real submission, activation and receipt checks above.

Official documentation:

- Setup and activation: https://formsubmit.co/
- Field options, spam checks and retention: https://formsubmit.co/documentation
- Activation and delivery troubleshooting: https://formsubmit.co/help
- Provider privacy: https://formsubmit.co/privacy.pdf
