# Images and rights

No Fate treats images as evidence first and decoration second. Page resources
receive responsive processing, explicit intrinsic dimensions and public
attribution; external images remain possible but cannot receive build-time
dimensions or derivatives.

## Responsive processing

Raster page resources in JPEG, PNG or WebP format receive:

- native width candidates;
- a WebP source set;
- the original resource as the fallback;
- explicit width and height;
- asynchronous decoding;
- lazy loading unless the caller identifies a genuine hero.

GIFs retain their original animation and dimensions. SVG resources retain
their original vector data. Configure raster widths and WebP quality:

```toml
[params.noFate.images]
  widths = [480, 800, 1200, 1600]
  webpQuality = 82
```

No Fate never enlarges an image beyond its intrinsic width. Contact sheets use
`crop="fit"` by default. `crop="fill"` is an explicit author decision that
permits a 4:3 `object-fit: cover` thumbnail; it does not alter the original
download.

Homepage and article heroes load eagerly with high fetch priority. Images
inside articles, spreads, contact sheets and artefacts load lazily. A
downstream site should use page bundles whenever layout stability matters.

## Treatments

The supported treatment vocabulary is:

- `raw`;
- `monochrome`;
- `high-contrast`;
- `halftone`;
- `photocopy`;
- `technical`;
- `duotone`.

`raw`, `monochrome`, `high-contrast` and `duotone` have restrained CSS
treatments. `technical` adds a neutral surface and rule without degrading line
work. `halftone` and `photocopy` deliberately apply no destructive browser
filter: supply a prepared derivative instead.

Resource metadata can set a treatment and derivative:

```yaml
resources:
  - src: "diagram.png"
    params:
      treatment: "photocopy"
      derivative_src: "diagram-photocopy.png"
```

A standalone Markdown image can make the same choice:

```markdown
![Diagram showing the repaired circuit](diagram.png "Revised circuit")
{.photocopy derivative-src="diagram-photocopy.png"}
```

This split prevents every historical image being made to look damaged and
preserves the evidential value of originals. Article heroes also honour a
page resource's `derivative_src` while retaining the original resource's
caption and rights metadata.

## Structured rights

Page resources support public attribution and private administrative notes:

```yaml
resources:
  - src: "ledger.jpg"
    params:
      alt: "Open ledger showing three columns of handwritten measurements"
      caption: "Readings recorded after the west gauge was repaired."
      rights:
        creator: "Example Field Unit"
        source: "Cabinet B, folder 12"
        source_url: "https://example.invalid/archive/folder-12/"
        licence: "Example open archive licence"
        permission: "Private clearance note for maintainers"
```

Captions may render `creator`, `source`, `source_url` and `licence`.
`permission` is never read by a public template and therefore cannot leak into
generated HTML, feeds or search. Alt text remains a description of the image;
caption and rights fields carry context and attribution.

Structured rights work in article heroes, Markdown figures, image spreads and
contact sheets. Legacy `credit`, `source`, `source_url` and `licence` fields
remain supported while sites migrate.
