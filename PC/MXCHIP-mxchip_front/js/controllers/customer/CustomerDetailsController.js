angular.module('FogApp').controller('CustomerDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/ 
	var ID = getQueryStringByKey('ID');
	var Page = getQueryStringByKey('Page');
	$scope.pageSize = 10;
	$scope.param = {
		'page':Page,
		'limit':$scope.pageSize
	}

	$scope.Sureparam = {
		'id':ID,
		'approve':''
	}

	/************************初始化数据************************/
	var GetListFun=function(){/*管理-列表*/
		var Url = $rootScope.settings.portsPath+'profile/mxchip/user/';
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
						$scope.username = CustomerDetails.user.username;
						$scope.email = CustomerDetails.user.email;
						$scope.date_joined = CustomerDetails.user.date_joined;
						$scope.last_login = CustomerDetails.user.last_login;
						$scope.phone = CustomerDetails.phone;
						$scope.about_me = CustomerDetails.about_me;
						$scope.headimage = CustomerDetails.headimage;
						$scope.birth_date = CustomerDetails.birth_date;
						$scope.location = CustomerDetails.location;
						$scope.company = CustomerDetails.company;
						if(CustomerDetails.user.is_active){
							$scope.isActiveText="有效";
						}else{
							$scope.isActiveText="无效";
						}$scope.isActiveText=""
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
		window.location.href = '#/customer/customer_list.html';
	}
}]);
