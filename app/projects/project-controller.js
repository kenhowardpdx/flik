(function(){
	'use strict';

	angular.module('app')
		.controller('ProjectCtrl', ['$scope','$location','$routeParams','httpService','toaster', function ($scope, $location, $routeParams, httpService, toaster) {
		// Do awesome things

		$scope.projectId = $routeParams.projectId;

		if($scope.projectId) {
			// Get record
			httpService.getItem('projects',$scope.projectId).then(function(project) {
				$scope.project = project;
			});
		} else {
			// Create empty record
			$scope.project = {};
		}

		$scope.saveRecord = function() {
			var data = $scope.project;
			var id = $scope.projectId;
			if (id) {
				// Update record
				httpService.updateItem('projects',id,data).then(function() {
					toaster.pop('success', 'Updated Project');
					$location.url('/projects');
				});
			} else {
				// Add record
				httpService.createItem('projects', data).then(function(project) {
					var data = {
						ProjectId: project.ProjectId,
						Name: 'default'
					};
					httpService.createItem('projectroles', data).then(function(projectRole) {
						data.ProjectRoleId = projectRole.ProjectRoleId;
						data.Billable = true;
						data.RequireComment = true;
						httpService.createItem('projecttasks', data).then(function() {
							toaster.pop('success', 'Created Project');
							$location.url('/projects');
						});
					});
				});
			}
		};


		}]);
})();
