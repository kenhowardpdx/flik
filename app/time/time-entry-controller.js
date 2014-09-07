(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl', ['$scope','$http','CONFIG','toaster', function ($scope, $http, CONFIG, toaster) {
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

			// {
			// "ProjectRoleId": 1,
			// "ProjectTaskId": 1,
			// "Billable": true,
			// "TimeIn": "2014-09-06T23:43:31.3567148+00:00",
			// "TimeOut": "2014-09-06T23:43:31.3567148+00:00",
			// "Hours": 1.0,
			// "Comment": "sample string 2"
			// }


		}]);
})();
