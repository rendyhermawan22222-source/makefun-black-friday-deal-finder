// Black Friday Hound — the sniff test.
//
// Every deal gets a Hound Score (0–100) so the best deals sort first. The
// score is deliberately simple and printed next to each deal, so a shopper
// can see why one deal outranks another:
//
//   score = 0.7 x discount%  +  0.12 x min(dollars saved, 250)  +  8 if NEW LOW
//
// A big percentage cut matters most; a big dollar saving matters too (a $1,200
// TV saving beats a $3 earbud saving); a lowest-ever price earns a bonus.
// The score is capped at 100. Nothing here is hidden: the formula is shown
// on the site under "How the hound scores".

export function discountPct(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

export function houndScore(d) {
  const pct = discountPct(d);
  const dollars = Math.min(saved(d), 250);
  const bonus = d.signal === 'NEW LOW' ? 8 : 0;
  return Math.min(100, Math.round(pct * 0.7 + dollars * 0.12 + bonus));
}

// The signal is stored on each deal in data.js, but the rule that produces it
// lives here, so the site can explain it:
//
//   NEW LOW  — a named source says this is the lowest price ever recorded
//   STRONG   — 50% or more off the usual price
//   GOOD     — 30–49% off
//   ROUTINE  — under 30% off (an ordinary sale, not a Black Friday deal)
export function signalFor(d) {
  if (d.signal === 'NEW LOW') return 'NEW LOW';
  const pct = discountPct(d);
  if (pct >= 50) return 'STRONG';
  if (pct >= 30) return 'GOOD';
  return 'ROUTINE';
}

export const SIGNAL_BLURB = {
  'NEW LOW': 'Lowest price ever recorded — a real record, not just a big cut.',
  STRONG: 'Half price or better off the usual price.',
  GOOD: 'A solid cut — 30–49% off the usual price.',
  ROUTINE: 'An ordinary sale. The hound would not bark for this one.',
};

// Sort orders the list view offers. "Best first" is the default: hound score,
// then biggest discount, then biggest dollar saving.
export const SORTS = {
  score: { label: 'Best first (Hound Score)', fn: (a, b) => houndScore(b) - houndScore(a) || discountPct(b) - discountPct(a) || saved(b) - saved(a) },
  discount: { label: 'Biggest discount %', fn: (a, b) => discountPct(b) - discountPct(a) || saved(b) - saved(a) },
  savings: { label: 'Most dollars saved', fn: (a, b) => saved(b) - saved(a) },
  priceAsc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  priceDesc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
};
