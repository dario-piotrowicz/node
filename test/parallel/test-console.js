// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
const common = require('../common');
const assert = require('assert');
const util = require('util');

const {
  hijackStdout,
  hijackStderr,
  restoreStderr,
  restoreStdout,
} = require('../common/hijackstdio');

const { describe, test, beforeEach, afterEach } = require('node:test');

assert.ok(process.stdout.writable);
assert.ok(process.stderr.writable);
// Support legacy API
if (common.isMainThread) {
  assert.strictEqual(typeof process.stdout.fd, 'number');
  assert.strictEqual(typeof process.stderr.fd, 'number');
}

describe('warnings', () => {
  test('trying to reset the count of a non-existing label produces a warning', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.countReset('noLabel');
    });
    assert.deepStrictEqual(warnings, ["Count for 'noLabel' does not exist"]);
  });

  test('trying to log the time of a non-existing/non-started timer produces a warning', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.timeLog('noLabel');
    });
    assert.deepStrictEqual(warnings, ["No such label 'noLabel' for console.timeLog()"]);
  });

  test('trying to stop the time of a non-existing/non-started timer produces a warning', async () => {
    const warnings = await runAndGetWarnings(() => {
      // console.timeLog('noLabel');
      console.timeEnd('noLabel');
    });
    assert.deepStrictEqual(warnings, ["No such label 'noLabel' for console.timeEnd()"]);
  });

  test('normal count usages should not produce any warnings', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.count('counter');
      console.countReset('counter');
    });
    assert.deepStrictEqual(warnings, []);
  });

  test('normal time usages, using the default label, should not produce any warnings', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.time();
      console.timeLog();
      console.timeEnd();
    });
    assert.deepStrictEqual(warnings, []);
  });

  test('normal time usages, using a custom label, should not produce any warnings', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.time('timer');
      console.timeLog('timer');
      console.timeEnd('timer');
    });
    assert.deepStrictEqual(warnings, []);
  });

  test('restarting a timer produces a warning', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.time('timer');
      console.time('timer');
    });
    assert.deepStrictEqual(warnings, ["Label 'timer' already exists for console.time()"]);
    console.timeEnd('timer'); // let's call timeEnd not to have side effects
  });

  test('restarting the default timer produces a warning', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.time();
      console.time();
    });
    assert.deepStrictEqual(warnings, ["Label 'default' already exists for console.time()"]);
    console.timeEnd(); // let's call timeEnd not to have side effects
  });

  test('trying to countReset, timeLog or timeEnd on the default label should produce appropriate warnings', async () => {
    const warnings = await runAndGetWarnings(() => {
      console.countReset();
      console.timeLog();
      console.timeEnd();
    });
    assert.deepStrictEqual(warnings, [
      "Count for 'default' does not exist",
      "No such label 'default' for console.timeLog()",
      "No such label 'default' for console.timeEnd()"
    ]);
  });
});

test('TypeErrors should be thrown when a Symbol is provided as the label of the count or timing functions', () => {
  // Note: we check that the `Error` is a `TypeError` but do not check the message as
  // it can be different in different JavaScript engines.
  assert.throws(() => console.time(Symbol('test')), TypeError);
  assert.throws(() => console.timeEnd(Symbol('test')), TypeError);
  assert.throws(() => console.count(Symbol('test')), TypeError);
})

// An Object with a custom inspect function.
const customInspectObject = { foo: 'bar', [util.inspect.custom]: () => 'inspect' };

// Object used to collect the log outputs
const outputs = {
  strings: [],
  errStrings: [],
};

process.stdout.isTTY = false;

beforeEach(() => {
  hijackStdout(function (data) {
    outputs.strings.push(data);
  });
  process.stderr.isTTY = false;
  hijackStderr(function (data) {
    outputs.errStrings.push(data);
  });
  outputs.strings = [];
  outputs.errStrings = [];
});

afterEach(() => {
  restoreStdout();
  restoreStderr();
});

