export default function (eleventyConfig) {
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
