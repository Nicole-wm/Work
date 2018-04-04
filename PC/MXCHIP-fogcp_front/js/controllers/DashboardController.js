angular.module('FogApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {   
    /************************初始化数据************************/
    var GetListFun=function(){/*应用管理-应用列表*/
        $.ajax({ /*智能中心设备与用户统计数据*/
            type: "GET", 
            url: "json/dashboard.json", 
            dataType: "json",
            async:true,  
            success: function (data) { 
                StatObj=data.Data.Stat;
                $scope.device_month = StatObj.device_month;
                $scope.device_year = StatObj.device_year;
                $scope.device_all = StatObj.device_all;
                $scope.enduser_month = StatObj.enduser_month;
                $scope.enduser_year = StatObj.enduser_year;
                $scope.enduser_all = StatObj.enduser_all;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }

    GetListFun();
    /************************页面调用方法**********************/
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
                "titleField": "name",
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
                "categoryField": "name",
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
                var Url = $rootScope.settings.portsPath+'app/users/amount/';
                var Data = '';
                var PostParam = {
                    method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
                };

                $http(PostParam).success(function(response){
                    if(response.meta.code==0){
                        PieArr=response.data;
                        BarArr=response.data;
                        initChartSamplePie();
                        initChartSampleBar();
                    }else{
                        CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                        Common.alert({
                            message:"获取统计失败！原因："+CurErrorMessage,
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
