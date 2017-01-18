var pageContentManager = {

	// internal meta data.
	contentInstance: null,
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

		if (typeof options['changeTemplate'] == 'function') {
			this.changeTemplate = options.changeTemplate;
		}

		this.clientManager = options.clientManager;
	},
	load: function(url, onSuccessCallback) {
		
		if (typeof onSuccessCallback == 'undefined') {
			onSuccessCallback = function(){};
		}
		
		that = this;
		that.beforeLoad(url);

		for (viewFilePattern in that.viewFilesPatterns) {
			if (url.match(viewFilePattern)) {

				this.clientManager.get(that.urlPrefix + url, {
					success: function(response) {

						var viewFileDetail = that.viewFilesPatterns[viewFilePattern];
						
						var view = viewFileDetail['view'];
						var partials = viewFileDetail['partials'];
						var template = viewFileDetail['template'];
						that.changeTemplate(template);

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

						getView(view, function(viewContent){
							// @todo catch errors here
							var template = Handlebars.compile(viewContent);
							that.contentInstance.html(template(response['data']));

							that.afterAllSuccess();
							onSuccessCallback(response['data']);
							that.afterLoad();

						});

						// console.log("There is a no view pattern for this page.");
						that.afterLoad();
					},
					error: function(result) {
						// console.log('ERROR');
						// console.log(result);
						that.afterLoad();
						that.onFail();
					},
				});

				break; // stop once it has a match.
			}
		}
	},
	setViewFilesPatterns: function(newViewFilesPatterns) {
		this.viewFilesPatterns = newViewFilesPatterns;
	}
};