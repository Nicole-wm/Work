angular.module('FogApp').controller('LogListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings, $http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.TypeFlag=0;

	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}


	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	var SearchTypes=[
	{ "ID":1,"Type":"OTA文件相关"},
	{ "ID":2,"Type":"设备相关"},
	{ "ID":3,"Type":"任务相关"}
	]

	$scope.SearchTypes=SearchTypes;
	/************************初始化数据************************/
	var GetOTAListFun = function () {/*任务管理-OTA列表*/
		var Url = $rootScope.settings.portsPath+'ota/files/?type='+Curtype;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				OTAs=response.data.results;
				$scope.OTAs = OTAs;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取OTA列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}
	
	GetOTAListFun();

	var GetListFun=function(param){/*日志列表*/
		var Url = $rootScope.settings.portsPath+'ota/logs/?type='+Curtype+'&page='+param.page+'&limit='+param.limit;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'Authorization': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			console.log(response);
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取日志列表失败！原因："+CurErrorMessage,
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
	$scope.SearchType=function(){
		if($scope.TypeID==1){
			$scope.TypeFlag=1;
		}else{
			$scope.TypeFlag=2;
		}
	}

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
