"""Build crawlable tour pages from the editable catalogue. No runtime dependency."""
from pathlib import Path
from html import escape
import json, re, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
TOURS = json.loads((ROOT/'data/tours.json').read_text())
HOME = (ROOT/'index.html').read_text()
ORIGIN = re.search(r'<link rel="canonical" href="([^"]+)', HOME)[1].rstrip('/')
HEADER = re.search(r'<header class="site-header">.*?</header>', HOME, re.S)[0]
FOOTER = re.search(r'<footer class="site-footer">.*?</footer>', HOME, re.S)[0]
FLOAT = re.search(r'<a class="whatsapp-float".*?</a>', HOME, re.S)[0]
CATEGORIES = {'safari':'Safari', 'trekking':'Kilimanjaro', 'zanzibar':'Zanzibar', 'local':'Local Tanzania', 'combined':'Safari + coast'}

def esc(value): return escape(str(value), quote=True)
def money(value): return f'USD {value:,.0f}'
def image_size(path):
    """Read WebP dimensions without installing imaging dependencies to build the site."""
    source=(ROOT/path).read_bytes()
    if source[:4]!=b'RIFF' or source[8:12]!=b'WEBP': raise ValueError(f'Expected an optimized WebP: {path}')
    offset=12
    while offset+8<=len(source):
        kind=source[offset:offset+4];size=int.from_bytes(source[offset+4:offset+8],'little')
        payload=source[offset+8:offset+8+size]
        if kind==b'VP8X': return 1+int.from_bytes(payload[4:7],'little'),1+int.from_bytes(payload[7:10],'little')
        if kind==b'VP8 ': return int.from_bytes(payload[6:8],'little')&0x3fff,int.from_bytes(payload[8:10],'little')&0x3fff
        if kind==b'VP8L':
            packed=int.from_bytes(payload[1:5],'little');return (packed&0x3fff)+1,((packed>>14)&0x3fff)+1
        offset+=8+size+(size%2)
    raise ValueError(f'No WebP dimensions found: {path}')

def img(path, alt, hero=False, sizes='(max-width: 780px) 90vw, 40vw'):
    w,h = image_size(path)
    small = Path(path).with_stem(Path(path).stem+'-small')
    responsive = ''
    if (ROOT/small).exists():
        sw,_ = image_size(small)
        responsive=f' srcset="{small.as_posix()} {sw}w, {path} {w}w" sizes="{sizes}"'
    return f'<img src="{path}"{responsive} alt="{esc(alt)}" width="{w}" height="{h}" '+('fetchpriority="high" loading="eager"' if hero else 'loading="lazy"')+' decoding="async">'

def image_alt(tour):
    if tour['image'].endswith('kilimanjaro-guide.webp'): return 'David and a traveler on a Kilimanjaro trail'
    return {
        'baobab-elephants.webp':'Elephants beside a baobab in a green savannah',
        'crater-safari.webp':'Safari vehicle and zebras in a broad green landscape',
        'plains-game-drive.webp':'An open safari vehicle overlooking wildlife on the plains',
        'elephant-savannah.webp':'Elephants on a golden savannah',
        'zebras-safari-vehicle.webp':'Pop-up-roof safari vehicle with zebras beside the track',
        'kili-moorland.webp':'Moorland slopes on Mount Kilimanjaro',
        'kili-high-camp.webp':'Tents, a shelter and the Barafu sign on Kilimanjaro',
        'kili-forest.webp':'A path through Kilimanjaro’s montane rainforest',
        'local-tanzania.webp':'A waterfall surrounded by green Tanzanian forest',
        'stone-town-street.webp':'A narrow lane between historic Stone Town buildings',
        'stone-town.webp':'The Stone Town waterfront, the departure area for Changuu boats',
        'zanzibar.webp':'An island and turquoise waters in the Zanzibar archipelago',
        'zanzibar-spices.webp':'Nutmeg fruit growing on a tree in Zanzibar',
        'maasai-community.webp':'A Maasai settlement near Mount Lolmalasin, Tanzania',
    }[Path(tour['image']).name]

def price(tour):
    if tour['price'] is None:
        return '<span class="price-label">BUILT AROUND YOUR DATES</span><strong class="price-value">Personal quote</strong><span class="price-basis">Accommodation, travel dates and group size determine the price.</span>'
    return f'<span class="price-label">ESTIMATED FROM</span><strong class="price-value">{money(tour["price"])} <small>/ adult</small></strong><span class="price-basis">Based on {esc(tour["basis"])}. Final written quote confirms the price.</span>'

