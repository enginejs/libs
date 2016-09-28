var sentFormRequestManager = {
	init: function(formInstance, treatAllErrorAsGeneral) {

		var that = this;
		// load empty event initially in case there are not set
		that.subscribe('success', function(){});
		that.subscribe('error', function(){});
		that.subscribe('before', function(){ return true });
		
		if (typeof treatAllErrorAsGeneral == "undefined") {
			var treatAllErrorAsGeneral = true;
		}
		
		var errorBox     = formInstance.find('.form-error-box').first();
		var submitButton = formInstance.find('input[type="submit"]').first();
		
		formInstance.submit(function(e) {
			
			e.preventDefault();
			
			var sentData = {};
			formInstance.serializeArray().map(function(item){
				sentData[item.name] = item.value;
			});

			// if ok, return true, if not return the error
			executeBefore = that.trigger('before', {sentData: sentData});

			if (executeBefore !== true) {
				errorBox.removeClass('hidden').html(executeBefore);
				return false;
			}
			
			submitButton.prop("disabled", true);
			errorBox.addClass('hidden');
			
			$.post(formInstance.attr('_action'), sentData)
			.done(function(response) {
				submitButton.prop("disabled", false);
				
				if (response['status'] == true) {
					that.trigger('success', response['data']);
				} else {
					alert("Upss. somthing went wrong");
				}
			})
			.error(function(data) {
				var responseData = JSON.parse(data.responseText);
				
				if (typeof responseData["general"] != "undefined") {
					errorBox.removeClass('hidden').html(responseData["general"]);
				}

				if (treatAllErrorAsGeneral) {
					var getFirstErrorField = function(errors)
					{
						for (var index in errors) {
							var firstErorrField = errors[index];
							
							for (var index2 in firstErorrField) {
								return firstErorrField[index2];
							}
						}
					};

					errorBox.removeClass('hidden').html(getFirstErrorField(responseData));
				}
				
				submitButton.prop("disabled", false);
				that.trigger('error', responseData);
			});
		});	

	},
	subscribeList: {},
	trigger: function(eventName, data) {
		return this.subscribeList[eventName](data);
	},
	subscribe: function(eventName, callbackFunction){
		return this.subscribeList[eventName] = callbackFunction;
	},
};


