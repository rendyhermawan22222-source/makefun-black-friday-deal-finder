// Black Friday Hound — the HTML for each page, built from the deal data.
// Every value is escaped before it reaches the page. Views never fetch
// anything: all data comes from data.js, all styling from style.css.

import { discountPct, houndScore, saved, SIGNAL_BLURB } from './score.js';

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const signalClass = (s) => `signal signal-${s.toLowerCase().replace(' ', '-')}`;

function signalBadge(d) {
  return `<span class="${signalClass(d.signal)}" title="${escape(SIGNAL_BLURB[d.signal] || '')}">${escape(d.signal)}</span>`;
}

function card(d) {
  return `<li class="card">
  <a class="card-title" href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a>
  <p class="card-store">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="card-price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s>
    <span class="card-off">${discountPct(d)}% off &middot; save ${usd(saved(d))}</span></p>
  <p class="card-meta">${signalBadge(d)} <span class="score">Hound ${houndScore(d)}/100</span></p>
  <p class="card-checked">Checked ${escape(d.checkedLabel)} &middot; ${escape(d.source)}</p>
  <p class="card-actions"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">Buy at ${escape(d.store)} &nearr;</a>
  <a class="btn btn-ghost" href="#/deal/${encodeURIComponent(d.id)}">Why it&rsquo;s real</a></p>
</li>`;
}

export function rows(deals, query) {
  const q = query.trim().toLowerCase();
  const shown = deals.filter(
    (d) =>
      q === '' ||
      `${d.title} ${d.store} ${d.category} ${d.signal}`.toLowerCase().includes(q),
  );
  if (shown.length === 0)
    return '<li class="empty">No deal matches. Try a shorter word, or clear a filter.</li>';
  return shown.map(card).join('');
}

export function list(deals, filters, counts) {
  const cats = Object.keys(counts.categories).sort();
  const stores = Object.keys(counts.stores).sort();
  return `<h1>34 real deals, checked today.</h1>
<p class="lede">Every price below was read from the store&rsquo;s own listing on Black Friday, Friday 27 November 2026. No roundup prices, no guesses — and two prices a roundup got wrong were corrected on the live listing before they made it in. Best deals first, by Hound Score.</p>
<form class="controls" id="controls">
  <label>Search <input type="search" name="q" value="${escape(filters.q)}" placeholder="headphones, TV, LEGO&hellip;" autocomplete="off"></label>
  <label>Category <select name="cat"><option value="">All categories</option>${cats
    .map(
      (c) =>
        `<option value="${escape(c)}"${filters.cat === c ? ' selected' : ''}>${escape(c)} (${counts.categories[c]})</option>`,
    )
    .join('')}</select></label>
  <label>Store <select name="store"><option value="">All stores</option>${stores
    .map(
      (s) =>
        `<option value="${escape(s)}"${filters.store === s ? ' selected' : ''}>${escape(s)} (${counts.stores[s]})</option>`,
    )
    .join('')}</select></label>
  <label>At least <select name="minoff"><option value="0">any discount</option>${[30, 40, 50, 60]
    .map(
      (n) =>
        `<option value="${n}"${filters.minoff === n ? ' selected' : ''}>${n}% off</option>`,
    )
    .join('')}</select></label>
  <label>Sort <select name="sort">${Object.entries(filters.sorts)
    .map(
      ([key, label]) =>
        `<option value="${escape(key)}"${filters.sort === key ? ' selected' : ''}>${escape(label)}</option>`,
    )
    .join('')}</select></label>
</form>
<p class="count" id="count"></p>
<ul class="deals" id="deals">${rows(deals, filters.q)}</ul>
<section class="how">
  <h2>How the hound scores</h2>
  <p>Hound Score = 0.7 &times; discount% + 0.12 &times; dollars saved (capped at $250) + 8 if it is a lowest-ever price. A <strong>NEW LOW</strong> means a named source says the price is the lowest ever recorded. <strong>STRONG</strong> is half price or better; <strong>GOOD</strong> is 30–49% off. Every deal shows its evidence — the hound shows its work.</p>
  <p><a href="#/compare">Same product, two stores — who is cheaper?</a> &middot; <a href="#/about">How each price was checked</a></p>
</section>`;
}