def card(tour):
    id,title=esc(tour['id']),esc(tour['title'])
    return f'''<article class="package-card" data-tour-id="{id}">
<a class="package-picture" href="{id}.html" aria-label="See {title}">{img(tour['image'], image_alt(tour))}<span class="package-category">{CATEGORIES[tour['category']]}</span></a>
<div class="package-body"><p class="package-meta">{esc(tour['duration'])} · {esc(tour['style'])}</p><h3><a href="{id}.html">{title}</a></h3><p>{esc(tour['summary'])}</p><span class="package-places">{' · '.join(map(esc,tour['places']))}</span>
<div class="package-price">{price(tour)}<div class="package-links"><a href="{id}.html">View itinerary ↗</a><a href="index.html?package={id}#contact">Request a quote ↗</a></div></div></div></article>'''

def selected_cards(ids): return '\n'.join(card(next(t for t in TOURS if t['id']==id)) for id in ids)

def page(filename, title, description, body, image='images/stories/zebras-safari-vehicle.webp', schema=None):
    url=ORIGIN+('/' if filename=='index.html' else '/'+filename)
    structured=json.dumps(schema,ensure_ascii=False).replace('</','<\\/') if schema else None
    source=f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)} | David Explora</title><meta name="description" content="{esc(description)}">
<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="launch.css"><link rel="stylesheet" href="story.css">
<meta name="robots" content="index, follow"><meta name="theme-color" content="#173d32"><meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="David Explora"><meta property="og:title" content="{esc(title)} | David Explora">
<meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{ORIGIN}/{image}"><meta name="twitter:card" content="summary_large_image">
{('<script type="application/ld+json">'+structured+'</script>') if structured else ''}
</head><body><a class="skip-link" href="#main">Skip to content</a>{HEADER}<main id="main">{body}</main>{FOOTER}{FLOAT}
<script src="tour-data.js" defer></script><script src="packages.js" defer></script><script src="journey.js" defer></script><script src="script.js" defer></script><script src="experience.js" defer></script></body></html>'''
    (ROOT/filename).write_text(source)

EXPLAIN='''<div class="price-explainer"><strong>A useful starting price, followed by your own written quote.</strong> Prices are planning estimates in USD per international adult, based on the group and sharing arrangement shown. They are not fixed offers. Your dates, party size, actual permit charges, accommodation and transfers can change the total. Children, residents, solo travelers and larger groups are quoted separately. Every final quote lists the complete payable total, taxes or fees, inclusions and booking terms before you confirm.</div>'''

def catalogue():
    options=''.join(f'<option value="{key}">{label}</option>' for key,label in CATEGORIES.items())
    body=f'''<section class="catalogue-heading"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Journeys &amp; prices</span></nav><p class="eyebrow">A REAL PLACE TO START</p><h1>A little adventure.<br>Or the journey of a lifetime.</h1><p>Find a trip that suits your time, your people and your budget. Explore full itineraries, compare the planned inclusions, then shape your own journey with David.</p>
