#!/bin/sh
# Regenerates the PNG icons from assets/icon-square.svg using only macOS tools (Quick Look + sips).
# The PNGs are committed, so Vercel and CI never need this script; run it only after editing the SVGs.
set -e
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
qlmanage -t -s 512 -o "$tmp" assets/icon-square.svg >/dev/null 2>&1
cp "$tmp/icon-square.svg.png" assets/icon-512.png
for size in 192 180 32; do
  name="icon-$size.png"; [ "$size" = 180 ] && name="apple-touch-icon.png"; [ "$size" = 32 ] && name="favicon-32.png"
  sips -z "$size" "$size" assets/icon-512.png --out "assets/$name" >/dev/null
done
rm -rf "$tmp"
ls -l assets/*.png
