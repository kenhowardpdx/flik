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
        controller: 'TimeEntriesCtrl',
        title: 'Time Entries'
      })
      .when('/time/add', {
          templateUrl: 'time/time-edit.html',
          controller: 'TimeEntryCtrl',
          title: 'Add Time'
      })
      .when('/time/edit/:entryId', {
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

(function() {
	'use strict';
	angular.module('app')
		.filter('aDate', function($filter) {
		  var suffixes = ["th", "st", "nd", "rd"];
		  return function(input, format) {
		    var dtfilter = $filter('date')(input, format);
		    var day = parseInt($filter('date')(input, 'dd'));
		    var relevantDigits = (day < 30) ? day % 20 : day % 30;
		    var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
		    return dtfilter.replace('oo', suffix);
		  };
		});
})();

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
        .controller('NavCtrl', function ($scope, $location) {

            $scope.isActive = function (r) {
                var routes = r.join('|'),
                    regexStr = '^\/(' + routes + ')',
                    path = new RegExp(regexStr);
                if(r[0] === 'home' && $location.path() === '/') {
                    return true;
                }
                return path.test($location.path());
            };

      		$scope.isCollapsed = true;
        });
})();

(function() {
	'use strict';
	angular.module('app')
		.controller('MainCtrl', [function () {
		}]);
})();

(function(){
	'use strict';

	angular.module('app')
		.controller('ProjectCtrl', ['$scope','$location','$routeParams','$http','toaster','CONFIG', function ($scope, $location, $routeParams, $http, toaster, CONFIG) {
		// Do awesome things

		$scope.projectId = $routeParams.projectId;

		if($scope.projectId) {
			// Get record
			$http.get(CONFIG.API_URL + 'api/projects/' + $scope.projectId)
			.success(function(data) {
				$scope.project = data;
			})
			.error(function() {
				toaster.pop('error', 'Something went horribly wrong');
			});
		} else {
			// Create empty record
			$scope.project = {};
		}

		$scope.saveRecord = function() {
			var data = $scope.project;
			var id = $scope.projectId;
			if (id) {
				// Update record
				$http.put(CONFIG.API_URL + 'api/projects/' + id, data)
				.success(function() {
					toaster.pop('success','Updated Project');
					$location.url('/projects');
				})
				.error(function() {
					toaster.pop('error', 'Something went horribly wrong');
				});
			} else {
				// Add record
				$http.post(CONFIG.API_URL + 'api/projects', data)
				.success(function(res){
					var data = {
						ProjectId: res.ProjectId,
						Name: 'default'
					};

					$http.post(CONFIG.API_URL + 'api/projectroles', data)
					.success(function(res) {
						data.ProjectRoleId = res.ProjectRoleId;
						data.Billable = true;
						data.RequireComment = true;
						$http.post(CONFIG.API_URL + 'api/projecttasks', data)
						.success(function(res) {
							toaster.pop('success','Created Project');
							$location.url('/projects');
						})
						.error(function() {
							$http.delete(CONFIG.API_URL + 'api/projectroles/' + data.ProjectRoleId);
							$http.delete(CONFIG.API_URL + 'api/projects/' + data.ProjectId);
							toaster.pop('error', 'Unable to create default project task');
						});
					})
					.error(function() {
						$http.delete(CONFIG.API_URL + 'api/projects/' + data.ProjectId);
						toaster.pop('error', 'Unable to create deault project role');
					});
				})
				.error(function(){
					toaster.pop('error', 'Something went horribly wrong');
				});
			}
		};


		}]);
})();

