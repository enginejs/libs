var EngineJS_loadingBarManager =
{
    currentProgressBar: null,
    isActive: false,
    mainElementId: "", 
    contentOfMainElement: '<div class="rotating progress2" id="progress2"></div>',
    progressBarCircleConfig: {},

    beforeOpen: function(){},
    beforeClose: function(){},

    config: function(options){
        if (typeof options['beforeOpen'] == 'function') {
            this.beforeOpen = options.beforeOpen;
        }

        if (typeof options['beforeClose'] == 'function') {
            this.beforeClose = options.beforeClose;
        }

        if (typeof options['progressBarCircleConfig'] == 'object') {
            this.progressBarCircleConfig = options.progressBarCircleConfig;
        }

        this.mainElementId = ('#' + options.mainElementId);
    },
    close: function() {        
        this.beforeClose();
        this.isActive = false;

        try {
            this.currentProgressBar.destroy();
        }
        catch(err) {}

        $(this.mainElementId).html('');
    },
    open: function() {
        var that = this;
        if (that.isActive) {
            return ;
        }

        this.beforeOpen();

        // create the element.
        $(this.mainElementId).html(that.contentOfMainElement);

        that.currentProgressBar = new ProgressBar.Circle('#progress2', this.progressBarCircleConfig);

        that.isActive = true;
        actionNow = function onLoad() {

            if (that.isActive) {
                that.currentProgressBar.animate(1);
            }

            var currentTime = 3000;
            setTimeout(function() {
                if (that.isActive) {
                    that.currentProgressBar.animate(0.1);
                }
            }, currentTime);

           currentTime += 3000;
            setTimeout(function() {
                 if (that.isActive) {
                    actionNow();
                }
            }, currentTime);

        };

        actionNow();
    }
}
