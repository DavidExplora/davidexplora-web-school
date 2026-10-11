# David Explora

Personal Tanzania journeys with David Amani Lyamuya. The original website stays in plain HTML, CSS and JavaScript. Open `index.html` in VS Code Live Server, or run `python -m http.server 8000` and visit http://localhost:8000. Visitors need no installation or build step.

Website: https://david-explora.fastash16.chatgpt.site

## The photo-story update

- A moving safari hero with supplied wildlife and vehicle photographs.
- Separate safari, seven-day Machame, Zanzibar and local-life stories, with pause, arrows, chapter controls and reduced-motion support.
- 18 detailed tour pages: walks and day trips, private safaris, camping, comfort lodges, summit routes and tailored luxury journeys.
- A searchable catalogue with category, duration and estimated-price filters.
- Day-by-day plans, inclusions, exclusions, start/end points, group-based estimates and two-adult alternatives where available.
- A Tanzania planning guide, photo credits, page-specific search metadata, structured trip data and sitemap.
- Package-specific WhatsApp requests with optional per-adult budget, message review and consent.

There are 39 HTML pages, retaining the original destinations, routes, privacy, booking information and 404.

## Booking and backend

The site prepares a message to **+255 778 321 400** in the visitor's browser. The traveler reviews it, opens WhatsApp and presses Send. David responds with an itinerary and written quote. There is no booking database, live inventory, automatic email delivery or online payment backend. A prepared message is not sent; an inquiry is not a confirmed reservation.

Guide prices are estimates, not verified supplier offers. The group basis appears next to each price. See `PRICING.md` for research and final costing. The site keeps David's Gmail contact until the professional mailbox is created and tested.

## Edit the catalogue

1. Edit titles, prices, group bases and itinerary details in `data/tours.json`.
2. Run `python scripts/build_tours.py` to regenerate the catalogue, detail pages, visible price cards, guide, photo credits, `tour-data.js` and sitemap. It uses Python's standard library.
3. Run the checks. Commit the editable data and generated pages together.

Home copy and the main hero are ordinary HTML. Other photo-story content is defined in `scripts/build_tours.py` and generated into the home and destination pages. `story.css` styles the new features; `launch.css` and `style.css` retain the established design. `experience.js` handles stories, filters and package selection; `packages.js` holds catalogue logic. `journey.js` and `script.js` retain the planner and inquiry flow.

New photos are in `images/stories/`. Licensed photo sources are in `data/photo-credits.json` and the public credits page. Responsive WebP copies improve loading. When replacing a photograph, update dimensions, alt text and credits, and use material you have rights to publish. Do not label independent travelers as David's clients or representative vehicles as an owned fleet.

## Checks

```sh
node --check journey.js
node --check script.js
node --check packages.js
node --check experience.js
node --check tour-data.js
node --test tests/*.test.cjs
python scripts/build_tours.py
python scripts/check_site.py
```

Nineteen tests cover all 80 planner combinations, filtering, price bases, route buffers, inquiry validation/encoding, carousel controls, visibility pauses and reduced motion. The page checker checks links and responsive images, complete HTML, labels, photo controls and credits, trip structured data and sitemap. GitHub Actions also checks that regeneration leaves committed files unchanged.

DOM-fixture and static checks do not replace a visual review on a real phone and desktop. No browser preview was available for this update. A delivered test WhatsApp inquiry still needs a real account.

## GitHub and VS Code

The previous launch source was verified on GitHub at `19d960a71c918a2b908d6d67d0a1b0c39f266070`. This photo-story update must be applied to the Windows clone and pushed using authenticated Git access. The connected integration could read the repository but returned HTTP 403 for writes.

The download includes complete source, a checked binary patch and a Windows helper. The helper requires a clean repository, checks the patch, then applies it to the existing clone; it never commits or pushes automatically. Keep local edits safe if the helper reports a dirty working tree. Review the update, then commit and push from VS Code.

Publishing the hosted Site and pushing GitHub are separate operations; automatic synchronization is not configured. See `LAUNCH.md` for domain, email and optional GitHub-triggered hosting.

## Package for hosting

```sh
python scripts/package_site.py dist
```

Only public pages, scripts and images are included. Tests, research notes and Git metadata are excluded. Use `scripts/set_site_url.py` only after the purchased domain serves successfully, then regenerate and check before publishing.
