'use strict';

angular.module('citrusApp')
  .controller('SignupCtrl', function ($scope, $http, $templateCache) {


    var userData = {
      Username: '',
      Email: '',
      Password: '',
      UserID: null
    };

    var baseURL = 'https://https://csgprohackathonapi.azurewebsites.net';

    $scope.createUser = function() {

      userData = {
        Password: $scope.userPassword,
        UserName: $scope.userUsername,
        Name    : $scope.userName,
        Email   : $scope.userEmail,
        TimeZoneId : 'Pacific Standard Time',
        UseStopwatchApproachToTimeEntry: false,
        ExternalSystemKey : 'this is a string #CITRUS'
      };

      // KHTODO: Enable Twitter Registration
      //OAuth.initialize('IZhywZ2WEaqbWh7-zWYN_VL_acY');
      //OAuth.redirect('twitter', "/#/");

      $http({method: 'POST', data: userData, url: '/api/users'}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data);
          console.log(status);
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
          console.log(status);
      });
    };


    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
