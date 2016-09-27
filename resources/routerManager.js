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
    },
    mapLinks: function(element) {

        var self = this;

        $(element).find("a").on('click', function(e) {
            e.preventDefault();

            var href = $(this).attr('href');

            if (href == "#" || href == "") {
                return;
            }

            self.navigate(href);
        });
    }
}; 