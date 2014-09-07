(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','$http','CONFIG', function ($scope, $http, CONFIG) {

            $scope.timeEntryDate = new Date();
            $scope.timeEntries = [];

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                //getTimeEntries();
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
            };

            var getTimeEntries = function () {
                // Get the list of time entries
                $http.get(CONFIG.API_URL + 'api/timeentries/date/' + $scope.timeEntryDate.toString('m-d-yyy')).
                success(function(data) {
                	$scope.timeEntries = data;
                }).
                error(function(status) {
                	console.log(status);
                });
            };

            getTimeEntries();


        }]);
})();
