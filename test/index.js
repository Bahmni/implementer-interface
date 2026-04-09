/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const TextEncodingPolyfill = require('text-encoding');

Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const __karmaWebpackManifest__ = [];

const testsContext = require.context('.', true, /spec$/);

function inManifest(path) {
  return __karmaWebpackManifest__.indexOf(path) >= 0;
}

let runnable = testsContext.keys().filter(inManifest);

if (!runnable.length) {
  runnable = testsContext.keys();
}

// For CodeMirror Library
// https://discuss.codemirror.net/t/working-in-jsdom-or-node-js-natively/138
document.createRange = function createRange() {
  return {
    setEnd() {},
    setStart() {},
    getBoundingClientRect() {
      return { right: 0 };
    },
  };
};

runnable.forEach(testsContext);

import './enzyme_setup';
