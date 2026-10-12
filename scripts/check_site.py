"""Check the published static site contract using Python's standard library."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, sys, json, xml.etree.ElementTree as ET
from build_tours import image_size

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
errors = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.stack, self.ids, self.links, self.headings, self.tags = path, [], set(), [], [], []
        self.carousels, self.current_carousel, self.structured, self.json_buffer = [], None, [], None
    def handle_starttag(self, tag, attrs):
        data=dict(attrs);self.tags.append((tag,data))
        if tag not in VOID:self.stack.append(tag)
        if 'data-carousel' in data:
            self.current_carousel={'depth':len(self.stack),'attributes':data,'slides':[],'buttons':[]}
            self.carousels.append(self.current_carousel)
        if self.current_carousel:
            if 'data-slide' in data:self.current_carousel['slides'].append(data)
            if tag=='button':self.current_carousel['buttons'].append(data)
        if tag=='script' and data.get('type')=='application/ld+json':self.json_buffer=''
        if 'id' in data:
            if data['id'] in self.ids:errors.append(f'{self.path.name}: duplicate id {data["id"]}')
            self.ids.add(data['id'])
        if tag=='h1':self.headings.append(tag)
        for attr in ('href','src'):
            if data.get(attr):self.links.append(data[attr])
        if data.get('srcset'):
            self.links.extend(part.strip().split()[0] for part in data['srcset'].split(','))
        if tag=='img':
            if not data.get('alt'):errors.append(f'{self.path.name}: image needs useful alt text')
            if not data.get('width') or not data.get('height'):errors.append(f'{self.path.name}: image dimensions missing')
            source=ROOT/data.get('src','')
            if source.is_file() and source.suffix=='.webp':
                actual=image_size(source.relative_to(ROOT))
                if (str(actual[0]),str(actual[1]))!=(data.get('width'),data.get('height')):
                    errors.append(f'{self.path.name}: incorrect image dimensions for {source.name}')
        if data.get('target')=='_blank' and 'noopener' not in data.get('rel',''):
            errors.append(f'{self.path.name}: external tab needs noopener')
    def handle_endtag(self, tag):
        if tag=='script' and self.json_buffer is not None:
            try:self.structured.append(json.loads(self.json_buffer))
            except json.JSONDecodeError:errors.append(f'{self.path.name}: invalid structured data')
            self.json_buffer=None
        if self.current_carousel and self.current_carousel['depth']==len(self.stack):self.current_carousel=None
        if not self.stack or self.stack[-1]!=tag:errors.append(f'{self.path.name}:{self.getpos()[0]}: unbalanced closing {tag}')
        else:self.stack.pop()
    def handle_data(self, data):
        if self.json_buffer is not None:self.json_buffer+=data

pages={}
for path in sorted(ROOT.glob('*.html')):
    page=Page(path);page.feed(path.read_text());page.close();pages[path.name]=page
    if page.stack:errors.append(f'{path.name}: unclosed elements {page.stack}')
    if len(page.headings)!=1:errors.append(f'{path.name}: expected one main heading')
    if 'main' not in page.ids:errors.append(f'{path.name}: skip-link destination missing')
    if sum(t=='footer' for t,a in page.tags)!=1:errors.append(f'{path.name}: expected one shared footer')
    if not any(t=='link' and a.get('rel')=='canonical' for t,a in page.tags):errors.append(f'{path.name}: canonical missing')
    if not any(t=='meta' and a.get('name')=='description' and a.get('content') for t,a in page.tags):errors.append(f'{path.name}: description missing')
    for field in [a for t,a in page.tags if t in ('input','select','textarea')]:
        if not any(t=='label' and a.get('for')==field.get('id') for t,a in page.tags):errors.append(f'{path.name}: unlabeled form field {field.get("id")}')
    for carousel in page.carousels:
        a=carousel['attributes'];slides=carousel['slides'];buttons=carousel['buttons']
        if a.get('role')!='region' or not a.get('aria-label'):errors.append(f'{path.name}: photo story needs a named region')
        if len(slides)<2:errors.append(f'{path.name}: slideshow needs multiple images')
        if sum('is-active' in s.get('class','').split() for s in slides)!=1:errors.append(f'{path.name}: photo story must start on one slide')
        for n,slide in enumerate(slides):
            if slide.get('aria-hidden')!=str(n!=0).lower() or (n>0 and 'inert' not in slide):errors.append(f'{path.name}: inactive story is not hidden from keyboard and assistive technology')
        for key in ('data-prev','data-next','data-pause'):
            if sum(key in b for b in buttons)!=1:errors.append(f'{path.name}: story control missing or duplicated: {key}')
        if sum('data-slide-to' in b for b in buttons)!=len(slides):errors.append(f'{path.name}: story chapter buttons do not match the slides')

link_count=0
for name,page in pages.items():
    for link in page.links:
        url=urlsplit(link)
        if url.scheme or url.netloc:continue
        target=unquote(url.path) or name
        path=ROOT/target
        link_count+=1
        if not path.is_file():errors.append(f'{name}: missing local path {target}')
        elif url.fragment and path.suffix=='.html' and url.fragment not in pages.get(path.name,page).ids:errors.append(f'{name}: missing anchor {target}#{url.fragment}')

for css in ROOT.glob('*.css'):
    source=css.read_text()
    without_comments=re.sub(r'/\*.*?\*/','',source,flags=re.S)
    if without_comments.count('{')!=without_comments.count('}'):errors.append(f'{css.name}: unbalanced rule braces')
    for path in re.findall(r'url\([\'\"]?([^\)\'\"]+)[\'\"]?\)',source):
        if not urlsplit(path).scheme and not (ROOT/path).is_file():errors.append(f'{css.name}: missing background {path}')

home=pages['index.html']
duration_values={a.get('value') for t,a in home.tags if t=='option'}
for expected in ('3–4 days','5–7 days','8–10 days','11+ days','1–2 days','Flexible'):
    if expected not in duration_values:errors.append(f'Form duration missing: {expected}')
if not any(t=='input' and a.get('id')=='privacy-consent' and 'required' in a for t,a in home.tags):errors.append('Inquiry must require consent')
if not any(t=='button' and a.get('type')=='submit' and 'disabled' in a for t,a in home.tags):errors.append('Inquiry needs disabled no-JavaScript fallback')
if 'inquiry-ready' not in home.ids or 'inquiry-whatsapp' not in home.ids:errors.append('WhatsApp review/handoff is missing')

sitemap=ET.parse(ROOT/'sitemap.xml')
listed={urlsplit(loc.text).path for loc in sitemap.findall('.//{*}loc')}
expected={'/'+('' if name=='index.html' else name) for name in pages if name!='404.html'}
if listed!=expected:errors.append('Sitemap must contain every public content page once, excluding 404')
if len(sitemap.findall('.//{*}loc'))!=len(listed):errors.append('Sitemap contains duplicate URLs')

tours=json.loads((ROOT/'data/tours.json').read_text())
ids={t['id'] for t in tours}
form_ids={a.get('value') for t,a in home.tags if t=='option'}
if not ids<=form_ids:errors.append('Inquiry is missing a catalogue package')
if 'trip-budget' not in home.ids:errors.append('Inquiry needs the optional per-adult budget')
for tour in tours:
    page=pages.get(tour['id']+'.html')
    if not page or not any(item.get('@type')=='TouristTrip' for item in page.structured):errors.append(f'{tour["id"]}: crawlable itinerary or structured trip data missing')
    if tour['price'] is not None and (tour['price']<=0 or not tour['basis']):errors.append(f'{tour["id"]}: guide price needs a positive estimate and a group basis')
    if not (ROOT/tour['image']).is_file():errors.append(f'{tour["id"]}: missing tour image')
credit_source=(ROOT/'photo-credits.html').read_text()
for credit in json.loads((ROOT/'data/photo-credits.json').read_text()):
    if credit['source_url'] not in credit_source or credit['license_url'] not in credit_source:errors.append(f'{credit["file"]}: public source/license credit missing')

if errors:
    print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(pages)} complete pages; {link_count} local links/assets; {len(tours)} tour itineraries; photo controls, credits, labels, structured data, inquiry and sitemap.')
