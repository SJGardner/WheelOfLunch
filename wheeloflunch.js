// Contens of lunchoptions.json.txt
var optionData;


$(document).ready(function () {

	var optionsName = getUrlParameter("options") || "lunchoptions";

	var folderLocation = window.location.pathname;
	var optionsLocation = folderLocation.substring(0, folderLocation.lastIndexOf('/')) + '/' + optionsName + '.json.txt';

	// Get the data that describes the options
	$.getJSON(optionsLocation, function (data) {
		optionData = data;

		if (data.name !== null) {
			$(document).prop('title', data.name);
			$("#wheelname").text(data.name);
		}

		// Add each option to the appropriate section
		$.each(data.lunchoption, function () {
			$('#lunchoptions').append('<div class="option">' + this.name + '</div>');
		});

		// Set the click handler for each option to toggle selection
		$('#lunchoptions .option').click(function () { $(this).toggleClass('selected'); });

		if (data.category !== null && data.category.length > 0) {
			// Add each category to the appropriate section
			$.each(data.category, function () {
				$('#categories').append('<div class="option">' + this.name + '</div>');
			});
		} else {
			$('#categoriesContainer').hide();
		}

		// Set the click handler for each category to call the category selection function
		$('#categories .option').click(function () {
			var category = $(this).html();

			if (category === 'All' || category === 'Clear') {
				$('#categories .option').each(function () {
					$(this).removeClass('selected');
				});
				var categories = [category];
				selectCategory(categories);
			} else {
				$(this).toggleClass('selected');
				seletedCategories();
			}

		});
	});

	// Set up the wheel. (This wheel with no options never gets used. It's just
	// here to fill the space of the wheel that will eventually be created after
	// options are selected.
	$('.wheel').jSlots({
		spinner: '#hidspin',
		number: 0
	});
});

//
function seletedCategories() {
	var categories = new Array();
	$('#categories .selected').each(function () {
		categories.push($(this).html());
	});
	selectCategory(categories);
}

// Selects the items that are contained in category with the given name
function selectCategory(category) {


	// Loop over all of the options
	var lunchoptions = $('#lunchoptions .option');
	for (var j = 0; j < lunchoptions.length; j += 1) {

		// If the current option is contained in the category, mark it as selected,
		// otherwise mark it as not selected
		var currentoption = $(lunchoptions.get(j));

		var meetsAll = false;
		// Loop over categories to find the one that matches the given text
		for (var i = 0; i < optionData.category.length; i += 1) {
			if ($.inArray(optionData.category[i].name, category) >= 0) {
				// this category is selected
				if (!optionData.category[i].members || $.inArray(currentoption.html(), optionData.category[i].members) >= 0) {
					meetsAll = true;
				} else {
					meetsAll = false;
					break;
				}
			}
		}

		if (meetsAll) {
			currentoption.addClass('selected');
		} else {
			currentoption.removeClass('selected');
		}
	}
}

// Creates a wheel and populates the items
function enableWheel() {
	// Remove the wheel option list
	$('#optionlistcontainer').empty();
	// Add the wheel option list
	$('#optionlistcontainer').append('<ul id="optionlist" class="wheel"></ul>');
	// Remove existing options
	$('#optionlist').empty();
	// Add an item for each selected lunch option
	$('#lunchoptions .selected').each(function () {
		$('#optionlist').append('<li>' + $(this).html() + '</li>');
	});

	// Change the wheel option list into a jSlots object
	$('.wheel').jSlots({
		spinner: '#hidspin',
		number: $('#optionlist li').length
	});
}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};