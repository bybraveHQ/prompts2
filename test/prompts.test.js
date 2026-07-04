'use strict';

// Ported from the original prompts test suite (tape -> node:test).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const prompt = require('../');
const { prompts } = prompt;

test('basics', () => {
  assert.equal(typeof prompts, 'object');
  assert.equal(typeof prompt, 'function');
  assert.equal(typeof prompt.prompt, 'function');
  assert.equal(typeof prompt.inject, 'function');
});

test('all prompt types are exported', () => {
  const types = [
    'text',
    'password',
    'invisible',
    'number',
    'confirm',
    'list',
    'toggle',
    'select',
    'multiselect',
    'autocompleteMultiselect',
    'autocomplete',
    'date',
  ];

  for (const p of types) {
    assert.ok(p in prompts, `${p} exists`);
    assert.equal(typeof prompts[p], 'function', `${p} is a function`);
  }

  assert.equal(Object.keys(prompts).length, types.length, 'all prompts are exported');
});

test('injects', async () => {
  const injected = [1, 2, 3];

  prompt.inject(injected);
  assert.deepEqual(prompt._injected, injected, 'injects array of answers');

  const foo = await prompt({ type: 'text', name: 'a', message: 'a message' });

  assert.deepEqual(foo, { a: 1 }, 'immediately returns object with injected answer');
  assert.deepEqual(prompt._injected, [2, 3], 'deletes the first answer from internal array');

  const bar = await prompt([
    { type: 'text', name: 'b', message: 'b message' },
    { type: 'text', name: 'c', message: 'c message' },
  ]);

  assert.deepEqual(bar, { b: 2, c: 3 }, 'immediately handles two prompts at once');
  assert.deepEqual(prompt._injected, [], 'leaves behind empty internal array when exhausted');
});
