maccoApp.controller('BannerDetailController', ['$scope','$window','$http','$modal','Upload','$rootScope',function($scope, $window,$http,$modal,Upload,$rootScope) {
 	var checkUrl = window.$servie + 'AdminApi/Product/CheckTopBannerKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Product/CheckTopBannerKeyNo';
	$http.post(checkUrl).success(function(data){
		$http.post(checkUrl2).success(function(result){
			if(data.Data==result.Data){
			}else{
				$("#mask").show();
				alert("后台数据发生错误，无法添加，详情咨询管理员！");
				$scope.ReturnBack();
				$("#mask").hide();
			}
		});
	});
	var type = getQueryStringByKey('Type');

	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.NeedBanner = true;
		$scope.bannerlinkshow=false;
		
		$scope.Categories = [
		{ID:1,Name:"banner"},
		{ID:2,Name:"新品推荐左图"},
		{ID:3,Name:"新品推荐右上图"},
		{ID:4,Name:"新品推荐右下图"}			
		];

		$scope.Submit = function() {
			$("#mask").show();
			var url = window.$servie + 'AdminApi/Product/CreateTopBanner';
			var bannerlink_create_url = window.$ProductionService + 'AdminApi/Product/CreateTopBanner';
			var fields = {
				KeyNO: $scope.item.KeyNo,
				apiKey : window.$apiKey,
				UserName:$rootScope.AdminUserName,
				Type:$scope.SelectedCategoy  
			};

			var Banner = $scope.Banner;

			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: Banner,
					fileFormDataName:'Banner'
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(url,function(data) {
				if(data.IsSuccess) {
					if(data.Data.IsCreated) {
						postCreateFunc(bannerlink_create_url,function(result) {
							if(result.IsSuccess) {
								if(result.Data.IsCreated) {
									if (data.Data.KeyNo==result.Data.KeyNo) {
										$scope.ReturnBack();
										$("#mask").hide();
									}else{
										alert("后台添加数据发生错误，详情咨询管理员！");
										$scope.ReturnBack();
										$("#mask").hide();
									}
								} else {
									$window.alert('出错');
									$("#mask").hide();
								}
							} else {
								$window.alert('出错');
								$("#mask").hide();
							}
						});
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

	}
	
	$scope.AddNew = function() {	
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: '/ProductManagement/selectBannerLink.html',
			controller: "selectBannerLinkController",
			resolve: {
				items: function () {
					return $scope.selectedBannerLink;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.bannerlinkshow=true;
			$scope.item= selectedItem[0];
		}, function () {
		});
	};

	$scope.ReturnBack = function(token) {
		$window.location.href = '/ProductManagement/bannerList.html?Token=' + $rootScope.Token;
	};

}]);
