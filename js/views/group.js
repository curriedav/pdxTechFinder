var GroupView = Backbone.View.extend({
  	el: '#groups',

  	template: require('../../templates/groups.hbs'),

  	initialize: function () {
    	this.listenTo(this.model, 'change', this.render);
    	this.render;
  	},

	render: function () {
	   	this.$el.html(this.template(this.model.get('results') || { data: [] }));
	    return this;
	}
});

module.exports = GroupView;