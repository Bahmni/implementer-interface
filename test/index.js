const __karmaWebpackManifest__ = [];

const testsContext = require.context('.', true, /spec$/);

function inManifest(path) {
  return __karmaWebpackManifest__.indexOf(path) >= 0;
}

let runnable = testsContext.keys().filter(inManifest);

if (!runnable.length) {
  runnable = testsContext.keys();
}

runnable.forEach(testsContext);
