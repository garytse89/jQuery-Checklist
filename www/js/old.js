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