import events from './_data/events.mock.js';

const byDateAndTime = (a, b) => {
  const dateCmp = a.date.localeCompare(b.date);
  return dateCmp !== 0 ? dateCmp : a.startTime.localeCompare(b.startTime);
};

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addCollection('events', () =>
    [...events].sort(byDateAndTime)
  );

  eleventyConfig.addCollection('todayEvents', () =>
    events.filter(e => e.isToday).sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  eleventyConfig.addCollection('upcomingEvents', () =>
    events.filter(e => !e.isPast).sort(byDateAndTime)
  );

  eleventyConfig.addCollection('pastEvents', () =>
    events.filter(e => e.isPast).sort(byDateAndTime).reverse()
  );

  eleventyConfig.addFilter('formatDate', dateStr => {
    const d = new Date(dateStr + 'T00:00:00');
    const opts = { weekday: 'long', month: 'long', day: 'numeric' };
    if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
    return d.toLocaleDateString('en-US', opts);
  });

  eleventyConfig.addFilter('formatTime', timeStr => {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  });

  eleventyConfig.addFilter('formatDateShort', dateStr => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  eleventyConfig.addFilter('eventTypeToKebab', type =>
    type.toLowerCase().replace(/\s+/g, '-')
  );

  eleventyConfig.addFilter('fitSignalToKebab', signal =>
    signal.toLowerCase().replace(/\s+/g, '-')
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
