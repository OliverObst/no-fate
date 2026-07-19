# Migrating an existing site

No Fate can replace another Hugo theme without requiring a simultaneous
rewrite of every page. Treat migration as an editorial and URL-preservation
project first, then as a theme change.

This guide uses only fictional paths and records. It applies whether the source
is another Hugo theme, a different static-site generator, or an exported
content system.

## Migration principles

1. Keep the existing production site available until the replacement has been
   built and checked.
2. Work in version control and pin a specific No Fate release or commit.
3. Inventory URLs before moving files or changing permalink configuration.
4. Preserve durable URLs wherever practical; redirect every deliberate change.
5. Move substantive pages into leaf bundles so media and attribution travel
   with the page.
6. Separate content meaning from presentation: `content.format` describes the
   material, while `visual.mode` controls its treatment.
7. Migrate in small groups and compare generated output after each group.
8. Do not carry stale, private or unsafe material forward merely because it
   existed on the previous site.

## 1. Establish a reversible baseline

Create a migration branch in the downstream site and record the current build:

```sh
git switch -c migrate-no-fate
hugo version
hugo --minify --destination public-before-no-fate
```

Save the source site's URL list from its sitemap or deployment. Keep a copy of
the old generated site outside the destination directory so a later Hugo build
cannot clean it.

Choose one installation method and pin it. A Hugo Module records the selected
version in `go.mod` and its checksums in `go.sum`:

```sh
hugo mod get github.com/OliverObst/no-fate@v0.1.0
hugo mod tidy
```

For a submodule, check out the intended tag inside the theme directory:

```sh
git -C themes/no-fate fetch --tags
git -C themes/no-fate checkout v0.1.0
```

Do not edit the imported theme. Put downstream overrides at matching paths in
the site repository.

## 2. Build the content inventory

Use a spreadsheet, CSV file or issue tracker with at least these columns:

| Current URL | Title | Date | Type | Decision | New URL | Media and attachments | External links | Inbound-link notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/writing/old-example/` | Example argument | 2019-04-11 | essay | revise | `/essays/example-argument/` | 2 images | 7 | linked from handbook |
| `/projects/example-device/` | Example device | 2021-08-02 | project | keep | unchanged | PDF, diagram | 3 | durable download |
| `/notes/example-duplicate/` | Example duplicate | 2020-02-19 | note | merge | `/essays/example-argument/` | none | 1 | redirect required |

Use only five decisions:

- `keep`: migrate without a material editorial change;
- `revise`: retain the page and its history while making a visible update;
- `merge`: incorporate useful material into another page and redirect the old
  URL;
- `redirect`: retire the content but preserve the route to a relevant
  destination;
- `remove`: publish neither the content nor a misleading redirect.

Record traffic or inbound links when available, but do not let traffic alone
decide whether unsafe or obsolete material stays public.

## 3. Map meaning to a page mode

`content.format` and `visual.mode` answer different questions:

| Existing material | Suggested `content.format` | Starting `visual.mode` |
| --- | --- | --- |
| long article or argument | `essay` | `editorial` |
| short prominent question | `question` | `poster` |
| historical collection or image-led project | `history` | `archive` |
| formal profile, policy or compact index | `record` | `record` |
| ordinary short update | `note` | `editorial` |
| documented object with provenance | `artefact` | `archive` |

These are starting points, not routing rules. Section names remain
downstream-controlled, and any section can inherit any supported mode.

Create substantive pages as leaf bundles:

```sh
hugo new content --kind essay essays/example-argument/index.md
```

Move its images and downloads beside `index.md` rather than leaving them in a
global uploads directory.

## 4. Convert front matter deliberately

A migrated page should keep its publication history while adopting the
namespaced No Fate contract:

```yaml
---
title: "Example argument"
date: 2019-04-11
lastmod: 2026-07-19
summary: "A revised argument about a fictional shared instrument."
aliases:
  - /writing/old-example/

content:
  format: "essay"
  status: "published"
  original_date: 2019-04-11

editorial:
  proposition: []
  featured: false

visual:
  mode: "editorial"
  accent: "signal"
  headline_scale: "medium"
  opening_alignment: "left"
  hero: "feature.jpg"
  hero_alt: "A labelled fictional instrument on a work table"
  hero_treatment: "raw"
  invert_opening: false

seo:
  description: "A revised argument about a fictional shared instrument."
  canonical: ""
---
```

Preserve `date` as the original publication date. Use `lastmod` for a genuine
revision and add a visible editorial note when the argument or evidence has
changed materially. Do not silently make an old article appear to have always
said something new.

No Fate temporarily reads legacy `canonicalURL`, `images` and cover-image
values, but new or migrated pages should use `seo.canonical`, `seo.image` and
`visual.hero`.

## 5. Preserve URLs and create redirects

Prefer retaining the old route by preserving the content path, `slug` or
explicit `url`. When a route must change, place every old path in `aliases` on
the destination page:

```yaml
aliases:
  - /writing/old-example/
  - /notes/example-duplicate/
