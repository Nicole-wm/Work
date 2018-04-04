angular.module('FogApp').controller('ProductDetailsInfoController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    if(getQueryStringByKey('ID')){
        var ID = getQueryStringByKey('ID'); 
    }else{
        var ID = '';
    }

    $scope.State=0;

    /************************初始化数据************************/
    var GetProductDetailBaseFun=function(){/*产品管理-产品详细基础头部数据*/
        var Url = $rootScope.settings.portsPath+'product/productinfo/?productid='+ID;
        var Data ='';
        var PostParam = {
            method: 'GET',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
        };
        $http(PostParam).success(function(response){
            if(response.meta.code==0){
                ProductDetailsBase=response.data;
                $scope.State = ProductDetailsBase.status;
                $scope.ProductName = ProductDetailsBase.pname;
                $scope.Brand = ProductDetailsBase.brand;
                $scope.Model = ProductDetailsBase.model;
                $scope.ImageUrl = ProductDetailsBase.pic;
            }else{
                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                Common.alert({
                    message:"获取产品详情失败！原因："+CurErrorMessage,
                    operate: function (reselt) {  
                    }
                })
            }
        }).error(function(response, status){
            console.log(response.error);
        });
    }

    if(ID){
        GetProductDetailBaseFun();
    }
    /************************页面调用方法************************/
    $scope.InitPage=function(){/*Fun-获取产品基本信息*/
        GetProductDetailBaseFun();
    }

    $scope.ReloadFun=function(){/*Fun-刷新页面*/
        window.location.reload('#/product/product_details.html?ID='+ID);
    }
}]);

var ComponentsBootstrapSelect = function () {
    var handleBootstrapSelect = function() {
        $('.bs-select').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });
    }
    return {
        init: function () {      
            handleBootstrapSelect();
        }
    };
}();