/*
* Title module displaying title tag based on current view
*/
var EngineJS_titleManager = {
    content: {},
    titleDefault: "",
    titleSuffix: "",
    init: function(content, titleDefault, titleSuffix) {
       this.content = content;
       this.titleDefault = titleDefault;
       this.titleSuffix = titleSuffix;
    },
    change: function(view) {
        var contentPageKey = view.replace(/\//g, '-');
        var title = this.content[contentPageKey];

        if(title === undefined) {
            title = this.defaultTitle;
        }

        document.title = title + ' - ' + this.titleSuffix;
    }
};
