angular.module('FogApp').controller('CookBookDetailsController', ['$rootScope', '$scope', 'settings','$window', function($rootScope, $scope, settings,$window) {
    var ID = getQueryStringByKey('ID');
    var currTabPage=1;

    /*食谱管理-食谱详细数据*/
    var GetProductDetailBaseFun=function(){
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_details_base.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                CBDetailsBase=data.Data;
                $scope.Name = CBDetailsBase.Name;
                $scope.ProductName = CBDetailsBase.ProductName;
                $scope.CategoryName = CBDetailsBase.CategoryName;
                $scope.ImageUrl = CBDetailsBase.ImageUrl;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }
    GetProductDetailBaseFun();

    /*头部-删除食谱*/
    $scope.DelectCBFun=function(flag){
        Common.confirm({
            title: "食谱删除",
            message: "确认删除该食谱？",
            operate: function (reselt) {
                if (reselt) {
                    Common.alert({
                        message: "食谱删除成功！",
                        operate: function (reselt) {
                            $window.location.href = '#/cookbook/cookbook_list.html';
                        }
                    })
                } else {
                }
            }
        })
    }

    /*刷新Tab*/
    $scope.ReloadFun=function(currTabPage){
        $window.location.href = '#/cookbook/cookbook_details.html?ID='+ID;
        $("#tabM"+currTabPage).addClass("active").siblings().removeClass("active");
        $("#tab"+currTabPage).addClass("active").siblings().removeClass("active");
    }
}]);

