angular.module('FogApp').controller('TaskPushController', ['$rootScope', '$scope', 'settings','$uibModal','$http','$filter',function($rootScope, $scope, settings,$uibModal,$http,$filter) {
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

	if(getQueryStringByKey('OTA')){
		var OTA = getQueryStringByKey('OTA');
	}else{
		var OTA=0;
	}

	$scope.ListArr=[];
	/************************初始化数据************************/

	/************************页面调用方法************************/
	$scope.AddPushFun=function(){
		$scope.modalpushName='';
	}

	$scope.SurePushFun=function(){
		$scope.ListArr.push($scope.modalpushName);
	}

	$scope.DeletePushFun=function(Item){/*Fun-删除产品*/
		$scope.ListArr.splice($scope.ListArr.indexOf(Item), 1);
	}

	$scope.SureFun=function(flag){/*Fun-确认*/
		var param= {
			dsn_list:$scope.ListArr
		};

		var Url = $rootScope.settings.portsPath+'ota/tasks/'+ID+'/push/';
		var Data = param;
		var PostParam = {
			method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		if(flag){
			Common.confirm({ 
				title: "任务推送",
				message: "确认推送任务？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								if(response.data.errors.length!=0){
									Common.alert({
										message: "存在未成功推送设备串号或MAC地址！",
										operate: function (reselt) { 					
										}
									})
									$scope.ListArr=response.data.errors;
								}else{
									Common.alert({
										message: "任务推送全部成功！",
										operate: function (reselt) { 
											$scope.ReloadFun();							
										}
									})
								}
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message:"任务推送失败！原因："+CurErrorMessage,
									operate: function (reselt) {  
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "任务推送失败！原因："+response.error,
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
		if(OTA){
			window.location.href = '#/ota/task_list.html?ID='+OTA+'&type='+Curtype;
		}else{
			window.location.href = '#/ota/tasks_list.html?type='+Curtype;
		}
	}
}]);
