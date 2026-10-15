# David Explora launch

Updated 15 October 2026.

Public website: https://davidexplora.com

## Domain and hosting

David registered `davidexplora.com` in his own Namecheap account on 14 October 2026. The completed order covered one year of registration and free domain privacy, with a first-year promotional total of USD 6.68. Renewal prices and card conversion are separate from that introductory price.

Registrant email verification is complete. The existing Sites project is public, and the hosting service confirms both `davidexplora.com` and `www.davidexplora.com` are active with active HTTPS certificates. Namecheap BasicDNS manages the DNS records. The custom domain serves the existing site; a separate registrar web-hosting package is unnecessary for this configuration.

Page canonical URLs, social image/page URLs, structured data, robots.txt, the sitemap and departure calendar URLs use `https://davidexplora.com`. Existing calendar event UIDs retain their original namespace so saved tentative departure events keep the same identity after the domain change.

The domain registration is under David's control. Manage DNS and renewal preferences in his Namecheap account. Use the exact hosting service records when making future DNS changes; preserve the records needed by the selected email provider.

GitHub stores the source at `DavidExplora/davidexplora-web-school`. The public site uses the existing project identified in `.openai/hosting.json`. GitHub pushes and hosted publication are separate operations; publish the same verified source state to both destinations.

## Website and booking status

The plain HTML/CSS/JavaScript site has 95 HTML pages, 42 tour itineraries and 12 original travel guides. Licensed destination photography and David's supplied guiding photographs have public source/credit records. Machame, Lemosho and Marangu have distinct automatic photo galleries with manual controls and reduced-motion support.

The main trip enquiry form now submits to FormSubmit for delivery to `info@davidexplora.com`, followed by the provider's anti-spam check and the site's enquiry return page. One-time inbox activation and a real received-enquiry test are pending; see `FORM-DELIVERY.md`. Separate support/payment/partnership forms and the WhatsApp option still prepare drafts for visitors to send. Live chat messages use David’s tawk.to account. There is no booking database, live seat inventory or online card checkout. An enquiry does not reserve a trip or confirm a booking.

Displayed prices are planning estimates. Before confirming paid bookings, obtain actual supplier costs and availability, confirm the operating/contracting provider and applicable licensing/insurance, and issue a written itinerary, price, inclusions, payment recipient and cancellation terms. See `BOOKING-LAUNCH.md` and the destination operations documents.

## Professional email: active mailbox, authentication pending

David created `info@davidexplora.com` in Namecheap Private Email. His 14 October screenshots show outgoing test messages received by Gmail and a Gmail reply received in the professional mailbox. Those outgoing tests landed in Gmail's Spam folder. This confirms a two-way message exchange, not reliable customer inbox placement or passing authentication.

The homepage, shared footers, privacy/terms contacts, organization metadata, trip enquiries, English/Spanish support requests, payment-instruction drafts and education partnership draft use `info@davidexplora.com`. WhatsApp remains +255 778 321 400. The main form has a direct email submission path; the other forms retain their draft workflow.

Next, open a newly received professional-mailbox message in Gmail and choose the message's three-dot menu beside Reply, then **Show original**. Check SPF, DKIM and DMARC results. Use the actual results and the provider-generated DKIM record before changing DNS. Do not invent a key or add a second SPF record. Marking the test Not spam helps David's own Gmail inbox; it does not guarantee customer inbox placement.

Public DNS records could not be independently queried from this editing environment. No authentication PASS result has been established here. Keep authentication and inbox-placement checks open until the actual received-message results are reviewed. `bookings@davidexplora.com` was proposed as an alias but has not been confirmed or tested. Account passwords and mail/API credentials must remain outside the repository.

Official references:

- Private Email plans: https://www.namecheap.com/support/knowledgebase/article.aspx/10789/2179/private-email-plans-comparison/
- Mail service and purchase: https://www.namecheap.com/hosting/email/
- Namecheap host records: https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/
- Gmail Show original: https://support.google.com/mail/answer/29436?hl=en
- Gmail authentication: https://support.google.com/mail/answer/180707?hl=en

## Search and marketing

The Domain property for `davidexplora.com` is verified in Google Search Console. The submitted `https://davidexplora.com/sitemap.xml` reports Success with 92 discovered pages. The homepage live inspection reports that the URL is available to Google, and indexing has been requested. These checks support discovery; they do not establish completed indexing or guarantee ranking or enquiries.

Update David's real Instagram, TikTok, LinkedIn and Google Business website links to the verified live domain. Supply the exact public Facebook page URL before adding it to the site. Add only verified business listings and reviews from actual travellers.

Official reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Live chat and visitor alerts

David supplied the tawk.to widget for his own account. The generated pages load it once on the HTTPS production domains; localhost and file previews keep the existing WhatsApp welcome. The old floating controls are hidden after the real widget renders, with keyboard focus preserved. If the external script cannot load, the existing contact controls remain available.

The privacy notice describes live chat and visitor-session processing. Finish the tawk.to setup wizard, configure sounds/desktop notifications and the relevant consent forms in the account, then test a visit and a complete chat on the published site. Alert permissions, widget consent configuration and actual message delivery must be verified by David on his device. See `CHAT-OPERATIONS.md`; this integration does not install Google Analytics or make a security/compliance guarantee.

## Payments: still a separate activation

`data/payment-settings.json` keeps card checkout and public mobile-money routing inactive. Personal bank cards do not create merchant card acceptance. Complete the payment provider's secure onboarding and confirm the registered recipient before taking payments.

After approval, use a booking-specific provider payment link or invoice tied to a written quote. Verify the transaction in the provider dashboard before issuing written booking confirmation. Automated checkout requires server-created sessions and verified provider webhooks; it is a later backend task.

Official reference: https://www.pesapal.com/tz/business/online/payments-page

## Validation and local preview

Run the generators in order before checking:

```sh
python scripts/build_site.py
node --test tests/*.test.cjs
python scripts/check_site.py
python scripts/package_site.py dist
```

The behaviour tests and full site checker cover the generated pages, links/assets, metadata, labelled enquiries, gallery controls and live-chat fallback/focus behaviour. Repeat generation must leave committed outputs unchanged. Browser visual QA was unavailable in the managed editing environment; a real phone/browser review, a sent enquiry received by David and a delivered live chat remain owner checks.

In VS Code, open the complete latest repository folder and right-click the root `index.html` → **Open with Live Server**. Live Server is a local preview. The published custom-domain site is available independently of David's laptop.
