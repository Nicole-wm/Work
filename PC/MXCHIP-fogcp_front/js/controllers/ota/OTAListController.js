angular.module('FogApp').controller('OTAListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	if(getQueryStringByKey('ID')){
		var Proid = getQueryStringByKey('ID');
	}else{
		var Proid = '';
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
	$scope.pageSize = 9;

	$scope.Keyword="";

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1)

	/************************初始化数据************************/
	var GetListFun=function(param){/*OTA管理-OTA列表*/
		var Url = $rootScope.settings.portsPath+'ota/files/?product='+Proid+'&page='+param.page+'&limit='+param.limit;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
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

	GetListFun(param);

	/************************页面调用方法************************/
	$scope.AddOTA = function () {
		window.location.href = '#/ota/ota_details.html?type='+Curtype+'&Proid='+Proid;
	}

	$scope.SearchApp=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}
	
	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};

	$scope.CopyUrl=function(text){
		$scope.ModalUrl=text;
	}

	$scope.DoTaskFun=function(ID){/*Fun-列表-任务*/
		window.open('#/ota/task_list.html?type='+Curtype+'&ID='+ID);
	}
}]);
