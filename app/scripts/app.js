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
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($cookieStore) {
    if ($cookieStore.get('auth')) {
      // display today's entries
      console.log('authorized');
    }
    else {
      // display login screen
      console.log('not authorized');
    }
  });
