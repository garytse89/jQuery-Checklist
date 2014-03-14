/* Notes:
To use default jQuery Mobile styling, remove checkbox class tag
and run $('[type="checkbox"]').checkboxradio(); everytime a new checkbox is rendered
*/

var listOfChecklists = {};

var jStorageTesting = false; 
var currentChecklist = 'untitled'; // string name of the current list
var templateToLoad = null; // by default, app will load the checklist called 'untitled' and set this to be the contents of it (JSON)
var i=1; // enumeration counter for each list item or label; one existing item so current counter starts off at 2

listItems = {};

var inputField = '<div class="ui-block-a main"><input type="text" name="name" id="inputField" placeholder="Enter list item" /></div>';
var inputButton = '<div class="ui-block-b main"><input type="button" value="Add" id="inputButton" data-inline="false" data-icon="plus"/></div>';

function createNewItem() {
	if( !$('#inputField').val() ) return;

	var itemNum = i;

	var newItem = '<li><div class="checkbox-'+itemNum+'"><input class="css-checkbox" data-role="none" type="checkbox" name="checkbox-'+itemNum+'" id="checkbox-'+itemNum+'"  data-inline="true" />\
                <label for="checkbox-'+itemNum+'" class="css-label">' + $('#inputField').val() + '</label></div></li>';
   
    $('.list').append(newItem);

	$('#checkbox-'+itemNum).change( function(event) { 
		console.log('This checkbox is now checked or not? ' + $(this).is(':checked'));
		var parentChecked = $(this).is(':checked');
    	
    	$('#checkbox-'+itemNum).parent().parent().children('ul').find('input[type=checkbox]').prop( "checked", function( i, val ) {
  			return parentChecked;
		});

    });    

    i++;

    $.jStorage.set(currentChecklist, $('#checklist').html()); 
}

function createNewLabel() {
	if( !$('#inputField').val() ) return;

	var itemNum = i;

	var newLabel = '<li><div class="label-'+itemNum+' checklist-label"><span>' + $('#inputField').val() + '</span></div></li>';
	
	$('.list').append(newLabel);

  	i++;	
  	listItems['label-'+itemNum] = $('#inputField').val();
  	$.jStorage.set(currentChecklist, $('#checklist').html());
}

function createExistingItem(key,item) {
	var newItem = '<li><div class="'+key+'"><input class="css-checkbox" data-role="none" type="checkbox" name="'+key+'" id="'+key+'"/>\
                <label for="'+key+'" class="css-label">' + item + '</label></div></li>';

    $('.list').append(newItem);

    $('#'+key).change( function(event) { 
		console.log('check');
    	
    	$('#'+key).parent().parent().children('ul').find('input[type=checkbox]').prop( "checked", function( i, val ) {
			return !val;
		});
    });  

    i++;
    
    $.jStorage.set(currentChecklist, JSON.stringify(listItems));	
}

function createExistingLabel(key,item) {
	var newLabel = '<li><div class="'+key+' checklist-label">' + item + '</div></li>';

    $('.list').append(newLabel);

    // $( 'div.'+key ).bind( "taphold", function(event) {
    // 	$( 'div.'+key ).remove(); 
    // 	delete listItems[key];
    // 	$.jStorage.set(currentChecklist, JSON.stringify(listItems));
    // 	i--;
    // });

	i++;

    $.jStorage.set(currentChecklist, JSON.stringify(listItems));	
}

function testStore() {
	if( !$('#inputField').val() ) return;
	$.jStorage.set($('#inputField').val(), "someValue");
	alert('stored the value key = ' + $('#inputField').val() + ', value = someValue');
}

function testRetrieve() {
	if( !$('#inputField').val() ) return;
	alert('retrieved the value (hopefully = someValue): ' + $.jStorage.get($('#inputField').val()));
}

function confirmDelete() {
	if(listItems){
		var n = Object.keys(listItems).length; // if there is at least one item in the current checklist, confirm its deletion with user
		if( n > 0 && templateToLoad == "untitled" ) {
			$("#confirmDelete").popup("open");
		}
	}
}

function renderTemplates() {
	$('#listOfChecklists').remove();
	$('#templateGroup').append('<ul data-role="listview" id="listOfChecklists"></ul>');

	for (var key in listOfChecklists) {
		if (listOfChecklists.hasOwnProperty(key)) {
			if( key != "untitled" ) { // load untitled checklist in other page
		 		$('#listOfChecklists').append('<li id="listTemplate"><div id='+key+'><a href="#">'+key+'</a></div></li>');	
		 	}    	
		}
	}

 	$('#'+key).on('vclick', function(){
 		currentChecklist = key;
 		console.log("Load checklist from TEMPLATE called " + currentChecklist);		
 		confirmDelete();
 		loadChecklist(listOfChecklists[currentChecklist], true);
 	});
 	
}

