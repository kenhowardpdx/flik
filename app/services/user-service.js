(function() {
	'use strict';
	angular.module('app')
	.factory('UserServices', ['Auth', '$cookieStore', '$rootScope', '$http', '$location', 'CONFIG', function (Auth, $cookieStore, $rootScope, $http, $location, CONFIG) {

		return {
			login: function(username,password) {
				if(!username || !password) {
				if($cookieStore.get('authdata')) {
					$http.get(CONFIG.API_URL + 'api/users').
					success(function(data) {
						// Store the user's data
						$rootScope.user = data;
						$rootScope.loggedUser = true;

						// Redirect to home
						var currentLoc = $location.path();
						if(currentLoc === '/login' || currentLoc === '/signup') {
						$location.path('/');
						}
					}).
					error(function(status) {
						$location.path('/login');
						console.log(status);
					});
				} else {
					$location.path('/login');
				}
				} else {
				Auth.setCredentials(CONFIG.USERNAME_PREFIX + username,password);
				this.login();
				}
			},
			logout: function() {
				Auth.clearCredentials();
				this.resetUser();

				// Redirect to login
				$location.path('/login');
			},
			resetUser: function() {
				$rootScope.user = {
				Email: '',
				ExternalSystemKey: null,
				Name: 'Guest',
				TimeZoneId: '',
				UseStopwatchApproachToTimeEntry: false,
				UserId: 0,
				UserName: ''
				};
				$rootScope.loggedUser = false;
			}
		};
	}]);
})();
