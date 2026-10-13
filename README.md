# David Explora

Tanzania safaris, Kilimanjaro treks, Zanzibar experiences and local day trips, planned with David Amani Lyamuya.

Website: https://david-explora.fastash16.chatgpt.site

## Source and editing

The site is plain HTML, CSS and JavaScript with no runtime framework. There are 94 HTML pages (including 404 and one legacy package redirect), 42 tour itineraries and 12 original travel articles.

- `templates/home.html`: editable homepage, shared navigation and footer.
- `data/tours.json`: tour names, estimates, group-price assumptions and itineraries.
- `scripts/build_tours.py`: tour pages, galleries, catalogue and generated tour data.
- `scripts/build_daytrips.py`: day-trip hub, separate city-walk links and comparison table.
- `scripts/build_zanzibar.py`: island hub, coast-based tour groups, comparison table and homepage Zanzibar slider.
- `scripts/build_safaris.py`: northern/southern safari hubs, migration and family planning notes.
- `scripts/site_features.py`: shared navigation, profile icons and homepage quick planner/film components.
- `scripts/build_discovery.py`: map, destination data, booking guide and shared navigation.
- `data/articles.json` and `data/special-journeys.json`: original travel guides and the curated special-journey collection.
- `scripts/build_editorial.py`: journal, articles, special journeys, founder story and the proposed education vision.
- `data/group-departures.json`: proposed December 2026 dates and group sizes; never live inventory.
- `scripts/build_guest_services.py`: departure rows, tentative calendars, welcome prompt, privacy notes and English/Spanish guest support pages.
- `guest-services.js` and `guest-services.css`: departure-date expiry, dismissible welcome, support and payment-request drafts.
- `payments.html`: requests instructions against a written quote; instant checkout remains inactive.
- `journal.js`: article search, browser-local reading lists, reading progress and journey comparison.
- `operator.css`: shared navigation, current design and responsive layouts. Older destination styles remain in `style.css`, `launch.css` and `story.css`.
- `experience.js`: photo galleries, touch swiping, filters and package selection.
- `ui.js`: manual featured-tour slider, optional automatic Zanzibar rails and active navigation.
- `features.js`: saved tours, copied links, printing, disclosure navigation, quick-plan handoff and desktop hover navigation.
- `data/social-links.json`: owner-known profile URLs; Facebook is pending the owner’s exact URL.
- `journey.js` and `script.js`: itinerary suggestions, validation and enquiry drafts.

Edit the source template or catalogue, then run the complete build. Do not edit generated tour pages directly: regeneration replaces them. The shared header/footer is applied to every page, including older destination pages.

```sh
python scripts/build_site.py
node --test tests/*.test.cjs
python scripts/check_site.py
python scripts/package_site.py dist
```

The complete build runs the generators in the required order. GitHub Actions rebuilds the site and rejects any uncommitted generated differences. Running the complete build twice should leave all outputs unchanged.

## Design and interactions

The homepage begins with a three licensed destination films and a supplied coffee photograph, a compact trip starter, experience categories and a horizontally scrollable tour catalogue, followed by local-guide information and practical planning notes. The tour rail supports touch, arrow buttons and keyboard navigation. Gallery autoplay pauses for keyboard focus, swipes, background tabs and reduced-motion preferences; visitors can explicitly resume it.

The Zanzibar rails advance only while visible, stop for keyboard/touch/manual browsing, pause on hover and respect reduced motion. Their automatic movement does not trigger repeated screen-reader announcements. Zanzibar tour galleries retain captions distinguishing exact destination photographs from activity illustrations.

Tour selection preserves the customer’s traveler count and any edited message or preferences. Map `trip` links and older `experience` links prefill the correct destination. A valid `package` link takes precedence for untouched package fields.

## Booking

The site prepares a WhatsApp or email draft in the visitor’s browser. The visitor must open the app and press Send. There is no automatic email delivery, reservation database, online inventory or card checkout. A prepared request is not a delivered enquiry or confirmed booking.

WhatsApp: +255 778 321 400. Email: davidlyamuya819@gmail.com.

Displayed prices are estimates with adult group assumptions. Verify supplier costs, services and availability before issuing the final quote. Use an approved merchant payment method against a written quote; see `BOOKING-LAUNCH.md` and `PRICING.md`.

## Photos and checks

Existing WebP assets are used with correct dimensions and responsive variants where available. Photo sources and licenses are recorded in `data/photo-credits.json` and `photo-credits.html`. Destination images do not establish ownership of a vehicle or property.

Tests cover planner combinations, URL presets, catalogue filtering, enquiry validation and encoding, preservation of customer preferences, tour-rail boundaries/keyboard controls, and gallery pauses/swipes/reduced motion. The structural checker verifies local paths, headings, labels, image dimensions, gallery controls, structured data and sitemap coverage.

