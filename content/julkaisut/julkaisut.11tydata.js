export default {
  layout: "layouts/article.njk",
  tags: ["julkaisu"],
  eleventyComputed: {
    // The feed plugin reads per-entry summaries from `summary`
    summary: (data) => data.description,
  },
};