describe('basic logging method calls', () => {
  const expectedOutputsStrings = [
    'foo',
    'foo bar',
    'foo bar hop',
    "{ slashes: '\\\\\\\\' }",
    'inspect',
  ].map(str => `${str}\n`);

  test('console.log() goes to stdout', () => {
    console.log('foo');
    console.log('foo', 'bar');
    console.log('%s %s', 'foo', 'bar', 'hop');
    console.log({ slashes: '\\\\' });
    console.log(customInspectObject);

    assert.deepStrictEqual(outputs.strings, expectedOutputsStrings);
  });

  test('console.debug() goes to stdout', () => {
    console.debug('foo');
    console.debug('foo', 'bar');
    console.debug('%s %s', 'foo', 'bar', 'hop');
    console.debug({ slashes: '\\\\' });
    console.debug(customInspectObject);

    assert.deepStrictEqual(outputs.strings, expectedOutputsStrings);
  });

  test('console.info() goes to stdout', () => {
    console.info('foo');
    console.info('foo', 'bar');
    console.info('%s %s', 'foo', 'bar', 'hop');
    console.info({ slashes: '\\\\' });
    console.info(customInspectObject);

    assert.deepStrictEqual(outputs.strings, expectedOutputsStrings);
  });

  test('console.error() goes to stderr', () => {
    console.error('foo');
    console.error('foo', 'bar');
    console.error('%s %s', 'foo', 'bar', 'hop');
    console.error({ slashes: '\\\\' });
    console.error(customInspectObject);

    assert.deepStrictEqual(outputs.errStrings, expectedOutputsStrings);
  });

  test('console.warn() goes to stderr', () => {
    console.warn('foo');
    console.warn('foo', 'bar');
    console.warn('%s %s', 'foo', 'bar', 'hop');
    console.warn({ slashes: '\\\\' });
    console.warn(customInspectObject);

    assert.deepStrictEqual(outputs.errStrings, expectedOutputsStrings);
  });
});

test('console.dir()', () => {
  console.dir(customInspectObject);
  console.dir(customInspectObject, { showHidden: false });
  console.dir({ foo: { bar: { baz: true } } }, { depth: 0 });
  console.dir({ foo: { bar: { baz: true } } }, { depth: 1 });

  assert.strictEqual(outputs.strings[0],
    "{\n  foo: 'bar',\n  Symbol(nodejs.util.inspect.custom):" +
    ' [Function: [nodejs.util.inspect.custom]]\n}\n',
  );
  assert.strictEqual(outputs.strings[1],
    "{\n  foo: 'bar',\n  Symbol(nodejs.util.inspect.custom):" +
    ' [Function: [nodejs.util.inspect.custom]]\n}\n'
  );

  assert.ok(outputs.strings[2].includes('foo: [Object]'));
  assert.strictEqual(outputs.strings[3].includes('baz'), false);
});

test('console.dirxml()', () => {
  console.dirxml(customInspectObject, customInspectObject);
  console.dirxml(
    { foo: { bar: { baz: true } } },
    { foo: { bar: { quux: false } } },
    { foo: { bar: { quux: true } } }
  );

  assert.strictEqual(outputs.strings[0], 'inspect inspect\n');

  assert.ok(outputs.strings[1].includes('foo: { bar: { baz:'));
  assert.ok(outputs.strings[1].includes('quux'));
  assert.ok(outputs.strings[1].includes('quux: true'));
});

test('console.trace()', () => {
  console.trace('This is a %j %d', { formatted: 'trace' }, 10, 'foo');

  assert.strictEqual(
    outputs.errStrings[0].split('\n').shift(),
    'Trace: This is a {"formatted":"trace"} 10 foo'
  );
});

