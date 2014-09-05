(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','$http','CONFIG', function ($scope,$http,CONFIG) {
		// Do awesome stuff

		// Get the list of projects for this user
		$http.get(CONFIG.API_URL + 'api/projects').
		success(function(data) {
			$scope.projects = data;
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
					$http.delete(CONFIG.API_URL + 'api/projects/' + id)
					.success(function(data) {
						// TODO: Animate item removed...
						$scope.projects.splice($index,1);
					})
					.error(function(status) {
						toaster.pop('error', 'Unable to delete');
					});
				}
			}
		};

	}]);
})();
