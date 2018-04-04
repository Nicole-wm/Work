maccoApp.controller('AddUserController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	$scope.Submit = function() {
		$("#mask").show();
		var url = window.$servie + "AdminApi/User/CreateSystemUser";
		var create_url = window.$AppApiService + 'AdminApi/User/CreateSystemUser';
		var fields = {
			NickName:$scope.Username,
			apiKey : window.$apiKey
		};

		var Avatar = $scope.Banner;

		var postCreateFunc = function(url,callback) {
			Upload.upload({
				url: url,
				fields:fields,
				file: Avatar,
				fileFormDataName:'Avatar'
			}).success(function (data, status, headers, config){
				callback(data);
			});
		};

		postCreateFunc(url,function(data) {
			if(data.IsSuccess) {
				if(data.Data.IsCreated) {
					postCreateFunc(create_url,function(data) {
						if(data.IsSuccess) {
							if(data.Data.IsCreated) {
								$window.location.href = '/AppUserManagement/AppUserManager.html?Token=' + $rootScope.Token;
								$("#mask").hide();
							} else {
								$window.alert('用户已存在');
								$("#mask").hide();
							}
						} else {
							$window.alert('出错');
							$("#mask").hide();
						}
					});
				} else {
					$window.alert('用户已存在');
					$("#mask").hide();
				}
			} else {
				$window.alert('出错');
				$("#mask").hide();
			}
		});

	};
}]);
