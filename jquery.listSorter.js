////////////////////////////////////////////////////////////////////////////////////////
// jQuery List Sorter Plugin v1.1
// Progressive enhancement technique for inital input field values
//
// The MIT License
//
// Copyright (c) 2007 Jan Szpila (aboyandhismac.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// param  - string
// return - array
////////////////////////////////////////////////////////////////////////////////////////

(function($) {
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
								$(theFilter).attr('data-SecondarySortField'),
								$(theFilter).attr('data-SortDirection'));
						}); // each .sortList
					} // if
				}); // $(this).click
			}); //$(this).children
		}); // return
	} // Constructor

	////////////////////////////////////////////////////////////////////////////////////////
	// Sort the list
	// theList       - object - DOM elment to perform sort on
	// sortBy        - string - name of field by which to perform the sort
	// secondarySort - string - name of field by which to perform secondary sort
	// sortDir       - string - direction of sort
	// return        - void
	////////////////////////////////////////////////////////////////////////////////////////
	$.fn.listSorter.SortList = function (theList, sortBy, secondarySort, sortDir) {
		var listItems = $(theList).children('li').get();

		// establish defaults if they are not specified
		if(!$.fn.listSorter.HasValue(sortBy)) {
			sortBy = 'alpha';
		} // if
		
		if(!$.fn.listSorter.HasValue(secondarySort)) {
			secondarySort = false;
		} // if
		
		if(!$.fn.listSorter.HasValue(sortDir)) {
			sortDir = 'asc';
		} // if		
		
		theList = $.fn.listSorter.RemoveClassesWithPrefix(theList, "sort_");
		$(theList).addClass('sort_' + sortBy + '_' + sortDir);
		
		listItems.sort(function(a, b) {
		   var compA   = $.fn.listSorter.GetComparisonValue(a, sortBy),
		   	   compB   = $.fn.listSorter.GetComparisonValue(b, sortBy),
		   	   compVal = null;
			
		  if(!secondarySort) {
		  	  compVal = (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		  } else {
			  if(compA != compB) {
			 		compVal = (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
			   } else {
			   		var compA2 = $.fn.listSorter.GetComparisonValue(a, secondarySort), 
		  	      		compB2 = $.fn.listSorter.GetComparisonValue(b, secondarySort);
		  	      
			   		compVal = (compA2 < compB2) ? 1 : (compA2 > compB2) ? -1 : 0;
			   } // if compA		  
		  } // if !secondarySort	

		   return compVal;
		}); // sort
	
		if(sortDir == 'desc') {
			listItems.reverse();
		} // if sortDir
	
		for(var i = 0; i < listItems.length; i++) {
			listItems[i] = $.fn.listSorter.RemoveClassesWithPrefix(listItems[i], 'sortRank_');
	
			if(sortBy != 'alpha') {
				$(listItems[i]).addClass('sortRank_' + sortBy + '_' + $(listItems[i]).attr(sortBy));
			} else {
				$(listItems[i]).addClass('sortRank_' + sortBy + '_' + $(listItems[i]).text().substring(0,1).toUpperCase());
			} // if
		} // for
	
		$.each(listItems, function(itemIndex, theItem){
			theList.append(theItem);
		}); // each
	} // SortList
	
	////////////////////////////////////////////////////////////////////////////////////////
	// Remove classes that match the designated prefix
	// theElement  - object - DOM element from which to remove classes
	// classPrefix - string - string used to designate which classes to remove
	// return      - object - DOM element with classes removed
	////////////////////////////////////////////////////////////////////////////////////////
	$.fn.listSorter.RemoveClassesWithPrefix = function (theElement, classPrefix) {
		var classList = $(theElement).attr('class').split(/\s+/);
	
		$.each(classList, function(classIndex, className) {
			if(className != "" && className.substring(0, classPrefix.length) == classPrefix) {
				$(theElement).removeClass(className);
			}
		}); // each
	
		return theElement;
	} //RemoveClassesWithPrefix

	////////////////////////////////////////////////////////////////////////////////////////
	// Helper method to get the value of the designated attribute for comparison purposes
	// theElement   - object - DOM element from which to remove classes
	// theAttribute - string - name of attribute to get the value of
	// return       - string - the value of the object's attribute
	////////////////////////////////////////////////////////////////////////////////////////	
	$.fn.listSorter.GetComparisonValue = function (theElement, theAttribute) {
		var theValue = '';
		
		if(theAttribute == 'alpha') {
			theValue = $.trim($(theElement).text().toLowerCase());
		} else {
			theValue = $.trim($(theElement).attr(theAttribute));
		}
	
		return theValue;
	} //GetComparisonValue

	////////////////////////////////////////////////////////////////////////////////////////
	// Helper method to determine if a variable is not null, undefined, or blank
	// theVar - object - DOM element from which to remove classes
	// return - bool   - if the variable is not null, empty, or undefined 
	////////////////////////////////////////////////////////////////////////////////////////	
	$.fn.listSorter.HasValue = function(theVar) {
		return typeof(theVar) != 'undefined' && theVar != null && theVar != "";
	} // HasValue
})(jQuery);