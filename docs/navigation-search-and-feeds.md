# Navigation, search and feeds

No Fate keeps navigation and discovery generic. A downstream site supplies
every label, secondary phrase, taxonomy and feed boundary.

## Navigation

Hugo menu entries may include a restrained desktop-only secondary phrase:

```yaml
menu:
  main:
    - identifier: writing
      name: Writing
      url: /writing/
      weight: 10
      params:
        secondary: arguments, questions, notes
```

The primary name remains the accessible link name. Secondary text is
`aria-hidden` and disappears on narrow screens, so it cannot make navigation
verbose or obscure the primary label. Exact pages receive `aria-current`;
descendant pages retain a visible section state. The `search` identifier uses
a quieter weight but remains fully legible.

No menu entry is inserted by the theme. Search, topics, records and any
subject-specific section appear only when configured downstream.

## Search boundaries

The JSON search index always excludes:

- drafts, including during draft builds;
- private, headless and utility pages;
- pages with `robotsNoIndex`, `searchHidden` or a search layout;
- pages with `search.exclude: true`;
- generated archive utility pages.

Data-driven structured records are not duplicated in the page index.
Page-based `content.format: record` entries include their title and summary but
omit full body content by default. Override that choice per page:

```yaml
search:
  exclude: false
  include_content: true
```

The search control has a programmatic label, result status, keyboard traversal
and an explicit unavailable state. It fetches the home JSON output through
Hugo's output-format URL rather than assuming a relative path. Fuse.js and its
index are local assets; neither is required to read ordinary pages.

## Tags and topics

Taxonomy names belong to the downstream configuration:

```yaml
taxonomies:
  tag: tags
  topic: topics
```

No Fate retains Hugo taxonomy and term layouts, yearly archives, the sitemap,
Open Graph metadata, JSON-LD article metadata, canonical URLs, robots output
and the 404 page.

## Section feeds

Hugo outputs make section feeds explicit and configurable. Add RSS only to
the sections that need it:

```yaml
---
title: "Writing"
outputs:
  - HTML
  - RSS

feed:
  description: "Arguments, questions, and notes."
---
```

The resulting feed lives beside the section, for example
`/writing/index.xml`. Feed rendering excludes drafts, private/headless/utility
pages, search and archive utilities, `hiddenInRss: true`, and
`feed.exclude: true`. The same filtering applies to the home feed.

Section feeds contain their direct regular pages. A downstream site can use
Hugo's normal output configuration for broader or more specialised feeds
without editing theme templates.
