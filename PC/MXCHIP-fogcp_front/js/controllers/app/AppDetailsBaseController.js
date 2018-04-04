angular.module('FogApp').controller('AppDetailsBaseController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	/************************初始化数据************************/
	var GetListFun=function(param){/*应用管理*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.AppName=response.data.name;
				$scope.Description=response.data.description;
				$scope.KeyArr=angular.fromJson(response.data.attributes.data);
				if($scope.KeyArr){
				}else{
					$scope.KeyArr=[];
				}
				$scope.KayArrID();
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

	if(ID){
		GetListFun();
	}

	/************************页面调用方法************************/
	/*Fun-弹框-变量*/
	$scope.KeyArr=[];
	$scope.InitCount= $scope.KeyArr.length+1;

	$scope.KayArrID=function(){/*Fun-弹框-生成键值对数组ID*/
		for(i in $scope.KeyArr){
			$scope.KeyArr[i].ID= i*1;
		}
	}

	$scope.KayArrID();

	$scope.AddKey=function(){/*Fun-弹框-新建键值*/
		if($scope.CreatKeyFlag==1||$scope.SaveFlag==0){
			Common.alert({
				message: "有属性暂未保存，请先保存。",
				operate: function (reselt) {
				}
			})
		}else{
			$scope.CreatKeyFlag=1;
			$scope.KeyName="";
			$scope.KeyValue="";
		}
	}

	$scope.SaveNewKey=function(flag){/*Fun-弹框-保存键值*/
		if(flag){
			if($scope.KeyName!=""&&$scope.KeyValue!=""){
				$scope.CreatKeyFlag=0;
				$scope.KeyArr.unshift({"ID":$scope.InitCount++ ,"KeyName":$scope.KeyName,"KeyValue":$scope.KeyValue}); 
			}else{
				Common.alert({
					message: "新建属性键名或者键值不得为空！",
					operate: function (reselt) {
					}
				})
			}
		}else{
			$scope.CreatKeyFlag=0;
		}
	}

	$scope.DeleteKey=function(Key){/*Fun-弹框-删除键值*/
		$scope.KeyArr.splice($scope.KeyArr.indexOf(Key), 1);
	}

	$scope.EditKey=function(Key,ID){/*Fun-弹框-编辑键值*/
		$scope.SaveFlag=0;
		$scope.EditFlag=ID;
		var initKey=Key;
		var CurLine=$scope.KeyArr.indexOf(Key);
	}

	$scope.SaveEditKey=function(flag,ID){/*Fun-弹框-键值-保存取消*/
		$scope.SaveFlag=1;
		$scope.EditFlag=-1;
		if(flag){
			var curName=$("#EditName"+ID).val();
			var curValue=$("#EditValue"+ID).val();
			if(curName!=""&&curValue!=""){
				for(var i=0;i<$scope.KeyArr.length;i++){
					if($scope.KeyArr[i].ID==ID){
						$scope.KeyArr[i].KeyName=curName;
						$scope.KeyArr[i].KeyValue=curValue;
					}
				}
			}else{
				Common.alert({
					message: "编辑属性键名或者键值不得为空！",
					operate: function (reselt) {
					}
				})
			} 
		}else{
		}
	}

	function ValidateFun(){/*Fun-弹框-验证*/
		if($scope.CreatKeyFlag==1||$scope.SaveFlag==0){
			Common.alert({
				message: "有属性暂未保存，请先保存。",
				operate: function (reselt) {
				}
			})
		}else{
			return true;
		}
	}

	$scope.SureAppFun=function(flag){/*Fun-确认-应用*/
		var JsonAttr = {"data":$scope.KeyArr};
		var param= {
			appid:ID,
			name:$scope.AppName,
			abilitytype:0,
			description:$scope.Description,
			attributes:JsonAttr
		};

		var Url = $rootScope.settings.portsPath+'app/appinfo/';
		var Data = param;
		var PostParam = {
			method:"PUT",url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		if(flag){
			var ValidFlag=ValidateFun();
			if(ValidFlag){
				Common.confirm({ 
					title: "应用信息",
					message: "确认提交应用信息？",
					operate: function (reselt) {
						if (reselt) {
							$http(PostParam).success(function(response){
								if(response.meta.code==0){
									Common.alert({
										message: "应用信息提交成功！",
										operate: function (reselt) {  
											$scope.ReloadFun();							
										}
									})
								}else{
									CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
									Common.alert({
										message:"应用信息提交失败！原因："+CurErrorMessage,
										operate: function (reselt) {  
										}
									})
								}
							}).error(function(response, status){
								Common.alert({
									message: "应用信息提交失败！原因："+response.error,
									operate: function (reselt) {	
									}
								})
							});
						} else {
						}
					}
				})
			}
		}else{
			$scope.ReloadFun();
		}
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/ 
		window.location.reload('#/app/app_details.html?ID='+ID);
	}

	$scope.BackFun=function(){
		window.location.href='#/app/app_list.html';
	}
}]);
