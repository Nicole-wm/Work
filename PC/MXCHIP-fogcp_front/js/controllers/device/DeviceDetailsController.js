angular.module('FogApp').controller('DeviceDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');	
	}else{
		var ID = '';
	}
	
	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

	$scope.maxSize = 5;
	$scope.pageSize = 10;
	$scope.StatetotalItems=0;
	$scope.StateListArr =[];
	$scope.StatecurrentPage = 1;

	$scope.CommandtotalItems=0;
	$scope.CommandListArr =[];
	$scope.CommandcurrentPage = 1;

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param1=InitPage(1);
	var param2=InitPage(1);

	/************************初始化数据************************/
	var GetProListFun = function () {/*设备管理-产品*/
		var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				ProductArrs=response.data.result;
				$scope.ProductArrs = ProductArrs;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取产品列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}

		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetProListFun();

	var GetListFun=function(param1,param2){/*设备管理-设备详情*/
		var Url = $rootScope.settings.portsPath+'manager/device/'+ID+'/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				var CurDevice=response.data;
				$scope.ProductName=CurDevice.product.pname;//所属产品
				$scope.MAC=CurDevice.dsn;//设备串号
				/*$scope.FirmWare=CurDevice.FirmWare;//固件版本
				$scope.ModuleName=CurDevice.ModuleName;//模块名称
				$scope.ModuleModel=CurDevice.ModuleModel;//模块型号
				$scope.MiCOVersion=CurDevice.MiCOVersion;//MiCO版本
				$scope.AppVersion=CurDevice.AppVersion;//App版本*/
				$scope.IsStatus=CurDevice.status;//是否有效
				$scope.IsOnline=CurDevice.isonline;//在线状态
				$scope.IsActive=CurDevice.isactivated;//是否激活
				/*$scope.ActiveTime=CurDevice.ActiveTime;//激活时间*/
				$scope.LastTime=CurDevice.last_login;//最后在线
				$scope.OnlineCount=CurDevice.onlinetimes;//累计上线
				/*$scope.IsSub=CurDevice.IsSub;//是否为子设备
				$scope.ParentId=CurDevice.groupid;//父设备ID*/
				if($scope.IsStatus){
					$scope.IsStatusText="有效";
				}else{
					$scope.IsStatusText="无效";
				}
				if($scope.IsActive){
					$scope.IsActiveText="是";
				}else{
					$scope.IsActiveText="否";
				}
				if($scope.IsOnline){
					$scope.IsOnlineText="在线";
				}else{
					$scope.IsOnlineText="离线";
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取设备信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});

		var Url1 = $rootScope.settings.portsPath+'manager/device/data/?deviceid='+ID+'&type=event&page='+param1.page+'&limit='+param1.limit;

		var Url2 = $rootScope.settings.portsPath+'manager/device/data/?deviceid='+ID+'&type=cmd&page='+param2.page+'&limit='+param2.limit;

		var Data ='';

		var PostParam1 = {
			method: 'GET',url:Url1,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		var PostParam2 = {
			method: 'GET',url:Url2,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};


		$http(PostParam1).success(function(response){
			if(response.meta.code==0){
				var CurEvent=response.data;
				$scope.StatetotalItems=CurEvent.count;
				$scope.StateListArr=CurEvent.results;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取设备信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
		
		$http(PostParam2).success(function(response){
			if(response.meta.code==0){
				var CurCmd=response.data;
				$scope.CommandtotalItems=CurCmd.count;
				$scope.CommandListArr=CurCmd.results;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取设备信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	/************************页面调用方法************************/

	if(ID){/*页面-状态-新建/编辑*/
		GetListFun(param1,param2);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param1=InitPage($scope.StatecurrentPage);
		param2=InitPage($scope.CommandcurrentPage);
		GetListFun(param1,param2);
	};

	$scope.ReloadFun=function(){/*Fun-刷新*/
		window.location.href = '#/device/device_list.html';
	}
}]);
