'use strict';

angular.module('app', ['ngCookies','ngResource','ngSanitize','ngRoute', 'site-config', 'login-logout'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        title: 'Home'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/logout', {
        // log the user out and redirect to login
        templateUrl: 'views/main.html',
        controller: 'LogOutCtrl',
        title: 'Logout'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        title: 'Sign Up'
      })
      .when('/time', {
        templateUrl: 'views/time.html',
        controller: 'TimeCtrl',
        title: 'Time Entry'
      })
      .otherwise({
        redirectTo: '/login'
      });
  })
  .controller('AppCtrl', function($rootScope, $route, CONFIG) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
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
          if ( next.templateUrl !== 'views/login.html' && next.templateUrl !== 'views/signup.html' ) {
            $location.path( '/login' );
          }
        } else {
          if ( next.templateUrl === 'views/login.html' || next.templateUrl === 'views/signup.html' ) {
            $location.path( '/' );
          }
        }
      });
    });
