"""Build a clean, deployable folder without Git files, tests or launch documents."""
from pathlib import Path
import shutil, sys

root = Path(__file__).resolve().parents[1]
output = Path(sys.argv[1] if len(sys.argv)>1 else 'dist').resolve()
if output == root or output.name not in {'dist','public-site'}:
    raise SystemExit('Choose a generated directory named dist or public-site.')
output.mkdir(parents=True,exist_ok=True)
files = [*root.glob('*.html'), *root.glob('*.css'), *root.glob('*.js'), root/'favicon.svg', root/'robots.txt',root/'sitemap.xml']
for file in files:shutil.copy2(file,output/file.name)
for name in ['images','zanzibar']:
    shutil.copytree(root/name,output/name,dirs_exist_ok=True)
# Delete stale one-page implementation files when updating the existing hosted site.
allowed={file.name for file in files}|{'images','zanzibar'}
for entry in output.iterdir():
    if entry.name not in allowed:
        if entry.is_dir():shutil.rmtree(entry)
        else:entry.unlink()
print(f'Packaged {len(files)} web files and project images into {output}')
