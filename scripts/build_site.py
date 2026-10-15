"""Build all public pages in a fixed order from the editable home and tour data."""
from pathlib import Path
import subprocess
import sys
import re
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]

def build():
    from site_features import update_home_source
    update_home_source(ROOT / 'templates/home.html')
    (ROOT / 'index.html').write_text((ROOT / 'templates/home.html').read_text(encoding='utf-8'), encoding='utf-8')
    for script in ('build_tours.py', 'build_daytrips.py', 'build_zanzibar.py', 'build_safaris.py', 'build_kilimanjaro.py', 'build_editorial.py', 'build_discovery.py', 'build_guest_services.py'):
        subprocess.run([sys.executable, str(ROOT / 'scripts' / script)], cwd=ROOT, check=True)
    # Hosting redirects /page.html to /page. Keep one known page identity for both.
    public_pages = {path.name: ('/' if path.name == 'index.html' else '/' + path.stem) for path in ROOT.glob('*.html')}
    page_paths = sorted(set(public_pages.values()))
    origin = re.search(r'<link rel="canonical" href="([^"]+)', (ROOT / 'index.html').read_text(encoding='utf-8'))[1].rstrip('/')
    absolute_page = re.compile(re.escape(origin) + r'/([a-z0-9_-]+\.html)(?=[?#\s\"\x27<]|$)')
    def clean_public_url(match):
        return origin + public_pages[match[1]] if match[1] in public_pages else match[0]
    route_table = 'const pagePaths = new Set(' + json.dumps(page_paths, separators=(',', ':')) + '); // Generated from public HTML pages.'
    for filename in ('analytics.js', 'lead-source.js'):
        path = ROOT / filename
        text, count = re.subn(r'const pagePaths = new Set\(\[[^\n]*\]\); // Generated from public HTML pages\.', lambda _: route_table, path.read_text(encoding='utf-8'), count=1)
        if count != 1:
            raise RuntimeError(f'{filename}: missing public-page table')
        path.write_text(text, encoding='utf-8')
    # Capture a promotion's entry page before navigating to the shared enquiry form.
    tag = '<script src="lead-source.js" defer></script>'
    analytics = '<link rel="stylesheet" href="analytics.css"><script src="analytics.js" defer></script>'
    for path in ROOT.glob('*.html'):
        text = absolute_page.sub(clean_public_url, path.read_text(encoding='utf-8')).replace(tag, '').replace(analytics, '')
        text = text.replace('</head>', analytics + '</head>')
        if re.search(r'<script\b[^>]*\bsrc=', text):
            text = re.sub(r'(?=<script\b[^>]*\bsrc=)', lambda _: tag, text, count=1)
        else:
            text = text.replace('</body>', tag + '</body>')
        path.write_text(text, encoding='utf-8')
    # Match canonical, social and structured URLs to the final address served by hosting.
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    for loc in sitemap.findall('.//{*}loc'):
        loc.text = absolute_page.sub(clean_public_url, loc.text)
    ET.indent(sitemap, space='  ')
    sitemap.write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)

if __name__ == '__main__':
    build()
