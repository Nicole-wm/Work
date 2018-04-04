angular.module('FogApp').controller('CookBookAddController', ['$rootScope', '$scope', 'settings','$window', function($rootScope, $scope, settings, $window) {
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

	$scope.AddCBFun=function(){
		var param= {
			Name:$scope.Name,
			Description:$scope.Description,
			BelongProID:$scope.BelongProID,
			CBCategory:$scope.CBCategory,
		};

		Common.confirm({
			title: "食谱新建",
			message: "确认新建食谱基本信息？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "食谱新建成功！",
						operate: function (reselt) {
						    /*Tips:
							1.提交新建的食谱相关信息
							2.判断是否成功后
							3.接口返回新建的产品ID，用于跳转详情页*/		
							$("#mask").show();
							console.dir(param);
							$("#mask").hide();
							var CurProductID= 5 ;
							$window.location.href = '#/cookbook/cookbook_details.html?ID='+CurProductID;
						}
					})
				} else {
				}
			}
		})
	}
}]);
