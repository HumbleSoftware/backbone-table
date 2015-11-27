var Table = require('../../src/table');

// Stubbed base-view
var List = Table.extend({
  render: function () {
    if (this.template) {
      this.$el.html(this.template(this.getRenderData()));
    }
    return Table.prototype.render.apply(this, arguments);
  }
});

module.exports = List;
