angular.module('FogApp').controller('RefundController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	/************************初始化数据************************/
	/************************页面调用方法************************/
	$scope.ReloadFun=function(){//刷新页面
		window.location.reload('#/account/account.html');
	}
}]);
