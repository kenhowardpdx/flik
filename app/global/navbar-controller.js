'use strict';

angular.module('app')
    .controller('NavCtrl', function ($scope, $location) {
        $scope.isActive = function(route) {
            return route === $location.path();
        };

  		$scope.isCollapsed = true;
    });
