angular.module('FogApp').controller('UserListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	$scope.Keyword="";
	$scope.AppID=0;

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	/************************初始化数据************************/
	var GetAppFun=function(){/*用户管理-应用*/
		$.ajax({ 
			type: "GET", 
			url: "json/app_list.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				$scope.AppArr=data.Data.ListArr;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	GetAppFun();

	var GetListFun=function(param){/*用户管理-用户列表*/
		var Url = $rootScope.settings.portsPath+'manager/enduser/list/';
		var Data = param;
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
				for(var i=0;i<$scope.ListArr.length;i++){
					var CurObj=$scope.ListArr[i];
					if(CurObj.is_active){
						CurObj.IsActiveText="有效";
					}else{
						CurObj.IsActiveText="无效";
					}
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取用户列表失败！原因："+CurErrorMessage,
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
