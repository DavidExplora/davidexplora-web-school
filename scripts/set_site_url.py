"""Set the verified live origin consistently across search and social metadata."""
from pathlib import Path
from urllib.parse import urlsplit
import re, sys, xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
if len(sys.argv)!=2:raise SystemExit('Usage: python scripts/set_site_url.py https://your-domain.com')
origin=sys.argv[1].rstrip('/')
url=urlsplit(origin)
if url.scheme!='https' or not url.netloc or url.path or url.query or url.fragment or url.username:raise SystemExit('Use an HTTPS origin with no path, credentials, query or fragment.')
sample=(root/'index.html').read_text()
old=re.search(r'<link rel="canonical" href="(https://[^/]+)',sample)[1]
for path in [*root.glob('*.html'),root/'templates/home.html',root/'robots.txt',root/'sitemap.xml']:
    path.write_text(path.read_text().replace(old,origin))
print(f'Updated the live origin from {old} to {origin}. Run the checks, commit and redeploy.')
