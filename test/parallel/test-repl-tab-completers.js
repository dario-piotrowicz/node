'use strict';

require('../common');
const ArrayStream = require('../common/arraystream');
const assert = require('assert');
const { describe, it } = require('node:test');

const repl = require('repl');

// function getReplOutput(input, replOptions, run = true) {
//   const inputStream = new ArrayStream();
//   const outputStream = new ArrayStream();

//   repl.start({
//     input: inputStream,
//     output: outputStream,
//     ...replOptions,
//   });

//   let output = '';
//   outputStream.write = (chunk) => (output += chunk);

//   inputStream.emit('data', input);

//   if (run) {
//     inputStream.run(['']);
//   }

//   return output;
// }

describe('repl.start options', { concurrency: true }, () => {
  it('undefined completers are accepted', () => {
    assert.doesNotThrow(() => {
      const replServer = repl.start({ completer: undefined });
      replServer.close();
    });
  });

  it('invalid types of completers error', async () => {
    [5, true, null, {}].forEach(completer => {
      assert.throws(() => {
        const replServer = repl.start({ completer });
        replServer.close();
      }, { code: 'ERR_INVALID_REPL_INPUT', message: `Invalid completer, expected a function or string, found "${typeof completer}" instead` });
    })
  });

  it('invalid completer strings error', () => {
    assert.throws(() => {
      repl.start({ completer: 'invalid-completer' })
    }, { code: 'ERR_INVALID_REPL_INPUT', message: 'Invalid completer, available completers: "shallow", "deep", "none", found "invalid-completer" instead' });
  });

  it("valid completer strings don't error", () => {
    ['none', 'deep', 'shallow'].forEach(completer => {
      assert.doesNotThrow(() => {
        const replServer = repl.start({ completer });
        replServer.close();
      });
    })
  });

  it('surfaces errors as expected', () => {
    // const output = getReplOutput('Convert this to upper case', {
    //   terminal: true,
    //   eval: (_code, _ctx, _replRes, cb) => cb(new Error('Testing Error')),
    // });
    // assert.match(output, /Uncaught Error: Testing Error\n/);
  });
});

describe('none completer', () => {

});

describe('shallow completer', () => {

});

describe('deep completer', () => {
  // very light testing as this is tested elsewhere already
});