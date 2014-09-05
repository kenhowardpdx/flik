(function() {
    'use strict';

    angular.module('login-logout', [])
      .controller('LoginCtrl', function ($scope, UserServices) {
        $scope.login = function(credentials) {
          UserServices.login(credentials.username,credentials.password);
        };
      })
      .controller('LogOutCtrl', function ($scope, UserServices) {
        UserServices.logout();
      });
})();
