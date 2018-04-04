maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.SType = '';
        this.Category = 1;
    };

    var url = window.$AppApiService + 'AdminApi/Showindex/FetchShowIndexList';

    var param = {
        PageSize: 10,
        LastID: 0,
        Category:1
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
                var isrecommended = items[i].IsRecommended;
                if (isrecommended == "1") {
                    items[i].IsRecommendedFlag = 1;
                } else {
                    items[i].IsRecommendedFlag = 0;
                }
                items[i].IsRecommendLikeFlag = items[i].IsRecommendLike*1;
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

maccoApp.controller('ShowListController', function ($scope, $http, macco, $window, $rootScope) {
    $scope.macco = new macco();

    $scope.Visit = function (ID) {
        var url = '/ShowAppManagement/ShowDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
        $window.open(url);
    };

    $scope.Delete = function (ID) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定要这样做吗？')) {
                var deleteUrl = window.$servie + 'AdminApi/Showindex/DeleteShowIndex';
                var activity_deleteUrl = window.$ProductionService + 'AdminApi/Showindex/DeleteShowIndex';
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

    $scope.ToHome = function (ID,token) {
        if ($rootScope.Operating) {
            $scope.LikeShowFlag=ID;
            var categoryUrl = window.$AppApiService + 'AdminApi/Showindex/FetchShowIndexTag';
            $http.post(categoryUrl,{ShowIndexID:ID}).success(function (data) {
                if (data.IsSuccess) {
                    $scope.Liketags = data.Data;
                }
            });
            $scope.SubmitLike=function(){
                if ($window.confirm('确定推荐到首页吗？')) {
                    for(var i=0;i<$scope.macco.items.length;i++){
                        if($scope.macco.items[i].ID==ID){
                           $scope.TagID=$scope.macco.items[i].TagID;
                       }
                    }
                    var param={
                        ID: ID,
                        TagID:$scope.TagID
                    };
                    var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RecommendShowIndex';
                    $http.post(visitUrl,param).success(function(data){
                        if(data.IsSuccess) {
                            if(data.Data.IsRecommended){
                                alert("推荐首页成功");
                                $scope.ReturnBack();
                            }else {
                                $window.alert('出错');
                            }
                        }else {
                            $window.alert('出错');
                        }
                    });
                }else{
                }
            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };

    $scope.RemoveHome = function (ID,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定取消推荐？')) {
                var ID = ID;
                var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RemoveRecommendShowIndex';
                $http.post(visitUrl,{ID:ID}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRemoveRecommended){
                            alert("取消推荐首页成功");
                            $scope.ReturnBack();
                        }else {
                            $window.alert('出错');
                        }
                    }else {
                        $window.alert('出错');
                    }
                });
            }else{

            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };
    
    $scope.ToLike = function (ID,token) {
        if ($rootScope.Operating) {
            $scope.LikeShowFlag=ID;
            var categoryUrl = window.$AppApiService + 'AdminApi/Showindex/FetchShowIndexTag';
            $http.post(categoryUrl,{ShowIndexID:ID}).success(function (data) {
                if (data.IsSuccess) {
                    $scope.Liketags = data.Data;
                }
            });
            $scope.SubmitLike=function(){
                if ($window.confirm('确定推荐到喜欢吗？')) {
                    for(var i=0;i<$scope.macco.items.length;i++){
                        if($scope.macco.items[i].ID==ID){
                           $scope.TagID=$scope.macco.items[i].TagID;
                       }
                    }
                    var param={
                        ID: ID,
                        TagID:$scope.TagID
                    };
                    var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RecommendShowIndexLike';
                    $http.post(visitUrl,param).success(function(data){
                        if(data.IsSuccess) {
                            if(data.Data.IsRecommended){
                                alert("推荐喜欢成功");
                                $scope.ReturnBack();
                            }else {
                                $window.alert('出错');
                            }
                        }else {
                            $window.alert('出错');
                        }
                    });
                }else{
                }
            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };

    $scope.RemoveLike = function (ID,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定取消喜欢？')) {
                var ID = ID;
                var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RemoveRecommendShowIndexLike';
                $http.post(visitUrl,{ID:ID}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRemoveRecommended){
                            alert("取消推荐喜欢成功");
                            $scope.ReturnBack();
                        }else {
                            $window.alert('出错');
                        }
                    }else {
                        $window.alert('出错');
                    }
                });
            }else{

            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };

    $scope.EditComment = function (KeyNo,ID,token) {
        var url = '/ShowAppManagement/CommentManager.html?Token=' + token + '&KeyNo=' + KeyNo+ '&ID=' + ID;
        $window.location.href = url;
    };

    $scope.ReturnBack = function() {
        $window.location.href = '/ShowAppManagement/ShowManager.html?Token=' + $rootScope.Token;
    };
});
