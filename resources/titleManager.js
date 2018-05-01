/*
* Title module displaying title tag based on current view
*/
var EngineJS_titleManager = {
    init: function(content, view) {
        var contentPageKey = view.replace(/\//g, '-');
        var title = content[contentPageKey];

        if(title === undefined) {
            title = content['page-title-default'];
        }

        var titleSuffix = content['page-title-suffix'];
        document.title = title + ' - ' + titleSuffix;
    }
};
