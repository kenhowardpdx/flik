'use strict';

angular.module('citrusApp')
  .controller('MainCtrl', function ($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    }
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
