// Create list sorter
$.fn.listSorter = function() {
	return this.each(function() {
		var self = $(this);
		
		$(self).children('.sortFilters').children('a').each(function() {

			$(this).click(function(event) {
				event.preventDefault();
				
				var theFilter = $(this);
				
				if(!$(theFilter).hasClass('activeSortFilter')) {
					$(theFilter).parent().children('a').removeClass('activeSortFilter');
					$(theFilter).addClass('activeSortFilter');
					
					$(theFilter).parent().parent().children('.sortList').each(function(){
						$.fn.listSorter.SortList(
							$(this),
							$(theFilter).attr('data-SortByField'),
							$(theFilter).attr('data-SortDirection'));
					}); // each .sortList
					
				} // if

			}); // $(this).click
			
		}); //$(this).children
		
	}); // return
} // Constructor

// Sort the list
// theList - object - DOM elment to perform sort on
// sortBy  - string - name of HTML5 data- field by which to perform the sort
// sortDir - string - string designating which direction in which to perform the sort (asc or desc)
$.fn.listSorter.SortList = function (theList, sortBy, sortDir) {
	var listItems = $(theList).children('li').get();

	if(sortBy == '') {
		sortBy = 'alpha'
	}
	
	theList = $.fn.listSorter.RemoveClassesWithPrefix(theList, "sort_");
	$(theList).addClass('sort_' + sortBy + '_' + sortDir);
	
	listItems.sort(function(a, b) {
	   var compA = '', 
	   	   compB = '';
	   	   
	   if(sortBy != 'alpha') {
	   		compA = $.trim($(a).attr(sortBy));
	   		compB = $.trim($(b).attr(sortBy));
	   } else {
	   		compA = $.trim($(a).text().toLowerCase());
	   		compB = $.trim($(b).text().toLowerCase());
	   } // if sortBy
	   
	   return (compA < compB) ? -1 : (compA > compB) ? 1 : (compA == compB) ? 1 : 0;
	}); // sort
	
	if(sortDir == 'desc') {
		listItems.reverse();
	} // if
	
	for(var i = 0; i < listItems.length; i++) {
		listItems[i] = $.fn.listSorter.RemoveClassesWithPrefix(listItems[i], 'sortRank_');
		
		if(sortBy != "alpha") {
			$(listItems[i]).addClass('sortRank_' + sortBy + '_' + $(listItems[i]).attr(sortBy));
		} else {
			$(listItems[i]).addClass('sortRank_' + sortBy + '_' + $(listItems[i]).text().substring(0,1).toUpperCase());
		} // if
	} // for
	
	$.each(listItems, function(itemIndex, theItem) { theList.append(theItem); });
}

// Remove classes that match the designated prefix
// theElement  - object - DOM element from which to remove classes
// classPrefix - string - string used to designate which classes to remove
$.fn.listSorter.RemoveClassesWithPrefix = function (theElement, classPrefix) {
	var classList = $(theElement).attr('class').split(/\s+/);
	
	$.each(classList, function(classIndex, className) {
		if(className != "" && className.substring(0, classPrefix.length) == classPrefix) {
			$(theElement).removeClass(className);
		}
	});
	
	return theElement;
}