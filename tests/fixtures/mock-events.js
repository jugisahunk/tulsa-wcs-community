import mockEvents from '../../_data/events.mock.js';

export { mockEvents };

export function getEventByType(type) {
  return mockEvents.find(e => e.eventType === type);
}
