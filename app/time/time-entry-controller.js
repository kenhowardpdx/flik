(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl',
			['$scope',
			'httpService',
			'$routeParams',
			'$location',
			'toaster',
			function ($scope, httpService, $routeParams, $location, toaster) {

			var entry,
				id = $routeParams.entryId,
				dateStr = $routeParams.dateStr;

			$scope.timeEntryDate = new Date(dateStr);

			// Load list of projects for select list
			httpService.getCollection('projects').then(function(projects) {
				$scope.availableProjects = projects;
			});

			$scope.availableContexts = [
				{
					ContextId: 0,
					Name: 'home'
				},
				{
					ContextId: 0,
					Name: 'office'
				}
			];

			$scope.enteredTime = '';

			if(id) {
				httpService.getItem('timeentries',$scope.entryId).then(function(entry) {
					$scope.entry = entry;
				});
			} else {
				$scope.entry = {};
			}

			var parseHours = function (str) {
				var regex = /\d+[\s]*[a-zA-Z]*/;
				var hoursStr = regex.exec(str);
			};

			var parseProject = function (str) {
				var regex = /#[a-zA-Z0-9]*/;
				var projectStr = regex.match(str);
			};

			var parseContext = function (str) {
				var regex = /@[a-zA-Z0-9]*/;
				var	contextStr = regex.match(str);
			};

			$scope.saveRecord = function() {
				$scope.entry.Hours = parseHours($scope.entry.Comment);
				$scope.entry.Project = parseProject($scope.entry.Comment);
				$scope.entry.Context = parseContext($scope.entry.Comment);
				entry = $scope.entry;
				entry.ProjectRoleId = entry.Project.ProjectRoles[0].ProjectRoleId;
				entry.ProjectTaskId = entry.Project.ProjectTasks[0].ProjectTaskId;
				if (id) {
					// Update record
					httpService.updateItem('timeentries', id, entry).then(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time');
					});
				} else {
					// Add record
					entry.TimeIn = dateStr;
					httpService.createItem('timeentries', entry).then(function() {
						toaster.pop('success','Added Time Entry');
						$location.url('/time');
					});
				}
			};
		}]);
})();
