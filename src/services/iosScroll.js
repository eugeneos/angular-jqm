jqmModule.factory('$iosScroll', ['$timeout', '$rootElement', function ($timeout, $rootElement) {

    return {

        iosFixNeeded: function () {
            if (!navigator) return false;
            if (!navigator.userAgent) return false;
            return navigator.userAgent.match(/(iPad|iPhone|iPod touch)/i);
        },

        initializeNativeScrolling: function (elements) {
            var element = angular.element(elements[0]);

            //Add an empty div to the end of the content to ensure that user can scroll to the very end of the content, without it being obstructed by the footer
            //This must be done BEFORE applying the CSS, see http://stackoverflow.com/questions/11596047/webkit-overflow-scrolling-problems-with-objects-inserted-into-dom
            var clearSpace = angular.element("<div class='jqm-scroll-fix'></div>");
            element.append(clearSpace);

            //This disables scrolling until we can enable content scrolling properly
            //If we don't do this, then during the timeout period below the user can scroll the entire app, and that
            //leads to some really strange/buggy effects.
            //TODO: To make this more general we should probably find the "body" element somehow instead of relying on $rootElement to be the body.
            //Same for unbind() below.
            //TODO: This doesn't fully work - sometimes, you can still scroll the entire app. Worse yet, if you drag the footer upwards (even
            //after the timeout) you can also scroll the entire app.
            //What's even worse, window.scrollY remains 0 for some reason, and the 'scroll' event is not fired, neither on the document nor
            //on the document.body. We need a better solution here.
            $rootElement.bind('touchmove', function (e) { e.preventDefault() });

            //TODO:
            //This is a horrible hack. Timeout of 0 doesn't work, no idea whether 1000 is big enough in all cases (500 seems to be too short in some tests).
            //1000 is big enough to actually be noticed by the user (i.e. scrolling doesn't work for the first second)
            //Really this should happen whenever the "element" is fully built up with contents, but I couldn't find a way to capture that event.
            //At the end of the day this is a Mobile Safari bug... there shouldn't be any delay required here at all.
            $timeout(function () {
                element.css("overflow-y", "scroll");
                element.css("-webkit-overflow-scrolling", "touch");
                element.css("height", "100%");
                $rootElement.unbind('touchmove');
            }, 1000);

            //TODO: Possibly add ::-webkit-scrollbars {display:none;} to the CSS, because the scroll
            //bars that appear with native scrolling are ugly, unnecessary, and appear out-of-place
        }

    };

}]);