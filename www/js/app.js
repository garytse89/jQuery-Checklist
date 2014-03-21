/* Notes:
To use default jQuery Mobile styling, remove checkbox class tag
and run $('[type="checkbox"]').checkboxradio(); everytime a new checkbox is rendered
*/

var listOfChecklists = {};

var jStorageTesting = false; 
var currentChecklist = 'untitled'; // string name of the current list
var templateToLoad = null; // by default, app will load the checklist called 'untitled' and set this to be the contents of it (JSON)
var i=1; // enumeration counter for each list item or label; one existing item so current counter starts off at 2

var inputField = '<div class="ui-block-a main"><input type="text" name="name" id="inputField" placeholder="Enter list item" /></div>';
var inputButton = '<div class="ui-block-b main"><input type="button" value="Add" id="inputButton" data-inline="false" data-icon="plus"/></div>';

$.event.special.tap.emitTapOnTaphold = false;
var checkboxBeingRenamed = undefined;
var labelBeingRenamed = undefined;

function createNewItem() {
	if( !$('#inputField').val() ) return;

	var itemNum = i;

	var newItem = '<li><div class="checkbox-'+itemNum+'"><input class="css-checkbox" data-role="none" type="checkbox" name="checkbox-'+itemNum+'" id="checkbox-'+itemNum+'"  data-inline="true" />\
                <label for="checkbox-'+itemNum+'" class="css-label">' + $('#inputField').val() + '</label></div></li>';
   
    $('.list').append(newItem);

    // add this new checkbox to the array, in the format of {jQuery selector, checkbox, checked, label, order}
    listItems.push( {
    	"selector" : $('.checkbox-'+itemNum),
    	"label" : $('#inputField').val(),
    	"checkbox" : true, // label would be false
    	"checked" : false,
    	"order" : itemNum, // probably not needed....
    });

	$('#checkbox-'+itemNum).change( function(event) { 
		console.log('Is this a sublist item?');
		console.log($(this).parent().parent().parent().parent().children('div').children('a').length);

		// if this is a sublist item
		if( $(this).parent().parent().parent().parent().children('div').children('a').length > 0 ) {
			console.log('yes');

			var otherItemsChecked = true;

			$(this).parent().parent().parent().children('li').each( function() {
				otherItemsChecked = otherItemsChecked && $(this).children('div').children('input[type=checkbox]').is(':checked');
				console.log("are other items checked? " + otherItemsChecked);
			});

			if( otherItemsChecked == true ) {
				// check the parent as well
				$(this).parent().parent().parent().parent().children('div').children('input[type=checkbox]').prop( "checked", true);
			} else if( otherItemsChecked == false )  {
				// if one sublist item is unchecked, uncheck the parent
				$(this).parent().parent().parent().parent().children('div').children('input[type=checkbox]').prop( "checked", false);
			}
		}

		else {

			var parentChecked = $(this).is(':checked');
	    	
	    	$('#checkbox-'+itemNum).parent().parent().children('ul').find('input[type=checkbox]').prop( "checked", function( i, val ) {
	  		    return parentChecked;
			});			

			console.log("turned a checkbox into->" + parentChecked);

			// the following code is for collapsing each labelled section - we only care if the parent is checked or not
		   	// since if a section's sublist item is unchecked, its parent will not be checked regardless
			listItems.forEach(function(element) {
		    	if( element.order == itemNum ) {
		    		element.checked = parentChecked;
		    	}
		    });

		    checkForCollapsableSection();
	    }
    }); 

    $( 'div.checkbox-'+itemNum ).bind( "taphold", function(event) {
    	console.log("Rename, cut off click or mouseup for now");
    	$('#inputGrid').hide(); // if input grid was visible, hide it now
    	$('#renameGrid').show();
    	$('#renameField').val($(this).children('label').text());

    	checkboxBeingRenamed = $('#checkbox-'+itemNum);

    	// add class to indicate renaming
    	$(this).toggleClass('rename');

    	$('#checkbox-'+itemNum).on('click mouseup', function(e) {
	    	console.log("Stop propagation of normal mouse click (prevent checkbox) due to taphold (rename)");
	    	e.stopPropagation();
	    	e.preventDefault();
	    });
    });  
    i++;

    //checkForCollapsableSection();

    $.jStorage.set(currentChecklist, $('#checklist').html()); 
}

