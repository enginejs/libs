var EngineJS_liveEditManager =
{
    apiClient: null,
    submitUrl: "",

    // events.
    beforeCallback: function() {},
    onErrorCallback: function() {},
    onSuccessCallback: function() {},

    init: function(instance, options) {
        this.submitUrl = options.submitUrl;
        this.name = options.name;
        this.apiClient = options.apiClient;

        var instance = $(instance);
        var type = instance.prop('tagName');
        var timeoutId;
        var that = this;

        var saveChanges = function(newValue){
            that.beforeCallback(newValue, that.name);

            var sendData = {
                "name": that.name,
                "value": newValue
            };

            that.apiClient.put(that.submitUrl, sendData, {
                success: function() {
                    that.onSuccessCallback(newValue, that.name);
                }, 
                error: function() {
                    that.onErrorCallback(newValue, that.name);
                }
            });
        };

        if (type == 'INPUT') {
            var exactType = $(instance).attr('type');
            
            if (exactType == 'text') {
                instance.keypress(function () {
                    if (timeoutId) clearTimeout(timeoutId);
                        timeoutId = setTimeout(function () {
                        saveChanges(instance.val());
                    }, 650);
                });
            } else if (exactType == 'checkbox') {
                instance.change(function(){
                    saveChanges($(this).is(':checked'));
                });
            } else if (exactType == 'radio') {
                instance.change(function(){
                    saveChanges($(this).val());
                });
            } else {
                console.log('Not supported input for autosave.');
            }
        } else if (type == 'TEXTAREA') {

            instance.keypress(function () {
                if (timeoutId) clearTimeout(timeoutId);
                    timeoutId = setTimeout(function () {
                    saveChanges(instance.val());
                }, 650);
            });

        } else if (type == 'SELECT') {
            instance.change(function(){
                saveChanges(instance.val());
            });
        } else {
            console.log('Not supported input for autosave.');
        }
    },
    before: function(before) {
        this.beforeCallback = before
    },
    onError: function(onError) {
        this.onErrorCallback = onError
    },
    onSuccess: function(onSuccess) {
        this.onSuccessCallback = onSuccess
    },
};
