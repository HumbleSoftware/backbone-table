var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Model = Backbone.Model;
var Collection = Backbone.Collection;
var Table = require('../src/table');
var factory = require('./list/list-factory');

driver('list', function () {
  passenger('static list', function (o) {
    var list = factory.getBasicList();
    o.$container.html(list.el);
    list.render();
  });
  passenger('body-template list', function (o) {
    var list = factory.getFullList();
    o.$container.html(list.el);
    list.render();
  });
  passenger('item-template list', function (o) {
    var list = factory.getItemsList();
    o.$container.html(list.el);
    list.render();

    var id = 4;
    o.addControl('Add', function () {
      list.collection.add({
        id: ++id,
        value: 'Item ' + id
      });
    });
    o.addControl('Remove', function () {
      list.collection.pop();
    });
  });
});
