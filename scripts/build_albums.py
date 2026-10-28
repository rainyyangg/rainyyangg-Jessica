#!/usr/bin/env python3
"""Build photo album catalog from event/photographer folders."""
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
EXISTING = {"Hong-Kong-Airport-20261008", "Nana-Jacqueline-20261006", "Hong-Kong-Airport-20261005", "Incheon-Airport-20261005"}
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
pattern = re.compile(r"^(.+)-(20\d{6})$")
albums = []
for folder in sorted(ROOT.iterdir()):
    if not folder.is_dir() or folder.name.startswith("."):
        continue
    match = pattern.fullmatch(folder.name)
    if not match:
        continue
    label, stamp = match.groups()
    photographers = []
    photos = []
    for person in sorted(folder.iterdir(), key=lambda p: p.name.casefold()):
        if not person.is_dir() or person.name.startswith("."):
            continue
        files = sorted((p for p in person.iterdir() if p.is_file() and p.suffix.lower() in EXTENSIONS), key=lambda p: p.name.casefold())
        if not files:
            continue
        photographers.append(person.name)
        for file in files:
            photos.append({"photographer": person.name, "name": file.name, "src": "/".join(quote(s, safe="") for s in (folder.name, person.name, file.name))})
    if photos:
        albums.append({"id": folder.name, "title": label.replace("-", " "), "date": f"{stamp[:4]}.{stamp[4:6]}.{stamp[6:]}", "photographers": photographers, "photos": photos, "existing": folder.name in EXISTING})
out = ROOT / "albums.json"
out.write_text(json.dumps(albums, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Generated {len(albums)} albums, {sum(len(a['photos']) for a in albums)} photos")
