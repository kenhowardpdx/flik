(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl', ['$scope','$http','CONFIG','toaster', function ($scope, $http, CONFIG, toaster) {
			// Load list of projects for select list
			$http.get(CONFIG.API_URL + 'api/projects')
			.success(function(data) {
				$scope.availableProjects = data;
			})
			.error(function() {
				toast.pop('error', 'Something went horribly wrong');
			});

			if($scope.entryId) {
				$http.get(CONFIG.API_URL + 'api/timeentries/' + $scope.entryId)
				.success(function(data) {
					$scope.entry = data;
				})
				.error(function() {
					toaster.pop('error', 'Something went horribly wrong');
				});
			} else {
				$scope.entry = {};
			}

			$scope.saveRecord = function() {
				var data = $scope.entry;
				var id = $scope.entryId;
				data.ProjectRoleId = data.Project.ProjectRoles[0].ProjectRoleId;
				data.ProjectTaskId = data.Project.ProjectTasks[0].ProjectTaskId;
				if (id) {
					// Update record
					$http.put(CONFIG.API_URL + 'api/timeentries/' + id, data)
					.success(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time');
					})
					.error(function() {
						toaster.pop('error', 'Something went horribly wrong');
					});
				} else {
					// Add record
					var timestamp = new Date();
					data.TimeIn = timestamp.toUTCString(); // Not sure this is needed.
					$http.post(CONFIG.API_URL + 'api/timeentries', data)
					.success(function(){
						toaster.pop('success','Added Time Entry');
						$location.url('/time');
					})
					.error(function(data){
						var msg = data.Message;
						toaster.pop('error', msg);
					});
				}
			};
		}]);
})();
