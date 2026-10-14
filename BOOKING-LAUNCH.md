# David Explora booking and payment launch

The public site is live. The form prepares a WhatsApp or email draft in the visitor's browser. The visitor must press Send. There is no automatic booking database, reserved inventory, card checkout, or automatic email delivery.

## Current payment status and Yas merchant verification

The owner supplied Yas merchant/till 16775960. This is not yet a verified public payment destination: confirm the registered merchant display name, account status and supported payment/settlement arrangements directly with Mixx by Yas. Check a small authorised transaction only after the owner confirms the setup. Do not publish payment routing before the recipient matches the written business instructions. Personal NMB prepaid and individual cards do not themselves create merchant card acceptance. No card PAN, CVV, PIN, bank login or merchant API secrets are needed in this conversation or the repository.

`payments.html` prepares a request for verified instructions against a quote reference. `data/payment-settings.json` records that card checkout and public mobile-money routing are inactive; these flags do not create an integration. Do not switch them on without implementing and verifying the approved method.

Official merchant information: https://mixx.co.tz/merchant/lipa-kwa-simu/

## First practical payment setup

Apply for a Tanzanian Pesapal business merchant account and confirm access to its hosted Payments Page or online invoice service: https://www.pesapal.com/tz/business/online/payments-page

Provide the business documents, identity and bank information requested by Pesapal through its secure merchant process. Confirm supported currencies, transaction fees, settlement terms, refunds and enabled payment methods directly with the provider. Do not put account documents or API secrets in GitHub.

After approval, send a personalized payment link or invoice against a written quote. Confirm the amount, currency, deposit, balance deadline and cancellation terms. Verify the successful transaction in the merchant dashboard before issuing a booking confirmation. Do not rely on a customer screenshot as payment verification.

Only add your own approved merchant payment URL to the site. The competitor's Pesapal link belongs to that competitor and must never be copied. A hosted payment link can launch before a custom backend, but it does not automatically reserve a tour.

DPO Pay by Network also documents verified merchant accounts and booking-specific hosted payment links. Confirm Tanzania onboarding and enabled methods with the provider rather than assuming a personal card qualifies. References: https://docs.dpopay.com/dpo-pay-by-network/docs/get-a-merchant-account and https://docs.dpopay.com/dpo-pay-by-network/docs/payment-links-invoicing

For activation, provide the approved public hosted-payment URL or invoice-link process and the verified recipient display name. Complete verification documents privately through the provider. A general checkout link must not let a visitor invent the amount owed; use a provider invoice or a server-created session tied to an agreed quote.

## Public presence

Create or claim an eligible Google Business Profile with accurate business information. Request reviews from actual travelers. Supply the public Google Maps business/reviews URL. Do not invent star ratings or testimonials.

Apply separately as a supplier on GetYourGuide and Viator. Prepare accurate itineraries, inclusions, exclusions, pickup details, cancellation terms, pricing and required business documents. Approval, commissions and availability management are platform matters; website logos alone do not create a listing.

Once each real public listing is verified, paste its URL in business-links.js. Empty entries stay hidden. Rebuild/package/publish after editing. The destination Google Maps links are geographic searches, not your business profile.

## Domain and professional email

The purchased domain is connected and the website uses `info@davidexplora.com` for public contacts and enquiry drafts. A two-way exchange with David's Gmail account was confirmed on 14 October 2026; the outgoing tests landed in Spam. Review SPF, DKIM and DMARC in Gmail's **Show original** view and check inbox placement before treating email delivery as fully verified. Follow the mail provider's actual DNS instructions and preserve the website's hosting records. See `LAUNCH.md` for the current status.

After the custom domain is live, update canonical URLs, Open Graph URLs, robots.txt and sitemap.xml. Verify ownership in Google Search Console and submit the sitemap.

## December group release checklist

Proposals start on 20 December 2026; arrival is 19 December. Seven-day Machame targets a 25 December summit and descends on the 26th. Eight-day Lemosho spends Christmas at Barafu, targets the summit on the 26th and descends on the 27th. The safari runs 20–26 December, with Christmas planned in the crater. Calendar files cover arrival through departure, are TENTATIVE and do not reserve anything.

Before confirming a group: obtain the licensed operating arrangements, actual camps/hotels and availability, current supplier costs and fees, language-guide availability, crew/vehicle arrangements, minimum operating party, confirmation deadline and the policy if the group cannot run. Price each written quote for the actual party, including festive supplements, payment fees, contingencies and the agreed operating margin. No price or seat availability has been invented for these proposals. Refresh or replace the 2026 dates before advertising another season; browser date handling labels underway and past proposals.

## Individual assistance and Spanish enquiries

`travel-support.html` and `viajes-en-espanol.html` gather voluntary functional planning needs, not diagnoses or documents. Confirm the exact vehicle access, room/bathroom layout, paths, support provider, companion role and costs before promising suitability. Request photographs or measurements from the actual provider where useful. Confirm a Spanish-speaking guide separately; David is developing his Spanish and is not represented as a fluent Spanish guide. Review the Spanish copy with a fluent speaker before paid Spanish-language campaigns.

The website does not certify accessible tours. Do not market universal access or a specialist service without verified delivery arrangements. Keep support details private, agree necessary sharing with providers and record the support agreed in the written itinerary.

## A later backend

For automated inquiries, add a server endpoint with validated input, abuse protection, a private inquiry database and authenticated owner access. Send a receipt through a verified email provider; keep keys in hosting secrets. Do not publicly expose customer details.

For integrated payments, create checkout sessions on the server against an approved quote. Verify signed provider webhooks, prevent duplicate transaction processing, and reconcile the amount/currency/booking reference before marking payment received. A redirect to a success page is not proof of payment. Define statuses such as inquiry, quoted, awaiting payment, paid and confirmed; keep availability and cancellation handling explicit.

## Rebuild and checks

From the repository: python scripts/build_site.py. Run python scripts/check_site.py and node --test tests/*.test.cjs. Package using python scripts/package_site.py with the required output dist path.
