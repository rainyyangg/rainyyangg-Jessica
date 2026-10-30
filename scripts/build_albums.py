#!/usr/bin/env python3
"""Build photo album catalog from event/photographer folders."""
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
EXISTING = {"Hong-Kong-Airport-20261008", "Nana-Jacqueline-20261006", "Hong-Kong-Airport-20261005", "Incheon-Airport-20261005"}
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
pattern = re.compile(r"^(.+)-(20\d{6})(?:-(\d+\.\d+))?$")
albums = []
for folder in sorted(ROOT.iterdir()):
    if not folder.is_dir() or folder.name.startswith("."):
        continue
    match = pattern.fullmatch(folder.name)
    if not match:
        continue
    label, stamp, version = match.groups()
    photographers = []
    photos = []
    rehearsal_names = {"彩排", "rehearsal", "soundcheck", "rehearsals"}
    performance_names = {"正式演出", "performance", "show", "concert"}
    def add_photo(file, photographer, stage):
        if photographer not in photographers:
            photographers.append(photographer)
        photos.append({
            "photographer": photographer,
            "stage": stage,
            "name": file.name,
            "src": "/".join(quote(part, safe="") for part in file.relative_to(ROOT).parts)
        })
    for child in sorted(folder.iterdir(), key=lambda p: p.name.casefold()):
        if not child.is_dir() or child.name.startswith("."):
            continue
        stage_name = child.name.casefold()
        if stage_name in rehearsal_names or stage_name in performance_names:
            stage = "rehearsal" if stage_name in rehearsal_names else "performance"
            for photographer_dir in sorted(child.iterdir(), key=lambda p: p.name.casefold()):
                if not photographer_dir.is_dir() or photographer_dir.name.startswith("."):
                    continue
                for file in sorted(photographer_dir.iterdir(), key=lambda p: p.name.casefold()):
                    if file.is_file() and file.suffix.lower() in EXTENSIONS:
                        add_photo(file, photographer_dir.name, stage)
        else:
            for file in sorted(child.iterdir(), key=lambda p: p.name.casefold()):
                if file.is_file() and file.suffix.lower() in EXTENSIONS:
                    add_photo(file, child.name, "performance")
    if photos:
        albums.append({"id": folder.name, "title": label.replace("-", " ") + (f" {version}" if version else ""), "date": f"{stamp[:4]}.{stamp[4:6]}.{stamp[6:]}", "photographers": photographers, "photos": photos, "existing": folder.name in EXISTING})
out = ROOT / "albums.json"
out.write_text(json.dumps(albums, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Generated {len(albums)} albums, {sum(len(a['photos']) for a in albums)} photos")
