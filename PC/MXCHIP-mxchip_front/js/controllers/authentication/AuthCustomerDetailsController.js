angular.module('FogApp').controller('AuthCustomerDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	var ID = getQueryStringByKey('ID');
	var Page = getQueryStringByKey('Page');
	$scope.pageSize = 10;
	$scope.param = {
		'type':'list',
		'page':Page,
		'limit':$scope.pageSize
	}

	$scope.Sureparam = {
		'id':ID,
		'approve':''
	}

	/************************初始化数据************************/
	var GetListFun=function(){/*管理-列表*/
		var Url = $rootScope.settings.portsPath+'profile/company/verf/';
		var Data = $scope.param;
		var PostParam = {
			method: 'GET',url:Url,params:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.ListArr = response.data.result;
				for(var i=0;i<$scope.ListArr.length;i++){
					var CurObj=$scope.ListArr[i];
					if(CurObj.id==ID){
						CustomerDetails=CurObj;
						if(CurObj.ischecked){
							CurObj.StatusText="通过";
						}else{
							CurObj.StatusText="未通过";
						}
						$scope.StatusText = CustomerDetails.StatusText;
						$scope.companyname = CustomerDetails.name;
						$scope.bnumber = CustomerDetails.buslicnum;
						$scope.bentity = CustomerDetails.corporation;
						$scope.subenter = CustomerDetails.parentcompany;
						$scope.braddress = CustomerDetails.regaddr;
						$scope.tel = CustomerDetails.telephone;
						$scope.url = CustomerDetails.website;
						$scope.pic1 = CustomerDetails.groupnumpic;
						$scope.pic2 = CustomerDetails.buslicpic;
						$scope.pic3 = CustomerDetails.taxregpic;
						break;
					}else{
					}
				}
			}else{
				Common.alert({
					message:response.meta.message,
					operate: function (reselt) {						
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	GetListFun();

	/************************页面调用方法************************/
	$scope.ReloadFun=function(){/*Fun-刷新*/
		window.location.href = '#/authentication/customer_list.html';
	}

	$scope.SureFun=function(flag){
		var Url = $rootScope.settings.portsPath+'profile/company/verf/';

		if(flag){
			$scope.Sureparam.approve ='yes';
			MessFun("通过",$scope.Sureparam);
		}else{
			$scope.Sureparam.approve ='no';
			MessFun("不通过",$scope.Sureparam);
		}

		function MessFun(message,Sureparam){
			var Data = Sureparam;
			var PostParam = {
				method:"PUT",url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			};
			console.log(Sureparam);
			Common.confirm({
				title: "客户认证信息",
				message: "确认"+message+"客户认证信息？",
				operate: function (reselt) {
					if (reselt) {
						$http(PostParam).success(function(response){
							if(response.meta.code==0){
								Common.alert({
									message: message+"客户认证信息成功",
									operate: function (reselt) {
										$scope.ReloadFun();
									}
								})
							}else{
								Common.alert({
									message: message+"客户认证信息失败！原因："+response.meta.message,
									operate: function (reselt) { 
									}
								})
							}
						}).error(function(response, status){
							Common.alert({
								message: message+"客户认证信息失败！原因："+response.error,
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
}]);
