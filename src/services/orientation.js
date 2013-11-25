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

    function resizeListener() {
      if (!orientationChanged()) {
        return;
      }
      $rootScope.$apply(function() {
        $rootScope.$broadcast('$orientationChanged', getOrientation());
      });
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
