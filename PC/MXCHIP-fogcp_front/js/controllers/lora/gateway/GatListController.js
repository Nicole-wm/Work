angular.module('FogApp').controller('GatListController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
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

	var GatTypes=[
	{ "ID":1,"Type":"TCE002"},
	{ "ID":2,"Type":"BQL001"},
	{ "ID":3,"Type":"MLFBWX23"}
	]

	$scope.GatTypes=GatTypes;

	$scope.BtnPart=1;
	/************************初始化数据************************/
	var GetListFun=function(param){/*网关管理-网关列表*/
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
					message:"获取网关列表失败！原因："+CurErrorMessage,
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

	$scope.SearchGat=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	}

	$scope.changeShow=function(flag){
		if(flag==1){
			$scope.BtnPart=1;
		}else{
			$scope.BtnPart=0;
		}
	}

	$scope.addGat=function(){
		$scope.BelongGatType="";
		$scope.modalGatName="";
		$scope.modalGatMac="";
	}

	$scope.ChangeGatInfoFun=function(){
		Common.confirm({ 
			title: "网关信息",
			message: "确认添加网关？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "网关添加成功！",
						operate: function (reselt) {  					
						}
					})
				} else {
				}
			}
		})
	}

	var map = new BMap.Map("allmap");  
	map.centerAndZoom(new BMap.Point(116.4035,39.915),8); 
	setTimeout(function(){
		map.setZoom(14);   
	}, 2000); 
	map.enableScrollWheelZoom(true);
}]);
