(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','$http','CONFIG','toaster', function ($scope,$http,CONFIG,toaster) {
		// Do awesome stuff

		// Get the list of projects for this user
		$http.get(CONFIG.API_URL + 'api/projects').
		success(function(res) {
			$scope.projects = res;
		}).
		error(function(status) {
			console.log(status);
		});

		$scope.deleteRecord = function($index) {
			var data = $scope.projects[$index];
			var id = data.ProjectId;
			if (id) {
				// Delete record
				// TODO: Handle confirmation messages with Angular/Bootstrap.
				if(confirm('Are you sure?')) {
					$http.get(CONFIG.API_URL + 'api/projects/' + id)
					.success(function(res) {
						var fail = 0;
						if (res.ProjectRoles.length > 0) {
							for (var i = 0; i < res.ProjectRoles.length; i++) {
								$http.delete(CONFIG.API_URL + 'api/projectroles/' + res.ProjectRoles[i].ProjectRoleId)
								.success(function() {
									fail = (fail) ? fail - 1 : 0;
								})
								.error(function(res) {
									console.log(res);
									fail = fail + 1;
								});
							}
						} else {
							fail = (fail) ? fail - 1 : 0;
						}
						if (res.ProjectTasks.length > 0) {
							for (var i = 0; i < res.ProjectTasks.length; i++) {
								$http.delete(CONFIG.API_URL + 'api/projecttasks/' + res.ProjectTasks[i].ProjectTaskId)
								.success(function() {
									fail = (fail) ? fail - 1 : 0;
								})
								.error(function(res) {
									console.log(res);
									fail = fail + 1;
								});
							}
						} else {
							fail = (fail) ? fail - 1 : 0;
						}
						if (!fail) {
							$http.delete(CONFIG.API_URL + 'api/projects/' + id)
							.success(function() {
								// TODO: Animate item removed...
								$scope.projects.splice($index,1);
							})
							.error(function(res) {
								console.log(res);
								toaster.pop('error', 'Something went horribly wrong');
							});
						} else {
							toaster.pop('error', 'Something went horribly wrong');
						}
					});
				}
			}
		};

	}]);
})();
