maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.SType = '';
        this.Category = 0;
    };

    var url = window.$servie + 'AdminApi/Showindex/FetchShowIndexList';

    var param = {
        PageSize: 10,
        LastID: 0,
        Category:0
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
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                items[i].IsRecommendLikeFlag=0;
                var RealDataUrl = window.$AppApiService + 'AdminApi/Showindex/FetchEditorIsRecommendLike';
                var realparam = {
                    KeyNo:items[i].KeyNo
                };
                $.ajax({ 
                    type: "POST", 
                    url: RealDataUrl, 
                    data:realparam,
                    dataType: "json",
                    async:false,  
                    success: function (data) {
                        if(data.Data[0]){
                            items[i].IsRecommendLikeFlag=data.Data[0].IsRecommendLike*1;
                        }else{
                            items[i].IsRecommendLikeFlag=0;
                        }
                    }, 
                    error: function (XMLHttpRequest, textStatus, errorThrown) { 
                        alert(errorThrown); 
                    } 
                });

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
        var url = '/ShowManagement/ShowDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID,KeyNo,IsPublish) {
        if(IsPublish==4){
            $window.alert("请先取消定时发布，再修改信息！");
        }else{
            var url = '/ShowManagement/ShowDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID+ '&KeyNo=' + KeyNo;
            $window.open(url);
        }
    };

    $scope.Visit = function (ID) {
        var url = '/ShowManagement/ShowDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
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

    $scope.Publish = function (KeyNo) {
        if ($rootScope.Operating) {
            if ($window.confirm("数据将被发布到外网，确定吗？")) {
                var publishUrl = window.$servie + 'AdminApi/Showindex/PublishShowIndex';
                var show_publishUrl = window.$ProductionService + 'AdminApi/Showindex/PublishShowIndex';
                var param = {
                    KeyNo: KeyNo,
                    apiKey: window.$apiKey
                };
                $http.post(publishUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsPublished) {
                            $http.post(show_publishUrl, param).success(function (result) {
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

    $scope.TimePublish = function (ID, token) {
        if ($rootScope.Operating) {
            var url = '/ShowManagement/TimePublishDetails.html?Token=' + token + '&ID=' + ID ;
            $window.location.href = url;
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    }

/*    $scope.ToHome = function (ID,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定推荐到首页吗？')) {
                var ID = ID;
                var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RecommendShowIndex';
                $http.post(visitUrl,{ID:ID}).success(function(data){
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
    };*/
    $scope.ToLike = function (KeyNo,token) {
        if ($rootScope.Operating) {
            $scope.LikeShowFlag=KeyNo;
            var categoryUrl = window.$AppApiService + 'AdminApi/Showindex/FetchEditorShowIndexTag';
            $http.post(categoryUrl,{KeyNo:KeyNo}).success(function (data) {
                if (data.IsSuccess) {
                    $scope.Liketags = data.Data;
                }
            });
            $scope.SubmitLike=function(){
                if ($window.confirm('确定推荐到喜欢吗？')) {
                    for(var i=0;i<$scope.macco.items.length;i++){
                        if($scope.macco.items[i].KeyNo==KeyNo){
                           $scope.TagID=$scope.macco.items[i].TagID;
                       }
                    }
                    var param={
                        KeyNo: KeyNo,
                        TagID:$scope.TagID
                    };
                    var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RecommendEditorShowIndexLike';
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

    $scope.RemoveLike = function (KeyNo,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定取消喜欢？')) {
                var KeyNo = KeyNo;
                var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/RemoveRecommendEditorShowIndexLike';
                $http.post(visitUrl,{KeyNo:KeyNo}).success(function(data){
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
        var url = '/ShowManagement/CommentManager.html?Token=' + token + '&KeyNo=' + KeyNo+ '&ID=' + ID;
        $window.location.href = url;
    };

    $scope.ReturnBack = function() {
        $window.location.href = '/ShowManagement/ShowManager.html?Token=' + $rootScope.Token;
    };
});
