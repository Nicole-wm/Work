maccoApp.factory('macco', function ($http, $window) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.SType = '';
    };

    var TopUrl = window.$servie + 'AdminApi/TopProduct/FetchTopProductTopic';

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

        if (this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }

        $http.post(TopUrl, param).success(function (data) {
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
                var isrecommended = items[i].IsRecommended;
                if (isrecommended == "1") {
                    items[i].IsRecommendedFlag = 1;
                } else {
                    items[i].IsRecommendedFlag = 0;
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

maccoApp.controller('TopListController', ['$scope', '$window', '$http', 'macco', '$rootScope', function ($scope, $window, $http, macco, $rootScope) {
    $scope.macco = new macco();

    $scope.stypes = [
    { ID: 0, Name: "全部不包括删除" },
    { ID: 1, Name: "已发布不含已删除" },
    { ID: 2, Name: "未发布不含已删除" },
    { ID: 3, Name: "删除但未发布" },
    { ID: 4, Name: "删除已发布" }
    ];

    var searchFn = function () {
        $scope.macco.after = '';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.SType = $scope.SType;
        $scope.$emit('list:search');
        $window.scroll(0, 10);
    };

    $scope.search = searchFn;
    searchFn();

    $scope.AddNew = function () {
        var url = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID,KeyNo) {
        var url = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID +'&KeyNO=' + KeyNo;
        $window.location.href = url;
    };

    $scope.Visit = function (ID,KeyNo) {
        var url = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID +'&KeyNO=' + KeyNo;
        $window.location.href = url;
    };

    $scope.Delete = function (ID) {
        if ($rootScope.Operating) {
            if ($window.confirm('将会删除Top,确认吗')) {
                var deleteUrl = window.$servie + 'AdminApi/TopProduct/DeleteTopProduct';
                var productionDeleteUrl = window.$ProductionService + 'AdminApi/TopProduct/DeleteTopProduct';
                var param = {
                    KeyNO: ID,
                    apiKey: window.apiKey
                };

                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsDeleted) {
                            $http.post(productionDeleteUrl, param).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsDeleted) {
                                        $window.alert('删除成功');
                                        searchFn();
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
            if ($window.confirm('将会发布该Top到外网,确认吗')) {
                var deleteUrl = window.$servie + 'AdminApi/TopProduct/PublishTopProduct';
                var productionPublishUrl = window.$ProductionService + 'AdminApi/TopProduct/PublishTopProduct';
                var param = {
                    KeyNO: ID,
                    apiKey: window.apiKey
                };
                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsPublished) {
                            $http.post(productionPublishUrl, param).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsPublished) {
                                        $window.alert('发布成功');
                                        searchFn();
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


    $scope.ToHome = function (KeyNO,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定推送到首页吗？')) {
                var TopKeyNO = KeyNO;
                var visitUrl =  window.$servie + 'AdminApi/Topproduct/RecommendTopProduct';
                var top_visitUrl = window.$ProductionService + 'AdminApi/Topproduct/RecommendTopProduct';

                $http.post(visitUrl,{KeyNO:TopKeyNO}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRecommended){
                            $http.post(top_visitUrl,{KeyNO:TopKeyNO}).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsRecommended) {
                                        alert("推送首页成功");
                                        searchFn();
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

    $scope.RemoveHome = function (KeyNO,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定取消推送？')) {
                var TopKeyNO = KeyNO;
                var visitUrl =  window.$servie + 'AdminApi/Topproduct/RemoveRecommendTopProduct';
                var top_visitUrl = window.$ProductionService + 'AdminApi/Topproduct/RemoveRecommendTopProduct';

                $http.post(visitUrl,{KeyNO:TopKeyNO}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRemoveRecommended){
                            $http.post(top_visitUrl,{KeyNO:TopKeyNO}).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsRemoveRecommended) {
                                        alert("取消推送首页成功");
                                        searchFn();
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