<div class="budget-jumps"><a href="packages.html?budget=100">Day experiences under USD 100</a><a href="packages.html?category=safari">4×4 safaris</a><a href="packages.html?category=trekking">Kilimanjaro routes</a><a href="packages.html?category=zanzibar">Island stories</a></div></div></section>
<section class="section" data-catalogue><form id="package-filters" class="package-filters" role="search" aria-label="Find a journey" hidden>
<div class="filter-field"><label for="package-search">Place or experience</label><input id="package-search" type="search" placeholder="Serengeti, coffee, Machame…" autocomplete="off"></div>
<div class="filter-field"><label for="package-category">Your kind of Tanzania</label><select id="package-category"><option value="all">All experiences</option>{options}</select></div>
<div class="filter-field"><label for="package-length">Time on the journey</label><select id="package-length"><option value="all">Any length</option><option value="day">A day or less</option><option value="short">2–4 days</option><option value="long">5+ days</option></select></div>
<div class="filter-field"><label for="package-budget">Estimated price per adult</label><select id="package-budget"><option value="">Any budget + tailored quotes</option><option value="100">Up to USD 100</option><option value="300">Up to USD 300</option><option value="1000">Up to USD 1,000</option><option value="2000">Up to USD 2,000</option><option value="3000">Up to USD 3,000</option></select></div></form>
<div class="catalogue-status"><p id="package-count" role="status">{len(TOURS)} journeys to explore</p><button id="reset-packages" type="button" hidden>Reset filters</button></div>
<div id="package-empty" class="empty-packages" hidden><h2>No journeys match those choices.</h2><p>Try another budget or reset the filters. David can also help create a trip around your budget.</p><a class="text-link" href="index.html#contact">Plan something personal ↗</a></div>
<div class="package-grid">{''.join(map(card,TOURS))}</div>{EXPLAIN}<p class="photo-note">Photographs illustrate the destinations and travel styles. Exact vehicles and accommodation are confirmed in your itinerary. <a href="photo-credits.html">Photo credits</a></p></section>'''
    schema={'@context':'https://schema.org','@type':'ItemList','name':'David Explora Tanzania journeys','itemListElement':[{'@type':'ListItem','position':i+1,'name':t['title'],'url':ORIGIN+'/'+t['id']+'.html'} for i,t in enumerate(TOURS)]}
    page('packages.html','Tanzania Tour Packages & Guide Prices','Compare Tanzania safari, Kilimanjaro, Zanzibar and local tour itineraries with transparent group-based guide prices. Request your personal quote with David.',body,schema=schema)

def tour_page(tour):
    id=tour['id']
    schedule=''.join(f'<details class="day-accordion"{(" open" if n==0 else "")}><summary><span>{esc(day["label"])}</span>{esc(day["title"])}</summary><p>{esc(day["text"])}</p></details>' for n,day in enumerate(tour['itinerary']))
    included=''.join(f'<li>{esc(item)}</li>' for item in tour['includes'])
    excluded=''.join(f'<li>{esc(item)}</li>' for item in tour['excludes'])
    couple=f'<p class="couple-price"><strong>Travelling as two?</strong><br>Estimated from {money(tour["price2"])} per adult for 2 adults sharing. Your quote confirms the total.</p>' if tour['price2'] else ''
    buffer=f'<p><strong>Time in Tanzania:</strong> allow {tour["tripDays"]} days including arrival and departure around the {tour["days"]}-day mountain route.</p>' if tour['category']=='trekking' and tour['days']>1 else ''
    photo='David and a traveler on Kilimanjaro; meet the person planning your trip.' if tour['id'] in ['moshi-arusha-city-walk','chemka-springs-day'] else 'Destination and travel-style illustration. Your exact vehicle, property or activity arrangements are confirmed in the written itinerary.'
    related=[t for t in TOURS if t['category']==tour['category'] and t['id']!=id][:3]
    if len(related)<3: related += [t for t in TOURS if t['id']!=id and t not in related][:3-len(related)]
    body=f'''<div class="tour-top"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="packages.html">Journeys &amp; prices</a><span aria-hidden="true">/</span><span>{CATEGORIES[tour['category']]}</span></nav>
