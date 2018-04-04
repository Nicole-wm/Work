angular.module('FogApp').controller('DealrecordController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	var DealTypes=[
	{ "ID":"0","DealName":"全部"},
	{ "ID":"1","DealName":"消费"},
	{ "ID":"2","DealName":"充值"}
	]

	$scope.DealTypes=DealTypes;
	$scope.DealType="0";

	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.BTime="";
	$scope.ETime="";
	
	function InitPage(currentPage){		
		return param={
			'business_type':$scope.DealType*1,
			'begintime':$scope.BTime,
			'endtime':$scope.ETime,
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);
	/************************初始化数据************************/
	var GetListFun=function(param){/*交易列表*/
		var Url = $rootScope.settings.portsPath+'finance/paymentOrderList/';
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
					message:"获取交易列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetListFun(param);

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

	/************************页面调用方法************************/
	$scope.SearchDeal=function(){/*搜索交易记录*/
		var param=InitPage(1);
		GetListFun(param);
	}
	
	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};

	
	$scope.ReloadFun=function(){//刷新页面
		var param=InitPage(1);
		GetListFun(param);
	}
}]);
