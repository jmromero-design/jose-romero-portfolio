#!/usr/bin/env python3
"""
build_markdown.py: markdown versions of every page, for AI tools and agents.

For every built page (except the homepages, whose agent summary is written by
hand in middleware.js, and the 404) this converts the page's <main> into clean
markdown and writes it to md/<path>/index.md. It reads the built pages in
_site/, so build first (npm run build:all does build, markdown, build).
middleware.js serves those files to any request that asks for text/markdown,
and each page links its version with <link rel="alternate" type="text/markdown">.

It also writes llms-full.txt: every English page in one file, so an assistant
can read the whole portfolio in a single request.

Skipped while converting: the nav and breadcrumbs, the closing CTA, the
next-project link, tables of contents, anything aria-hidden, scripts, styles
and drawings. Re-run after editing page copy:

    python3 scripts/build_markdown.py
"""

import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.joseromerodesign.com"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
DROP_TAGS = {"script", "style", "svg", "noscript", "template", "canvas", "button", "nav", "form"}
DROP_CLASSES = ("v4-cta", "cta-section", "next-project", "cs-nav", "fwa-toc", "bgx-tools", "bgx-col",
                "bgx-loading", "v4-scroll-cue", "skip-nav", "bko-scroll-hint", "v4-preview", "v4-row-thumbs",
                "v4-ediag-preview-card", "bko-rail", "breadcrumb", "tag", "cs-tags", "card-tags",
                "bko-cover-footline", "tk-skill-count")
# buttons are interface, except where the button label is the content's own heading
KEEP_BUTTONS = ("tk-skill-btn",)