<div class="tour-heading"><div><p class="eyebrow">{esc(CATEGORIES[tour['category']].upper())} · YOUR NEXT CHAPTER</p><h1>{esc(tour['title'])}</h1><p>{esc(tour['summary'])}</p></div><div class="tour-mini"><strong>{esc(tour['duration'])}</strong><span>{esc(tour['style'])}</span><span>{esc(tour['start'])}</span></div></div>
<figure style="margin:0">{img(tour['image'],image_alt(tour),True,'90vw').replace('<img ','<img class="tour-wide-image" ')}<figcaption class="photo-note">{photo} <a href="photo-credits.html">Photo credits</a></figcaption></figure></div>
<div class="tour-body"><article class="tour-article"><section aria-labelledby="itinerary-title"><p class="eyebrow">THE JOURNEY, DAY BY DAY</p><h2 id="itinerary-title">Picture yourself here.</h2><div class="route-stops">{''.join(f'<span>{esc(p)}</span>' for p in tour['places'])}</div>{buffer}{schedule}</section>
<section aria-labelledby="included-title"><p class="eyebrow">KNOW WHAT YOU ARE PLANNING</p><h2 id="included-title">A clear view of the details.</h2><p>These are the planned inclusions for this itinerary. David confirms the exact services and total in your personal quote.</p><div class="inclusion-grid"><div><h3>Planned inclusions</h3><ul>{included}</ul></div><div><h3>Not included</h3><ul>{excluded}</ul></div></div></section>
<section><p class="eyebrow">GOOD TO KNOW</p><h2>Before you go.</h2><p>{esc(tour['notes'])}</p><p>Share your dates, actual group size, accommodation preference and access or dietary needs. Changes to the route and any extra costs are agreed with you in writing.</p><a class="text-link" href="travel-guide.html">Read the Tanzania planning guide ↗</a></section>
<section><h2>Make the journey yours.</h2><p>Start with this itinerary, add a local day, or finish by the sea. David will help balance travel time and your budget.</p><a class="btn btn-primary" href="index.html?package={id}#contact">Request my itinerary &amp; quote ↗</a></section></article>
<aside class="quote-aside" aria-label="Guide price and trip request">{price(tour)}{couple}<a class="btn btn-primary" href="index.html?package={id}#contact">Plan this journey ↗</a><p class="written-quote">Guide prices are estimates for international adults, not instant availability or a fixed offer. Your final written quote confirms the complete payable total and booking terms.</p><ol><li>Tell David your dates and group.</li><li>Review your itinerary and quote.</li><li>Agree arrangements before payment.</li></ol><a class="text-link" href="terms.html">How booking works ↗</a></aside></div>
<section class="section journey-ideas"><div class="section-heading"><p class="eyebrow">KEEP EXPLORING</p><h2>Another chapter to consider.</h2></div><div class="package-grid">{''.join(map(card,related))}</div></section>'''
    schema={'@context':'https://schema.org','@type':'TouristTrip','name':tour['title'],'description':tour['summary'],'url':ORIGIN+'/'+id+'.html','image':ORIGIN+'/'+tour['image'],'touristType':tour['style'],'itinerary':{'@type':'ItemList','itemListElement':[{'@type':'ListItem','position':i+1,'name':day['title']} for i,day in enumerate(tour['itinerary'])]}}
    title=tour.get('seoTitle',tour['title'])
    description=f'{title}. See the itinerary, planned inclusions and transparent group-based guide price. Request your personal quote with David Explora.'
    page(id+'.html',title,description,body,tour['image'],schema)

STORIES = {
'safari': [
('images/stories/zebras-safari-vehicle.webp','A pop-up-roof safari vehicle near zebras','01 / THE ROAD OPENS','Your window onto the wild.','A 4×4, an open roof and a day with room to explore. Choose a private day safari, a camping circuit or a stay in carefully chosen lodges.','safari.html','Explore safari styles'),
('images/stories/baobab-elephants.webp','Elephants and a baobab in green savannah','02 / ELEPHANT COUNTRY','Slow down. Look closer.','Tarangire brings river landscapes and baobabs into your northern safari plan. Spend time watching, with a picnic break and a guide who helps you notice the details.','tarangire-day-safari.html','See the Tarangire day'),
('images/stories/tarangire-baobab.webp','Elephants under a baobab in a dry savannah','03 / A DIFFERENT SEASON','The landscape changes the story.','Golden dry-season days and greener months feel different on the same northern circuit. Tell David when you can travel, and plan the parks around that season.','travel-guide.html#seasons','Find your safari season'),
('images/stories/lion-family.webp','A group of lions resting in grass','04 / A MOMENT WORTH WAITING FOR','The plains have their own pace.','Take the longer route into the Serengeti. Early starts, patient game drives and time in camp become part of the story. Sightings follow nature’s schedule.','4-day-serengeti-camping.html','Explore a camping safari'),
('images/stories/crater-safari.webp','Safari vehicle and zebras on a green open landscape','05 / ANOTHER WORLD','A crater day on your itinerary.','Include the Ngorongoro Crater in a northern circuit. David confirms access, drive time and the night before, so the plan works as a real journey.','2-day-tarangire-ngorongoro.html','See the two-day journey'),
('images/optimized/manyara.webp','Zebras by a lake with flamingos in the background','06 / LAKESIDE DISCOVERIES','A different side of the circuit.','Add a Lake Manyara day to a tailored northern journey. Woodland, lake views and birdlife bring another landscape into the plan; sightings depend on conditions.','manyara.html','Explore Lake Manyara'),
('images/stories/plains-game-drive.webp','Travelers in an open safari vehicle viewing wildlife','07 / YOUR KIND OF COMFORT','Make room for a little luxury.','More time in each place. Lodges and camps chosen around your dates, taste and budget. A tailored luxury quote names the accommodation and exact vehicle arrangements.','luxury-northern-safari.html','Design a luxury safari'),
('images/stories/elephant-savannah.webp','Elephants in warm golden grassland','08 / THE STORY COMES HOME','One more look before you leave.','Finish with time to enjoy the landscape, then continue to Arusha or add Zanzibar. Transfers and island flights are planned around your actual arrival and departure.','safari-zanzibar-journey.html','Add an island chapter')],
'trekking': [
('images/stories/kili-forest.webp','A muddy path through Kilimanjaro rainforest','MACHAME / DAY 1','It begins beneath the trees.','From Machame Gate, walk through montane forest to Machame Camp. The first day is about settling into your pace, meeting the crew and getting used to life on the trail.','7-day-machame-trek.html','See the full seven-day route'),
('images/stories/kili-moorland.webp','Moorland landscape on Mount Kilimanjaro','MACHAME / DAY 2','The forest gives way to sky.','Leave the trees behind and cross heath and moorland towards Shira Camp. Walk slowly, take breaks and let the changing landscape set the rhythm.','7-day-machame-trek.html','Explore the Machame itinerary'),
('images/stories/kili-moorland.webp','Kilimanjaro moorland slopes','MACHAME / DAY 3','Up to Lava Tower. Down to Barranco.','A longer acclimatization day climbs towards Lava Tower before descending to Barranco Camp. The higher walk and lower sleeping point are part of the route design.','7-day-machame-trek.html','Compare route options'),
('images/optimized/kilimanjaro-guide.webp','David with a traveler on a Kilimanjaro trail','MACHAME / DAY 4','One careful step at a time.','Cross the Barranco Wall with your guide, then continue towards Karanga Camp. A shorter camp-to-camp day leaves space to rest before the higher mountain.','7-day-machame-trek.html','Plan your mountain days'),
('images/stories/kili-high-camp.webp','Tents and the Barafu sign on the rocky mountain','MACHAME / DAY 5','High camp. Quiet preparation.','Reach Barafu, eat, rest and prepare for the summit attempt. Your guide checks the plan with you; weather, altitude and the group’s condition guide every decision.','7-day-machame-trek.html','Read the trek details'),
('images/stories/kili-summit.webp','An independent climber beside the historical Uhuru summit sign','MACHAME / DAY 6','A new morning at Uhuru.','The planned summit attempt climbs towards Stella Point and Uhuru Peak, then descends via Barafu to Mweka Camp. Reaching the summit depends on conditions and your guide’s decisions.','7-day-machame-trek.html','Ask David about the summit journey'),
('images/stories/kili-forest.webp','Kilimanjaro forest path','MACHAME / DAY 7','Back to the forest. A story to keep.','Descend to Mweka Gate, meet the transfer and return to your Moshi hotel. Allow an arrival day before the trek and a departure day afterwards: nine days in Tanzania in total.','7-day-machame-trek.html','Plan this mountain story')],
'zanzibar': [
('images/stories/stone-town-street.webp','A narrow lane between buildings in Stone Town','01 / THE STREETS','Take the turn you would have missed.','Walk the lanes with a local guide, pause by carved doors and hear the stories behind the waterfront. Stone Town is a living neighborhood as well as a place of history.','stone-town-walking-tour.html','Explore Stone Town on foot'),
('images/stories/zanzibar-spices.webp','Nutmeg fruit growing on a tree in Zanzibar','02 / THE ISLAND’S AROMAS','A story you can smell.','Make time for a guided spice-farm visit. Discover how island spices grow and ask questions along the paths. The actual farm and transfers are confirmed in your itinerary.','zanzibar-spice-farm.html','See the spice-farm journey'),
('images/optimized/stone-town.webp','The Stone Town waterfront beside calm blue water','03 / ACROSS THE WATER','A different view of Stone Town.','A boat trip to Changuu brings island heritage and time by the sea. Start from Stone Town and plan around sea conditions; your quote confirms the boat and entry arrangements.','changuu-prison-island.html','Discover Changuu'),
('images/optimized/zanzibar.webp','Turquoise waters around an island in Zanzibar','04 / THE COAST','Leave a little space for blue.','Snorkel in the waters around Mnemba from Matemwe, or add unhurried beach days. The snorkeling trip does not include landing on the private island.','mnemba-waters-snorkeling.html','Plan a snorkeling morning')],
'local': [
('images/optimized/kilimanjaro-guide.webp','David and a traveler on Kilimanjaro','01 / MEET YOUR LOCAL CONNECTION','Start with a conversation.','David’s connection is to the Moshi and Marangu area. Choose a guided walk in Moshi or Arusha, ask about everyday places, and leave space for what interests you.','moshi-arusha-city-walk.html','Plan a local walk'),
('images/optimized/local-tanzania.webp','A waterfall in lush Tanzanian forest','02 / COFFEE COUNTRY','A slower day in the foothills.','Walk towards Materuni’s waterfall and spend time learning about local coffee. Practical shoes, a guide and a relaxed pace make space for the experience.','materuni-waterfall-coffee.html','See the waterfall and coffee day'),
('images/stories/maasai-community.webp','A Maasai settlement near Mount Lolmalasin','03 / VISIT AS A GUEST','Culture begins with listening.','Request a host-led Maasai visit with arrangements agreed in advance. The hosts set the pace; ask before photographing people and support the visit through the agreed community fee.','maasai-community-day.html','Ask about a community visit')]
}

def controls(count):
    dots=''.join(f'<button type="button" data-slide-to="{i}" aria-label="Show story chapter {i+1}" aria-pressed="{str(i==0).lower()}"></button>' for i in range(count))
    return f'<div class="story-controls" hidden><button type="button" data-prev aria-label="Previous story chapter">←</button><span class="story-count" data-counter aria-hidden="true">01 / {count:02}</span><button type="button" data-next aria-label="Next story chapter">→</button><button type="button" data-pause aria-pressed="false">Pause story</button><div class="story-dots">{dots}</div></div><p class="sr-only" data-announcement aria-live="polite" aria-atomic="true"></p>'

def carousel(category):
    slides=[]
    for i,(path,alt,stage,title,text,link,label) in enumerate(STORIES[category]):
        slides.append(f'<figure data-slide class="{("is-active" if i==0 else "")}" aria-hidden="{str(i!=0).lower()}"{(" inert" if i else "")}><div class="story-picture">{img(path,alt)}</div><figcaption><span class="story-stage">{stage}</span><h3>{title}</h3><p>{text}</p><a class="text-link" href="{link}">{label} ↗</a></figcaption></figure>')
    return f'<div class="photo-story" data-carousel role="region" aria-roledescription="carousel" aria-label="{CATEGORIES[category]} photo story"><div class="story-frames">{"".join(slides)}</div>{controls(len(slides))}</div>'

def story_section(category=None):
    if category:
        intro={'trekking':('From the forest<br>to the roof of Africa.','Follow a representative seven-day Machame story. Compare the full route details before choosing your trek.'),'safari':('The wild, frame by frame.','Elephants, lions, open plains and the view from a 4×4. Choose the safari style that suits your budget.'),'zanzibar':('Streets. Spices. Sea.','Follow a few island chapters, then build the Zanzibar days you want to experience.'),'local':('The places between<br>the famous places.','Walk, listen, taste and take your time. Plan a host-led local experience with David.')}[category]
        return f'<section class="section story-section" id="photo-story"><div class="section-heading"><p class="eyebrow">WATCH YOUR NEXT CHAPTER UNFOLD</p><h2>{intro[0]}</h2><p>{intro[1]}</p></div>{carousel(category)}{photo_note(category)}</section>'
    tabs=''.join(f'<button type="button" role="tab" id="tab-{k}" aria-controls="story-{k}" aria-selected="{str(i==0).lower()}">{CATEGORIES[k]}</button>' for i,k in enumerate(STORIES))
    panels=''.join(f'<div id="story-{k}" class="story-panel" role="tabpanel" aria-labelledby="tab-{k}"><h3 class="story-label">{CATEGORIES[k]}</h3>{carousel(k)}</div>' for k in STORIES)
    return f'<section class="section story-section" id="stories"><div class="section-heading split-heading"><div><p class="eyebrow">THIS COULD BE YOUR STORY</p><h2>Four worlds.<br>One unforgettable Tanzania.</h2></div><p>Follow the safari tracks, climb from forest to Uhuru, wander Stone Town and slow down for local life. Each chapter opens a real itinerary.</p></div><div class="story-tabs" data-story-tabs role="tablist" aria-label="Choose a Tanzania photo story" hidden>{tabs}</div>{panels}{photo_note()}</section>'

def photo_note(category=None):
    extra=' The Kilimanjaro story illustrates the seven-day Machame sequence; destination photos are not a record of one customer’s trek. The Uhuru photo shows a historical summit sign.' if category in (None,'trekking') else ''
    return f'<p class="photo-note">Real destination illustrations and photographs supplied for David Explora.{extra} Safari images do not identify an owned fleet; exact vehicles and properties are confirmed in your quote. <a href="photo-credits.html">Sources &amp; photo credits</a></p>'

def collection(category):
    ids=[t['id'] for t in TOURS if t['category']==category]
    titles={'safari':'Your safari. Your level of comfort.','trekking':'Choose the route.<br>Give the mountain time.','zanzibar':'Small island days.<br>Big stories to bring home.','local':'A day well spent.<br>A little closer to Tanzania.'}
    return f'<section class="section" id="journeys-prices"><div class="section-heading"><p class="eyebrow">ITINERARIES &amp; TRANSPARENT GUIDE PRICES</p><h2>{titles[category]}</h2><p>Compare the planned inclusions and the group size behind each estimate. Your final written quote confirms your dates, services and price.</p></div><div class="package-grid">{selected_cards(ids)}</div>{EXPLAIN}</section>'

def seasons():
    return '''<div class="season-grid"><article class="season-card"><p class="eyebrow">JUNE–OCTOBER / OFTEN DRIER</p><h3>Open skies. Popular departures.</h3><p>The main dry season is a popular time for northern safaris and trekking. Book accommodation early, and allow for colder mountain nights.</p></article><article class="season-card"><p class="eyebrow">JANUARY–FEBRUARY / A SHORTER DRY WINDOW</p><h3>A different northern story.</h3><p>These months can suit trekking and a seasonal southern Serengeti plan. Wildlife movements and rainfall vary; choose a route around your dates.</p></article><article class="season-card"><p class="eyebrow">WETTER MONTHS / PLAN WITH FLEXIBILITY</p><h3>Green landscapes. A slower rhythm.</h3><p>March–May often brings longer rains; November–December can bring shorter rains. Ask about road access, sea conditions and actual lodge rates before choosing.</p></article></div>'''

def guide():
    body='''<section class="guide-heading"><div><nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Planning guide</span></nav><p class="eyebrow">FEEL READY BEFORE YOU ARRIVE</p><h1>A little knowledge.<br>A better Tanzania journey.</h1><p>Choose a region, give the route enough time and know what your quote includes. David helps turn these starting points into a plan for your actual dates.</p><div class="budget-jumps"><a href="#regions">Choose a region</a><a href="#seasons">When to travel</a><a href="#practical">Practical planning</a><a href="#booking">How booking works</a></div></div></section>
