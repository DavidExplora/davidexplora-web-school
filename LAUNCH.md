# David Explora launch

Updated 11 October 2026. The photo-story and detailed-package update keeps the original HTML/CSS/JavaScript structure.

Public website: https://david-explora.fastash16.chatgpt.site

GitHub status: David successfully pushed the previous launch from Windows. The last verified remote main commit is `19d960a71c918a2b908d6d67d0a1b0c39f266070`, and its website check succeeded. The photo-story/package version is a separate source update. The connected integration lacks GitHub write access; apply the provided update in your authenticated Windows clone, review, commit and push. A pull cannot retrieve unpushed changes. GitHub and the hosted Site do not automatically synchronize.

## What the new version includes

The site has 39 HTML pages, including 18 detailed packages, a searchable price catalogue, planning guide and public photo credits. The safari hero moves through supplied photographs. Separate safari, seven-day Machame, Zanzibar and local-life stories have motion, fades, pause, manual controls and reduced-motion support.

Package pages show daily plans, start/end points, inclusions, exclusions, estimates based on the displayed group and two-adult alternatives where available. Public operator benchmarks informed these estimates; they are not supplier-confirmed offers. See `PRICING.md`. Final quotes need actual costs, fees, taxes and booking terms.

Requests support selected itinerary, optional per-adult budget and the original contact/travel fields. The traveler reviews the message, opens WhatsApp and presses Send. There is no booking database, payment backend or instant reservation.

## Buy the domain in your own account

Recommended name: **davidexplora.com**. A registry lookup on 10 October found no registration record. That is an availability indication; only a registrar's search and checkout can confirm availability and the actual price. No domain has been purchased by this code change.

1. Open [Namecheap's search for davidexplora.com](https://www.namecheap.com/domains/registration/results/?domain=davidexplora.com).
2. Confirm it is the exact `.com` spelling and a standard registration, then add one year to the cart.
3. Use your own Namecheap account and accurate registrant contact details. Keep the account email reachable, enable two-factor authentication and complete any registration-verification email.
4. Keep included domain privacy. Hosting, PremiumDNS, paid SSL and other add-ons are unnecessary for the static hosting setup described here.
5. Review the checkout total, renewal amount and auto-renew setting, then pay using your preferred supported method. The domain and account stay under your ownership.

### Prices checked on 10 October 2026

| Service | First year | Renewal / ongoing |
| --- | ---: | ---: |
| Namecheap standard `.com` | $10.98 + $0.20 ICANN fee | $18.48 + $0.20 ICANN fee |
| Namecheap Private Email Launch, one mailbox | $14.88/year, or start with a 30-day trial | $14.88/year listed |
| Combined domain + one mailbox | $26.06 | $33.56/year listed |

Prices are USD. Checkout tax, card conversion, availability and promotions can change the total. A new-customer domain promotion may reduce the initial amount; use the actual checkout price. You do not need to buy a website hosting package from the domain registrar.

Sources: [Namecheap .com pricing](https://www.namecheap.com/domains/registration/gtld/com/) and [Namecheap Private Email](https://www.namecheap.com/hosting/email/).

## Attach the purchased domain

The existing David Explora hosted Site can use a custom domain. Once you own `davidexplora.com`, add it to that Site and use the exact DNS records returned by the hosting service. Do not guess an A record or point it at the Git source endpoint. Keep your domain registration and DNS account under your control.

The custom-domain process needs ownership verification, DNS propagation and an active HTTPS certificate. Confirm both `davidexplora.com` and `www.davidexplora.com`, and choose one as the canonical address. Update the metadata only after that address serves successfully:

```sh
python scripts/set_site_url.py https://davidexplora.com
python scripts/build_tours.py
python scripts/check_site.py
```

Push and redeploy the updated source. This updates page canonicals, Open Graph URLs, organization URL, sitemap and robots.txt together. The website currently uses its actual hosted Site address for metadata; it does not pretend the `.com` is already live.

### Optional hosting under your own Cloudflare account

For hosting that automatically deploys every GitHub update, connect this repository to Cloudflare Pages. Choose production branch `main`, framework `None`, build command `python scripts/package_site.py dist` and output directory `dist`. The generated directory contains only public site files. Attach the domain in the Pages dashboard before setting DNS. Apex domains use Cloudflare nameservers; an externally managed subdomain uses the CNAME given by the host.

Sources: [Cloudflare static HTML hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) and [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Use GitHub for source control. GitHub Pages' published limits say it is not a free hosting service for running an online business or a site primarily facilitating commercial transactions, so this travel inquiry site is prepared for business-capable hosting instead. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## Set up professional email

Recommended mailbox: **info@davidexplora.com**. Add **bookings@davidexplora.com** as an alias into the same inbox. Add **postmaster@davidexplora.com** as an alias before enabling email reports. The website uses David's existing Gmail address until a mailbox is active and tested.

1. After registering the domain, select Namecheap Private Email **Launch** for one mailbox. The listed plan offers a 30-day trial; trial renewal and paid promotions have different terms, so review what you select.
2. Create the `info` mailbox with a strong unique password in your own account, then add the `bookings` and `postmaster` aliases.
3. If Namecheap manages DNS, use its Private Email setup. If DNS is hosted elsewhere, add the following records there.

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | `@` | `mx1.privateemail.com` | 10 |
| MX | `@` | `mx2.privateemail.com` | 10 |
| TXT | `@` | `v=spf1 include:spf.privateemail.com ~all` | — |
| TXT | `privateemail._domainkey` | Copy the unique DKIM value from your mailbox dashboard | — |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@davidexplora.com` | — |

The DKIM selector above applies to new Private Email subscriptions after 2 June 2026. Copy the exact selector and value shown for your account. Keep only one SPF record and merge other authorized senders if necessary. Start DMARC in monitoring mode; stronger enforcement should follow successful authentication tests.

Source: [Namecheap Private Email records for third-party DNS](https://www.namecheap.com/support/knowledgebase/article.aspx/1340/2176/namecheap-private-email-records-for-domains-with-thirdparty-dns/).

4. Send from `info@davidexplora.com` to another email account, reply back, and verify both directions work. Check SPF, DKIM and DMARC results in the received message headers.
5. After the mailbox passes, replace `davidlyamuya819@gmail.com` with `info@davidexplora.com` in the HTML pages and the organization metadata. Push and redeploy, then click the website email link to confirm it opens the correct address.

Suggested signature:

David Amani Lyamuya | David Explora  
Explore More. Experience More.  
Tanzania travel planning | Moshi / Marangu  
WhatsApp: +255 778 321 400  
info@davidexplora.com | https://davidexplora.com

Use the domain/email lines only when those services are active.

## Before accepting the first confirmed booking

- Open the public website on a phone and desktop and confirm the image framing, menu, route pages and form layout.
- Prepare a test inquiry, open it on WhatsApp and send it yourself to verify the destination account receives it. The automated checks do not send messages or establish that the phone account is operational.
- Confirm that the displayed phone, email and social accounts are correct.
- Have the actual written itinerary, quote, contracting-party details, provider arrangements, payment method and cancellation terms ready. Complete any business registration/licensing requirements that apply to the services you offer before selling them. The website makes no licensing claim.
- Check the custom domain over HTTPS and test the professional mailbox before advertising those addresses.

Automated checks cover 39 pages, local links, responsive images, structured data, sitemap, labels, consent, photo controls, credits, all 80 planner combinations, filtering and request encoding. Nineteen tests also exercise carousel controls, visibility pauses and reduced motion using DOM fixtures. A phone/desktop visual review and a delivered test inquiry still need a real browser and WhatsApp account.
