(function() {
    'use strict';

    angular.module('app')
        .factory('Auth', ['Base64', '$cookieStore', 'httpService', function (Base64, $cookieStore, httpService) {
            // initialize to whatever is in the cookie, if anything
            httpService.setAuthHeader('Basic ' + $cookieStore.get('authdata'));

            return {
                setCredentials: function (username, password) {
                    var encoded = Base64.encode(username + ':' + password);
                    httpService.setAuthHeader('Basic ' + encoded);
                    $cookieStore.put('authdata', encoded);
                  },
                clearCredentials: function () {
                    document.execCommand('ClearAuthenticationCache');
                    $cookieStore.remove('authdata');
                    httpService.setAuthHeader('');
                  },
                readCredentials: function () {
                  var decoded = Base64.decode($cookieStore.get('authdata'));
                  return $cookieStore.get('authdata') + ' ---- ' + decoded;
                }
              };
          }]);
})();
