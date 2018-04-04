
angular.toJson()

angular.fromJson()

/*获取数据-产品管理-产品属性数据*/
var GetProductDetailAttributeFun=function(){
    var Url = $rootScope.settings.portsPath+'product/parameterlist/?productid='+ID;
    var Data ='';
    var PostParam = {
        method: 'GET',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Bearer " + localStorage.token}
    };
    $http(PostParam).success(function(response){
        console.log(response);
        if(response.meta.code==0){
            Common.alert({
                message: "产品新建成功！",
                operate: function (reselt) {    
                    console.dir(response);
                    $window.location.href = '#/product/product_details.html?ID='+CurProductID;
                }
            })
        }else{
            Common.alert({
                message: "产品新建失败！原因："+response.meta.message,
                operate: function (reselt) {    
                }
            })
        }
    }).error(function(response, status){
        console.log(response.error);
    });
}



$http(PostParam).success(function(response){
    console.log(response);
    if(response.meta.code==0){
        Common.alert({
            message: "产品功能属性提交成功！",
            operate: function (reselt) {
            }
        })
    }else{
        Common.alert({
            message: "产品功能属性提交失败，原因："+response.meta.message,
            operate: function (reselt) {
            }
        })
    }
}).error(function(response, status){
    console.log(response.error);
    Common.alert({
        message: "产品功能属性提交失败，原因："+response.error,
        operate: function (reselt) {
        }
    })
});
