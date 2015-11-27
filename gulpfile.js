var gib = require('gib');
var gulp = require('gulp');

var config = {
  build: './public',
  server: {
    port: 3011,
    livereload: {
      port: 30555
    }
  },
  assets: {
    '': './node_modules/@humblesoftware/taxi/taxi.*'
  },
  js: {
    'backbone-table.js': {
      src: './src/table.js',
      browserify: {
        require: './src/table.js'
      }
    },
    'index.js': {
      src: './examples/index.js',
      browserify: {
        require: './examples/index.js'
      }
    }
  },
  index: {
    'index.html': {
      src: 'examples/index.html'
    }
  }
};

gib.gulpfile(config, gulp);