function clearCurrentList() {
	if( currentChecklist == "untitled" ) {
		$.jStorage.set('untitled', null);
	}

	$('#checklist').empty();

	i = 1;

	console.log('Cleared checklist, should be nothing here: ' + $('#checklist').html());
}

function decodeURIandLoad(cl){
	cl = cl.replace("http://checklist/", "");
	var decodedChecklist = decodeURIComponent(cl);
	console.log(decodedChecklist);
	loadChecklist(decodedChecklist, true);
}

function loadChecklistFromHTML(html) {
	$('#checklist').append(html); 

	// reattach check listeners (to check all sublist items) to each existing item created from HTML
	eachListItem = $('#checklist').children('li').each( function() {
		$(this).children('div').children('input[type=checkbox]').change( function(event) { 
			var parentChecked = $(this).is(':checked');
	    	$(this).parent().parent().children('ul').find('input[type=checkbox]').prop( "checked", function( i, val ) {
	    		return parentChecked;
			});
	    }); 

		console.log('does this item have sublist? => ' + $(this).children('ul').length );
	 	if( $(this).children('ul').length != 0 ) {
	 		i += $(this).children('ul').length;
	 	}
		i++;
	});

	console.log('Existing items = ' + i);
}

function loadChecklist(template, transitionToHome) {
	clearCurrentList();
	// load template from local storage and render it
	console.log("Loading template = " + template);
	try {
		listItems = JSON.parse(template);
		for (var key in listItems) {
		  	if (listItems.hasOwnProperty(key)) {
		    	console.log(key + " -> " + listItems[key]);
		    	if( key.match("label") != null ) {
		    		createExistingLabel(key, listItems[key]);
		    	}
		    	else if( key.match("checkbox") != null ) {
		    		createExistingItem(key, listItems[key]);		    		
		    	}		    	
		  	}
		}

		// transition to current checklist page
		if(transitionToHome == true) {
			$.mobile.changePage('#home', {transition: 'slide', reverse: false});
		}
	} catch (err) {
		console.log("Template was not valid");
	}	
}

function resave(){
	// iterate through ul list

	$('ul#checklist > li').each(function() {

    	if( $(this).children('ul').html() == '' ) { 
    		// if sublist no longer exists, remove the (+) button
    		console.log('remove (+) button');
			$(this).children('div').children('a').remove();
    	} else if( typeof $(this).children('ul').html() != "undefined" && $(this).children('div').children('a').length == 0 ){ // cannot be undefined
    		// collapsable button is only added if it didn't exist already (jQuery selector for it should have length of 0 then)
    		console.log("we're adding a (+) button due to this html: " + $(this).children('ul').html());
    		var expandButton = '<a href="#" id="collapseButton">(-)</a>';
    		$(this).children('div').append(expandButton); // append '+' button   
    		allowCollapsableSublists();  		
    	}    	
	})

	$.jStorage.set(currentChecklist, $('#checklist').html());
	//$.jStorage.set(currentChecklist, JSON.stringify(listItems));
}

function allowSortable() {
	console.log('allow sortable');

    $('#checklist').nestedSortable({
        handle: 'div',
        items: 'li',
        toleranceElement: '> div'
    });    
}

function allowCollapsableSublists() {
	// this function is run on a nestedSortable->mouseStop(), since a new collapsable button is created and needs to have a listener
	// it is also run on the page loading to attach listeners to all existing collapsable buttons
	$('#collapseButton').on('vclick', function(){
		console.log("Collapse button is working");
		$(this).parent().parent().children('ul').toggle('fast');
		$(this).toggleClass('collapsed');
		if( $(this).hasClass('collapsed') ) {
			// if collapsed, the button should become '+'
			$(this).text("(+)");
		}
		else {
			$(this).text("(-)");
		}
	});
}

