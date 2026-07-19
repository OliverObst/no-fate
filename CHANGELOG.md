# Changelog

All notable changes to No Fate will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and releases use [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Exact PaperMod provenance and maintenance policy in `UPSTREAM.md`.
- A self-contained fictional demonstration site.
- CI builds using the minimum and current supported Hugo Extended versions.
- Generic issue and pull-request templates.
- Contribution and release documentation.
- The Section 5 repository foundation, including generic archetypes, theme
  defaults, semantic data, and tracked asset directories.
- An ordered No Fate CSS pipeline with semantic tokens and neutral structural
  styles.
- A shared article shell, page-mode resolver, modular homepage, render hooks,
  baseline editorial shortcodes, and downstream extension hooks.
- A fictional structural fixture covering Markdown hooks and shortcodes.

### Changed

- Renamed theme and Hugo Module metadata to No Fate.
- Raised the minimum supported Hugo Extended version to 0.158.0.
- Replaced upstream-facing documentation with reusable No Fate documentation.
- Removed upstream screenshots and the PaperMod credit from the generated site footer.
- Moved navigation and theme interactions from inline templates to progressive
  Hugo-managed assets.
- Removed the inherited Profile and Home-Info modes from the active theme
  architecture.

[Unreleased]: https://github.com/OliverObst/no-fate/commits/main
