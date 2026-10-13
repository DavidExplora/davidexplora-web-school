# Special journeys, journal and education vision

Release scope: 13 October 2026. The website has 39 catalogue tours, eight original articles and 76 HTML pages including the 404 page.

## Reference review and decisions

The supplied Zara screenshots show a special-package collection, category tiles, recent articles, a complete article index and an operator story. Their useful structure is adapted into David Explora’s existing forest/cream/copper design. Zara’s text, images, customer reviews, charity identity and dated March 2024 promotion are not reused.

The reference pages were inspected directly:

- https://zaratanzaniaadventures.com/tanzania-special-tour-packages/
- https://zaratanzaniaadventures.com/category/climbing-kilimanjaro-archives/
- https://zaratanzaniacharity.org/travel-with-purpose

The complete site remains a static HTML/CSS/JavaScript project. No framework migration or paid service is needed for the new features.

## Where to maintain the content

- `data/tours.json`: master details of the four special journeys, overnight counts, mountain-day counts and all existing tours.
- `data/special-journeys.json`: collection IDs, themes and intended audiences. Keep IDs aligned with the catalogue.
- `data/articles.json`: original guide copy, sections, sources, date and related-tour IDs.
- `scripts/build_editorial.py`: journal, eight article pages, special-journey hub, founder page, education vision and homepage sections.
- `scripts/site_features.py`: shared header/footer and homepage section markers.
- `journal.js` / generated `journal-data.js`: guide search, reading list, reading progress and up-to-three journey comparison. All state is local to the visitor’s browser.
- `operator.css`: responsive editorial, article, comparison and education layouts. Desktop hover navigation begins above 1300 CSS pixels; smaller layouts use the scrollable menu.

Use `python scripts/build_site.py` for the complete build. Generated pages and JavaScript data are committed; do not edit them independently.

## Four new journey boundaries

| Journey | Complete trip | Mountain time | Overnight plan | Pricing |
| --- | --- | --- | --- | --- |
| Kilimanjaro & Northern Safari | 14 days | 7-day Machame | 6 mountain tents + 2 Moshi + 3 safari + 2 Arusha = 13 | Personal quote |
| Northern Safari & Local Life | 8 days | None | 2 Arusha + 3 safari + 2 Moshi = 7 | Personal quote |
| Women’s Kilimanjaro Journey | 9 days | 7-day Machame | 6 mountain tents + 2 Moshi = 8 | Personal quote |
| Zanzibar Culture & Coast | 7 days | None | 2 Stone Town + 4 coastal = 6 | Personal quote |

The combined climb/safari route has a long Moshi-to-Tarangire transfer on day 9. Name accommodation, operating parties, safety provisions, fees, meals, room/tent basis, transport and cancellation terms in every actual quote. Female guide/crew preferences depend on availability. No fixed special-event dates, summit success rate or held inventory is advertised.

The special journeys have no supplier-confirmed cost model, so no competitive retail amount or profit is invented. Quote the complete actual cost, contingency, commissions/taxes as applicable and the owner’s operating contribution before confirming a booking. Existing guide prices are unchanged.

## Explora Education Vision: proposed, not launched

The public vision follows David’s stated wish to help young people continue education. Only that authorised broad story is used. Private financial documents, family details and student records are not published.

Current stage: define the vision and invite partnership conversations. No charity registration, named school partner, donation payment route, committed booking percentage, beneficiary count or delivered programme is established. The site does not collect donations or silently include support in tour prices.

Before a pilot launches, the owner should agree:

1. An appropriate local education/community partner and the required operating arrangements.
2. A needs-led pilot, fair selection process, consent/supervision and safeguarding responsibilities.
3. A complete pilot budget, payment recipient, record-keeping and reporting responsibilities.
4. The exact contribution offer, if any, separately from travel payments.
5. A factual progress update after documented delivery, with beneficiary privacy protected.

Public school drop-ins, orphanage visits and access to children are not a tour feature. A future supervised mentoring programme needs its own delivery arrangements. UNICEF resources are reading references, not affiliations.

Partnership contact links open an editable WhatsApp/email draft; users must send it themselves. Expressing interest is not a subscription, donation or confirmed project visit.

## Next useful development work

1. Owner review of the new itineraries with actual suppliers, and a real phone/desktop review of navigation, guide filters, comparisons and quote handoff.
2. Confirm a first local education partner and one costed pilot before changing the public programme status.
3. Add actual, permission-cleared education-project photographs and documented updates only after the relevant work happens.
4. Publish further destination articles through the existing data file, keeping source dates, route details and related links current.
5. Connect the purchased domain, professional mailbox and an approved merchant payment process when ready; these remain separate launch tasks.

## Validation

Node fixtures test meaningful search, storage, selection limits and new itinerary boundaries. The structural checker verifies every page, local path, source link, form label, image dimension, structured article/trip data and sitemap entry. The full build is checked for reproducible output. Browser visual QA is unavailable in the managed editing environment; the supplied reference screenshots and actual image assets were inspected visually.
