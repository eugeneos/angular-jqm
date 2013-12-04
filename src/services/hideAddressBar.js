/**
 * @ngdoc function
 * @name jqm.$hideAddressBar
 * @requires $window
 * @requires $rootElement
 * @requires $orientation
 *
 * @description
 * When called, this will hide the address bar on mobile devices that support it.
 */
jqmModule.factory('$hideAddressBar', ['$window', '$rootElement', '$orientation', function ($window, $rootElement, $orientation) {
  var MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT = 568,
    MAX_SCREEN_HEIGHT = 800,
    scrollToHideAddressBar,
    cachedHeights = {
    };
  if (!$window.addEventListener || addressBarHidingOptOut()) {
    return noop;
  } else {
    return hideAddressBar;
  }

  function noop(done) {
    if (done) {
      done();
    }
  }

  // -----------------
  function hideAddressBar(done) {
    var orientation = $orientation(),
      docHeight = cachedHeights[orientation];
    if (!docHeight) {
      // if we don't know the exact height of the document without the address bar,
      // start with one that is always higher than the screen to be
      // sure the address bar can be hidden.
      docHeight = MAX_SCREEN_HEIGHT;
    }
    if (!isVirtualKeyboardHeight()) {
      setDocumentHeight(docHeight);
      if (!angular.isDefined(scrollToHideAddressBar)) {
        // iOS needs a scrollTo(0,0) and android a scrollTo(0,1).
        // We always do a scrollTo(0,1) at first and check the scroll position
        // afterwards for future scrolls.
        $window.scrollTo(0, 1);
      } else {
        $window.scrollTo(0, scrollToHideAddressBar);
      }
      // Wait for a scroll event or a timeout, whichever is first.
      $window.addEventListener('scroll', afterScrollOrTimeout, false);
      var timeoutHandle = $window.setTimeout(afterScrollOrTimeout, 400);
    }

    function afterScrollOrTimeout() {
      $window.removeEventListener('scroll', afterScrollOrTimeout, false);
      $window.clearTimeout(timeoutHandle);
      if (!isVirtualKeyboardHeight()) {
        //Cache is never used, as it breaks iOS6 full-screen mode
        //(entering/exiting full-screen mode changes the screen size without changing orientation)
        cachedHeights[orientation] = getViewportHeight();
        setDocumentHeight(cachedHeights[orientation]);
      }
      if (!angular.isDefined(scrollToHideAddressBar)) {
        if ($window.pageYOffset === 1) {
          // iOS
          scrollToHideAddressBar = 0;
          $window.scrollTo(0, 0);
        } else {
          // Android
          scrollToHideAddressBar = 1;
        }
      }
      if (done) {
        done();
      }
    }
  }

  function addressBarHidingOptOut() {
    return Math.max(getViewportHeight(), getViewportWidth()) > MIN_SCREEN_HEIGHT_WIDTH_OPT_OUT;
  }

  function getViewportWidth() {
    return $window.innerWidth;
  }

  function getViewportHeight() {
    return $window.innerHeight;
  }

  function setDocumentHeight(height) {
    $rootElement.css('height', height + 'px');
  }

  function isVirtualKeyboardHeight() {
    //On iOS7 Home-Screen App Mode, resize event due to virtual keyboard showing up is  predictable (always occurs) but problematic
    //(prevents typing into a text field obscured by the keyboard). Also, the reverse event (resizing back to normal)
    //isn't always fired (in fact, is almost never fired), so after the keyboard disappears we're left with ugly blank space at the bottom
    //of the screen where the keyboard used to be.
    //What's worse, in that particular mode NO SCROLLING OCCURS when the keyboard appears, so our usual "window.scrollY === 0" protection
   //in orientation.js does not help us!

    //So here's what we do: It's a hack, but here we basically just special-case some known problematic heights for iOS7 only:
    // 288 - 4-inch iPhone portrait mode with virtual keyboard
    // 94 - any (3.5 or 4-inch) iPhone landscape mode with virtual keyboard
    // 200 - 3.5-inch iPhone portrait mode with virtual keyboard
    if (!navigator) return false;
    if (!navigator.userAgent) return false;
    if (!navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) return false;
    return ($window.innerHeight === 288 || $window.innerHeight === 94 || $window.innerHeight === 200);
  }
}]);
