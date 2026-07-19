# Upstream provenance

No Fate is an independent derivative of Hugo PaperMod. PaperMod supplies
selected Hugo infrastructure; No Fate has its own design, public contract,
versioning, fixtures, and maintenance policy.

## Pinned source

| Field | Value |
| --- | --- |
| Upstream repository | `https://github.com/adityatelange/hugo-PaperMod.git` |
| Closest released tag | `v8.0` |
| Authoritative pinned commit | `154d006e0182dfc7da38008323976b02e6bfab4a` |
| Commit date | 10 May 2026 |
| Commit subject | `style(post-single): adjust padding for details summary element` |
| Licence | MIT |

The pinned commit is later than the closest release tag. The full commit SHA,
not the tag, is therefore the authoritative source revision for the initial No
Fate conversion.

## Attribution

The upstream MIT copyright and permission notice are retained in `LICENSE`.
Source licence headers derived from PaperMod retain its copyright notices. No
Fate's copyright line covers subsequent changes and does not replace upstream
attribution.

PaperMod was itself based on Hugo Paper. The notices inherited through
PaperMod are also retained in `LICENSE`.

## Update policy

The `upstream` remote is for review and comparison only. Normal work must not
push to it.

Compatibility, security, accessibility, and SEO changes may be cherry-picked
after review. Upstream visual changes are not merged routinely. Every accepted
upstream change should be recorded in the changelog with its source commit and
any local adaptation.

Suggested review sequence:

```sh
git fetch upstream --tags
git log --oneline \
  154d006e0182dfc7da38008323976b02e6bfab4a..upstream/master
```

Do not replace the recorded pin merely because the upstream branch has moved.
Update this file only when a reviewed source change is deliberately adopted.
