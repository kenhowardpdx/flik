(function() {
    'use strict';

    angular.module('app', ['ngCookies','ngRoute', 'ui.bootstrap', 'templates', 'site-config', 'login-logout', 'ngAnimate', 'toaster'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.html',
        controller: 'MainCtrl',
        title: 'Home'
      })
      .when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/logout', {
        // log the user out and redirect to login
        templateUrl: 'login/login.html',
        controller: 'LogOutCtrl',
        title: 'Logout'
      })
      .when('/signup', {
        templateUrl: 'signup/signup.html',
        controller: 'SignupCtrl',
        title: 'Sign Up'
      })
      .when('/time', {
        templateUrl: 'time/time.html',
        controller: 'TimeCtrl',
        title: 'Time Entry'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
})();
