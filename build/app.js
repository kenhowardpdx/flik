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

(function() {
    'use strict';

    angular.module('site-config',[]);

    var configData = {
        'CONFIG': {
            'SITE_NAME': 'Citrus',
            'APP_VERSION': '1.0.0',
            'API_URL': 'https://csgprohackathonapi.azurewebsites.net/',
            'USERNAME_PREFIX': 'c*'
    }
    };
    angular.forEach(configData, function(key,value) {
    angular.module('site-config').constant(value,key);
    // Load config constants
    });
})();

'use strict';

angular.module('app')
    .controller('NavCtrl', function ($scope, $location) {
        $scope.isActive = function(route) {
            return route === $location.path();
        };

  		$scope.isCollapsed = true;
    });

(function() {
    'use strict';

    angular.module('login-logout', [])
      .controller('LoginCtrl', function ($scope, UserServices) {
        $scope.login = function(credentials) {
          UserServices.login(credentials.username,credentials.password);
        };
      })
      .controller('LogOutCtrl', function ($scope, UserServices) {
        UserServices.logout();
      });
})();

(function() {
	'use strict';
	angular.module('app')
		.controller('MainCtrl', [function () {
		}]);
})();

(function() {
    'use strict';

    angular.module('app')
        .factory('Auth', ['Base64', '$cookieStore', '$http', function (Base64, $cookieStore, $http) {
            // initialize to whatever is in the cookie, if anything
            $http.defaults.headers.common.Authorization = 'Basic ' + $cookieStore.get('authdata');

            return {
                setCredentials: function (username, password) {
                    var encoded = Base64.encode(username + ':' + password);
                    $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
                    $cookieStore.put('authdata', encoded);
                  },
                clearCredentials: function () {
                    document.execCommand('ClearAuthenticationCache');
                    $cookieStore.remove('authdata');
                    $http.defaults.headers.common.Authorization = 'Basic ';
                  },
                readCredentials: function () {
                  var decoded = Base64.decode($cookieStore.get('authdata'));
                  return $cookieStore.get('authdata') + ' ---- ' + decoded;
                }
              };
          }]);
})();

/* jshint ignore:start */
(function() {
	angular.module('app')
	.factory('Base64', function() {
		var keyStr = 'ABCDEFGHIJKLMNOP' +
			'QRSTUVWXYZabcdef' +
			'ghijklmnopqrstuv' +
			'wxyz0123456789+/' +
			'=';
		return {
			encode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				do {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
						keyStr.charAt(enc1) +
						keyStr.charAt(enc2) +
						keyStr.charAt(enc3) +
						keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";
				} while (i < input.length);

				return output;
			},

			decode: function (input) {
				var output = "";
				var chr1, chr2, chr3 = "";
				var enc1, enc2, enc3, enc4 = "";
				var i = 0;

				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					alert("There were invalid base64 characters in the input text.\n" +
						"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
						"Expect errors in decoding.");
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 != 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 != 64) {
						output = output + String.fromCharCode(chr3);
					}

					chr1 = chr2 = chr3 = "";
					enc1 = enc2 = enc3 = enc4 = "";

				} while (i < input.length);

				return output;
			}
		};
	});
})();
/* jshint ignore:end */

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

(function() {
    'use strict';

    angular.module('app')
      .controller('SignupCtrl', ['$rootScope','$scope','$http','UserServices','CONFIG', function ($rootScope, $scope, $http, UserServices, CONFIG) {

        var newUser = {
          Username: '',
          Email: '',
          Password: '',
          UserID: null
        };

        $scope.errors = false; // hides the error panel

        $scope.createUser = function() {

          newUser = {
            Password: $scope.password,
            UserName: CONFIG.USERNAME_PREFIX + $scope.username,
            Name    : $scope.name,
            Email   : $scope.email,
            TimeZoneId : 'Pacific Standard Time',
            // UseStopwatchApproachToTimeEntry: false,
            // ExternalSystemKey : 'this is a string #CITRUS'
          };

          // KHTODO: Enable Twitter Registration
          //OAuth.initialize('IZhywZ2WEaqbWh7-zWYN_VL_acY');
          //OAuth.redirect('twitter', "/#/");

          $http.post(CONFIG.API_URL + 'api/users', newUser).
            success(function(data) {
              $rootScope.user = data;
              UserServices.login($scope.username,$scope.password);
            }).
            error(function(data, status) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              if(status === 400) {

                // check if the user already exists

                $scope.errors = true;
                $scope.errorHeading = data.Message;
                $scope.errorList = data.Errors;
              } else {
                console.log('Status != 400');
                console.log(status);
              }
            });
        };

        }]);
})();

'use strict';

angular.module('app')
  .controller('TimeCtrl', function ($scope) {
    if($scope) {
      // just a place holder
    }
  });
