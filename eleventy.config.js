import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import rssPlugin from "@11ty/eleventy-plugin-rss";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";

// When an article appeared on the site. Falls back to its publication date so
// that an article missing the field still lands somewhere sensible in the feed.
const addedDate = (item) => item.data.added ?? item.date;

export default function (eleventyConfig) {
  // Heading ids so articles can link to their own chapters (table of contents).
  // The default transliteration is German (ä → ae); Finnish drops the umlauts.
  const finnishReplacements = [
    ["ä", "a"],
    ["Ä", "A"],
    ["ö", "o"],
    ["Ö", "O"],
    ["å", "a"],
    ["Å", "A"],
  ];
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(markdownItFootnote).use(markdownItAnchor, {
      slugify: (s) =>
        eleventyConfig.getFilter("slugify")(s, {
          customReplacements: finnishReplacements,
        }),
      // A "#" after each heading, revealed on hover, linking to the heading
      // itself. It is a pointer affordance duplicating the address bar, so it
      // is hidden from assistive tech — and taken out of the tab order to
      // match, since a focusable aria-hidden element is an accessibility bug.
      // Ignored by Pagefind so the symbol stays out of search excerpts.
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        ariaHidden: true,
        placement: "before",
        renderAttrs: () => ({ tabindex: -1, "data-pagefind-ignore": "" }),
      }),
    })
  );

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "auto"],
    widths: [400, 800, 1200],
    svgShortCircuit: true,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 50em) 45em, 100vw",
      },
    },
  });

  // Only the filters (dateToRfc3339, htmlBaseUrl); the feed itself is
  // content/feed.njk, because articles are historical and the plugin's own
  // template orders entries by their original publication date.
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addPassthroughCopy({ "assets/css": "css" });
  eleventyConfig.addPassthroughCopy({ "assets/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy(
    "content/julkaisut/**/*.{jpg,jpeg,png,gif,svg,webp}"
  );

  eleventyConfig.addFilter("formatDate", (date) =>
    new Intl.DateTimeFormat("fi", { dateStyle: "long", timeZone: "UTC" }).format(
      date
    )
  );
  eleventyConfig.addFilter("isoDate", (date) =>
    date.toISOString().split("T")[0]
  );

  // Articles grouped by year, newest first, for the listing page.
  eleventyConfig.addCollection("publicationsByYear", (collectionsApi) => {
    const byYear = new Map();
    const publications = [
      ...collectionsApi.getFilteredByTag("julkaisu"),
    ].reverse();
    for (const publication of publications) {
      const year = publication.date.getUTCFullYear();
      if (!byYear.has(year)) {
        byYear.set(year, []);
      }
      byYear.get(year).push(publication);
    }
    return [...byYear.entries()].map(([year, items]) => ({ year, items }));
  });

  // Articles ordered by when they were added to the site, newest first, for
  // the feed. `date` is an article's original publication date, which for
  // historical material says nothing about when subscribers should hear of it.
  eleventyConfig.addCollection("publicationsByAdded", (collectionsApi) =>
    [...collectionsApi.getFilteredByTag("julkaisu")].sort(
      (a, b) => addedDate(b) - addedDate(a) || b.date - a.date
    )
  );

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
  };
}
