# Changelog

This is a maintained fork of [terkelg/prompts](https://github.com/terkelg/prompts).

## 3.0.0 — 2026-07-05

### Added

- ESM entry point (`index.mjs`) and an `exports` map with proper TypeScript types resolution (#388).

### Fixed

- Ctrl+C now restores the terminal and re-raises `SIGINT` so the process exits as expected; opt out with `exitOnCtrlC: false`. Esc and Ctrl+D perform a soft cancel (#252, #393).
- Fixed the hang when cancelling a prompt. The readline teardown was being triggered from inside its own keypress event; the listener is now removed synchronously and teardown is deferred via `setImmediate` (#87).
