#!/usr/bin/env python3
"""Fix image paths in the site so they match the current asset locations.

Run from the project root:
    python tools/rearrange.py --dry-run     (preview only)
    python tools/rearrange.py               (apply)

1. Any image still loose in img/ is moved into its subfolder (list below).
2. Image references in HTML, CSS and JavaScript are updated to their current
   locations, with CSS paths made relative to each stylesheet.
3. Paths that point to an image that does not exist are listed at the end.
"""
import os
import re
import shutil
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "img"
DRY = "--dry-run" in sys.argv

# Where loose images should go (only used if they are still directly in img/)
MAP = {
    "logo.png": "brand", "favicon-32.png": "brand", "favicon-512.png": "brand",
    "apple-touch-icon.png": "brand",
    "fb_logo.png": "social", "ins_logo.png": "social",
    "tiktok_logo.png": "social", "x_logo.png": "social",
    "banner.jpg": "backgrounds", "bg_exp.jpeg": "backgrounds",
    "bg_experience.jpeg": "backgrounds", "bg_journey.jpeg": "backgrounds",
    "exp_craft.jpeg": "experiences", "exp_pottery.jpeg": "experiences",
    "exp_cooking.jpeg": "experiences", "baking.jpeg": "experiences",
    "tea.jpeg": "experiences", "cultural_discovery.jpeg": "experiences",
    "yoga.jpeg": "experiences", "movement.jpeg": "experiences",
    "board_games.jpeg": "experiences", "picnic.jpeg": "experiences",
    "arrangements.jpg": "experiences", "flower.jpeg": "experiences",
    "about.jpg": "home", "arts.jpeg": "home", "boardgame.jpeg": "home",
    "care.jpeg": "home", "comfort.jpeg": "home", "community.jpeg": "home",
    "craft.jpeg": "home", "flowers.jpeg": "home", "grandma_plant.jpeg": "home",
    "grandmas.jpg": "home", "health.jpeg": "home", "meditate.jpeg": "home",
}

if not IMG.is_dir():
    sys.exit(f"Cannot find {IMG}. Put this script in the project folder next to img/.")

# 1. move loose files into their subfolders
for name, folder in MAP.items():
    src = IMG / name
    if src.is_file():
        print(f"move  img/{name}  ->  img/{folder}/{name}")
        if not DRY:
            (IMG / folder).mkdir(exist_ok=True)
            shutil.move(str(src), str(IMG / folder / name))
        # in a dry run, pretend it moved so the path report below is accurate

# 2. find where every image really is
where = defaultdict(list)
for p in IMG.rglob("*"):
    if p.is_file():
        where[p.name].append(p.relative_to(ROOT).as_posix())
if DRY:
    for name, folder in MAP.items():
        if (IMG / name).is_file():
            where[name] = [f"img/{folder}/{name}"]

pattern = re.compile(
    r"(?:\.\./)*img/(?:[A-Za-z0-9_\-]+/)*([A-Za-z0-9_.\-]+\.(?:jpe?g|png|gif|webp|svg|ico))",
    re.IGNORECASE,
)
missing = set()
duplicates = set()

def fix(match, source):
    old, name = match.group(0), match.group(1)
    found = where.get(name)
    if not found:
        missing.add(old)
        return old
    if source.suffix.lower() == ".css":
        current_image = (source.parent / old).resolve()
    else:
        current_image = (ROOT / old).resolve()
    image_path = next(
        (image for image in found if (ROOT / image).resolve() == current_image),
        None,
    )
    if image_path is None:
        if len(found) > 1:
            duplicates.add(name)
        image_path = found[0]
    if source.suffix.lower() == ".css":
        return Path(os.path.relpath(ROOT / image_path, source.parent)).as_posix()
    return image_path

# 3. rewrite paths in html / css / js
for folder in (ROOT, ROOT / "assets" / "css", ROOT / "assets" / "js"):
    for path in sorted(folder.glob("*")):
        if path.suffix.lower() not in {".html", ".css", ".js"}:
            continue
        with open(path, encoding="utf-8", newline="") as f:
            text = f.read()
        new = pattern.sub(lambda match: fix(match, path), text)
        if new != text:
            print(f"paths updated in {path.relative_to(ROOT).as_posix()}")
            if not DRY:
                with open(path, "w", encoding="utf-8", newline="") as f:
                    f.write(new)

if missing:
    print("\nThese paths point to images that do not exist (add the file or fix the name):")
    for m in sorted(missing):
        print("  ", m)
if duplicates:
    print("\nSame file name exists in more than one folder (check which you want):")
    for d in sorted(duplicates):
        print("  ", d, "->", ", ".join(where[d]))
print("\nDry run only, nothing changed." if DRY else "\nDone.")