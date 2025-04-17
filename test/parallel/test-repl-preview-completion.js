'use strict';

const common = require('../common');
const assert = require('assert');

const ArrayStream = require('../common/arraystream');

const repl = require('repl');

{
  // Completion of nested properties works but not for previews

  const stream = new ArrayStream();
  const testRepl = repl.start({ stream });

  // Some errors are passed to the domain
  testRepl._domain.on('error', assert.ifError);

  testRepl.write(`
    const obj = { foo: { bar: { baz: {} } } };
  `);

  function completeNonPreview(query, cb) {
    testRepl.complete(query, common.mustCall(cb), false);
  }

  function completePreview(query, cb) {
    testRepl.complete(query, common.mustCall(cb), true);
  }

  [
    ['obj.f', ['obj.foo'], ['obj.foo']],
    ['obj.foo', ['obj.foo'], ['obj.foo']],
    ['obj.foo.b', ['obj.foo.bar'], []],
    ['obj.foo.bar.b', ['obj.foo.bar.baz'], []],
  ].forEach(([query, expectedNonPreviewCompletions, expectedPreviewCompletions]) => {
    completeNonPreview(query, (error, data) => {
      assert.deepStrictEqual(data, [expectedNonPreviewCompletions, query]);
    });
    completePreview(query, (error, data) => {
      assert.deepStrictEqual(data, [expectedPreviewCompletions, query]);
    });
  });

  const queryEndingWithDot = 'obj.foo.';
  completeNonPreview(queryEndingWithDot, (error, data) => {
    const completions = data[0];
    assert(completions.includes('obj.foo.bar'));
  });
  completePreview(queryEndingWithDot, (error, data) => {
    assert.deepStrictEqual(data, [[], queryEndingWithDot]);
  });
}
