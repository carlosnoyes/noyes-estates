"""
Convert SVG files in the logos folder to PNG.

Only converts SVGs that don't already have a PNG counterpart.
Uses a headless browser via Playwright — no native dependencies needed.

First-time setup:
    pip install playwright
    playwright install chromium
"""

import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Playwright is required. Install with:\n  pip install playwright\n  playwright install chromium")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent


def main():
    svg_files = sorted(SCRIPT_DIR.glob("*.svg"))
    to_convert = [(svg, svg.with_suffix(".png")) for svg in svg_files if not svg.with_suffix(".png").exists()]

    if not to_convert:
        print("No new SVGs to convert — all PNGs are up to date.")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        for svg_path, png_path in to_convert:
            print(f"Converting: {svg_path.name} -> {png_path.name}")

            svg_url = svg_path.as_uri()
            page.goto(svg_url)

            # Get the natural size of the SVG
            size = page.evaluate("""() => {
                const svg = document.querySelector('svg');
                const bbox = svg.getBoundingClientRect();
                return { width: bbox.width, height: bbox.height };
            }""")

            page.set_viewport_size({"width": int(size["width"]), "height": int(size["height"])})
            page.screenshot(path=str(png_path), omit_background=True)

        browser.close()

    print(f"Done. Converted {len(to_convert)} file(s).")


if __name__ == "__main__":
    main()