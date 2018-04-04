angular.module('FogApp').controller('ProductValidationGuideController', function($rootScope, $scope, $http, $timeout) {
	/************************初始化变量************************/
	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}
	
	/************************初始化数据************************/
	/************************页面调用方法************************/
	$scope.ToDebug=function(flag){
		window.location.href = '#/product/product_validation.html?type='+Curtype+'&state='+flag;
	}
});