#!/usr/bin/env node

import { globSync } from 'node:fs';
import { getSrcFunctionsNotPresentInFiles, __dirname, logResults } from './_shared.mjs';

const typingsFiles = globSync(
  `${__dirname}/../../typings/internalBinding/*.d.ts`
);

const functionsToIgnore = getFunctionsToIgnore();

const untyped = getSrcFunctionsNotPresentInFiles(
  typingsFiles,
  functionsToIgnore
);

logResults(untyped, 'untyped');

process.exit(untyped.length > 0 ? 1 : 0);

function getFunctionsToIgnore() {
  // The following is a list of functions that are currently missing typings so they don't pass this validation
  // TODO(@dario): this list needs to be reviewed and potentially completely removed
  return [
    { functionName: 'getPromiseHooks', srcFilePath: 'src/async_wrap.cc' },
    { functionName: 'getaddrinfo', srcFilePath: 'src/cares_wrap.cc' },
    { functionName: 'getnameinfo', srcFilePath: 'src/cares_wrap.cc' },
    { functionName: 'canonicalizeIP', srcFilePath: 'src/cares_wrap.cc' },
    {
      functionName: 'convertIpv6StringToBuffer',
      srcFilePath: 'src/cares_wrap.cc',
    },
    { functionName: 'strerror', srcFilePath: 'src/cares_wrap.cc' },
    { functionName: 'encodeInto', srcFilePath: 'src/encoding_binding.cc' },
    {
      functionName: 'encodeUtf8String',
      srcFilePath: 'src/encoding_binding.cc',
    },
    { functionName: 'decodeUTF8', srcFilePath: 'src/encoding_binding.cc' },
    { functionName: 'toASCII', srcFilePath: 'src/encoding_binding.cc' },
    { functionName: 'toUnicode', srcFilePath: 'src/encoding_binding.cc' },
    { functionName: 'decodeLatin1', srcFilePath: 'src/encoding_binding.cc' },
    { functionName: 'buildEmbedderGraph', srcFilePath: 'src/heap_utils.cc' },
    { functionName: 'triggerHeapSnapshot', srcFilePath: 'src/heap_utils.cc' },
    {
      functionName: 'createHeapSnapshotStream',
      srcFilePath: 'src/heap_utils.cc',
    },
    {
      functionName: 'setConsoleExtensionInstaller',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'callAndPauseOnStart',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    { functionName: 'waitForDebugger', srcFilePath: 'src/inspector_js_api.cc' },
    {
      functionName: 'asyncTaskScheduled',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'asyncTaskCanceled',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'asyncTaskStarted',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'asyncTaskFinished',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'registerAsyncHook',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    { functionName: 'isEnabled', srcFilePath: 'src/inspector_js_api.cc' },
    {
      functionName: 'emitProtocolEvent',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'setupNetworkTracking',
      srcFilePath: 'src/inspector_js_api.cc',
    },
    {
      functionName: 'setCoverageDirectory',
      srcFilePath: 'src/inspector_profiler.cc',
    },
    {
      functionName: 'setSourceMapCacheGetter',
      srcFilePath: 'src/inspector_profiler.cc',
    },
    { functionName: 'takeCoverage', srcFilePath: 'src/inspector_profiler.cc' },
    { functionName: 'stopCoverage', srcFilePath: 'src/inspector_profiler.cc' },
    { functionName: 'endCoverage', srcFilePath: 'src/inspector_profiler.cc' },
    { functionName: 'queryObjects', srcFilePath: 'src/internal_only_v8.cc' },
    {
      functionName: 'setImportModuleDynamicallyCallback',
      srcFilePath: 'src/module_wrap.cc',
    },
    {
      functionName: 'setInitializeImportMetaObjectCallback',
      srcFilePath: 'src/module_wrap.cc',
    },
    {
      functionName: 'createRequiredModuleFacade',
      srcFilePath: 'src/module_wrap.cc',
    },
    {
      functionName: 'throwIfPromiseRejected',
      srcFilePath: 'src/module_wrap.cc',
    },
    { functionName: 'revokeObjectURL', srcFilePath: 'src/node_blob.cc' },
    { functionName: 'concat', srcFilePath: 'src/node_blob.cc' },
    { functionName: 'createBlobFromFilePath', srcFilePath: 'src/node_blob.cc' },
    { functionName: 'atob', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'btoa', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'setBufferPrototype', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'compareOffset', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'fill', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'indexOfBuffer', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'indexOfString', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'copyArrayBuffer', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'swap16', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'swap32', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'swap64', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'isUtf8', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'isAscii', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'asciiSlice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'base64Slice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'base64urlSlice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'latin1Slice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'hexSlice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'ucs2Slice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'utf8Slice', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'base64Write', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'base64urlWrite', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'hexWrite', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'ucs2Write', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'getZeroFillToggle', srcFilePath: 'src/node_buffer.cc' },
    { functionName: 'getCacheUsage', srcFilePath: 'src/node_builtins.cc' },
    { functionName: 'compileFunction', srcFilePath: 'src/node_builtins.cc' },
    { functionName: 'hasCachedBuiltins', srcFilePath: 'src/node_builtins.cc' },
    { functionName: 'setInternalLoaders', srcFilePath: 'src/node_builtins.cc' },
    { functionName: 'getDefaultLocale', srcFilePath: 'src/node_config.cc' },
    { functionName: 'makeContext', srcFilePath: 'src/node_contextify.cc' },
    { functionName: 'compileFunction', srcFilePath: 'src/node_contextify.cc' },
    {
      functionName: 'startSigintWatchdog',
      srcFilePath: 'src/node_contextify.cc',
    },
    {
      functionName: 'stopSigintWatchdog',
      srcFilePath: 'src/node_contextify.cc',
    },
    {
      functionName: 'watchdogHasPendingSigint',
      srcFilePath: 'src/node_contextify.cc',
    },
    { functionName: 'measureMemory', srcFilePath: 'src/node_contextify.cc' },
    {
      functionName: 'compileFunctionForCJSLoader',
      srcFilePath: 'src/node_contextify.cc',
    },
    {
      functionName: 'containsModuleSyntax',
      srcFilePath: 'src/node_contextify.cc',
    },
    { functionName: 'shouldRetryAsESM', srcFilePath: 'src/node_contextify.cc' },
    { functionName: 'safeGetenv', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'getTempDir', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'getuid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'geteuid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'getgid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'getegid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'getgroups', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'initgroups', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'setegid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'seteuid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'setgid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'setuid', srcFilePath: 'src/node_credentials.cc' },
    { functionName: 'setgroups', srcFilePath: 'src/node_credentials.cc' },
    {
      functionName: 'setPrepareStackTraceCallback',
      srcFilePath: 'src/node_errors.cc',
    },
    {
      functionName: 'setGetSourceMapErrorSource',
      srcFilePath: 'src/node_errors.cc',
    },
    { functionName: 'setSourceMapsEnabled', srcFilePath: 'src/node_errors.cc' },
    {
      functionName: 'setMaybeCacheGeneratedSourceMap',
      srcFilePath: 'src/node_errors.cc',
    },
    {
      functionName: 'setEnhanceStackForFatalException',
      srcFilePath: 'src/node_errors.cc',
    },
    {
      functionName: 'noSideEffectsToString',
      srcFilePath: 'src/node_errors.cc',
    },
    {
      functionName: 'triggerUncaughtException',
      srcFilePath: 'src/node_errors.cc',
    },
    { functionName: 'legacyMainResolve', srcFilePath: 'src/node_file.cc' },
    { functionName: 'existsSync', srcFilePath: 'src/node_file.cc' },
    { functionName: 'statfs', srcFilePath: 'src/node_file.cc' },
    { functionName: 'nghttp2ErrorString', srcFilePath: 'src/node_http2.cc' },
    {
      functionName: 'refreshDefaultSettings',
      srcFilePath: 'src/node_http2.cc',
    },
    { functionName: 'packSettings', srcFilePath: 'src/node_http2.cc' },
    { functionName: 'setCallbackFunctions', srcFilePath: 'src/node_http2.cc' },
    { functionName: 'getStringWidth', srcFilePath: 'src/node_i18n.cc' },
    { functionName: 'icuErrName', srcFilePath: 'src/node_i18n.cc' },
    { functionName: 'transcode', srcFilePath: 'src/node_i18n.cc' },
    { functionName: 'getConverter', srcFilePath: 'src/node_i18n.cc' },
    { functionName: 'decode', srcFilePath: 'src/node_i18n.cc' },
    { functionName: 'hasConverter', srcFilePath: 'src/node_i18n.cc' },
    {
      functionName: 'exposeLazyDOMExceptionProperty',
      srcFilePath: 'src/node_messaging.cc',
    },
    { functionName: 'structuredClone', srcFilePath: 'src/node_messaging.cc' },
    {
      functionName: 'getCompileCacheEntry',
      srcFilePath: 'src/node_modules.cc',
    },
    {
      functionName: 'saveCompileCacheEntry',
      srcFilePath: 'src/node_modules.cc',
    },
    { functionName: 'setLazyPathHelpers', srcFilePath: 'src/node_modules.cc' },
    { functionName: 'getCLIOptionsValues', srcFilePath: 'src/node_options.cc' },
    { functionName: 'getCLIOptionsInfo', srcFilePath: 'src/node_options.cc' },
    { functionName: 'getEmbedderOptions', srcFilePath: 'src/node_options.cc' },
    {
      functionName: 'getEnvOptionsInputType',
      srcFilePath: 'src/node_options.cc',
    },
    { functionName: 'getAvailableParallelism', srcFilePath: 'src/node_os.cc' },
    { functionName: 'setupObservers', srcFilePath: 'src/node_perf.cc' },
    {
      functionName: 'installGarbageCollectionTracking',
      srcFilePath: 'src/node_perf.cc',
    },
    {
      functionName: 'removeGarbageCollectionTracking',
      srcFilePath: 'src/node_perf.cc',
    },
    { functionName: 'notify', srcFilePath: 'src/node_perf.cc' },
    { functionName: 'createELDHistogram', srcFilePath: 'src/node_perf.cc' },
    { functionName: 'markBootstrapComplete', srcFilePath: 'src/node_perf.cc' },
    { functionName: 'uvMetricsInfo', srcFilePath: 'src/node_perf.cc' },
    {
      functionName: '_debugProcess',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: 'abort', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: 'causeSegfault',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: 'chdir', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'umask', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'memoryUsage', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: 'constrainedMemory',
      srcFilePath: 'src/node_process_methods.cc',
    },
    {
      functionName: 'availableMemory',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: 'rss', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: 'resourceUsage',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: '_debugEnd', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: '_getActiveRequests',
      srcFilePath: 'src/node_process_methods.cc',
    },
    {
      functionName: '_getActiveHandles',
      srcFilePath: 'src/node_process_methods.cc',
    },
    {
      functionName: 'getActiveResourcesInfo',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: '_kill', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: '_rawDebug', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'cwd', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'reallyExit', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'execve', srcFilePath: 'src/node_process_methods.cc' },
    { functionName: 'uptime', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: 'patchProcessObject',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: 'loadEnvFile', srcFilePath: 'src/node_process_methods.cc' },
    {
      functionName: 'setEmitWarningSync',
      srcFilePath: 'src/node_process_methods.cc',
    },
    { functionName: '_rawDebug', srcFilePath: 'src/node_process_object.cc' },
    { functionName: 'writeReport', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'getReport', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'getCompact', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'setCompact', srcFilePath: 'src/node_report_module.cc' },
    {
      functionName: 'getExcludeNetwork',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'setExcludeNetwork',
      srcFilePath: 'src/node_report_module.cc',
    },
    { functionName: 'getExcludeEnv', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'setExcludeEnv', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'getDirectory', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'setDirectory', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'getFilename', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'setFilename', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'getSignal', srcFilePath: 'src/node_report_module.cc' },
    { functionName: 'setSignal', srcFilePath: 'src/node_report_module.cc' },
    {
      functionName: 'shouldReportOnFatalError',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'setReportOnFatalError',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'shouldReportOnSignal',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'setReportOnSignal',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'shouldReportOnUncaughtException',
      srcFilePath: 'src/node_report_module.cc',
    },
    {
      functionName: 'setReportOnUncaughtException',
      srcFilePath: 'src/node_report_module.cc',
    },
    { functionName: 'isSea', srcFilePath: 'src/node_sea.cc' },
    {
      functionName: 'isExperimentalSeaWarningNeeded',
      srcFilePath: 'src/node_sea.cc',
    },
    { functionName: 'getAsset', srcFilePath: 'src/node_sea.cc' },
    {
      functionName: 'runEmbedderPreload',
      srcFilePath: 'src/node_snapshotable.cc',
    },
    {
      functionName: 'compileSerializeMain',
      srcFilePath: 'src/node_snapshotable.cc',
    },
    {
      functionName: 'setSerializeCallback',
      srcFilePath: 'src/node_snapshotable.cc',
    },
    {
      functionName: 'setDeserializeCallback',
      srcFilePath: 'src/node_snapshotable.cc',
    },
    {
      functionName: 'setDeserializeMainFunction',
      srcFilePath: 'src/node_snapshotable.cc',
    },
    { functionName: 'enqueueMicrotask', srcFilePath: 'src/node_task_queue.cc' },
    { functionName: 'setTickCallback', srcFilePath: 'src/node_task_queue.cc' },
    { functionName: 'runMicrotasks', srcFilePath: 'src/node_task_queue.cc' },
    {
      functionName: 'setPromiseRejectCallback',
      srcFilePath: 'src/node_task_queue.cc',
    },
    {
      functionName: 'getEnabledCategories',
      srcFilePath: 'src/node_trace_events.cc',
    },
    {
      functionName: 'setTraceCategoryStateUpdateHandler',
      srcFilePath: 'src/node_trace_events.cc',
    },
    {
      functionName: 'getCategoryEnabledBuffer',
      srcFilePath: 'src/node_trace_events.cc',
    },
    { functionName: 'getOrigin', srcFilePath: 'src/node_url.cc' },
    { functionName: 'pathToFileURL', srcFilePath: 'src/node_url.cc' },
    { functionName: 'defineLazyProperties', srcFilePath: 'src/node_util.cc' },
    { functionName: 'getCallerLocation', srcFilePath: 'src/node_util.cc' },
    { functionName: 'getCallSites', srcFilePath: 'src/node_util.cc' },
    { functionName: 'cachedDataVersionTag', srcFilePath: 'src/node_v8.cc' },
    {
      functionName: 'setHeapSnapshotNearHeapLimit',
      srcFilePath: 'src/node_v8.cc',
    },
    {
      functionName: 'updateHeapStatisticsBuffer',
      srcFilePath: 'src/node_v8.cc',
    },
    {
      functionName: 'updateHeapCodeStatisticsBuffer',
      srcFilePath: 'src/node_v8.cc',
    },
    { functionName: 'getCppHeapStatistics', srcFilePath: 'src/node_v8.cc' },
    {
      functionName: 'updateHeapSpaceStatisticsBuffer',
      srcFilePath: 'src/node_v8.cc',
    },
    { functionName: 'setFlagsFromString', srcFilePath: 'src/node_v8.cc' },
    { functionName: 'getHashSeed', srcFilePath: 'src/node_v8.cc' },
    {
      functionName: 'setImplementation',
      srcFilePath: 'src/node_wasm_web_api.cc',
    },
    { functionName: 'crc32', srcFilePath: 'src/node_zlib.cc' },
    { functionName: 'spawn', srcFilePath: 'src/spawn_sync.cc' },
    { functionName: 'decode', srcFilePath: 'src/string_decoder.cc' },
    { functionName: 'flush', srcFilePath: 'src/string_decoder.cc' },
    { functionName: 'isTTY', srcFilePath: 'src/tty_wrap.cc' },
    { functionName: 'getErrorMap', srcFilePath: 'src/uv.cc' },
    { functionName: 'getErrorMessage', srcFilePath: 'src/uv.cc' },
    {
      functionName: 'flushPacketFreelist',
      srcFilePath: 'src/quic/bindingdata.cc',
    },
    { functionName: 'has', srcFilePath: 'src/permission/permission.cc' },
    {
      functionName: 'getSSLCiphers',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    { functionName: 'getCiphers', srcFilePath: 'src/crypto/crypto_cipher.cc' },
    {
      functionName: 'publicEncrypt',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    {
      functionName: 'privateDecrypt',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    {
      functionName: 'privateEncrypt',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    {
      functionName: 'publicDecrypt',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    {
      functionName: 'getCipherInfo',
      srcFilePath: 'src/crypto/crypto_cipher.cc',
    },
    {
      functionName: 'getBundledRootCertificates',
      srcFilePath: 'src/crypto/crypto_context.cc',
    },
    {
      functionName: 'getSystemCACertificates',
      srcFilePath: 'src/crypto/crypto_context.cc',
    },
    {
      functionName: 'getExtraCACertificates',
      srcFilePath: 'src/crypto/crypto_context.cc',
    },
    { functionName: 'ECDHConvertKey', srcFilePath: 'src/crypto/crypto_ec.cc' },
    { functionName: 'getCurves', srcFilePath: 'src/crypto/crypto_ec.cc' },
    { functionName: 'getHashes', srcFilePath: 'src/crypto/crypto_hash.cc' },
    {
      functionName: 'getCachedAliases',
      srcFilePath: 'src/crypto/crypto_hash.cc',
    },
    { functionName: 'oneShotDigest', srcFilePath: 'src/crypto/crypto_hash.cc' },
    {
      functionName: 'internalVerifyIntegrity',
      srcFilePath: 'src/crypto/crypto_hash.cc',
    },
    {
      functionName: 'createNativeKeyObjectClass',
      srcFilePath: 'src/crypto/crypto_keys.cc',
    },
    {
      functionName: 'certVerifySpkac',
      srcFilePath: 'src/crypto/crypto_spkac.cc',
    },
    {
      functionName: 'certExportPublicKey',
      srcFilePath: 'src/crypto/crypto_spkac.cc',
    },
    {
      functionName: 'certExportChallenge',
      srcFilePath: 'src/crypto/crypto_spkac.cc',
    },
    { functionName: 'wrap', srcFilePath: 'src/crypto/crypto_tls.cc' },
    { functionName: 'setEngine', srcFilePath: 'src/crypto/crypto_util.cc' },
    { functionName: 'getFipsCrypto', srcFilePath: 'src/crypto/crypto_util.cc' },
    { functionName: 'setFipsCrypto', srcFilePath: 'src/crypto/crypto_util.cc' },
    {
      functionName: 'testFipsCrypto',
      srcFilePath: 'src/crypto/crypto_util.cc',
    },
    { functionName: 'secureBuffer', srcFilePath: 'src/crypto/crypto_util.cc' },
    {
      functionName: 'secureHeapUsed',
      srcFilePath: 'src/crypto/crypto_util.cc',
    },
    {
      functionName: 'getOpenSSLSecLevelCrypto',
      srcFilePath: 'src/crypto/crypto_util.cc',
    },
    { functionName: 'parseX509', srcFilePath: 'src/crypto/crypto_x509.cc' },
  ];
}
