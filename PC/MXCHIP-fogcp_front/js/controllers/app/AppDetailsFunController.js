angular.module('FogApp').controller('AppDetailsFunController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');
	}else{
		var ID = '';
	}

	$scope.AlreadyUnit= [];
	$scope.AllUnit= [];
	$scope.NotUnit=[];
	$scope.AlreadyUnitCount= 0;
	$scope.NotUnitCount= 0;
	$scope.AllUnitCount= 0;

	/************************初始化数据************************/
	function InitUnit(Attrs){
		for(var i=0;i<Attrs.length;i++){
			var CurAttrs=[]
			jQuery.each(Attrs[i].attributes, function(k, val) {  
				var curKV = {"key":k,"value":val};
				CurAttrs.push(curKV); 
			});  
			Attrs[i].Attrs=CurAttrs; 
		}
	}

	var GetAllListFun=function(){
		var Url = $rootScope.settings.portsPath+'app/buslist/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.AllUnit=response.data;
				$scope.AllUnitCount = $scope.AllUnit.length;
				InitUnit($scope.AllUnit);
				GetAlreadyListFun();
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取功能组件列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	var GetAlreadyListFun=function(){
		var Url = $rootScope.settings.portsPath+'app/businfo/?appid='+ID;

		var Data= '';

		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.AlreadyUnit=response.data;
				$scope.AlreadyUnitCount = $scope.AlreadyUnit.length;
				InitUnit($scope.AlreadyUnit);
				GetNotListFun();
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取功能组件列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	var GetNotListFun=function(){
		$scope.NotUnit=[];
		var AlreadyUnit=$scope.AlreadyUnit;
		var AllUnit=$scope.AllUnit;
		if(AllUnit.length!=0){
			for(var i=0;i<AllUnit.length;i++){
				var flag=true;
				for(var j=0;j<AlreadyUnit.length;j++){
					if(AllUnit[i].id==AlreadyUnit[j].busid){
						flag=false;
						break;
					}else{
						flag=true;
					}
				}
				if(flag){
					$scope.NotUnit.push(AllUnit[i]);
				}
			}
			$scope.NotUnitCount = $scope.NotUnit.length;
		}else{
		}
	}

	if(ID){
		GetAllListFun();
	}
	/************************页面调用方法************************/
	$scope.ClearForm=function(){/*Fun-弹框清空*/
		$("#FormReset").click();
	}

	$scope.PutUnitFun=function(CurUnit,type){//type:1 确认 2：删除 3:开通 
		var MethodStype="PUT";

		if($scope.AlreadyUnitCount==0){
			MethodStype="POST";
		}else{
			MethodStype="PUT";
		}

		$scope.buslist=""; 
		var Connmessage="确认";
		if(type==1){
			$scope.Kid=CurUnit.busid;
			Connmessage="提交";
			$scope.buslist="{"+DoExitUnit(CurUnit)+"}";
		}else if(type==2){
			$scope.Kid=CurUnit.busid;
			Connmessage="关闭";
			$scope.buslist="{"+DoExitUnit(CurUnit)+"}";
		}else{
			$scope.Kid=CurUnit.id;
			Connmessage="开通";
			if(DoExitUnit(CurUnit)){
				$scope.buslist="{"+DoExitUnit(CurUnit)+","+DoCurUnit(CurUnit)+"}";
			}else{
				$scope.buslist="{"+DoCurUnit(CurUnit)+"}";
			}
		}

		function DoCurUnit(CurUnit){//处理当前Unit
			var Curattr="";
			$.each(CurUnit.Attrs,function(index,obj){
				var objattr="";
				if(index==0){
					var objattr='"'+obj.key+'"'+':'+ '"'+obj.value+'"';
				}else{
					var objattr=',"'+obj.key+'":"'+obj.value+'"';
				}
				Curattr=Curattr+objattr;
			});
			var OtherCurattr='"'+$scope.Kid+'":{'+Curattr+'}';
			return OtherCurattr;
		}

		function DoExitUnit(CurUnit){//处理已开通Unit，并删除其中关闭的
			var ExitUnit=$scope.AlreadyUnit;
			var ExitCurattr="";
			$.each(ExitUnit,function(index,obj){
				if(type==2&&$scope.Kid==ExitUnit[index].busid){//删除
					var ExitObjattr="";			
				}else if(type==1&&$scope.Kid==ExitUnit[index].busid){//确认
					if(index==0||($scope.Kid==ExitUnit[0].id&&index==1)){
						var ExitObjattr=DoCurUnit(CurUnit);	
					}else{
						var ExitObjattr=","+DoCurUnit(CurUnit);	
					}
				}else{
					if(index==0||($scope.Kid==ExitUnit[0].busid&&index==1)){					
						var ExitObjattr='"'+ExitUnit[index].busid+'":'+angular.toJson(ExitUnit[index].attributes);
					}else{
						var ExitObjattr=',"'+ExitUnit[index].busid+'":'+angular.toJson(ExitUnit[index].attributes);
					}
				}
				ExitCurattr=ExitCurattr+ExitObjattr;
			});
			return ExitCurattr;
		}

		var param= {
			appid:ID,
			buslist:angular.fromJson($scope.buslist)
		};

		var Url = $rootScope.settings.portsPath+'app/businfo/';

		var Data = param;
		var PostParam = {
			method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({ 
			title: Connmessage+"服务",
			message: "确认"+Connmessage+"该服务？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "服务"+Connmessage+"成功！",
								operate: function (reselt) {  
									$scope.ReloadFun();							
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message: "服务"+Connmessage+"失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "服务"+Connmessage+"失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){
		$("#modalCloseBtn").click();
		$("#modalCloseBtn1").click();
		$(".modal-backdrop").hide();
		GetAlreadyListFun();
	}
}]);
