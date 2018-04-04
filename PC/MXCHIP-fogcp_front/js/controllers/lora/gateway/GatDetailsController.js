angular.module('FogApp').controller('GatDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
    /************************初始化变量************************/
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.Curpage=1;

    $scope.CurCate=[
        {"ID":1,"Name":"基本信息"},
        {"ID":2,"Name":"数据消息"},
        {"ID":3,"Name":"网关统计"},
        {"ID":4,"Name":"网关配置"},
        {"ID":5,"Name":"网关日志"}
    ];

    /************************初始化数据************************/
    /************************页面调用方法************************/
    $scope.CheckMenu=function(Curpage){
        $rootScope.Curpage=Curpage;
    }

    $scope.$watch('Curpage',function(){
        var CurObj=$scope.CurCate[$rootScope.Curpage-1];
        var CurObjID = CurObj.ID;
        $('.inbox-nav > li.active').removeClass('active');
        $('.inbox-nav > li').eq(CurObjID-1).addClass('active');
    });

	$scope.ReloadFun=function(){/*Fun-刷新*/
		window.location.href = '#/app/app_list.html';
	}
}]);
