# David Explora launch

Updated 14 October 2026.

Public website: https://davidexplora.com

## Domain and hosting

David registered `davidexplora.com` in his own Namecheap account on 14 October 2026. The completed order covered one year of registration and free domain privacy, with a first-year promotional total of USD 6.68. Renewal prices and card conversion are separate from that introductory price.

Registrant email verification is complete. The existing Sites project is public, and the hosting service confirms both `davidexplora.com` and `www.davidexplora.com` are active with active HTTPS certificates. Namecheap BasicDNS manages the DNS records. The custom domain serves the existing site; a separate registrar web-hosting package is unnecessary for this configuration.

Page canonical URLs, social image/page URLs, structured data, robots.txt, the sitemap and departure calendar URLs use `https://davidexplora.com`. Existing calendar event UIDs retain their original namespace so saved tentative departure events keep the same identity after the domain change.

The domain registration is under David's control. Manage DNS and renewal preferences in his Namecheap account. Use the exact hosting service records when making future DNS changes; preserve the records needed by the selected email provider.

GitHub stores the source at `DavidExplora/davidexplora-web-school`. The public site uses the existing project identified in `.openai/hosting.json`. GitHub pushes and hosted publication are separate operations; publish the same verified source state to both destinations.

## Website and booking status

The plain HTML/CSS/JavaScript site has 94 HTML pages, 42 tour itineraries and 12 original travel guides. Licensed destination photography and David's supplied guiding photographs have public source/credit records. Machame, Lemosho and Marangu have distinct automatic photo galleries with manual controls and reduced-motion support.

Visitors can review tours and prepare a WhatsApp or email enquiry. They must press Send in the selected app. There is no automatic email delivery, enquiry database, live seat inventory or online card checkout. A prepared message does not reserve a trip or confirm a booking.

Displayed prices are planning estimates. Before confirming paid bookings, obtain actual supplier costs and availability, confirm the operating/contracting provider and applicable licensing/insurance, and issue a written itinerary, price, inclusions, payment recipient and cancellation terms. See `BOOKING-LAUNCH.md` and the destination operations documents.

## Professional email: next setup

The professional mailbox has not yet been purchased, activated or tested. The website continues to use David's current Gmail address and WhatsApp number. Keep those contacts until the new mailbox can receive enquiries and send replies successfully.

Recommended starting setup:

- One Namecheap Private Email **Launch** mailbox: `info@davidexplora.com`.
- `bookings@davidexplora.com` as an alias into the same inbox.
- The listed Launch plan price is USD 14.88/year for one mailbox, with 10 aliases and a 30-day trial option. Confirm the chosen offer, renewal settings and final price at checkout.

Purchase and create the mailbox in David's own account. Use the mail provider's current domain-specific instructions for MX, SPF, DKIM and DMARC. Do not invent a DKIM key or add a second conflicting SPF record. The DNS currently has the registrar's email-forwarding configuration; switch to the purchased mail service through its setup process.

Test an inbound message and an outbound reply. Only after those tests succeed, update the homepage template, shared/footer contacts, enquiry draft generators, privacy/booking pages and organization metadata, then rebuild, push and republish. Account passwords and mail/API credentials must remain outside the repository.

Official references:

- Private Email plans: https://www.namecheap.com/support/knowledgebase/article.aspx/10789/2179/private-email-plans-comparison/
- Mail service and purchase: https://www.namecheap.com/hosting/email/
- Namecheap host records: https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/

## Search and marketing

After the canonical domain update is published, add a Domain property for `davidexplora.com` in Google Search Console. Verify ownership using the exact Google-issued DNS TXT value and submit `https://davidexplora.com/sitemap.xml`. Search Console and sitemap submission help discovery; they do not guarantee indexing, ranking or enquiries.

Update David's real Instagram, TikTok, LinkedIn and Google Business website links to the verified live domain. Supply the exact public Facebook page URL before adding it to the site. Add only verified business listings and reviews from actual travellers.

Official reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

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

The existing 78 behaviour tests and full site checker cover the generated pages, links/assets, metadata, labelled enquiries and gallery controls. Repeat generation must leave committed outputs unchanged. Browser visual QA was unavailable in the managed editing environment; a real phone/browser review and a sent enquiry received by David remain launch checks.

In VS Code, open the complete latest repository folder and right-click the root `index.html` → **Open with Live Server**. Live Server is a local preview. The published custom-domain site is available independently of David's laptop.
