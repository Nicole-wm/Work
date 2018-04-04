angular.module('FogApp').controller('MyaccountController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.warnflag=1;/*余额预警原始状态*/
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

	var GetWarnFun=function(){/*获取余额预警信息*/
		var Url = $rootScope.settings.portsPath+'finance/financeWarningThresholdInfo/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.BWarning=response.data.warning_threshold;
				if($scope.BWarning==-1){
					$scope.warnflag=1;
				}else{
					$scope.warnflag=2;
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取余额预警失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
			
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetWarnFun();

	/************************页面调用方法************************/
	$scope.RechargeFun=function(){/*充值*/
		$rootScope.Curpage=2;
	}

	$scope.WarnFun=function(flag){/*余额预警设置*/
		var Commess="";
		var BWarning=$scope.BWarning;
		if(flag==1){//转编辑状态
			$scope.BWarning="";
			$scope.warnflag=3;
			var Commess="开启";
		}else if(flag==2){//点关闭
			var Commess="关闭";
			BWarning=-1;
		}else if(flag==3){//点确认开启
			var Commess="开启";
		}else{
			$scope.ReloadFun();
		}

		var param= {
			warning_threshold:BWarning
		};

		var Url = $rootScope.settings.portsPath+'finance/financeWarningThresholdCreate/';
		var Data = param;
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		if(flag==2||flag==3){
			Common.confirm({ 
				title: "余额预警",
				message: "确认"+Commess+"余额预警？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: "余额预警"+Commess+"成功！",
									operate: function (reselt) { 
										$scope.ReloadFun();							
									}
								})
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message:"余额预警"+Commess+"失败！原因："+CurErrorMessage,
									operate: function (reselt) {  
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "余额预警"+Commess+"失败！原因："+response.error,
								operate: function (reselt) {	
								}
							})
						});
					} else {
					}
				}
			})
		}
	}

	$scope.ReloadFun=function(){//刷新数据
		window.location.reload('#/account/account.html');
	}
}]);
