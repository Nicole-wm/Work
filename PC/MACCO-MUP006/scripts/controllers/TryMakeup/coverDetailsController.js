maccoApp.controller('converDetailsController', ['$scope', '$window', '$http', 'Upload', '$rootScope', function ($scope, $window, $http, Upload, $rootScope) {
	var type = getQueryStringByKey('Type');
	if (type == 'Create') {
		$scope.OperationType = "新增";
		$scope.canEdit = true;
		$scope.NeedCategoryImage = true;
		$scope.Submit = function () {
			$("#mask").show();
			if ($scope.converDetail.$valid) {
				var url = window.$servie + 'AdminApi/TryMakeup/CreateMakeupCategoryList';
				var production_url = window.$ProductionService + 'AdminApi/TryMakeup/CreateMakeupCategoryList';
				var converImage = $scope.CoverImage;

				var postCreateFunc = function (addr, callback) {
					Upload.upload({
						url: addr,
						fields: { 'UserName':$rootScope.AdminUserName,'CategoryName': $scope.categoryName, 'apiKey': window.$apiKey },
						file: converImage,
						fileFormDataName: 'CategoryImage'
					}).success(function (data, status, headers, config) {
						callback(data);
					});
				}


				postCreateFunc(url, function (data) {
					if (data.IsSuccess) {
						if (!window.$isTest) {
							postCreateFunc(production_url, function (result) {
								if (result.IsSuccess) {                                                                            
									if (result.Data.IsCreated) {
										$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
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
						} else {
							$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
							$("#mask").hide();
						}
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				});
			}
		};
	}

	var categoryID = getQueryStringByKey('ID');
	if (type == 'Visit') {
		$scope.OperationType = "详情";
		$scope.canEdit = false;
		var visitUrl = window.$servie + 'AdminApi/TryMakeup/FetchMakeupCategoryDetail';
		var param = {
			CategoryID: categoryID
		};
		$http.post(visitUrl, param).success(function (data) {
			if (data.IsSuccess) {
				$scope.categoryName = data.Data.CategoryName;
				$scope.CoverImageUrl = data.Data.ImageUrl;
			}
		});
	}

	if (type == 'Update') {
		var CategoryKeyNo = getQueryStringByKey('CategoryKeyNo');
		console.log(CategoryKeyNo);
		$scope.OperationType = "编辑";
		$scope.canEdit = true;
		var visitUrl = window.$servie + 'AdminApi/TryMakeup/FetchMakeupCategoryDetail';
		var param = {
			CategoryID: categoryID,
		};
		$scope.NeedCategoryImage = false;
		$http.post(visitUrl, param).success(function (data) {
			if (data.IsSuccess) {
				$scope.categoryName = data.Data.CategoryName;
				$scope.CoverImageUrl = data.Data.ImageUrl;
			}
		});

		$scope.Submit = function () {
			$("#mask").show();
			if ($scope.converDetail.$valid) {
				var url = window.$servie + 'AdminApi/TryMakeup/UpdateMakeupCategoryList';
				var production_url = window.$ProductionService + 'AdminApi/TryMakeup/UpdateMakeupCategoryList';
				var converImage = $scope.CoverImage;

				var postUpdateFunc = function (addr, callback) {
					Upload.upload({
						url: addr,
						fields: { 'CategoryName': $scope.categoryName, 'CategoryKeyNo': CategoryKeyNo, 'apiKey': window.$apiKey },
						file: converImage,
						fileFormDataName: 'CategoryImage'
					}).success(function (data, status, headers, config) {
						callback(data);
					});
				}

				postUpdateFunc(url, function (data) {
					console.log(data);
					if (data.IsSuccess) {
						if (!window.$isTest) {
							postUpdateFunc(production_url, function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsUpdated) {
										$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
										$("#mask").hide();
									} else {
										$window.alert('出错');
										$("#mask").hide();
									}
								}
							});
						} else {
							$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
							$("#mask").hide();
						}
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				});
			}
		};
	}



	$scope.ReturnBack = function (token) {
		$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
	};
}]);