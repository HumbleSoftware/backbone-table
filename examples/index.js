var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

function init (that) {
  that.Backbone = Backbone;
  that._ = _;
  that.$ = $;
  return {
    run: run
  }
}

function run () {
  require('./list');
}

module.exports = init;