```

Hugo generates portable client-side alias pages by default. For a production
host that supports server redirects, generate or maintain equivalent permanent
redirect rules and test the actual HTTP status after deployment. Do not set
`disableAliases = true` until the server-side rules are generated and verified.

Use a site-relative alias when preserving an old public path. Page-relative
aliases are useful but easier to misread after a section move. See Hugo's
[URL management documentation](https://gohugo.io/content-management/urls/)
for resolution rules and server-side redirect options.

After every migration batch, compare the inventory with generated files:

```sh
hugo --minify --panicOnWarning
test -f public/essays/example-argument/index.html
test -f public/writing/old-example/index.html
```

Also crawl the preview deployment. A generated alias file proves that Hugo
created a route; only a request to the deployed site proves that the hosting
layer serves the intended redirect.

## 6. Move images, files and attribution

Place page-specific media in the leaf bundle:

```text
content/
└── archives/
    └── example-project/
        ├── index.md
        ├── feature.jpg
        ├── plate-01.jpg
        └── source-note.pdf
```

Add resource metadata rather than encoding attribution into alt text:

```yaml
resources:
  - src: "plate-01.jpg"
    params:
      alt: "Three numbered switches on a fictional control panel"
      caption: "Panel after the second repair."
      rights:
        creator: "Example Workshop"
        source: "Drawer 4"
        licence: "Example open archive licence"
        permission: "Private clearance record"
```

`permission` is administrative and does not render publicly. Confirm that each
download still has a stable URL, useful link text and an appropriate public
source or licence. Repair references to files that are no longer being
published.

## 7. Replace theme-specific markup

Search the source content for old shortcodes, raw HTML, CSS classes and
JavaScript embeds:

```sh
rg '{{[<%]|class=|<script|<iframe' content
```

Replace layout-only raw HTML with ordinary Markdown where possible. Use No Fate
shortcodes only for structures that need several semantic parts, such as
artefacts, contact sheets or timelines. Verify that the page remains complete
with JavaScript disabled.

Map legacy taxonomies to the downstream site's configured tags and topics.
Review menu definitions, homepage selections, section RSS outputs and search
exclusions rather than copying the previous theme's configuration wholesale.

## 8. Migrate formal records separately

Do not paste a large bibliography or project index into a page if it is already
structured data. Convert it to the documented record schema, validate IDs and
render it through the optional structured-record subsystem.

Keep real record data in the downstream repository. The theme's 200-entry data
file is a fictional test fixture and must not be adapted into a real person's
record.

## 9. Apply the public-content boundary

Review every `keep`, `revise` and `merge` decision for privacy, consent,
accuracy and current relevance. Do not migrate by default:

- old addresses, private contact details or superseded roles;
- private correspondence, evaluations or disputes;
- confidential client, participant, employee or contract information;
- obsolete instructions presented as current;
- uncurated widget, analytics or plugin output;
- duplicate biographies or records;
- third-party media without a documented right to republish;
- claims that omit collaborators, sources or later maintainers.

Add a clear source or editorial note where a recollection is personal rather
than a complete organisational history.

## 10. Validate before cut-over

Run both draft and production builds:

```sh
hugo --buildDrafts --panicOnWarning --gc --cleanDestinationDir
hugo --minify --panicOnWarning --gc --cleanDestinationDir
```

Check:

- every inventory row has a resolved decision;
- retained URLs still exist;
- changed URLs redirect and carry the intended canonical URL;
- dates, update notes, authors and summaries are accurate;
- images have meaningful alt text, separate captions and public attribution;
- downloads, external links, RSS, search, taxonomies, sitemap and robots output
  are correct;
- the homepage remains coherent when optional modules are absent;
- light, dark, mobile, keyboard, 200 per cent zoom and A4 print checks pass;
- analytics or embeds were reintroduced only through an explicit decision.

Deploy to a preview URL, crawl it, and compare representative old and new
pages. Take a backup of the current production deployment before changing the
public origin.

## 11. Cut over and monitor

Deploy the pinned revision, purge caches only when required, then verify:

- the home page and one page in each active mode;
- the highest-value retained URLs and downloads;
- a representative alias and any host-level permanent redirect;
- RSS, search, sitemap and 404 behaviour;
- canonical and social metadata on the public origin.

Keep the migration inventory after launch. It is the redirect register and the
audit trail for future editorial decisions.

## Rollback

Define rollback before cut-over. It should identify the last known-good
deployment, the previous theme pin, any hosting redirect configuration and the
person authorised to restore them. Roll back the deployment as a unit; do not
mix old templates with partially migrated front matter.
