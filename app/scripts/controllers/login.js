'use strict';

angular.module('citrusApp')
  .controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {

    $scope.credentials = {
      username: '',
      password: ''
    };

    $scope.login = function (credentials) {
      AuthService.login(credentials).then(function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      }, function () {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };
  })
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .factory('AuthService', function ($http, $cookieStore) {
    var baseURL = 'https://csgprohackathonapi.azurewebsites.net';
    return {
      login: function (credentials) {
        var authString = btoa(credentials.username + ':' + credentials.password);
        var authHeader = {
          'Authorization': 'Basic ' + authString
        }
        return $http
          .get(baseURL + '/api/users', {headers: authHeader})
          .then(function (res) {
            $cookieStore.put('auth', authString);
          });
      }
    };
  })
  .controller('ApplicationController', function ($scope, AuthService) {
    $scope.currentUser = null;
  })
  .directive('formAutofillFix', function ($timeout) {
    return function (scope, element, attrs) {
      element.prop('method', 'post');
      if (attrs.ngSubmit) {
        $timeout(function () {
          element
            .unbind('submit')
            .bind('submit', function (event) {
              event.preventDefault();
              element
                .find('input, textarea, select')
                .trigger('input')
                .trigger('change')
                .trigger('keydown');
              scope.$apply(attrs.ngSubmit);
            });
        });
      }
    };
  });
