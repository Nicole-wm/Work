angular.module('FogApp').controller('GatDetailsLogController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings, $http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);
	/************************初始化数据************************/
	var GetListFun=function(param){/*日志列表*/
	}

	GetListFun(param);

	/************************页面调用方法************************/
	$scope.SearchLog=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}
	
	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};

	var handleDatePickers = function () {/*日历控件*/
		if (jQuery().datepicker) {
			$('.date-picker').datepicker({
				rtl: App.isRTL(),
				orientation: "left",
				autoclose: true
			});
		}
		$( document ).scroll(function(){
			$('.date-picker').datepicker('place'); 
		});
	}

	handleDatePickers();
}]);
