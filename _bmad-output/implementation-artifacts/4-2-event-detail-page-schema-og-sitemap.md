---
story_key: 4-2-event-detail-page-schema-og-sitemap
status: not-started
---

# Story 4.2: Event Detail Page, Schema.org, OG Tags, and Sitemap

## Story

As a community dancer or organizer,
I want every event to have a permanent URL with full details, rich social previews, and Google rich result eligibility,
So that events are shareable and discoverable beyond the site itself.

## Acceptance Criteria

**Given** `events/event-detail.njk`, Schema.org blocks, and OG tag blocks are implemented
**When** `npx playwright test event-detail` is run
**Then** ALL event detail tests written in Story 4.1 PASS (green)

**Given** the Eleventy pagination config in `events/event-detail.njk`
**When** the build runs
**Then** one HTML page is generated per event at `events/{id}/index.html`

**And** slug collision is handled: if two events produce the same `{kebab-name}-{YYYY-MM-DD}`, the second gets `-2` appended

**Given** the `{% block schema %}` override
**When** rendered
**Then** it outputs a single `<script type="application/ld+json">` containing valid Schema.org `Event` with all required fields

**Given** the `{% block meta %}` override
**When** rendered
**Then** it outputs `og:title`, `og:description`, `og:image`, `og:url` tags

**Given** `@11ty/eleventy-plugin-sitemap` configured
**When** the build runs
**Then** `_site/sitemap.xml` is generated and `robots.txt` references it

## Tasks / Subtasks

- [ ] Task 1: Install sitemap plugin
  - [ ] 1.1: `npm install @11ty/eleventy-plugin-sitemap --save-dev`
  - [ ] 1.2: Add to `.eleventy.js`:
    ```js
    import sitemapPlugin from '@11ty/eleventy-plugin-sitemap';
    eleventyConfig.addPlugin(sitemapPlugin, {
      sitemap: { hostname: 'https://tulsawcs.com' }
    });
    ```

- [ ] Task 2: Create `events/event-detail.njk`
  - [ ] 2.1: Eleventy pagination front matter:
    ```yaml
    ---
    pagination:
      data: collections.events
      size: 1
      alias: event
    permalink: "events/{{ event.id }}/index.html"
    layout: base.njk
    ---
    ```
  - [ ] 2.2: `{% block schema %}` override with JSON-LD:
    ```njk
    {% block schema %}
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": {{ event.name | dump | safe }},
      "startDate": "{{ event.date }}T{{ event.startTime }}",
      {% if event.endTime %}"endDate": "{{ event.date }}T{{ event.endTime }}",{% endif %}
      "location": {
        "@type": "Place",
        "name": {{ event.venueName | dump | safe }},
        "address": {
          "@type": "PostalAddress",
          "streetAddress": {{ event.venueAddress | dump | safe }}
        }
      },
      {% if event.description %}"description": {{ event.description | dump | safe }},{% endif %}
      "url": "{{ site.baseUrl }}/events/{{ event.id }}/",
      "image": "{{ site.baseUrl }}/assets/images/event-types/{{ event.eventType | eventTypeToKebab }}.jpg"
    }
    </script>
    {% endblock %}
    ```
  - [ ] 2.3: `{% block meta %}` override with OG tags:
    ```njk
    {% block meta %}
    <meta property="og:title" content="{{ event.name }}">
    <meta property="og:description" content="{% if event.description %}{{ event.description | truncate(160) }}{% else %}{{ event.eventType }} at {{ event.venueName }} on {{ event.date | formatDate }}{% endif %}">
    <meta property="og:image" content="{{ site.baseUrl }}/assets/images/event-types/{{ event.eventType | eventTypeToKebab }}.jpg">
    <meta property="og:url" content="{{ site.baseUrl }}/events/{{ event.id }}/">
    <meta property="og:type" content="event">
    {% endblock %}
    ```
  - [ ] 2.4: `{% block content %}` with full event data:
    - `<h1>{{ event.name }}</h1>`
    - Formatted date + time: `{{ event.date | formatDate }} · {{ event.startTime | formatTime }}`
    - End time (if present): ` – {{ event.endTime | formatTime }}`
    - Venue: `{{ event.venueName }}` and `{{ event.venueAddress }}`
    - Cost: `{{ event.cost }}`
    - Event type badge
    - Recurring badge (if `event.isRecurring`)
    - Fit signal chips
    - Description (if present)
    - Source URL: `<a href="{{ event.sourceUrl }}">View organizer page →</a>` — omit entirely if `sourceUrl` is null (per EXPERIENCE.md locked string: "VIEW ORGANIZER PAGE →", omit if no URL)

- [ ] Task 3: Handle slug collision in mock fixture and events.js
  - [ ] 3.1: Confirm the mock fixture has no collisions (events with different names should produce unique slugs)
  - [ ] 3.2: If the `id` field in the mock fixture is already unique, no runtime collision handling is needed at this stage
  - [ ] 3.3: Document the collision rule in `NOTES.md`: append `-2`, `-3` etc. for duplicate slugs (Epic 5 implements this in the real parser)

- [ ] Task 4: Create `robots.txt` at project root
  - [ ] 4.1: Configure Eleventy to passthrough-copy `robots.txt`
  - [ ] 4.2: Content:
    ```
    User-agent: *
    Allow: /
    Sitemap: https://tulsawcs.com/sitemap.xml
    ```

- [ ] Task 5: Run tests and confirm all PASS
  - [ ] 5.1: Run `npm run build` and confirm event detail pages are generated
  - [ ] 5.2: Run `npx playwright test event-detail`
  - [ ] 5.3: Manually paste one event's JSON-LD into Google's Rich Results Test to verify structure (human verification — document result in Completion Notes)
  - [ ] 5.4: Run full suite: `npm test`

## Dev Notes

### Eleventy Pagination for Detail Pages

Eleventy pagination with `size: 1` generates one page per item. The `alias: event` makes the current event available as `event` in the template. The permalink uses `event.id` which is the slug (e.g., `tulsa-swing-social-2026-06-13`).

### JSON-LD String Escaping

Use Nunjucks `| dump` filter to serialize strings into valid JSON string values (adds quotes and escapes special characters). For the full object, build it field by field rather than dumping the entire event object (avoids exposing `contactEmail` and other non-public fields).

### `truncate` Filter

Nunjucks has a built-in `| truncate(length)` filter. Use it for `og:description` to stay within the 160-character recommendation.

### Source URL — Omit Entirely If Null

Per EXPERIENCE.md: "Event detail — no source URL: (omit the link entirely)". Do NOT render `href="null"` or `href="undefined"`. Use `{% if event.sourceUrl %}` guard.

### The `site` Variable

`_data/site.js` (created in Story 1.3) makes `site.baseUrl` available globally in all templates. Use it to build absolute URLs for OG tags and JSON-LD.

### Sitemap Plugin

After building, verify `_site/sitemap.xml` contains entries for all event detail pages and all main views (/, /browse/, /archive/).

### Google Rich Results Test

After implementation, navigate to: https://search.google.com/test/rich-results
Paste the URL (if deployed) or paste the HTML/JSON-LD directly. This is a human verification step — the E2E tests confirm presence and structure but not full schema validity against Google's validator.

## Dev Agent Record

### Implementation Plan

### Debug Log

### Completion Notes

## File List

## Change Log

## Status

not-started
