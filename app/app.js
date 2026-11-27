// Black Friday Hound — the controller.
//
// Routes (hash, so the whole site works from static files):
//   #/            the deal list, with search, filters and sorting
//   #/deal/<id>   one deal, with its evidence
//   #/compare     same product at two stores
//   #/about       how each price was checked
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CHECKED_LABEL, comparisons, deals } from './data.js';
import { SORTS } from './score.js';
import { aboutPage, comparePage, deal, list, missing, rows } from './views.js';
import { discountPct } from './score.js';

const app = document.getElementById('app');
const all = deals.map((d) => ({ ...d, checkedLabel: CHECKED_LABEL }));

const counts = {
  categories: {},
  stores: {},
};
for (const d of all) {
  counts.categories[d.category] = (counts.categories[d.category] || 0) + 1;
  counts.stores[d.store] = (counts.stores[d.store] || 0) + 1;
}

const SORT_LABELS = Object.fromEntries(
  Object.entries(SORTS).map(([k, v]) => [k, v.label]),
);

function filteredDeals(f) {
  const q = f.q.trim().toLowerCase();
  return all
    .filter((d) => (f.cat === '' || d.category === f.cat) && (f.store === '' || d.store === f.store))
    .filter((d) => discountPct(d) >= f.minoff)
    .filter(
      (d) =>
        q === '' ||
        `${d.title} ${d.store} ${d.category} ${d.signal}`.toLowerCase().includes(q),
    )
    .sort(SORTS[f.sort].fn);
}

function readFilters() {
  const form = document.getElementById('controls');
  if (!form) return { q: '', cat: '', store: '', minoff: 0, sort: 'score', sorts: SORT_LABELS };
  const data = new FormData(form);
  return {
    q: String(data.get('q') ?? ''),
    cat: String(data.get('cat') ?? ''),
    store: String(data.get('store') ?? ''),
    minoff: Number(data.get('minoff') ?? 0),
    sort: String(data.get('sort') ?? 'score'),
    sorts: SORT_LABELS,
  };
}

function renderList() {
  const f = readFilters();
  const shown = filteredDeals(f);
  app.innerHTML = list(shown, f, counts);
  const form = document.getElementById('controls');
  const listEl = document.getElementById('deals');
  const countEl = document.getElementById('count');
  const update = () => {
    const g = readFilters();
    const s = filteredDeals(g);
    listEl.innerHTML = rows(s, g.q);
    countEl.textContent = `Showing ${s.length} of ${all.length} deals.`;
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  countEl.textContent = `Showing ${shown.length} of ${all.length} deals.`;
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || '#/';
  const match = hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = all.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | Black Friday Hound`;
    app.innerHTML = found ? deal(found) : missing();
  } else if (hash === '#/compare') {
    document.title = 'Same product, two stores | Black Friday Hound';
    app.innerHTML = comparePage(comparisons);
  } else if (hash === '#/about') {
    document.title = 'How each price was checked | Black Friday Hound';
    app.innerHTML = aboutPage();
  } else {
    document.title = 'Black Friday Hound — real deals, checked today';
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
