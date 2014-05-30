'use strict';

angular.module('citrusApp')
  .controller('SignupCtrl', function ($scope, $http) {


    var userData = {
      Username: '',
      Email: '',
      Password: '',
      UserID: null
    };

    var baseURL = 'https://csgprohackathonapi.azurewebsites.net';

    $scope.createUser = function() {

      userData = {
        Password: $scope.userPassword,
        UserName: $scope.userUsername,
        Name    : $scope.userName,
        Email   : $scope.userEmail,
        TimeZoneId : 'Pacific Standard Time',
        // UseStopwatchApproachToTimeEntry: false,
        // ExternalSystemKey : 'this is a string #CITRUS'
      };

      // KHTODO: Enable Twitter Registration
      //OAuth.initialize('IZhywZ2WEaqbWh7-zWYN_VL_acY');
      //OAuth.redirect('twitter', "/#/");

      $http.post(baseURL + '/api/users', userData).
        success(function(data, status) {
          // this callback will be called asynchronously
          // when the response is available
          if(data.UserId) {
            // log in the new user

          }
          else {
            // error
          }
        }).
        error(function(data, status) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
          console.log(status);
        });
    };

  });
