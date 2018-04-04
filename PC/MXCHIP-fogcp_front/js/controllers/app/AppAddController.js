angular.module('FogApp').controller('AppAddController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	$scope.ModalStype=1;//1:新建
	$scope.ItemsVisible = false;
	$scope.ListArr=[];
	$scope.Description="";
	var IsShowListFun=function(){
		if($scope.ListArr.length==0){
			$scope.ItemsVisible = true;
		}else{ 
			$scope.ItemsVisible = false;
		}
	}

	IsShowListFun();
	
	/************************初始化数据************************/
	var GetListFun=function(param){/*应用管理-绑定产品列表*/
		var Url = $rootScope.settings.portsPath+'app/appinfo/?appid='+ID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.AppName=response.data.name;
				$scope.Description=response.data.description;
				IsShowListFun();
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取绑定的产品列表失败！原因："+CurErrorMessage,
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
		$scope.ModalStype=2;
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
		var MethodStype="POST";
		var productlist=[];
		for(var i=0;i<$scope.ListArr.length;i++){
			productlist.push($scope.ListArr[i].productid);
		}

		var param= {
			name:$scope.AppName,
			abilitytype:0,
			description:$scope.Description,
			attributes:JsonAttr
		};

		if($scope.ModalStype==2){
			param.appid=ID;
			MethodStype="PUT";
		}else{
			MethodStype="POST";
		}

		var Url = $rootScope.settings.portsPath+'app/appinfo/';
		var Data = param;
		var PostParam = {
			method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
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
											$scope.ReloadFun(response.data.appid);						
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

	$scope.ReloadFun=function(ID){/*Fun-刷新*/
		var ID=ID||false;
		if(ID){
			window.location.href='#/app/app_details.html?ID='+ID;
		}else{

			window.location.href='#/app/app_list.html';
		}
	}
}]);
