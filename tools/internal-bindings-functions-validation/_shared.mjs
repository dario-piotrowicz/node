import { globSync, readFileSync } from 'node:fs';
import { relative, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { clearLine } from 'node:readline';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const srcFiles = globSync(`${__dirname}/../../src/**/*.cc`);

const allSrcFunctionDefinition = (
  await Promise.all(
    srcFiles.map(async (srcFile) => {
      const srcFilePath = relative(`${__dirname}/../..`, srcFile);

      const srcFileContents = await readFile(srcFile, 'utf8');
      const matches = srcFileContents.matchAll(
        /\b(SetMethod|SetMethodNoSideEffect)\([^,]*,\s+[^,]*,\s+"(?<functionName>.*?)",\s+[^)]*?\);/g
      );
      return [...matches].map((match) => {
        const { functionName } = match.groups;
        return { srcFilePath, functionName };
      });
    })
  )
)
  .filter((definition) => definition.length)
  .flat();

/**
 * @typedef {Object} SrcFunctionDefinition
 * @property {string} functionName - The name of the function.
 * @property {string} srcFilePath - The src file path where the function is declared.
 */


/**
 * Gets all the functions defined in the C++ src directory that don't appear
 * in a set of files
 *
 * @param {string[]} files the target files to check
 * @param {SrcFunctionDefinition[]} functionsToIgnore a set of functions to ignore
 * @returns {SrcFunctionDefinition[]} the functions that were not found in the target files
 */
export function getSrcFunctionsNotPresentInFiles(
  files,
  functionsToIgnore
) {
  const result = allSrcFunctionDefinition.filter(({ srcFilePath, functionName }, i) => {
    process.stdout.write(
      `Checking function ${i} of ${allSrcFunctionDefinition.length}...\r`
    );

    const shouldBeIgnored = functionsToIgnore.some(
      (ignoreEntry) =>
        ignoreEntry.functionName === functionName &&
        ignoreEntry.srcFilePath === srcFilePath
    );

    if (shouldBeIgnored) {
      return false;
    }

    const functionIsPresent = files.some((file) => {
      const fileContents = readFileSync(file);
      return new RegExp(`\\b${functionName}\\b`).test(fileContents);
    });

    return !functionIsPresent;
  });

  clearLine(process.stdout);
  console.log();

  return result;
}

/**
 * Logs validation results.
 *
 * @param {SrcFunctionDefinition[]} functions the functions that didn't pass the validation
 * @param {'unused'|'untyped'} typeOfFunctions the type of function being validated against
 */
export function logResults(functions, typeOfFunctions) {
  if (functions.length > 0) {
    console.error(`\x1b[31m❌ ${functions.length} ${typeOfFunctions} function${functions.length === 1 ? '' : 's' } detected\n\x1b[0m`);
    for (const { functionName, srcFilePath } of functions) {
      console.error(
        ` - \x1b[33m${functionName}\x1b[0m (from \x1b[38;5;245m${srcFilePath}\x1b[0m)`
      );
    }
    console.log();
  } else {
    console.log(`\x1b[32m✅ No ${typeOfFunctions} functions have been detected\n\x1b[0m`);
  }
}
