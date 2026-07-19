# Homepage and section behaviour

## Editorial homepage

The homepage is an ordered sequence of optional modules:

- `opening`
- `featured_argument`
- `questions`
- `featured_archive`
- `selected_writing`
- `visual_interruption`
- `current_work`
- `formal_record`

Configure order site-wide under `params.noFate.home.modules`, or override it in
home front matter:

```yaml
home:
  modules:
    - opening
    - featured_argument
    - visual_interruption
    - questions
    - formal_record
```

Selections use paths rather than section names:

```yaml
opening:
  headline: "The ordinary deserves a second look."
  deck: "Arguments, evidence and useful interruptions."
  image: "images/opening.jpg"
  image_alt: "Notebooks and measuring instruments on a work table"

featured_argument: "/writing/reveal-the-assumptions/"
featured_archive: "/collections/tide-room-ledgers/"

questions:
  - "/questions/what-are-we-optimising/"

selected_writing:
  - "/writing/maintenance-is-a-design-material/"

visual_interruption:
  image: "images/field-archive.jpg"
  image_alt: "Contact sheets pinned in two uneven rows"
  caption: "Field archive, Tuesday."

current_projects:
  - "/work/lantern-index/"

formal_record: "/record/"
```

Every module disappears completely when it has no selected or discoverable
content. One question receives a single large treatment instead of leaving
empty grid columns. There are no “coming soon” cards.

Set `params.noFate.strictHomeSelections = true` to fail production builds on a
missing or unpublished selected path. Development builds quietly omit that
selection. The default automatic fallbacks still find featured pages,
questions, archive material, projects and the first record section by
namespaced content fields rather than directory names.

## Generic section lists

All section pages use reverse chronological order. A section may put featured
items first and rename its index:

```yaml
listing:
  featured_first: true
  index_label: "Writing, newest first"
```

The first entry on page one uses `lead` density, ordinary entries use
`standard`, and notes default to `compact`. A page can override this with
`editorial.density`.

Writing navigation is configured rather than hard-coded:

```yaml
listing:
  links:
    - { label: "Essays", url: "/essays/" }
    - { label: "Questions", url: "/questions/" }
    - { label: "Notes", url: "/notes/" }
    - { label: "Topics", url: "/topics/" }
    - { label: "Propositions", url: "/propositions/" }
```

## Derived filters

Sections may derive progressive filters from any front matter parameter:

```yaml
listing:
  filter_fields:
    - { id: "place", label: "Places", param: "archive.locations" }
    - { id: "medium", label: "Media", param: "content.media_type" }
    - { id: "collection", label: "Collections", param: "content.collection" }
```

Labels, parameter paths and section paths belong to the downstream site. No
Fate does not embed archive-specific field names in the generic list template.
The form is revealed only when JavaScript is available; without it the complete
chronological index remains visible.

An archive may select a featured item:

```yaml
listing:
  featured: "/collections/tide-room-ledgers/"
  featured_label: "Open this box first"
```

Archive entries show date ranges, locations, sources and rights when supplied.
Project entries may expose status, media and collection metadata while linking
to an external canonical project description from ordinary content. Record and
About sections use the same generic shell and do not assume a CV, institutional
role or academic affiliation.

Search, all-items archives, filters and dense record tables share the record
typography and print rules. Every section and homepage module remains usable at
320 px and without JavaScript.
