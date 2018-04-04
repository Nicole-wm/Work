angular.module('FogApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {   
	var ChartsAmcharts = function() {
		var initChartSample1 = function() {
			var chart = AmCharts.makeChart("chart_1", {
				"type": "serial",
				"theme": "light",

				"fontFamily": 'Open Sans',            
				"color":    '#888888',

				"pathToImages": App.getGlobalPluginsPath() + "amcharts/amcharts/images/",

				"dataProvider": [{
					"lineColor": "#b7e021",  
					"date": "2017-06-01",
					"duration": 30
				}, {
					"date": "2017-06-02",
					"duration": 50
				}, {
					"date": "2017-06-03",
					"duration": 40
				}, {
					"date": "2017-06-04",
					"duration": 60
				}, {
					"lineColor": "#fbd51a",
					"date": "2017-06-05",
					"duration": 35
				}, {
					"date": "2017-06-06",
					"duration": 50
				}, {
					"date": "2017-06-07",
					"duration": 45
				}, {
					"date": "2017-06-08",
					"duration": 80,
					"lineColor": "#2498d2"
				}, {
					"date": "2017-06-09",
					"duration": 70
				}, {
					"date": "2017-06-10",
					"duration": 100
				}, {
					"date": "2017-06-11",
					"duration": 80
				}, {
					"date": "2017-06-12",
					"duration": 85
				}],
				"balloon": {
					"cornerRadius": 6
				},
				"valueAxes": [{
					"position": "left",
					"axisAlpha": 0,
					"gridAlpha": 0
				}],
				"graphs": [{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"fillAlphas": 0.3,
					"fillColorsField": "lineColor",
					"legendValueText": "[[value]]",
					"lineColorField": "lineColor",
					"title": "duration",
					"valueField": "duration"
				}],
				"chartScrollbar": {},
				"chartCursor": {
					"categoryBalloonDateFormat": "YYYY MMM DD",
					"cursorAlpha": 0,
					"zoomable": false
				},
				"dataDateFormat": "YYYY-MM-DD",
				"categoryField": "date",
				"categoryAxis": {
					"dateFormats": [{
						"period": "DD",
						"format": "DD"
					}, {
						"period": "WW",
						"format": "MMM DD"
					}, {
						"period": "MM",
						"format": "MMM"
					}, {
						"period": "YYYY",
						"format": "YYYY"
					}],
					"parseDates": true,
					"autoGridCount": false,
					"axisColor": "#555555",
					"gridAlpha": 0,
					"gridCount": 50
				},
			});

			$('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
				chart.invalidateSize();
			});
		}

		var initChartSample2 = function() {
			var chart = AmCharts.makeChart("chart_2", {
				"type": "serial",
				"theme": "light",

				"fontFamily": 'Open Sans',            
				"color":    '#888888',

				"pathToImages": App.getGlobalPluginsPath() + "amcharts/amcharts/images/",

				"dataProvider": [{
					"lineColor": "#b7e021",  
					"date": "2017-06-01",
					"duration": 2000
				}, {
					"date": "2017-06-02",
					"duration": 3000
				}, {
					"date": "2017-06-03",
					"duration": 2500
				}, {
					"date": "2017-06-04",
					"duration": 3500
				}, {
					"lineColor": "#fbd51a",
					"date": "2017-06-05",
					"duration": 4000
				}, {
					"date": "2017-06-06",
					"duration": 5000
				}, {
					"date": "2017-06-07",
					"duration": 4000
				}, {
					"date": "2017-06-08",
					"duration": 6000,
					"lineColor": "#2498d2"
				}, {
					"date": "2017-06-09",
					"duration": 7000
				}, {
					"date": "2017-06-10",
					"duration": 8000
				}, {
					"date": "2017-06-11",
					"duration": 7500
				}, {
					"date": "2017-06-12",
					"duration": 7000
				}],
				"balloon": {
					"cornerRadius": 6
				},
				"valueAxes": [{
					"position": "left",
					"axisAlpha": 0,
					"gridAlpha": 0
				}],
				"graphs": [{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"fillAlphas": 0.3,
					"fillColorsField": "lineColor",
					"legendValueText": "[[value]]",
					"lineColorField": "lineColor",
					"title": "duration",
					"valueField": "duration"
				}],
				"chartScrollbar": {},
				"chartCursor": {
					"categoryBalloonDateFormat": "YYYY MMM DD",
					"cursorAlpha": 0,
					"zoomable": false
				},
				"dataDateFormat": "YYYY-MM-DD",
				"categoryField": "date",
				"categoryAxis": {
					"dateFormats": [{
						"period": "DD",
						"format": "DD"
					}, {
						"period": "WW",
						"format": "MMM DD"
					}, {
						"period": "MM",
						"format": "MMM"
					}, {
						"period": "YYYY",
						"format": "YYYY"
					}],
					"parseDates": true,
					"autoGridCount": false,
					"axisColor": "#555555",
					"gridAlpha": 0,
					"gridCount": 50
				},
			});

			$('#chart_2').closest('.portlet').find('.fullscreen').click(function() {
				chart.invalidateSize();
			});
		}

		return {
			init: function() {
				initChartSample1();
				initChartSample2();
			}
		};
	}();

	jQuery(document).ready(function () {
		ChartsAmcharts.init();
	});
});

