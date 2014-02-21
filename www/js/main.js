// main.js, based off https://github.com/ccoenraets/backbone-jquerymobile

window.HomeView = Backbone.View.extend({

	// I assume this uses the Underscore.js feature to get the id=home <script> template in index.html
	template: _.template($('#home').html()),

	events: {
		'click #saveDialogPopup': 'openSavePopUp', // or else will launch index.html#saveDialog
		'click #clearDialogPopup': 'openClearPopUp',
		'click #newItem': 'createNewItem',
		'click #newLabel': 'createNewLabel',
	},

	openSavePopUp: function(e) {
		e.preventDefault();
		$("#saveDialog").popup("open");
	},

	openClearPopUp: function(e) {
		e.preventDefault();
		$("#clearDialog").popup("open");
	},

	createNewItem: function(e) {
		e.preventDefault();
		listItem = new ListItem();
		$(this.el).find('.list').append('<li><input type="checkbox" id="1"/>\
			<label for="1">Hey</label></li>');
		$('[type="checkbox"]').checkboxradio();
	},

	createNewLabel: function(e) {
		e.preventDefault();
		listLabel = new ListLabel();
		$(this.el).append('Chickens');
	},

	render:function(eventName) { // every view needs a render function
		$(this.el).html(this.template()); // set top level element to use id=home's template html
		return this;
	}
});

window.TemplatesView = Backbone.View.extend({

	template: _.template($('#templates').html()),

	render:function(eventName) {
		$(this.el).html(this.template());
		return this;
	}
});

var AppRouter = Backbone.Router.extend({ // what is this for...?
	
	routes: {
		"":"home", // home by default ?
		"templates":"templates",
		// and any other pages that might be in the app
	}, //comma must follow!

	// when is this function run?
	initialize:function() {
		// always handle the back button (if there will be one implemented)
		$('.back').on('click', function(event){
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

	home:function() {
		console.log('#home');
		this.changePage(new HomeView());
	},

	templates:function() {
		console.log('#templates');
		this.changePage(new TemplatesView());
	},

	changePage:function(page) {
		$(page.el).attr('data-role','page'); // does the jQuery Mobile magic by rendering a JQM page
		page.render();

		// instead of using the multiple div data-role=page in index.html jQM model,
		// pages (the templates in the Views above) are now dynamically appended to the index.html's body element
		$('body').append($(page.el)); 

		// transition info here if necessary

		$.mobile.changePage($(page.el));
	}

});

// every jQuery function needs this...
$(document).ready(function() {
	console.log('Document loaded');
	app = new AppRouter();
	Backbone.history.start();

	// load current checklist
	var checklist = new Checklist;
});




