'use strict';
/* global flik: true */

angular.module('app')
  .controller('SignupCtrl', function ($rootScope, $scope, $http, UserServices) {

    var newUser = {
      Username: '',
      Email: '',
      Password: '',
      UserID: null
    };

    $scope.errors = false; // hides the error panel

    $scope.createUser = function() {

      newUser = {
        Password: $scope.password,
        UserName: flik.username($scope.username),
        Name    : $scope.name,
        Email   : $scope.email,
        TimeZoneId : 'Pacific Standard Time',
        // UseStopwatchApproachToTimeEntry: false,
        // ExternalSystemKey : 'this is a string #CITRUS'
      };

      // KHTODO: Enable Twitter Registration
      //OAuth.initialize('IZhywZ2WEaqbWh7-zWYN_VL_acY');
      //OAuth.redirect('twitter', "/#/");

      $http.post(flik.apiBaseUrl + 'api/users', newUser).
        success(function(data) {
          $rootScope.user = data;
          UserServices.login($scope.username,$scope.password);
        }).
        error(function(data, status) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          if(status === 400) {

            // check if the user already exists

            $scope.errors = true;
            $scope.errorHeading = data.Message;
            $scope.errorList = data.Errors;
          } else {
            console.log('Status != 400');
            console.log(status);
          }
        });
    };

  });
