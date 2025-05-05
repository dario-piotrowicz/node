#!/usr/bin/env node

import { globSync, statSync } from 'node:fs';
import { getSrcFunctionsNotPresentInFiles, __dirname, logResults } from './_shared.mjs';

const libFiles = globSync(`${__dirname}/../../lib/**/*.{mjs,js}`);
const testFiles = globSync(`${__dirname}/../../test/**/*.{mjs,js}`);

const allJsFiles = [...libFiles, ...testFiles].filter((file) =>
  statSync(file).isFile()
);

// The following is a list of functions that are currently unused so they don't pass this validation
// TODO(@dario): this list needs to be reviewed and potentially completely removed
const functionsToIgnore = [
  { functionName: 'shouldRetryAsESM', srcFilePath: 'src/node_contextify.cc' },
  { functionName: 'checkMessagePort', srcFilePath: 'src/node_messaging.cc' },
  {
    functionName: 'flushPacketFreelist',
    srcFilePath: 'src/quic/bindingdata.cc',
  },
  {
    functionName: 'internalVerifyIntegrity',
    srcFilePath: 'src/crypto/crypto_hash.cc',
  },
];

const unusedFunctions = getSrcFunctionsNotPresentInFiles(
  allJsFiles,
  functionsToIgnore
);

logResults(unusedFunctions, 'unused');

process.exit(unusedFunctions.length > 0 ? 1 : 0);
