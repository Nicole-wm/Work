angular.module('FogApp').controller('GatDetailsCountController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	/************************初始化数据************************/
	var GetListFun=function(param){/*应用管理*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取应用详情失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}
/*
	if(ID){
		GetListFun();
	}*/

	/************************页面调用方法************************/
	$scope.DelectFun=function(){
		Common.confirm({ 
			title: "应用信息",
			message: "确认删除应用？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息删除成功！",
						operate: function (reselt) {  
							$scope.BackFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.DeleteDeviceFun=function(){
		Common.confirm({ 
			title: "设备信息",
			message: "确认删除设备？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息删除设备！",
						operate: function (reselt) {  
							$scope.ReloadFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.SureAppFun=function(flag){/*Fun-确认-应用*/
		var param= {
			appid:ID,
			name:$scope.AppName
		};

		Common.confirm({ 
			title: "应用信息",
			message: "确认提交应用信息？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息提交成功！",
						operate: function (reselt) {  
							$scope.ReloadFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/ 
		window.location.reload('#/lora/application/app_details.html?ID='+ID);
	}

	$scope.BackFun=function(){
		window.location.href='#/lora/application/app_list.html';
	}


	var ChartsAmcharts = function() {
		var getRandomColor = function () {
			return '#' + (function (color) {
				return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
				&& (color.length == 6) ? color : arguments.callee(color);
			})('');
		}

    var initChartNum1 = function() {
        var chart = AmCharts.makeChart("chart_1", {
            "type": "serial",
            "theme": "light",

            "fontFamily": 'Open Sans',
            "color":    '#888888',

            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 120
            },
            "dataProvider": [{
                "date": "2012-01-01",
                "distance": 227,
                "townName": "New York",
                "townName2": "New York",
                "townSize": 25,
                "latitude": 40.71,
                "duration": 408
            }, {
                "date": "2012-01-02",
                "distance": 371,
                "townName": "Washington",
                "townSize": 14,
                "latitude": 38.89,
                "duration": 482
            }, {
                "date": "2012-01-03",
                "distance": 433,
                "townName": "Wilmington",
                "townSize": 6,
                "latitude": 34.22,
                "duration": 562
            }, {
                "date": "2012-01-04",
                "distance": 345,
                "townName": "Jacksonville",
                "townSize": 7,
                "latitude": 30.35,
                "duration": 379
            }, {
                "date": "2012-01-05",
                "distance": 480,
                "townName": "Miami",
                "townName2": "Miami",
                "townSize": 10,
                "latitude": 25.83,
                "duration": 501
            }, {
                "date": "2012-01-06",
                "distance": 386,
                "townName": "Tallahassee",
                "townSize": 7,
                "latitude": 30.46,
                "duration": 443
            }, {
                "date": "2012-01-07",
                "distance": 348,
                "townName": "New Orleans",
                "townSize": 10,
                "latitude": 29.94,
                "duration": 405
            }, {
                "date": "2012-01-08",
                "distance": 238,
                "townName": "Houston",
                "townName2": "Houston",
                "townSize": 16,
                "latitude": 29.76,
                "duration": 309
            }, {
                "date": "2012-01-09",
                "distance": 218,
                "townName": "Dalas",
                "townSize": 17,
                "latitude": 32.8,
                "duration": 287
            }, {
                "date": "2012-01-10",
                "distance": 349,
                "townName": "Oklahoma City",
                "townSize": 11,
                "latitude": 35.49,
                "duration": 485
            }, {
                "date": "2012-01-11",
                "distance": 603,
                "townName": "Kansas City",
                "townSize": 10,
                "latitude": 39.1,
                "duration": 890
            }, {
                "date": "2012-01-12",
                "distance": 534,
                "townName": "Denver",
                "townName2": "Denver",
                "townSize": 18,
                "latitude": 39.74,
                "duration": 810
            }, {
                "date": "2012-01-13",
                "townName": "Salt Lake City",
                "townSize": 12,
                "distance": 425,
                "duration": 670,
                "latitude": 40.75,
                "dashLength": 8,
                "alpha": 0.4
            }, {
                "date": "2012-01-14",
                "latitude": 36.1,
                "duration": 470,
                "townName": "Las Vegas",
                "townName2": "Las Vegas"
            }],
            "valueAxes": [{
                "id": "distanceAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "position": "left",
                "title": "包数"
            }, {
                "id": "latitudeAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "labelsEnabled": false,
                "position": "right"
            }, {
                "id": "durationAxis",
                "duration": "mm",
                "durationUnits": {
                    "hh": "h ",
                    "mm": "min"
                },
                "axisAlpha": 0,
                "gridAlpha": 0,
                "inside": true,
                "position": "right",
                "title": "时延"
            }],
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "[[value]] miles",
                "dashLengthField": "dashLength",
                "fillAlphas": 0.7,
                "legendPeriodValueText": "total: [[value.sum]] mi",
                "legendValueText": "[[value]] mi",
                "title": "包数",
                "type": "column",
                "valueField": "distance",
                "valueAxis": "distanceAxis"
            }, {
                "balloonText": "latitude:[[value]]",
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "useLineColorForBulletBorder": true,
                "bulletColor": "#FFFFFF",
                "bulletSizeField": "townSize",
                "dashLengthField": "dashLength",
                "descriptionField": "townName",
                "labelPosition": "right",
                "labelText": "[[townName2]]",
                "legendValueText": "[[description]]/[[value]]",
                "title": "已授权包数",
                "fillAlphas": 0,
                "valueField": "latitude",
                "valueAxis": "latitudeAxis"
            }, {
                "bullet": "square",
                "bulletBorderAlpha": 1,
                "bulletBorderThickness": 1,
                "dashLengthField": "dashLength",
                "legendValueText": "[[value]]",
                "title": "时延",
                "fillAlphas": 0,
                "valueField": "duration",
                "valueAxis": "durationAxis"
            }],
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
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
                "gridAlpha": 0.1,
                "gridColor": "#FFFFFF",
                "gridCount": 50
            },
            "exportConfig": {
                "menuBottom": "20px",
                "menuRight": "22px",
                "menuItems": [{
                    "icon": App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
                    "format": 'png'
                }]
            }
        });

        $('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });
    }

		return {
			init: function() {
				initChartNum1();
			}
		};
	}();

	jQuery(document).ready(function () {
		ChartsAmcharts.init();
	});
}]);
