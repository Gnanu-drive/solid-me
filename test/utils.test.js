/**
 * Tests for the pure utility functions in utils.js.
 * Run with: node --test test/utils.test.js
 */
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { clamp, generateId, escapeHtml } = require('../utils.js');

describe('clamp', () => {
  it('returns the value when it is within range', () => {
    assert.strictEqual(clamp(5, 1, 10), 5);
  });

  it('clamps to the minimum when value is too low', () => {
    assert.strictEqual(clamp(0, 1, 10), 1);
  });

  it('clamps to the maximum when value is too high', () => {
    assert.strictEqual(clamp(15, 1, 10), 10);
  });

  it('returns min when value equals min', () => {
    assert.strictEqual(clamp(1, 1, 10), 1);
  });

  it('returns max when value equals max', () => {
    assert.strictEqual(clamp(10, 1, 10), 10);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    assert.ok(typeof id === 'string' && id.length > 0);
  });

  it('returns unique values on successive calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    assert.strictEqual(ids.size, 100);
  });
});

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    assert.strictEqual(escapeHtml('a & b'), 'a &amp; b');
  });

  it('escapes less-than signs', () => {
    assert.strictEqual(escapeHtml('<script>'), '&lt;script&gt;');
  });

  it('escapes greater-than signs', () => {
    assert.strictEqual(escapeHtml('a > b'), 'a &gt; b');
  });

  it('escapes double quotes', () => {
    assert.strictEqual(escapeHtml('"hello"'), '&quot;hello&quot;');
  });

  it("escapes single quotes", () => {
    assert.strictEqual(escapeHtml("it's"), "it&#039;s");
  });

  it('leaves plain text unchanged', () => {
    assert.strictEqual(escapeHtml('hello world'), 'hello world');
  });

  it('handles an empty string', () => {
    assert.strictEqual(escapeHtml(''), '');
  });
});
