'use strict';

var app = angular.module('citrusApp');

app.controller('MainCtrl', function ($scope, $location) {
  $scope.isActive = function(route) {
      return route === $location.path();
    };
});
