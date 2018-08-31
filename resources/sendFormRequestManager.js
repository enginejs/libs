var EngineJS_sendFormRequestManager = 
{
    formInstance: null,
    treatAllErrorAsGeneral: true,
    apiClient: null,
    requestInProgress: false,
    submitUrl: null,
    requestType: "POST",

    onErrorCallback: function() {},
    onGeneralErrorCallback: function() {},
    onSuccessCallback: function() {},
    beforeSubmitCallback: function() {},

    beforeNetworkRequestCallback: function() {},
    afterNetworkRequestCallback: function() {},

    init: function(newFormInstance, config) 
    {
        this.formInstance = $(newFormInstance);

        if (typeof config == "undefined") {
            config = {};
        }

        if (typeof config.treatAllErrorAsGeneral != "undefined") {
            this.treatAllErrorAsGeneral = config.treatAllErrorAsGeneral;
        }

        if (typeof config.apiClient != "undefined") {
            this.apiClient = config.apiClient;
        }

        if (typeof config.submitUrl != "undefined") {
            this.submitUrl = config.submitUrl;
        }

        if (typeof config.requestType != "undefined") {
            this.requestType = config.requestType;
        }

        var that = this;

        this.formInstance.on('submit', function(event) {
            event.preventDefault();

            if (that.requestInProgress == true) {
                return ;
            }
            that.requestInProgress = true;

            var sendData = {};
            that.formInstance.serializeArray().map(function(item){
                sendData[item.name] = item.value;
            });

            var executeBefore = that.beforeSubmitCallback(sendData);

            if (typeof executeBefore != "undefined") {
                if (executeBefore['status'] == 'generalError') {
                    that.onGeneralErrorCallback({'error': executeBefore['message']}, that.formInstance);
                } else if (executeBefore['status'] == 'error') {
                    that.onErrorCallback(executeBefore, that.formInstance);
                }
                that.requestInProgress = false; 
                return; // if there is an error we don't want to continue. 
            }

            if (typeof that.submitUrl == 'function') {
                submitUrl = that.submitUrl();
            } else {
                submitUrl = that.submitUrl;
            }

            that.beforeNetworkRequestCallback();


            callback = 
            {
                success: function(response) {
                    that.requestInProgress = false;
                    that.afterNetworkRequestCallback();
                    
                    // call propar erro based on status code
                    that.onSuccessCallback(response);
                },
                error: function(status, response) {
                    that.requestInProgress = false;
                    that.afterNetworkRequestCallback();

                    if (status == 422) {
                        if (that.treatAllErrorAsGeneral) {
                            that.onGeneralErrorCallback(response, that.formInstance);
                        } else {
                            that.onErrorCallback(response, that.formInstance);
                        }
                    } else if (status == 400) {
                        that.onGeneralErrorCallback(response, that.formInstance);
                    } else {
                        console.log("Something went wrong");
                    }
                },
            };

            if (that.requestType == 'PUT') {
                that.apiClient.put(submitUrl, sendData, callback);
            } else {
                that.apiClient.post(submitUrl, sendData, callback);
            }
        });
    },
    getFirstErrorField: function(errors)
    {
        for (var index in errors) {
            var firstErorrField = errors[index];

            for (var index2 in firstErorrField) {
                return firstErorrField[index2];
            }
        }
    },
    onError: function(newOnError)
    {
        this.onErrorCallback = newOnError;
    },
    onGeneralError: function(newOnGeneralError)
    {
        this.onGeneralErrorCallback = newOnGeneralError;
    },
    afterNetworkRequestCallback: function(newAfterNetworkRequestCallback)
    {
        this.afterNetworkRequestCallback = newAfterNetworkRequestCallback;
    },
    beforeNetworkRequestCallback: function(newBeforeNetworkRequestCallback)
    {
        this.beforeNetworkRequestCallback = newBeforeNetworkRequestCallback;
    },
    onSuccess: function(newOnSuccess)
    {
        this.onSuccessCallback = newOnSuccess;
    },
    beforeSubmit: function(newBeforeSummit) 
    {
        this.beforeSubmitCallback = newBeforeSummit;
    }
};
