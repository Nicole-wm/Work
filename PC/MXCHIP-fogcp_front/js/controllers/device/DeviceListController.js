angular.module('FogApp').controller('DeviceListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings, $http) {
	/************************初始化变量************************/
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

	$scope.BelongProID=0;
	$scope.DeciveState=0;
	$scope.DeciveActive=0;
	$scope.DeciveVirtual=0;
	$scope.Keyword="";

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	var DeciveStates=[
	{ "ID":1,"StateName":"离线"},
	{ "ID":2,"StateName":"在线"}
	]

	$scope.DeciveStates=DeciveStates;

	var DeciveActives=[
	{ "ID":1,"ActiveName":"有效"},
	{ "ID":2,"ActiveName":"无效"}
	]

	$scope.DeciveActives=DeciveActives;

	var DeciveVirtuals=[
	{ "ID":1,"VirtualName":"虚拟"},
	{ "ID":2,"VirtualName":"真实"}
	]

	$scope.DeciveVirtuals=DeciveVirtuals;

	/************************初始化数据************************/
	var GetProListFun = function () {/*设备管理-搜索框-产品*/
		var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				ProductArrs=response.data.result;
				$scope.ProductArrs = ProductArrs;
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

	GetProListFun();

	var GetListFun=function(param){/*设备管理-设备列表*/
		var Url = $rootScope.settings.portsPath+'manager/device/list/';
		var Data = param;
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
				var objArr=$scope.ListArr;
				for(var i=0;i<objArr.length;i++){
					if(objArr[i].status){
						objArr[i].IsActiveText="有效";
					}else{
						objArr[i].IsActiveText="无效";
					}
					if(objArr[i].isonline){
						objArr[i].IsOnlineText="在线";
					}else{
						objArr[i].IsOnlineText="离线";
					}
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取设备列表失败！原因："+CurErrorMessage,
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
	$scope.SearchDevice=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}
	
	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};
}]);
