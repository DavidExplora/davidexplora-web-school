"""Build the bounded three-route comparison from actual itinerary and photo data."""
import json,re
import build_tours as site

ROOT=site.ROOT
ROUTES=json.loads((ROOT/'data/kilimanjaro-routes.json').read_text(encoding='utf-8'))
TOURS={tour['id']:tour for tour in site.TOURS}

def gallery(route):
    frames=[]
    for n,photo in enumerate(route['photos']):
        frames.append(f'<figure data-slide class="{("is-active" if n==0 else "")}" aria-hidden="{str(n!=0).lower()}"{(" inert" if n else "")}>{site.img(photo["image"],photo["alt"],sizes="(max-width: 650px) 90vw, (max-width: 1050px) 45vw, 30vw")}<figcaption class="sr-only">{site.esc(photo["caption"])}</figcaption></figure>')
    return f'<div class="mountain-route-gallery" data-carousel role="region" aria-roledescription="carousel" aria-label="{site.esc(route["title"])} photographs"><div class="mountain-route-frames">{"".join(frames)}</div><p class="mountain-route-caption" data-visible-caption>{site.esc(route["photos"][0]["caption"])}</p>{site.controls(len(frames))}</div>'

def section():
    cards=[]
    for route in ROUTES:
        tour=TOURS[route['tourId']]
        facts=[('Mountain time',f'{tour["days"]} days'),('Total trip',f'{tour["tripDays"]} days with arrival & departure'),('Sleeping',route['sleeping']),('Trail entry',route['entry'])]
        details='<dl class="mountain-route-facts">'+''.join(f'<div><dt>{site.esc(label)}</dt><dd>{site.esc(value)}</dd></div>' for label,value in facts)+'</dl>'
        cards.append(f'<article class="mountain-route-card" id="route-{route["id"]}">{gallery(route)}<div class="mountain-route-copy"><p class="eyebrow">{site.esc(route["theme"])}</p><h3>{site.esc(route["title"])}</h3><p>{site.esc(route["summary"])}</p>{details}<p class="mountain-route-exit"><strong>Descent:</strong> {site.esc(route["exit"])}</p><div class="mountain-route-actions"><a class="btn btn-primary" href="{route["tourId"]}.html">View the full itinerary ↗</a><a class="text-link" href="index.html?package={route["tourId"]}#contact">Plan this route with David ↗</a></div></div></article>')
    return '<section id="routes" class="section mountain-route-section"><div class="section-heading centered"><p class="eyebrow">CHOOSE YOUR MOUNTAIN JOURNEY</p><h2>Three ways to experience Kilimanjaro.</h2><p>Explore the landscapes, compare time on the mountain and choose between camping and huts. Arrival and departure days are shown separately so you can plan your whole trip.</p></div><div class="mountain-route-grid">'+''.join(cards)+'</div><p class="photo-note">Real destination and supplied guiding photographs; camps and equipment are confirmed in your itinerary. <a href="photo-credits.html">Photo credits &amp; licences</a>. Prefer a day in the forest? <a href="kilimanjaro-marangu-day-hike.html">Explore the Marangu rainforest day hike</a>.</p></section>'

def build():
    path=ROOT/'kilimanjaro.html';text=path.read_text(encoding='utf-8')
    text,count=re.subn(r'<section\s+id="routes"\s+class="section [^"]+"\s*>.*?</section>',lambda _:section(),text,flags=re.S)
    if count!=1:raise ValueError('Expected one Kilimanjaro route section')
    path.write_text(text,encoding='utf-8')
    print('Built Machame, Lemosho and Marangu route galleries and itinerary facts')

if __name__=='__main__':build()
