var Backbone = require('backbone');
var Collection = Backbone.Collection;
var List = require('./list');
var template = require('./list.hbs');
var templateFull = require('./list-full.hbs');
var templateBody = require('./list-body.hbs');
var templateItems = require('./list-items.hbs');

/**
 * Return a basic list with a pre-rendered template.
 */
var factory = {
  getData: function () {
    return [
      { id: 1, value: 'One' },
      { id: 2, value: 'Two' },
      { id: 3, value: 'Three' },
      { id: 4, value: 'Four' }
    ];
  },
  getBasicList: function () {
    var list = new List({
      collection: new Collection(this.getData())
    });
    list.template = template;
    list.render();
    return list;
  },
  getFullList: function () {
    var list = new List({
      template: templateFull,
      collection: new Collection(this.getData())
    });
    list.render();
    return list;
  },
  getItemsList: function () {
    var list = new List({
      template: templateBody,
      itemTemplate: templateItems,
      collection: new Collection(this.getData())
    });
    list.render();
    return list;
  }
};

module.exports = factory;
