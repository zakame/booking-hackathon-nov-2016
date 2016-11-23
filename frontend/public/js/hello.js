(function($) {
  
  $(document).ready( function() { 

  var wall = new Freewall('#freewall');
  wall.reset({
		selector: '.cell',
		animate: true,
		cellW: 200,
		cellH: 200,
		onResize: function() {
			wall.fitWidth();
		}
	});
  wall.fitWidth();
  // for scroll bar appear;
	$(window).trigger("resize");


 	});

})(jQuery);