(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','$http','CONFIG','toaster', function ($scope,$http,CONFIG,toaster) {
		// Do awesome stuff

		// Get the list of projects for this user
		$http.get(CONFIG.API_URL + 'api/projects').
		success(function(res) {
			$scope.projects = res;
		}).
		error(function(status) {
			console.log(status);
		});

		$scope.deleteRecord = function($index) {
			var data = $scope.projects[$index];
			var id = data.ProjectId;
			if (id) {
				// Delete record
				// TODO: Handle confirmation messages with Angular/Bootstrap.
				if(confirm('Are you sure?')) {
					$http.get(CONFIG.API_URL + 'api/projects/' + id)
					.success(function(res) {
						var fail = 0;
						if (res.ProjectRoles.length > 0) {
							for (var i = 0; i < res.ProjectRoles.length; i++) {
								$http.delete(CONFIG.API_URL + 'api/projectroles/' + res.ProjectRoles[i].ProjectRoleId)
								.success(function() {
									fail = (fail) ? fail - 1 : 0;
								})
								.error(function(res) {
									console.log(res);
									fail = fail + 1;
								});
							}
						} else {
							fail = (fail) ? fail - 1 : 0;
						}
						if (res.ProjectTasks.length > 0) {
							for (var i = 0; i < res.ProjectTasks.length; i++) {
								$http.delete(CONFIG.API_URL + 'api/projecttasks/' + res.ProjectTasks[i].ProjectTaskId)
								.success(function() {
									fail = (fail) ? fail - 1 : 0;
								})
								.error(function(res) {
									console.log(res);
									fail = fail + 1;
								});
							}
						} else {
							fail = (fail) ? fail - 1 : 0;
						}
						if (!fail) {
							$http.delete(CONFIG.API_URL + 'api/projects/' + id)
							.success(function() {
								// TODO: Animate item removed...
								$scope.projects.splice($index,1);
							})
							.error(function(res) {
								console.log(res);
								toaster.pop('error', 'Something went horribly wrong');
							});
						} else {
							toaster.pop('error', 'Something went horribly wrong');
						}
					});
				}
			}
		};

	}]);
})();

(function() {
	'use strict';

	angular.module('app')
		.factory('App', [function() {
			return {
				formatDate: function (date,format) {
				    return date.format(format); // This is not going to stay. Just using it to stub out service.
				}
			};
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
            UseStopwatchApproachToTimeEntry: false,
            ExternalSystemKey : 'CTRS*'
          };

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

(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','$http','CONFIG', function ($scope, $http, CONFIG) {

            $scope.timeEntryDate = new Date();
            $scope.timeEntries = [];

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                //getTimeEntries();
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
            };

            var getTimeEntries = function () {
                // Get the list of time entries
                $http.get(CONFIG.API_URL + 'api/timeentries/date/' + $scope.timeEntryDate.toString('m-d-yyy')).
                success(function(data) {
                	$scope.timeEntries = data;
                }).
                error(function(status) {
                	console.log(status);
                });
            };

            getTimeEntries();


        }]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl', ['$scope','$http','CONFIG','toaster', function ($scope, $http, CONFIG, toaster) {
			// Load list of projects for select list
			$http.get(CONFIG.API_URL + 'api/projects')
			.success(function(data) {
				$scope.availableProjects = data;
			})
			.error(function() {
				toast.pop('error', 'Something went horribly wrong');
			});

			if($scope.entryId) {
				$http.get(CONFIG.API_URL + 'api/timeentries/' + $scope.entryId)
				.success(function(data) {
					$scope.entry = data;
				})
				.error(function() {
					toaster.pop('error', 'Something went horribly wrong');
				});
			} else {
				$scope.entry = {};
			}

			$scope.saveRecord = function() {
				var data = $scope.entry;
				var id = $scope.entryId;
				data.ProjectRoleId = data.Project.ProjectRoles[0].ProjectRoleId;
				data.ProjectTaskId = data.Project.ProjectTasks[0].ProjectTaskId;
				if (id) {
					// Update record
					$http.put(CONFIG.API_URL + 'api/timeentries/' + id, data)
					.success(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time');
					})
					.error(function() {
						toaster.pop('error', 'Something went horribly wrong');
					});
				} else {
					// Add record
					var timestamp = new Date();
					data.TimeIn = timestamp.toUTCString(); // Not sure this is needed.
					$http.post(CONFIG.API_URL + 'api/timeentries', data)
					.success(function(){
						toaster.pop('success','Added Time Entry');
						$location.url('/time');
					})
					.error(function(data){
						var msg = data.Message;
						toaster.pop('error', msg);
					});
				}
			};
		}]);
})();
