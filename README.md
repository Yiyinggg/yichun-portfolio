# Yichun Jin — Portfolio

A scrolling fashion / styling deck built on the Lalaland slide framework, populated with original-resolution photography and copy extracted from `网站pptx.pptx`.

## Structure

- `index.html` — landing page, redirects to the deck.
- `view/ska7in/.../6862b512-...html` — the deck itself (34 slides).
- `pp/media/` — original full-resolution photos and videos sourced from the source PowerPoint.
- `css/`, `js/`, `theme/` — Lalaland framework styling, behavior and Selecta typeface.
- `code.jquery.com/`, `lkbkspro.s3.amazonaws.com/`, `www.googletagmanager.com/`, `_DataURI/` — locally-cached third-party assets bundled with the original page download.

## Running locally

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

The deck uses absolute paths (`/css/...`, `/pp/...`), so it must be served from the repo root rather than opened via `file://`.

## Notes

- The video on slide 28 (`media3.mp4`, 159 MB in the source) is omitted because it exceeds GitHub's 100 MB hard limit — slide 28 falls back to showing its poster image. To restore the video, drop the original file into `pp/media/media3.mp4` (it is gitignored).
- Slide layouts are reconstructed in HTML/CSS from the `.pptx` slide XML (EMU coordinates, absolute positioning inside a 16:9 stage), so the deck stays sharp at any viewport size.
