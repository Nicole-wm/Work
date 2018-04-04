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
				KeyNO : KeyNO,
				NickName : $scope.Username,
				Comment : $scope.Content,
				CreateTime : $scope.Time
			};
			var Avatar = $scope.Banner;
			var url = window.$AppApiService + 'AdminApi/Information/CommentInformation';
	
			if (!window.$isTest) {
				Upload.upload({
					url: url,
					fields:fields,
					file: Avatar,
					fileFormDataName:'Avatar'
				}).success(function (data, status, headers, config){
					if(data.IsSuccess) {
						$window.location.href = '/InformationManage/CommentManager.html?Token=' + $rootScope.Token+'&KeyNo='+KeyNO;
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
		}else{
			var url = window.$AppApiService + 'AdminApi/Information/CommentInformation';
			$http.post(url,{
				KeyNO : KeyNO,
				Comment : $scope.Content,
				CreateTime : $scope.Time,
				UID:$scope.UID
			}).success(function(data) {
				if(data.IsSuccess) {
					$window.location.href = '/InformationManage/CommentManager.html?Token=' + $rootScope.Token+'&KeyNo='+KeyNO;
					$("#mask").hide();
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			})
		}					
	};

}]);
