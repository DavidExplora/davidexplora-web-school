# David Explora

The original David Explora website: plain HTML, CSS and JavaScript for personal Tanzania travel planning with David Amani Lyamuya.

## What is included

- Home, Kilimanjaro overview, Machame, Lemosho and Marangu routes.
- Safari overview, Serengeti, Ngorongoro, Tarangire and Lake Manyara.
- Zanzibar overview, Stone Town, Changuu / Prison Island and Mnemba waters.
- Local Tanzania, privacy information, booking information and a 404 page.
- An illustrative journey builder and a traveler-reviewed WhatsApp inquiry.
- The project's selected photographs, with faster WebP delivery versions. Original image files remain available.
- Shared navigation, footer, mobile layouts, image dimensions, accessible form labels, social metadata and sitemap.

The form does not reserve inventory, accept payments or submit to a database. It prepares a message to +255 778 321 400. The traveler opens WhatsApp and presses Send. Quotes and bookings are confirmed directly by David.

## Open in VS Code

The launch update is built and hosted. Uploading it to GitHub is currently blocked: the connected integration returned HTTP 403, "Resource not accessible by integration." The remote `main` branch is still at `ac39ca42fb650279773791bcc8f1545e24ec0b20` until write access is restored or the update is pushed from your own computer.

For the completed downloadable source, copy the files from its `website` folder into your existing clone, preserving the clone's `.git` directory. Review `git status` before committing. The download also includes a binary patch based on the commit above; if you prefer that route, run `git apply --check` before applying it, and keep any existing edits safe.

After the update has been pushed, if you already cloned this repository:

```sh
git checkout main
git pull --ff-only origin main
```

If you have uncommitted local edits, commit or stash those edits before pulling; do not discard them. Use VS Code Live Server to view `index.html`, or serve the repository with:

```sh
python -m http.server 8000
```

Then open http://localhost:8000. No install or build step is required.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Home, planner, FAQ and trip request |
| `style.css` | Original page and route styles |
| `launch.css` | Shared launch design and responsive refinements |
| `journey.js` | Pure planner, destination presets and inquiry validation |
| `script.js` | Menu, planner and form interaction |
| `images/optimized/` | Delivery versions of selected project photos |
| `scripts/check_site.py` | Complete-page, link, metadata and form checks |
| `scripts/set_site_url.py` | Update canonical URLs after attaching a domain |
| `scripts/package_site.py` | Create a clean static deployment directory |
| `LAUNCH.md` | Domain, email, hosting and launch instructions |

## Checks

```sh
node --check journey.js
node --check script.js
node --test tests/journey.test.cjs
python scripts/check_site.py
```

The planner tests cover every destination/interest/duration combination, short-mountain-trip limits, route day buffers, invalid dates, consent, traveler counts and encoded WhatsApp messages. GitHub Actions runs these checks on pushes and pull requests.

## Hosting

The hosted website uses the same public-facing files as this repository. Domain registration and a professional mailbox are separate services; see `LAUNCH.md`. Do not put credentials or private traveler information in this public repository.

To prepare only the public website files for a static host:

```sh
python scripts/package_site.py dist
```

Only this generated directory is deployed. There is no booking backend or third-party analytics script.
