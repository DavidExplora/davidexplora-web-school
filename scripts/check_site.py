"""Check the published static site contract using Python's standard library."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, sys, json, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
errors = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.stack, self.ids, self.links, self.headings, self.tags = path, [], set(), [], [], []
    def handle_starttag(self, tag, attrs):
        data=dict(attrs);self.tags.append((tag,data))
        if tag not in VOID:self.stack.append(tag)
        if 'id' in data:
            if data['id'] in self.ids:errors.append(f'{self.path.name}: duplicate id {data["id"]}')
            self.ids.add(data['id'])
        if tag=='h1':self.headings.append(tag)
        for attr in ('href','src'):
            if data.get(attr):self.links.append(data[attr])
        if tag=='img':
            if not data.get('alt'):errors.append(f'{self.path.name}: image needs useful alt text')
            if not data.get('width') or not data.get('height'):errors.append(f'{self.path.name}: image dimensions missing')
        if data.get('target')=='_blank' and 'noopener' not in data.get('rel',''):
            errors.append(f'{self.path.name}: external tab needs noopener')
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1]!=tag:errors.append(f'{self.path.name}:{self.getpos()[0]}: unbalanced closing {tag}')
        else:self.stack.pop()

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

if errors:
    print('\n'.join(errors));sys.exit(1)
print(f'PASS: {len(pages)} complete pages; {link_count} local links/assets; balanced HTML; labels, metadata, form handoff and sitemap.')
