'use strict';

let config = require('./webpack.dev.config');
const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const doesDirectoryExist = fs.existsSync(path.join(__dirname, '../form-controls'));

if (!doesDirectoryExist) {
  throw "Attention: form-controls repository must exist on the same level as implementer-interface repository for this webpack config!";
}

config.plugins.push(
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, '../form-controls/dist'), to: path.join(__dirname, 'node_modules/bahmni-form-controls/dist'),
    }
  ],
    {
      copyUnmodified: true
    }
  )
);

module.exports = config;
