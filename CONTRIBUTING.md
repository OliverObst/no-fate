# Contributing to No Fate

Thank you for helping build No Fate as a reusable public Hugo theme.

## Before starting

Search existing issues and pull requests. Use an issue to discuss changes that
alter templates, front matter, configuration, accessibility behaviour, or the
public content contract.

Keep contributions independent of any downstream site. Do not add real
biographies, institutions, domains, social profiles, projects, publication
records, private material, or proprietary assets.

## Local setup

Install:

- Git;
- Hugo Extended 0.158.0 or later;
- Go for Hugo Module checks.

Build the demonstration site from the repository root:

```sh
hugo server \
  --source exampleSite \
  --themesDir ../.. \
  --buildDrafts
```

Run the production check before opening a pull request:

```sh
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --minify
```

## Contribution rules

- Preserve semantic HTML, keyboard access, readable contrast, and reduced
  motion behaviour.
- Keep JavaScript progressive and page-specific.
- Do not introduce Node.js, Tailwind, React, Vue, or another application
  framework.
- Put theme settings below `params.noFate`.
- Add or update fictional fixtures for changed behaviour.
- Mark demonstration pages with `demo: true` where practical.
- Use `example.invalid` for invented external domains.
- Use Australian or British English in documentation and fixtures.
- Do not describe the design by imitating a named site, publication, designer,
  studio, or commercial brand.
- Preserve image source and rights metadata.
- Record breaking front matter, template, or CSS changes in `CHANGELOG.md`.

## Pull requests

Keep a pull request focused on one architectural concern where practical.
Include:

- the scope and motivation;
- templates and assets changed;
- front matter or configuration changes;
- screenshots for visual changes, containing only fictional content;
- accessibility impact;
- migration impact;
- tests performed;
- confirmation that fixtures remain fictional and generic.

Maintainers may ask for a change to be split when its concerns cannot be
reviewed or reverted independently.

## Upstream changes

Read `UPSTREAM.md` before importing a PaperMod change. Cherry-pick only reviewed
compatibility, security, accessibility, or SEO work. Preserve upstream
attribution and record the adopted commit in the changelog.