function createNewLabel() {
	if( !$('#inputField').val() ) return;

	var itemNum = i;

	var newLabel = '<li class = "mjs-nestedSortable-no-nesting"><div class="label-'+itemNum+' checklist-label"><span>' + $('#inputField').val() + '</span></div></li>';
	
	$('.list').append(newLabel);

	// add this new checkbox to the array, in the format of {jQuery selector, checkbox, checked, label, order}
    listItems.push( {
    	"selector" : $('.label-'+itemNum),
    	"value" : $('#inputField').val(),
    	"checkbox" : false, // label would be false
    	"checked" : false, 
    	"order" : itemNum, // probably not needed....
    });

    // allow renaming
    $( 'div.label-'+itemNum ).bind( "taphold", function(event) {
    	console.log("Rename, cut off click or mouseup for now");
    	$('#inputGrid').hide(); // if input grid was visible, hide it now
    	$('#renameGrid').show();
    	$('#renameField').val($(this).children('span').text());

    	$(this).toggleClass('rename');
    	checkboxBeingRenamed = undefined;
    	labelBeingRenamed = $(this).children('span');
    }); 

  	i++;	
  	$.jStorage.set(currentChecklist, $('#checklist').html());
}

function checkForCollapsableSection() {
	for( i=0; i<listItems.length; i++ ) {
		// find a label, which is means checkbox attribute = false
		if( listItems[i].checkbox == false ) {
			var j = i+1;
			var beginningElement = j;
			var allItemsChecked = true;
			while( j<listItems.length && listItems[j].checkbox == true ) {
				console.log("Check if this item is checked: " + listItems[j].label + " = " + listItems[j].checked); // check if each checkbox is checked
				allItemsChecked = allItemsChecked & listItems[j].checked;
				if(allItemsChecked == false) break;
				j++;
			}
			console.log("are all items under the label checked? " + allItemsChecked);

			// allow section to collapse
			/* 
			beginningElement-1 is the index in the listItems array corresponding to the label
			beginningElement is the index of the first checkbox item
			*/

			if( allItemsChecked == true ) {
				var newSection = [];
				newSection.push(listItems[beginningElement-1].selector);

				for( k = beginningElement; k<j; k++ ) {
					listItems[k].selector.hide('slow');
					newSection.push(listItems[k].selector);
				}

				sectionedItems.push(newSection);

				var expandButton = '<a href="#" id="collapseSectionButton">(+)</a>'; // start off by collapsing, so display (+)
    			listItems[beginningElement-1].selector.append(expandButton); // append '+' button   
    			allowCollapsableSections();  

    			console.log("Dynamically add collapse/expand button to section label denoted by listItems[" + (beginningElement-1) + "]");
			} else {
				console.log("Label no longer has all ticked checkboxes, remove +/- button");
				listItems[beginningElement-1].selector.children('a').remove();
			}

			i=j; // continue searching for next label in for-loop
		}
	}
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

	listItems = [];
	bareListArray = [];
	sectionedItems = [];

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

function isChildItem() {

}

function isParentItem(selector){
	// is this checkbox selector a parent item?
	if( selector.children('ul').length != 0 ) 
		return true;
	else 
		return false;
}

function listToBareArray() {
	// like list to array but it only contains the values

	bareListArray = [];
	eachListItem = $('#checklist').children('li').each( function() {

		if( $(this).children('div').is('[class^="label"]') == true ) {
			bareListArray.push( {
		    	"label-text" : $(this).children('div').children('span').text(),
		    });
		} else {
			if( isParentItem($(this)) == true ) {
				var sublistObject = [];
				$(this).children('ul').children('li').each( function() {
					sublistObject.push( {
				    	"sublist-checkbox-label" : $(this).children('div').children('label').text(),
					});
				});

				bareListArray.push( {
			    	"checkbox-label" : $(this).children('div').children('label').text(),
			    	"sublist" : sublistObject,
			    });		

			} else {
				bareListArray.push( {
					"checkbox-label" : $(this).children('div').children('label').text(),
			    });	
			}
		}

	});

	console.log(JSON.stringify(bareListArray));

}

function listToArray(){
	//var start = window.performance.now();

	listItems = [];
	eachListItem = $('#checklist').children('li').each( function() {

		// add checkbox-item or label to current checklist array
		//console.log("is this a checkbox? " + $(this).children('div').is('[class^="label"]'));

		// each selector corresponds to the wrapping <div>
		if( $(this).children('div').is('[class^="label"]') == true ) {
			listItems.push( {
		    	"selector" : $(this).children('div'), // to test: console.log($(this).children('div').html());
		    	"value" : $(this).children('div').children('span').text(),
		    	"checkbox" : false, // label would be false
		    	"checked" : false,
		    	"order" : i, // probably not needed....
		    });

		    i++;
		} else {			

			if( isParentItem($(this)) == true ) {
				// push each sublist item into sublist
				var sublistObject = [];
				var counter = 1;

				$(this).children('ul').children('li').each( function() {
					sublistObject.push( {
						"selector" : $(this).children('div'),
				    	"label" : $(this).children('div').children('label').text(),
				    	"checkbox" : true, // label would be false
				    	"checked" : false,
				    	"order" : counter, // probably not needed....
					});
					counter++;
				});

				listItems.push( {
			    	"selector" : $(this).children('div'),
			    	"label" : $(this).children('div').children('label').text(),
			    	"checkbox" : true, // label would be false
			    	"checked" : false,
			    	"order" : i, // probably not needed....
			    	"sublist" : sublistObject,
			    });		    	

			    i++;

			} else {

				listItems.push( {
			    	"selector" : $(this).children('div'), // <input class="css-checkbox"....><label>...
			    	"label" : $(this).children('div').children('label').text(),
			    	"checkbox" : true, // label would be false
			    	"checked" : false,
			    	"order" : i, // probably not needed....
			    });			    

			    i++;
			}
		}
	});

	//var end = window.performance.now();
	//var time = end - start;
	//console.log('Execution time (in milliseconds) ' + time);
}

function loadChecklistFromHTML(html) {
	$('#checklist').append(html); 

	// reattach check listeners (to check all sublist items) to each existing item created from HTML
	// for each item, 1) add it to current checklist array, and 2) attach event listener (based on checkbox changes)
	eachListItem = $('#checklist').children('li').each( function() {

		$(this).children('div').children('input[type=checkbox]').change( function(event) { 
			//console.log('Is this a sublist item?');
			//console.log($(this).parent().parent().parent().parent().children('div').children('a').length);

			// if this is a sublist item
			if( $(this).parent().parent().parent().parent().children('div').children('a').length > 0 ) {
				console.log('yes');

				var otherItemsChecked = true;

				$(this).parent().parent().parent().children('li').each( function() {
					otherItemsChecked = otherItemsChecked && $(this).children('div').children('input[type=checkbox]').is(':checked');
					console.log("are other items checked? " + otherItemsChecked);
				});

				if( otherItemsChecked == true ) {
					// check the parent as well
					$(this).parent().parent().parent().parent().children('div').children('input[type=checkbox]').prop( "checked", true);
				} else if( otherItemsChecked == false )  {
					// if one sublist item is unchecked, uncheck the parent
					$(this).parent().parent().parent().parent().children('div').children('input[type=checkbox]').prop( "checked", false);
				}
			}

			else {

				var parentChecked = $(this).is(':checked');

			   	$(this).parent().parent().children('ul').find('input[type=checkbox]').prop( "checked", function( i, val ) {
		  			return parentChecked;
				});

			   	// the following code is for collapsing each labelled section - we only care if the parent is checked or not
			   	// since if a section's sublist item is unchecked, its parent will not be checked regardless
				//console.log($(this).parent().attr('class').replace('checkbox-','')); // to get the '4' in 'checkbox-4', we get the checkbox's
				// parent (div), its class ('checkbox-4'), then take out the 'checkbox-' string
				var checkboxNum = $(this).parent().attr('class').replace('checkbox-','');
				listItems.forEach(function(element) {					
			    	if( element.order == checkboxNum ) {
			    		element.checked = parentChecked;
			    	}
			    });

			    checkForCollapsableSection();
		    }		    
	    }); 

		$(this).children('div').bind( "taphold", function(event) {
	    	console.log("Rename, cut off click or mouseup for now");
	    	$('#inputGrid').hide(); // if input grid was visible, hide it now
	    	$('#renameGrid').show();
	    	if( $(this).children('label').text() ) {
	    		$('#renameField').val($(this).children('label').text()); // if item
	    		checkboxBeingRenamed = $(this).children('input[type=checkbox]');

	    		$(this).toggleClass('rename');

	    		$(this).children('input[type=checkbox]').on('click mouseup', function(e) {
			    	console.log("Stop propagation of normal mouse click (prevent checkbox) due to taphold (rename)");
			    	e.stopPropagation();
			    	e.preventDefault();
			    });
	    	} else if( labelBeingRenamed != undefined ) {
	    		$(this).toggleClass('rename');
	    		$('#renameField').val($(this).children('span').text()); // if label, not item
	    		labelBeingRenamed = $(this).children('span');
	    		checkboxBeingRenamed = undefined;	    		
	    	}		    	
	    });  

	});

	listToArray();
	listToBareArray();

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
	
	// mouse drag finished, add back taphold listeners for renaming
	eachListItem = $('#checklist').children('li').each( function() {
		$(this).children('div').bind( "taphold", function(event) {
	    	console.log("Rename, cut off click or mouseup for now");
	    	$('#inputGrid').hide(); // if input grid was visible, hide it now
	    	$('#renameGrid').show();
	    	if( $(this).children('label').text() ) {
	    		$('#renameField').val($(this).children('label').text()); // if item
	    		checkboxBeingRenamed = $(this).children('input[type=checkbox]');

	    		$(this).toggleClass('rename');

	    		$(this).children('input[type=checkbox]').on('click mouseup', function(e) {
			    	console.log("Stop propagation of normal mouse click (prevent checkbox) due to taphold (rename)");
			    	e.stopPropagation();
			    	e.preventDefault();
			    });
	    	} else {
	    		$(this).toggleClass('rename');
	    		$('#renameField').val($(this).children('span').text()); // if label, not item
	    		labelBeingRenamed = $(this).children('span');
	    		checkboxBeingRenamed = undefined;	    		
	    	}		    	
	    });
	});

	// if item or label was also being renamed and then dragged, cancel that
	cancelRename();

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

	listToArray();
	listToBareArray();

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

function allowCollapsableSections() {
	// this function is run on a nestedSortable->mouseStop(), since a new collapsable button is created and needs to have a listener
	// it is also run on the page loading to attach listeners to all existing collapsable buttons
	$('#collapseSectionButton').on('vclick', function(){

		for( j=0; j<sectionedItems.length; j++ ) {
			for( i=0; i<listItems.length; i++ ) {
				if( sectionedItems[j][0] == listItems[i].selector ) {
					console.log("section label found!");
					for( k=1; k<sectionedItems[j].length; k++ ) {
						sectionedItems[j][k].toggle('slow');
					}
				}
			}
		}

		$(this).toggleClass('collapsed');
		if( $(this).hasClass('collapsed') ) {
			// if collapsed, the button should become '+'
			$(this).text("(-)");
		}
		else {
			$(this).text("(+)");
		}
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

function changeName() {
	console.log("lets try renaming");
	if(checkboxBeingRenamed != undefined) {
		checkboxBeingRenamed.next('label').text($('#renameField').val());
		checkboxBeingRenamed.off('click mouseup');
		checkboxBeingRenamed.parent().toggleClass('rename');
	} else if( labelBeingRenamed != undefined ) { 
		labelBeingRenamed.text($('#renameField').val());
		labelBeingRenamed.parent().toggleClass('rename');
	}

	$('#renameGrid').hide();

	$.jStorage.set(currentChecklist, $('#checklist').html()); 
}

function cancelRename() {
	if( checkboxBeingRenamed != undefined ) {
		console.log('rebind checkbox');
		checkboxBeingRenamed.off('click mouseup');
		checkboxBeingRenamed.parent().removeClass('rename');
	} else if( labelBeingRenamed != undefined ) { 
		labelBeingRenamed.parent().removeClass('rename');
	}

	$('#renameGrid').hide();
}

function mouseDragDetected(sth, pos) {
	// disable taphold for all items
	console.log("Mouse drag detected, disable rename, moved = " + pos);
	eachListItem = $('#checklist').children('li').each( function() {
		$(this).children('div').off('taphold');
	});

	something = sth;

	if( pos < -20 ) {
		// treat as a swipe left delete
		console.log('remove ');
	}
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
	// $('#inputGrid').append(inputField);
	// $('#inputGrid').append(inputButton);
	// jquery mobile re-style
	$('[type="text"]').textinput();
	$('[type="button"]').button();

	$('#inputGrid').hide();	
	$('#renameGrid').hide();	

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
	// as JSON URI
	$('#shareDialogLaunch').on('vclick', function(){
		console.log("share");
		doAppendFile();
		// console.log(JSON.stringify(listItems));
		// var encodedURL = 'http://checklist/' + encodeURIComponent(JSON.stringify(listItems));
		// console.log("Send out this URL: " + encodedURL);
		// window.plugins.socialsharing.share(null, null, null, encodedURL);
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

	$('#renameButton').on('vclick', function() {
		changeName();
	});	

	$('#cancelRenameButton').on('vclick', function() {
		cancelRename();
	});	

	// load existing checklist
	var existingChecklist = $.jStorage.get('untitled');
	//loadChecklist(existingChecklist, false);
	loadChecklistFromHTML(existingChecklist);

	// load the template page
	listOfChecklists = $.jStorage.get('listOfChecklists') || {}; // if variable didn't exist in local storage, use empty object instead
	renderTemplates();

	allowCollapsableSublists();

	// temporary
	sectionedItems = [];
});