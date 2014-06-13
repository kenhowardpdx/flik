'use strict';

angular.module('citrusApp')
  .controller('AuthCtrl', function ($scope) {
    var key = $scope.username + ':' + $scope.password;
    if(key.length > 100) {
      console.log('That\'s Too Long!');
    }
  });
