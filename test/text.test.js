'use strict';

// Ported from the original prompts test suite (tape -> node:test).
// Uses detached streams so element rendering does not pollute the TAP output.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const TextPrompt = require('../lib/elements/text');

function createTextPrompt() {
  return new TextPrompt({ stdin: new PassThrough(), stdout: new PassThrough() });
}

test('move', () => {
  const textPrompt = createTextPrompt();

  textPrompt.value = 'Hello, world!';
  textPrompt.last();
  textPrompt.render();

  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is 0 at start');
  assert.equal(textPrompt.cursor, textPrompt.rendered.length, 'cursor starts at end');

  textPrompt.right();
  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is unaffected when moved right from the end');
  assert.equal(textPrompt.cursor, textPrompt.rendered.length, 'cursor is unaffected when moved right from the end');

  textPrompt.left();
  assert.equal(textPrompt.cursorOffset, -1, 'cursorOffset is -1 when moved left');

  textPrompt.right();
  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is 0 when moved back right');
});

test('delete', () => {
  const textPrompt = createTextPrompt();

  textPrompt.value = 'Hello, world!';
  textPrompt.last();
  textPrompt.render();

  textPrompt.delete();
  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is 0 after delete');
  assert.equal(textPrompt.cursor, textPrompt.rendered.length, 'cursor stays at end of line');

  textPrompt.left();
  textPrompt.deleteForward();
  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is 0 after deleteForward');
  assert.equal(textPrompt.cursor, textPrompt.rendered.length, 'cursor stays at end of line');

  textPrompt.submit();
});

test('submit', () => {
  const textPrompt = createTextPrompt();

  textPrompt.value = 'Hello, world!';
  textPrompt.submit();

  assert.equal(textPrompt.cursorOffset, 0, 'cursorOffset is reset on submit');
  assert.equal(textPrompt.cursor, textPrompt.rendered.length, 'cursor is reset to end of line on submit');
});
