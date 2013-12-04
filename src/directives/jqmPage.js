/**
 * @ngdoc directive
 * @name jqm.directive:jqmPage
 * @restrict A
 *
 * @description
 * Creates a jquery mobile page. Also adds automatic overflow scrolling for it's content.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 <div jqm-page class="jqm-standalone-page" style="height: 100px;">
 <p>Hello world!</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 <p>New Line</p>
 </div>
 </file>
 </example>
 */
jqmModule.directive('jqmPage', ['$rootScope', '$controller', '$scroller', '$iosScroll', function ($rootScope, $controller, $scroller, $iosScroll) {
  return {
    restrict: 'A',
    require: 'jqmPage',
    controller: ['$element', JqmPageController],
    // Note: We are not using a template here by purpose,
    // so that other directives like dialog may reuse this directive in a template themselves.
    compile: function (cElement, cAttr) {
      var content = angular.element('<div class="ui-content"></div>');
      content.append(cElement.contents());
      cElement.append(content);
      cElement.addClass("ui-page");

      return function (scope, lElement, lAttr, jqmPageCtrl) {
        var content = lElement.children();
        lElement.addClass("ui-body-" + scope.$theme);
        addAndRemoveParentDependingClasses(scope, lElement, content);
        if (content.data("jqmHeader")) {
          content.addClass('jqm-content-with-header');
          lElement.prepend(content.data("jqmHeader"));
        }
        if (content.data("jqmFooter")) {
          content.addClass('jqm-content-with-footer');
          lElement.append(content.data("jqmFooter"));
        }
      };

      function addAndRemoveParentDependingClasses(scope, lElement, content) {
        var viewContentLoadedOff = $rootScope.$on('$viewContentLoaded', function (event, pageNodes) {
          // Note: pageNodes may contain text nodes as well as our page.
          var pageEl;
          angular.forEach(pageNodes, function (pageNode) {
            if (pageNode === lElement[0]) {
              pageEl = pageNode;
            }
          });
          // Note: checking event.targetScope===scope does not work when we put a jqm-theme on the page.
          if (pageEl) {
            lElement.parent().addClass("ui-overlay-" + scope.$theme);
            if (lElement.parent().data("jqmHeader")) {
              content.addClass("jqm-content-with-header");
            }
            if (lElement.parent().data("jqmFooter")) {
              content.addClass("jqm-content-with-footer");
            }
            lElement.parent().addClass("ui-mobile-viewport");
          }
        });
        scope.$on('$destroy', viewContentLoadedOff);
      }
    }
  };
  function JqmPageController(element) {
    var scroller = null;

    if ($iosScroll.iosFixNeeded()) {
      //On iOS only, we do native scroll because angular-scrolly scrolling is broken (leads to strange click events,
      //see https://github.com/angular-widgets/angular-jqm/issues/183 ).

      //In this case, none of the functions below (scroll, scrollHeight, outOfBounds) will work.
      //TODO: We probably want to throw some sort of meaningful exceptions in this case, or actually implement these functions for native scroll.

      $iosScroll.initializeNativeScrolling(element.children());

    } else {
      scroller = $scroller(element.children());
    }

    this.scroll = function(newPos, easeTime) {
      if (arguments.length) {
        if (arguments.length === 2) {
          scroller.transformer.easeTo({x:0,y:newPos}, easeTime);
        } else {
          scroller.transformer.setTo({x:0,y:newPos});
        }
      }
      return scroller.transformer.pos;
    };
    this.scrollHeight = function() {
      scroller.calculateHeight();
      return scroller.scrollHeight;
    };
    this.outOfBounds = function(pos) {
      return scroller.outOfBounds(pos);
    };
  }
}]);
