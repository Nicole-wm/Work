maccoApp.factory('macco', function ($http, $window) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.CategoryID = '';
		this.BrandID = '';
		this.SType = '';
	};

	var productSearchUrl = window.$servie + 'AdminApi/Product/SearchProduct';
	var param = {
		PageSize: 10,
		LastID: 0
	};

	macco.prototype.nextPage = function () {
		this.busy = true;

		if (this.SType != undefined && this.SType != '') {
			param.Stype = this.SType;
		} else {
			param.Stype = 0;
		}

		if (this.CategoryID != undefined && this.CategoryID != '') {
			param.CategoryID = this.CategoryID;
		}

		if (this.BrandID != undefined && this.BrandID != '') {
			param.BrandID = this.BrandID;
		}

		if (this.Keyword != undefined) {
			param.Keyword = this.Keyword;
		} else {
			param.Keyword = '';
		}

		if (this.after != undefined && this.after != '') {
			param.LastID = this.after;
		}

		$http.post(productSearchUrl, param).success(function (data) {
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

maccoApp.controller('productListController', ['$scope', '$window', '$http', 'macco', '$rootScope', function ($scope, $window, $http, macco, $rootScope) {
	$scope.macco = new macco();
	$scope.stypes = [
	{ ID: 0, Name: "全部不包括删除" },
	{ ID: 1, Name: "已发布" },
	{ ID: 2, Name: "未发布" },
	{ ID: 3, Name: "删除但未发布" },
	{ ID: 4, Name: "删除已发布" }
	];

	$scope.Search = function () {
		$scope.macco.items = [];
		$scope.macco.busy = false;
		$scope.macco.after = '';
		$scope.macco.CategoryID = $scope.SelectedCategoy;
		$scope.macco.BrandID = $scope.SelectBrand;
		$scope.macco.Keyword = $scope.Keyword;
		$scope.macco.SType = $scope.SType;
		$scope.$emit('list:search');
		$window.scroll(0, 10);

	};

	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';

	$http.get(categoryUrl).success(function (data) {
		if (data.IsSuccess) {
			$scope.Categories = data.Data;
		}
	});

	var brandListUrl = window.$servie + 'AdminApi/Product/FetchBrand';
	$http.post(brandListUrl, null).success(function (data) {
		if (data.IsSuccess) {
			$scope.Brands = data.Data;
		}
	});

	$scope.AddNew = function (token) {
		var url = '/ProductManagement/productDetail.html?Token=' + token + '&Type=Create';
		$window.location.href = url;
	};

	$scope.Update = function (ID, token) {
		var url = '/ProductManagement/productDetail.html?Token=' + token + '&Type=Update&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Visit = function (ID, token) {
		var url = '/ProductManagement/productDetail.html?Token=' + token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Delete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会删除产品,确认吗')) {
				var deleteUrl = window.$servie + 'AdminApi/Product/DeleteProduct';
				var productionDeleteUrl = window.$ProductionService + 'AdminApi/Product/DeleteProduct';
				var param = {
					ProductKeyNo: ID,
					apiKey: window.apiKey
				};
				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(productionDeleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsDeleted) {
											$window.alert('删除成功');
											$scope.ReturnBack();
										}
									} else {
										$window.alert('删除失败');
									}
								});
							} else {
								$window.alert('删除成功');
								$scope.ReturnBack();
							}
						} else {
							$window.alert('删除失败');
						}
					} else {
						$window.alert('删除失败');
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.Publish = function (keyno, BrandIsPublish) {
		console.log(BrandIsPublish);
		if ($rootScope.Operating) {
			if (BrandIsPublish == 1) {
				if ($window.confirm('将会发布该产品到外网,确认吗')) {
					var deleteUrl = window.$servie + 'AdminApi/Product/PublishProduct';
					var productionDeleteUrl = window.$ProductionService + 'AdminApi/Product/PublishProduct';
					var param = {
						ProductKeyNo: keyno,
						apiKey: window.apiKey
					};
					$http.post(deleteUrl, param).success(function (data) {
						if (data.IsSuccess) {
							if (data.Data.IsPublish) {
								if (!window.$isTest) {
									$http.post(productionDeleteUrl, param).success(function (ret) {
										if (ret.IsSuccess) {
											if (ret.Data.IsPublish) {
												$window.alert('发布成功');
												$scope.ReturnBack();
											}
										} else {
											$window.alert('发布失败');
										}
									});
								} else {
									$window.alert('发布成功');
									$scope.ReturnBack();
								}
							} else {
								$window.alert('发布失败');
							}
						} else {
							$window.alert('发布失败');
						}
					});
				}
			} else {
				$window.alert('该产品对应品牌没有发布，请先发布对应品牌！');
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}

	}

	$scope.EditComment = function (keyno, token) {
		var url = '/ProductManagement/CommentManager.html?Token=' + token + '&KeyNo=' + keyno;
		$window.location.href = url;
	};

	$scope.Tag = function (keyno,id,token) {
		var url = '/ProductManagement/TagManager.html?Token=' + token + '&KeyNo=' + keyno + '&ID=' + id;
		$window.location.href = url;
	};

	$scope.ReturnBack = function(token) {
		$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
	};
	
}]);