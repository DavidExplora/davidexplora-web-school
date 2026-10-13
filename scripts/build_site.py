"""Build all public pages in a fixed order from the editable home and tour data."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]

def build():
    from site_features import update_home_source
    update_home_source(ROOT / 'templates/home.html')
    (ROOT / 'index.html').write_text((ROOT / 'templates/home.html').read_text(encoding='utf-8'), encoding='utf-8')
    for script in ('build_tours.py', 'build_daytrips.py', 'build_zanzibar.py', 'build_safaris.py', 'build_editorial.py', 'build_discovery.py'):
        subprocess.run([sys.executable, str(ROOT / 'scripts' / script)], cwd=ROOT, check=True)

if __name__ == '__main__':
    build()
