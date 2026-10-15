# David Explora marketing and enquiry sources

Updated 15 October 2026.

## Verified access

Windsor.ai can read GA4 property `546135081` (David Explora) and Search Console properties `sc-domain:davidexplora.com` and `https://www.davidexplora.com/`. Use the Domain property for reporting the whole website; do not add the two properties together because they overlap.

The sitemap report returned `https://davidexplora.com/sitemap.xml`, submitted and fetched on 14 October, with 92 submitted URLs, zero errors and zero warnings. This confirms the sitemap fetch, not completed indexing. Search performance for 1-13 October and the checked Analytics reports returned no records. Unknown figures must not be reported as zero.

## Enquiry source feature

The main form asks an optional “How did you find David Explora?” question. This native field works without JavaScript. When JavaScript is available, the answer also appears in email, WhatsApp and copied-message summaries. A blank answer never blocks an enquiry.

`lead-source.js` remembers promotion labels in sessionStorage for up to 30 minutes. Labels follow normal internal navigation in the same tab, so someone can enter on a tour and then open the shared enquiry form. A new tagged promotion replaces the previous label. Records expire, and blocked storage does not stop enquiries; only the current page can retain labels when storage is blocked.

Supported `utm_source` codes: `instagram`, `facebook`, `tiktok`, `linkedin`, `google`, `google_business`, `whatsapp`, `partner`, `referral`. Optional `utm_medium` and `utm_campaign` labels use letters, numbers, underscores or hyphens, up to 64 characters. Use business campaign labels, never customer names or contact details. Query strings, fragments, arbitrary referrers and guest form contents are not saved in this record. There are no visitor IDs, analytics network requests or public counters in this feature.

The hidden `promotion-link` field is submitted with the main email enquiry. Validated message summaries label the campaign separately from the guest's own answer, because the two can differ. Direct mail links, direct WhatsApp links and the separate assistance/payment forms do not automatically carry this attribution. This feature does not prove inbox delivery or create a booking database.

## Ready-to-use promotion links

Use one suitable link in each existing profile or post. The destination remains readable when labels or JavaScript are absent.

| Use | Link |
| --- | --- |
| Instagram: Marangu post | https://davidexplora.com/marangu-village-tour.html?utm_source=instagram&utm_medium=social&utm_campaign=marangu_oct2026 |
| WhatsApp status: Marangu | https://davidexplora.com/marangu-village-tour.html?utm_source=whatsapp&utm_medium=social&utm_campaign=marangu_oct2026 |
| Google Business website field | https://davidexplora.com/?utm_source=google_business&utm_medium=organic&utm_campaign=first_booking_oct2026 |
| Suitable local partner | https://davidexplora.com/marangu-village-tour.html?utm_source=partner&utm_medium=referral&utm_campaign=marangu_oct2026 |

Do not replace contact links inside travel marketplaces where their rules restrict external contact. No posts, messages, ads or paid services are sent or activated by this source change.

## Daily lead record

For each genuine request, record lead ID, enquiry date, optional guest-reported source, promotion label, requested tour/date, next action and due date. Count test messages separately. Link clicks, source labels and Google impressions are not bookings. A confirmed booking requires the agreed services and written price, confirmed supplier delivery and verified required payment.

## Analytics installation still needs the web stream ID

The inspected source does not contain a Google Analytics tag. Connecting Windsor.ai to a property permits reading available reports; it does not install tracking in the website.

Find the public Measurement ID in Google Analytics: select David Explora, then Admin > Data streams > Web > the davidexplora.com stream. Copy the `G-...` Measurement ID, rather than the numeric property ID. If the property has no web stream, create the correct web stream first. After the ID is supplied, implement and verify the tag with appropriate visitor choices and privacy information, keeping customer information out of Analytics events. Do not guess an ID or publish duplicate tags.

Official guide: https://support.google.com/analytics/answer/12270356?hl=en

## Checks

Run the complete build, Node behaviour suite and structural checker before packaging. Check that every HTML page has one lead-source script and that it loads before the main form script. Test source persistence, expiry, malformed labels, blocked storage and both email/WhatsApp message payloads. Browser visual QA is unavailable in the current managed editing environment; the owner should review the optional field on a real device. Actual email receipt remains an owner-side check after delivery changes.
