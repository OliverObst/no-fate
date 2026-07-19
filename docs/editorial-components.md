# Editorial components and Markdown hooks

No Fate keeps ordinary prose as ordinary Markdown. Shortcodes are reserved for
structures with several semantic parts; render hooks improve the Markdown
elements authors already use.

## Shortcodes

### Poster

```md
{{</* poster tone="signal" size="large" title="Build the awkward thing" level="2" */>}}
A tool should reveal its assumptions.
{{</* /poster */>}}
```

`tone` accepts `signal`, `alert`, `inverse` or `quiet`. `size` accepts `small`,
`medium` or `large`. Set `level` from `2` to `6`, or use `none` when the title
is deliberately not a heading. The claim remains normal text in document
order and the component prints as a bordered, ink-only block.

### Question and aside

```md
{{</* question as="aside" */>}}
What problem is this system actually solving?
{{</* /question */>}}

{{</* aside kind="technical" label="Calibration note" */>}}
The room is part of the measurement.
{{</* /aside */>}}
```

A question may render as an `aside` or labelled `section`. Aside kinds are
`context`, `memory`, `technical` and `source`. Indented desktop asides return
to the ordinary reading column on narrow screens.

### Pull quote

```md
{{</* pullquote cite="Notice above the sink" */>}}
If nobody can repair it, it is only borrowing your time.
{{</* /pullquote */>}}
```

The shortcode emits the supplied quotation once. It does not add a hidden copy
for layout, so assistive technology does not encounter duplicate content.

### Image spread

`image-spread` accepts `src`, `src2` and `src3`, with corresponding `alt`,
`alt2` and `alt3` values. Optional individual captions use `image_caption`,
`caption2` and `caption3`; `caption` is shared.

Layouts are `single-wide`, `pair`, `triptych` and `asymmetric`. Asymmetric and
multi-column arrangements become a simple vertical sequence on mobile.

### Contact sheet

Use a leaf bundle and put alt text and optional captions in page-resource
metadata:

```yaml
resources:
  - src: "plates/*.png"
    params:
      alt: "Numbered instrument panel with two red switches"
      caption: "Panel after the third repair."
```

```md
{{</* contact-sheet glob="plates/*.png" columns="3" numbers="true"
  captions="visible" crop="fill" download="true" */>}}
```

`resources` may instead contain a comma-separated list of resource names.
Columns range from two to six. Caption modes are `visible`, `alt` and `none`;
alt text remains mandatory in every mode. `fit` preserves the complete image,
while `fill` uses a consistent crop. Arrow-key navigation is an optional
enhancement and all links remain usable without JavaScript.

Page-resource captions may also display the public `creator`, `source` and
`licence` fields from structured rights metadata. Administrative `permission`
notes are deliberately private and never render.

### Artefact and timeline

`artefact` supports number, title, date, location, creator, source,
rights/licence, image, downloadable file or link, description, significance
and transcription. Image alt text is mandatory.

Timeline content must be an ordered Markdown list. It remains a complete,
chronological list without JavaScript.

### Proposition

`proposition` accepts a downstream proposition `id`. Place it near the end of
an argument. No Fate also renders page propositions in the article footer; it
does not turn them into title-side badges.

## Markdown render hooks

- Standalone images resolve page resources before global assets, emit
  dimensions, responsive native and WebP source sets, and preserve GIFs
  without conversion. Titles become captions. Resource metadata or Markdown
  attributes may provide figure numbers, credit, source and structured rights.
- Layout classes are `wide` and `full`. Treatment classes are `raw`,
  `monochrome` (or `mono`), `high-contrast`, `halftone`, `photocopy`,
  `technical` and `duotone`. True halftone and photocopy effects use a prepared
  derivative instead of destructively simulating evidence in CSS. Set
  `dark-src` and `light-src` attributes, or the equivalent resource
  parameters, for deliberate theme variants.
- Empty image descriptions require `decorative=true`; otherwise validation
  warns and `--panicOnWarning` fails the build.
- Block quotes accept `kind`, `cite` and `cite-url` attributes. Normal long
  quotations stay readable rather than inheriting poster treatment.
- External web links receive a quiet dotted underline, accessible external
  context and an appropriate `rel` value.
- Heading anchors have a visible hover/focus target but no text node to pollute
  copied heading text.
- Tables scroll within a labelled region on narrow screens and print without
  clipping. Add `{sortable=true}` below a table for an accessible client-side
  sorting enhancement; semantic headers and original row order remain intact
  without JavaScript.

The example page at
`exampleSite/content/fixtures/structural-components/index.md` exercises every
component and render hook in clean, wild, dark, mobile and print contexts.
See [Images and rights](images-and-rights.md) for image configuration,
derivative metadata and the public/private attribution contract.
