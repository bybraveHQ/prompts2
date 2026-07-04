# @bybrave/prompts2

[![CI](https://github.com/bybraveHQ/prompts2/actions/workflows/ci.yml/badge.svg)](https://github.com/bybraveHQ/prompts2/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@bybrave/prompts2.svg)](https://www.npmjs.com/package/@bybrave/prompts2)
[![node](https://img.shields.io/node/v/@bybrave/prompts2.svg?color=339933&logo=node.js&logoColor=white)](https://www.npmjs.com/package/@bybrave/prompts2)
[![types](https://img.shields.io/badge/types-included-3178C6?logo=typescript&logoColor=white)](index.d.ts)
[![license](https://img.shields.io/npm/l/@bybrave/prompts2.svg?color=blue)](LICENSE)

Maintained fork of [prompts](https://github.com/terkelg/prompts) — lightweight, beautiful and user-friendly interactive prompts for the terminal.

## Why this fork

The original `prompts` has not been released since 2021 while very real papercuts kept piling up. This fork is a drop-in replacement that fixes them:

| Change | Upstream issue |
|---|---|
| **Ctrl+C terminates the process** (re-raises SIGINT after restoring the terminal) instead of silently continuing with partial answers; opt out with `exitOnCtrlC: false` | [#252](https://github.com/terkelg/prompts/issues/252) |
| **Cancelling a prompt no longer hangs the process**: tearing down readline from inside its own keypress event left stdin in a state that kept the event loop alive forever | [#87](https://github.com/terkelg/prompts/issues/87) |
| **Native ESM entry point**: `import prompts from '@bybrave/prompts2'` works without interop warnings | [#393](https://github.com/terkelg/prompts/issues/393) |
| Types wired into the `exports` map, so TypeScript resolves them under `node16`/`bundler` resolution | [#388](https://github.com/terkelg/prompts/issues/388) |
| Modernized: Node ≥ 18, tests on `node:test` (zero test deps), CI on Node 18/20/22 | — |

## Install

```sh
npm install @bybrave/prompts2
```

## Usage

```js
const prompts = require('@bybrave/prompts2');
// or: import prompts from '@bybrave/prompts2';

const response = await prompts({
  type: 'number',
  name: 'value',
  message: 'How old are you?',
  validate: (value) => (value < 18 ? 'Nightclub is 18+ only' : true),
});

console.log(response.value);
```

All 12 prompt types (`text`, `password`, `invisible`, `number`, `confirm`, `list`, `toggle`, `select`, `multiselect`, `autocompleteMultiselect`, `autocomplete`, `date`), chaining, dynamic prompts, `onState`/`onRender`, `inject` and `override` work exactly as documented in the [original README](https://github.com/terkelg/prompts#readme) — the API is unchanged.

## Ctrl+C behaviour

Pressing Ctrl+C now cleans up the terminal (cursor restored, raw mode off) and re-raises `SIGINT`, so your process terminates — or your own `SIGINT` handler runs. This is what users expect from a CLI and what the upstream maintainer planned for the next major.

To keep the old soft-cancel behaviour (prompt aborts, program continues via `onCancel`) for a specific question:

```js
const response = await prompts({
  type: 'confirm',
  name: 'ok',
  message: 'Continue?',
  exitOnCtrlC: false,
});
```

Esc and Ctrl+D remain soft cancels in both modes.

## Migrating from prompts

```diff
- const prompts = require('prompts');
+ const prompts = require('@bybrave/prompts2');
```

Breaking changes vs `prompts@2`:

- Ctrl+C terminates the process by default (opt out per question with `exitOnCtrlC: false`)
- Node ≥ 18 required
- The legacy `dist/` build for Node 6 was removed

## Support

If this package saves you time, you can support maintenance:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-buy%20me%20a%20coffee-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/bybrave)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BTC-F7931A?logo=bitcoin&logoColor=white)](#support)

Bitcoin (BTC): `bc1q37557q5jpeaxqydzwvf3jgj7zhnfpn2td3q40q`

## Credits & license

MIT. Based on [prompts](https://github.com/terkelg/prompts) by Terkel Gjervig.
