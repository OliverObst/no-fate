# Accessibility, performance and print

Accessibility, static-first performance and print output are release
constraints for No Fate rather than optional presentation polish.

## Accessibility baseline

The theme provides:

- WCAG AA colour roles in light, dark and inverse surfaces;
- a skip link and visible `:focus-visible` treatment;
- one primary heading and semantic heading order in representative fixtures;
- keyboard-operable native navigation without a pointer-only mobile drawer;
- labelled search and filter controls with live result counts;
- alt text separate from captions and public rights attribution;
- semantic ordered lists for timelines, contact sheets and records;
- real artefact and contact-sheet numbers instead of essential CSS content;
- textual plus visual active and highlighted states;
- selectable, zoomable poster text;
- reduced-motion and forced-colour handling;
- practical 44-pixel control targets;
- no fixed minimum page width, allowing 200 per cent zoom and narrow
  reflow without content loss.

The automated rendered-HTML audit checks image alternatives, duplicate IDs,
heading jumps, JSON-LD validity, private rights leakage and representative
form labels. The repository quality suite additionally runs axe across every
page mode, the structured record, all Section 27.2 stress fixtures, search,
dark mode, active filters and narrow reflow. Lighthouse enforces a 95
accessibility minimum on the home, poster, search, full record and 20-image
archive pages. See
[Automated quality testing](testing.md) for commands and coverage.

Automation supplements that audit with keyboard traversal, an
accessibility-tree spot check, 200 per cent zoom and assistive-technology
testing; it cannot certify the manual interaction experience.

## Static-first performance

All reading content exists in static HTML. JavaScript is progressive:

- theme and navigation form the small core bundle;
- gallery behaviour appears only on pages with a contact sheet;
- table sorting appears only when a sortable table was rendered;
- section filtering appears only when filters were rendered;
- copy buttons appear only when a code block and the copy option are both
  present;
- Fuse.js appears only on the search page.

Bundles are minified and fingerprinted. The example site uses local system
font stacks, local SVG/icon markup and a local Fuse.js copy. It has no remote
font, icon, framework or runtime dependency.

Responsive page resources reserve intrinsic space. Below-fold images are
lazy, genuine heroes are eager with high fetch priority, and audio/video use
metadata preload without autoplay. No Fate performs no speculative search
index or absent-favicon preload.

Representative release pages are automatically required to reach Lighthouse
performance and accessibility scores of at least 95. Their cumulative layout
shift must be no greater than 0.1, matching
[Chrome's “good” CLS boundary](https://web.dev/articles/cls). The full reports
and threshold summary are retained as CI diagnostics. This automated gate uses
a fixed desktop viewport and the local machine's provided conditions; production
network and compression testing remains part of the release checklist.

Production hosting should enable Brotli or gzip compression; the deliberately
extreme 200-entry record and 20-image archive fixtures are intended to exercise
this deployment assumption as well as the templates.

## A4 print output

Print CSS:

- selects A4 with a 16 mm margin;
- removes navigation, footers, search, filters, pagination, copy controls,
  media players and download-only controls;
- preserves article title, author when configured, date, canonical URL and
  body;
- prints useful external link destinations;
- removes dark and decorative poster surfaces;
- keeps figures with captions, artefacts and structured records together when
  practical;
- retains real artefact numbers, sources and public rights;
- expands details content and prevents table clipping;
- applies widows, orphans and heading break controls.

Structured-record sections print their canonical URL and complete
chronological list. Long essays print explicit metadata independently of
screen-only navigation and controls.
