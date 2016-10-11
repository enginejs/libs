var pageContentManager = {

	// internal meta data.
	contentInstance: null,
	urlPrefix: '',
	viewFilesPatterns: {},
	clientManager: null,

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

		this.clientManager = options.clientManager;
	},
	load: function(url, onSuccessCallback) {
		
		if (typeof onSuccessCallback == 'undefined') {
			onSuccessCallback = function(){};
		}
		
		that = this;
		that.beforeLoad();

		this.clientManager.get(that.urlPrefix + url, {
			success: function(response) {
				// console.log('SUCCESS');
				// console.log(result);
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

			},
			error: function(result) {
				// console.log('ERROR');
				// console.log(result);
				that.afterLoad();
				that.onFail();
			},
		});
	},
	setViewFilesPatterns: function(newViewFilesPatterns) {
		this.viewFilesPatterns = newViewFilesPatterns;
	}
};