$(document).ready(function() {	

	allowSortable();

	// $('#checklist').on('mouseleave', sayHi); // triggers every time a dragged item passes by another one
	// for a 'finished-dragging' event, refer to mouseStop() in nestedSortable.js

	var db = openDatabase ("Test", "1.0", "Test", 65535); // local storage
	var addingItem = true;
	var storing = true; // for testing only
	var inputShown = false;

	// prepend text field to footer
	$('#inputGrid').append(inputField);
	$('#inputGrid').append(inputButton);
	// jquery mobile re-style
	$('[type="text"]').textinput();
	$('[type="button"]').button();

	$('#inputGrid').hide();	

	$('#newItem').on('vclick', function(){
		if( inputShown == false ) {
			$('#inputGrid').show();
			addingItem = true;
			inputShown = true;			
		}
		else {
			$('#inputGrid').hide();
			inputShown = false;		
			setTimeout(function(){
				$('#newItem').children('a').removeClass('ui-btn-active');
			},0);			
		}		
	});

	$('#newLabel').on('vclick', function(){
		$('#inputGrid').show();
		if( inputShown == false ) {
			$('#inputGrid').show();
			addingItem = false;
			inputShown = true;
		}
		else {
			$('#inputGrid').hide();
			inputShown = false;
			setTimeout(function(){
				$('#newLabel').children('a').removeClass('ui-btn-active');
			},0);	
		}	
	});

	$('#templatesLink').on('vclick', function(){
		// load page manually instead of using the a href link, which uses the default slow click
		$.mobile.changePage('#templates', {transition: 'slide'});
	});

	$('#homeLink').on('vclick', function(){
		// load page manually instead of using the a href link, which uses the default slow click
		$.mobile.changePage('#home', {transition: 'slide', reverse: true});
	});

	/* Delete the whole list */
	$('#clearDialogLaunch').on('vclick', function(){ 
		$('#clearDialog').popup("open");
	});

	$('#clear').on('vclick', function(){ 
		clearCurrentList();
	});

	/* Share the list */
	$('#shareDialogLaunch').on('vclick', function(){
		console.log(JSON.stringify(listItems));
		var encodedURL = 'http://checklist/' + encodeURIComponent(JSON.stringify(listItems));
		console.log("Send out this URL: " + encodedURL);
		window.plugins.socialsharing.share(null, null, null, encodedURL);
	});

	/* Save the list as a template */
	$('#saveDialogLaunch').on('vclick', function(){ 
		$('#saveDialog').popup("open");
	});

	$('#save').on('vclick', function(){

		var savedListName = $('#saveField').val().replace(/\s/g,"-"); // replace spaces with hyphens for valid id

		// save the list into local storage
		var savedListString = JSON.stringify(listItems);
		$.jStorage.set(savedListName, savedListString);
		console.log("Saved list named: " + savedListName + " and the list looks like this:\n" + savedListString);
		$.jStorage.set('untitled', null); // wipe untitled list

		// save the templates into local storage
		listOfChecklists[savedListName] = savedListString;
		$.jStorage.set('listOfChecklists', listOfChecklists);

		renderTemplates();
	});

	/* Template page template links */
	$('#confirmLoadTemplate').on('vclick', function(){
		loadChecklist(templateToLoad, true);
	});

	if( jStorageTesting == true ) {
		/* Testing only */
		$('#testStore').on('vclick', function(){
			$('#inputGrid').show();
			addingItem = false;	
			storing = true;	
		});

		$('#testRetrieve').on('vclick', function(){
			$('#inputGrid').show();
			addingItem = false;	
			storing = false;	
		});
		/**/
	}

	/* Load a list as a template */
	$('#loadDialogLaunch').on('vclick', function(){ 
		$('#loadDialog').popup("open");
	});

	$('#load').on('vclick', function(){
		decodeURIandLoad($('#loadField').val());
	});

	/* Input field for new items or labels */

	$("#inputField").focus(function() {
	    $(this).data("hasfocus", true);
	});

	$("#inputField").blur(function() {
	    $(this).data("hasfocus", false);
	});

	$(document.body).keyup(function(ev) {
	    // 13 is ENTER
	    if (ev.which === 13 && $("#inputField").data("hasfocus")) {
	        console.log("enter key");
	        addItemOrLabel();
	    }
	});

	function addItemOrLabel() {
		if( addingItem == true ) {
			createNewItem();
		}
		else {
			createNewLabel();
		}
		$('#inputField').val('');
	}

	$('#inputButton').on('vclick', function() {
		addItemOrLabel();
	});	

	// load existing checklist
	var existingChecklist = $.jStorage.get('untitled');
	//loadChecklist(existingChecklist, false);
	loadChecklistFromHTML(existingChecklist);

	// load the template page
	listOfChecklists = $.jStorage.get('listOfChecklists') || {}; // if variable didn't exist in local storage, use empty object instead
	renderTemplates();

	allowCollapsableSublists();
});