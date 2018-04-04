angular.module('FogApp').controller('DeviceCountController', function($rootScope, $scope, $http, $timeout) {
    var ChartsAmcharts = function() {
        var getRandomColor = function () {
            return '#' + (function (color) {
                return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
            })('');
        }

        var PieArr=[];
        var BarArr=[];

        var i = 0
        for (var a in PieArr) {
            PieArr[i].color = getRandomColor();
            i++;
        }
        var i = 0
        for (var a in BarArr) {
            BarArr[i].color = getRandomColor();
            i++;
        }

        var initChartSamplePie = function() {
            var chart = AmCharts.makeChart("chart_pie", {
                "type": "pie",
                "theme": "light",
                "fontFamily": 'Open Sans',
                "color":    '#888',
                "dataProvider": PieArr,
                "valueField": "amount",
                "titleField": "pname",
                "outlineAlpha": 0.4,
                "depth3D": 15,
                "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[amount]]</b> ([[percents]]%)</span>",
                "angle": 30,
                "exportConfig": {
                    menuItems: [{
                        icon: '/lib/3/images/export.png',
                        format: 'png'
                    }]
                }
            }, 0);


            $('#chart_pie').closest('.portlet').find('.fullscreen').click(function() {
                chart.invalidateSize();
            });
        }

        var initChartSampleBar = function() {
            var chart = AmCharts.makeChart("chart_bar", {
                "type": "serial",
                "theme": "light",
                "startDuration": 2,
                "fontFamily": 'Open Sans',
                "color":    '#888',
                "dataProvider": BarArr,
                "valueAxes": [{
                    "position": "left",
                    "axisAlpha": 0,
                    "gridAlpha": 0
                }],
                "graphs": [{
                    "balloonText": "[[category]]: <b>[[amount]]</b>",
                    "colorField": "color",
                    "fillAlphas": 0.85,
                    "lineAlpha": 0.1,
                    "type": "column",
                    "topRadius": 1,
                    "valueField": "amount"
                }],
                "depth3D": 40,
                "angle": 30,
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "categoryField": "pname",
                "categoryAxis": {
                    "gridPosition": "start",
                    "axisAlpha": 0,
                    "gridAlpha": 0

                },
                "exportConfig": {
                    "menuTop": "20px",
                    "menuRight": "20px",
                    "menuItems": [{
                        "icon": '/lib/3/images/export.png',
                        "format": 'png'
                    }]
                }
            }, 0);

            $('#chart_bar').closest('.portlet').find('.fullscreen').click(function() {
                chart.invalidateSize();
            });
        }

        return {
            init: function() {
                var Url = $rootScope.settings.portsPath+'product/devices/online/?type=0';
                var Data = '';
                var PostParam = {
                    method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
                };

                $http(PostParam).success(function(response){
                    if(response.meta.code==0){
                        PieArr=response.data;
                        initChartSamplePie();
                    }else{
                        CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                        Common.alert({
                            message:"获取设备统计失败！原因："+CurErrorMessage,
                            operate: function (reselt) {  
                            }
                        })
                    }
                }).error(function(response, status){
                    console.log(response.error);
                });

                var Url2 = $rootScope.settings.portsPath+'product/devices/amount/?type=0';
                var Data2 = '';
                var PostParam2 = {
                    method: 'GET',url:Url2,data:Data2,headers:{'AUTHORIZATION': "Token " + localStorage.token}
                };

                $http(PostParam2).success(function(response){
                    if(response.meta.code==0){
                        BarArr=response.data;
                        initChartSampleBar();
                    }else{
                        CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                        Common.alert({
                            message:"获取设备统计失败！原因："+CurErrorMessage,
                            operate: function (reselt) {  
                            }
                        })
                    }
                }).error(function(response, status){
                    console.log(response.error);
                });
            }
        };
    }();

    jQuery(document).ready(function () {
        ChartsAmcharts.init();
    });
});
