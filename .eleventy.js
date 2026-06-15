import 'dotenv/config';

const byDateAndTime = (a, b) => {
  const dateCmp = a.date.localeCompare(b.date);
  return dateCmp !== 0 ? dateCmp : a.startTime.localeCompare(b.startTime);
};

export default async function(eleventyConfig) {
  eleventyConfig.ignores.add("_bmad-output/**");
  eleventyConfig.ignores.add(".claude/**");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Set USE_MOCK_DATA=true in .env for local dev without credentials.
  // Omit (or set to anything other than 'true') to use real Google Sheets data.
  const useMockData = process.env.USE_MOCK_DATA === 'true';
  let eventsModule;
  try {
    eventsModule = useMockData
      ? (await import('./_data/events.mock.js')).default
      : (await import('./_lib/events.js')).default;
  } catch (e) {
    throw new Error(`Failed to load events module: ${e.message}`);
  }
  const events = typeof eventsModule === 'function' ? await eventsModule() : eventsModule;

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

  eleventyConfig.addFilter('fitSignalsToKebab', signals =>
    signals.map(s => s.toLowerCase().replace(/\s+/g, '-')).join(',')
  );

  eleventyConfig.addFilter('eventTzOffset', dateStr => {
    const d = new Date(dateStr + 'T12:00:00');
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    }).formatToParts(d);
    const tzName = parts.find(p => p.type === 'timeZoneName')?.value;
    return tzName === 'CST' ? '-06:00' : '-05:00';
  });

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
