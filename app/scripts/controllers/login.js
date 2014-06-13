'use strict';

angular.module('citrusApp')
  .controller('LoginCtrl', function ($scope, UserServices) {
    $scope.login = function(credentials) {
      UserServices.login(credentials.username,credentials.password);
    };
  });

angular.module('citrusApp')
  .controller('LogOutCtrl', function ($scope, UserServices) {
    UserServices.logout();
  });
