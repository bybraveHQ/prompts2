// Verifies the ESM entry point added in prompts2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import prompts, { prompt, inject, override } from '../index.mjs';

test('ESM default and named exports', () => {
  assert.equal(typeof prompts, 'function');
  assert.equal(typeof prompt, 'function');
  assert.equal(typeof inject, 'function');
  assert.equal(typeof override, 'function');
  assert.equal(typeof prompts.prompts, 'object');
});
