/**
 * @ngdoc function
 * @name jqm.$anchorScroll
 * @requires $hideAddressBar
 *
 * @description
 * This overrides the default `$anchorScroll` of angular and calls `$hideAddressBar` instead.
 * By this, the address bar is hidden on every view change, orientation change, ...
 */
jqmModule.factory('$anchorScroll', ['$hideAddressBar', function ($hideAddressBar) {
  return deferredHideAddressBar;

  // We almost always want to allow the browser to settle after
  // showing a page, orientation change, ... before we hide the address bar.
  function deferredHideAddressBar() {
    window.setTimeout($hideAddressBar, 50);
  }
}]);
jqmModule.run(['$anchorScroll', '$rootScope', function($anchorScroll, $rootScope) {
  $rootScope.$on('$orientationChanged', function(event) {
    $anchorScroll();
  });
  $rootScope.$on('$fullScreenChanged', function(event) {
    $anchorScroll();
  });
}]);