<section class="section guide-section" id="regions"><p class="eyebrow">WHERE YOUR JOURNEY BEGINS</p><h2>Build around the right starting point.</h2><div class="guide-grid"><article class="guide-card"><h3>Arusha &amp; the northern parks</h3><p>Tarangire, Lake Manyara, Ngorongoro and Serengeti fit into a northern circuit. Longer drives need their own place in the itinerary; four safari days is a practical camping starting point for Serengeti and the crater.</p><p>Most listed northern safaris start and finish in Arusha. Airport transfers and nights outside the safari are separate unless your quote includes them.</p><a href="packages.html?category=safari">Explore northern safari itineraries ↗</a></article>
<article class="guide-card"><h3>Moshi, Marangu &amp; Kilimanjaro</h3><p>Plan your mountain arrival around Moshi. The listed routes have 6, 7 or 8 mountain days; allow two additional days for arrival and departure. A day hike is a forest experience, not a summit trip.</p><p>Add coffee, waterfall walks or a local day before or after the trek if your schedule allows.</p><a href="packages.html?category=trekking">Compare the mountain routes ↗</a></article>
<article class="guide-card"><h3>Stone Town &amp; the Zanzibar coast</h3><p>Stone Town walks, spice visits and Changuu can sit alongside relaxed coast days. Matemwe is the departure area for the listed Mnemba waters trip; transfers from another coast add cost and time.</p><p>Sea conditions can change boat excursions. Build some flexibility into your island plan.</p><a href="packages.html?category=zanzibar">Explore Zanzibar experiences ↗</a></article>
<article class="guide-card"><h3>Two regions, one considered trip</h3><p>Combine a mainland safari with Zanzibar when you have enough days. Domestic flights, baggage limits and airport transfers need to be checked for your actual dates.</p><p>Request an itemized quote, so you can see the safari, island, flights and transfer costs separately.</p><a href="safari-zanzibar-journey.html">Plan a safari and island journey ↗</a></article></div></section>'''
    body+=f'<section class="section guide-section" id="seasons"><p class="eyebrow">CHOOSE YOUR SEASON</p><h2>There is more than one good time to go.</h2>{seasons()}<p class="photo-note">A general climate guide, not a forecast. Sources: <a href="https://www.tanzaniaparks.go.tz/plan-a-trip">Tanzania National Parks</a> and <a href="https://zanzibartourism.go.tz/when-to-go">Zanzibar Commission for Tourism</a>. Discuss current conditions with David.</p></section>'
    body+='''<section class="section guide-section" id="practical"><p class="eyebrow">SMALL DETAILS. A SMOOTHER JOURNEY.</p><h2>Bring your questions. We will make a plan.</h2><div class="guide-grid"><article class="guide-card"><h3>Documents &amp; entry</h3><p>Use the official immigration service to check the requirements for your nationality and travel dates before paying for flights. Zanzibar can have additional entry requirements; verify them directly for your arrival.</p><a href="https://visa.immigration.go.tz/">Tanzania Immigration eVisa ↗</a><br><a href="https://visitzanzibar.go.tz/">Official Zanzibar travel information ↗</a></article>
