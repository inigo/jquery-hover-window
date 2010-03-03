/**
	hoverWindow displays a pop-up window when you hover over a content element.
	
	Typical usage (which will use the href attribute to display an iframe)

	$(document).ready(function() {
		$('a').hoverWindow();
	});

	Full options:
	
		$('p').hoverWindow({
			src : function(el) { return "http://localhost/lookup?"+el.attr("id"); } ,
			log : function(message) { myLogger.debug(message); },
			timeBeforeShow: 1000,
			timeBeforeHide: 500
		});
	
	This plugin requires JQuery 1.4+ (it was developed under JQuery 1.4.2).

	Copyright (C) 2010, Inigo Surguy, 67 Bricks Ltd.
	Released under the terms of the Lesser GNU Public License.
	(see LICENSE.txt or http://www.gnu.org/licenses/lgpl-3.0.txt)
*/

(function($){ 
	$.fn.hoverWindow = function(options) {  
		var defaults = {  
			src : function(element) { return element.attr("href"); },
			log : function() { },
			timeBeforeShow: 1000,
			timeBeforeHide: 500
		};
		var options = $.extend(defaults, options);
		var log = options.log;
		log("Setting up hoverWindow");

		var selectedItem;
		var cancellingPreview;

		var doPreview = function(itemToPreview) {
		    if (itemToPreview!=selectedItem || !itemToPreview) {
			log("Selected item has changed - cancelling preview");
			return;
		    }
		    var previewPane = $("#hoverWindow_searchPreviewPane");
		    var href = options.src(itemToPreview); 
		    var coords = new Object();
		    coords.top = Math.floor(selectedItem.offset().top)+10+selectedItem.height();
		    coords.left = Math.floor(selectedItem.offset().left)+50;
		    log("Showing preview pane at "+coords.top+","+coords.left+" for "+href);
		    $("#hoverWindow_searchPreviewPane iframe").attr("src", href);    
		    previewPane.offset(coords).fadeIn("fast");
		};

		var prepareForPreview = function() {
		    log("Preparing for preview - will do preview shortly");
		    cancellingPreview = null;
		    if (selectedItem!=$(this)) {
			selectedItem = $(this);
			var href = options.src(selectedItem);
		        var previewPane = $("#hoverWindow_searchPreviewPane");
			if (previewPane.length == 0) {
			  $("body").append("<div id='hoverWindow_searchPreviewPane' style='position: absolute'><iframe src=''></iframe></div>");
			  previewPane = $("#hoverWindow_searchPreviewPane");
			  previewPane.hover(function() { cancellingPreview = null; }, prepareToCancel);
			}
			var previewFrame = $("#hoverWindow_searchPreviewPane iframe");
			if (previewFrame.attr("src")!=href) {
				previewFrame.attr("src", href);
		    		previewPane.filter(":visible").fadeOut("fast");
				log("Preview href has changed - now "+href+" but was "+previewFrame.attr("src"));
			} else {
				log("Preview href has not changed - now "+href+" but was "+previewFrame.attr("src"));
			}
			setTimeout(function() { doPreview(selectedItem); }, options.timeBeforeShow);
		    }
		};

		var cancelPreview = function() {
		    if (cancellingPreview) {
			log("Cancelling preview");
			selectedItem = null;
			cancellingPreview = null;
			$("#hoverWindow_searchPreviewPane").fadeOut("fast");
		    } else {
			log("Not cancelling preview - called, but no longer cancelling");
		    }
		};

		var prepareToCancel = function() {
		    if (!cancellingPreview) {
			cancellingPreview = true;
		    	setTimeout(cancelPreview, options.timeBeforeHide);
		    }
		}

		return this.hover(prepareForPreview, prepareToCancel);
	};  
})(jQuery); 
