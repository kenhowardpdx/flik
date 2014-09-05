(function() {
	'use strict';
	angular.module('app')
		.controller('AppCtrl', function($rootScope, $route, CONFIG) {
			$rootScope.$on('$routeChangeSuccess', function () {
				$rootScope.pageTitle = $route.current.title;
			});
			$rootScope.appTitle = CONFIG.SITE_NAME;
		})
		.run(function ($rootScope, $location, $cookieStore, UserServices) {

			UserServices.resetUser();

			$rootScope.loggedUser = false;
			$rootScope.user.Name = 'Guest';

			// Check if cookie exists
			if ($cookieStore.get('authdata')) {
			// login user
			UserServices.login();
			}

			$rootScope.$on( '$routeChangeStart', function(event, next) {

			if (!$rootScope.loggedUser && !$cookieStore.get('authdata')) {
				if ( next.templateUrl !== 'views/login.html' && next.templateUrl !== 'signup/signup.html' ) {
				$location.path( '/login' );
				}
			} else {
				if ( next.templateUrl === 'login/login.html' || next.templateUrl === 'signup/signup.html' ) {
				$location.path( '/' );
				}
			}
			});
		});
})();
