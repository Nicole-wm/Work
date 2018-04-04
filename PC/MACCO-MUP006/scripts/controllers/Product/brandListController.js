maccoApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.SType = '';
	};

	var url = window.$servie + 'AdminApi/Product/FetchBrandList';
	var param = {
		PageSize: 10,
		LastID: 0
	};

	macco.prototype.nextPage = function () {
		if (this.SType != undefined && this.SType != '') {
			param.SType = this.SType;
		} else {
			param.SType = 0;
		}
		this.busy = true;

		param.LastID = this.after;
		param.Keyword = this.Keyword;
		$http.post(url, param).success(function (data) {
			console.log(data);
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				var ispublish = items[i].IsPublish;
				if (ispublish == "1") {
					items[i].IsPublishText = "是";
					items[i].IsPublishFlag = 1;
				} else if (ispublish == "0") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
				} else {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
				}
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}
				var ishasStoryConnect = items[i].HasStory;
				if (ishasStoryConnect == "1") {
					items[i].hasStoryConnect = true;
				} else {
					items[i].hasStoryConnect = false;
				}
				this.items.push(items[i]);
			}
			if (this.items.length != 0) {
				this.after = this.items[this.items.length - 1].ID;
			}
			this.busy = false;
		}.bind(this));
		this.busy = false;
	};
	return macco;
});

maccoApp.controller('brandListController', function ($scope, $http, macco, $window, $rootScope) {
	$scope.macco = new macco();
	$scope.stypes = [
	{ ID: 0, Name: "全部不包括删除" },
	{ ID: 1, Name: "已发布不含已删除" },
	{ ID: 2, Name: "未发布不含已删除" },
	{ ID: 3, Name: "删除但未发布" },
	{ ID: 4, Name: "删除已发布" }
	];

	$scope.Search = function () {
		$scope.macco.after = '';
		$scope.macco.items = [];
		$scope.macco.busy = false;
		$scope.macco.Keyword = $scope.Keyword;
		$scope.macco.SType = $scope.SType;
		$scope.$emit('list:search');
		$window.scroll(0, 10);
	};

	$scope.AddNew = function (token) {
		var url = '/ProductManagement/brandDetails.html?Token=' + token + '&Type=Create';
		$window.location.href = url;
	};

	$scope.Update = function (ID, token) {
		var url = '/ProductManagement/brandDetails.html?Token=' + token + '&Type=Update&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Visit = function (ID, token) {
		var url = '/ProductManagement/brandDetails.html?Token=' + token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Delete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会删除品牌，此品牌以下所有产品将会被隐藏，确定要这样做吗？')) {
				var deleteUrl = window.$servie + 'AdminApi/Product/DeleteBrand';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/Product/DeleteBrand';
				var param = {
					BrandKeyNo: ID,
					apiKey: window.$apiKey
				};

				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (result) {
									if (result.IsSuccess) {
										if (result.Data.IsDeleted) {
											$window.alert('删除成功');
											$scope.ReturnBack();
										}
									}
								});
							} else {
								$window.alert('删除成功');
								$scope.ReturnBack();
							}
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.Publish = function (brandID) {
		if ($rootScope.Operating) {
			if ($window.confirm("数据将被发布到外网，确定吗？")) {
				var publishUrl = window.$servie + 'AdminApi/Product/PublishBrand';
				var production_publishUrl = window.$ProductionService + 'AdminApi/Product/PublishBrand';
				var param = {
					BrandKeyNo: brandID,
					apiKey: window.$apiKey
				};
				$http.post(publishUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							if (!window.$isTest) {
								$http.post(production_publishUrl, param).success(function (result) {
									if (result.IsSuccess) {
										if (result.Data.IsPublished) {
											$window.alert('发布成功');
											$scope.ReturnBack();
										}
									}
								});
							} else {
								$window.alert('发布成功');
								$scope.ReturnBack();
							}
						}
					}
				});
			}
		} else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
	};

	$scope.Connect = function (ID, KeyNo, IsPublish, token) {
		if (IsPublish == 1) {
			var url = '/ProductManagement/connectProduct.html?Token=' + token + '&Type=Connect&ID=' + ID + '&KeyNo=' + KeyNo;
			$window.location.href = url;
		} else {
			$window.alert('该品牌没有发布，请先发布！');
		}
	};

	$scope.ReturnBack = function(token) {
		$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
	};
}); 