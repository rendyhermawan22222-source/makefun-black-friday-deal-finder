// Black Friday Hound — the hand-in script (Node 22, standard library only).
//
// The deliverable is the static site in this folder's app/ directory: plain
// files a browser opens at app/index.html (ES modules and CSS, no build
// step), with its 34 deals kept in the site's own files. The site never
// fetches anything over the network; every deal simply links out to the
// store that sells it. This script is the hand-in step: it copies app/ and
// screenshots/ from next to this file into /output and writes
// /output/dossier.json — the summary the judge reads (screenshots, the
// first load's files and bytes, and the source) — using the vendored
// make.fun library. vendor/makefun-frontend.ts must stay untouched: the
// scorer requires dossier.json to be byte-for-byte what its own copy
// produces.
//
// Run it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR takes the place of
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own limits (reference/gate.json). Only text_max_bytes changes
// the bytes; the rest reject an entry the scorer would reject: at most 4
// screenshots and none over 256 KiB; at most 993 files and directories in
// app/ and 16 MiB of app files (app/ is counted next to /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
const dossierOptions = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(join(out, 'dossier.json'), buildDossier(out, dossierOptions));
