(function() {
	'use strict';

	angular.module('app')
		.controller('TimeEntryCtrl',
			['$scope',
			'httpService',
			'$routeParams',
			'$location',
			'toaster',
			'flik',
			function ($scope, httpService, $routeParams, $location, toaster, flik) {

			var id = $routeParams.entryId;
			var dateStr = $routeParams.dateStr;
			$scope.cancelHref = '#/time/' + dateStr;

			$scope.timeEntryDate = new Date();
			if($routeParams.dateStr) {
                var activeDate = flik.getActiveDay($routeParams.dateStr);

                $scope.timeEntryDate = new Date(activeDate.Year, activeDate.Month, activeDate.Day);
			}

			$scope.enteredTime = '';

			if(id) {
				httpService.getItem('timeentries', id).then(function(entry) {
					$scope.Comment = entry.Comment;
					$scope.TimeIn = entry.TimeIn;
				});
			} else {
				$scope.Comment = '';
				$scope.TimeIn = dateStr;
			}

			$scope.selectedProjects = [];
			$scope.selectedContexts = [];

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

			var timeToFloat = function (time) {
				var hoursMinutes = time.split(/[.:]/);
				var hours = parseInt(hoursMinutes[0], 10);
				var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
				return hours + minutes / 60;
			};

			var parseHours = function (str) {
				var regex = /\d+[.:]*[0-9]{0,2}[\s]*[a-zA-Z]*/;
				var timeStr = regex.exec(str);

				// separate the time from the label
				// split on the first space.
				var tmp = [];
				var tmpStr = timeStr[0].split(' ');
				tmp.push(tmpStr.shift());
				tmp.push(tmpStr.join(' '));

				var num = tmp[0];

				if(tmp[0].indexOf(':')) {
					num = timeToFloat(num);
				}

				if(!timeStr[0].indexOf(':') && !timeStr[0].indexOf('.')) {
					switch(tmp[1]) {
						case 'min':
						case 'm':
						case 'minutes':
							num = num / 60;
							break;
					}
				}

				num = (Math.round(num * 4) / 4).toFixed(2);

				return num;
			};

			var parseProject = function (str) {
				var regex = /#[a-zA-Z0-9]*/;
				var projectStr = regex.exec(str),
					projectStrLower;

				// Take everything after the #
				projectStr = projectStr[0].substring(1);
				projectStrLower = projectStr.toLowerCase();

				// compare strings
				for(var i = 0; i < $scope.availableProjects.length; i++) {
					var tmpStrLower = $scope.availableProjects[i].Name.toLowerCase();
					if(tmpStrLower === projectStrLower) {
						return $scope.availableProjects[i];
					}
				}

				return projectStr;
			};

			// var parseContext = function (str) {
			// 	var regex = /@[a-zA-Z0-9]*/;
			// 	var	contextStr = regex.exec(str);
			// };

			var createProject = function (str,cb) {
				var newProjectID = null;
				var data = { Name: str };
				httpService.createItem('projects', data).then(function(project) {
					newProjectID = project.ProjectId;
					var data = {
						ProjectId: newProjectID,
						Name: 'default'
					};
					httpService.createItem('projectroles', data).then(function(projectRole) {
						data.ProjectRoleId = projectRole.ProjectRoleId;
						data.Billable = true;
						data.RequireComment = true;
						httpService.createItem('projecttasks', data).then(function() {
							httpService.getItem('projects',newProjectID).then(function (project) {
								cb(project);
							});
						});
					});
				});
			};

			var lookupProject = function(str) {
				var project = parseProject(str);
				if(typeof project === 'object') {
					saveTimeEntry(str,project);
				} else {
					createProject(project, function(project) {
						// Add project to availableProjects to avoid duplication if
						// there's an error when saving the entry.
						$scope.availableProjects.push(project);

						saveTimeEntry(str,project);
					});
				}
			};

			var saveTimeEntry = function(str,project) {
				var date = $scope.timeEntryDate;
				var dateStr = '' + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
				var entry = {
					ProjectRoleId: project.ProjectRoles[0].ProjectRoleId,
					ProjectTaskId: project.ProjectTasks[0].ProjectTaskId,
					Billable: true,
					Hours: parseHours(str),
					Comment: str,
					TimeIn: $scope.TimeIn
				};

				if (id) {
					// Update record
					httpService.updateItem('timeentries', id, entry).then(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time/' + dateStr);
					},
					function(res) {
						console.log(res);
					});
				} else {
					// Add record
					httpService.createItem('timeentries', entry).then(function() {
						toaster.pop('success','Updated Time Entry');
						$location.url('/time/' + dateStr);
					},
					function(res) {
						console.log(res);
					});
				}
			};

			$scope.saveRecord = function() {
				// Look for existing project.. This kicks off the save process.
				lookupProject($scope.Comment);
			};
		}]);
})();
