angular.module('FogApp').controller('AppListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = false;

	var Abilitytypes=[
	{ "ID":"0","Typeclass":"CP"},
	{ "ID":"1","Typeclass":"IP"}
	]

	$scope.Abilitytypes=Abilitytypes;

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
				for(var i=0;i<$scope.ListArr.length;i++){
					var curObj=$scope.ListArr[i];
					curObj.AbilityTypeclass=$scope.Abilitytypes[curObj.abilitytype].Typeclass;
				}
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
	};

	$scope.AppMouseDown = function(ID) {
		firstTime = new Date().getTime();
	}
	
	$scope.AppMouseUp= function(ID) {
		var e = e || window.event;
		lastTime = new Date().getTime();
		if( (lastTime - firstTime) < 200 && e.button=="0"){
			$scope.EditAppFun(ID);
		}else{
		}
	}

	$scope.EditAppFun=function(ID){/*Fun-列表-编辑*/
		window.location.href='#/app/app_details.html?ID='+ID;
	}

	$scope.DeleteAppFun=function(ID){/*Fun-列表-删除*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'delete',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "应用删除",
			message: "确认删除该应用？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "应用删除成功！",
								operate: function (reselt) {
									$scope.pageChanged();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"应用删除失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "应用删除失败！原因："+response.error,
							operate: function (reselt) {
							}
						})
					});
				} else {
				}
			}
		})
	}
}]);
