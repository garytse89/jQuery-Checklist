/*global $:false */
/*jshint multistr: true */
/* jshint strict: false */
// declares to jshint that $ is a variable

var jStorageTesting = false;
var listItems = {};
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
    	$.jStorage.set('untitled', JSON.stringify(listItems));
    	i--;
    });

    i++;
    listItems['checkbox-'+itemNum] = $('#inputField').val();
    $.jStorage.set('untitled', JSON.stringify(listItems)); 
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
    	$.jStorage.set('untitled', JSON.stringify(listItems));
    	i--;
    });

  	i++;	
  	listItems['label-'+itemNum] = $('#inputField').val();
  	$.jStorage.set('untitled', JSON.stringify(listItems));	
}

function createExistingItem(key,item) {
	var newItem = '<div class="'+key+'"><input type="checkbox" name="'+key+'" id="'+key+'" class="custom" />\
                <label for="'+key+'">' + item + '</label></div>';

    $('.list').append(newItem);
    $('[type="checkbox"]').checkboxradio();

    $( 'div.'+key ).bind( "taphold", function(event) {
    	$( 'div.'+key ).remove(); 
    	delete listItems[key];
    	$.jStorage.set('untitled', JSON.stringify(listItems));
    	i--;
    });

    i++;	
}

function createExistingLabel(key,item) {
	var newLabel = '<div class="'+key+'">' + item + '</div>';

    $('.list').append(newLabel);

    $( 'div.'+key ).bind( "taphold", function(event) {
    	$( 'div.'+key ).remove(); 
    	delete listItems[key];
    	$.jStorage.set('untitled', JSON.stringify(listItems));
    	i--;
    });

    i++;	
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

	$('#clear').mouseup(function(){
		$.jStorage.set('untitled', null);
		for (var key in listItems) {
		  	if (listItems.hasOwnProperty(key)) {
		  		$( 'div.'+key ).remove(); 	    	
		  	}
		}
		listItems = {};
		console.log('Cleared checklist');
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
	if( existingChecklist ) { // does an untitled checklist exist?
		listItems = JSON.parse(existingChecklist);
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

	$('[type="checkbox"]').checkboxradio();

});