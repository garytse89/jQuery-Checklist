/*global $:false */
/*jshint multistr: true */
/* jshint strict: false */
// declares to jshint that $ is a variable

var listOfChecklists = {};

var jStorageTesting = false;
var listItems = {};
var currentChecklist = 'untitled'; // string name for list
var templateToLoad = null; // JSON string
var i=1; // one existing item so current counter starts off at 2

var inputField = '<span><input type="text" name="name" id="inputField" placeholder="Enter list item" /></span>';
var inputButton = '<span><input type="button" value="Submit" id="inputButton"/></span>';

function createListItem() {
	if( !$('#inputField').val() ) return;
	
	while(listItems['checkbox-'+i] != null){
		i++;
	}
	var itemNum = i;

	var newItem = '<div class="checkbox-'+itemNum+'"><input type="checkbox" name="checkbox-'+itemNum+'" id="checkbox-'+itemNum+'" class="custom" />\
                <label for="checkbox-'+itemNum+'">' + $('#inputField').val() + '</label></div>';
   
    $('.list').append(newItem);
    $('[type="checkbox"]').checkboxradio();

    $( "div.checkbox-"+itemNum ).bind( "taphold", function(event) {
    	$("div.checkbox-"+itemNum).remove(); 
    	delete listItems['checkbox-'+itemNum];
    	$.jStorage.set(currentChecklist, JSON.stringify(listItems));
    	i--;
    });

    i++;
    listItems['checkbox-'+itemNum] = $('#inputField').val();
    $.jStorage.set(currentChecklist, JSON.stringify(listItems)); 
}

function createNewLabel() {
	if( !$('#inputField').val() ) return;

	while(listItems['checkbox-'+i] != null){
		i++;
	}
	var itemNum = i;

	var newLabel = '<div class="label-'+itemNum+'"><span>' + $('#inputField').val() + '</span></div>';
	
	$('.list').append(newLabel);

	$( "div.label-"+itemNum ).bind( "taphold", function(event) {
    	$("div.label-"+itemNum).remove();
    	delete listItems['label-'+itemNum];
    	$.jStorage.set(templateToLoad, JSON.stringify(listItems));
    	i--;
    });

  	i++;	
  	listItems['label-'+itemNum] = $('#inputField').val();
  	$.jStorage.set(currentChecklist, JSON.stringify(listItems));	
}

function createExistingItem(key,item) {
	var newItem = '<div class="'+key+'"><input type="checkbox" name="'+key+'" id="'+key+'" class="custom" />\
                <label for="'+key+'">' + item + '</label></div>';

    $('.list').append(newItem);
    $('[type="checkbox"]').checkboxradio();

    $( 'div.'+key ).bind( "taphold", function(event) {
    	$( 'div.'+key ).remove(); 
    	delete listItems[key];
    	$.jStorage.set(currentChecklist, JSON.stringify(listItems));
    	i--;
    });

    //i++;	
}

function createExistingLabel(key,item) {
	var newLabel = '<div class="'+key+'">' + item + '</div>';

    $('.list').append(newLabel);

    $( 'div.'+key ).bind( "taphold", function(event) {
    	$( 'div.'+key ).remove(); 
    	delete listItems[key];
    	$.jStorage.set(currentChecklist, JSON.stringify(listItems));
    	i--;
    });

    //i++;	
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
	var n = Object.keys(listItems).length; // if there is at least one item in the current checklist, confirm its deletion with user
	if( n > 0 && templateToLoad == "untitled" ) {
		$("#confirmDelete").popup("open");
	}
}

function renderTemplates() {

	$('#listOfChecklists').remove();
	$('#templateGroup').append('<ul data-role="listview" id="listOfChecklists"></ul>');


	for (var key in listOfChecklists) {
		if (listOfChecklists.hasOwnProperty(key)) {
			if( key != "untitled" ) { // load untitled checklist in other page
		 		//$('#listOfChecklists').append('<li><a href="#confirmDelete" data-rel="popup" data-position-to="window">'+key+'</a></li>');	
		 		$('#listOfChecklists').append('<li id="listTemplate"><div id='+key+'><a href="#">'+key+'</a></div></li>');	
		 	}    	
		}
	}

 	$('#'+key).mouseup(function(){
 		currentChecklist = key;
 		console.log("Load checklist from TEMPLATE called " + currentChecklist);		
 		confirmDelete();
 		loadChecklist(listOfChecklists[currentChecklist]);
 	});
 	
 	// need a refresh for the list here

}

function clearCurrentList() {
	if( currentChecklist == "untitled" ) {
		$.jStorage.set('untitled', null);
	}
	else {
  		// quicksave
    	listOfChecklists[currentChecklist] = JSON.stringify(listItems);
		$.jStorage.set('listOfChecklists', listOfChecklists);
	}
	for (var key in listItems) {
	  	if (listItems.hasOwnProperty(key)) {
	  		$( 'div.'+key ).remove(); 	    	
	  	}
	}
	listItems = {};
	console.log('Cleared checklist');
}

function loadChecklist(template) {
	clearCurrentList();
	// load template from local storage and render it
	if( template ) { 
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
	}	

	// transition to current checklist page

}

// jQuery
$(document).ready(function() {	
	
	var db = openDatabase ("Test", "1.0", "Test", 65535); // local storage
	var addingItem = true;
	var storing = true; // for testing only
	var inputShown = false;

	// prepend text field to footer
	$('.inputGrid').append(inputField);
	$('.inputGrid').append(inputButton);
	// jquery mobile re-style
	$('[type="text"]').textinput();
	$('[type="button"]').button();

	$('.inputGrid').hide();	

	$('#newItem').mouseup(function(){
		if( inputShown == false ) {
			$('.inputGrid').show();
			addingItem = true;
			inputShown = true;
		}
		else {
			$('.inputGrid').hide();
			inputShown = false;
		}
	});

	$('#newLabel').mouseup(function(){
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

	/* Delete the whole list */
	$('#clear').mouseup(function(){ 
		clearCurrentList();
	});

	/* Save the list as a template */
	$('#save').mouseup(function(){
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
	$('#confirmLoadTemplate').mouseup(function(){
		loadChecklist(templateToLoad);
	});

	if( jStorageTesting == true ) {
		/* Testing only */
		$('#testStore').mouseup(function(){
			$('.inputGrid').show();
			addingItem = false;	
			storing = true;	
		});

		$('#testRetrieve').mouseup(function(){
			$('.inputGrid').show();
			addingItem = false;	
			storing = false;	
		});
		/**/
	}

	$('#inputButton').mouseup(function() {
		if( addingItem == true ) {
			createListItem();
		}
		else {
			if( jStorageTesting == true ) {
				/* Testing only */
				if( storing == true ) {
					testStore();
				}
				else {
					testRetrieve();
				}
			}
			createNewLabel();
		}

		$('#inputField').val('');
		$('.inputGrid').hide();
		inputShown = false;
		
		$(this).stopPropagation();
	});	

	// load existing checklist
	var existingChecklist = $.jStorage.get('untitled');
	loadChecklist(existingChecklist);
	
	$('[type="checkbox"]').checkboxradio();

	// load the template page
	listOfChecklists = $.jStorage.get('listOfChecklists') || {}; // if variable didn't exist in local storage, use empty object instead
	renderTemplates();

});