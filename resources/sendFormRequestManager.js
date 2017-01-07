var sendFormRequestManager = 
{
    formInstance: null,
    treatAllErrorAsGeneral: true,
    apiClient: null,
    requestInProgress: false,
    submitUrl: null,

    onErrorCallback: function() {},
    onGeneralErrorCallback: function() {},
    onSuccessCallback: function() {},
    beforeSubmitCallback: function() {},

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
                    that.onGeneralErrorCallback(executeBefore['message']);
                    that.requestInProgress = false; 
                    return; // if there is an error we don't want to continue. 
                }
            }

            that.apiClient.post(that.submitUrl, sendData, {
                success: function(response) {
                    that.requestInProgress = false;
                    // call propar erro based on status code
                    that.onSuccessCallback(response);
                },
                error: function(status, response) {
                    that.requestInProgress = false;

                    if (status == 422) {
                        if (that.treatAllErrorAsGeneral) {
                            that.onGeneralErrorCallback(that.getFirstErrorField(response));
                        } else {
                            that.onErrorCallback(response);
                        }
                    } else if (status == 400) {
                        that.onGeneralError(response);
                    } else {
                        console.log("Something went wrong");
                    }
                },
            });
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
    onSuccess: function(newOnSuccess)
    {
        this.onSuccessCallback = newOnSuccess;
    },
    beforeSubmit: function(newBeforeSummit) 
    {
        this.beforeSubmitCallback = newBeforeSummit;
    }
};