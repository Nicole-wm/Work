angular.module('FogApp').controller('ProfileController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	if(getQueryStringByKey('Menu')){
		var Menu = getQueryStringByKey('Menu');
	}else{
		var Menu = '';
	}
	
	$rootScope.settings.layout.pageSidebarClosed = true;
	if(Menu){
		$rootScope.Curpage=Menu;
	}else{
		$rootScope.Curpage=1;
	} 

	$scope.accountCate=[
		{"ID":1,"Name":"基本资料"},
		{"ID":2,"Name":"安全设置"}, 
		{"ID":3,"Name":"实名认证"},
		{"ID":4,"Name":"成员管理"},
		{"ID":5,"Name":"业务开通"}
	];

	/************************初始化数据************************/
	/************************页面调用方法************************/
	$scope.CheckMenu=function(Curpage){
		$rootScope.Curpage=Curpage;
	}

	$scope.ReloadFun=function(){//刷新页面
		window.location.reload('#/center/profile.html');
	}
}]);
