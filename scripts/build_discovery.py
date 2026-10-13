"""Build the destination map and booking guide; reuses the established site design."""
from pathlib import Path
import json, re, sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_tours as site
R = site.ROOT
areas = [
 ('serengeti','Serengeti',34.83,-2.33,'Wide plains & wildlife','Allow several days for the Serengeti and the drives that connect it to the northern circuit. Migration locations change with conditions; ask about your travel dates.','images/optimized/serengeti.webp','safari.html','serengeti'),
 ('ngorongoro','Ngorongoro',35.50,-3.236,'A crater chapter','Combine a crater visit with a northern safari. Confirm entry arrangements, accommodation and the full driving itinerary in your quote.','images/optimized/ngorongoro.webp','safari.html','ngorongoro'),
 ('manyara','Lake Manyara',35.82,-3.637,'Lake country & forest','A compact northern park to discuss alongside Tarangire or Ngorongoro. Conditions and wildlife sightings vary throughout the year.','images/optimized/manyara.webp','safari.html','manyara'),
 ('tarangire','Tarangire',36.0,-3.83,'Baobabs & elephant country','Choose a focused day safari or make Tarangire the opening chapter of a longer northern circuit. Your pickup point affects time on the road.','images/optimized/tarangire.webp','tarangire-day-safari.html','tarangire'),
 ('arusha','Arusha',36.683,-3.386,'A northern safari starting point','Discuss arrival transfers and a night before your safari. Airport, pickup location and accommodation should be agreed before you travel.','images/stories/zebras-safari-vehicle.webp','packages.html?category=safari','safari'),
 ('moshi','Moshi & Marangu',37.34,-3.34,'Coffee, waterfalls & foothills','Meet the everyday side of Tanzania. Add a coffee visit, village walk or waterfall experience around Moshi and Marangu to your mountain journey.','images/stories/coffee-roasting.webp','local-tanzania.html','local'),
 ('kilimanjaro','Kilimanjaro',37.355,-3.067,'From forest to Uhuru','Compare the 6-day Marangu, 7-day Machame and 8-day Lemosho examples. Add arrival and departure days; choose your route with time to acclimatize.','images/stories/uhuru-summit-david.webp','kilimanjaro.html','kilimanjaro'),
 ('zanzibar','Zanzibar',39.32,-6.13,'Stone Town & turquoise water','Pair a guided Stone Town walk with coast time or a boat excursion. Mainland-to-island flights, transfers and marine fees need a separate place in your quote.','images/stories/zanzibar-blue-water.webp','zanzibar.html','zanzibar')]

def point(lon, lat): return ((lon-29)*54+24, (-lat-0.8)*54+24)
outline=json.loads((R/'data/tanzania-outline.geojson').read_text(encoding='utf-8'))
path=' '.join('M'+' L'.join(f'{point(lon,lat)[0]:.1f},{point(lon,lat)[1]:.1f}' for lon,lat in ring)+' Z' for ring in outline['geometry']['coordinates'])
pins=''.join(f'<a href="{a[7]}" data-map-select="{a[0]}" aria-label="Explore {site.esc(a[1])}"><circle cx="{point(a[2],a[3])[0]:.1f}" cy="{point(a[2],a[3])[1]:.1f}" r="7" data-map-dot="{a[0]}"/><text x="{point(a[2],a[3])[0]+10:.1f}" y="{point(a[2],a[3])[1]+4:.1f}">{i+1}</text></a>' for i,a in enumerate(areas))
svg=f'<svg viewBox="0 0 650 650" role="group" aria-label="Tanzania planning map with eight destinations; the numbered buttons also select each destination"><path d="{path}"/><g>{pins}</g><text x="475" y="425" class="ocean-label">INDIAN OCEAN</text></svg>'
buttons=''.join(f'<button type="button" data-destination="{a[0]}" aria-pressed="{str(i==0).lower()}"><span>{i+1:02}</span> {site.esc(a[1])}</button>' for i,a in enumerate(areas))
first=areas[0]
mapblock=f'''<div class="discovery-grid" data-discovery><div class="destination-map">{svg}<p class="map-note">Approximate destination locations, not driving routes or administrative boundaries. Mainland outline: <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener noreferrer">Natural Earth ↗</a>. Zanzibar is marked offshore.</p></div><div><div class="destination-buttons" aria-label="Choose a destination">{buttons}</div><article class="destination-detail" aria-live="polite" aria-atomic="true">{site.img(first[6],'Wildlife landscape in the Serengeti')}<div><p class="eyebrow" data-area-tag>{first[4]}</p><h3 data-area-name>{first[1]}</h3><p data-area-description>{first[5]}</p><div class="destination-actions"><a class="btn btn-primary" data-area-tours href="{first[7]}">Explore journeys ↗</a><a data-area-plan href="index.html?trip={first[8]}#contact">Plan this chapter</a><a data-area-map href="https://www.google.com/maps/search/?api=1&amp;query={first[3]},{first[2]}" target="_blank" rel="noopener noreferrer">See location on Google Maps ↗</a></div></div></article></div></div>'''
home=R/'index.html'; text=home.read_text(encoding='utf-8')
section='<section class="section" id="discover-tanzania"><div class="section-heading split-heading"><div><p class="eyebrow">WHERE WOULD YOU LIKE TO GO?</p><h2>Put your itinerary<br>on the map.</h2></div><p>Explore the northern parks, Kilimanjaro foothills and Zanzibar. Select a destination for travel notes and tour options. <a href="explore-tanzania.html">Open the destination guide ↗</a></p></div>'+mapblock+'</section>'
if 'id="discover-tanzania"' in text: text=re.sub(r'<section class="section" id="discover-tanzania">.*?</section>',lambda _:section,text,flags=re.S)
else: text=text.replace('<section id="experiences"',section+'\n<section id="experiences"')
home.write_text(text, encoding='utf-8')
alts=['Wildlife landscape in the Serengeti','A view into the Ngorongoro Crater','Zebras beside Lake Manyara with birds in the background','Elephants in the Tarangire landscape','Safari vehicle beside zebras on a green track','Coffee beans roasting over a wood fire','David and a trekker at the Uhuru Peak summit sign','Boats in turquoise Zanzibar water']
data=[]
for a,alt in zip(areas,alts):
    item=dict(id=a[0],name=a[1],longitude=a[2],latitude=a[3],tag=a[4],description=a[5],image=a[6],alt=alt,tours=a[7],trip=a[8],width=site.image_size(a[6])[0],height=site.image_size(a[6])[1])
    small=Path(a[6]).with_stem(Path(a[6]).stem+'-small')
    if (R/small).is_file():item['srcset']=f'{small.as_posix()} {site.image_size(small)[0]}w, {a[6]} {item["width"]}w'
    data.append(item)
