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
	}]);
})();
