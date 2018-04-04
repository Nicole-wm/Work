angular.module('FogApp').controller('RechargeController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.ChoosePay=1;
	$scope.ChooseMoney=1;
	$scope.InputMoney='';
	var payImgUrl='../assets/pages/img/account/';
	$scope.pays = [
	{'id':1,'name':'银联','img':payImgUrl+'pay1.png'},
	{'id':2,'name':'支付宝','img':payImgUrl+'pay2.png'}
	];

	$scope.moneys = [
	{'id':1,'name':'100'},
	{'id':2,'name':'200'},
	{'id':3,'name':'500'},
	{'id':4,'name':'1000'}
	];

	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.BTime="";
	$scope.ETime="";
	
	function InitPage(currentPage){		
		return param={
			'business_type':1,
			'begintime':$scope.BTime,
			'endtime':$scope.ETime,
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	if(getQueryStringByKey('payresult')){
		$rootScope.Curpage=2;
		PayActive();
		window.location.href="#/account/account.html";
	}else{
		InitActive();
	}

	function InitActive(){
		$("#RechargeUL li").removeClass('active');
		$("#RechargeUL li").eq(0).addClass('active');
		$("#tab_re1").addClass('active');
		$("#tab_re2").removeClass('active');
	}


	function PayActive(){
		$("#RechargeUL li").removeClass('active');
		$("#RechargeUL li").eq(1).addClass('active');
		$("#tab_re1").removeClass('active');
		$("#tab_re2").addClass('active');
	}
	/************************初始化数据************************/
	var GetInfoFun=function(){/*获取账户信息*/
		var Url = $rootScope.settings.portsPath+'finance/financeAccountInfo/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CurAccount=response.data;
				$scope.Account_amount=CurAccount.account_amount;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取账户信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetInfoFun();

	var GetListFun=function(param){/*获取充值记录列表*/
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
					message:"获取充值记录列表失败！原因："+CurErrorMessage,
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

	function InitPay(){/*充值原始状态*/
		$scope.ChoosePay=1;
		$scope.ChooseMoney=1;
		$scope.InputMoney='';
	}

	/************************页面调用方法************************/
	$scope.ChangePay=function(flag){/*改变充值方式*/
		$scope.ChoosePay=flag;
		ChangeLiClass('pay',flag);
	}

	$scope.ChangeMoney=function(flag){/*改变充值金额*/
		$scope.ChooseMoney=flag;
		if(flag){
			$scope.InputMoney='';
			ChangeLiClass('money',flag);
		}else{
			$('#MoneyUL li').removeClass('li-recharge-active');
			$('#OtherMoney').addClass('li-recharge-active');
		}
	}

	function ChangeLiClass(CurMenu,CurPage){
		if(CurMenu=='pay'){
			var CurObj=$scope.pays[CurPage-1];
			var $CurUL=$('#PayUL');
		}else if(CurMenu=='money'){
			var CurObj=$scope.moneys[CurPage-1];
			var $CurUL=$('#MoneyUL');
		}else{
		}
		var CurObjID =CurObj.id;
		$CurUL.find('li').removeClass('li-recharge-active');
		$CurUL.find('li').eq(CurPage-1).addClass('li-recharge-active');
	}

	$scope.ToRechargeList=function(){
		InitPay();
		PayActive();
	}

	$scope.RechargeSure=function(){/*确认充值*/
		var paymentAmount=0;
		if($scope.moneys[$scope.ChooseMoney-1]){
			paymentAmount=$scope.moneys[$scope.ChooseMoney-1].name*1;
		}else{
			paymentAmount=$scope.InputMoney*1;
		}

		var param= {
			payment_amount:paymentAmount,
			recharge_type:$scope.ChoosePay,
		};

		var Url = $rootScope.settings.portsPath+'finance/paymentOrderCreate/';
		var Data = param;
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({ 
			title: "确认充值",
			message: "确认充值"+paymentAmount+"元？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							$scope.PayFun(response.data.business_id);
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message: "充值失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "充值失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.PayFun=function(BusinessId) {
		var PayoffUrl = $rootScope.settings.portsPath+'finance/paymentOrderPayoff/';
		var PayoffData = {
			business_id:BusinessId
		};
		var PayoffPostParam = {
			method: 'POST',url:PayoffUrl,data:PayoffData,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PayoffPostParam).success(function(response){
			if(response.meta.code==0){
				$("#myModal_Pay_btn").click();
				window.open(response.data.url);
			}
		}).error(function(response, status){
			Common.alert({
				message: "充值失败！原因："+response.error,
				operate: function (reselt) {	
				}
			})
		});
	}

	$scope.ChangePayFun=function(type,BusinessId){
		var CurMess="取消";
		var CurMethod="PUT";
		var Url = $rootScope.settings.portsPath+'finance/paymentOrderCancel/';

		if(type==1){
			CurMess="取消";
			CurMethod="PUT";
			Url = $rootScope.settings.portsPath+'finance/paymentOrderCancel/';
		}else{
			CurMess="删除";
			CurMethod="DELETE";
			Url = $rootScope.settings.portsPath+'finance/paymentOrderDelete/?business_id='+BusinessId;
		}
		var Data ={
			business_id:BusinessId
		};
		var PostParam = {
			method: CurMethod,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		
		Common.confirm({ 
			title:"订单操作",
			message: "确认"+CurMess+"订单",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({ 
								message: CurMess+"订单成功！",
								operate: function (reselt) {  
									$scope.ReloadFun();						
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message: CurMess+"订单失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: CurMess+"订单失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.SearchList=function(){/*搜索充值记录*/
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
		GetInfoFun();
		GetListFun(param);
	}
}]);
