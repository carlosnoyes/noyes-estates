"""
Generate logo variations from Icon_1.svg.

Reads Icon_1.svg and produces new SVG files that combine
the icon with text, matching the style of Logo_1.svg.
"""

import re
from dataclasses import dataclass
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


# ---------------------------------------------------------------------------
# Icon extraction
# ---------------------------------------------------------------------------

def extract_icon(svg_text: str) -> tuple[str, str, str]:
    """Extract the path element, viewBox, and transform from an SVG string."""
    path_match = re.search(r'(<path d="[^"]+"/>)', svg_text)
    if not path_match:
        raise RuntimeError("Could not find <path> element in Icon_1.svg")

    vb_match = re.search(r'viewBox="([^"]+)"', svg_text)
    viewbox = vb_match.group(1) if vb_match else "126.5 71.5 246 246"

    tf_match = re.search(r'<g transform="([^"]+)"', svg_text)
    transform = tf_match.group(1) if tf_match else ""

    return path_match.group(1), viewbox, transform


# ---------------------------------------------------------------------------
# Logo definition
# ---------------------------------------------------------------------------

@dataclass
class LogoDef:
    """Definition for a single logo variant."""
    name: str
    color_1: str = "#000000"  # foreground (icon + text)
    color_2: str = ""         # background (empty = transparent)
    line1_text: str = "NOYES"
    line2_text: str = "ESTATES"
    font_family: str = "Arial, Helvetica, sans-serif"
    font_size: int = 56
    font_weight: int = 400
    line1_spacing: float = 22.5
    line2_spacing: float = 6
    canvas_width: int = 630
    canvas_height: int = 255
    canvas_viewbox: str = "-25 -30 630 255"
    icon_x: int = 10
    icon_y: int = 0
    icon_w: int = 200
    icon_h: int = 200
    text_x: int = 240
    text_anchor: str = "start"  # "start", "middle", or "end"
    line1_y: int = 90
    line2_y: int = 170


# ---------------------------------------------------------------------------
# SVG generation
# ---------------------------------------------------------------------------

def build_svg(logo: LogoDef, icon_path_d: str, icon_viewbox: str, icon_transform: str) -> str:
    """Build a complete logo SVG from a LogoDef and icon data."""
    vb = logo.canvas_viewbox.split()
    bg = ""
    if logo.color_2:
        bg = f'\n<rect x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="{logo.color_2}"/>'

    anchor = ""
    if logo.text_anchor != "start":
        anchor = f' text-anchor="{logo.text_anchor}"'

    line2 = ""
    if logo.line2_text:
        line2 = (
            f'\n<text x="{logo.text_x}" y="{logo.line2_y}"'
            f' font-family="{logo.font_family}" font-size="{logo.font_size}"'
            f' font-weight="{logo.font_weight}" letter-spacing="{logo.line2_spacing}"'
            f' fill="{logo.color_1}"{anchor}>{logo.line2_text}</text>'
        )

    return f"""\
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="{logo.canvas_width}" height="{logo.canvas_height}" viewBox="{logo.canvas_viewbox}"
 preserveAspectRatio="xMidYMid meet">{bg}

<!-- Icon -->
<svg x="{logo.icon_x}" y="{logo.icon_y}" width="{logo.icon_w}" height="{logo.icon_h}" viewBox="{icon_viewbox}" preserveAspectRatio="xMidYMid meet">
  <g transform="{icon_transform}"
  fill="{logo.color_1}" stroke="none">
  {icon_path_d}
  </g>
</svg>

<!-- Text -->
<text x="{logo.text_x}" y="{logo.line1_y}" font-family="{logo.font_family}" font-size="{logo.font_size}" font-weight="{logo.font_weight}" letter-spacing="{logo.line1_spacing}" fill="{logo.color_1}"{anchor}>{logo.line1_text}</text>{line2}
</svg>
"""


