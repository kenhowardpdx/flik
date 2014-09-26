(function() {
	'use strict';

	angular.module('app')
		.factory('flik', [function() {

			return {
				getActiveDay: getActiveDay
			}

			function getActiveDay (dateStr) {
				var activeDate = {};
				var dateArray = dateStr.split('-');
				activeDate.Year = dateArray[2];
				activeDate.Month = dateArray[0] - 1;
				activeDate.Day = dateArray[1];
				return activeDate;
			};
		}]);
})();
