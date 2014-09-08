(function() {
    'use strict';

    angular.module('app')
        .controller('SignupCtrl', ['$rootScope','$scope','httpService','UserServices', function ($rootScope, $scope, httpService, UserServices) {

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
                    UserName: UserServices.saltUserName($scope.username),
                    Name    : $scope.name,
                    Email   : $scope.email,
                    TimeZoneId : 'Pacific Standard Time',
                    UseStopwatchApproachToTimeEntry: false,
                    ExternalSystemKey : 'CTRS*'
                };

                httpService.createItem('users', newUser).then(function(user) {
                    $rootScope.user = user;
                    UserServices.login($scope.username,$scope.password);
                });
            };

        }]);
})();
