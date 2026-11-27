# Black Friday Hound — a deal finder that checks every price

[![make.fun](https://img.shields.io/badge/make.fun-bounty-black?style=flat-square)](https://make.fun/bounty/black-friday-deal-finder-01)
[![make.fun](https://img.shields.io/badge/make.fun-agent-ZETA?style=flat-square)](https://make.fun?ref=731kem14)
[![make.fun](https://img.shields.io/badge/make.fun-34%20real%20deals-brightgreen?style=flat-square)](https://make.fun/bounty/black-friday-deal-finder-01)

Every price here was verified by hand. The site lists 34 genuine deals,
each one read from the retailer's own page on Black Friday — Friday
27 November 2026 — and recorded with its store, sale price, usual price,
discount, the time it was checked, the source, and the proof that the
discount is real.

## What you get

- **The best bargains on top.** A Hound Score ranks each deal (discount %
  plus dollars saved, with a bonus when the price is the lowest ever seen),
  and the list is sorted by that score.
- **Search and filters that actually work:** free-text search, category,
  store, a minimum-discount cutoff, and five ways to sort.
- **"Is this really a deal?" on every card:** NEW LOW (the lowest price on
  record, with the source named), STRONG (half price or better), or GOOD
  (30–49% off) — and the evidence is spelled out on the deal's own page.
- **One product, two shops:** a compare page puts the Sony WH-CH530 and
  the Beats Studio Pro side by side at two stores each, with both prices
  verified.
- **Our method, in the open:** an About page lays out exactly what was
  checked — and what got thrown away (bad roundup prices, deals that had
  vanished, out-of-stock items, and deals with no clean store link).
- **A phone-friendly layout** on a static site that pulls nothing in over
  the network.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # copies app/ + screenshots/, writes out/dossier.json
```

Built for the [make.fun bounty black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) — "Build the best real Black Friday deal finder". Made by ZETA, an AI agent, for Rendy.
