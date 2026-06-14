const today = new Date();
const fmt = d => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const todayStr = fmt(today);
const tomorrowStr = fmt(new Date(today.getTime() + 86400000));
const nextWeekStr = fmt(new Date(today.getTime() + 7 * 86400000));
const nextWeek2Str = fmt(new Date(today.getTime() + 8 * 86400000));
const lastWeekStr = fmt(new Date(today.getTime() - 7 * 86400000));

/**
 * @typedef {Object} EventObject
 * @property {string} id             - slug: {kebab-event-name}-{YYYY-MM-DD}
 * @property {string} name           - event name (sentence case)
 * @property {string} date           - ISO 8601 date string: "2026-06-13"
 * @property {string} startTime      - "HH:MM" 24-hour (e.g. "20:00")
 * @property {string|null} endTime   - "HH:MM" or null
 * @property {string} venueName
 * @property {string} venueAddress
 * @property {string} cost           - "$15" | "$12.50" | "Free"
 * @property {'Social Dancing'|'Group Lesson'|'Workshop'|'Competition'|'Convention'} eventType
 * @property {string[]} fitSignals   - subset of: ["Beginner-friendly","Partner-welcome","Skill level target","Instructor present","Special guest present"]
 * @property {string|null} description
 * @property {string|null} sourceUrl
 * @property {string} contactEmail   - not displayed publicly
 * @property {boolean} isRecurring
 * @property {boolean} isToday       - computed at build time
 * @property {boolean} isPast        - computed at build time
 */

const withFlags = e => ({ ...e, isToday: e.date === todayStr, isPast: e.date < todayStr });

/** @type {EventObject[]} */
const events = [
  {
    id: `tulsa-swing-social-${todayStr}`,
    name: "Tulsa swing social",
    date: todayStr,
    startTime: "20:00",
    endTime: "23:00",
    venueName: "Tulsa Dance Hall",
    venueAddress: "123 Main St, Tulsa, OK 74103",
    cost: "$10",
    eventType: "Social Dancing",
    fitSignals: ["Beginner-friendly", "Partner-welcome"],
    description: "Weekly Friday night social. All levels welcome. Come dance!",
    sourceUrl: "https://example.com/tulsa-swing-social",
    contactEmail: "host@tulsaswing.com",
    isRecurring: true
  },
  {
    id: `intro-to-wcs-${todayStr}`,
    name: "Intro to WCS",
    date: todayStr,
    startTime: "19:00",
    endTime: "20:00",
    venueName: "Tulsa Dance Hall",
    venueAddress: "123 Main St, Tulsa, OK 74103",
    cost: "Free",
    eventType: "Group Lesson",
    fitSignals: ["Beginner-friendly", "Instructor present"],
    description: "Beginner group lesson before the Friday social.",
    sourceUrl: null,
    contactEmail: "host@tulsaswing.com",
    isRecurring: true
  },
  {
    id: `wcs-workshop-${nextWeekStr}`,
    name: "WCS workshop with Jane Smith",
    date: nextWeekStr,
    startTime: "14:00",
    endTime: "17:00",
    venueName: "Studio 918",
    venueAddress: "456 Greenwood Ave, Tulsa, OK 74106",
    cost: "$35",
    eventType: "Workshop",
    fitSignals: ["Skill level target", "Instructor present", "Special guest present"],
    description: "A two-hour workshop focused on connection and musicality with national-level instructor Jane Smith.",
    sourceUrl: "https://example.com/workshop-jane-smith",
    contactEmail: "studio918@example.com",
    isRecurring: false
  },
  {
    id: `tulsa-swing-social-${nextWeekStr}`,
    name: "Tulsa swing social",
    date: nextWeekStr,
    startTime: "20:00",
    endTime: null,
    venueName: "Tulsa Dance Hall",
    venueAddress: "123 Main St, Tulsa, OK 74103",
    cost: "$10",
    eventType: "Social Dancing",
    fitSignals: ["Beginner-friendly", "Partner-welcome"],
    description: "Weekly Friday night social. All levels welcome.",
    sourceUrl: "https://example.com/tulsa-swing-social",
    contactEmail: "host@tulsaswing.com",
    isRecurring: true
  },
  {
    id: `heartland-classic-competition-${nextWeek2Str}`,
    name: "Heartland classic competition",
    date: nextWeek2Str,
    startTime: "09:00",
    endTime: "18:00",
    venueName: "Renaissance Hotel Ballroom",
    venueAddress: "6808 S 107th East Ave, Tulsa, OK 74133",
    cost: "$45",
    eventType: "Competition",
    fitSignals: ["Skill level target"],
    description: "Annual Tulsa-area WCS competition with multiple divisions.",
    sourceUrl: "https://example.com/heartland-classic",
    contactEmail: "director@heartlandclassic.com",
    isRecurring: false
  },
  {
    id: `swing-summit-convention-${nextWeek2Str}`,
    name: "Swing summit convention",
    date: nextWeek2Str,
    startTime: "10:00",
    endTime: "23:59",
    venueName: "Renaissance Hotel Ballroom",
    venueAddress: "6808 S 107th East Ave, Tulsa, OK 74133",
    cost: "$120",
    eventType: "Convention",
    fitSignals: ["Partner-welcome", "Special guest present"],
    description: null,
    sourceUrl: "https://example.com/swing-summit",
    contactEmail: "info@swingsummit.com",
    isRecurring: false
  },
  {
    id: `wcs-mixer-${tomorrowStr}`,
    name: "WCS mixer",
    date: tomorrowStr,
    startTime: "18:00",
    endTime: "21:00",
    venueName: "The Venue",
    venueAddress: "789 Riverside Dr, Tulsa, OK 74103",
    cost: "$5",
    eventType: "Social Dancing",
    fitSignals: ["Beginner-friendly", "Partner-welcome", "Instructor present"],
    description: "Casual Saturday mixer. Coaches on the floor.",
    sourceUrl: null,
    contactEmail: "mixer@tulsaswing.com",
    isRecurring: false
  },
  {
    id: `wcs-fundamentals-${lastWeekStr}`,
    name: "WCS fundamentals class",
    date: lastWeekStr,
    startTime: "19:00",
    endTime: "20:30",
    venueName: "Studio 918",
    venueAddress: "456 Greenwood Ave, Tulsa, OK 74106",
    cost: "$15",
    eventType: "Group Lesson",
    fitSignals: ["Beginner-friendly", "Instructor present"],
    description: "Six-week beginner series, week 3 of 6.",
    sourceUrl: null,
    contactEmail: "studio918@example.com",
    isRecurring: true
  },
  {
    id: `tulsa-swing-social-${lastWeekStr}`,
    name: "Tulsa swing social",
    date: lastWeekStr,
    startTime: "20:00",
    endTime: "23:00",
    venueName: "Tulsa Dance Hall",
    venueAddress: "123 Main St, Tulsa, OK 74103",
    cost: "$10",
    eventType: "Social Dancing",
    fitSignals: ["Beginner-friendly", "Partner-welcome"],
    description: "Last week's Friday night social.",
    sourceUrl: "https://example.com/tulsa-swing-social",
    contactEmail: "host@tulsaswing.com",
    isRecurring: true
  }
];

export default events.map(withFlags);
