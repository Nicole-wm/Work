angular.module('FogApp').controller('BaseInfoController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.InfoMessage="基本信息";

	/************************初始化数据************************/
	/*个人中心*/
	var GetInfoFun=function(param){
		var Url = $rootScope.settings.portsPath+'accounts/info/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CurUser=response.data;
				$scope.ImageUrl=CurUser.headimage;
				$scope.UserEmail=CurUser.user.email;
				$scope.UserName=CurUser.user.username;
				$scope.Name=CurUser.name;
				$scope.Phone=CurUser.phone;
				$scope.Attr=CurUser.attr;
				$scope.CompanyName=CurUser.companyname;
				$scope.Location=CurUser.location;
				$scope.Website=CurUser.website;
				$scope.Description=CurUser.about_me;

				$scope.ModalUserName=CurUser.user.username;
				$scope.ModalPhone=CurUser.phone;
				$scope.ModalAttr=CurUser.attr;

				$scope.ModalCompanyName=CurUser.companyname;
				$scope.ModalLocation=CurUser.location;
				$scope.ModalWebsite=CurUser.website;
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

	var GetProCate=function(){/*业务信息-行业类别*/
		$.ajax({ 
			type: "GET", 
			url: "json/primpro_category.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				PrimProCategorys=data.Data;
				$scope.PrimProCategorys = PrimProCategorys;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	GetProCate();

	/************************页面调用方法************************/
	/*Fun-图片上传*/
	upload_image_func('profile','user_selectbtn','user_btn','user_name','user_upbtn','user_img','user_input');

	/*提交信息*/
	$scope.InfoFun=function(attr){
		if(attr==1){
			var Param= {
				name:$scope.ModalUserName,
				headimage:$("#user_img img").attr("src"),
				phone:$scope.ModalPhone
			};
			$scope.InfoMessage="基本信息";
		}else if(attr==2){
			var Param= {
				companyname:$scope.ModalCompanyName,
				location:$scope.ModalLocation,
				website:$scope.ModalWebsite,
				about_me:$scope.Description
			};
			$scope.InfoMessage="业务信息";
		}else{
		}

		var Url = $rootScope.settings.portsPath+'accounts/info/';
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
								message:$scope.InfoMessage+"提交成功！",
								operate: function (reselt) {   
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"提交失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: $scope.InfoMessage+"提交失败！原因："+response.error,
							operate: function (reselt) {    
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){//刷新页面
		window.location.reload('#/center/profile.html');
	}
}]);
