angular.module('FogApp').controller('TaskListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
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

	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	
	$scope.Keyword="";

	function InitPage(currentPage){		
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	/************************初始化数据************************/
	var GetOTAFun=function(){/*OTA任务列表*/
		var Url = $rootScope.settings.portsPath+'ota/files/'+ID+'/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.otaTop=response.data;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取固件信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetOTAFun(param);

	var GetListFun=function(param){/*OTA任务列表*/
		if(ID!=''){
			var Url = $rootScope.settings.portsPath+'ota/tasks/?ofid='+ID+'&type='+Curtype+'&page='+param.page+'&limit='+param.limit;
		}else{		
			var Url = $rootScope.settings.portsPath+'ota/tasks/?type='+Curtype+'&page='+param.page+'&limit='+param.limit;
		}

		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取任务列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetListFun(param);

	/************************页面调用方法************************/
	$scope.SearchApp=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};

	$scope.ToDeviceFun=function(ID){/*Fun-列表-任务*/
		window.open('#/ota/device_list.html?ID='+ID);
	}

	$scope.DetailTask=function(TaskID){/*Fun-列表-编辑*/
		if(TaskID){
			window.location.href = '#/ota/task_details.html?type='+Curtype+'&ID='+TaskID+'&OTA='+ID;
		}else{
			window.location.href = '#/ota/task_details.html?type='+Curtype;
		}
	}

	$scope.DeleteFun=function(ID){/*Fun-列表-删除*/
		Common.confirm({
			title: "任务删除",
			message: "确认删除该任务？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "任务删除成功！",
						operate: function (reselt) {
							$scope.pageChanged();
						}
					})
				} else {
				}
			}
		})
	}

	$scope.StartTaskFun=function(ID){/*Fun-列表-启用*/
		var Url = $rootScope.settings.portsPath+'ota/tasks/'+ID+'/release/';
		var Data = param;
		var PostParam = {
			method:'PUT',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "任务上线",
			message: "确认上线该任务？启用后则不可编辑以及删除该任务",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "任务上线成功！",
								operate: function (reselt) {
									$scope.ReloadFun();							
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"任务上线失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "任务上线失败！原因："+response.error,
							operate: function (reselt) {
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.PushTaskFun=function(taskID){/*Fun-列表-推送*/
		window.location.href = '#/ota/task_push.html?type='+Curtype+'&ID='+taskID+'&OTA='+ID;
	}
	
	$scope.ReloadFun=function(){/*Fun-刷新*/
		param=InitPage($scope.currentPage);
		GetListFun(param);
	}
}]);
