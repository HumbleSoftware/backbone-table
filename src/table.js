/**
 * List Base Class
 *
 * This is the base class for list views in our app.  It handles rendering
 * of potentially large lists and smart updates of individual list items.
 *
 * This list view has two collections, one representing the source of items
 * and the other representing the items on screen.  This allows flexibility
 * for sorting, filtering and advanced rendring such as virtual scrolling.
 *
 * Options:
 * `collection` is the source collection for models
 * `items` is the rendered collection, supporting virutal scrolling
 *
 * TODO plugins for optional but shared behaviors
 * TODO progressive rendering, pagination, virtual scrolling...
 * TODO support individual view items natively
 */
var Backbone = require('backbone');
var _ = require('underscore');
var $ = Backbone.$;

var OPTIONS = [
  'template',
  'itemTemplate',
  'listBodySelector',
  'listItemSelector',
  'getItemData',
  // TODO These have more to do with plugins. Should they be moved?
  'columns',
  'queryModel'
];

module.exports = function (View) {
  return View.extend({
    listItemSelector: 'tr',
    listBodySelector: 'tbody',
    constructor: function (options) {

      options = options || {};

      // Options and defaults:
      _.each(OPTIONS, function (option) {
        if (options[option]) this[option] = options[option];
      }, this);

      // Entire collection:
      var collection = options.collection;

      // Items rendered:
      var items = this.items = options.items || collection;

      this
        .listenTo(items, 'reset', this.onCollectionReset)
        .listenTo(items, 'change', this.onItemUpdate)
        .listenTo(items, 'add', this.onItemAdd)
        .listenTo(items, 'remove', this.onItemRemove);

      // Calling super's constructor
      View.apply(this, arguments);
    },

    getQueriedItems : function () {
      return this.collection.query(this.queryModel);
    },

    getItemData: function (item) {
      return item.toJSON();
    },

    /**
     * Default render data.
     *
     * @return {Object}  Render data.
     * - `total` Length of base collection.
     * - `empty`  True if items is empty.
     * - `filtered`  True if items is empty but base collection is not.
     * - `items`  If no itemTemplate specified, this is the item data.
     */
    getRenderData: function () {
      var collection = this.collection;
      var items = this.items;
      var total = collection.length;
      var empty = !items.length;
      return {
        total: total,
        empty: empty,
        filtered: empty && !!total,
        items: this.itemTemplate ? false : items.map(this.getItemData)
      };
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      if (this.itemTemplate && this.items.length) {
        this.renderItems();
      }
      return this;
    },

    renderItem: function (item) {
      var id = item.id;
      var $tr = this.getItemEl(item);
      var html = this._itemTemplate(item);
      if ($tr.length) {
        // Do not replace if the rendered content is the same:
        if ($tr.prop('outerHTML') !== html[0].outerHTML.trim()) {
          $tr.replaceWith(html);
        }
      } else {
        var index = this.items.indexOf(item);
        var at = this.$(this.listItemSelector + '[data-id]').get(index);
        if (at) {
          this.$(at).before(html);
        } else {
          this.getListBody().append(html);
        }
      }
      this.trigger('render-item', item);
    },

    renderItems: function () {
      var timeName = 'render-items ' + this.el.className; 
      var items = this.items;
      if (items.query) {
        items = items.query(this.queryModel);
      }

      var html = items.map(this._itemTemplate, this);

      // TODO optimization would be to resize thead in an empty table:
      var that = this;
      this.$('thead').each(function () {
        that._updateItemColumns(that.$(this).children(), true);
      });

      this.getListBody().html(html);
    },

    _itemTemplate: function (item) {
      return this._updateItemColumns(
        $(this.itemTemplate(this.getItemData(item)))
      );
    },

    _updateItemColumns: function ($row, toggle) {
      var columns = this.columns && this.columns.columnsIndex;
      if (columns) {
        var $columns = $row.children().detach();
        if (toggle) {
          var widths = this.columns.getWidths();
          $columns.each(function () {
            var $column = $(this);
            var column = $column.data('column');

            // Show/hide headers:
            $column.toggle(!!(columns[column]));

            // Handle header resize:
            var width = widths[column];
            if (width) {
              $column.css('width', (width * 100) + '%');
            }
          });
        } else {
          $columns = $columns.filter(function (i, a) {
            return columns[$(this).data('column')];
          });
        }
        $columns.sort(function (a, b) {
          return (
            (columns[$(a).data('column')] || 0) -
            (columns[$(b).data('column')] || 0)
          );
        });
        $columns.appendTo($row);
      }
      return $row;
    },


    // Collection callbacks:
    onCollectionReset: function () {
      if (this.items.length && this.itemTemplate && this.hasListBody()) {
        this.renderItems();
      } else {
        this.render();
      }
    },

    // Item callbacks:
    onItemAdd: function (item) {
      if (this.itemTemplate && this.hasListBody()) {
        this.renderItem(item);
      } else {
        this.render();
      }
    },
    onItemUpdate: function (item) {
      if (this.itemTemplate) {
        this.renderItem(item);
      } else {
        this.render();
      }
    },
    onItemRemove: function (item) {
      if (this.items.length) {
        this.getItemEl(item).remove();
      } else {
        this.render();
      }
    },

    /**
     * Return element for item.
     *
     * @param {Model|id}
     * @return {jQuery}
     */
    getItemEl: function (item) {
      var id = (item && item.id) || item;
      return this.$(this.listItemSelector + '[data-id="' + id + '"]');
    },

    /**
     * Return elements for items.
     *
     * @param {Model|id}
     * @return {jQuery}
     */
    getItemEls: function (items) {
      var $els = $();
      _.each(items, function (item) {
        $els = $els.add(this.getItemEl(item));
      }, this);
      return $els;
    },

    /**
     * Return range of items
     *
     * Gets an array of items in a range, and their elements.  Returns
     * an object with two properties:
     *
     * `items` - an array of items sorted in the collection order
     * `$els` - a jQuery object of the items.
     *
     * @param {Model|id}
     * @return {Object}
     */
    getItemRange: function (itemA, itemB) {
      var collection = this.collection;
      var indexA = collection.indexOf(collection.get(itemA));
      var indexB = collection.indexOf(collection.get(itemB));
      var items = this.collection.slice(
        Math.min(indexA, indexB),
        Math.max(indexA, indexB) + 1
      );
      return {
        items: items,
        $els: this.getItemEls(items)
      };
    },

    /**
     * Return elements for items.
     *
     * @param {Model|id}
     * @return {jQuery}
     */
    getEventItem: function (e) {
      var id = this.$(e.target).closest(this.listItemSelector).data('id');
      return this.collection.get(id);
    },

    /**
     * Returns the list body element.
     *
     * @return {jQuery}
     */
    getListBody: function () {
      return this.$(this.listBodySelector);
    },

    /**
     * Returns the existence of the list body element.
     *
     * @return {Boolean}
     */
    hasListBody: function () {
      return !!this.getListBody().size();
    }
  });
};
