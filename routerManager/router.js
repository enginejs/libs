var Router = {
    routes: [],
    getCurrentPath: function() {
        return decodeURI(location.pathname).replace(/\/$/, '');
    },
    add: function(request, handler) {
        this.routes.push({request: "/" + request, handler: handler});
        return this;
    },
    check: function(path) {

        for(var i = 0; i < this.routes.length; i++) {
            var checkRoute = this.routes[i];
            var match = path.match(checkRoute.request);

            if(match) {
                match.shift();
                checkRoute.handler.apply({}, match);
                return;
            }
        }
    },
    listen: function() {

        if (typeof this.listenLoopFn != 'undefined') {
            return;
        }

        var self = this;
        var currentPath = self.getCurrentPath();

        this.check(currentPath);
        this.listenLoopFn = setInterval(function() {
            if(currentPath !== self.getCurrentPath()) {
                currentPath = self.getCurrentPath();
                self.check(currentPath);
            }
        }, 50);
    },
    navigate: function(path) {
        history.pushState(null, null, path);
    }
}; 


Router
.add('abv.bg',function(){
    window.location.href = "//google.com";
})
.add('test1',function(){
    $("#t").html('Test 1');
})
.add('test2',function(){
    $("#t").html('Test 2');
})
.add('test3',function(){
    $("#t").html('Test 3');
})
.add('/test4',function(){
    $("#t").html('Test 4');
})
.add('getting-started/step/.*',function(){

    var stepId = location.pathname.split('/')[3];

    pageContentManager.load('getting-started/step/' + stepId, function(){
        APP.controller.gettingStarted(stepId);
    });
})
.listen();