def generate(logo: LogoDef, icon_path_d: str, icon_viewbox: str, icon_transform: str):
    """Generate and save an SVG file for a logo definition."""
    svg = build_svg(logo, icon_path_d, icon_viewbox, icon_transform)
    out_path = SCRIPT_DIR / f"{logo.name}.svg"
    out_path.write_text(svg, encoding="utf-8")
    print(f"Generated: {out_path}")


# ---------------------------------------------------------------------------
# Logo variants — add new entries here
# ---------------------------------------------------------------------------

def logo_2(name: str, color_1: str, color_2: str = "") -> LogoDef:
    """Create a Logo_2 variant: single line 'NOYES ESTATES', larger text, wider canvas."""
    return LogoDef(
        name=name,
        color_1=color_1,
        color_2=color_2,
        line1_text="NOYES ESTATES",
        line2_text="",
        font_size=72,
        line1_spacing=12,
        line1_y=130,
        canvas_width=1000,
        canvas_viewbox="-25 -30 1035 255",
    )


def logo_3(name: str, color_1: str, color_2: str = "") -> LogoDef:
    """Create a Logo_3 variant: icon on top, two lines of text centered below."""
    return LogoDef(
        name=name,
        color_1=color_1,
        color_2=color_2,
        canvas_width=300,
        canvas_height=300,
        canvas_viewbox="0 0 300 300",
        icon_x=50,
        icon_y=10,
        icon_w=200,
        icon_h=200,
        font_size=28,
        line1_spacing=6,
        line2_spacing=6,
        text_x=150,
        text_anchor="middle",
        line1_y=220,
        line2_y=255,
    )


def logo_4(name: str, color_1: str, color_2: str = "") -> LogoDef:
    """Create a Logo_4 variant: icon on top, single line of text centered below."""
    return LogoDef(
        name=name,
        color_1=color_1,
        color_2=color_2,
        line1_text="NOYES ESTATES",
        line2_text="",
        canvas_width=300,
        canvas_height=270,
        canvas_viewbox="0 0 300 270",
        icon_x=50,
        icon_y=10,
        icon_w=200,
        icon_h=200,
        font_size=20,
        line1_spacing=6,
        text_x=150,
        text_anchor="middle",
        line1_y=215,
    )


LOGOS = [
    # Logo_1: two-line layout
    LogoDef(name="Logo_1-Black", color_1="#000000"),
    LogoDef(name="Logo_1-Gray", color_1="#5c5c5c"),
    LogoDef(name="Logo_1-Black_on_White", color_1="#000000", color_2="#ffffff"),
    LogoDef(name="Logo_1-Gray_on_White", color_1="#5c5c5c", color_2="#ffffff"),

    # Logo_2: single-line layout
    logo_2("Logo_2-Black", color_1="#000000"),
    logo_2("Logo_2-Gray", color_1="#5c5c5c"),
    logo_2("Logo_2-Black_on_White", color_1="#000000", color_2="#ffffff"),
    logo_2("Logo_2-Gray_on_White", color_1="#5c5c5c", color_2="#ffffff"),

    # Logo_3: icon on top, two lines of text centered below
    logo_3("Logo_3-Black", color_1="#000000"),
    logo_3("Logo_3-Gray", color_1="#5c5c5c"),
    logo_3("Logo_3-Black_on_White", color_1="#000000", color_2="#ffffff"),
    logo_3("Logo_3-Gray_on_White", color_1="#5c5c5c", color_2="#ffffff"),

    # Logo_4: icon on top, single line of text centered below
    logo_4("Logo_4-Black", color_1="#000000"),
    logo_4("Logo_4-Gray", color_1="#5c5c5c"),
    logo_4("Logo_4-Black_on_White", color_1="#000000", color_2="#ffffff"),
    logo_4("Logo_4-Gray_on_White", color_1="#5c5c5c", color_2="#ffffff"),
]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    icon_path, icon_viewbox, icon_transform = extract_icon(
        (SCRIPT_DIR / "Icon_1.svg").read_text(encoding="utf-8")
    )

    for logo in LOGOS:
        generate(logo, icon_path, icon_viewbox, icon_transform)
