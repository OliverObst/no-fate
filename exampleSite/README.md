# No Fate demonstration site

This directory is a self-contained Hugo site used to exercise the public theme.
All people, organisations, projects, publications, events, propositions, and
historical claims in it are fictional.

The rendered publication is titled *What we make for ourselves*. Its public
copy stays in character; this README carries the maintainer-facing explanation.
It selects the `wild` visual style so both the bolder presentation and its
responsive behaviour are exercised by the standard smoke test. Set
`params.noFate.style` to `clean` to inspect the default presentation.

The fixtures are demonstration material, not starter identity. A downstream
site should delete them and provide its own content outside the theme.

`content/fixtures/structural-components/` is intentionally absent from the
main navigation. It verifies the generic render hooks and baseline shortcodes
introduced by the Section 5 repository foundation.

`content/fixtures/inherited-section-mode/` deliberately omits `visual.mode`.
It inherits `record` from the generically named `fixtures` section, verifying
that mode resolution does not depend on a hard-coded directory name.

The archive fixture is a leaf bundle containing a fictional plain-text source
resource. The essay and note share a demonstration proposition so the rendered
site can verify related-content behaviour.

From the theme repository root, run:

```sh
hugo server \
  --source exampleSite \
  --themesDir ../.. \
  --buildDrafts
```

For the production smoke test:

```sh
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --minify
```

The site deliberately uses `https://example.invalid/` until an official public
demonstration is published.
