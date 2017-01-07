var apiClientManager = {
    baseUrl: "",
    beforeSendCallback: function() {},

    setBasicUrl: function(baseUrl) {
        this.baseUrl = baseUrl;
    },
    setBeforeSendCallback: function(callback) {
        this.beforeSendCallback = callback;
    },
    get: function(url, callback) {
        this.request('GET', url, callback);
    },
    post: function(url, data, callback) {
        this.request('POST', url, callback, data);
    },
    put: function(url, data, callback) {
        this.request('PUT', url, callback, data);
    },
    delete: function(url, callback) {
        this.request('DELETE', url, callback);
    },
    request: function(type, url, callback, data) {
        var that = this;
        $.ajax({
            url: (this.baseUrl + url),
            type: type,
            data: data,
            dataType: "json",
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
