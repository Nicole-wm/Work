angular.module('FogApp').controller('ProductValidationController', function($rootScope, $scope, $http, $timeout) {
	/************************初始化变量************************/
	$rootScope.settings.layout.pageSidebarClosed = true;
	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

	if(getQueryStringByKey('state')){
		var Curstate = getQueryStringByKey('state');
	}else{
		var Curstate=0;
	}

	if(Curstate==0){
		$scope.DebugMess="虚拟设备";
	}else{
		$scope.DebugMess="虚拟APP";
	}

	$scope.Curstate=Curstate;
	$scope.ComLog=[];
	$scope.SendLog=[];
	$scope.conbtn=true;
	$scope.disconbtn=true;
	$scope.addtopbtn=true;
	$scope.adddevicebtn=true;
	$scope.ListArr=[];
	$scope.DeviceListFlag=false;

	$scope.appconbtn=true;
	$scope.appdisconbtn=true;
	$scope.appaddtopbtn=true;
	$scope.appDeviceListFlag=false;
	$scope.appaddApp=true;

	$scope.IsTimeSendFlag=false;
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

	var GetAppListFun = function (ProID) {/*搜索框-产品*/
		var Url = $rootScope.settings.portsPath+'product/apps/?product='+ProID;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			$scope.appaddApp=false;
			$scope.AppArrs = response.data.results;
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	var GetMQTTFun = function (curfog_id,curreq_type,pid,did,stype,ptype) {
		var Url = $rootScope.settings.portsPath+'product/virtual/mqtt/?fog_id='+curfog_id+'&req_type='+curreq_type;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.MqttInfo=response.data;
				MqttInit(pid,did,stype,ptype);
				do_ezconnect($scope.wechatapp.subtopic);
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取MQTT信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	BeDis(false);
	/************************页面调用方法************************/
	$scope.FunTimeCheck=function(){
		$scope.TimeSendInput="";
		$scope.appTimeSendInput="";
	}

	function BeDis(flag){
		$("#ChooseDiv button").attr("disabled",flag);
		$("#ChooseDiv input").attr("disabled",flag);
		$("#ChooseDiv select").attr("disabled",flag);
		$("#appChooseDiv button").attr("disabled",flag);
		$("#appChooseDiv input").attr("disabled",flag);
		$("#appChooseDiv select").attr("disabled",flag);
	}

	var client;
	$scope.wechatapp = {};

	function MqttInit(pid,did,stype,ptype){
		$scope.wechatapp = {
			host: $scope.MqttInfo.wsshost,
			port: $scope.MqttInfo.wssport,
			clientid: $scope.MqttInfo.clientid,
			userName: $scope.MqttInfo.loginname,
			password: $scope.MqttInfo.password,
			subtopic: $scope.MqttInfo.endpoint+'/'+pid+'/'+did+'/'+stype+'/json',
			pubtopic: $scope.MqttInfo.endpoint+'/'+pid+'/'+did+'/'+ptype+'/json',
			useSSL: true,
			device_id: did,
			items: []
		}
	}

	function do_ezconnect(subtopic) {
		console.log($scope.wechatapp);
		client = new Paho.MQTT.Client($scope.wechatapp.host, $scope.wechatapp.port, $scope.wechatapp.clientid);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		client.onMessageDelivered = onMessageDelivered;
		client.connect({
			onSuccess: onConnect,
			userName: $scope.wechatapp.userName,
			password: $scope.wechatapp.password,
			useSSL: $scope.wechatapp.useSSL
		});

		function onConnect() {
			console.log("onConnect");
			BeDis(true);
			Common.notify({
				message: "连接成功！"
			})
			client.publish = function(topic,SendTxt) {
				console.log("publish");
				console.log("pub:"+ topic);
				message = new Paho.MQTT.Message(SendTxt);
				message.destinationName = topic;
				client.send(message);
			}
			console.log("sub:"+ $scope.wechatapp.subtopic);
			client.subscribe($scope.wechatapp.subtopic);
		}

		function subscribe(){
			console.log("subscribe");
			client.subscribe(subtopic,{qos: 0})
		}

		function onConnectionLost(responseObject) {
			if (responseObject.errorCode!== 0){
				Common.notify({
					message: "连接断开！请重新连接"
				})
				console.log("onConnectionLost:" + responseObject.errorMessage);
				BeDis(false);
				$scope.conbtn=false;
				$scope.disconbtn=true;
				$scope.appconbtn=false;
				$scope.appdisconbtn=true;
				$scope.$apply();
			}
		}

		function onMessageArrived(message) {
			console.log("Arrived message");
			console.log(message)
			var tempval = {};
			tempval.topic = message.destinationName;
			tempval.message = message.payloadString;
			$scope.wechatapp.items.push(tempval);
			$scope.ComLog.push(tempval);
			$scope.$apply();
		}

		function onMessageDelivered(message) {
			console.log("Publish success.")
			console.log(message)
			var tempval = {};
			tempval.topic = message.destinationName;
			tempval.message = message.payloadString;
			$scope.SendLog.push(tempval);
			if($scope.IsTimeSendFlag){
				$scope.$apply();
			}
		}
	}

	$scope.SearchPro=function(){
		$scope.ezdisconnect();
		$scope.SelectedID="";
		$scope.DeviceListFlag=false;
		$scope.conbtn=false;
		$scope.disconbtn=true;
		$scope.addtopbtn=true;

		if($scope.BelongProID){
			var Url = $rootScope.settings.portsPath+'product/vDevice/list/?product='+$scope.BelongProID;
			var Data = '';
			var PostParam = {
				method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
			$http(PostParam).success(function(response){
				if(response.meta.code==0){
					$scope.totalItems=response.data.count;
					$scope.ListArr = response.data.results;
					if($scope.ListArr.length!=0){
						$scope.DeviceListFlag=true;
					}
					if($scope.ListArr.length<3){
						$scope.adddevicebtn=false;
					}else{
						$scope.adddevicebtn=true;
					}
				}else{
					CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
					Common.alert({
						message:"获取虚拟设备列表失败！原因："+CurErrorMessage,
						operate: function (reselt) {  
						}
					})
				}
			}).error(function(response, status){
				console.log(response.error);
			});
		}
	}

	$scope.CreatVDevice=function(){
		if($scope.ListArr.length>3){
			Common.alert({
				message: "虚拟设备创建失败！原因：虚拟设备总数不能超过3个！",
				operate: function (reselt) {
				}
			})
		}else{
			var Url = $rootScope.settings.portsPath+'product/vDevice/';
			var Data = {
				'product':$scope.BelongProID
			};
			var PostParam = {
				method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};

			Common.confirm({ 
				title: "虚拟设备",
				message: "确认创建虚拟设备？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: "虚拟设备创建成功！",
									operate: function (reselt) {
										$scope.ReloadFun();
									}
								})
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message:"虚拟设备创建失败！原因："+CurErrorMessage,
									operate: function (reselt) {  
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "虚拟设备创建失败！原因："+response.error,
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

	$scope.DoBindDevice=function(CurId){
		$("#qrcode").empty();
		var qrcode = new QRCode("qrcode");
		qrcode.makeCode(CurId);
	}

	$scope.UnDoBindDevice=function(CurId,CurEnduserid){
		var Url = $rootScope.settings.portsPath+'product/virtual/bind/?deviceid='+CurId+'&enduserid='+CurEnduserid;
		var Data = '';
		var PostParam = {
			method:'DELETE',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({ 
			title: "设备解绑",
			message: "确认解绑该设备？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "设备解绑成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"设备解绑失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "设备解绑失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ezconnect=function(){//连接
		if(!$scope.conbtn){
			for(var i=0;i<$scope.ListArr.length;i++){
				if($scope.ListArr[i].deviceid==$scope.SelectedID){
					if(!$scope.ListArr[i].isbinded){
						Common.alert({
							message: "请先选择绑定设备！",
							operate: function (reselt) {
							}
						})
					}else{
						GetMQTTFun($scope.SelectedID,1,$scope.BelongProID,$scope.SelectedID,"command","status");
						$scope.conbtn=true;
						$scope.disconbtn=false;
						$scope.addtopbtn=false;
						$scope.ComLog=[];
						$scope.SendLog=[];
					}
					break;
				}
			}
		}
	}

	$scope.ezdisconnect=function(){//断开
		if(!$scope.disconbtn){
			BeDis(false);
			$scope.conbtn=false;
			$scope.disconbtn=true;
			$scope.addtopbtn=true;
			clearInterval($scope.Timer);
			client.disconnect();
		}
	}

	$scope.addtopic=function(){//发送
		if((($scope.VText&&!$scope.TimeSendCheck)||($scope.VText&&$scope.TimeSendCheck&&$scope.TimeSendInput))&&!$scope.addtopbtn){
			$scope.IsTimeSendFlag=false;
			if($scope.TimeSendCheck){
				var reg = /^\d+(?=\.{0,1}\d+$|$)/;
				if(reg.test($scope.TimeSendInput)){
					$scope.IsTimeSendFlag=true;
					function DoSend(){ client.publish($scope.wechatapp.pubtopic,$scope.VText);} 
					$scope.Timer=window.setInterval(DoSend,$scope.TimeSendInput*1000); 
				}else{
					Common.alert({
						message: "间隔时间请输入正数",
						operate: function (reselt) {
						}
					})
				}
			}else{
				client.publish($scope.wechatapp.pubtopic,$scope.VText);
			}
		}
	}

	$scope.SearchAppPro=function(){
		$scope.appezdisconnect();
		$scope.appSelectedID="";
		$scope.appaddApp=true;
		GetAppListFun($scope.AppBelongProID);
	}

	$scope.SearchApp=function(){
		$scope.appezdisconnect();
		$scope.appSelectedID="";
		$scope.appDeviceListFlag=false;
		$scope.appconbtn=false;
		$scope.appdisconbtn=true;
		$scope.appaddtopbtn=true;

		if($scope.AppBelongProID&&$scope.BelongAppID){
			var Url = $rootScope.settings.portsPath+'product/vEndUser/devices/?product='+$scope.AppBelongProID+'&app='+$scope.BelongAppID;
			var Data = '';
			var PostParam = {
				method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};

			$http(PostParam).success(function(response){
				if(response.meta.code==0){
					$scope.totalItems=response.data.count;
					$scope.appListArr = response.data.results;
					if($scope.appListArr.length!=0){
						$scope.appDeviceListFlag=true;
					}
				}else{
					CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
					Common.alert({
						message:"获取设备列表失败！原因："+CurErrorMessage,
						operate: function (reselt) {  
						}
					})
				}
			}).error(function(response, status){
				console.log(response.error);
			});
		}
	}

	$scope.AddAppDevice=function(){
		$scope.ModalName="";
		$("#common_addappdev_btn").click();
	}

	$scope.SureAddApp=function(){
		var Url = $rootScope.settings.portsPath+'product/virtual/bind/';
		var Data = {
			'product':$scope.AppBelongProID,
			'app':$scope.BelongAppID,
			'dsn':$scope.ModalName
		};
		var PostParam = {
			method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({ 
			title: "设备绑定",
			message: "确认绑定设备？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "绑定设备成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"绑定设备失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "绑定设备失败！原因："+response.meta.message,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.appezconnect=function(){//连接
		if(!$scope.appconbtn){
			if($scope.appSelectedID){
				for(var i=0;i<$scope.appListArr.length;i++){
					if($scope.appSelectedID==$scope.appListArr[i].device){
						$scope.SelectedEnduser=$scope.appListArr[i].enduser;
					}
				}
				GetMQTTFun($scope.SelectedEnduser,0,$scope.AppBelongProID,$scope.appSelectedID,"status","command");
				$scope.appconbtn=true;
				$scope.appdisconbtn=false;
				$scope.appaddtopbtn=false;
				$scope.ComLog=[];
				$scope.SendLog=[];
			}else{
				Common.alert({
					message: "请先选择绑定设备！",
					operate: function (reselt) {
					}
				})
			}
		}
	}

	$scope.appezdisconnect=function(){//断开
		if(!$scope.appdisconbtn){
			BeDis(false);
			$scope.appconbtn=false;
			$scope.appdisconbtn=true;
			$scope.appaddtopbtn=true;
			clearInterval($scope.appTimer);
			client.disconnect();
		}
	}

	$scope.appaddtopic=function(){//发送
		if((($scope.AText&&!$scope.appTimeSendCheck)||($scope.AText&&$scope.appTimeSendCheck&&$scope.appTimeSendInput))&&!$scope.appaddtopbtn){
			$scope.IsTimeSendFlag=false;
			if($scope.appTimeSendCheck){
				var reg = /^\d+(?=\.{0,1}\d+$|$)/;
				if(reg.test($scope.appTimeSendInput)){
					$scope.IsTimeSendFlag=true;
					function DoSend(){ client.publish($scope.wechatapp.pubtopic,$scope.AText);} 
					$scope.appTimer=window.setInterval(DoSend,$scope.appTimeSendInput*1000); 
				}else{
					Common.alert({
						message: "间隔时间请输入正数",
						operate: function (reselt) {
						}
					})
				}
			}else{
				client.publish($scope.wechatapp.pubtopic,$scope.AText);
			}
		}
	}

	$scope.ReloadFun=function(){//刷新页面
		$scope.SearchPro();
		$scope.SearchAppPro();
		$scope.SearchApp();
	}
});