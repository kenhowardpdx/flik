(function(){
	'use strict';

	angular.module('app')
		.controller('ProjectCtrl', ['$scope','$location','$routeParams','$http','toaster','CONFIG', function ($scope, $location, $routeParams, $http, toaster, CONFIG) {
		// Do awesome things

		$scope.projectId = $routeParams.projectId;

		if($scope.projectId) {
			// Get record
			$http.get(CONFIG.API_URL + 'api/projects/' + $scope.projectId)
			.success(function(data) {
				$scope.project = data;
			})
			.error(function() {
				toaster.pop('error', 'Something went horribly wrong');
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
				$http.put(CONFIG.API_URL + 'api/projects/' + id, data)
				.success(function() {
					toaster.pop('success','Updated Project');
					$location.url('/projects');
				})
				.error(function() {
					toaster.pop('error', 'Something went horribly wrong');
				});
			} else {
				// Add record
				$http.post(CONFIG.API_URL + 'api/projects', data)
				.success(function(res){
					var data = {
						ProjectId: res.ProjectId,
						Name: 'default'
					};

					$http.post(CONFIG.API_URL + 'api/projectroles', data)
					.success(function(res) {
						data.ProjectRoleId = res.ProjectRoleId;
						data.Billable = true;
						data.RequireComment = true;
						$http.post(CONFIG.API_URL + 'api/projecttasks', data)
						.success(function(res) {
							toaster.pop('success','Created Project');
							$location.url('/projects');
						})
						.error(function() {
							$http.delete(CONFIG.API_URL + 'api/projectroles/' + data.ProjectRoleId);
							$http.delete(CONFIG.API_URL + 'api/projects/' + data.ProjectId);
							toaster.pop('error', 'Unable to create default project task');
						});
					})
					.error(function() {
						$http.delete(CONFIG.API_URL + 'api/projects/' + data.ProjectId);
						toaster.pop('error', 'Unable to create deault project role');
					});
				})
				.error(function(){
					toaster.pop('error', 'Something went horribly wrong');
				});
			}
		};


		}]);
})();
