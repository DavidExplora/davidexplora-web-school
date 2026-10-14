# David Explora development and launch briefing

Reviewed 14 October 2026 against GitHub source f132363. This release preserves the static site and its existing routes, filters, saved tours, photo/video controls and enquiry workflow.

## Changes in this release

- Three proposed 20 December 2026 departures in `data/tours.json` and `data/group-departures.json`: seven-day Machame (25 December summit objective), eight-day Lemosho (26 December summit objective) and a seven-day northern safari. Arrival, departure, nights and operating caveats are explicit. Prices and live seat counts are not fabricated.
- `scripts/build_guest_services.py` generates the departure hub, tentative calendar files, dismissible welcome prompt, English/Spanish assistance enquiries, payment-instruction requests and updated privacy information. `guest-services.js` handles expiry and drafts without uploading form contents or storing personal details.
- Six crawlable category pages and four new original guides use `scripts/build_editorial.py` and `data/articles.json`. Visible article dates now follow their source dates rather than a hard-coded day.
- The founder introduction states guiding, trip planning, ongoing tourism studies and developing Spanish. The education vision remains a proposed pilot, with no collected donations, automatic contribution, claimed partner or beneficiary figures.
- Three genuine destination photographs have source/author/licence/change records in `data/photo-credits.json`; full and small WebPs are in `images/december/`. The supplied 120×150 portrait is used only at small size. Unverified stock previews and graphic wildlife uploads were excluded.

## Highest-impact work before taking confirmed bookings

| Priority | File reference | Required next work |
|---|---|---|
| P0 | `BOOKING-LAUNCH.md`, `payments.html`, `data/payment-settings.json` | Obtain merchant approval and verified recipient/payment links. The website requests instructions and does not accept instant card payments. Complete documents privately with the provider. Reconcile payment in the merchant dashboard before written confirmation. |
| P0 | `data/group-departures.json`, `data/tours.json`, `terms.html` | Confirm licensed operations, current supplier rates, actual accommodation, minimum party, group decision deadline, festive supplements and cancellation/refund arrangements. Keep proposals labelled until those arrangements exist. |
| P0 | `travel-support.html`, `viajes-en-espanol.html` | Check the actual vehicle, room, paths and assistance provider against each enquiry. Confirm language availability and support costs; do not promise universal access. |
| P1 | `templates/home.html`, `guest-services.css`, `operator.css` | Complete a live mobile/desktop browser review: navigation panel height, form zoom, welcome dismissal, focus visibility, horizontal overflow and touch carousel controls. Browser-based visual QA was unavailable in this managed session. |
| P1 | `journey.js`, `script.js`, `guest-services.js` | Test end-to-end delivery with the owner's real email and WhatsApp. Forms prepare drafts; the visitor must send them. If automatic delivery is required, add a validated server endpoint and private records, with abuse protection and authenticated owner access. |
| P1 | `BOOKING-LAUNCH.md`, `LAUNCH.md`, enquiry drafts | Domain and HTTPS are connected; canonical URLs use `https://davidexplora.com`. Search Console verification and sitemap submission were confirmed. Public contacts use `info@davidexplora.com` after a two-way test exchange. Gmail authentication and inbox placement still need checking because the outgoing tests landed in Spam. |
| P1 | `data/social-links.json`, `business-links.js` | Add the exact owner-verified Facebook and real public review/listing URLs. Empty entries stay hidden. Do not invent profiles or ratings. |
| P2 | `style.css`, `launch.css`, `story.css`, `operator.css`, `scripts/build_tours.py` | Consolidate overlapping legacy CSS and shared page rendering incrementally. New components have a bounded stylesheet; a large styling rewrite was not necessary for these additions. |
| P2 | `education-vision.html`, `data/articles.json` | Agree one education pilot with an appropriate partner, cost, selection/safeguarding plan and reporting method before introducing fundraising or a booking contribution. |

## Verification

Node tests cover enquiry validation/encoding, real DOM handlers, navigation and carousel behaviour, saved lists, tour completeness, December date/nights arithmetic, tentative calendar syntax, expired departures and welcome handling when storage is blocked. The static checker checks page structure, headings, field labels, image dimensions/alt text, local links, credits, structured data and sitemap coverage. Generated output is reproducible. These checks do not replace a live browser review or confirmation of supplier/merchant arrangements.

## Package photography and arrangement follow-up · 14 October 2026

The four new screenshots showed weak Nyerere/Lemosho cover choices, an awkward cropped guiding portrait and coffee as the main safari-and-local-life image. This update replaces those covers with documented real photographs, strengthens the special-journey cards, makes departure rows more compact and separates duration/start/quote information. Seven itineraries now expose their accommodation, transfers, preparation or activity boundaries before the day-by-day plan.

References reviewed for information structure: Asilia’s itinerary finder and detailed small-group itinerary (https://www.asiliaafrica.com/itineraries/), Nomad’s itinerary and Nyerere pages (https://www.nomad-tanzania.com/safaris/itineraries), Zara’s destination/group structure (https://zaratanzaniaadventures.com/) and Ultimate Kilimanjaro’s route breakdown (https://www.ultimatekilimanjaro.com/lemosho-route/). The original David Explora branding and writing are retained; competitor photography, prices, ratings, awards and operational claims are not copied.

The floating contact controls have been consolidated, and the welcome now remembers whether it appeared during this browser session. It closes on Escape and when the traveller starts using a form, without moving focus out of the form. The previous priority list remains applicable: these presentation improvements do not activate card checkout or confirm supplier availability.
