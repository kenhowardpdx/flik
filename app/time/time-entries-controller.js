(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','httpService', function ($scope, httpService) {

            $scope.timeEntryDate = new Date();
            $scope.timeEntries = [];

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                getTimeEntries();
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
                getTimeEntries();
            };

            var getTimeEntries = function () {
                // Get the list of time entries
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                httpService.getCollection('timeentries/date/' + dateStr).then(function(entries) {
                    $scope.timeEntries = entries;
                });
            };

            getTimeEntries();


        }]);
})();
