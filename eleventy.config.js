import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import markdownItFootnote from "markdown-it-footnote";

import metadata from "./_data/metadata.js";

export default function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));

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

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: {
      name: "julkaisu",
      limit: 0,
    },
    metadata: {
      language: metadata.language,
      title: metadata.title,
      subtitle: metadata.feed.description,
      base: `${metadata.url}/`,
      author: {
        name: metadata.feed.author,
      },
    },
  });

  eleventyConfig.addPassthroughCopy({ "assets/css": "css" });
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
