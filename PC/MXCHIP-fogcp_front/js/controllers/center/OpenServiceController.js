angular.module('FogApp').controller('OpenServiceController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	$scope.AlreadyUnit= [];
	$scope.AlreadyUnitCount= 0;
	$scope.NotUnit=[];
	$scope.NotUnitCount= 0;

	/************************初始化数据************************/
	var GetListFun=function(){
		var Url = $rootScope.settings.portsPath+'business/list/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			$rootScope.settings.role.cpOpen=false;
			$rootScope.settings.role.ipOpen=false;
			$rootScope.settings.role.otaOpen=false;
			if(response.meta.code==0){
				$scope.OpensService = response.data.opens;
				$scope.OpensServiceCount = $scope.OpensService.length;
				$scope.ClosesService = response.data.closes;
				$scope.ClosesServiceCount = $scope.ClosesService.length;
				for(var i=0;i<$scope.OpensServiceCount;i++){
					if($scope.OpensService[i].ischecked){
						$scope.OpensService[i].ischeckedText="已开通";
						var curService=$scope.OpensService[i].business.name;
						if(curService=="CP"){
							$rootScope.settings.role.cpOpen=true;
						}else if(curService=="IP"){
							$rootScope.settings.role.ipOpen=true;
						}else if(curService=="OTA"){
							$rootScope.settings.role.otaOpen=true;
						}else{
						}
					}else{
						$scope.OpensService[i].ischeckedText="审核中";
					}
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取业务信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetListFun();
	/************************页面调用方法************************/
	$scope.DoUnitFun=function(CurItem,Type){//Type:1开通; 2关闭;
		var Connmessage="";
		if(Type==1){
			Connmessage="开通";
			var param= {
				name:CurItem.name
			};
			var Url = $rootScope.settings.portsPath+'business/simple/';
			var Data = param;
			var PostParam = {
				method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
		}else{
			Connmessage="关闭";
			var Url = $rootScope.settings.portsPath+'business/simple/?name='+CurItem.business.name;
			var Data = param;
			var PostParam = {
				method:'DELETE',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
		} 

		Common.confirm({ 
			title: Connmessage+"服务",
			message: "确认"+Connmessage+"该业务？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "服务"+Connmessage+"成功！",
								operate: function (reselt) {  
									$scope.ReloadFun();							
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message: "服务"+Connmessage+"失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "服务"+Connmessage+"失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){//刷新页面
		$(".modal-backdrop").hide();
		GetListFun();
	}
}]);
