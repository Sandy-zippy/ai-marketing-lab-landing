#!/usr/bin/env bash
# Make the web copy of the VSL + its poster. Run ON THE MAC MINI (never the Air: 8 GB).
#   ./prepare.sh [master.mp4] [out_dir]
# Out: aiml-vsl.mp4 (H.264 720p, faststart, ~1.1 Mbps video, AAC 96k) and poster.jpg (frame at 0:03).
# Fails if the mp4 is 95 MB or more: GitHub refuses files over 100 MB and Pages deploys from the repo.
# Then from the Air:
#   scp sandys-mac-mini.local:<out_dir>/aiml-vsl.mp4 call/vsl/aiml-vsl.mp4
#   scp sandys-mac-mini.local:<out_dir>/poster.jpg   call/poster.jpg
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

IN="${1:-$HOME/proj/work/aiml-vsl/vsl/out/v3/aiml-vsl-v3-1080p.mp4}"
OUT="${2:-$(dirname "$IN")/web}"
MAX=$((95 * 1000 * 1000))

[ -s "$IN" ] || { echo "no master at $IN"; exit 1; }
mkdir -p "$OUT"

ffmpeg -hide_banner -loglevel error -y -i "$IN" \
  -vf "scale=-2:720" -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -b:v 1100k -maxrate 1600k -bufsize 2200k \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart "$OUT/aiml-vsl.mp4"

ffmpeg -hide_banner -loglevel error -y -ss 3 -i "$IN" -frames:v 1 -vf "scale=1280:-2" -q:v 3 "$OUT/poster.jpg"

size=$(stat -f%z "$OUT/aiml-vsl.mp4" 2>/dev/null || stat -c%s "$OUT/aiml-vsl.mp4")
ffprobe -v error -show_entries format=duration,bit_rate:stream=codec_name,width,height -of compact "$OUT/aiml-vsl.mp4"
echo "size: $size bytes"
[ "$size" -lt "$MAX" ] || { echo "FAIL: $size bytes is not under 95 MB, lower -b:v"; exit 1; }
echo "OK: $OUT/aiml-vsl.mp4 + $OUT/poster.jpg"
