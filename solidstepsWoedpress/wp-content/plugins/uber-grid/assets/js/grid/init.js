(function(jQuery) {
	var $;
	if (!jQuery) {
		alert("Message from UberGrid: jQuery not found!");
	} else if (parseInt(jQuery().jquery.replace(/\./g, "")) < 172) {
		alert("Message from UberGrid You have jQuery < 1.7.2. Please upgrade your jQuery or enable \"Force new jQuery version\" option at UberGrid settings page.");
	} else {
		if (!Packery) {
			alert("Message from UberGrid: Packery library is not loaded. Please contact UberGrid developer for help.");
		} else {
			$ = jQuery;
			<%= contents %>
			window.UberGrid = UberGrid;
		}
	}
})(window.uberGridjQuery || window.jQuery || window.$ || jQuery || $);

