/*
* Title module displaying title tag based on current view
*/
var EngineJS_titleManager = {
    content: {},
    init: function(content) {
       this.content = content;
    },
    change: function(view) {
        var contentPageKey = view.replace(/\//g, '-');
        var title = this.content[contentPageKey];

        if(title === undefined) {
            title = this.content['page-title-default'];
        }

        var titleSuffix = this.content['page-title-suffix'];
        document.title = title + ' - ' + titleSuffix;
    }
};
