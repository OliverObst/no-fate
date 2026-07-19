# No Fate demonstration site

This directory is a self-contained Hugo site used to exercise the public theme.
All people, organisations, projects, publications, events, propositions, and
historical claims in it are fictional.

The fixtures are demonstration material, not starter identity. A downstream
site should delete them and provide its own content outside the theme.

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
