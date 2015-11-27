var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Model = Backbone.Model;
var Collection = Backbone.Collection;
var Table = require('../src/table');
var List = require('../examples/list/list');
var factory = require('../examples/list/list-factory');

describe('views/list', function () {

  it('instantiates', function () {
    var view = new List({
      collection: new Collection()
    });
  });

  describe('options', function () {

    var list = factory.getBasicList();

    var items = new Collection();
    var collection = new Collection();
    var template = function () {};
    var itemTemplate = function () {};
    var getItemData = function () {};
    var optionsList = new List({
      collection: collection,
      items: items,
      listBodySelector: 'ul',
      listItemSelector: 'li',
      itemTemplate: itemTemplate,
      template: template,
      getItemData: getItemData
    });

    describe('collection', function () {
      it('has configurable collection', function () {
        expect(optionsList.collection).toEqual(collection);
      });
    });

    describe('items', function () {
      it('uses collection as default items', function () {
        expect(list.items).toEqual(list.collection);
      });
      it('has configurable items', function () {
        expect(optionsList.items).toEqual(items);
      });
    });

    describe('template', function () {
      it('has configurable template', function () {
        expect(optionsList.template).toEqual(template);
      });
    });

    describe('itemTemplate', function () {
      it('has configurable itemTemplate', function () {
        expect(optionsList.itemTemplate).toEqual(itemTemplate);
      });
    });

    describe('getItemData', function () {
      it('has default getItemData', function () {
        expect(list.getItemData).toBeTruthy();
      });
      it('has configurable getItemData', function () {
        expect(optionsList.getItemData).toEqual(getItemData);
      });
    });

    describe('listBodySelector', function () {
      it('has default listBodySelector', function () {
        expect(list.listBodySelector).toEqual('tbody');
      });
      it('has configurable listBodySelector', function () {
        expect(optionsList.listBodySelector).toEqual('ul');
      });
    });

    describe('listItemSelector', function () {
      it('has default listItemSelector', function () {
        expect(list.listItemSelector).toEqual('tr');
      });
      it('has configurable listItemSelector', function () {
        expect(optionsList.listItemSelector).toEqual('li');
      });
    });

    // TODO might want to move these.  They depend on plugins.
    it('has configurable columns');
    it('has configurable queryModel');
  });

  describe('events', function () {

    describe('items reset', function () {

      var data;
      beforeEach(function () {
        data = [
          {id: 5, value: 'Five'},
          {id: 6, value: 'Six'}
        ];
      });

      it('renders list with items', function () {
        assertRendersList(factory.getFullList());
      });
      it('renders list with no items', function () {
        assertRendersListEmpty(factory.getFullList());
      });
      it('renders list with itemTemplate with items', function () {
        assertRendersList(factory.getItemsList());
      });
      it('renders list with itemTemplate with no items', function () {
        assertRendersListEmpty(factory.getItemsList());
      });

      function assertRendersList (list) {
        list.items.reset(data);
        expect(list.$('tr')).toHaveLength(2);
        expect(list.$el).toContainText('Five');
        expect(list.$el).toContainText('Six');
        expect(list.$el).not.toContainText('One');
      }
      function assertRendersListEmpty (list) {
        list.items.reset();
        expect(list.$('tr')).toHaveLength(0);
        expect(list.$el).toContainText('Empty');
      }
    });

    describe('items change', function () {

      it('renders item in list', function () {
        assertRendersItem(factory.getFullList());
      });
      it('renders item in list with itemTemplate', function () {
        assertRendersItem(factory.getItemsList());
      });

      function assertRendersItem (list) {
        expect(list.$el).not.toContainText('Test');
        list.items.first().set('value', 'Test');
        expect(list.$el).toContainText('Test');
      }
    });

    describe('items add', function () {

      it('renders added item in list', function () {
        assertRendersItem(factory.getFullList());
      });
      it('renders first item in list', function () {
        assertRendersItemFromEmpty(factory.getFullList());
      });
      it('renders added item in list with itemTemplate', function () {
        assertRendersItem(factory.getItemsList());
      });
      it('renders first item in list with itemTemplate', function () {
        assertRendersItemFromEmpty(factory.getItemsList());
      });

      function assertRendersItem (list) {
        expect(list.$el).not.toContainText('Test');
        list.items.add({id: 5, value: 'Test'});
        expect(list.$el).toContainText('Test');
        expect(list.$('tr')).toHaveLength(5);
      }
      function assertRendersItemFromEmpty (list) {
        var item = list.items.first();
        list.items.reset();
        expect(list.$el).toContainText('Empty');
        list.items.add(item);
        expect(list.$el).toContainText('One');
        expect(list.$el).not.toContainText('Empty');
      }
    });

    describe('items remove', function () {

      it('removes item in list', function () {
        assertRemovesItem(factory.getFullList());
      });
      it('removes last item in list', function () {
        assertRemovesLastItem(factory.getFullList());
      });
      it('removes item in list with itemTemplate', function () {
        assertRemovesItem(factory.getItemsList());
      });
      it('removes last item in list with itemTemplate', function () {
        assertRemovesLastItem(factory.getItemsList());
      });

      function assertRemovesItem (list) {
        list.items.remove(list.items.first());
        expect(list.$('tr')).toHaveLength(3);
        expect(list.$el).not.toContainText('First');
        expect(list.$el).not.toContainText('Empty');
      }
      function assertRemovesLastItem (list) {
        list.items.remove(1);
        list.items.remove(2);
        list.items.remove(3);
        list.items.remove(4);
        expect(list.$('tr')).toHaveLength(0);
        expect(list.$el).toContainText('Empty');
      }
    });
  });

  describe('render()', function () {
    describe('static html', function () {
      var list = factory.getBasicList();
      it('has 3 items rendered statically', function () {
        expect(list.$('tr')).toHaveLength(3);
      });
    });
    describe('full template', function () {
      var list = factory.getFullList();
      it('has 4 items rendered', function () {
        expect(list.$('tr')).toHaveLength(4);
        expect(list.$el).toContainText('One');
        expect(list.$el).toContainText('Four');
        expect(list.$el).not.toContainText('Empty');
      });
      it('renders empty list', function () {
        list.items.reset([]);
        list.render();
        expect(list.$('tr')).toHaveLength(0);
        expect(list.$el).toContainText('Empty');
      });
    });
    describe('items template', function () {
      var list = factory.getItemsList();
      it('has 4 items rendered', function () {
        expect(list.$('tr')).toHaveLength(4);
        expect(list.$el).toContainText('One');
        expect(list.$el).toContainText('Four');
        expect(list.$el).not.toContainText('Empty');
      });
      it('renders empty list', function () {
        list.items.reset([]);
        list.render();
        expect(list.$('td')).toHaveLength(0);
        expect(list.$el).toContainText('Empty');
      });
    });
  });

  describe('getRenderData()', function () {
    it('has render data for full list', function () {
      var list = factory.getBasicList();
      var data = list.getRenderData();
      expect(data.total).toEqual(4);
      expect(data.empty).toBe(false);
      expect(data.filtered).toBe(false);
      expect(data.items.length).toEqual(4);
    });
    it('has render data for empty', function () {
      var list = new List({
        collection: new Collection()
      });
      var data = list.getRenderData();
      expect(data.total).toEqual(0);
      expect(data.empty).toBe(true);
      expect(data.filtered).toBe(false);
      expect(data.items.length).toEqual(0);
    });
    it('has render data for partial list', function () {
      var collection = new Collection(factory.getData());
      var list = new List({
        collection: collection,
        items: new Collection(collection.models.slice(0,2))
      });
      var data = list.getRenderData();
      expect(data.total).toEqual(4);
      expect(data.empty).toBe(false);
      expect(data.filtered).toBe(false);
      expect(data.items.length).toEqual(2);
    });
    it('has render data for filtered list', function () {
      var collection = new Collection(factory.getData());
      var list = new List({
        collection: collection,
        items: new Collection()
      });
      var data = list.getRenderData();
      expect(data.total).toEqual(4);
      expect(data.empty).toBe(true);
      expect(data.filtered).toBe(true);
      expect(data.items.length).toEqual(0);
    });
    it('does not include items for list with itemTemplate', function () {
      var list = factory.getItemsList();
      var data = list.getRenderData();
      expect(data.items).toBe(false);
    });
  });

  describe('getItemData()', function () {
    var list = factory.getBasicList();
    it('returns item data', function () {
      var data = list.getItemData(list.items.first());
      expect(data.id).toEqual(1);
      expect(data.value).toEqual('One');
    });
  });

  describe('getItemEl()', function () {
    var item = new Model({id : 1});
    var list = factory.getBasicList();
    it('gets el by id', function () {
      var $el = list.getItemEl(1);
      expect($el).toHaveLength(1);
      expect($el.text().trim()).toEqual('One');
    });
    it('gets el by item', function () {
      var $el = list.getItemEl(item);
      expect($el.size()).toEqual(1);
      expect($el.text().trim()).toEqual('One');
    });
  });

  describe('getItemEls()', function () {
    var list = factory.getBasicList();
    var item1 = list.collection.get(1);
    var item2 = list.collection.get(2);
    it('gets single el by id', function () {
      var $els = list.getItemEls([1]);
      expect($els.size()).toEqual(1);
    });
    it('gets single el by item', function () {
      var $els = list.getItemEls([item1]);
      expect($els.size()).toEqual(1);
    });
    it('gets single el by id', function () {
      var $els = list.getItemEls([1, 2]);
      expect($els.size()).toEqual(2);
      expect($($els[0]).text().trim()).toEqual('One');
      expect($($els[1]).text().trim()).toEqual('Two');
    });
    it('gets single el by id', function () {
      var $els = list.getItemEls([item1, item2]);
      expect($els.size()).toEqual(2);
      expect($($els[0]).text().trim()).toEqual('One');
      expect($($els[1]).text().trim()).toEqual('Two');
    });
  });

  describe('getItemRange()', function () {
    var list = factory.getBasicList();
    var item1 = list.collection.get(1);
    var item2 = list.collection.get(2);
    var item3 = list.collection.get(3);
    var item4 = list.collection.get(4);
    it('gets items in item range', function () {
      var range = list.getItemRange(item1, item3);
      expect(range.items.length).toEqual(3);
      expect(range.items[0]).toEqual(item1);
      expect(range.items[2]).toEqual(item3);
      expect(range.$els.size()).toEqual(3);
      expect(range.$els.text()).toContain('Three');
    });
    it('gets items in range by id', function () {
      var range = list.getItemRange(1, 2);
      expect(range.items.length).toEqual(2);
      expect(range.items[0]).toEqual(item1);
      expect(range.items[1]).toEqual(item2);
      expect(range.$els.size()).toEqual(2);
      expect(range.$els.text()).toContain('Two');
    });
    it('gets items off-screen', function () {
      var range = list.getItemRange(3, 4);
      expect(range.items.length).toEqual(2);
      expect(range.items[0]).toEqual(item3);
      expect(range.items[1]).toEqual(item4);
      expect(range.$els.size()).toEqual(1);
      expect(range.$els.text()).not.toContain('Two');
    });
  });

  describe('getEventItem()', function () {
    var list = factory.getBasicList();
    var item1 = list.collection.get(1);
    var item3 = list.collection.get(3);
    it('gets event item when triggered on item', function (done) {
      list.$el.find('[data-id="1"]').on('click', function (e) {
        expect(list.getEventItem(e)).toEqual(item1);
        done();
      }).trigger('click');
    });
    it('gets event item when triggered on item child', function (done) {
      list.$el.find('[data-id="3"] td').on('click', function (e) {
        expect(list.getEventItem(e)).toEqual(item3);
        done();
      }).trigger('click');
    });
  });

  describe('getListBody()', function () {
    var list = factory.getBasicList();
    it('returns the list body', function () {
      var $body = list.getListBody();
      expect($body.size()).toEqual(1);
    });
  });

  describe('hasListBody()', function () {
    var list = factory.getBasicList();
    it('returns true when list has body element', function () {
      expect(list.hasListBody()).toEqual(true);
    });
    it('returns false when list does not have body', function () {
      list.$el.html('');
      expect(list.hasListBody()).toEqual(false);
    });
  });
});