describe('console.time() and console.timeEnd()', () => {
  test('basic usage', () => {
    console.time('label');
    console.timeEnd('label');

    assert.match(outputs.strings[0].trim(), /^label: \d+(\.\d{1,3})?(ms|s)$/);
  })

  test('Object.prototype properties can be used as labels', () => {
    console.time('__proto__');
    console.timeEnd('__proto__');
    console.time('constructor');
    console.timeEnd('constructor');
    console.time('hasOwnProperty');
    console.timeEnd('hasOwnProperty');

    assert.match(outputs.strings[0].trim(), /^__proto__: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[1].trim(), /^constructor: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[2].trim(), /^hasOwnProperty: \d+(\.\d{1,3})?(ms|s)$/);
  });

  test('arguments are coerced to strings', () => {
    console.time([]);
    console.timeEnd([]);
    console.time({});
    console.timeEnd({});
    console.time(null);
    console.timeEnd(null);
    console.time(undefined);
    console.timeEnd('default');
    console.time('default');
    console.timeEnd(undefined);
    console.time(NaN);
    console.timeEnd(NaN);

    assert.match(outputs.strings[0].trim(), /^: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[1].trim(), /^\[object Object\]: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[2].trim(), /^null: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[3].trim(), /^default: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[4].trim(), /^default: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[5].trim(), /^NaN: \d+(\.\d{1,3})?(ms|s)$/);
  });

  test("calling time twice without timeEnd doesn't reset the timer.", async () => {
    const warnings = await runAndGetWarnings(() => {
      const { promise, resolve } = Promise.withResolvers();
      console.time('test');
      setTimeout(() => {
        const time = console._times.get('test');
        console.time('test');
        assert.deepStrictEqual(console._times.get('test'), time);
        console.timeEnd('test');
        resolve();
      }, 1);
      return promise;
    });
    assert.deepStrictEqual(warnings, ["Label 'test' already exists for console.time()"]);
  });

  test('console.timeLog() works with various arguments', () => {
    console.time('log1');
    console.timeLog('log1');
    console.timeLog('log1', 'test');
    console.timeLog('log1', {}, [1, 2, 3]);
    console.timeEnd('log1');

    assert.match(outputs.strings[0].trim(), /^log1: \d+(\.\d{1,3})?(ms|s)$/);
    assert.match(outputs.strings[1].trim(), /^log1: \d+(\.\d{1,3})?(ms|s) test$/);
    assert.match(outputs.strings[2].trim(), /^log1: \d+(\.\d{1,3})?(ms|s) {} \[ 1, 2, 3 ]$/);
    assert.match(outputs.strings[3].trim(), /^log1: \d+(\.\d{1,3})?(ms|s)$/);
  });

  test("console.timeEnd() doesn't leave dead links", () => {
    const timesMapSize = console._times.size;
    console.time('label1');
    console.time('label2');
    console.time('label3');
    console.timeEnd('label1');
    console.timeEnd('label2');
    console.timeEnd('label3');
    assert.strictEqual(console._times.size, timesMapSize);
  });
});

describe('console.assert()', () => {
  test('should not throw with a false argument', () => {
    console.assert(false);
    assert.strictEqual(outputs.errStrings[outputs.errStrings.length - 1], 'Assertion failed\n');
  });

  test('should not throw with a false argument and support formatting', () => {
    console.assert(false, '%s should', 'console.assert', 'not throw');
    assert.strictEqual(
      outputs.errStrings[outputs.errStrings.length - 1],
      'Assertion failed: console.assert should not throw\n'
    );
  });

  test('should not throw with a true argument', () => {
    console.assert(true);
    console.assert(true, 'this should not throw');
  });
});

/**
 * Runs a given function and collects all the warnings that the function triggered
 *
 * @param {() => void|Promise<void>} fn the function to run
 * @returns a promise with the various warnings (or more precisely, their messages)
 */
async function runAndGetWarnings(fn) {
  let warnings = [];
  const { promise, resolve } = Promise.withResolvers();
  const listener = (warning) => warnings.push(warning.message);
  process.on('warning', listener);
  await fn();

  // `process.emitWarning` which uses `process.nextTick`, thus we also need to
  // wait for the nextTick to receive the warnings
  process.nextTick(() => {
    process.off('warning', listener);
    resolve(warnings);
  });
  return promise;
}
