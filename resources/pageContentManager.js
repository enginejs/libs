var EngineJS_pageContentManager = {

	// internal meta data.
	urlPrefix: '',
	viewFilesPatterns: {},
	clientManager: null,
	changeTemplate: function() {},

	// events.
	beforeLoad: function() {},
	afterLoad: function() {},
	afterAllSuccess: function() {},
	onFail: function() { console.log('Something wrong happend.') },

	config: function(options) {
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

		if (typeof options['onFail'] == 'function') {
			this.onFail = options.onFail;
		}

		if (typeof options['changeTemplate'] == 'function') {
			this.changeTemplate = options.changeTemplate;
		}

		this.clientManager = options.clientManager;
	},
	load: function(onSuccessCallback, config) {
		
		if (typeof onSuccessCallback == 'undefined') {
			onSuccessCallback = function(){};
		}

		// if it's not a string, don't load it!
		if (typeof config['loadData'] != 'string') {
			config['loadData'] = false;
		}

		that = this;
		that.beforeLoad();

		loadPage = {
			success: function(response) {
				var partials = config['partials'];
				var pageContentInstance = that.changeTemplate(config['template']);

				// view
				if (typeof partials != "undefined") {
					// this should not work, it should actually load file!
					for (partialName in partials) {
						Handlebars.registerPartial(partialName, partials[partialName]);
					}
				}

				var getView = function(viewName, onLoad)
				{
					// to keep it on localstorage in order to save network
					$.get("/static/view/" + viewName + ".html", function(data) {
						onLoad(data);
					});
					// catch error in case it not able to load it.
				};

				getView(config['view'], function(viewContent){
					// @todo catch errors here
					var template = Handlebars.compile(viewContent);
					pageContentInstance.html(template(response['data']));

					that.afterAllSuccess();
					onSuccessCallback(response['data']);
					that.afterLoad();

				});
				that.afterLoad();
			},
			error: function(status, data) {
				that.afterLoad();
				that.onFail(status, data);
			},
		}

		if (config['loadData'] == false) {
			loadPage.success({'data' : null});
		} else {
			this.clientManager.get(that.urlPrefix + config['loadData'], loadPage);
		}
	}
};