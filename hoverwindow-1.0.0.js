/**
	hoverWindow displays a pop-up window when you hover over a content element.
	
	Typical usage:

	$(document).ready(function() {
		$('a').hoverWindow();
	});

	To specify an alternative way of calculating the URL to display:
	
	$(document).ready(function() {
		$('p').hoverWindow({ src : function(el) { return "http://localhost/lookup?"+el.attr("id"); } });
	});
	
	This plugin requires JQuery 1.4+ (it was developed under JQuery 1.4.0).

	Copyright (C) 2010, Inigo Surguy, 67 Bricks Ltd.
	Released under the terms of the Lesser GNU Public License.
	(see LICENSE.txt or http://www.gnu.org/licenses/lgpl-3.0.txt)
*/

(function($){ 
	$.fn.hoverWindow = function(options) {  
		var defaults = {  
			src : function(element) { return element.attr("href"); },
			log : function() { }
		};
		var options = $.extend(defaults, options);
		var log = options.log;
		log("Setting up hoverWindow");

		var selectedItem;

		var doPreview = function(itemToPreview) {
		    if (itemToPreview!=selectedItem || !itemToPreview) {
			log("Selected item has changed - cancelling preview");
			return;
		    }
		    if ($("#hoverWindow_searchPreviewPane").length == 0) {
		      $("body").append("<div id='hoverWindow_searchPreviewPane' style='position: absolute'><iframe src=''></iframe></div>");
		    }
		    var href = options.src(itemToPreview);    
		    var coords = new Object();
		    coords.top = Math.floor(selectedItem.offset().top)+10+selectedItem.height();
		    coords.left = Math.floor(selectedItem.offset().left)+50;
		    log("Showing preview pane at "+coords.top+","+coords.left+" for "+href);
		    $("#hoverWindow_searchPreviewPane iframe").attr("src", href);    
		    $("#hoverWindow_searchPreviewPane").offset(coords).fadeIn("fast");
		};

		var prepareForPreview = function() {
		    log("Preparing for preview - will do preview shortly");
		    if (selectedItem!=$(this)) {
			selectedItem = $(this);
			var href = options.src(selectedItem);
			$("#hoverWindow_searchPreviewPane iframe").attr("src", href);
			setTimeout(function() { doPreview(selectedItem); }, 1000);
		    }
		};

		var cancelPreview = function() {
		    log("Cancelling preview");
		    selectedItem = null;
		    $("#hoverWindow_searchPreviewPane").fadeOut("fast");
		};

		return this.hover(prepareForPreview, cancelPreview);
	};  
})(jQuery); 
