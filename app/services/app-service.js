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
