angular.module('FogApp').controller('AppListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
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
	var GetListFun=function(param){/*应用管理-应用列表*/
		$.ajax({ 
			type: "GET", 
			url: "json/app_list.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.result;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
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
}]);
