var Checklist = Backbone.Collection.extend({
	model: ListItem, ListLabel,

	localStorage: new Backbone.LocalStorage("todos-backbone"),

	done: function() {
	return this.where({checked:true});
	},

	remaining: function() {
		return this.where({checked: false});
	},

	nextOrder: function() {
		if(!this.length) return 1;
		return this.last().get('order') + 1;
	},

	comparator: 'order' // ?

});