(R/'destination-data.js').write_text('/* Generated by scripts/build_discovery.py. */\n(function(r,d){if(typeof module==="object"&&module.exports)module.exports=d;else r.DavidDestinations=d;})(globalThis,'+json.dumps(data,ensure_ascii=False)+');\n', encoding='utf-8')

def page(name,title,description,body):
    content='<section class="guide-heading"><p class="eyebrow">DAVID EXPLORA · TANZANIA</p><h1>'+title+'</h1><p class="discovery-intro">'+description+'</p></section><section class="section">'+body+'</section>'
    site.page(name,title,description,content)
page('explore-tanzania.html','Explore Tanzania’s destinations.','Plan your route through the northern parks, Kilimanjaro foothills and Zanzibar. Select a destination for local travel notes and tour options.',mapblock+'<div class="booking-callout"><h2>Make the route fit your time.</h2><p>Allow time for the activities and the travel between them. Ask David about transfers, departure points and a practical order for your destinations.</p><a href="index.html#contact" class="text-link">Request your itinerary ↗</a></div>')
page('how-to-book.html','How to book with David Explora.','Send your trip details, review a personal itinerary and quote, then agree the arrangements in writing.', '''<div class="booking-guide-steps"><article><p class="eyebrow">01 / YOUR TRIP DETAILS</p><h2>Send your request.</h2><p>Share your dates, group size, budget and preferred activities. The form prepares a WhatsApp or email draft; press Send in that app to deliver it.</p><a href="index.html#contact">Prepare my request ↗</a></article><article><p class="eyebrow">02 / ITINERARY &amp; PRICE</p><h2>Review your written quote.</h2><p>Check accommodation, transfers, activities, meals, fees and the total. The quote explains what is included, what is paid separately and the applicable cancellation terms.</p></article><article><p class="eyebrow">03 / PAYMENT ARRANGEMENTS</p><h2>Agree before you pay.</h2><p>Confirm the contracting party, payment recipient, currency, deposit and balance deadline. This website does not currently offer online checkout or reserve a place automatically.</p></article><article><p class="eyebrow">04 / BEFORE DEPARTURE</p><h2>Keep your confirmation.</h2><p>Keep your receipt and written booking confirmation. Confirm the pickup point, contact details, packing guidance and any outstanding balance.</p></article></div><div class="booking-callout"><h2>Booking questions</h2><details><summary>Is the displayed price final?</summary><p>No. Prices are estimates based on the stated adult group size. Your written quote confirms the total for your dates, group and services.</p></details><details><summary>Can I combine a safari, trek and Zanzibar?</summary><p>Yes. Ask for a combined itinerary with time for preparation, recovery and transfers.</p></details><details><summary>How do I know my enquiry arrived?</summary><p>Send the prepared draft in WhatsApp or your email app, then wait for David’s reply. The website cannot confirm message delivery.</p></details><p><a href="terms.html">Booking terms</a> · <a href="privacy.html">Privacy information</a></p></div><section data-business-presence hidden><h2>Traveler feedback &amp; public listings</h2><div data-business-links class="destination-actions"></div></section>''')
for p in R.glob('*.html'):
    t=p.read_text(encoding='utf-8')
    t=re.sub(r'<header class="site-header">.*?</header>',lambda _:site.HEADER,t,flags=re.S)
    t=re.sub(r'<footer class="site-footer">.*?</footer>',lambda _:site.FOOTER,t,flags=re.S)
    if 'discovery.css' not in t: t=t.replace('</head>','<link rel="stylesheet" href="discovery.css"></head>')
    if 'discovery.js' not in t: t=t.replace('</body>','<script src="destination-data.js" defer></script><script src="business-links.js" defer></script><script src="discovery.js" defer></script></body>')
    if 'operator.css' not in t:t=t.replace('</head>','<link rel="stylesheet" href="operator.css"></head>')
    if 'ui.js' not in t:t=t.replace('</body>','<script src="ui.js" defer></script></body>')
    if 'features.js' not in t:t=t.replace('</body>','<script src="features.js" defer></script></body>')
    t=t.replace('<a href="travel-guide.html">Travel guide</a>','<a href="explore-tanzania.html">Explore Tanzania</a>')
    if 'Tanzania planning guide</a><a href="explore-tanzania.html"' not in t:
        t=t.replace('<a href="travel-guide.html">Tanzania planning guide</a>','<a href="travel-guide.html">Tanzania planning guide</a><a href="explore-tanzania.html">Destination map</a><a href="how-to-book.html">How to book</a>')
    p.write_text(t, encoding='utf-8')
site.sitemap()
print('Built destination discovery and booking guide; linked all pages.')
