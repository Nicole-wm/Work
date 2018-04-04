angular.module('FogApp').controller('ProductDetailsBaseController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings,$window,$http) {
    /************************初始化变量************************/
    if(getQueryStringByKey('ID')){
        var ID = getQueryStringByKey('ID'); 
    }else{
        var ID = '';
    }
    
    if(getQueryStringByKey('type')){
        var Curtype = getQueryStringByKey('type');
    }else{
        var Curtype=0;
    }
    
    $scope.ComVer="";
    $scope.ProUnique="";
    $scope.Curtype=Curtype;

    var DeviceCategorys=[
    { "ID":"0","Deviceclass":"普通设备"},
    { "ID":"1","Deviceclass":"网关设备"},
    { "ID":"2","Deviceclass":"网关子设备"}
    ]

    $scope.DeviceCategorys=DeviceCategorys;

    var ProUniques=[
    { "ID":"0","Prouniqueclasss":"MAC"},
    { "ID":"1","Prouniqueclasss":"SN"}
    ]

    $scope.ProUniques=ProUniques;

    var LinkModes=[/*基础链接模式选项*/
    { "ID":"1","LinkModeName":"WIFI"},
    { "ID":"2","LinkModeName":"移动网络"},
    { "ID":"3","LinkModeName":"局域网"},
    { "ID":"4","LinkModeName":"蓝牙"}
    ]

    $scope.LinkModes=LinkModes;

    /************************初始化数据************************/
    var GetProCate=function(){/*产品管理-产品分类类别*/
        var Url = $rootScope.settings.portsPath+'product/producttypelist/';
        var Data = '';
        var PostParam = {
            method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
        };

        $http(PostParam).success(function(response){
            if(response.meta.code==0){
                ProCategorys=response.data;
                $scope.ProCategorys=ProCategorys;
            }else{
                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                Common.alert({
                    message:"获取产品列表失败！原因："+CurErrorMessage,
                    operate: function (reselt) {  
                    }
                })
            }
        }).error(function(response, status){
            console.log(response.error);
        });
    }

    var GetProductDetailBaseFun=function(){/*产品管理-产品详细基础数据*/
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
                $scope.ProCategory = ProductDetailsBase.producttype;
                $scope.Description = ProductDetailsBase.description;
                $scope.ImageUrl = ProductDetailsBase.pic;
                $scope.ProUrl = ProductDetailsBase.url;
                $scope.DeviceCategory = ProductDetailsBase.gatewaytype.toString();
                $scope.ProUnique = ProductDetailsBase.identifier.toString();
                $scope.LinkMode = ProductDetailsBase.link_mode.toString();
                $scope.ComVer= ProductDetailsBase.checkvalidity.toString();
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
        GetProCate();
        GetProductDetailBaseFun();
    }
    /************************页面调用方法************************/
    $scope.InitPage=function(){/*Fun-获取产品基本信息*/
        GetProCate();
        GetProductDetailBaseFun();
    }

    /*Fun-图片上传*/
    upload_image_func('product','pro_selectbtn','pro_btn','pro_name','pro_upbtn','pro_img','pro_input');
    
    $scope.EditProductFun=function(flag){/*Fun-提交产品基本信息*/
        if(flag){
            var PageParam ={    
                'productid':ID,                
                'pname': $scope.ProductName,
                'brand' : $scope.Brand,
                'model' : $scope.Model,
                'producttype' : $scope.ProCategory,
                'abilitytype':Curtype*1,
                'description' : $scope.Description,
                'pic':$("#pro_img img").attr("src"),
                'url' : $scope.ProUrl,
                'gatewaytype' : $scope.DeviceCategory*1,
                'identifier': $scope.ProUnique*1,
                'link_mode' : $scope.LinkMode*1,
                'checkvalidity' : $scope.ComVer
            };

            var Url = $rootScope.settings.portsPath+'product/productinfo/';
            var Data = PageParam;
            var PostParam = {
                method:'PUT',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
            };

            Common.confirm({
                title: "产品编辑",
                message: "确认提交产品基本信息？",
                operate: function (reselt) {
                    if (reselt) {
                        $http(PostParam).success(function(response){
                            if(response.meta.code==0){
                                Common.alert({
                                    message: "产品基本信息提交成功！",
                                    operate: function (reselt) {
                                        $scope.ReloadFun();
                                    }
                                })
                            }else{
                                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                                Common.alert({
                                    message:"产品基本信息提交失败，原因："+CurErrorMessage,
                                    operate: function (reselt) {  
                                    }
                                })
                            }
                        }).error(function(response, status){
                            console.log(response.error);
                            Common.alert({
                                message: "产品基本信息提交失败，原因："+response.error,
                                operate: function (reselt) {
                                }
                            })
                        });
                    } else {
                    }
                }
            })
        }else{
            $scope.ReloadFun();
        }
    }

    $scope.ReloadFun=function(){/*Fun-刷新页面*/
        window.location.reload('#/product/product_details.html?ID='+ID);
    }

    $scope.BackFun=function(){
        window.location.href='#/product/product_list.html?type='+Curtype;
    }
}]);
