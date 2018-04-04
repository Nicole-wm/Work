maccoApp.controller('CommentDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	$scope.UserIds = [];
	var KeyNO = getQueryStringByKey('KeyNO');
	/*var url = window.$servie + 'AdminApi/Activity/FetchActivityWinUser';*/
	var url = window.$AppApiService + 'AdminApi/Activity/FetchActivityWinUser';
	var param = {
		ActivityKeyNo:KeyNO,
		Stype: 1
	};
	$http.post(url, param).success(function(data){
		if(data.IsSuccess) {
			$scope.UserId = data.Data[0].ID;
			$scope.Username = data.Data[0].NickName;
			$scope.Avatar = data.Data[0].Avatar;
			$scope.UID = data.Data[0].UID;
			for(i=0;i<data.Data.length;i++){
				$scope.UserIds[i]=data.Data[i];
			}
		}
	});

	$scope.ChooseUser=function(){
		$scope.canEdit=false;
		var param = {
			ActivityKeyNo:KeyNO,
			Stype: 1
		};
		$http.post(url, param).success(function(data){
			if(data.IsSuccess) {
				for(i=0;i<data.Data.length;i++){
					if(data.Data[i].ID==$scope.UserId){
						$scope.Username = data.Data[i].NickName;
						$scope.Avatar = data.Data[i].Avatar;
						$scope.UID = data.Data[i].UID;
					}
				}
			}
		});
	}

	$scope.Submit = function() {
		$("#mask").show();
		var ID = getQueryStringByKey("ID");
		var KeyNO = getQueryStringByKey("KeyNO");
		/*var url = window.$servie + 'AdminApi/Activity/CreateAwardActivity';*/
		var url = window.$AppApiService + 'AdminApi/Activity/CreateAwardActivity';
		var fields = {
			ActivityKeyNo:KeyNO,
			Comment:$scope.Content,
			UID:$scope.UID,
			apiKey : window.$apiKey
		};

		var AwardPic = $scope.AwardPic;

		var postCreateFunc = function(url,callback) {
			Upload.upload({
				url: url,
				fields:fields,
				file: AwardPic,
				fileFormDataName:'AwardPic'
			}).success(function (data, status, headers, config){
				callback(data);
			});
		};
		postCreateFunc(url,function(data) {
			if(data.IsSuccess) {
				if(data.Data.IsCreated) {
					$window.location.href = '/ActivityManagement/CommentManager.html?Token=' + $rootScope.Token+'&KeyNO='+KeyNO + '&ID=' + ID;
					$("#mask").hide();
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			} else {
				$window.alert('出错');
				$("#mask").hide();
			}
		});
	};
}]);
