const cards = [...document.querySelectorAll('.event-card')];

function readFiltersFromURL() {
  const p = new URLSearchParams(location.search);
  return {
    types:   p.get('type')   ? p.get('type').split(',')   : [],
    signals: p.get('signal') ? p.get('signal').split(',') : [],
    date:    p.get('date')   || ''
  };
}

function writeFiltersToURL(filters) {
  const p = new URLSearchParams();
  if (filters.types.length)   p.set('type',   filters.types.join(','));
  if (filters.signals.length) p.set('signal', filters.signals.join(','));
  if (filters.date)           p.set('date',   filters.date);
  history.pushState(null, '', p.toString() ? `?${p}` : location.pathname);
}

function applyFilters(filters) {
  let visible = 0;
  cards.forEach(card => {
    const typeOk  = !filters.types.length   || filters.types.includes(card.dataset.eventType);
    const sigs    = card.dataset.fitSignals  ? card.dataset.fitSignals.split(',') : [];
    const sigOk   = !filters.signals.length  || filters.signals.some(s => sigs.includes(s));
    const dateOk  = !filters.date            || card.dataset.eventDate === filters.date;
    const show = typeOk && sigOk && dateOk;
    card.hidden = !show;
    if (show) visible++;
  });
  const zero = document.querySelector('.browse-zero-results');
  if (zero) zero.hidden = visible > 0;
}

function collectActiveFilters() {
  return {
    types:   [...document.querySelectorAll('input[name="type"]:checked')].map(el => el.value),
    signals: [...document.querySelectorAll('input[name="signal"]:checked')].map(el => el.value),
    date:    document.querySelector('input[name="date"]')?.value || ''
  };
}

function updateFilterBarLabel(filters) {
  const n   = filters.types.length + filters.signals.length + (filters.date ? 1 : 0);
  const btn = document.querySelector('.filter-bar__toggle');
  const clr = document.querySelector('.filter-bar__clear');
  if (btn) btn.textContent = n ? `filtering › ${n} active` : 'filter events ›';
  if (clr) clr.hidden = n === 0;
}

function restoreCheckboxesFromURL(filters) {
  document.querySelectorAll('input[name="type"]').forEach(el => {
    el.checked = filters.types.includes(el.value);
  });
  document.querySelectorAll('input[name="signal"]').forEach(el => {
    el.checked = filters.signals.includes(el.value);
  });
  const d = document.querySelector('input[name="date"]');
  if (d && filters.date) d.value = filters.date;
}

document.querySelector('.filter-bar__toggle')?.addEventListener('click', function () {
  const panel    = document.getElementById('filter-panel');
  const expanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
});

document.querySelectorAll('input[name="type"], input[name="signal"], input[name="date"]')
  .forEach(el => el.addEventListener('change', () => {
    const f = collectActiveFilters();
    writeFiltersToURL(f);
    applyFilters(f);
    updateFilterBarLabel(f);
  }));

window.addEventListener('popstate', () => {
  const f = readFiltersFromURL();
  restoreCheckboxesFromURL(f);
  applyFilters(f);
  updateFilterBarLabel(f);
});

document.addEventListener('DOMContentLoaded', () => {
  const f = readFiltersFromURL();
  restoreCheckboxesFromURL(f);
  applyFilters(f);
  updateFilterBarLabel(f);
});
