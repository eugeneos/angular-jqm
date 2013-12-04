'use strict';

var bugRepro = angular.module('bugRepro', ['jqm']);

bugRepro.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: "pageTemplate.html",
        controller: "PageCtrl"
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

}]);

bugRepro.controller('PageCtrl', ['$scope', function ($scope) {

    var i;
    $scope.items = [];
    for (i = 1; i <= 100; i++) { $scope.items.push(i); }

    $scope.doClick = function (item) {
        alert(item);
    }

}]);