maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.SType = '';
        this.Platform = '';
    };

    var url = window.$servie + 'AdminApi/Version/FetchVersionList';

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
        if (this.Platform != undefined && this.Platform != '') {
            param.Platform = this.Platform;
        } else {
            param.Platform ='';
        }

        this.busy = true;
        param.LastID = this.after;
        $http.post(url, param).success(function (data) {
            console.log(data);
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                var ispublish = items[i].IsPublish;
                if (ispublish == "0") {
                 items[i].IsPublishText = "否";
                 items[i].IsPublishFlag = 0;
             } else if (ispublish == "1") {
                 items[i].IsPublishText = "是";
                 items[i].IsPublishFlag = 1;
             } else if (ispublish == "2") {
                 items[i].IsPublishText = "否";
                 items[i].IsPublishFlag = 0;
             }else if (ispublish == "3") {
                 items[i].IsPublishText = "否";
                 items[i].IsPublishFlag = 0;
             }else if (ispublish == "4") {
                 items[i].IsPublishText = "否";
                 items[i].IsPublishFlag = 1;
             }
             var isdeleted = items[i].IsDeleted;
             if (isdeleted == "1") {
                 items[i].IsDeletedFlag = 1;
             } else {
                items[i].IsDeletedFlag = 0;
            }
            var isPlatform = items[i].Platform;
             if (isPlatform == "1") {
                 items[i].PlatformText = "Android";
             } else {
                items[i].PlatformText = "IOS";
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

maccoApp.controller('VersionListController', function ($scope, $http, macco, $window, $rootScope) {
    $scope.macco = new macco();

    $scope.stypes = [
    { ID: 0, Name: "全部不包括删除" },
    { ID: 1, Name: "已发布不含已删除" },
    { ID: 2, Name: "未发布不含已删除" },
    { ID: 3, Name: "删除但未发布" },
    { ID: 4, Name: "删除已发布" }
    ];

    $scope.Categories=[
    {ID:'0',Desc:"IOS"},
    {ID:'1',Desc:"Android"}
    ];

    var searchFn = function () {
        $scope.macco.after = '';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.SType = $scope.SType;
        $scope.macco.Platform = $scope.SelectedCategoy;
        $scope.$emit('list:search');
        $window.scroll(0, 10);
    };

    $scope.search = searchFn;
    searchFn();

    $scope.AddNew = function () {
        var url = '/VersionManagement/VersionDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID,IsPublish) {
        var url = '/VersionManagement/VersionDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Visit = function (ID) {
        var url = '/VersionManagement/VersionDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Delete = function (ID) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定要这样做吗？')) {
                var deleteUrl = window.$servie + 'AdminApi/Version/DeleteVersion';
                var activity_deleteUrl = window.$ProductionService + 'AdminApi/Version/DeleteVersion';
                var param = {
                    KeyNo: ID,
                    apiKey: window.$apiKey
                };

                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsDeleted) {
                            $http.post(activity_deleteUrl, param).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsDeleted) {
                                        $window.alert('删除成功');
                                        $scope.ReturnBack();
                                    } else {
                                        $window.alert('出错');
                                    }
                                } else {
                                    $window.alert('出错');
                                }
                            });
                        } else {
                            $window.alert('出错');
                        }
                    }
                });
            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };

    $scope.Publish = function (ID) {
        if ($rootScope.Operating) {
            if ($window.confirm("数据将被发布到外网，确定吗？")) {
                var publishUrl = window.$servie + 'AdminApi/Version/PublishVersion';
                var activity_publishUrl = window.$ProductionService + 'AdminApi/Version/PublishVersion';
                var param = {
                    KeyNo: ID,
                    apiKey: window.$apiKey
                };
                $http.post(publishUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsPublished) {
                            $http.post(activity_publishUrl, param).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsPublished) {
                                        $window.alert('发布成功');
                                        $scope.ReturnBack();
                                    } else {
                                        $window.alert('出错');
                                    }
                                }
                            });
                        } else {
                            $window.alert('出错');
                        }
                    } else {
                        $window.alert('出错');
                    }
                });


            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };

    $scope.ReturnBack = function(token) {
        $window.location.href = '/VersionManagement/VersionManager.html?Token=' + $rootScope.Token;
    };
});
