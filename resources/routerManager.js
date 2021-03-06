var EngineJS_routerManager = {
    routes: [],
    notFoundRouter: function() {}, 
    defaultRouter: function() {},
    getCurrentPath: function() {
        return decodeURI(location.pathname).replace(/\/$/, '');
    },
    add: function(request, handler) {
        this.routes.push({request: "/" + request, handler: handler});
        return this;
    },
    addDefault: function(handler) {
        this.defaultRouter = handler;
        return this;
    },
    addNotFound: function(handler) {
        this.notFoundRouter = handler;
        return this;
    },
    check: function(path) {

        if (path == "") {
            this.defaultRouter();
            return;
        }

        for(var i = 0; i < this.routes.length; i++) {
            var checkRoute = this.routes[i];
            var match = path.match(new RegExp("^" + checkRoute.request + "$"));

            if(match) {
                match.shift();
                checkRoute.handler.apply({}, match);
                return;
            }
        }
        this.notFoundRouter();
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
    },
    refresh: function() {
        var self = this;
        this.check(self.getCurrentPath());        
    }, 
    mapLinks: function(element) {

        var self = this;

        $(element).find("a").on('click', function(e) {
            var href = $(this).attr('href');

            // this is external link to map it.
            if (href.match("(https?:)?\/\/")) {
                return;
            }

            // don't redirect for all internal links
            e.preventDefault();

            // don't make action, just igrnore it.
            if (href == "#" || href == "") {
                return;
            }

            self.navigate(href);
        });
    }
};
