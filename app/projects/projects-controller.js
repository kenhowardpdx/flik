(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','httpService', function ($scope,httpService) {
		// Do awesome stuff

		// Get the list of projects for this user
		httpService.getCollection('projects').then(function(projects) {
			$scope.projects = projects;
		});

		var deleteRole = function (roleId) {
			$http.delete(CONFIG.API_URL + 'api/projectroles/' + roleId)
				.success(function() {
					return true;
				})
				.error(function() {
					return false;
				});
		};

		var deleteTask = function (taskId) {
			$http.delete(CONFIG.API_URL + 'api/projecttasks/' + taskId)
				.success(function() {
					return true;
				})
				.error(function() {
					return false;
				});
		};

		$scope.deleteRecord = function($index) {
			var data = $scope.projects[$index];
			var id = data.ProjectId;
			if (id) {
				// Delete record
				// TODO: Handle confirmation messages with Angular/Bootstrap.
				if(confirm('Are you sure?')) {
					httpService.deleteItem('projects',id).then(function() {
						$scope.projects.splice($index,1);
					});
				}
			}
		};

	}]);
})();
