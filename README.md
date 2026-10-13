# David Explora

Tanzania safaris, Kilimanjaro treks, Zanzibar experiences and local day trips, planned with David Amani Lyamuya.

Website: https://david-explora.fastash16.chatgpt.site

## Source and editing

The site is plain HTML, CSS and JavaScript with no runtime framework. There are 53 public HTML pages and 29 tour itineraries.

- `templates/home.html`: editable homepage, shared navigation and footer.
- `data/tours.json`: tour names, estimates, group-price assumptions and itineraries.
- `scripts/build_tours.py`: tour pages, galleries, catalogue and generated tour data.
- `scripts/build_daytrips.py`: day-trip hub, separate city-walk links and comparison table.
- `scripts/build_zanzibar.py`: island hub, coast-based tour groups, comparison table and homepage Zanzibar slider.
- `scripts/build_discovery.py`: map, destination data, booking guide and shared navigation.
- `operator.css`: shared navigation, current design and responsive layouts. Older destination styles remain in `style.css`, `launch.css` and `story.css`.
- `experience.js`: photo galleries, touch swiping, filters and package selection.
- `ui.js`: manual featured-tour slider, optional automatic Zanzibar rails and active navigation.
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

The homepage uses four destination photographs, experience categories, a horizontally scrollable tour catalogue, photo galleries, local-guide information and practical planning notes. The tour rail supports touch, arrow buttons and keyboard navigation. Gallery autoplay pauses for keyboard focus, swipes, background tabs and reduced-motion preferences; visitors can explicitly resume it.

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
