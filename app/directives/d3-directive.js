(function () {
    'use strict';

    angular.module('app.directives')
      .directive('d3Bars', ['$window', function ($window) {
          return {
              restrict: 'EA',
              scope: {
                  data: "=",
                  label: "@",
                  outerLabel: "@",
                  barColor: "@",
                  onClick: "&"
              },
              link: function (scope, iElement, iAttrs) {
                  var d3 = $window.d3;
                  var svg = d3.select(iElement[0])
                      .append("svg")
                      .attr("width", "100%");

                  // on window resize, re-render d3 canvas
                  window.onresize = function () {
                      return scope.$apply();
                  };
                  scope.$watch(function () {
                      return angular.element(window)[0].innerWidth;
                  }, function () {
                      return scope.render((scope.data) ? scope.data : 1);
                  }
                  );

                  // watch for data changes and re-render
                  scope.$watch('data', function (newVals, oldVals) {
                      return scope.render((newVals) ? newVals : 1);
                  }, true);

                  // define render function
                  scope.render = function (data) {
                      // remove all previous items before render
                      svg.selectAll("*").remove();

                      // setup variables
                      var width, height, max;
                      width = d3.select(iElement[0])[0][0].offsetWidth - 20;
                      // 20 is for margins and can be changed
                      height = (scope.data) ? scope.data.length * 35 : 1;
                      // 35 = 30(bar height) + 5(margin between bars)
                      max = 98;
                      // this can also be found dynamically when the data is not static
                      //max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))

                      // set the height based on the calculations above
                      svg.attr('height', height);

                      //create the rectangles for the bar chart
                      svg.selectAll("rect")
                        .data(data)
                        .enter()
                          .append("rect")
                          .on("click", function (d, i) { return scope.onClick({ item: d }); })
                          .attr("fill", function (d) { return d[scope.barColor]; })
                          .attr("height", 30) // height of each bar
                          .attr("width", 0) // initial width of 0 for transition
                          .attr("x", 10) // half of the 20 side margin specified above
                          .attr("y", function (d, i) {
                              return i * 35;
                          }) // height + margin between bars
                          .transition()
                            .duration(1000) // time of duration
                            .attr("width", function (d) {
                                return d.score / (max / width);
                            }); // width based on scale

                      svg.selectAll("amount")
                        .data(data)
                        .enter()
                          .append("amount")
                          .attr("style", 'display:block;')
                          .attr("fill", function (d) { return d[scope.barColor]; })
                          .attr("y", function (d, i) { return i * 35 + 22; })
                          .attr("x", function (d) {
                              return d.score / (max / width) + 20;
                          })
                          .text(function (d) { return d[scope.outerLabel]; });

                      svg.selectAll("text")
                        .data(data)
                        .enter()
                          .append("text")
                          .attr("fill", "#fff")
                          .attr("y", function (d, i) { return i * 35 + 22; })
                          .attr("x", 15)
                          .text(function (d) { return d[scope.label]; });

                  };
              }
          };
      }])
	.directive('d3Donut', ['$window','$timeout', function ($window, $timeout) {
		return {
			restrict: 'EA',
			scope: {
				data: "=",
				label: "@",
				barColor: "@",
				onClick: "&",
                updateItems: "&"
			},
			link: function (scope, iElement, iAttrs) {
				var d3 = $window.d3;

				var width = 600,
					height = (width < 400) ? 300 : 500,
					radius = Math.min(width, height) / 2;

                var items = [];

				var arc = d3.svg.arc()
					.innerRadius(radius - 100)
					.outerRadius(radius - 20);

				var svg = d3.select(iElement[0])
					.append("svg")
				    .attr("width", '100%')
				    .attr("height", '100%')
				    .attr('viewBox','0 0 '+Math.min(width,height)+' '+Math.min(width,height))
				    .attr('preserveAspectRatio','xMinYMin')
					.append("g")
					.attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

				// define render function
				scope.render = function (data) {
					// remove all previous items before render
					svg.selectAll("*").remove();

					var color = d3.scale.category20();

					var pie = d3.layout.pie()
						.value(function(d) { return d.score; })
						.sort(null);

					svg.datum(data).selectAll("path")
						.data(pie)
						.enter()
                            .append("path")
                            .each(function(d,i) { d.color = color(i); items.push(d); })
                            .on("click", function (d, i) { return scope.onClick({ item: d }); })
    						.attr("fill", function(d, i) { return d.color; })
    						.attr("d", arc)
    						.each(function(d) { this._current = d; }); // store the initial angles
				};

                if(scope.updateItems) {
                    $timeout(function() {
                        return scope.updateItems({ items: items });
                    }, 500);
                }

				// on window resize, re-render d3 canvas
				window.onresize = function () {
					return scope.$apply();
				};
				scope.$watch(function () {
					return angular.element(window)[0].innerWidth;
				}, function () {
					return scope.render((scope.data) ? scope.data : 1);
				}
				);

				// watch for data changes and re-render
				scope.$watch('data', function (newVals, oldVals) {
					return scope.render((newVals) ? newVals : 1);
				}, true);
			}
		};
	}]);

}());
