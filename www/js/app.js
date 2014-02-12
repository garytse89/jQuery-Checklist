/*global $:false */
/*jshint multistr: true */
/* jshint strict: false */
// declares to jshint that $ is a variable

var i=4; // counter``

var inputField = '<span><input type="text" name="name" id="inputField" placeholder="Enter list item" /></span>';
var inputButton = '<span><input type="button" value="Submit" id="inputButton"/></span>';

function createListItem() {
	var newItem = '<div class="checkbox"><input type="checkbox" name="checkbox-'+i+'" id="checkbox-'+i+'" class="custom" />\
                <label for="checkbox-'+i+'">' + $('#inputField').val() + '</label></div>';
    $('.list').append(newItem);
    $('[type="checkbox"]').checkboxradio();
    $( "div.checkbox" ).bind( "taphold", tapholdHandler );
  	i++;
}

function tapholdHandler( event ){
	//$( event.target ).addClass( "taphold" );
	alert('hi');
}

function createNewLabel() {
	var newLabel = '<div>' + $('#inputField').val() + '</div>';
	$('.list').append(newLabel);	
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