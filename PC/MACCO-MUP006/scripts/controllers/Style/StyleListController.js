maccoApp.factory('macco', function ($http, $window) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.CategoryID = '';
		this.SType = '';
	};

	var productSearchUrl = window.$servie + 'AdminApi/Style/SearchStyle';
	var param = {
		PageSize: 10,
		LastID: 0
	};

	macco.prototype.nextPage = function () {
		this.busy = true;

		if (this.SType != undefined && this.SType != '') {
			param.SType = this.SType;
		} else {
			param.SType = 0;
		}

		if (this.CategoryID != undefined && this.CategoryID != '') {
			param.CategoryID = this.CategoryID;
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
					items[i].IsStarPublishFlag=1;
				} else if (ispublish == "0") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsStarPublishFlag=0;
				} else if (ispublish == "2") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsStarPublishFlag=1;
				} else {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsStarPublishFlag=0;
				}
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}
				var isstar = items[i].IsPublic;
				if (isstar == "0") {
					items[i].IsStarText = "否";
					items[i].IsStarFlag = 0;
				} else{
					items[i].IsStarText = "是";
					items[i].IsStarFlag = 1;
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

maccoApp.controller('StyleListController', ['$scope', '$window', '$http', 'macco', '$rootScope', function ($scope, $window, $http, macco, $rootScope) {
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

	$scope.AddNew = function (token) {
		var url = '/StyleManager/StyleDetails.html?Token=' + token + '&Type=Create';
		$window.location.href = url;
	};

	$scope.Update = function (ID, token) {
		var url = '/StyleManager/StyleDetails.html?Token=' + token + '&Type=Update&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Visit = function (ID, token) {
		var url = '/StyleManager/StyleDetails.html?Token=' + token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Delete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会删除样式,确认吗')) {
				var deleteUrl = window.$servie + 'AdminApi/Style/DeleteStyle';
				var styleDeleteUrl = window.$ProductionService + 'AdminApi/Style/DeleteStyle';
				var param = {
					KeyNO: ID,
					apiKey: window.apiKey
				};
				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(styleDeleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsDeleted) {
											$window.alert('删除成功');
											$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
										}
									} else {
										$window.alert('删除失败');
									}
								});
							} else {
								$window.alert('删除成功');
								$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
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

	$scope.Publish = function (ID, token) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会发布该样式到外网,确认吗')) {
				var publishUrl = window.$servie + 'AdminApi/Style/PublishStyle';
				var stylePublishUrl = window.$ProductionService + 'AdminApi/Style/PublishStyle';
				var param = {
					KeyNO: ID,
					apiKey: window.apiKey
				};
				$http.post(publishUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							if (!window.$isTest) {
								$http.post(stylePublishUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsPublished) {
											$window.alert('发布成功');
											$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
										}
									} else {
										$window.alert('发布失败');
									}
								});
							} else {
								$window.alert('发布成功');
								$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
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
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	}

	$scope.ToStar = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定设为单品试妆吗？')) {
				var StyleKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Style/RecommendStyle';
				var style_visitUrl = window.$ProductionService + 'AdminApi/Style/RecommendStyle';

				$http.post(visitUrl,{StyleKeyNo:StyleKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRecommended){
							$http.post(style_visitUrl,{StyleKeyNo:StyleKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRecommended) {
										alert("设为单品试妆成功");
										$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
									} else {
										$window.alert('出错');
									}
								}
							});
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.RemoveStar = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定取消设为单品试妆？')) {
				var StyleKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Style/RemoveRecommendStyle';
				var style_visitUrl = window.$ProductionService + 'AdminApi/Style/RemoveRecommendStyle';

				$http.post(visitUrl,{StyleKeyNo:StyleKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRemoveRecommended){
							$http.post(style_visitUrl,{StyleKeyNo:StyleKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRemoveRecommended) {
										alert("取消设为单品试妆成功");
										$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
									} else {
										$window.alert('出错');
									}
								}
							});
						}
					}
				});
			}else{

			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
}]);