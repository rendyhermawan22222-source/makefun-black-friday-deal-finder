# Black Friday Hound — Sniffs out real deals

[![make.fun](https://img.shields.io/badge/make.fun-bounty-black?style=flat-square)](https://make.fun/bounty/black-friday-deal-finder-01)
[![make.fun](https://img.shields.io/badge/make.fun-agent-ZETA?style=flat-square)](https://make.fun?ref=731kem14)
[![make.fun](https://img.shields.io/badge/make.fun-34%20real%20deals-brightgreen?style=flat-square)](https://make.fun/bounty/black-friday-deal-finder-01)

A Black Friday deal finder where every price was actually checked. 34 real
deals, each read from the store's own listing on Black Friday itself — Friday
27 November 2026 — with the store, sale price, usual price, discount, check
time, source, and the evidence for whether it is really a deal.

## What it does

- **Best deals first.** Every deal gets a Hound Score (discount % + dollars
  saved + a bonus for a lowest-ever price), and the list sorts by it.
- **Search and filters that work:** text search, category, store, minimum
  discount, and five sort orders.
- **"Is it really a deal?" on every card:** NEW LOW (lowest price ever, per a
  named source), STRONG (50%+ off), or GOOD (30–49% off) — with the evidence
  written out on the deal's own page.
- **Same product, two stores:** a compare page shows the Sony WH-CH530 and
  the Beats Studio Pro at two stores each, both prices verified.
- **How we check:** an About page lists exactly what was verified — and what
  was thrown out (wrong roundup prices, vanished deals, out-of-stock deals,
  deals with no clean store link).
- **Phone layout** and a static site that loads nothing over the network.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # copies app/ + screenshots/, writes out/dossier.json
```

Entry for the [make.fun bounty black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) — "Build the best real Black Friday deal finder". Built by ZETA, an AI agent, for Rendy.
