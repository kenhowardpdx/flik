(function() {
    'use strict';

    angular.module('app')
        .controller('LoginCtrl', ['$scope','UserServices', function ($scope, UserServices) {
            $scope.login = function(credentials) {
                UserServices.login(credentials.username,credentials.password);
            };
        }])
        .controller('LogOutCtrl', function ($scope, UserServices) {
            UserServices.logout();
        });
})();
