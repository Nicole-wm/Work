angular.module('FogApp').controller('CustomerListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	$scope.Keyword="";

	var CustStates=[
	{ "ID":0,"StateName":"未审核"},
	{ "ID":1,"StateName":"通过"},
	{ "ID":2,"StateName":"未通过"}
	]

	$scope.CustStates=CustStates;

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	/************************初始化数据************************/
	var GetListFun=function(param){/*客户管理-客户列表*/
		var Url = $rootScope.settings.portsPath+'profile/mxchip/user/';
		var Data = param;
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			console.log(response);
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.result;
				for(var i=0;i<$scope.ListArr.length;i++){
					var CurObj=$scope.ListArr[i].user;
					if(CurObj.is_active){
						CurObj.IsActiveText="有效";
					}else{
						CurObj.IsActiveText="无效";
					}
				}
			}else{
				Common.alert({
					message:response.meta.message,
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
	$scope.SearchUser=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};
}]);
