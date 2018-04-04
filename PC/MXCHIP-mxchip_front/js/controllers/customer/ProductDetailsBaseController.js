angular.module('FogApp').controller('ProductDetailsBaseController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    var ID = getQueryStringByKey('ID');

    var LinkModes=[/*基础链接模式选项*/
    { "ID":1,"LinkModeName":"WIFI"},
    { "ID":2,"LinkModeName":"移动网络"},
    { "ID":3,"LinkModeName":"局域网"}
    ]

    $scope.LinkModes=LinkModes;

    /************************初始化数据************************/
    var GetProCate=function(){/*产品管理-产品分类类别*/
        $.ajax({ 
            type: "GET", 
            url: "json/product_category.json", 
            dataType: "json",
            async:false,  
            success: function (response) {
                $scope.ProCategorys=response.data;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }

    GetProCate();

    function FlagToText(Obj){
        if(Obj){
            return "是"
        }else{
            return "否"
        }
    }

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
                $scope.Description = ProductDetailsBase.description;
                $scope.ProCategory = ProductDetailsBase.producttype;
                $scope.Url = ProductDetailsBase.url;
                $scope.ProductConfig = ProductDetailsBase.gatewaytype;
                $scope.LinkMode = ProductDetailsBase.link_mode;
                $scope.GuestAllow = ProductDetailsBase.guestallow;
                $scope.GuestTime = ProductDetailsBase.guesttime;
                $scope.TopGrade = ProductDetailsBase.topgrade;
                var ProCategorys=$scope.ProCategorys;
                for(var i=0;i<ProCategorys.length;i++){
                    if($scope.ProCategory==ProCategorys[i].id){
                        $scope.ProCategoryText=ProCategorys[i].bigclass;
                        break;
                    }
                }
                for(var i in LinkModes){
                    if(LinkModes[i].ID==$scope.LinkMode){
                        $scope.LinkModeText=LinkModes[i].LinkModeName;
                    }
                }
                $scope.GuestAllowText=FlagToText($scope.GuestAllow);
                $scope.TopGradeText=FlagToText($scope.TopGrade);
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }
    GetProductDetailBaseFun();
    /************************页面调用方法************************/
}]);
