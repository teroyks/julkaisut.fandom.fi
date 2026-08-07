---
title: Uses
lang: en
description: The tools used to build and publish this site.
layout: layouts/base.njk
---

The toolchain behind this site — how these publications are built and served.

## Content

- Articles written in [Markdown](https://daringfireball.net/projects/markdown/).
- Footnotes via [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote).
- Heading anchors via [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor),
  with Finnish-aware slugs.

## Building

- [Eleventy](https://www.11ty.dev/) (11ty) static site generator, with
  [Nunjucks](https://mozilla.github.io/nunjucks/) templates.
- [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) for
  responsive, optimized images.
- [@11ty/eleventy-plugin-rss](https://www.11ty.dev/docs/plugins/rss/)
  for the Atom feed.

## Typography & design

- [Literata](https://fonts.google.com/specimen/Literata), self-hosted as
  a variable font — a serif designed for long-form screen reading.
- Plain HTML/CSS.
- Finnish-aware hyphenation with `hyphens: auto`.

## Publishing

- Hosted on GitHub Pages, deployed
  automatically with [GitHub Actions](https://github.com/features/actions)
  on every push to `main`.
- No analytics, no cookies, no JavaScript.

---

The /uses idea comes from [uses.tech](https://uses.tech/).
