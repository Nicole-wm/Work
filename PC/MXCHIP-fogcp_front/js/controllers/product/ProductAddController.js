angular.module('FogApp').controller('ProductAddController', ['$rootScope', '$scope', 'settings','$window','$http', function($rootScope, $scope, settings, $window,$http) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = false;
	
	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

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
					message:"获取产品类别失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	/************************页面调用方法************************/
	GetProCate();/*Fun-产品分类*/

	$scope.AddProductFun=function(){/*Fun-新建产品*/
		var param= {
			pname:$scope.ProductName,
			brand:$scope.Brand,
			model:$scope.Model,
			producttype:$scope.ProCategory,
			abilitytype:Curtype*1
		};

		var Url = $rootScope.settings.portsPath+'product/productinfo/';
		var Data = param;
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "产品新建",
			message: "确认新建产品基本信息？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						var CurProductID= response.data.productid;
						if(response.meta.code==0){
							Common.alert({
								message: "产品新建成功！",
								operate: function (reselt) { 
									$window.location.href = '#/product/product_details.html?type='+Curtype+'&ID='+CurProductID;
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"产品新建失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "产品新建失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.BackFun=function(){
		window.location.href='#/product/product_list.html?type='+Curtype;
	}
}]);
