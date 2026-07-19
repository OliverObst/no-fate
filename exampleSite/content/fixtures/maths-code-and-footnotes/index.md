---
title: "The Arithmetic of Borrowed Umbrellas"
subtitle: "Equations, executable-looking nonsense and notes underneath the notes."
date: 2026-04-20
lastmod: 2026-07-19
summary: "A long-form article testing native MathML, fenced code, inline code and multiple footnotes."
hiddenInHomeList: true
utility: true
robotsNoIndex: true
demo: true
math: true

content:
  format: "essay"
  status: "published"
  media_type: "working paper"
  collection: "Kettle Observatory methods"

editorial:
  proposition: []
  series: "Unhelpful proofs"
  issue: "Umbrella number"
  featured: false

visual:
  mode: "editorial"
  accent: "signal"
  headline_scale: "large"
  opening_alignment: "left"
  hero: ""
  hero_alt: ""
  hero_treatment: "raw"
  invert_opening: false

archive:
  start_year: null
  end_year: null
  locations: []
  people: []

seo:
  description: "A long-form article testing native MathML, fenced code, inline code and multiple footnotes."
  image: ""
  canonical: ""
---

The umbrella register assumes that weather is countable. This is already a
mistake, but it is a productive one.[^register] Let \(u\) be the number of
umbrellas left by the door and \(p\) the number of people who insist they
brought one.

## A needlessly formal model

The committee defines the **coefficient of suspicious dryness** as:

\[
D = \frac{u - p}{r + 1}
\]

where \(r\) is the number of recent showers. Adding one prevents division by
zero and, more importantly, gives drizzle somewhere to sit.

For a corridor containing \(n\) cupboards, the predicted search effort becomes:

$$
E(n) = \sum_{k=1}^{n} \left(k^2 + \frac{D}{k}\right)
$$

The result has no recognised unit. We record it in **drawer-minutes**.[^units]

## The implementation nobody requested

The following JavaScript turns observations into a verdict while carefully
preserving the original uncertainty:

```javascript
export function classifyUmbrellas({ umbrellas, people, showers }) {
  const dryness = (umbrellas - people) / (showers + 1);

  if (dryness > 2) return "the corridor is collecting weather";
  if (dryness < 0) return "somebody has borrowed tomorrow";
  return "make tea and measure again";
}
```

The same rule can be configured without pretending it is universal:

```toml
[umbrella_register]
unit = "drawer-minute"
repeat_after_tea = true
maximum_confidence = 0.63
```

Inline code such as `repeat_after_tea = true` should remain distinct from the
sentence around it, even when that sentence contains \(D \approx 0.5\).

## Result

After three showers, four observers and nine umbrellas, \(D = 1.25\). The
official conclusion is therefore: **make tea and measure again**. This agrees
with the independent kettle test, although the kettle test agrees with
everything after 4 pm.[^kettle]

[^register]: The register is fictional, but its confidence is uncomfortably authentic.
[^units]: One drawer-minute is the time required to open the wrong drawer, inspect it carefully and close it as though that had been the plan.
[^kettle]: The kettle was not calibrated. It was, however, present.
