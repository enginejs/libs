var pageContentManager = {

	// internal meta data.
	contentInstance: null,
	urlPrefix: '',
	
	// events.
	beforeLoad: function() {},
	afterLoad: function() {},
	afterAllSuccess: function() {},
	onFail: function() { console.log('Something wrong happend.') },

	config: function(options) {
		this.contentInstance = options.contentInstance;

		if (typeof options.urlPrefix == 'string') {
			this.urlPrefix = options.urlPrefix;
		}

		if (typeof options['beforeLoad'] == 'function') {
			this.beforeLoad = options.beforeLoad;
		}

		if (typeof options['afterLoad'] == 'function') {
			this.afterLoad = options.afterLoad;
		}

		if (typeof options['afterAllSuccess'] == 'function') {
			this.afterAllSuccess = options.afterAllSuccess;
		}
	},
	load: function(url, onSuccessCallback) {
		
		if (typeof onSuccessCallback == 'undefined') {
			onSuccessCallback = function(){};
		}
		
		that = this;
		that.beforeLoad();

		$.getJSON(that.urlPrefix + url, function(response){
			
			if (typeof response['partials'] != "undefined") {
				var partials = response['partials'];

				for (partialName in partials) {
					Handlebars.registerPartial(partialName, partials[partialName]);
				}
			}

            // load pageConfig
			if (typeof response['config'] == "undefined") {
				APP.pageConfig = {};
			} else {
				APP.pageConfig = response['config'];
			}

			// @todo catch errors here
			var template = Handlebars.compile(response['template']);
			that.contentInstance.html(template(response['data']));

			that.afterAllSuccess();
			onSuccessCallback(response['data']);
			that.afterLoad();

		}).fail(function(){
			that.afterLoad();
			that.onFail();
		});
	}
};

$(function(){
	pageContent = $("#pageContent");

	pageContentManager.config({
		contentInstance: pageContent,
		urlPrefix: '/1/pages/',
		beforeLoad: function() {
			this.contentInstance.css('opacity', 0.5);
			this.contentInstance.addClass('noselect');
			this.contentInstance.on('click', function(e) { 
				e.preventDefault();
			});
		},
		afterLoad: function() {
			this.contentInstance.removeClass('noselect');
			this.contentInstance.css('opacity', 1);
			this.contentInstance.off('click');
		},
		afterAllSuccess: function() {
			// when we load new content and replease old one, the new links has to be caught
			that.contentInstance.find("a").on('click', function(e){
				e.preventDefault();

				var href = $(this).attr('href');

				// we don't need to redirect # or empty url
				if (href == "#" || href == "") {
					return;
				}

				console.log('open in this page no rediret', href);
				//Router.navigate(href);
			});
		}
	});

	pageContentManager.load('t.t', function() {

	});
});