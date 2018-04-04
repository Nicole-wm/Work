angular.module('FogApp').controller('AppDetailsWeChatController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');	
	}else{
		var ID = '';
	}

	$scope.ModalStype=1;
	$scope.SelectTypeFlag=1;//绑定微信产品
	$scope.ListArr=[];

	/************************初始化数据************************/
	var GetListFun=function(){/*应用管理-绑定产品列表*/
		var Url = $rootScope.settings.portsPath+'app/wechatinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				var ListArr=[];
				var ObjData=response.data;
				$scope.WXOriID=ObjData.wx_original_id;
				$scope.ListArr=ObjData.productlist;
				if($scope.ListArr.length){
					$scope.ModalStype=2;
				}else{
					$scope.ModalStype=1;
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取微信配置失败！原因："+CurErrorMessage,
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
					selectedItem[j].access_token_url="";
					selectedItem[j].wx_product_id="";
					$scope.ListArr.push(selectedItem[j]);
				}
			}
		}, function () {
		});
	};

	$scope.DeleteWXPFun=function(Item){/*Fun-删除产品*/
		for(var i=0;i<$scope.ListArr.length;i++){
			if($scope.ListArr[i].productid==Item.productid){
				$scope.ListArr.splice(i,1);
				break;
			}
		}
	}

	$scope.EditWXPFun=function(Item){
		$scope.atUrl=Item.access_token_url;
		$scope.wxpID=Item.wx_product_id;
		$scope.ExitProductid=Item.productid;
	}

	$scope.ChangeWXPInfoFun=function(Item){
		for(var i=0;i<$scope.ListArr.length;i++){
			if($scope.ListArr[i].productid==$scope.ExitProductid){
				$scope.ListArr[i].access_token_url=$scope.atUrl;
				$scope.ListArr[i].wx_product_id=$scope.wxpID;
				break;
			}
		}
	}

	$scope.SureAppFun=function(flag){/*Fun-确认*/
		var MethodStype="PUT";
		var Checkflag=true;
		$scope.productlist=[];

		function CheckValue(){
			$scope.productlist=[];
			for(var i=0;i<$scope.ListArr.length;i++){
				if($scope.ListArr[i].access_token_url!=""&&$scope.ListArr[i].wx_product_id!=""){
					var CurPro={
						"productid": $scope.ListArr[i].productid,
						"access_token_url": $scope.ListArr[i].access_token_url,
						"wx_product_id": $scope.ListArr[i].wx_product_id
					};
					$scope.productlist.push(CurPro);
				}else{
					Checkflag=false;
					Common.alert({
						message: "添加产品的access_token_url或者wx_product_id不得为空！",
						operate: function (reselt) {
						}
					})
				}
				break;
			}
			return Checkflag;
		}


		if(flag){
			if(CheckValue()){
				var param= {
					appid:ID,
					wx_original_id:$scope.WXOriID,
					productlist:$scope.productlist
				};

				if($scope.ModalStype==1){
					MethodStype="POST";
				}else{
					MethodStype="PUT";
				}


				var Url = $rootScope.settings.portsPath+'app/wechatinfo/';
				var Data = param;
				var PostParam = {
					method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
				};

				Common.confirm({ 
					title: "微信配置",
					message: "确认提交微信配置？",
					operate: function (reselt) {
						if (reselt) {
							$http(PostParam).success(function(response){
								if(response.meta.code==0){
									Common.alert({
										message: "微信配置提交成功！",
										operate: function (reselt) {  
											$scope.ReloadFun();						
										}
									})
								}else{
									CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
									Common.alert({
										message:"微信配置提交失败！原因："+CurErrorMessage,
										operate: function (reselt) {  
										}
									})
								}
							}).error(function(response, status){
								Common.alert({
									message: "微信配置提交失败！原因："+response.error,
									operate: function (reselt) {	
									}
								})
							});
						} else {
						}
					}
				})
			}else{
			}
		}else{
			$scope.ReloadFun();
		}
	}

	$scope.ReloadFun=function(){
		GetListFun();
	}

	$scope.BackFun=function(){
		window.location.href='#/app/app_list.html';
	}
}]);
