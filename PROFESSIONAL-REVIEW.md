# David Explora: professional website review

Reviewed 13 October 2026. This release improves the existing static website and keeps its 39 itineraries, eight articles, own photographs and destination films.

## What changed

| Priority | Finding | Change and source files |
| --- | --- | --- |
| High | The home page repeated planning promises and gave six recent safari additions most of the featured space. | Moved David’s introduction earlier; consolidated planning into three booking steps; curated six tours across mountain, safari and island travel. Removed duplicate day-trip and preparation blocks while keeping the dedicated Marangu feature. `templates/home.html`, `scripts/site_features.py`, `scripts/build_tours.py`. |
| High | Tour details showed a start but omitted the finish, and repeated the same metadata and generic enquiry text. | Added explicit start/finish facts, section links and enquiries suited to each trip type. Returns without a stated location remain subject to agreement rather than implying an included transfer. `scripts/build_tours.py`, generated tour pages. |
| High | The Southern Tanzania hero showed Serengeti imagery. | Uses Rufiji and two verified Mikumi photographs. The general safari hero continues to introduce north and south. `scripts/build_safaris.py`. |
| High | The enquiry omitted the starting location and date flexibility; guide language could imply automatic availability. | Added optional starting location and date flexibility, validated and preserved in both draft links. Clarified language-guide availability and where to include children’s ages. Updated the factual privacy description. `templates/home.html`, `journey.js`, `script.js`, `privacy.html`. |
| Medium | First focus on the tour-rail Pause control changed the state before the click, potentially restarting movement. | Focus stops movement without reversing the control’s state. Explicit Play still works. Added regression coverage. `ui.js`, `tests/rail.test.cjs`. |
| Medium | Mobile-menu resize handling used a different breakpoint from the navigation layout. | Aligned resize handling at 1301 px; mobile navigation remains usable below it. `ui.js`, `tests/rail.test.cjs`. |
| Medium | The wording used repetitive metaphors and inconsistent English spelling. | Rewrote founder, home, journal introductions and itinerary requests around specific experiences and arrangements. Uses British English in the revised copy. Existing tour URLs, including “snorkeling” URLs, stay stable. `data/articles.json`, `data/tours.json`, page builders. |
| Medium | Long planner controls dominated the home-page flow. | Kept the existing three-choice planner inside a native keyboard-accessible disclosure. Improved tour text size, section navigation, facts, portrait framing and mobile hero sizing. `templates/home.html`, `operator.css`. |
| Medium | Mountain-and-safari journeys were labelled “Safari + coast”. | Corrected the shared category label to “Combined journeys”. `scripts/build_tours.py`. |

## Operator references

These references informed the information order and practical questions. Copy, photographs, reviews, awards, hotel claims and social-impact figures were not taken from competitors.

- [Expert Africa: Tanzania](https://www.expertafrica.com/tanzania): make regions, travel methods, duration and party-based prices easy to compare.
- [Asilia: Tanzania Highlights](https://www.asiliaafrica.com/itineraries/tanzania-highlights/): show duration, start/end points and travel between overnight stops before detailed sales copy.
- [Asilia enquiries](https://www.asiliaafrica.com/enquire/): allow uncertain dates and preferences when a traveller first enquires.
- [Nomad Tanzania](https://www.nomad-tanzania.com/) and [contact form](https://www.nomad-tanzania.com/contact): make the people behind the trip visible and collect the useful planning details.
- [Zara Tanzania Adventures](https://www.zaratours.com/): keep special journeys, destination information and articles discoverable without copying its campaigns or impact claims.
- Official [Nyerere visitor guide](https://www.tanzaniaparks.go.tz/nyerere/visitor-guide), [Mikumi visitor guide](https://www.tanzaniaparks.go.tz/mikumi/visitor-guide) and [Zanzibar season guide](https://zanzibartourism.go.tz/when-to-go) were checked as destination references. Seasonal guidance remains general.

## Business inputs still needed

The site prepares enquiries and supports written quotation; it does not reserve hotel rooms, process payments or confirm delivery of WhatsApp/email messages.

1. Reconfirm supplier costs, park fees, accommodation availability and the complete margin for each actual quote. Website figures remain planning estimates; this release does not change the numeric prices.
2. Maintain source/permission records for older project photographs alongside the existing Creative Commons and supplied-photo records. Newly selected southern hero photographs already have credits.
3. Name the contracting operator, actual guides, properties, transport and cancellation/payment terms in the final quote. Publish additional credentials or verified review profiles only when supplied and checked.
4. Keep the education vision at its actual development stage until the partner, budget and first pilot are agreed. It does not claim existing beneficiaries or collect donations.
5. Add the exact Facebook profile when available. The three verified Instagram, TikTok and LinkedIn links remain available.

## Verification

Run `python scripts/build_site.py`, `node --test tests/*.test.cjs`, JavaScript syntax checks and `python scripts/check_site.py`. Generated HTML is checked for complete structure, local links, image dimensions, labels, carousel controls, structured data and sitemap coverage. Regression tests cover the actual enquiry submission handler, draft encoding, the first Pause click and the mobile-menu breakpoint.

Browser visual/device testing was unavailable in this environment. Perform a real phone/desktop check of navigation, portrait crops, video backgrounds, horizontal rails and the full enquiry before paid promotion. This limitation is separate from the source, behaviour and deployment checks.
