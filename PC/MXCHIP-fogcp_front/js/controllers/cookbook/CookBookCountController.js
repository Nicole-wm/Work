angular.module('FogApp').controller('CookBookCountController', function($rootScope, $scope, $http, $timeout) {
});

var ChartsAmcharts = function() {
     //获取随机颜色
     var getRandomColor = function () {
        return '#' + (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
            && (color.length == 6) ? color : arguments.callee(color);
        })('');
    }

    var ChartFun = function () {
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_count.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                PieArr1=data.Data.DataArr1;
                PieArr2=data.Data.DataArr2;
                PieArr3=data.Data.DataArr3;
                PieArr4=data.Data.DataArr4;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }

    ChartFun();

    var i = 0;
    for(i=1;i<5;i++){
        var objArr="PieArr"+i;
        for (var a in objArr) {
            objArr[i].color = getRandomColor();
        }
    }

    /*每种产品的激活量占比*/
    var initChartSamplePie = function() {
        var chart = AmCharts.makeChart("chart_pie1", {
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider":PieArr1,
            "valueField": "value",
            "titleField": "name",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "exportConfig": {
                menuItems: [{
                    icon: '/lib/3/images/export.png',
                    format: 'png'
                }]
            }
        });

        var chart = AmCharts.makeChart("chart_pie2", {
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider":PieArr2,
            "valueField": "value",
            "titleField": "name",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "exportConfig": {
                menuItems: [{
                    icon: '/lib/3/images/export.png',
                    format: 'png'
                }]
            }
        });

        var chart = AmCharts.makeChart("chart_pie3", {
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider":PieArr3,
            "valueField": "value",
            "titleField": "name",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "exportConfig": {
                menuItems: [{
                    icon: '/lib/3/images/export.png',
                    format: 'png'
                }]
            }
        });

        var chart = AmCharts.makeChart("chart_pie4", {
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color":    '#888',
            "dataProvider":PieArr4,
            "valueField": "value",
            "titleField": "name",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "exportConfig": {
                menuItems: [{
                    icon: '/lib/3/images/export.png',
                    format: 'png'
                }]
            }
        });
        jQuery('.chart_7_chart_input').off().on('input change', function() {
            var property = jQuery(this).data('property');
            var target = chart;
            var value = Number(this.value);
            chart.startDuration = 0;

            if (property == 'innerRadius') {
                value += "%";
            }

            target[property] = value;
            chart.validateNow();
        });
        $('#chart_pie').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });
    }


    return {
        init: function() {
            initChartSamplePie();
        }
    };
}();