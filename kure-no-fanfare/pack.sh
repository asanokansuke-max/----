#!/bin/sh
# Cloudflare用: viewport付きの完全なHTMLにして、zipの直下に index.html を置く
cd "$(dirname "$0")"
mkdir -p dist/kure-no-fanfare
{ printf '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0f3d24"></head><body>\n'; cat index.html; printf '\n</body></html>\n'; } > dist/kure-no-fanfare/index.html
rm -f dist/kure-no-fanfare.zip
python3 -c "import zipfile;z=zipfile.ZipFile('dist/kure-no-fanfare.zip','w',zipfile.ZIP_DEFLATED);z.write('dist/kure-no-fanfare/index.html','index.html');z.close()"
