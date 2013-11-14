/**
 * @ngdoc directive
 * @name jqm.directive:jqmButton
 * @restrict A
 *
 * @description
 * Creates a jquery mobile button on the given element.
 *
 * If created on an anchor `<a>` tag, the button will be treated as a link button.
 *
 * @param {submit|reset=} jqmButton The button type - if specified, the button will be treated as an input with the given value as its type. Otherwise, the button will just be a normal button.
 * @param {string=} icon Defines an icon for the button
 * @param {left|right|top|bottom=} iconpos Defines the Position of the icon, default is 'left'
 * @param {boolean=} mini Whether or not to use the mini layout
 * @param {boolean=} inline Whether or not to make the button inline (smaller)
 * @param {boolean=} shadow Whether or not to give the button shadows (default true)
 * @param {boolean=} corners Whether or not to give the button corners (default true)
 * @param {boolean=} iconShadow Whether or not the button's icon should have a shadow (default false)
 *
 * @example
<example module="jqm">
  <file name="index.html">
  <div>
    <div jqm-button icon="ui-icon-search" ng-click>Do some search</div>
    <a jqm-button icon="ui-icon-home" data-mini="true" href="#/api" ng-click>Go home, mini!</a>
    <hr />
    <h3>Form With Vertical Group</h3>
    <form action="http://foobar3000.com/echo" method="GET">
      <div jqm-textinput ng-model="$root.value" ng-init="$root.value='banana'" name="stuff"></div>
      <div jqm-controlgroup>
      <div jqm-button="submit" ng-click icon="ui-icon-check" iconpos="right">Submit to foobar3030.com</div>
      <div jqm-button="reset" ng-click icon="ui-icon-minus" iconpos="right">"reset" it away!</div>
      </div>
    </form>
    <hr />
    <h3>Horizontal Group</h3>
    <div jqm-controlgroup type="horizontal">
      <div jqm-button ng-click>One</div>
      <div jqm-button ng-click>Two</div>
      <div jqm-button ng-click>Three</div>
    </div>
  </div>
  </file>
</example>
 */
jqmModule.directive('jqmButton', ['jqmClassDirective', 'jqmOnceClassDirective', function(jqmClassDirectives, jqmOnceClassDirectives) {
  var isDef = angular.isDefined;
  return {
    restrict: 'A',
    transclude: true,
    templateUrl: 'templates/jqmButton.html',
    scope: {
      iconpos: '@',
      icon: '@',
      mini: '@',
      shadow: '@',
      corners: '@',
      inline: '@',
      iconShadow: '@'
    },
    require: '^?jqmControlGroup',
    compile: function (elm, attr) {
      attr.shadow = isDef(attr.shadow) ? attr.shadow==='true' : 'true';
      attr.corners = isDef(attr.corners) ? attr.corners==='true' : 'true';
      attr.iconShadow = isDef(attr.iconShadow) ? attr.iconShadow==='true' : false;

      elm[0].className += ' ui-btn';
      attr.$set('jqmOnceClass', "{{$scopeAs.jqmBtn.getIconPos() ? 'ui-btn-icon-'+$scopeAs.jqmBtn.getIconPos() : ''}}");
      attr.$set('jqmClass',
        "{'ui-first-child': $scopeAs.jqmBtn.$position.first," +
        "'ui-submit': $scopeAs.jqmBtn.type," +
        "'ui-last-child': $scopeAs.jqmBtn.$position.last," +
        "'ui-shadow': $scopeAs.jqmBtn.shadow," +
        "'ui-btn-corner-all': $scopeAs.jqmBtn.corners," +
        "'ui-mini': $scopeAs.jqmBtn.isMini()," +
        "'ui-btn-inline': $scopeAs.jqmBtn.isInline()}"
      );

      if (elm[0].tagName.toLowerCase() === 'input') {
        //Inputs can't have templates inside of them so throw an error
        throw new Error("Cannot have jqm-button <input> - use <button> instead!");
      }

      //Eg <div jqm-button="submit"> --> we put a <input type="submit"> inside
      var buttonEl;
      if (attr.jqmButton) {
        buttonEl = angular.element('<button>');
        buttonEl.addClass('ui-btn-hidden');
        buttonEl.attr("type", attr.jqmButton);
        if (attr.name) {
          buttonEl.attr("name", attr.name);
        }
        if (attr.ngDisabled) {
          buttonEl.attr('ngDisabled', attr.ngDisabled);
        } else if (attr.disabled) {
          buttonEl.attr('disabled', attr.disabled);
        }
        elm.append(buttonEl);
      }

      return function(scope, elm, attr, controlGroup) {
        elm.addClass('ui-btn-up-' + scope.$theme);

        scope.$$scopeAs = 'jqmBtn';
        scope.isMini = isMini;
        scope.getIconPos = getIconPos;
        scope.isInline = isInline;
        scope.type = attr.jqmButton;

        angular.forEach(jqmClassDirectives, function(directive) {
          directive.link(scope, elm, attr);
        });
        angular.forEach(jqmOnceClassDirectives, function(directive) {
          directive.link(scope, elm, attr);
        });

        function isMini() {
          return scope.mini || (controlGroup && controlGroup.$scope.mini);
        }
        function getIconPos() {
          return scope.iconpos || (controlGroup && controlGroup.$scope.iconpos) || (scope.icon ? 'left' : '');
        }
        function isInline() {
          return (controlGroup && controlGroup.$scope.type === "horizontal") || scope.inline;
        }

      };
    }
  };
}]);
