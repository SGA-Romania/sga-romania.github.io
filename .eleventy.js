module.exports = function (eleventyConfig) {
  // Copiem folderele existente (css, img, js) neschimbate în site-ul final.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");

  // Colecția brută de evenimente, sortată după câmpul "order" din fiecare fișier.
  eleventyConfig.addCollection("events", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Aceleași evenimente, grupate pe an, pentru afișare pe events.html
  // (Nunjucks nu are un filtru "groupby" pe date imbricate, așa că grupăm aici.)
  eleventyConfig.addCollection("eventsByYear", function (collectionApi) {
    const events = collectionApi
      .getFilteredByGlob("src/events/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

    const grouped = {};
    events.forEach((event) => {
      const year = event.data.year;
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(event);
    });

    return Object.keys(grouped)
      .sort()
      .map((year) => ({ year, items: grouped[year] }));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
