(function() {
	'use strict';
	angular.module('app')
	.factory('UserServices', ['Auth', '$cookieStore', '$rootScope', 'httpService', '$location', 'CONFIG', function (Auth, $cookieStore, $rootScope, httpService, $location, CONFIG) {

		return {
			login: function(username,password) {
				if(!username || !password) {
				if($cookieStore.get('authdata')) {
					httpService.getCollection('users').then(function(user) {
						$rootScope.user = user;
						$rootScope.loggedUser = true;
						// Redirect to home
						var currentLoc = $location.path();
						if(currentLoc === '/login' || currentLoc === '/signup') {
							$location.path('/');
						}
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
