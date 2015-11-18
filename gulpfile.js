var gib = require('gib');
var gulp = require('gulp');

var config = {
  server: {
    port: 3011,
    liveReload: 30555
  },
  build: './public',
  js: {
    'backbone-table.js': {
      src: './src/table.js',
      browserify: {
        require: './src/table.js'
      }
    }
  }
};

gib.gulpfile(config, gulp);
