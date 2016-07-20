'use strict';

module.exports = function (grunt) {
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  var pkg = {
    name: 'bahmni-form-builder',
    dest: 'dist/',
    src: `${__dirname}/src`,
    archiveName: 'form-builder'
  };

  grunt.initConfig({
    copy: {
      app: {
        files: [
          {
            expand: true,
            src: ['package.json', 'index.html'],
            dest: pkg.dest
          },
          {
            expand: true,
            src: ['src/form-builder/**'],
            dest: `${pkg.dest}/form-builder/`
          }
        ]
      }
    },
    compress: {
      app: {
        options: {
          archive: `dist/${pkg.name}.zip`
        },
        files: [
          { src: ['dist/*'], expand: true, flatten: true, dest: pkg.archiveName, filter: 'isFile' },
          { src: ['dist/src/**'], expand: true, dest: `${pkg.archiveName}/src`, flatten: true, filter: 'isFile' }
        ]
      }
    },
    clean: {
      app: ['dist/', 'pkg']
    },
    webpack: {
      options: webpackConfig,
      start: {}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('default', ['clean:app', 'copy:app']);
};
