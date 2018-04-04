angular.module('FogApp').controller('ProductDetailsTemplateController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    if(getQueryStringByKey('ID')){
        var ID = getQueryStringByKey('ID'); 
    }else{
        var ID = '';
    }
    
    /************************初始化数据************************/
    /************************页面调用方法************************/
    $scope.ReloadFun=function(){/*Fun-刷新页面*/
        window.location.reload('#/product/product_details.html?ID='+ID);
    }
}]);
