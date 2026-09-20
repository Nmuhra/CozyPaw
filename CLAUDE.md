# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Cozypaw is a single-page marketing site for a small pet-sitting business (Pretoria East & Centurion, South Africa). It is one HTML page, [index.html](index.html) (markup only), with its styles in [css/](css/), its script in [js/main.js](js/main.js) and three photos in [images/](images/). There is no build system, package manager, linter, or test suite: the files are served as-is.

To preview, open `index.html` in a browser or run `python -m http.server` in the repo root. Google Fonts and the OpenStreetMap iframe load from the network. For a quick visual check without a browser window: `chromium --headless --no-sandbox --window-size=390,844 --screenshot=out.png file://$PWD/index.html`.

## Structure

- **index.html**: meta description, Open Graph tags, an inline SVG favicon, a `LocalBusiness` JSON-LD block (kept inline on purpose; it repeats the prices, phone number and suburbs, see below), then the markup. Sections, in DOM order inside `<main id="main">`: hero (with the "sample visit report" card), trust strip, `#services`, `#how`, `#rates`, `#area`, `#gallery`, `#faq`, `#contact`. The header nav links follow the same order. Sections alternate between the `--bg` and `--paper` backgrounds.
- **CSS** is split by area and loaded in this order (later files may rely on earlier ones):
  - [css/base.css](css/base.css): `:root` color variables, reset, typography, focus styles, `.wrap`, buttons, `.eyebrow`/`.section-head`, reduced-motion rules.
  - [css/header.css](css/header.css): sticky header, nav, mobile menu, floating WhatsApp button.
  - [css/hero.css](css/hero.css): hero and report card.
  - [css/sections.css](css/sections.css): trust strip, services, how it works, rates, coverage, gallery, FAQ.
  - [css/contact.css](css/contact.css): contact cards, form, footer.
- **Responsive rules live next to the component they affect** (each file has its own `max-width: 900px` block, plus 420px/560px ones where needed), not in one global block. Below 900px the nav becomes a hamburger dropdown (`header.open`) and the floating WhatsApp button (`.wa-float`) appears.
- **Colors**: reuse the variables in `base.css` instead of hardcoding; use `--marigold-deep` (not `--marigold`) for small text on light backgrounds, for contrast.
- **Fonts**: Fraunces for headings, Work Sans for body, Space Mono for the uppercase "stamp" labels (`.stamp-font`, `.eyebrow`). Loaded from Google Fonts in the `<head>`.
- **JavaScript** ([js/main.js](js/main.js), loaded with `defer`), three independent blocks:
  - mobile menu toggle;
  - booking form: on submit, builds a WhatsApp message from the fields and opens `wa.me`;
  - the "How a booking works" stepper: `ol.steps[data-stepper]` is progressively enhanced. JS adds `.is-interactive`, toggles `.is-active`/`.is-done` on the `li.step` items (click, "Next step" buttons, arrow/Home/End keys) and adds `.in-view` for the staggered entrance. The CSS for it is the "How it works" block in `sections.css`, and the detail panels are hidden only under `.is-interactive`, so the section still reads fine without JS. Any new step needs a `--i` index style and matching `id`s (`step-btn-N` / `step-detail-N`).
  Everything else (accordion FAQ via `<details>`, anchor scrolling, hover effects) is plain HTML/CSS.

## Content that is duplicated and must be kept in sync

There is no templating, so the same facts appear in several places. When changing one, update all of them:

- **Prices** (R300/night overnight, R150/visit): the `#services` cards, the `#rates` list, the meta description, the `og:description`, and the JSON-LD offers/`priceRange`. The fuel note appears in `#services`, `#rates`, the FAQ and step 2 of the stepper.
- **Phone number** (060 340 1879 / `27603401879`): the `wa.me` links (hero button, floating button, contact card, and the form script), the `tel:` link, the link labels, and the JSON-LD `telephone`.
- **Service area / suburbs**: the `<title>`, meta/OG text, the trust strip, `#area` copy, the FAQ, the footer, and the JSON-LD `areaServed`.

## Notes

- The booking form has no backend. With JS it opens a pre-filled WhatsApp chat; without JS it falls back to a `mailto:` to the same address shown in the contact card (`nabegh.muhra25@gmail.com`).
- The hero report card is a sample (labelled as such), not a real customer's report.
- Keep gallery `alt` text in line with the actual photo when swapping images (currently: tabby cat, chocolate Labrador puppy, French bulldog). Photos are resized and stripped of EXIF metadata; do this for new phone photos too (e.g. `magick in.jpg -auto-orient -strip -resize 1280x -quality 82 out.jpg`), since originals can be several MB and carry GPS data.
