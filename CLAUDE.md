# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cozypaw is a single-page marketing site for a small pet-sitting business (Pretoria East & Centurion, South Africa). It is one HTML page, [index.html](index.html) (markup only), with its styles in [css/](css/), its script in [js/main.js](js/main.js) and its photos in [images/](images/). There is no build system, package manager, linter, or test suite: the files are served as-is.

To preview, open `index.html` in a browser or run `python -m http.server` in the repo root. Google Fonts and the OpenStreetMap iframe load from the network. For a quick visual check without a browser window: `chromium --headless --no-sandbox --window-size=390,844 --screenshot=out.png file://$PWD/index.html`.

## Structure

- **index.html**: meta description, Open Graph tags, a `LocalBusiness` JSON-LD block (kept inline on purpose; it repeats the prices, phone number and suburbs, see below), a one-line inline script that adds `.js` to `<html>` (so scroll-reveal content is only hidden when JS runs), then an inline SVG icon sprite (`<symbol id="i-…">`, used as `<svg class="icon"><use href="#i-paw"/></svg>`; add `icon-fill` for solid icons such as the paw). Use these icons, not emoji. Sections, in DOM order inside `<main id="main">`: hero (arch photo, rotating badge, "sample visit report" card), promises strip, `#services`, `#how`, `#rates`, `#area`, `#gallery`, `#faq`, `#contact`. The header nav links follow the same order. Light sections alternate between `--bg` and `--paper`; `#rates`, `#contact` and the footer are dark (`--forest`).
- **CSS** is split by area and loaded in this order (later files may rely on earlier ones):
  - [css/base.css](css/base.css): `:root` tokens (colors, shadows, `--ease`), reset, typography, focus styles, `.icon`, `.wrap`, buttons, `.eyebrow`/`.section-head`, the `[data-reveal]` scroll-reveal, reduced-motion rules.
  - [css/header.css](css/header.css): sticky header (transparent at the top, frosted once `.scrolled`), nav, mobile menu, floating WhatsApp button.
  - [css/hero.css](css/hero.css): hero, arch photo, rotating badge and report card.
  - [css/sections.css](css/sections.css): promises strip, services, how it works, rates, coverage, gallery (mosaic + lightbox), FAQ.
  - [css/contact.css](css/contact.css): contact methods, form card, footer.
- **Responsive rules live next to the component they affect** (each file has its own `max-width: 900px` block, plus 420px/560px ones where needed), not in one global block. Below 980px the nav becomes a hamburger dropdown (`header.open`) and the floating WhatsApp button (`.wa-float`) appears (`header.css` and the footer use 980px for that reason).
- **Colors**: reuse the variables in `base.css` instead of hardcoding; use `--marigold-deep` (not `--marigold`) for small text on light backgrounds, for contrast. On dark sections use `--on-dark`/`--on-dark-soft` for text and `--marigold`/`--marigold-soft` for accents.
- **Fonts**: Fraunces (variable, light italic for the `<em>` accent words in headings) for headings and prices, DM Sans for everything else, including the letter-spaced uppercase labels (`.stamp-font`, `.eyebrow`). Loaded from Google Fonts in the `<head>`.
- **Copy style**: avoid em dashes (—) in site text; use a full stop, comma or colon instead.
- **JavaScript** ([js/main.js](js/main.js), loaded with `defer`), independent blocks:
  - header: toggles `.scrolled` once the page has moved;
  - scroll-reveal: adds `.is-visible` to `[data-reveal]` elements as they enter the viewport (a `--d` style staggers them);
  - mobile menu toggle (the button swaps its menu/close icons via CSS on `header.open`);
  - booking form: on submit, builds a WhatsApp message from the fields and opens `wa.me`;
  - the "How a booking works" stepper: `ol.steps[data-stepper]` is progressively enhanced. JS adds `.is-interactive`, toggles `.is-active`/`.is-done` on the `li.step` items (click, "Next step" buttons, arrow/Home/End keys) and adds `.in-view` for the staggered entrance. The CSS for it is the "How it works" block in `sections.css`, and the detail panels are hidden only under `.is-interactive`, so the section still reads fine without JS. Any new step needs a `--i` index style and matching `id`s (`step-btn-N` / `step-detail-N`).
  - the `#gallery` mosaic (`ul.mosaic[data-gallery]`): each tile is a plain link to its photo, so without JS it just opens the image. JS turns clicks into a `<dialog class="lightbox">` viewer (arrows, arrow keys, swipe, Esc) that reads the caption from the tile's `.tile-tag`/`.tile-title`, and adds `.is-enhanced`/`.in-view` for the staggered entrance (`--i` per tile).
  Everything else (accordion FAQ via `<details>`, anchor scrolling, hover effects) is plain HTML/CSS.

## Content that is duplicated and must be kept in sync

There is no templating, so the same facts appear in several places. When changing one, update all of them:

- **Prices** (R300/night overnight, R200/visit): the `#services` cards, the `#rates` list, the meta description, the `og:description`, and the JSON-LD offers/`priceRange`. The fuel note appears in `#services`, `#rates`, the FAQ and step 2 of the stepper.
- **Phone number** (060 340 1879 / `27603401879`): the `wa.me` links (hero button, FAQ help card, floating button, contact card, footer, and the form script), the `tel:` links (contact card and footer), the link labels, and the JSON-LD `telephone`.
- **Domain** (`https://cozypaw.co.za/`): the `canonical` link, `og:url`, `og:image` and the JSON-LD `url`/`image` in `index.html`, plus [CNAME](CNAME), [robots.txt](robots.txt) and [sitemap.xml](sitemap.xml). Social-share image URLs must stay absolute; `images/og-image.jpg` is a 1200x630 crop of the French bulldog photo. Asset paths in the page itself are relative, so the site works on any host.
- **Facebook page** (`https://www.facebook.com/people/CozyPaw/61594585773999/`): the contact card, the footer (Contact column and the icon under the logo), and the JSON-LD `sameAs`.
- **Service area / suburbs**: the `<title>`, meta/OG text, the hero kicker, the promises strip, the `#area` copy and suburb chips, the FAQ, the footer, and the JSON-LD `areaServed`.

## Notes

- The booking form has no backend. With JS it opens a pre-filled WhatsApp chat; without JS it falls back to a `mailto:` to the same address shown in the contact card (`cozypawbookings@gmail.com`). That address also appears in the contact card, the footer and the JSON-LD `email`.
- The hero report card is a sample (labelled as such), not a real customer's report.
- Some gallery photos are reused elsewhere: the calico cat in the hero arch (also preloaded in the `<head>`) and on the house-visit card, and the dog in bed on the overnight card. The hero report card is positioned to stay clear of the cat's face (top-left over the wall on desktop, hanging below the photo in the single-column layout); re-check it if you swap the hero photo.
- Keep gallery `alt` text and captions in line with the actual photo when swapping images (files are `images/gallery-N-<subject>.jpg`). The mosaic has no gaps only with the current tile mix (1 `tile--hero`, 3 `tile--wide`, 6 `tile--tall`) in the current order. If you add or remove a photo, re-check the layout at desktop and phone widths. Photos are resized and stripped of EXIF metadata; do this for new phone photos too (e.g. `magick in.jpg -auto-orient -strip -resize 1280x -quality 82 out.jpg`), since originals can be several MB and carry GPS data.
