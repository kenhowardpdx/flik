(function() {
    'use strict';

    angular.module('app')
        .controller('NavCtrl', function ($scope, $location) {

            $scope.isActive = function (r) {
                var routes = r.join('|'),
                    regexStr = '^\/(' + routes + ')',
                    path = new RegExp(regexStr);
                if(r[0] === 'home' && $location.path() === '/') {
                    return true;
                }
                return path.test($location.path());
            };

      		$scope.isCollapsed = true;
        });
})();
