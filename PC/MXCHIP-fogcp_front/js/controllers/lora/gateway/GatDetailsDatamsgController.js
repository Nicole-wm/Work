angular.module('FogApp').controller('GatDetailsDatamsgController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	$scope.THPart1=true;
	$scope.THPart2=false;
	$scope.THPart3=false;

	$scope.BtnPart1=1;
	$scope.BtnPart3=0;
	$scope.BtnPart4=0;
	/************************初始化数据************************/
	var GetListFun=function(param){/*应用管理*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取应用详情失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}
/*
	if(ID){
		GetListFun();
	}*/

	/************************页面调用方法************************/
	$scope.ChangeMsg=function(flag,val){
		$scope.THPart1=true;
		$scope.THPart2=false;
		$scope.THPart3=false;
		if(flag==1){
			$scope.BtnPart1=!val;
		}else if(flag==2){
			$scope.BtnPart1=!val;
		}else if(flag==3){
			$scope.BtnPart3=!val;
		}else if(flag==4){
			$scope.BtnPart4=!val;
		}else{
		}
		if($scope.BtnPart3==1){
			$scope.THPart2=true;
		}
		if($scope.BtnPart4==1){
			$scope.THPart3=true;
		}
	}

	$scope.DelectFun=function(){
		Common.confirm({ 
			title: "应用信息",
			message: "确认删除应用？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息删除成功！",
						operate: function (reselt) {  
							$scope.BackFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.DeleteDeviceFun=function(){
		Common.confirm({ 
			title: "设备信息",
			message: "确认删除设备？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息删除设备！",
						operate: function (reselt) {  
							$scope.ReloadFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.SureAppFun=function(flag){/*Fun-确认-应用*/
		var param= {
			appid:ID,
			name:$scope.AppName
		};

		Common.confirm({ 
			title: "应用信息",
			message: "确认提交应用信息？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "应用信息提交成功！",
						operate: function (reselt) {  
							$scope.ReloadFun();							
						}
					})
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/ 
		window.location.reload('#/lora/application/app_details.html?ID='+ID);
	}

	$scope.BackFun=function(){
		window.location.href='#/lora/application/app_list.html';
	}
}]);
