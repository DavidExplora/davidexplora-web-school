# David Explora booking and payment launch

The public site is live. The form prepares a WhatsApp or email draft in the visitor's browser. The visitor must press Send. There is no automatic booking database, reserved inventory, card checkout, or automatic email delivery.

## First practical payment setup

Apply for a Tanzanian Pesapal business merchant account and its hosted Payments Page or online invoice service: https://www.pesapal.com/tz/business/online/payments-page

Provide the business documents, identity and bank information requested by Pesapal through its secure merchant process. Confirm supported currencies, transaction fees, settlement terms, refunds and enabled payment methods directly with the provider. Do not put account documents or API secrets in GitHub.

After approval, send a personalized payment link or invoice against a written quote. Confirm the amount, currency, deposit, balance deadline and cancellation terms. Verify the successful transaction in the merchant dashboard before issuing a booking confirmation. Do not rely on a customer screenshot as payment verification.

Only add your own approved merchant payment URL to the site. The competitor's Pesapal link belongs to that competitor and must never be copied. A hosted payment link can launch before a custom backend, but it does not automatically reserve a tour.

## Public presence

Create or claim an eligible Google Business Profile with accurate business information. Request reviews from actual travelers. Supply the public Google Maps business/reviews URL. Do not invent star ratings or testimonials.

Apply separately as a supplier on GetYourGuide and Viator. Prepare accurate itineraries, inclusions, exclusions, pickup details, cancellation terms, pricing and required business documents. Approval, commissions and availability management are platform matters; website logos alone do not create a listing.

Once each real public listing is verified, paste its URL in business-links.js. Empty entries stay hidden. Rebuild/package/publish after editing. The destination Google Maps links are geographic searches, not your business profile.

## Domain and professional email

Purchase the chosen domain after confirming availability, renewal cost and ownership details. Configure hosting DNS using the hosting provider's actual records. Set up the purchased professional mailbox (for example info@your-domain), then verify SPF, DKIM and DMARC using the mail provider's instructions. Test receiving and replying before replacing the current Gmail address in journey.js, page contact links and organization structured data.

After the custom domain is live, update canonical URLs, Open Graph URLs, robots.txt and sitemap.xml. Verify ownership in Google Search Console and submit the sitemap.

## A later backend

For automated inquiries, add a server endpoint with validated input, abuse protection, a private inquiry database and authenticated owner access. Send a receipt through a verified email provider; keep keys in hosting secrets. Do not publicly expose customer details.

For integrated payments, create checkout sessions on the server against an approved quote. Verify signed provider webhooks, prevent duplicate transaction processing, and reconcile the amount/currency/booking reference before marking payment received. A redirect to a success page is not proof of payment. Define statuses such as inquiry, quoted, awaiting payment, paid and confirmed; keep availability and cancellation handling explicit.

## Rebuild and checks

From the repository: python scripts/build_tours.py, then python scripts/build_discovery.py. Run python scripts/check_site.py and node --test tests/*.test.cjs. Package using python scripts/package_site.py with the required output dist path.
