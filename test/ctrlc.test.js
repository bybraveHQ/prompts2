'use strict';

// Tests for the Ctrl+C behaviour added in prompts2 (upstream #252) and for
// prompt cancellation not hanging the process (upstream #87).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const RENDER_DELAY = 500;
const KEY_CTRL_C = '\x03';
const KEY_ESCAPE = '\x1b';

function runFixture(fixture, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [`${__dirname}/fixtures/${fixture}`], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    let stdout = '';

    child.stdout.on('data', (chunk) => { stdout += chunk; });

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`fixture ${fixture} did not exit (hang)`));
    }, 10000);

    child.on('exit', (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal, stdout });
    });

    setTimeout(() => child.stdin.write(input), RENDER_DELAY);
  });
}

test('Ctrl+C re-raises SIGINT and terminates the process by default', async () => {
  const { code, signal } = await runFixture('ctrlc.js', KEY_CTRL_C);

  assert.equal(signal, 'SIGINT');
  assert.equal(code, null);
});

test('Ctrl+C keeps the old soft-cancel behaviour with exitOnCtrlC: false', async () => {
  const { code, signal, stdout } = await runFixture('ctrlc-optout.js', KEY_CTRL_C);

  assert.equal(signal, null);
  assert.equal(code, 0);
  assert.match(stdout, /RESULT:\{\}/);
});

test('Escape soft-cancels and the process exits cleanly (does not hang)', async () => {
  const { code, signal, stdout } = await runFixture('ctrlc.js', KEY_ESCAPE);

  assert.equal(signal, null);
  assert.equal(code, 0);
  assert.match(stdout, /RESULT:\{\}/);
});
