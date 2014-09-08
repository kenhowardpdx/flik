(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl', ['$scope','httpService','$routeParams','$location','toaster', function ($scope, httpService, $routeParams, $location, toaster) {

			var entry,
				id = $routeParams.entryId,
				dateStr = $routeParams.dateStr;

			$scope.timeEntryDate = new Date(dateStr);

			// Load list of projects for select list
			httpService.getCollection('projects').then(function(projects) {
				$scope.availableProjects = projects;
			});

			if(id) {
				httpService.getItem('timeentries',$scope.entryId).then(function(entry) {
					$scope.entry = entry;
				});
			} else {
				$scope.entry = {};
			}

			$scope.saveRecord = function() {
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
