# Changelog

All notable changes to No Fate will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and releases use [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

[Unreleased]: https://github.com/OliverObst/no-fate/commits/main
