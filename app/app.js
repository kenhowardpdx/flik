(function() {
    'use strict';

    angular.module('app', ['ngCookies','ngRoute', 'ui.bootstrap', 'templates', 'site-config', 'ngAnimate', 'toaster', 'cgBusy', 'app.directives'])
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
        controller: 'TimeEntriesCtrl',
        title: 'Time Entries'
      })
      .when('/time/:dateStr', {
        templateUrl: 'time/time.html',
        controller: 'TimeEntriesCtrl',
        title: 'Time Entries'
      })
      .when('/time/add/:dateStr', {
          templateUrl: 'time/time-edit.html',
          controller: 'TimeEntryCtrl',
          title: 'Add Time'
      })
      .when('/time/edit/:dateStr/:entryId', {
          templateUrl: 'time/time-edit.html',
          controller: 'TimeEntryCtrl',
          title: 'Edit Time'
      })
      .when('/projects', {
          templateUrl: 'projects/projects.html',
          controller: 'ProjectsCtrl',
          title: 'Projects'
      })
      .when('/project/add', {
          templateUrl: 'projects/project-edit.html',
          controller: 'ProjectCtrl',
          title: 'Create Project'
      })
      .when('/project/edit/:projectId', {
          templateUrl: 'projects/project-edit.html',
          controller: 'ProjectCtrl',
          title: 'Edit Project'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
  angular.module('app.directives', []);
})();