export function deal(d) {
  const alt = d.alt
    ? `<p class="alt">Also at <a href="${escape(d.alt.url)}" target="_blank" rel="noopener">${escape(d.alt.store)} for ${usd(d.alt.price)}</a> — ${d.price < d.alt.price ? `this store is ${usd(d.alt.price - d.price)} cheaper.` : `this store is ${usd(d.price - d.alt.price)} cheaper.`}</p>`
    : '';
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${escape(d.title)}</h1>
  <p class="detail-store">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="detail-price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s>
    <span class="card-off">${discountPct(d)}% off &middot; save ${usd(saved(d))}</span></p>
  <p class="detail-meta">${signalBadge(d)} <span class="score">Hound ${houndScore(d)}/100</span></p>
  <h2>Is it really a deal?</h2>
  <p class="evidence">${escape(d.evidence)}</p>
  ${d.note ? `<p class="note">${escape(d.note)}</p>` : ''}
  ${alt}
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Checked</dt><dd>${escape(d.checkedLabel)}</dd>
    <dt>Source</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">Buy at ${escape(d.store)} &nearr;</a></p>
</article>`;
}

export function comparePage(comparisons) {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<h1>Same product, two stores.</h1>
<p class="lede">One product, two prices, both checked on 27 November 2026. The cheaper store wins the bone.</p>
${comparisons
  .map((c) => {
    const winner = c.a.price <= c.b.price ? 'a' : 'b';
    const row = (side, x) =>
      `<div class="vs-side${winner === side ? ' winner' : ''}">
        <p class="vs-store">${escape(x.store)}${winner === side ? ' <span class="bone">wins</span>' : ''}</p>
        <p class="vs-price">${usd(x.price)}</p>
        ${x.url ? `<p><a class="btn" href="${escape(x.url)}" target="_blank" rel="noopener">Buy at ${escape(x.store)} &nearr;</a></p>` : `<p class="vs-nolink">Price cited from DealNews — no direct store link on file.</p>`}
      </div>`;
    return `<section class="vs">
      <h2>${escape(c.title)}</h2>
      <div class="vs-grid">${row('a', c.a)}<p class="vs-mid">vs</p>${row('b', c.b)}</div>
      <p class="vs-note">${escape(c.note)}</p>
    </section>`;
  })
  .join('')}`;
}

export function aboutPage() {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<h1>How each price was checked</h1>
<p class="lede">A deal finder is only as honest as its prices. Here is exactly what happened on Friday 27 November 2026, Black Friday itself.</p>
<h2>What was checked</h2>
<p>Every deal on this site was read from the store&rsquo;s own listing that day — Best Buy, Walmart, Target, Home Depot, Sony, JBL, Skullcandy and Amazon — or from a price-history record (CamelCamelCamel, Keepa, pricehistory.app) of that listing. Each card shows the store, the sale price, the usual price, when it was checked, and the source.</p>
<h2>What was thrown out</h2>
<ul class="plain">
  <li><strong>Wrong roundup prices.</strong> A deal site listed a TCL soundbar at $64.99; the live Best Buy listing showed $69.99. A charger listed at $19.99 was $51.58 live. Both were corrected to the live price — or dropped.</li>
  <li><strong>Vanished deals.</strong> A headphone listed at $88 in a roundup was $178 on the live store page. The deal had ended; it is not on this site.</li>
  <li><strong>Out-of-stock deals.</strong> A LEGO set at half price was out of stock everywhere it was listed. It is not on this site.</li>
  <li><strong>Deals without a link.</strong> A baby monitor and a streaming stick had verified prices but no clean store link. They were dropped rather than listed without a way to buy.</li>
  <li><strong>Stale aggregator prices.</strong> One aggregator&rsquo;s prices were wrong more often than right, so every one of its prices was re-checked live before it was trusted.</li>
</ul>
<h2>The signal</h2>
<p><strong>NEW LOW</strong> is only used where a named source says the price is the lowest ever recorded. <strong>STRONG</strong> means 50% or more off. <strong>GOOD</strong> means 30–49% off. The evidence for each signal is written on the deal&rsquo;s own page.</p>
<h2>What this site is not</h2>
<p>It does not fetch live prices — it is a snapshot of prices checked on 27 November 2026, and it says so on every card. Prices move; check the store link before you buy. No price on this site was invented, and no deal was copied from another roundup without re-checking it.</p>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
