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

angular.module('app')
    .controller('MainCtrl', function ($scope, $location) {
      $scope.isActive = function(route) {
          return route === $location.path();
        };
    });
