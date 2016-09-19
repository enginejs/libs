var APP = {
	controller: {},
	config: {},
	action: {},
	pageConfig: {} // this will containt different config depends on the page where we  are!
};

// load config which are send form php to js
// APP.config = jsConfig; 

// delete jsConfig because we should not used it directly!
jsConfig = 'Use APP.config instead me'; 

var pageContent = $("#page-content");

$(function() {

	$("a").on('click', function(e){
		e.preventDefault();

		var href = $(this).attr('href');

		// we don't need to redirect # or empty url
		if (href == "#" || href == "") {
			return;
		}

		Router.navigate(href);
	});
	

	// Init chat application
	// APP.chat.init();
});



