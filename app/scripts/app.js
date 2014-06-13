'use strict';

var app = angular.module('citrusApp', ['ngCookies','ngResource','ngSanitize','ngRoute'
  ]);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        // log the user out and redirect to login
        templateUrl: 'views/main.html',
        controller: 'LogOutCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

app.run(function ($rootScope, $location, $cookieStore, UserServices) {

  UserServices.resetUser();

  $rootScope.loggedUser = false;

  // Check if cookie exists
  if ($cookieStore.get('authdata')) {
    // login user
    UserServices.login();
  }

  $rootScope.$on( '$routeChangeStart', function(event, next) {

    if (!$rootScope.loggedUser) {
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
