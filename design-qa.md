# Design QA

- Source visual truth:
  `/Users/oliver/.codex/generated_images/019f786c-e713-7d11-b246-2d89276b0b4d/call_5UD2sgiTo2zVAjuS67xkJQ6G.png`
- Browser-rendered implementation:
  `/tmp/no-fate-wild-desktop-final-4.png`
- Viewport and state: 1440 × 1024, `wild`, light colour mode, homepage
- Full-view comparison evidence: `/tmp/no-fate-comparison-final.png`
- Focused comparison evidence: `/tmp/no-fate-comparison-focus-final.png`
- Supplementary evidence:
  - `/tmp/no-fate-wild-mobile-final.png` — 390 × 844, light
  - `/tmp/no-fate-wild-dark-final.png` — 1440 × 1024, dark
  - `/tmp/no-fate-clean-desktop.png` — 1440 × 1024, clean

## Findings

There are no actionable P0, P1 or P2 differences in the final comparison.

- [P3] The implementation deliberately omits the reference's torn tab corners,
  handwritten marginalia, stamped office mark and separate right-hand filing
  rail. These are publication-specific assets rather than reusable theme
  structure. The implementation retains the underlying hierarchy through the
  boxed issue navigation, reference label, print texture, circled proposition
  and rule-based module grid.
- [P3] The real demonstration homepage contains more modules than the visual
  target. The first editorial row is visible above the fold and the remaining
  modules follow the same grid, so the density change is an expected content
  difference rather than layout drift.

## Required fidelity surfaces

- Fonts and typography: the implementation uses locally available narrow and
  grotesque system fallbacks, very heavy display type, compressed line height
  and configured display-line breaks. The final focused comparison confirms
  the headline scale, wrapping and black/red hierarchy closely track the source.
- Spacing and layout rhythm: the final desktop capture aligns the masthead,
  full-width navigation, opening, circled statement and three-column editorial
  row with the source's major regions. The 390 px browser metric reports
  `scrollWidth: 390`, with no horizontal overflow or clipped controls.
- Colours and visual tokens: the palette maps to warm paper, near-black ink and
  signal red. Signal red on paper measures approximately 4.65:1 for small
  labels; black text and focus indicators have stronger contrast. Dark mode
  preserves the same hierarchy without introducing overflow.
- Image quality and asset fidelity: the only required raster asset is the
  generated 768 × 768 paper/photocopy texture at
  `assets/images/wild-paper-grain.webp`. It is 28 KB, sharp at the repeated
  scale and contains no copied marks, logos or placeholder imagery.
- Copy and content: the homepage copy stands on its own, retains one accessible
  page title, and keeps decorative display-line duplicates hidden from
  assistive technology. The public copy contains no demonstration disclaimer
  or named-style reference.
- Icons and controls: the reference search icon is represented by the existing
  explicit Search navigation label, which is clearer in the reusable theme.
  The theme control remains a labelled button rather than a decorative glyph.
- Accessibility and behaviour: primary links are keyboard reachable, the theme
  button has a 3 px focus outline, the colour toggle changes light to dark, and
  the six menu destinations all return HTTP 200. Chrome's accessibility tree
  exposes the level-one heading as “What we make for ourselves”.
  Reduced-motion and forced-colour safeguards remain active.

## Browser checks

- Primary interactions tested:
  - Theme toggle changed `data-theme` from `light` to `dark`.
  - Essays, Archives, Projects, Record, About and Search destinations returned
    HTTP 200.
  - Footer destinations resolve to the No Fate repository, Oliver Obst's
    website and Hugo.
  - Keyboard focus styling on the theme toggle was visible at 3 px.
- Console checked: no JavaScript exceptions or application errors occurred.
  Chrome reported only failed favicon requests to `example.invalid`, the
  demonstration site's intentionally unreachable reserved base URL.

## Comparison history

1. The first combined comparison showed the opening was too tall, the circled
   paragraph was too long, the theme control wrapped below the masthead and the
   first editorial row sat too far below the fold.
   - Fixes: split the statement from its supporting copy, assigned explicit
     grid rows, tightened the opening, prevented logo-control wrapping and
     moved the first module row upwards.
   - Post-fix evidence: `/tmp/no-fate-comparison-full.png`.
2. The next comparison showed the display headline was smaller and lower than
   the source, and the first mobile capture suggested clipping.
   - Fixes: enlarged and horizontally extended the display strips, aligned
     them to the top of the opening, reduced the mobile scale and made the
     mobile logo row an explicit two-column grid.
   - Post-fix evidence: `/tmp/no-fate-wild-mobile-final.png` and browser metrics
     `innerWidth: 390`, `scrollWidth: 390`.
3. Tightening the opening briefly caused the deck to collide with the supporting
   paragraph.
   - Fix: lowered the absolutely positioned deck into the remaining baseline
     space and recaptured at the same viewport.
   - Post-fix evidence: `/tmp/no-fate-wild-desktop-final-4.png` and
     `/tmp/no-fate-comparison-final.png`.

## Implementation checklist

- [x] Preserve `clean` as the default style.
- [x] Add configurable `wild` presentation and documentation.
- [x] Use an original generated paper asset rather than copied artwork.
- [x] Verify desktop, 390 px mobile, dark mode and clean mode.
- [x] Verify navigation, footer links, theme toggle and keyboard focus.
- [x] Build with standard Hugo 0.158.0 and 0.164.0, plus Hugo Extended 0.164.0.

final result: passed
