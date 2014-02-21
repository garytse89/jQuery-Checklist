var ListItemView = Backbone.View.extend({
	
	tagName: "li",

	template: _.template($('#item-template').html()),

	events: {
		"click .toggle" : "toggleCheck",
		"dblclick .view" : "edit",
		"click a.destroy" : "remove",
		// 
	},

	initialize: function() {
		this.listenTo(this.model, 'change', this.render); // this view corresponds to ONE certain list item
		this.listenTo(this.model, 'destroy', this.remove); // and the view responds to changes in the model
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON())); // this code assumes the model is in JSON format; in my prototype I used a plain JS object
		this.$el.toggleClass('checked', this.model.get('checked'));
		this.input = this.$('edit');
		return this;
	},

	toggleChecked: function() {
		this.model.toggle();
	},

	edit: function() {
		this.$el.addClass("editing"); // but I don't have one
		this.input.focus();
	},

	close: function() {
		var value = this.input.val();
		if(!value){
			this.remove(); 
		} else {
			this.model.save({title: value});
			this.$el.removeClass("editing");
		}
	},

	// for computer, not sure about support on mobile
	updateOnEnter: function(e) {
		if( e.keyCode == 13 ) this.close(); // is there a close function?
	},

	remove: function() {
		this.model.destroy(); // destroys the model, but what about the view?
	}
})