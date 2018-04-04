angular.module('FogApp').controller('ProductDetailsController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    var ID = getQueryStringByKey('ID');

    /************************初始化数据************************/
    var GetProductDetailBaseFun=function(){/*产品基础数据*/
        $.ajax({ 
            type: "GET", 
            url: "json/product_details_base.json", 
            dataType: "json",
            async:false,  
            success: function (response) { 
                ProductDetailsBase=response.data;
                $scope.State = ProductDetailsBase.status;
                $scope.ProductName = ProductDetailsBase.pname;
                $scope.Brand = ProductDetailsBase.brand;
                $scope.Model = ProductDetailsBase.model;
                $scope.ImageUrl = ProductDetailsBase.pic;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }
    GetProductDetailBaseFun();
    /************************页面调用方法************************/
    $scope.ReloadFun=function(){/*Fun-刷新*/
        window.location.href = '#/customer/product_list.html';
    }
}]);
