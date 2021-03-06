var Checklist = Backbone.Collection.extend({
	model: ListItem,

	done: function() {
		return this.where({checked:true});
	},

	remaining: function() {
		return this.where({checked: false});
	},

	nextOrder: function() {
		if(!this.length) return 1;
		return this.last().get('order');
	},

	comparator: 'order' // ?

});

var checklist = new Checklist;