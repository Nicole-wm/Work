maccoApp.controller('CommentDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	$scope.ChooseUser=function(){
		$scope.canshow=true;
		$scope.canEdit=false;
		var url = window.$AppApiService + 'AdminApi/Systemuser/SelectSystemUser';
		var data = {};
		$http.post(url,data).success(function(data){
			if(data.IsSuccess) {
				$scope.Username = data.Data.UserName;
				$scope.Avatar = data.Data.Avatar;
				$scope.UID = data.Data.UID;
			}
		})
	}

	$scope.AddUser=function(){
		$scope.canshow=true;
		$scope.canEdit=true;
		$scope.Username = '';
		$scope.UID = undefined;
		$scope.Avatar = '';
	}

	$scope.Submit = function() {
		$("#mask").show();
		var KeyNO = getQueryStringByKey("KeyNo");
		if($scope.UID == null) {
			var fields = {
				KeyNo : KeyNO,
				UserName : $scope.Username,
				Comment : $scope.Content,
				Assess : $scope.Rank,
				CreateTime : $scope.Time
			};
			var Avatar = $scope.Banner;
			var url = window.$AppApiService + 'AdminApi/Product/CreateProductComment';
	
			if (!window.$isTest) {
				Upload.upload({
					url: url,
					fields:fields,
					file: Avatar,
					fileFormDataName:'Avatar'
				}).success(function (data, status, headers, config){
					if(data.IsSuccess) {
						$window.location.href = '/ProductManagement/CommentManager.html?Token=' + $rootScope.Token+'&KeyNo='+KeyNO;
						$("#mask").hide();
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				});			
			}else{
				$window.alert("外网不能新增用户");
				$("#mask").hide();
			}	
		} else {
			var url = window.$AppApiService + 'AdminApi/Product/CreateProductComment';
			$http.post(url,{
				KeyNo : KeyNO,
				Comment : $scope.Content,
				CreateTime : $scope.Time,
				Assess : $scope.Rank,
				UID:$scope.UID
			}).success(function(data) {
				if(data.IsSuccess) {
					$window.location.href = '/ProductManagement/CommentManager.html?Token=' + $rootScope.Token+'&KeyNo='+KeyNO;
					$("#mask").hide();
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			})
		}			
	};

}]);
