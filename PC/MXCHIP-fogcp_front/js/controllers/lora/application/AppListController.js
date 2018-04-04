angular.module('FogApp').controller('AppListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = false;

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
		var Url = $rootScope.settings.portsPath+'app/list/';
		var Data = param;
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.result;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取应用列表失败！原因："+CurErrorMessage,
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
	$scope.SearchApp=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	}

	$scope.addApp=function(){
		$scope.modalAppName="";
		$scope.modalAppEUI="";
	}

	$scope.ChangeAppInfoFun=function(){
		Common.confirm({ 
			title: "应用信息",
			message: "确认添加我的应用？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息添加成功！",
						operate: function (reselt) {  					
						}
					})
				} else {
				}
			}
		})
	}
}]);
