angular.module('FogApp').controller('ProductListController', ['$rootScope', '$scope', 'settings','$http', function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = false;
	
	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

	var param = { 
		Keyword: "",
		ProCategory:0
	};

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

	GetProCate();

	var GetProListFun = function (param) {/*产品管理-产品列表status：0：开发中 1：已上线 2：审核中*/
		$scope.ProductsDevelop=[];
		$scope.ProductsOnline=[];
		$scope.ProductsPending=[];
		$scope.ProductsOnlineCount=0;
		$scope.ProductsDevelopCount=0;
		$scope.ProductsPendingCount=0;

		var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'Authorization': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				ProductsList=response.data.result;
				for(var i=0;i<ProductsList.length;i++){
					if(ProductsList[i].status==0){
						$scope.ProductsDevelop.push(ProductsList[i]);
					}else if(ProductsList[i].status==1){
						$scope.ProductsOnline.push(ProductsList[i]);
					}else{
						$scope.ProductsPending.push(ProductsList[i]);
					}
				}
				$scope.ProductsDevelopCount=$scope.ProductsDevelop.length;
				$scope.ProductsOnlineCount=$scope.ProductsOnline.length;
				$scope.ProductsPendingCount=$scope.ProductsPending.length;
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

	GetProListFun(param);
	/************************页面调用方法************************/
	$scope.AddProduct = function () {
		window.location.href = '#/product/product_add.html?type='+Curtype;
	}

	$scope.ProMouseDown = function(ProID) {
		firstTime = new Date().getTime();
	}
	
	$scope.ProMouseUp= function(ProID) {
		var e = e || window.event;
		lastTime = new Date().getTime();
		if( (lastTime - firstTime) < 200 && e.button=="0"){
			$scope.ProDetail(ProID);
		}else{
		}
	}

	$scope.ProDetail =function(ProID){
		window.location.href = '#/product/product_details.html?type='+Curtype+'&ID='+ProID; 
	}

	$scope.SearchProduct = function () {/*Fun-搜索产品*/
		if ($scope.Keyword != undefined && $scope.Keyword != '') {
			Keyword = $scope.Keyword;
		} else {
			Keyword = "";
		}
		if ($scope.ProCategory != undefined && $scope.ProCategory != '') {
			ProCategory = $scope.ProCategory;
		} else {
			ProCategory = 0;
		}

		param = {
			Keyword: Keyword,
			ProCategory:ProCategory
		};

		GetProListFun(param);
	}

	$scope.DelectProFun=function(ID){/*Fun-列表-删除*/
		var Url = $rootScope.settings.portsPath+'product/productinfo/?productid='+ID;
		var Data = '';
		var PostParam = {
			method: 'delete',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','Authorization': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "产品删除",
			message: "确认删除该产品？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "产品删除成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"产品删除失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "产品删除失败！原因："+response.error,
							operate: function (reselt) {
								$scope.ReloadFun();	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.OnlineProFun=function(ID){/*Fun-列表-上线*/
		var Url = $rootScope.settings.portsPath+'product/productstatuschange/';
		var Data = {'productid':ID};
		var PostParam = {
			method: 'PUT',url:Url,data:Data,headers:{'Authorization': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "产品上线审核",
			message: "确认提交上线该产品，进行审核？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "产品提交审核成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"产品提交审核失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "产品提交审核失败！原因："+response.error,
							operate: function (reselt) {
								$scope.ReloadFun();	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.DataDumpFun=function(pid,pdp){
		var ComMess="";
		if(pdp){
			ComMess="关闭";
			var Url = $rootScope.settings.portsPath+'product/data/transfer/?productid='+pid;
			var Data = '';
			var PostParam = {
				method:'DELETE',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
		}else{
			ComMess="开通";
			var Url = $rootScope.settings.portsPath+'product/data/transfer/';
			var Data = {'productid':pid};
			var PostParam = {
				method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
		}

		Common.confirm({
			title: "数据转存",
			message: "确认"+ComMess+"数据转存？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "数据转存"+ComMess+"成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"数据转存"+ComMess+"失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "数据转存"+ComMess+"失败！原因："+response.error,
							operate: function (reselt) {
								$scope.ReloadFun();	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){/*Fun-刷新页面*/
		window.location.reload('#/product/product_list.html?type='+Curtype);
	}
}]);
