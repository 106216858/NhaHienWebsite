#!/usr/bin/env python3
"""Sort the img/ folder into subfolders and update every path in the site.

Run from the project folder (the one containing img/, index.html, styles.css):
    python reorganize_img.py --dry-run     (preview only)
    python reorganize_img.py               (do it)
"""
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
IMG = ROOT / "img"
DRY = "--dry-run" in sys.argv

# exact file name -> subfolder
MAP = {
    # brand
    "logo.png": "brand",
    "favicon-32.png": "brand",
    "favicon-512.png": "brand",
    "apple-touch-icon.png": "brand",
    # social icons
    "fb_logo.png": "social",
    "ins_logo.png": "social",
    "tiktok_logo.png": "social",
    "x_logo.png": "social",
    # page / section backgrounds
    "banner.jpg": "backgrounds",
    "bg_exp.jpeg": "backgrounds",
    "bg_experience.jpeg": "backgrounds",
    "bg_journey.jpeg": "backgrounds",
    # experience cards (baking and tea are also used on the homepage)
    "exp_craft.jpeg": "experiences",
    "exp_pottery.jpeg": "experiences",
    "exp_cooking.jpeg": "experiences",
    "baking.jpeg": "experiences",
    "tea.jpeg": "experiences",
    "cultural_discovery.jpeg": "experiences",
    "yoga.jpeg": "experiences",
    "movement.jpeg": "experiences",
    "board_games.jpeg": "experiences",
    "picnic.jpeg": "experiences",
    "arrangements.jpg": "experiences",
    "flower.jpeg": "experiences",
    # homepage
    "about.jpg": "home",
    "arts.jpeg": "home",
    "boardgame.jpeg": "home",
    "care.jpeg": "home",
    "comfort.jpeg": "home",
    "community.jpeg": "home",
    "craft.jpeg": "home",
    "flowers.jpeg": "home",
    "grandma_plant.jpeg": "home",
    "grandmas.jpg": "home",
    "health.jpeg": "home",
    "meditate.jpeg": "home",
}
FOLDERS = set(MAP.values())

if not IMG.is_dir():
    sys.exit(f"Cannot find {IMG}. Put this script in the project folder next to img/.")

# 1. move the files
for name, folder in MAP.items():
    src = IMG / name
    if not src.exists():
        continue
    dest = IMG / folder / name
    print(f"move  img/{name}  ->  img/{folder}/{name}")
    if not DRY:
        dest.parent.mkdir(exist_ok=True)
        shutil.move(str(src), str(dest))

# 2. rewrite paths in html / css / js
pattern = re.compile(r"img/(?!(?:%s)/)([A-Za-z0-9_.\-]+)" % "|".join(FOLDERS))

def fix(match):
    name = match.group(1)
    return f"img/{MAP[name]}/{name}" if name in MAP else match.group(0)

for path in sorted(ROOT.glob("*")):
    if path.suffix.lower() not in {".html", ".css", ".js"}:
        continue
    with open(path, encoding="utf-8", newline="") as f:
        text = f.read()
    new = pattern.sub(fix, text)
    if new != text:
        print(f"paths updated in {path.name}")
        if not DRY:
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(new)

# 3. report anything left loose
left = sorted(p.name for p in IMG.iterdir() if p.is_file())
if left:
    print("\nNot sorted (not in the list, left in img/):")
    for n in left:
        print("  ", n)
print("\nDry run only, nothing changed." if DRY else "\nDone.")