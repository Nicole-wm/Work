angular.module('FogApp').controller('ProductDetailsController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.Curpage=1;
    $rootScope.CurpageName='基本信息';

    if(getQueryStringByKey('type')){
        var Curtype = getQueryStringByKey('type');
    }else{
        var Curtype=0;
    }

    if(Curtype==1){
        $scope.productCate=[
            {"ID":1,"Name":"基本信息"},
            {"ID":3,"Name":"固件升级"},
            {"ID":4,"Name":"模板配置"}
        ];
    }else{
        $scope.productCate=[
            {"ID":1,"Name":"基本信息"},
            {"ID":2,"Name":"属性信息"},
            {"ID":3,"Name":"固件升级"}
        ];
    }

    /************************初始化数据************************/
    /************************页面调用方法************************/
    $scope.CheckMenu=function(Curpage){
        $rootScope.Curpage=Curpage;
        for(var i=0;i<$scope.productCate.length;i++){
            if($scope.productCate[i].ID==Curpage){
                $rootScope.CurpageName=$scope.productCate[i].Name;
            }
        }
    }

    $scope.ReloadFun=function(){//刷新页面
        window.location.reload('#/product/product_details.html');
    }
}]);