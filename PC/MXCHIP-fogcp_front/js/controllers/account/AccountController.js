angular.module('FogApp').controller('AccountController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = true;
	$rootScope.Curpage=1;

	$scope.accountCate=[
		{"ID":1,"Name":"我的账户"},
		{"ID":2,"Name":"账户充值"},
		{"ID":3,"Name":"交易记录"},
		{"ID":4,"Name":"账单管理"}, 
		{"ID":5,"Name":"发票管理"},
		{"ID":6,"Name":"退订管理"}
	];

	/************************初始化数据************************/
	/************************页面调用方法************************/
	$scope.CheckMenu=function(Curpage){
		$rootScope.Curpage=Curpage;
	}

	$scope.ReloadFun=function(){//刷新页面
		window.location.reload('#/account/account.html');
	}
}]);
