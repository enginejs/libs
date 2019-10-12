var EngineJS_apiClientManager = {
    baseUrl: "",
    beforeSendCallback: function() {},

    setBasicUrl: function(baseUrl) {
        this.baseUrl = baseUrl;
    },
    setBeforeSendCallback: function(callback) {
        this.beforeSendCallback = callback;
    },
    get: function(url, callback) {
        return this.request('GET', url, callback);
    },
    post: function(url, data, callback) {
        return this.request('POST', url, callback, data);
    },
    put: function(url, data, callback) {
        return this.request('PUT', url, callback, data);
    },
    delete: function(url, callback) {
        return this.request('DELETE', url, callback);
    },
    request: function(type, url, callback, data) {
        if (typeof callback == 'undefined') {
            callback = {
                error: function() {},
                success: function() {}
            };
        }
        
        // FormData instace is passed instead of JSON, proably for file upload.
        if (data instanceof FormData) {
            processData = false;
            contentType = false;
        } else {
            processData = true;
            contentType = "application/json";
        }
        
        var that = this;
        return $.ajax({
            url: (this.baseUrl + url),
            type: type,
            data: data,
            dataType: "json",
            processData: processData,
            contentType: contentType,
            success: function(result) {
                callback.success(result);
            },
            error: function(result) {
                try {
                    responseText = JSON.parse(result.responseText);
                }
                catch (e) {
                    responseText = {};
                }
                callback.error(result.status, responseText);
            },
            beforeSend: function(xhr) {
                that.beforeSendCallback(xhr);
            },
        });
    }
};
