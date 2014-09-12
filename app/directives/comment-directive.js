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

							if (keyCode === 51 && $event.shiftKey) // #
							{
								scope.selectedHashItem = false;
							}

							if (keyCode === 50 && $event.shiftKey) // @
							{
								scope.selectedAtItem = false;
							}

							if (keyCode === 8 && (scope.model.slice(-1) == '@' || scope.model.slice(-1) == '#')) {
								scope.selectedHashItem = scope.selectedAtItem = true;
							}
						}
					},
					templateUrl: 'partials/comment.html'
				};
			}]);
})();
