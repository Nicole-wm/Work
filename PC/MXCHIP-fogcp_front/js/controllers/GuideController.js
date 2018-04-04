angular.module('FogApp').controller('GuideController', function($rootScope, $scope, $http, $timeout) {   
	/************************初始化变量************************/
	if($rootScope.settings.role.cpOpen){
		$rootScope.settings.layout.pageSidebarClosed = false;
	}else if($rootScope.settings.role.ipOpen){
		$rootScope.settings.layout.pageSidebarClosed = false;
	}else if($rootScope.settings.role.otaOpen){
		$rootScope.settings.layout.pageSidebarClosed = false;
	}else{
		$rootScope.settings.layout.pageSidebarClosed = true;
	}
	/************************初始化数据************************/

	/************************页面调用方法**********************/
	$scope.OpenService=function(){
		window.location.href='#/center/profile.html?Menu=5';
	}
});
