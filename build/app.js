(function() {
    'use strict';

    angular.module('app', ['ngCookies','ngRoute', 'ui.bootstrap', 'templates', 'site-config', 'ngAnimate', 'toaster', 'cgBusy'])
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
      .when('/time/add/:dateStr', {
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
            'DEBUG': true,
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

    angular.module('app')
        .value('cgBusyDefaults',{
            message:'Please Wait...',
            backdrop: true,
            delay: 100,
            minDuration: 900
        });
})();

(function() {
	'use strict';

	angular.module('app')
		.directive('comment', ['$timeout', function($timeout) {
				return {
					restrict: 'AEC',
					scope: {
						hashitems: '=',
						atitems: '=',
						prompt: '@',
						title: '@',
						model: '=',
						selectedHashItems: '=',
						selectedAtItems: '='
					},
					link: function(scope) {
						scope.handleSelection = function(type,item) {
							var symbol = '',
								pattern;
							if(type === 'hash') {
								scope.selectedHashItems.push(item);
								scope.selectedHashItem = true;
								symbol = '#';
							} else {
								scope.selectedAtItems.push(item);
								scope.selectedAtItem = true;
								symbol = '@';
							}
							pattern = new RegExp(symbol + '([a-zA-Z0-9]*)');
							scope.model = scope.model.replace(pattern, symbol + item.Name);
						};
						scope.current = 0;
						scope.selectedHashItem = true;
						scope.selectedAtItem = true; // hides the list initially
						scope.isSelected = function() {
							return false;
						};
						scope.evaluateKey = function($event) {
							var keyCode = $event.keyCode;
							if (keyCode === 51) // #
							{
								scope.selectedHashItem = false;
							}
							if (keyCode === 50) // @
							{
								scope.selectedAtItem = false;
							}
						}
					},
					templateUrl: 'partials/comment.html'
				};
			}]);
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

    angular.module('app')
        .controller('LoginCtrl', ['$scope','UserServices', function ($scope, UserServices) {
            $scope.login = function(credentials) {
                UserServices.login(credentials.username,credentials.password);
            };
        }])
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

(function(){
	'use strict';

	angular.module('app')
		.controller('ProjectCtrl', ['$scope','$location','$routeParams','httpService','toaster', function ($scope, $location, $routeParams, httpService, toaster) {
		// Do awesome things

		$scope.projectId = $routeParams.projectId;

		if($scope.projectId) {
			// Get record
			httpService.getItem('projects',$scope.projectId).then(function(project) {
				$scope.project = project;
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
				httpService.updateItem('projects',id,data).then(function() {
					toaster.pop('success', 'Updated Project');
					$location.url('/projects');
				});
			} else {
				// Add record
				httpService.createItem('projects', data).then(function(project) {
					var data = {
						ProjectId: project.ProjectId,
						Name: 'default'
					};
					httpService.createItem('projectroles', data).then(function(projectRole) {
						data.ProjectRoleId = projectRole.ProjectRoleId;
						data.Billable = true;
						data.RequireComment = true;
						httpService.createItem('projecttasks', data).then(function() {
							toaster.pop('success', 'Created Project');
							$location.url('/projects');
						});
					});
				});
			}
		};


		}]);
})();

(function() {
	'use strict';

	angular.module('app')
	.controller('ProjectsCtrl', ['$scope','httpService', function ($scope, httpService) {
		// Do awesome stuff

		// Get the list of projects for this user
		httpService.getCollection('projects').then(function(projects) {
			$scope.projects = projects;
		});

		var deleteRole = function (roleId) {
			return httpService.deleteItem('projectroles',roleId);
		};

		var deleteTask = function (taskId) {
			return httpService.deleteItem('projecttasks',taskId);
		};

		$scope.deleteRecord = function($index) {
			var data = $scope.projects[$index];
			var id = data.ProjectId;
			if (id) {
				// Delete record
				// TODO: Handle confirmation messages with Angular/Bootstrap.
				if(confirm('Are you sure?')) {
					httpService.getItem('projects', id).then(function(project) {
						var fail = 0;
						var i = 0;
						if (project.ProjectRoles.length > 0) {
							for (i = 0; i < project.ProjectRoles.length; i++) {
								fail = (!deleteRole(project.ProjectRoles[i].ProjectRoleId)) ? fail + 1 : fail;
							}
						}
						if (project.ProjectTasks.length > 0) {
							for (i = 0; i < project.ProjectTasks.length; i++) {
								fail = (!deleteTask(project.ProjectTasks[i].ProjectTaskId)) ? fail + 1 : fail;
							}
						}
						if (!fail) {
							httpService.deleteItem('projects',id).then(function() {
								// TODO: Animate item removed...
								$scope.projects.splice($index,1);
							});
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

(function () {
	'use strict';

	angular.module('app')
		.service('httpService', ['$http','CONFIG','$rootScope', function($http, CONFIG, $rootScope) {

			var baseApiUrl = CONFIG.API_URL + 'api/';

			return ({
				setAuthHeader: setAuthHeader,
				getCollection: getCollection,
				getItem: getItem,
				createItem: createItem,
				updateItem: updateItem,
				deleteItem: deleteItem
			});

			function setAuthHeader(authStr) {
				$http.defaults.headers.common.Authorization = authStr;
			}

			function getCollection(entity) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));

			}

			function getItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function createItem(entity,data) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "post",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function updateItem(entity,id,data) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "put",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function deleteItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "delete",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function handleError(response) {
				return (response.message);
			}

			function handleSuccess(response) {
				return (response.data);
			}
		}]);
})();

(function() {
	'use strict';
	angular.module('app')
	.factory('UserServices', ['Auth', '$cookieStore', '$rootScope', 'httpService', '$location', 'CONFIG', function (Auth, $cookieStore, $rootScope, httpService, $location, CONFIG) {

		return {
			login: function(username,password) {
				if(!username || !password) {
				if($cookieStore.get('authdata')) {
					httpService.getCollection('users').then(function(user) {
						$rootScope.user = user;
						$rootScope.loggedUser = true;
						// Redirect to home
						var currentLoc = $location.path();
						if(currentLoc === '/login' || currentLoc === '/signup') {
							$location.path('/');
						}
					});
				} else {
					$location.path('/login');
				}
				} else {
					username = this.saltUserName(username);
					Auth.setCredentials(username,password);
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
			},
			saltUserName: function(username) {
				return CONFIG.USERNAME_PREFIX + username;
			}
		};
	}]);
})();

(function() {
    'use strict';

    angular.module('app')
        .controller('SignupCtrl', ['$rootScope','$scope','httpService','UserServices', function ($rootScope, $scope, httpService, UserServices) {

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
                    UserName: UserServices.saltUserName($scope.username),
                    Name    : $scope.name,
                    Email   : $scope.email,
                    TimeZoneId : 'Pacific Standard Time',
                    UseStopwatchApproachToTimeEntry: false,
                    ExternalSystemKey : 'CTRS*'
                };

                httpService.createItem('users', newUser).then(function(user) {
                    $rootScope.user = user;
                    UserServices.login($scope.username,$scope.password);
                });
            };

        }]);
})();

(function() {
    'use strict';

    angular.module('app')
        .controller('TimeEntriesCtrl', ['$scope','httpService', function ($scope, httpService) {

            $scope.timeEntryDate = new Date();
            $scope.timeEntries = [];

            $scope.previousDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() - 1);
                getTimeEntries();
            };

            $scope.nextDate = function () {
                $scope.timeEntryDate.setDate($scope.timeEntryDate.getDate() + 1);
                getTimeEntries();
            };

            var getTimeEntries = function () {
                // Get the list of time entries
                var date = $scope.timeEntryDate;
                var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                httpService.getCollection('timeentries/date/' + dateStr).then(function(entries) {
                    $scope.timeEntries = entries;
                });
            };

            getTimeEntries();


        }]);
})();

(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl', ['$scope','httpService','$routeParams','$location','toaster', function ($scope, httpService, $routeParams, $location, toaster) {

			var entry,
				id = $routeParams.entryId,
				dateStr = $routeParams.dateStr;

			$scope.timeEntryDate = new Date(dateStr);

			// Load list of projects for select list
			httpService.getCollection('projects').then(function(projects) {
				$scope.availableProjects = projects;
			});

			$scope.availableContexts = [
				{
					ContextId: 0,
					Name: 'home'
				},
				{
					ContextId: 0,
					Name: 'office'
				}
			];

			$scope.selectedProjects = [];
			$scope.selectedContexts = [];

			if(id) {
				httpService.getItem('timeentries',$scope.entryId).then(function(entry) {
					$scope.entry = entry;
				});
			} else {
				$scope.entry = {};
			}

			$scope.saveRecord = function() {
				entry = $scope.entry;
				entry.ProjectRoleId = entry.Project.ProjectRoles[0].ProjectRoleId;
				entry.ProjectTaskId = entry.Project.ProjectTasks[0].ProjectTaskId;
				if (id) {
					// Update record
					httpService.updateItem('timeentries', id, entry).then(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time');
					});
				} else {
					// Add record
					entry.TimeIn = dateStr;
					httpService.createItem('timeentries', entry).then(function() {
						toaster.pop('success','Added Time Entry');
						$location.url('/time');
					});
				}
			};
		}]);
})();
