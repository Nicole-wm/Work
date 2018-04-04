angular.module('FogApp').controller('CookBookDetailsBaseController', ['$rootScope', '$scope', 'settings','$window', function($rootScope, $scope, settings,$window) {
    var ID = getQueryStringByKey('ID');
    var currTabPage=1;

    /*食谱管理-食谱分类类别*/
    $.ajax({ 
        type: "GET", 
        url: "json/cookbook_category.json", 
        dataType: "json",
        async:false,  
        success: function (data) { 
            CBCategorys=data.Data;
            $scope.CBCategorys = CBCategorys;
        }, 
        error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
        } 
    });

    /*食谱管理-食谱*/
    $.ajax({ 
        type: "GET", 
        url: "json/product_list.json", 
        dataType: "json",
        async:false,  
        success: function (data) { 
            ProductArrs=data.Data;
            $scope.ProductArrs = ProductArrs;
        },  
        error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
        } 
    });

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
                $scope.BelongProID = CBDetailsBase.BelongProID;
                $scope.Description = CBDetailsBase.Description;
                $scope.CBCategory = CBDetailsBase.CBCategory;
                $scope.Tag = CBDetailsBase.Tag;
                $scope.CookTime = CBDetailsBase.CookTime;
                $scope.IteamID = CBDetailsBase.IteamID;
                $scope.IsOpen = CBDetailsBase.IsOpen;
                $scope.IsReview = CBDetailsBase.IsReview;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }
    GetProductDetailBaseFun();

    /*提交食谱基本信息*/
    $scope.EditProductFun=function(flag){
        if(flag){
            Common.confirm({
                title: "食谱编辑",
                message: "确认提交食谱基本信息？",
                operate: function (reselt) {
                    if (reselt) {
                        Common.alert({
                            message: "食谱基本信息提交成功！",
                            operate: function (reselt) {
                                $scope.ReloadFun(currTabPage);
                            }
                        })
                    } else {
                    }
                }
            })
        }else{
            $scope.ReloadFun(currTabPage);
        }
    }
}]);
