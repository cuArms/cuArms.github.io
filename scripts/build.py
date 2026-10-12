"""Build a publication-only folder from media referenced by content.js."""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "dist"
if DEST.exists():
    shutil.rmtree(DEST)
DEST.mkdir()
for filename in ("index.html", "styles.css", "site.js", "content.js"):
    shutil.copy2(ROOT / filename, DEST / filename)
(DEST / "assets/figures").mkdir(parents=True)
shutil.copy2(ROOT / "assets/figures/method.png", DEST / "assets/figures/method.png")
(DEST / "assets/posters").mkdir(parents=True)
(DEST / "videos/web").mkdir(parents=True)
ids = set(re.findall(r"""["']?\bid["']?:\s*['"]([a-z0-9-]+)['"]""", (ROOT / "content.js").read_text()))
for slug in ids:
    video = ROOT / "videos/web" / (slug + ".mp4")
    poster = ROOT / "assets/posters" / (slug + ".jpg")
    if not video.exists() or not poster.exists():
        # Group ids are not media ids.
        if video.exists() != poster.exists():
            raise FileNotFoundError(f"Incomplete media pair: {slug}")
        continue
    shutil.copy2(video, DEST / "videos/web" / video.name)
    shutil.copy2(poster, DEST / "assets/posters" / poster.name)
(DEST / ".nojekyll").touch()
print("Built", DEST)
