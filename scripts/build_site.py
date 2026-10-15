"""Build all public pages in a fixed order from the editable home and tour data."""
from pathlib import Path
import subprocess
import sys
import re

ROOT = Path(__file__).resolve().parents[1]

def build():
    from site_features import update_home_source
    update_home_source(ROOT / 'templates/home.html')
    (ROOT / 'index.html').write_text((ROOT / 'templates/home.html').read_text(encoding='utf-8'), encoding='utf-8')
    for script in ('build_tours.py', 'build_daytrips.py', 'build_zanzibar.py', 'build_safaris.py', 'build_kilimanjaro.py', 'build_editorial.py', 'build_discovery.py', 'build_guest_services.py'):
        subprocess.run([sys.executable, str(ROOT / 'scripts' / script)], cwd=ROOT, check=True)
    # Capture a promotion's entry page before navigating to the shared enquiry form.
    tag = '<script src="lead-source.js" defer></script>'
    analytics = '<link rel="stylesheet" href="analytics.css"><script src="analytics.js" defer></script>'
    for path in ROOT.glob('*.html'):
        text = path.read_text(encoding='utf-8').replace(tag, '').replace(analytics, '')
        text = text.replace('</head>', analytics + '</head>')
        if re.search(r'<script\b[^>]*\bsrc=', text):
            text = re.sub(r'(?=<script\b[^>]*\bsrc=)', lambda _: tag, text, count=1)
        else:
            text = text.replace('</body>', tag + '</body>')
        path.write_text(text, encoding='utf-8')

if __name__ == '__main__':
    build()