class ToMarkdown(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []          # finished blocks
        self.buf = ""          # current inline text
        self.stack = []        # open tags: (tag, dropped)
        self.in_main = False
        self.drop = 0
        self.list_depth = 0
        self.href = None
        self.link_text = ""
        self.detail_label = None

    # ── helpers ──
    def flush(self, prefix=""):
        text = re.sub(r"\s+", " ", self.buf).strip()
        if text:
            self.out.append(prefix + text)
        self.buf = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "main":
            self.in_main = True
        if not self.in_main:
            return
        cls = a.get("class") or ""
        dropped = ((tag in DROP_TAGS and not any(c in cls.split() for c in KEEP_BUTTONS))
                   or a.get("aria-hidden") == "true"
                   or any(c in cls.split() for c in DROP_CLASSES))
        if tag not in VOID:
            self.stack.append((tag, dropped))
        if dropped:
            self.drop += 1
            return
        if self.drop:
            return
        if tag in ("h1", "h2", "h3", "h4", "p", "li", "blockquote", "figcaption", "dt", "dd", "tr"):
            self.flush()
        if tag in ("ul", "ol"):
            self.flush(); self.list_depth += 1
        if tag == "br":
            self.buf += " "
        if tag in ("strong", "b") and self.buf.strip():
            self.buf += " **"
        elif tag in ("strong", "b"):
            self.buf += "**"
        if tag == "em" or tag == "i":
            self.buf += "_"
        if tag == "a" and a.get("href"):
            h = a["href"]
            if h.startswith("/"):
                h = SITE + h
            if h.startswith(("http", "mailto:")):
                self.href = h
                self.link_text = ""
        if "cs-detail-label" in cls:
            self.flush(); self.detail_label = True
        if "cs-detail-value" in cls:
            self.detail_label = False

    def handle_endtag(self, tag):
        if not self.in_main:
            return
        if tag == "main":
            self.flush(); self.in_main = False
            return
        # close up to the matching open tag
        while self.stack:
            t, dropped = self.stack.pop()
            if dropped:
                self.drop -= 1
            if t == tag:
                break
        else:
            return
        if self.drop:
            return
        if tag in ("h1", "h2", "h3", "h4"):
            self.flush("#" * int(tag[1]) + " ")
        elif tag == "li":
            self.flush("  " * max(0, self.list_depth - 1) + "- ")
        elif tag in ("ul", "ol"):
            self.list_depth = max(0, self.list_depth - 1)
        elif tag == "blockquote":
            self.flush("> ")
        elif tag == "figcaption":
            text = self.buf.strip()
            self.buf = ""
            if text:
                self.out.append("_" + re.sub(r"\s+", " ", text) + "_")
        elif tag in ("p", "dt", "dd", "tr", "div", "section", "article", "header", "figure", "span") and self.detail_label is None:
            if tag in ("p", "dt", "dd", "tr"):
                self.flush()
        elif tag in ("strong", "b"):
            self.buf += "** "
        elif tag in ("em", "i"):
            self.buf += "_"
        if tag in ("strong", "b") and self.detail_label is None:
            pass
        if tag == "a" and self.href:
            text = re.sub(r"\s+", " ", self.link_text).strip()
            if text and not text.startswith("http"):
                # the link text is already in buf; wrap its last occurrence
                i = self.buf.rfind(text)
                if i != -1:
                    self.buf = self.buf[:i] + f"[{text}]({self.href})" + self.buf[i + len(text):]
            self.href = None
        if tag == "span" and self.detail_label is False:
            # "Client: IKEA" pairs from the case-study details bar
            pair = re.sub(r"\s+", " ", self.buf).strip()
            self.buf = ""
            if pair:
                label, _, value = pair.partition("␟")
                self.out.append(f"- **{label.strip()}:** {value.strip()}" if value else "- " + pair)
            self.detail_label = None
        elif tag == "span" and self.detail_label is True:
            self.buf += "␟"
            self.detail_label = "value-next"

    def handle_data(self, data):
        if not self.in_main or self.drop:
            return
        self.buf += data
        if self.href:
            self.link_text += data


def url_of(path):
    """_site/work/x.html -> /work/x/ ; _site/es/index.html -> /es/ ; _site/index.html -> /"""
    rel = path.relative_to(ROOT / "_site").as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel[: -len(".html")] + "/"


def page_files():
    """Every built page. Read from _site rather than the sitemap: the sitemap
    leaves out pages robots already ignore (the two privacy pages are noindex),
    and those still need a markdown twin."""
    for f in sorted((ROOT / "_site").rglob("*.html")):
        yield url_of(f), f


def convert(f):
    html = f.read_text()
    title = unescape(re.search(r"<title>([^<]*)</title>", html).group(1)).strip()
    desc = re.search(r'<meta name="description"\s+content="([^"]*)"', html)
    p = ToMarkdown()
    p.feed(html)
    body = []
    for block in p.out:
        block = re.sub(r"\*\*\s*\*\*", "", block)            # empty bold
        block = re.sub(r"_\s*_", "", block)                   # empty italic
        block = re.sub(r"\*\*\s+([^*]+?)\s+\*\*", r"**\1**", block)
        block = re.sub(r"\s+([,.;:!?)])", r"\1", block)
        block = block.replace("␟", " ").strip()
        if block and block not in ("-", "#", "_"):
            body.append(block)
    # drop immediate duplicates (visually repeated labels)
    clean = [b for i, b in enumerate(body) if i == 0 or b != body[i - 1]]
    return title, unescape(desc.group(1)) if desc else "", clean


def project_order():
    """Reading order of the case studies, from the data file that already
    defines it. Falls back to alphabetical if the file stops matching."""
    src = (ROOT / "src/_data/projects.js").read_text()
    slugs = re.findall(r'slug:\s*"([a-z0-9-]+)"', src)
    return {f"/work/{s}/": i for i, s in enumerate(slugs)}


SECTION_ORDER = ["/about/", "/work/", "/thinking/"]


def full_order(loc, rank):
    """Order of llms-full.txt: section pages first, then case studies in reading
    order, then the Thinking articles, then anything else."""
    if loc in SECTION_ORDER:
        return (0, SECTION_ORDER.index(loc), "")
    if loc.startswith("/work/"):
        return (1, rank.get(loc, 999), loc)
    if loc.startswith("/thinking/"):
        return (2, 0, loc)
    return (3, 0, loc)


def main():
    pages = {}
    written = set()
    for loc, f in page_files():
        if loc in ("/", "/es/", "/404/"):
            continue
        title, desc, blocks = convert(f)
        url = SITE + loc
        md = f"# {title}\n\n{desc}\n\nSource: {url}\n\n" + "\n\n".join(blocks) + "\n"
        out = ROOT / "md" / loc.strip("/") / "index.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(md)
        pages[loc] = md
        written.add(out)

    # Remove twins for pages that no longer exist, or middleware keeps serving
    # the old text for a URL the site dropped.
    for old in sorted((ROOT / "md").rglob("index.md")):
        if old in written:
            continue
        old.unlink()
        for parent in old.parents:
            if parent == ROOT / "md":
                break
            if any(parent.iterdir()):
                break
            parent.rmdir()
        print(f"removed orphan twin: {old.relative_to(ROOT)}")

    rank = project_order()
    english = [
        loc for loc in pages
        if not loc.startswith("/es/") and loc not in ("/privacy/", "/contact/")
    ]
    english.sort(key=lambda loc: full_order(loc, rank))
    full = "".join(f"\n\n---\n\n{pages[loc]}" for loc in english)

    head = (ROOT / "llms.txt").read_text().split("\n## ")[0].strip()
    (ROOT / "llms-full.txt").write_text(
        head + "\n\nThis file holds the full text of every English page on the site, except Contact and Privacy, one after another, "
        "so an assistant can read the whole portfolio in one request. Each page is also available on its own "
        "as markdown: request the page with Accept: text/markdown, or open /md/<path>/index.md.\n"
        + full)
    print(f"{len(pages)} markdown pages, llms-full.txt {len((ROOT / 'llms-full.txt').read_text().split())} words")


if __name__ == "__main__":
    main()
