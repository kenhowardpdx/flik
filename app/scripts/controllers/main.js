'use strict';

window.FLIK = {
  apiBaseUrl: 'https://csgprohackathonapi.azurewebsites.net/',
  username: function(u) {
    if(!u) {
      return;
    }
    return 'c*' + u;
  }
};

var app = angular.module('citrusApp');

app.controller('MainCtrl', function ($scope, $location) {
  $scope.isActive = function(route) {
      return route === $location.path();
    };
});
