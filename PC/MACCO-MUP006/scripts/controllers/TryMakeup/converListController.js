maccoApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.SType = 0;
	};

	var url = window.$servie + 'AdminApi/TryMakeup/FetchTryMakeupCategoryList';
	var param = {
		PageSize: 10,
		LastID: 0,
	};



	macco.prototype.nextPage = function () {
		if (this.SType != undefined && this.SType != '') {
			param.SType = this.SType;
		} else {
			param.SType = 0;
		}
		this.busy = true;
		param.LastID = this.after;
		$http.post(url, param).success(function (data) {
			console.log(data);
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);
				var ispublish = items[i].IsPublish;
				if (ispublish == "0") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
                    items[i].IsTimePublishFlag = 0;
				} else if (ispublish == "1") {
					items[i].IsPublishText = "是";
					items[i].IsPublishFlag = 1;
                    items[i].IsTimePublishFlag = 1;
				} else if (ispublish == "2") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
                    items[i].IsTimePublishFlag = 0;
				}else if (ispublish == "3") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
                    items[i].IsTimePublishFlag = 0;
				}else if (ispublish == "4") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 1;
                    items[i].IsTimePublishFlag = 0;
				}
              
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}
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

maccoApp.controller('converListController', function ($scope, $http, macco, $window, $rootScope) {
	$scope.stypes = [
		{ ID: 0, Name: "全部不包括删除" },
		{ ID: 1, Name: "已发布不含已删除" },
		{ ID: 2, Name: "未发布不含已删除" },
		{ ID: 3, Name: "删除但未发布" },
		{ ID: 4, Name: "删除已发布" }
	];

	$scope.macco = new macco();
	var Search = function () {
		$scope.macco.items = [];
        $scope.macco.busy = false;
		$scope.macco.after = '';
		$scope.macco.SType = $scope.SType;
		$scope.$emit('list:search');
		$window.scroll(0, 10);
	};

	$scope.Search = Search;
	Search();

	$scope.AddNew = function () {
		var url = '/MakeupManage/coverDetails.html?Token=' + $rootScope.Token + '&Type=Create';
		$window.location.href = url;
    };

    $scope.Update = function (ID,IsPublish, KeyNo) {
        if(IsPublish==4){
            $window.alert("请先取消定时发布，再修改信息！");
        }else{		
            var url = '/MakeupManage/coverDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID + '&CategoryKeyNo=' + KeyNo;
	        $window.location.href = url;
        }
    };

    $scope.Visit = function (ID) {
		var url = '/MakeupManage/coverDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
    };

    $scope.Delete = function (KeyNo) {
    	if ($rootScope.Operating) {
			if ($window.confirm('确定要删除吗')) {
                var url = window.$servie + 'AdminApi/TryMakeup/DeteleTryMakeupCategory';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/TryMakeup/DeteleTryMakeupCategory';
				var param = {
					CategoryKeyNo: KeyNo,
					apiKey: window.$apiKey
				};

				$http.post(url, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsDeleted) {
											$window.alert('删除成功');
											Search();
										}
									}
								});
							} else {
								$window.alert('删除成功');
								Search();
							}
						}
					}
				});
			}
		} else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };


	$scope.Publish = function (KeyNo) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定要发布吗')) {

				var url = window.$servie + 'AdminApi/TryMakeup/PublishTryMakeupCategory';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/TryMakeup/PublishTryMakeupCategory';
				var param = {
					CategoryKeyNo: KeyNo,
					apiKey: window.$apiKey
				};
				$http.post(url, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublish) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsPublish) {
											$window.alert('发布成功');
											Search();
										}
									}
								});
							} else {
								$window.alert('发布成功');
								Search();
							}
						}
					}
				});
			}
		} else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
	};
    
    
    $scope.TimePublish = function (ID,token) {
        var url = '/MakeupManage/coverTimePublishDetails.html?Token=' + token + '&ID=' + ID;
		$window.location.href = url;
	}
});