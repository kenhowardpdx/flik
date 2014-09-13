(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','httpService','$location','$routeParams', function ($scope, httpService, $location, $routeParams) {

            var dateStr = $routeParams.dateStr;

            $scope.timeEntryDate = new Date();
            if(dateStr) {
                $scope.timeEntryDate = new Date(dateStr);
            }
            $scope.timeEntries = [];

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('time/' + dateStr);
                //getTimeEntries();
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('time/' + dateStr);
                //getTimeEntries();
            };

            var getTimeEntries = function () {
                // Get the list of time entries
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                httpService.getCollection('timeentries/date/' + dateStr).then(function(entries) {
                    $scope.timeEntries = entries;
                    getColorClassForEntries($scope.timeEntries);
                });
            };

            $scope.editEntry = function (entry) {
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('/time/edit/' + dateStr + '/' + entry.TimeEntryId);
            };

            var getColorClassForEntries = function (entries) {
                for(var i = 0; i < entries.length; i++) {
                    entries[i].ProjectColorClass = getColorClass(entries[i].ProjectRoleId,entries[i].ProjectTaskId);
                }
            };

            var getColorClass = function (num1,num2) {
                var colorClass = 'project-color-';
                var num = 0;
                var num1 = num1.toString().slice(-1);
                var num2 = num2.toString().slice(-1);
                if(num1 > num2) {
                    num = num2 / num1;
                } else {
                    num = num1 / num2;
                }
                colorClass = colorClass + Math.floor(num * 10);
                return colorClass;
            };

            getTimeEntries();


        }]);
})();
