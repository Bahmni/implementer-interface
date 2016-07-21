var webpackCfg = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: ['jsdom'],
    files: [
      'test/**/*.spec.js'
    ],
    port: 8080,
    captureTimeout: 60000,
    frameworks: ['mocha', 'chai'],
    client: {
      mocha: {}
    },
    singleRun: true,
    reporters: ['mocha', 'coverage'],
    mochaReporter: {
      showDiff: true,
      divider: '*'
    },
    preprocessors: {
      'test/**/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html'},
        {type: 'text'},
        {type: 'text-summary'}
      ]
    }
  });
};
