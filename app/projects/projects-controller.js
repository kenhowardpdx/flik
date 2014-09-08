(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','httpService', function ($scope, httpService) {
		// Do awesome stuff

		// Get the list of projects for this user
		httpService.getCollection('projects').then(function(projects) {
			$scope.projects = projects;
		});

		var deleteRole = function (roleId) {
			return httpService.deleteItem('projectroles',roleId);
		};

		var deleteTask = function (taskId) {
			return httpService.deleteItem('projecttasks',taskId);
		};

		$scope.deleteRecord = function($index) {
			var data = $scope.projects[$index];
			var id = data.ProjectId;
			if (id) {
				// Delete record
				// TODO: Handle confirmation messages with Angular/Bootstrap.
				if(confirm('Are you sure?')) {
					httpService.getItem('projects', id).then(function(project) {
						var fail = 0;
						var i = 0;
						if (project.ProjectRoles.length > 0) {
							for (i = 0; i < project.ProjectRoles.length; i++) {
								fail = (!deleteRole(project.ProjectRoles[i].ProjectRoleId)) ? fail + 1 : fail;
							}
						}
						if (project.ProjectTasks.length > 0) {
							for (i = 0; i < project.ProjectTasks.length; i++) {
								fail = (!deleteTask(project.ProjectTasks[i].ProjectTaskId)) ? fail + 1 : fail;
							}
						}
						if (!fail) {
							httpService.deleteItem('projects',id).then(function() {
								// TODO: Animate item removed...
								$scope.projects.splice($index,1);
							});
						}
					});
				}
			}
		};

	}]);
})();
