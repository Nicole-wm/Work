angular.module('FogApp').controller('TaskDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http','$filter',function($rootScope, $scope, settings,$uibModal,$http,$filter) {
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

	$scope.otaflag=false;
	var OTA = getQueryStringByKey('OTA');
	if(OTA){
		$scope.ChooseOTAFlag=false;
		$scope.otaflag=false;
	}else{
		$scope.ChooseOTAFlag=true;
		$scope.otaflag=true;
	}

	$scope.ModalStype=1;
	$scope.checkFlag=false;

	$scope.maxSize = 5;
	$scope.pageSize = 10;

	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.currentPage = 1;

	$scope.DetailtotalItems=0;
	$scope.DetailListArr =[];
	$scope.DetailcurrentPage = 1;

	$scope.ModaltotalItems=0;
	$scope.ModalListArr =[];
	$scope.ModalcurrentPage = 1;

	$scope.ListArr=[];

	$scope.accesstype=0;
	$scope.noticetype=0;
	$scope.upgrade=0;

	$scope.startflag=false;
	$scope.chooseproflag=false;

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);
	var Detailparam=InitPage(1);
	var Modalparam=InitPage(1);

	var Status=[
	{ "ID":"0","Name":"测试"},
	{ "ID":"1","Name":"上线"}
	]
	$scope.Status=Status;

	$scope.status='0';

	var UpGrades=[
	{ "ID":"0","Name":"静默"},
	{ "ID":"1","Name":"人工"},
	{ "ID":"2","Name":"强制"}
	]

	$scope.UpGrades=UpGrades;

	var AccessTypes=[
	{ "ID":"0","Name":"fog"},
	{ "ID":"1","Name":"非fog"}
	]

	$scope.AccessTypes=AccessTypes;

	var NoticeTypes=[
	{ "ID":"0","Name":"MQTT"},
	{ "ID":"1","Name":"APP"},
	{ "ID":"2","Name":"设备自检"}
	]

	$scope.NoticeTypes=NoticeTypes;

	var param="";

	/************************初始化数据************************/
	var GetProListFun = function () {/*搜索框-产品*/
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

	var GetListFun=function(){/*ID任务详情管理*/
		var Url = $rootScope.settings.portsPath+'ota/tasks/'+ID+'/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CurObj=response.data;
				$scope.chooseproflag=true;
				$scope.BelongProID=CurObj.product.productid;
				$scope.ListArr=CurObj.ota_files;
				$scope.status=CurObj.status.toString();
				$scope.description=CurObj.description;
				$scope.accesstype=CurObj.is_fog.toString();
				$scope.noticetype=CurObj.notify_type.toString();
				$scope.upgrade=CurObj.ug_type.toString();
				if(CurObj.status==0){
					$scope.startflag=false;
				}else{
					$scope.startflag=true;
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取OTA详情失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}

		}).error(function(response, status){
			console.log(response.error);
		});
	}

	var GetDevListFun = function (param) {/*任务管理-设备列表*/
		$.ajax({ 
			type: "GET", 
			url: "json/device_list.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.result;
				var objArr=$scope.ListArr;
				for(var i=0;i<objArr.length;i++){
					if(objArr[i].status){
						objArr[i].IsActiveText="有效";
					}else{
						objArr[i].IsActiveText="无效";
					}
					if(objArr[i].onlinestatus){
						objArr[i].IsOnlineText="在线";
					}else{
						objArr[i].IsOnlineText="离线";
					}
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	var GetDetailDevListFun = function (param) {
		var Url = $rootScope.settings.portsPath+'ota/devices/?otid='+ID+'&page='+param.page+'&limit='+param.limit;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.complete_percentage=response.data.complete_percentage;
				$scope.DetailtotalItems=response.data.count;
				$scope.DetailListArr = response.data.results;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取任务相关设备失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	var GetModalListFun=function(deviceid,param){
		var Url = $rootScope.settings.portsPath+'ota/tasks/'+deviceid+'/logs/?page='+param.page+'&limit='+param.limit;
		var Data = param;
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			$scope.ModaltotalItems=response.data.count;
			$scope.ModalListArr = response.data.results;
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	if(ID){
		GetListFun();
		Detailparam=InitPage(1);
		GetDetailDevListFun(Detailparam);
		if(Curtype==2){
			$scope.ModalStype=1;
		}else{
			$scope.ModalStype=2;
		}
		$scope.checkFlag=true;
	}

	/************************页面调用方法************************/
	$scope.ChangePro=function(){
		$scope.ListArr=[];
	}

	$scope.AddNew = function() {/*Fun-绑定产品*/
		if(!$scope.startflag){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/ota/select_ota.html',
				controller: "SelectOTAController",
				size:"lg",
				resolve: {
					SelectType : function() { 
						return $scope.BelongProID; 
					},
					ExistItems: function () {
						return $scope.ListArr;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				if(selectedItem){
					for (var j = 0; j < selectedItem.length; j++) {
						$scope.ListArr.push(selectedItem[j]);
					}
				}
			}, function () {
			});
		}else{

		}
	};

	$scope.DeleteOTAFun=function(Item){/*Fun-删除产品*/
		if(!$scope.startflag){
			$scope.ListArr.splice($scope.ListArr.indexOf(Item), 1);
		}else{

		}
	}

	$scope.CheckClick=function(){
		$scope.checkFlag=true;
		GetDevListFun(param);
	}

	$scope.SureFun=function(flag){/*Fun-确认*/
		var MethodStype="POST";
		var otalist=[];
		for(var i=0;i<$scope.ListArr.length;i++){
			otalist.push($scope.ListArr[i].ofid);
		}

		if(OTA){
			otalist=[];
			otalist.push(OTA);
		}

		var param= {
			ota_files:otalist,
			status:$scope.status*1,/*
			onset_time:$scope.effectivetime,*/
			description:$scope.description,
			is_fog:$scope.accesstype*1,
			notify_type:$scope.noticetype*1,
			ug_type:$scope.upgrade*1,
			ug_range:0,
			mac_range:otalist,
			extend:'',
		};

		var Url = $rootScope.settings.portsPath+'ota/tasks/';

		if(ID){
			MethodStype="PUT";
			var Url = $rootScope.settings.portsPath+'ota/tasks/'+ID+'/';
		}else{
			MethodStype="POST";
			var Url = $rootScope.settings.portsPath+'ota/tasks/';
		}

		var Data = param;
		var PostParam = {
			method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		if(flag){
			Common.confirm({ 
				title: "任务信息",
				message: "确认提交任务信息？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: "任务信息提交成功！",
									operate: function (reselt) { 
										$scope.ReloadFun();							
									}
								})
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message:"任务信息提交失败！原因："+CurErrorMessage,
									operate: function (reselt) {  
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "任务信息提交失败！原因："+response.error,
								operate: function (reselt) {
								}
							})
						});
					} else {
					}
				}
			})
		}else{
			$scope.ReloadFun();
		}
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/
		if(OTA){
			window.location.href = '#/ota/task_list.html?ID='+OTA+'&type='+Curtype;
		}else{
			window.location.href = '#/ota/tasks_list.html?type='+Curtype;
		}
	}

	$scope.ToLogFun=function(ID){/*Fun-列表-日志*/
		$scope.deviceID=ID;
		Detailparam=InitPage($scope.DetailcurrentPage);
		GetModalListFun($scope.deviceID,Detailparam);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetDevListFun(param);
	};

	$scope.DetailpageChanged = function()/*Fun-分页*/
	{
		Detailparam=InitPage($scope.DetailcurrentPage);
		GetDetailDevListFun(Detailparam);
	};

	$scope.ModalpageChanged = function()/*Fun-分页*/
	{
		Modalparam=InitPage($scope.ModalcurrentPage);
		GetModalListFun($scope.deviceID,Modalparam);
	};


	$(".form_meridian_datetime").datetimepicker({
		isRTL: App.isRTL(),
		format: "yyyy-mm-dd hh:ii",
		showMeridian: true,
		autoclose: true,
		pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left"),
		todayBtn: true
	});
}]);