Automated checks do not substitute for a phone/browser review or confirmation that a real sent enquiry arrives. The redesign was checked structurally and with Node DOM fixtures; browser preview was unavailable in the editing environment.

## Hosting and domain

GitHub and the hosted Site have separate repositories. Pushing GitHub alone does not deploy the hosted Site. Publish the checked `dist` package through the existing Site project; preserve its current audience.

After a purchased domain serves correctly, run `python scripts/set_site_url.py https://your-domain.com`, then rebuild, check and republish. This updates the home source template as well as generated metadata. Set up and test a professional mailbox before replacing the Gmail contact.

## Day-trip expansion

The catalogue has separate Arusha, Moshi and Marangu products. The old combined-city URL remains a chooser linking to the two city walks. The local day-trip hub orders city walks, village culture and nature days; the homepage has a dedicated day-trip selection.

Five detail pages have automatic photograph galleries with manual arrows, swipe support, pause controls and reduced-motion behavior. New location assets are in `images/daytrips/`, with author, original dimensions, dates, source URLs and image licences recorded in the photo-credit data. Each adapted WebP remains available under its stated Creative Commons licence. Photos are destination illustrations, not claims of an exclusive client visit or a specific host contract.

`data/daytrip-costs.json` records internal USD cost assumptions for a two-adult private booking. These are planning estimates, not supplier-confirmed costs or guaranteed net profits. Confirm actual guide, transport, entry/community, food and operating costs before confirming a booking; recalculate for solo travelers, children, different pickup areas, commissions and tax obligations. See `DAYTRIP-OPERATIONS.md`.

## Zanzibar expansion

The island hub groups boat/reef tours, culture/nature visits, water sports and a six-day guesthouse stay. Departure notes distinguish Stone Town, Matemwe, Michamvi, Jozani, Jambiani and Kizimkazi; day-tour transport is not silently included. Clear kayaks are an optional equipment upgrade, jet skis have a defined riding slot, and the introductory dive is one dive with medical/provider assessment.

`data/zanzibar-costs.json` and `ZANZIBAR-OPERATIONS.md` contain unverified supplier-cost assumptions, current retail comparison sources, pricing decisions and direct operating-contribution calculations. Confirm actual rates before quoting; modeled contribution is not net profit and excludes OTA commission. New photo provenance is public in `photo-credits.html`.

## Safari and planning expansion

Six additional itineraries cover Nyerere road/fly-in travel, Mikumi, a six-day northern cultural safari, a four-day luxury highland route and a six-day safari/island combination. `SAFARI-OPERATIONS.md` records route and price boundaries. Northern and southern departures are separate; the 6-day combined route includes two island nights and one scheduled flight.

All tours can be saved in local storage, copied as links and printed as an itinerary. Saved IDs are browser-local and never presented as public likes. No public comment database, newsletter subscription service or card checkout has been added. Print expands the full itinerary and preserves quote qualifications.

The 12-second 720p muted Serengeti film is adapted from Bettina May’s CC BY 3.0 footage. `data/media-credits.json` documents the licence and excerpt/poster modifications. The film and galleries pause off-screen, in background tabs and for reduced motion; data-saving mode prevents the automatic video download. The homepage story also includes two real 1080p Kilimanjaro and Zanzibar clips under the Pexels License, with source links and adaptations recorded in the same media ledger. These films stay in the hero background; there is no popup film tile. Hovering the background does not stop playback, while the visible pause control and keyboard focus remain available.

Builders explicitly use UTF-8 for Windows and CI consistency. Use the complete build pipeline before checking and packaging. Browser visual QA remains unavailable in this managed editing environment; Node behaviour fixtures and the full structural checker validate the shipped state.

## Hover navigation and Marangu day trips

On desktop with a fine pointer, destination menus open on hover. A short close delay lets the pointer reach the panel; Escape closes it, focused menu links remain available, and touch/small screens retain native click disclosures.

The existing Marangu village tour is featured on the home and day-trip pages, with four real photos including David’s supplied coffee photos. Its USD 75 estimate for two adults and Moshi pickup are unchanged. The separate USD 245 national park rainforest day hike is also easy to find; neither day trip is described as a summit climb.

## Journal, special journeys and education vision

The new editorial section contains eight original guides across six subjects, with real photos, section navigation, source links and related itineraries. Search by subject or article content, save guides locally, and print a readable PDF through the browser. Article metadata and the sitemap are generated alongside the tour catalogue.

Four additional personal-quote journeys include realistic arrival/departure days and overnight counts. The special collection lets visitors compare up to three choices; all four remain readable without JavaScript. The Zanzibar comparison now supports tailored prices. Saved tours scale to the complete catalogue.

The Explora Education Vision is a proposed initiative with a practical pilot roadmap and partnership draft links. There are no donation collections, automatic booking contributions, established school partners or fabricated impact claims. See `EDITORIAL-OPERATIONS.md` for source references, itinerary boundaries and the owner’s next delivery decisions.
