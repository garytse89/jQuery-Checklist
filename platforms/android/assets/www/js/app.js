/*global $:false */
/*jshint multistr: true */
/* jshint strict: false */
// declares to jshint that $ is a variable

var i=2; // one existing item so current counter starts off at 2

var inputField = '<span><input type="text" name="name" id="inputField" placeholder="Enter list item" /></span>';
var inputButton = '<span><input type="button" value="Submit" id="inputButton"/></span>';

function createListItem() {
	if( !$('#inputField').val() ) return;
	var itemNum = i;
	var newItem = '<div class="checkbox-'+itemNum+'"><input type="checkbox" name="checkbox-'+itemNum+'" id="checkbox-'+itemNum+'" class="custom" />\
                <label for="checkbox-'+itemNum+'">' + $('#inputField').val() + '</label></div>';
    $('.list').append(newItem);
    $('[type="checkbox"]').checkboxradio();

    $( "div.checkbox-"+itemNum ).bind( "taphold", function(event) {
    	$("div.checkbox-"+itemNum).remove(); 
    });

  	i++;
}

function createNewLabel() {
	if( !$('#inputField').val() ) return;
	var itemNum = i;
	var newLabel = '<div class="label-'+itemNum+'">' + $('#inputField').val() + '</div>';
	$('.list').append(newLabel);

	$( "div.label-"+itemNum ).bind( "taphold", function(event) {
    	$("div.label-"+itemNum).remove();
    });

  	i++;	
}

// jQuery
$(document).ready(function() {	
	var listItems = new Array();
	var addingItem = true;

	// prepend text field to footer
	$('.inputGrid').append(inputField);
	$('.inputGrid').append(inputButton);
	// jquery mobile re-style
	$('[type="text"]').textinput();
	$('[type="button"]').button();

	$('.inputGrid').hide();	

	$('#newItem').mouseup(function(){
		$('.inputGrid').show('fast');
		addingItem = true;
	});

	$('#newLabel').mouseup(function(){
		$('.inputGrid').show('fast');
		addingItem = false;		
	});

	$('#inputButton').mouseup(function() {
		if( addingItem == true ) {
			createListItem();
		}
		else {
			createNewLabel();
		}

		$('#inputField').val('');
		$('.inputGrid').hide('fast');
		
		$(this).stopPropagation();
	});	

});