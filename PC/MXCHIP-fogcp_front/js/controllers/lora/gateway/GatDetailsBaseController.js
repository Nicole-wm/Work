angular.module('FogApp').controller('GatDetailsBaseController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}
	var GatTypes=[
	{ "ID":1,"Type":"TCE002"},
	{ "ID":2,"Type":"BQL001"},
	{ "ID":3,"Type":"MLFBWX23"}
	]

	$scope.GatTypes=GatTypes;
	/************************初始化数据************************/
	var GetListFun=function(param){/*应用管理*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取应用详情失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}
/*
	if(ID){
		GetListFun();
	}*/

	/************************页面调用方法************************/
	$scope.InfoFun=function(){
		Common.confirm({ 
			title: "网关信息",
			message: "确认修改网关？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "网关信息修改成功！",
						operate: function (reselt) {  
							$scope.ReloadFun();							
						}
					})
				} else {
				}
			}
		})
	}
	
	$scope.DelectFun=function(){
		Common.confirm({ 
			title: "网关信息",
			message: "确认删除网关？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "网关信息删除成功！",
						operate: function (reselt) {  
							$scope.BackFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/ 
		window.location.reload('#/lora/gateway/gat_details.html?ID='+ID);
	}

	$scope.BackFun=function(){
		window.location.href='#/lora/gateway/gat_list.html';
	}
}]);
