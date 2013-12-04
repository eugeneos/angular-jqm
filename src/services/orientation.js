/**
 * @ngdoc function
 * @name jqm.$orientation
 * @requires $window
 * @requires $rootScope
 *
 * @description
 * Provides access to the orientation of the browser. This will also
 * broadcast a `$orientationChanged` event on the root scope and do a digest whenever the orientation changes.
 */
jqmModule.factory('$orientation', ['$window', '$rootScope', function($window, $rootScope) {
  if (!$window.addEventListener) {
    // For tests
    return angular.noop;
  }
  var lastOrientation = getOrientation(),
    VERTICAL = "vertical",
    HORIZONTAL = "horizontal";

  initOrientationChangeListening();

  return getOrientation;

  // ------------------

  function initOrientationChangeListening() {
    // Start listening for orientation changes
    $window.addEventListener('resize', resizeListener, false);

    $window.addEventListener('orientationchange', orientationListener, false);

    //Also listen for full-screen changes
    $window.addEventListener('webkitfullscreenchange ', fullScreenListener, false);
    $window.addEventListener('mozfullscreenchange ', fullScreenListener, false);
    $window.addEventListener('fullscreenchange ', fullScreenListener, false);

    function fullScreenListener() {
        $rootScope.$apply(function () {
            $rootScope.$broadcast('$fullScreenChanged');
        });
    }

    function orientationListener() {
        $rootScope.$apply(function () {
            $rootScope.$broadcast('$orientationChanged', getOrientation());
        });
    }

    function resizeListener() {
      if (!orientationChanged()) {

        //Hack to support iOS full-screen mode. May need to revisit this later if it breaks other devices.
        //iOS fires resize event in 3 cases:
        //(1) Orientation change (but then we wouldn't be in this "if" branch)
        //(2) Enter/exit full-screen mode
        //(3) Strange, unpredictable, buggy resize events that *sometimes* occur when an on-screen keyboard or another iOS system popup are
        //used (e.g. combo-box selector)
        //We need to differentiate between (2) and (3). It seems that in case (3), the app is always scrolled up (the whole app including
        //the header, not just the contents between header and footer). As an extra precaution, we also check the screen orientation, since
        //full screen mode (2) can only occur in horizontal orientation.
        if (getOrientation() === HORIZONTAL && $window.scrollY === 0)
        {
          $rootScope.$broadcast('$fullScreenChanged');
        }

        return;
      }

      //On iOS, for some reason orientation change detection is not 100% reliable. For this reason, we also make the scroll check here
      //to detect a possible condition (3) - see above comment.
      //This may need to be revisited if it breaks other devices, but it's unlikely it will, since we have the "orientationchanged" listener as well
      //which most devices should support.
      if ($window.scrollY === 0) {
          $rootScope.$apply(function () {
              $rootScope.$broadcast('$orientationChanged', getOrientation());
          });
      }
    }
  }

  function getOrientation() {
    var w = $window.innerWidth,
      h = $window.innerHeight;
    
    if ($window.orientation !== undefined && $window.orientation !== null) {
      if ($window.orientation === 0 || $window.orientation === 180) {
          return VERTICAL;
      } else {
          return HORIZONTAL;
      }
    }
      
    if (h < 200) {
      // In case of the Android screen size bug we assume
      // vertical, as the keyboard takes the whole screen
      // when horizontal.
      // See http://stackoverflow.com/questions/7958527/jquery-mobile-footer-or-viewport-size-wrong-after-android-keyboard-show
      // and http://android-developers.blogspot.mx/2009/04/updating-applications-for-on-screen.html
      return VERTICAL;
    }
    if (w > h) {
      return HORIZONTAL;
    } else {
      return VERTICAL;
    }
  }

  function orientationChanged() {
    var newOrientation = getOrientation();
    if (lastOrientation === newOrientation) {
      return false;
    }
    lastOrientation = newOrientation;
    return true;
  }
}]);