<article class="guide-card"><h3>Mountain preparation</h3><p>Tell David about previous trekking experience and any relevant limitations. Discuss altitude, personal equipment, guide arrangements and available safety equipment before choosing a route. Obtain suitable advice and insurance for high-altitude trekking.</p><p>Leave space around the trek for arrival, rest and onward travel.</p></article>
<article class="guide-card"><h3>Budget &amp; accommodation</h3><p>Guide prices use the adult group size shown. A couple, a solo traveler or a family needs its own quote. Public camping has basic shared facilities; comfort lodges and luxury camps are different products.</p><p>The written quote names the actual properties, room or tent sharing, taxes, fees, meals and transfers.</p></article>
<article class="guide-card"><h3>Travel as a welcome guest</h3><p>Ask before photographing people. Follow host guidance during community visits and respect everyday spaces. Tell David about food preferences, swimming ability, access needs and walking pace.</p><p>Wildlife sightings, sea activities and the summit depend on real conditions. A good itinerary gives them time.</p></article></div></section>
<section class="section" id="booking"><div class="section-heading"><p class="eyebrow">FROM FIRST HELLO TO YOUR ITINERARY</p><h2>Personal planning.<br>Clear confirmation.</h2><p>Choose a package or describe your idea. The request form prepares a message for WhatsApp; press Send there to deliver it. David then discusses your actual dates, party and preferences, sends a written quote and agrees booking arrangements with you.</p><p>The website does not take payment or make an instant reservation. Confirm the contracting party, itinerary, payment instructions and cancellation terms before committing.</p></div><a class="btn btn-primary" href="index.html#contact">Start planning with David ↗</a><p class="photo-note"><a href="terms.html">Read the full booking information</a></p></section>'''
    page('travel-guide.html','Tanzania Travel Planning Guide','Plan your Tanzania safari, Kilimanjaro trek or Zanzibar stay: regions, seasons, trip budgets, arrival days and the David Explora booking process.',body)

def credits():
    records=json.loads((ROOT/'data/photo-credits.json').read_text())
    cards=[]
    for a in records:
        cards.append(f'<article class="credit-card">{img(a["file"],a["alt"])}<h2>{esc(a["label"])}</h2><p>Photo: {esc(a["author"])} · {esc(a["license"])} · Photographed {esc(a["date"].split(" ")[0])}.</p><p>{esc(a["changes"])} The adapted image remains available under {esc(a["license"])}.</p><div class="credit-links"><a href="{esc(a["source_url"])}">Original &amp; source details ↗</a><a href="{esc(a["license_url"])}">License ↗</a><a href="{a["file"]}">WebP version</a></div></article>')
    body=f'<section class="guide-heading"><div><p class="eyebrow">REAL IMAGES. CLEAR SOURCES.</p><h1>The photographs<br>behind the stories.</h1><p>Selected safari and existing project photographs were supplied for David Explora. Additional licensed destination images below illustrate Kilimanjaro, Zanzibar and Maasai life. Independent travelers in these photographs are not presented as David’s customers.</p><p>Images do not promise an exact vehicle, lodge or community venue. The Uhuru image shows a historical 2009 summit sign; the Maasai settlement pictured is near Mount Lolmalasin. Your written itinerary confirms the actual arrangements.</p></div></section><section class="section"><div class="credit-grid">{"".join(cards)}</div></section>'
    page('photo-credits.html','Destination Photo Credits','Sources, authors and Creative Commons licenses for the Kilimanjaro, Stone Town, spice farm and Maasai photographs used by David Explora.',body)

def sitemap():
    ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns)
    tree=ET.Element('{'+ns+'}urlset')
    for p in sorted(ROOT.glob('*.html')):
        if p.name=='404.html': continue
        url=ET.SubElement(tree,'{'+ns+'}url');ET.SubElement(url,'{'+ns+'}loc').text=ORIGIN+('/' if p.name=='index.html' else '/'+p.name)
    ET.indent(tree,space='  ')
    ET.ElementTree(tree).write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)

def build():
    # Keep visible price cards on the original pages consistent with the catalogue.
    by_id={tour['id']:tour for tour in TOURS}
    for path in ROOT.glob('*.html'):
        text=path.read_text()
        if path.name=='index.html':
            text=re.sub(r'<section class="section story-section" id="stories">.*?</section>',lambda _:story_section(),text,flags=re.S)
        category={'safari.html':'safari','kilimanjaro.html':'trekking','zanzibar.html':'zanzibar','local-tanzania.html':'local'}.get(path.name)
        if category:
            text=re.sub(r'<section class="section story-section" id="photo-story">.*?</section>',lambda _:story_section(category),text,flags=re.S)
        text=re.sub(r'<article class="package-card" data-tour-id="([^"]+)">.*?</article>',lambda match:card(by_id[match[1]]) if match[1] in by_id else match[0],text,flags=re.S)
        for category in STORIES:
            pattern=f'<!-- BEGIN: collection-{category} -->.*?<!-- END: collection-{category} -->'
            text=re.sub(pattern,lambda _,c=category:f'<!-- BEGIN: collection-{c} -->'+collection(c)+f'<!-- END: collection-{c} -->',text,flags=re.S)
        path.write_text(text)
    (ROOT/'tour-data.js').write_text('/* Generated from data/tours.json by scripts/build_tours.py. */\n(function(root,data){if(typeof module===\'object\'&&module.exports)module.exports=data;else root.DavidTourData=data;})(typeof globalThis!==\'undefined\'?globalThis:this,\n'+json.dumps(TOURS,ensure_ascii=False,indent=2)+');\n')
    catalogue()
    for tour in TOURS: tour_page(tour)
    guide();credits();sitemap()
    print(f'Built {len(TOURS)} tour pages, catalogue, guide, credits, tour-data.js and sitemap.')

if __name__=='__main__': build()
