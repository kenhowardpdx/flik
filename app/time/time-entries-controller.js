(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','httpService','$location','$routeParams','flik', function ($scope, httpService, $location, $routeParams, flik) {

            var activeDate = {};

            $scope.timeEntryDate = new Date();
            $scope.chartCollapsed = true;
            var defaultChartBtnLabel = 'Show Chart';
            $scope.chartBtnLabel = defaultChartBtnLabel;
            $scope.selected = {};

            $scope.toggleChart = function() {
                if($scope.chartCollapsed) {
                    $scope.chartBtnLabel = 'Hide Chart';
                } else {
                    $scope.chartBtnLabel = defaultChartBtnLabel;
                    for(var i = 0; i < $scope.timeEntries.length; i++) {
                        var entry = $scope.timeEntries[i];
                        entry.Revealed = true;
                    }
                }
                $scope.chartCollapsed = $scope.chartCollapsed ? false : true;
            }

            $scope.revealEntries = function(item) {
                for(var i = 0; i < $scope.timeEntries.length; i++) {
                    var entry = $scope.timeEntries[i];
                    var reveal = false;
                    if(item.data.name === entry.ProjectName) {
                        reveal = true
                    }

                    $scope.$apply(function () {
                        entry.Revealed = reveal;
                    });
                }
            }

            $scope.addColorToEntries = function(items) {
                for(var i = 0; i < items.length; i++) {
                    var item = items[i];
                    for(var x = 0; x < $scope.timeEntries.length; x++) {
                        var entry = $scope.timeEntries[x];
                        if(item.data.name === entry.ProjectName) {
                            entry.BackgroundColor = item.color;
                        }
                    }
                }
            }

            if($routeParams.dateStr) {
                var activeDate = flik.getActiveDay($routeParams.dateStr);

                $scope.timeEntryDate = new Date(activeDate.Year, activeDate.Month, activeDate.Day);
            }
            $scope.timeEntries = [];
            $scope.projectTotalsForDay = [];
            $scope.totalTime = 0;

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                var date = $scope.timeEntryDate;
                var newDateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('time/' + newDateStr);
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
                var date = $scope.timeEntryDate;
                var newDateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('time/' + newDateStr);
            };

            $scope.editEntry = function (entry) {
                var date = $scope.timeEntryDate;
                var newDateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                $location.url('/time/edit/' + newDateStr + '/' + entry.TimeEntryId);
            };

            var setupEntries = function (entries) {
                for(var i = 0; i < entries.length; i++) {
                    entries[i].BackgroundColor = '#222222';
                    entries[i].Color = '#fff';
                    entries[i].Revealed = true;
                }
            };

            var getColorClass = function (num1,num2) {
                var colorClass = 'project-color-';
                var num = 0;
                num1 = num1.toString().slice(-1);
                num2 = num2.toString().slice(-1);
                if(num1 > num2) {
                    num = num2 / num1;
                } else {
                    num = num1 / num2;
                }
                colorClass = colorClass + Math.floor(num * 9);
                return colorClass;
            };

            var getProjectTotals = function(entries) {
                var tmpProjectTotals = [];
                var totalTime = 0;
                for(var i = 0; i < entries.length; i++) {
                    var id = entries[i].ProjectTaskId;
                    var entryTime = parseFloat(entries[i].TotalTimeDisplay);
                    totalTime = totalTime + entryTime;
                    if(tmpProjectTotals[id]) {
                        tmpProjectTotals[id].score = tmpProjectTotals[id].score + entryTime;
                    } else {
                        tmpProjectTotals[id] = {
                            score: entryTime
                        };
                    }
                    tmpProjectTotals[id].name = entries[i].ProjectName;
                    tmpProjectTotals[id].color = '#33ff21';
                }

                for(var x in tmpProjectTotals) {
                    var percent = (tmpProjectTotals[x].score / totalTime) * 100;
                    tmpProjectTotals[x].score = percent;
                    $scope.projectTotalsForDay.push(tmpProjectTotals[x]);
                }

                $scope.totalTime = totalTime;
            };

            var date = $scope.timeEntryDate;
            var newDateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
            httpService.getCollection('timeentries/date/' + newDateStr).then(function(entries) {
                $scope.timeEntries = entries;
                setupEntries($scope.timeEntries);
                getProjectTotals($scope.timeEntries);
            });

        }]);
})();
