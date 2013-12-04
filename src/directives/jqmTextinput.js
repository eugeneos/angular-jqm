/**
 * @ngdoc directive
 * @name jqm.directive:jqmTextinput
 * @restrict A
 *
 * @description
 * Creates an jquery mobile input on the given element.
 *
 * @param {string} ngModel Assignable angular expression to data-bind to.
 * @param {string=} type Defines the type attribute for the resulting input. Default is 'text'.
 * @param {string=} disabled Whether this input is disabled.
 * @param {string=} mini Whether this input is mini.
 * @param {boolean=} clearBtn Whether this input should show a clear button to clear the input.
 * @param {string=} clearBtnText Defines the tooltip text for the clear Button. Default is 'clear text'.
 * @param {string=} placeholder Defines the placholder value for the input Element.
 *
 * @example
 <example module="jqm">
 <file name="index.html">
 Text Input:
 <div jqm-textinput ng-model="value"></div>
 <p/>
 Text Input: clear-btn="true"
 <div jqm-textinput ng-model="value" clear-btn="true"></div>
 <hl/>
 Search Input:
 <div jqm-textinput ng-model="search" type="search"></div>
 </file>
 </example>
 */
jqmModule.directive('jqmTextinput', ['inputDirective', function (inputDirective) {
  return {
    templateUrl: 'templates/jqmTextinput.html',
    replace: true,
    restrict: 'A',
    require: '?ngModel',
    scope: {
      clearBtn: '@',
      type: '@',
      clearBtnText: '@',
      disabled: '@',
      mini: '@',
      placeholder: '@',
      autocorrect: '@',
      autocapitalize: '@'
    },
    link: function (scope, element, attr, ngModelCtrl) {
      var input = angular.element(element[0].getElementsByTagName("input"));

      scope.typeValue = type();
      scope.clearBtnTextValue = scope.clearBtnText || 'clear text';

      linkInput();
      scope.getValue = getValue;
      scope.clearValue = clearValue;
      scope.isSearch = isSearch;

      function type() {
        var inputType = scope.type || 'text';
        return (inputType === 'search') ? 'text' : inputType;
      }

      function getValue() {
        return scope.type === 'color' || (ngModelCtrl && ngModelCtrl.$viewValue);
      }

      function clearValue(event) {
        event.preventDefault();


        input[0].value = '';
        if (ngModelCtrl) {
          ngModelCtrl.$setViewValue('');
        }
      }

      function isSearch() {
        return scope.type === 'search';
      }

      function linkInput() {
        input.bind('focus', function () {
          element.addClass('ui-focus');
        });
        input.bind('blur', function () {
          element.removeClass('ui-focus');
        });

        angular.forEach(inputDirective, function (directive) {
          directive.link(scope, input, attr, ngModelCtrl);
        });
        return input;
      }
    }
  };
}]);
