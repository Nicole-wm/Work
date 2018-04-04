angular.module('FogApp').controller('SecureController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.CheckStep1=false;
	$scope.CheckStep2=false;

	/************************初始化数据************************/
	var GetInfoFun=function(){
		var Url = $rootScope.settings.portsPath+'accounts/info/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CurUser=response.data;
				$scope.CurEmail=CurUser.user.email;
				$scope.CurPhone=CurUser.phone;
				if($scope.CurPhone==""){
					$scope.PhoneBind=false;
				}else{
					$scope.PhoneBind=true;
				}
				if($scope.CurEmail==""){
					$scope.EmailBind=false;
				}else{
					$scope.EmailBind=true;
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取用户信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetInfoFun();

	/************************页面调用方法************************/
	$scope.ClearFun=function(){
		$scope.wait= 60; 
		$scope.ModalNewEmail="";
		$scope.ModalNewPhone="";
		$scope.ModalVCod1="";
		$scope.ModalVCod2="";
		$scope.ModalCCod1="";
		$scope.ModalCCod2="";
		$scope.OldPassword="";
		$scope.NewPassword="";
		$scope.SurePassword="";
		$scope.CheckStep1=true;
		$scope.CheckStep2=true;
	}

	$scope.CheckInfoFun=function(codetype,checktype){
		var CheckMess="";
		if(codetype==1){ 
			Curvercode=$scope.ModalVCod1;
		}else if(codetype==2){
			Curvercode=$scope.ModalVCod2;
		}else{
		}

		if(checktype==1){ 
			Curidentification=$scope.CurEmail;
		}else if(checktype==2){
			Curidentification=$scope.CurPhone;
		}else{
		}

		var Url = $rootScope.settings.portsPath+'accounts/vercode/check/';
		var Data = {
			identification:Curidentification,
			vercode:Curvercode
		};
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				if(codetype==1){
					$scope.CheckStep1=false;
				}else if(codetype==2){
					$scope.CheckStep2=false;
				}else{
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"验证失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			Common.alert({
				message:"验证失败！原因："+response.error,
				operate: function (reselt) {  
				}
			})
		});
	}

	/*提交信息*/
	$scope.ChangeVInfoFun=function(attr){
		var Url = $rootScope.settings.portsPath+'accounts/email/change/';
		if(attr==1){
			$scope.InfoMessage="新邮箱";
			var Url = $rootScope.settings.portsPath+'accounts/email/change/';
			var Param= {
				email:$scope.ModalNewEmail,
				vercode:$scope.ModalCCod1
			};
		}else if(attr==2){
			$scope.InfoMessage="新手机";
			var Url = $rootScope.settings.portsPath+'accounts/phone/change/';
			var Param= {
				phone:$scope.ModalNewPhone,
				vercode:$scope.ModalCCod2
			};
		}else{
		}

		var Data = Param;
		var PostParam = {
			method: 'PUT',url:Url,data:Data,headers:{'Authorization': "token " + localStorage.token}
		};

		Common.confirm({
			title: $scope.InfoMessage+"设置",
			message: "确认提交"+$scope.InfoMessage+"？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message:"修改"+$scope.InfoMessage+"成功！",
								operate: function (reselt) {   
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message: "修改"+$scope.InfoMessage+"失败！原因："+CurErrorMessage,
								operate: function (reselt) {    
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "修改"+$scope.InfoMessage+"失败！原因："+response.error,
							operate: function (reselt) {    
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.wait= 60; 
	function time(o) {/*Fun-获取验证码*/
		if ($scope.wait == 0) {  
			o.removeAttribute("disabled");           
			o.value="获取验证码"; 
			$scope.wait = 60;  
		} else { 
			o.setAttribute("disabled", true);  
			o.value="重新发送(" + $scope.wait + ")"; 
			$scope.wait--;  
			setTimeout(function() {  
				time(o)  
			},  
			1000)  
		}  
	}  

	$scope.SeVCBtnFun=function(flag){
		$scope.wait= 60; 
		var CheckMess="";

		if($scope.ModalAuthWay==1){
			CheckMess="邮箱";
			Curidentification=$scope.CurEmail;
		}else if($scope.ModalAuthWay==2){
			CheckMess="手机";
			Curidentification=$scope.CurPhone;
		}else{
		}

		if(flag==1){ 
			time(document.getElementById("SeVCBtn1"));
		}else if(flag==2){
			time(document.getElementById("SeVCBtn2"));
		}else if(flag==3){ 
			time(document.getElementById("SeVCBtn3"));
			CheckMess="邮箱";
			Curidentification=$scope.ModalNewEmail;
		}else if(flag==4){
			time(document.getElementById("SeVCBtn4"));
			CheckMess="手机";
			Curidentification=$scope.ModalNewPhone;
		}else{
		}

		var Url = $rootScope.settings.portsPath+'accounts/vercode/';//type:2 变更验证码
		var Data = {
			identification:Curidentification,
			type:2
		};
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				Common.alert({
					message:"验证码已发送至"+CheckMess+"，注意查收！",
					operate: function (reselt) {  
					}
				})
			}else{
				CurErrorMessage=checkCode(response.meta.message);
				Common.alert({
					message:"验证码发送失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			Common.alert({
				message:"验证码发送失败！原因："+response.error,
				operate: function (reselt) {  
				}
			})
		});
	}

	$scope.PassVerFun=function(){
		var Psd1=$scope.NewPassword;
		var Psd2=$scope.SurePassword;
		if(Psd1!=""){
			if(Psd1.length<6||Psd1.length>18){
				Common.alert({
					message:"密码长度为6-18位,请重新输入！",
					operate: function (reselt) {  
					}
				})
			}else if(Psd2!=""){
				if(Psd1!=Psd2){
					Common.alert({
						message:"确认密码输入不一致，请重新输入！",
						operate: function (reselt) {  
						}
					})
				}else{
					return true;
				}
			}else{
			}
		}else{
		}
	}

	$scope.PasswordInfoFun=function(){
		var NewParam= {
			currentpasswd:$scope.OldPassword,
			newpasswd:$scope.NewPassword
		};	

		if($scope.PassVerFun()){
			var Url = $rootScope.settings.portsPath+'accounts/password/change/';
			var Data = NewParam;
			var PostParam = {
				method: 'PUT',url:Url,data:Data,headers:{'Authorization': "token " + localStorage.token}
			};

			Common.confirm({
				title: "账户设置",
				message: "确认提交个人密码？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: "密码修改成功！",
									operate: function (reselt) {   
										$scope.ReloadFun();
									}
								})
							}else{
								CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
								Common.alert({
									message: "密码修改失败！原因："+CurErrorMessage,
									operate: function (reselt) {    
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: "密码修改失败！原因："+response.error,
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

	$scope.ReloadFun=function(){//刷新页面
		window.location.reload('#/center/profile.html');
	}
}]);
