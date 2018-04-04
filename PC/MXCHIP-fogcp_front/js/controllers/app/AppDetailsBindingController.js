angular.module('FogApp').controller('AppDetailsBindingController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	$scope.SelectTypeFlag=0;//所有产品
	$scope.ModalStype=1;
	$scope.ItemsVisible = true;
	$scope.SureVisible = true;//不显示
	$scope.ListArr=[];
	$scope.Description="";
	var IsShowListFun=function(flag){
		if(flag){
			CurSure=true;
		}else{
			CurSure=false;
		}
		if($scope.ListArr.length==0){
			$scope.ItemsVisible = true;
			$scope.SureVisible = CurSure;
		}else{
			$scope.ItemsVisible = false;
			$scope.SureVisible = false;
		}
	}

	IsShowListFun(1);
	
	/************************初始化数据************************/
	var GetListFun=function(){/*应用管理-绑定产品列表*/
		var Url = $rootScope.settings.portsPath+'app/productinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				if(response.data.length){
					$scope.ModalStype=2;
					var ListArr=[];
					var CurList=response.data;
					for(var i=0;i<CurList.length;i++){
						ListArr.push(CurList[i].product);
					}
					for(i=0;i<ListArr.length;i++){
						if(ListArr[i].status==1){
							ListArr[i].StateText="已上线";
						}else{
							ListArr[i].StateText="开发中";
						}
					}
					$scope.ListArr=ListArr;
				}else{
					$scope.ModalStype=1;
				}
				IsShowListFun(1);
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取应用产品授权失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	if(ID){
		GetListFun();
	}


	/************************页面调用方法************************/
	$scope.AddNew = function() {/*Fun-绑定产品*/
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/app/select_product.html',
			controller: "SelectProductController",
			size:"lg",
			resolve: {
				SelectType : function() { 
					return $scope.SelectTypeFlag; 
				},
				ExistItems: function () {
					return $scope.ListArr;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			if(selectedItem){
				for (var j = 0; j < selectedItem.length; j++) {
					var products = $scope.ListArr;
					$scope.ListArr.push(selectedItem[j]);
					IsShowListFun(0);
				}
			}
		}, function () {
		});
	};

	$scope.DeleteProductFun=function(Item){/*Fun-删除产品*/
		$scope.ListArr.splice($scope.ListArr.indexOf(Item), 1);
		IsShowListFun(0);
	}

	$scope.SureAppFun=function(flag){/*Fun-确认-应用*/
		var MethodStype="PUT";
		var productlist=[];
		for(var i=0;i<$scope.ListArr.length;i++){
			productlist.push($scope.ListArr[i].productid);
		}

		var param= {
			appid:ID,
			productlist:productlist
		};

		if($scope.ModalStype==1){
			MethodStype="POST";
		}else{
			MethodStype="PUT";
		}

		var Url = $rootScope.settings.portsPath+'app/productinfo/';
		var Data = param;
		var PostParam = {
			method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		if(flag){
			Common.confirm({ 
				title: "应用信息",
				message: "确认提交应用信息？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: "应用信息提交成功！",
									operate: function (reselt) {  
										$scope.ReloadFun();						
									}
								})
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message:"应用信息提交失败！原因："+CurErrorMessage,
									operate: function (reselt) {  
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "应用信息提交失败！原因："+response.error,
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

	$scope.ReloadFun=function(){/*Fun-刷新*/ 
		GetListFun();
	}

	$scope.BackFun=function(){
		window.location.href='#/app/app_list.html';
	}
}]);
