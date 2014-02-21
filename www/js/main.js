// main.js, based off https://github.com/ccoenraets/backbone-jquerymobile

var inputField = '<span><input type="text" name="name" id="inputField" placeholder="Enter list item" /></span>';
var inputButton = '<span><input type="button" value="Submit" id="inputButton"/></span>';
var inputShown = false;
var addingItem = false;

window.HomeView = Backbone.View.extend({

	// I assume this uses the Underscore.js feature to get the id=home <script> template in index.html
	template: _.template($('#home').html()),

	events: {
		'click #saveDialogPopup': 'openSavePopUp', // or else will launch index.html#saveDialog
		'click #clearDialogPopup': 'openClearPopUp',
		//'click #newItem': 'createNewItem',
		//'click #newLabel': 'createNewLabel',
		'click #inputButton': 'createNewItem',
	},

	initialize: function() {
		this.listenTo(checklist, 'add', this.renderItem); // runs renderItem() when model is added to checklist
		this.listenTo(checklist, 'add', this.renderLabel); 
	},

	openSavePopUp: function(e) {
		e.preventDefault();
		$("#saveDialog").popup("open");
	},

	openClearPopUp: function(e) {
		e.preventDefault();
		$("#clearDialog").popup("open");
	},

	// Create a new item and add it to the checklist collection. This results in an 'add' event, thus firing off the addItem() function
	createNewItem: function(e, val) {
		e.preventDefault();
		var item = new ListItem({title: $('#inputField').val()});
		checklist.add(item);		
	},

	renderItem: function(listItem) {
		if( !addingItem ) return;

		var idToAdd = 'item' + checklist.length;
		console.log("Add " + idToAdd);
		var itemView = new ListItemView({model: listItem, id: idToAdd});

		// html to append
		var htmlToAppend = '<input type="checkbox" id="' + idToAdd + '"/>\
		<label for="'+ idToAdd + '">' + listItem.get('title') + '</label>';

		$(this.el).find('.list').append(htmlToAppend);
	
		$('[type="checkbox"]').checkboxradio(); // jQuery re-render
	},

	createNewLabel: function(e) {
		e.preventDefault();
		var label = new ListLabel({title: $('#inputField').val()});
		checklist.add(label);
	},

	renderLabel: function(listLabel) {
		if( addingItem ) return;

		var idToAdd = 'item' + checklist.length;
		var labelView = new ListLabelView({model: listLabel, id: idToAdd});

		var htmlToAppend = '<span id="' + idToAdd + '">' + $('#inputField').val() + '</span>';

		$(this.el).find('.list').append(htmlToAppend);

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


	// prepend text field to footer
	$('.inputGrid').append(inputField);
	$('.inputGrid').append(inputButton);
	// jquery mobile re-style
	$('[type="text"]').textinput();
	$('[type="button"]').button();

	$('.inputGrid').hide();	

	$('#newItem').on('vclick', function(){
		if( inputShown == false ) {
			$('.inputGrid').show();
			addingItem = true;
			inputShown = true;
		}
		else {
			$('.inputGrid').hide();
			inputShown = false;					
		}
		$('#newItem').children('a').removeClass('ui-btn-active');
		$('#newItem').children('a').trigger('create');
	});

	$('#newLabel').on('vclick', function(){
		$('.inputGrid').show();
		if( inputShown == false ) {
			$('.inputGrid').show();
			addingItem = false;
			inputShown = true;
		}
		else {
			$('.inputGrid').hide();
			inputShown = false;
		}	
	});

	$('#inputButton').on('vclick', function() {
		$('#inputField').val('');
		$('.inputGrid').hide();
		inputShown = false;		
		$(this).stopPropagation();
	});	


});




