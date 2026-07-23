# Changelog

All notable changes to No Fate will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and releases use [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Inverted every text layer in wild-style entries on hover and keyboard focus
  so linked titles, summaries and metadata remain legible against the dark
  selection background.

## [0.1.0] - 2026-07-19

### Added

- Automated rendered-site quality testing for local links and fragments, HTML
  validity, axe WCAG A/AA rules, Lighthouse accessibility and performance
  scores, cumulative layout shift thresholds and pinned Linux Chromium visual
  baselines across page modes, viewports, themes, interactive record filtering,
  stress fixtures, contact sheets and print media.
- Section 27.2 stress fixtures: a 20-image archive contact sheet, 60-row
  sortable record, native MathML/code/footnotes article, downloadable PDF
  artefact and long English and German titles.
- Disposable downstream installation tests for Hugo Modules and Git
  submodules, including minimal content, an alias and a downstream template
  override.
- Public release documentation with a staged migration and redirect guide, an
  operational maintainer checklist, and expanded decision, authoring,
  accessibility, print and extension guidance for all four page modes.
- A responsive image pipeline with configurable widths and WebP quality,
  intrinsic dimensions, deliberate hero priority, seven documented treatment
  intents, prepared derivative support and structured public rights metadata
  that never exposes administrative permission notes.
- Configurable secondary navigation labels that preserve short accessible
  names, descendant section states and a compact mobile-first header.
- Static local search with explicit exclusion rules, topic taxonomies,
  configurable section RSS, canonical and robots metadata, valid JSON-LD,
  sitemap discovery and deliberate utility-page handling.
- Release hardening for keyboard use, focus, reduced motion, 200 per cent zoom,
  semantic numbering, labelled controls and rendered HTML auditing.
- Page-specific fingerprinted JavaScript bundles, optional favicons, no remote
  runtime dependencies, conservative media loading and explicit performance
  budgets.
- An A4 print contract for essays, figures, media, links and long structured
  records, including canonical metadata and usable source destinations.
- A complete optional structured-record subsystem with a documented JSON
  Schema, data-driven selected and chronological renderers, progressive
  year/type/topic filters, creator highlighting, bibliographic and download
  links, CreativeWork microdata, print styles, and a generated 200-entry
  fictional fixture enforced by CI.
- Canonical design tokens, explicit warm dark-mode roles and display, body and
  metadata typography roles.
- Complete editorial shortcodes and Markdown hooks with responsive image
  processing, dark/light variants, provenance, sortable tables and print-safe
  behaviour.
- A reorderable editorial homepage with strict selected-content validation,
  graceful empty states and single-question treatment.
- Generic section densities, configurable navigation and front matter-driven
  archive and project filters without fixed section names.
- Exact PaperMod provenance and maintenance policy in `UPSTREAM.md`.
- A self-contained fictional demonstration site.
- CI builds using the minimum and current standard Hugo versions, plus the
  current Hugo Extended version.
- Generic issue and pull-request templates.
- Contribution and release documentation.
- The Section 5 repository foundation, including generic archetypes, theme
  defaults, semantic data, and tracked asset directories.
- An ordered No Fate CSS pipeline with semantic tokens and neutral structural
  styles.
- A shared article shell, page-mode resolver, modular homepage, render hooks,
  baseline editorial shortcodes, and downstream extension hooks.
- A fictional structural fixture covering Markdown hooks and shortcodes.
- Content model version 1 with central accessors for the `content`,
  `editorial`, `visual`, `archive`, and `seo` namespaces.
- Build-time content validation for required fields, page modes, hero
  accessibility, image treatments, leaf bundles, and proposition references.
- Section-independent mode inheritance through Hugo's current-section model.
- User-defined proposition rendering, related-content discovery, homepage
  selection, and a two-item landing-link threshold.
- A complete fictional content-model fixture and portable page resource.
- Configurable `clean` and `wild` visual styles, including a generated print
  texture and optional wild masthead and homepage display-title fields.
- Hugo theme-gallery preview images in the required 3:2 formats.

### Changed

- Renamed theme and Hugo Module metadata to No Fate.
- Raised the minimum supported Hugo version to 0.158.0.
- Confirmed that No Fate builds with standard Hugo and does not require Hugo
  Extended.
- Documented No Fate's substantial architectural, content-model and visual
  differences from its PaperMod foundation.
- Completed the four page modes with distinct openings, metadata, reading
  measures, component treatments, responsive behaviour and print rules.
- Added a record-mode archetype and a complete single-page record fixture.
- Replaced the rendered-copy CI assertion with structural demonstration and
  page-mode checks.
- Replaced upstream-facing documentation with reusable No Fate documentation.
- Removed upstream screenshots and the PaperMod credit from the generated site footer.
- Moved navigation and theme interactions from inline templates to progressive
  Hugo-managed assets.
- Removed the inherited Profile and Home-Info modes from the active theme
  architecture.
- Reframed the rendered example as *What we make for ourselves*, replacing
  repetitive demonstration disclaimers with a playful editorial voice.
- Replaced the example footer boilerplate with linked No Fate, author, and Hugo
  credits.

[Unreleased]: https://github.com/OliverObst/no-fate/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/OliverObst/no-fate/releases/tag/v0.1.0
