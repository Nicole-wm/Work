maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.SType = '';
    };

    var url = window.$servie + 'AdminApi/Activity/FetchActivityList';

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
        $http.post(url, param).success(function (data) {
            console.log(data);
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                items[i].JoinCount=0;
                var RealDataUrl = window.$AppApiService + 'AdminApi/Activity/FetchActivityJoinDetail';

                var realparam = {
                    ActivityKeyNo:items[i].KeyNo
                };

                $.ajax({ 
                    type: "POST", 
                    url: RealDataUrl, 
                    data:realparam,
                    dataType: "json",
                    async:false,  
                    success: function (data) {
                        if(data.Data){
                            items[i].JoinCountReal=data.Data.JoinCount;
                        }else{
                            items[i].JoinCountReal=0;
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
            var ispush = items[i].IsPush;
            if (ispush == "1") {
                items[i].IsPushFlag = 1;
            } else {
                items[i].IsPushFlag = 0;
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

maccoApp.controller('ActiveListController', function ($scope, $http, macco, $window, $rootScope) {
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
        var url = '/ActivityManagement/ActivityDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID,IsPublish) {
        if(IsPublish==4){
            $window.alert("请先取消定时发布，再修改信息！");
        }else{
            var url = '/ActivityManagement/ActivityDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID;
            $window.location.href = url;
        }
    };

    $scope.Visit = function (ID) {
        var url = '/ActivityManagement/ActivityDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Delete = function (ID) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定要这样做吗？')) {
                var deleteUrl = window.$servie + 'AdminApi/Activity/DeleteActivity';
                var activity_deleteUrl = window.$ProductionService + 'AdminApi/Activity/DeleteActivity';
                var param = {
                    KeyNO: ID,
                    apiKey: window.$apiKey
                };

                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsDeleted) {
                            $http.post(activity_deleteUrl, param).success(function (result) {
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

    $scope.Publish = function (KeyNo,IsPublish) {
        if ($rootScope.Operating) {
            $scope.PublishText="";
            if (IsPublish == 0) {
                $scope.LikeShowFlag=KeyNo;
                $scope.SubmitPublishText=function(){
                    if ($window.confirm("数据将被发布到外网，确定吗？")) {
                        for(var i=0;i<$scope.macco.items.length;i++){
                            if($scope.macco.items[i].KeyNo==KeyNo){
                                $scope.PublishText=$scope.macco.items[i].PublishText;
                            }
                        }
                        PublishFun();
                    }else{
                        $scope.LikeShowFlag=0;
                    }
                }
            }else{
                if ($window.confirm("数据将被发布到外网，确定吗？")) {
                    PublishFun();
                }
            }
            function PublishFun(){
                $("#mask").show();
                var publishUrl = window.$servie + 'AdminApi/Activity/PublishActivity';
                var activity_publishUrl = window.$ProductionService + 'AdminApi/Activity/PublishActivity';
                var param = {
                    KeyNO: KeyNo,
                    PushContent:$scope.PublishText,
                    apiKey: window.$apiKey
                };

                var PushPublishInfoUrl = window.$ProductionService + 'AdminApi/Activity/PushActivity';
                var Pushparam= {
                    ActivityKeyNo: KeyNo,
                    PushContent:$scope.PublishText
                };

                $http.post(publishUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsPublished) {
                            $http.post(activity_publishUrl, param).success(function (result) {
                                if (result.IsSuccess) {
                                    if (result.Data.IsPublished) {
                                        if($scope.PublishText==""||$scope.PublishText==undefined){
                                            $window.alert('发布成功');
                                            $scope.ReturnBack ();
                                            $("#mask").hide();
                                        }else{
                                            $http.post(PushPublishInfoUrl,Pushparam).success(function (data) {
                                                if (data.IsSuccess) {
                                                    if (data.Data.IsPushed) {
                                                        $window.alert('发布并推送成功');
                                                        $scope.ReturnBack ();
                                                        $("#mask").hide();
                                                    }else{
                                                        $window.alert('发布成功、推送失败，详情请咨询超级管理员！');
                                                        $scope.ReturnBack ();
                                                        $("#mask").hide();
                                                    }
                                                }else{
                                                    $window.alert('发布成功、推送失败，详情请咨询超级管理员！');
                                                    scope.ReturnBack ();
                                                    $("#mask").hide();
                                                }
                                            });
                                        }
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
            var url = '/ActivityManagement/TimePublishDetails.html?Token=' + token + '&ID=' + ID ;
            $window.location.href = url;
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    }

    $scope.Push = function (KeyNO, token) {
        if ($rootScope.Operating) {
            var url = '/ActivityManagement/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ; 
            $window.location.href = url;
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    }

    $scope.Win = function (KeyNO,ID,token) {
        if ($rootScope.Operating) {
            var url = '/ActivityManagement/WinDetails.html?Token=' + token + '&KeyNO=' + KeyNO + '&ID=' + ID;
            $window.location.href = url;
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    }

    $scope.EditComment = function (KeyNO,ID, token) {
        var url = '/ActivityManagement/CommentManager.html?Token=' + token +'&KeyNO=' + KeyNO + '&ID=' + ID;
        $window.location.href = url;
    };

    $scope.ToHome = function (KeyNO,token) {
        if ($rootScope.Operating) {
            if ($window.confirm('确定推送到首页吗？')) {
                var ActiveKeyNO = KeyNO;
                var visitUrl =  window.$servie + 'AdminApi/Activity/RecommendActivity';
                var activity_visitUrl = window.$ProductionService + 'AdminApi/Activity/RecommendActivity';
                $http.post(visitUrl,{KeyNO:ActiveKeyNO}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRecommended){
                            $http.post(activity_visitUrl,{KeyNO:ActiveKeyNO}).success(function (result) {
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
                var ActiveKeyNO = KeyNO;
                var visitUrl =  window.$servie + 'AdminApi/Activity/RemoveRecommendActivity';
                var activity_visitUrl = window.$ProductionService + 'AdminApi/Activity/RemoveRecommendActivity';

                $http.post(visitUrl,{KeyNO:ActiveKeyNO}).success(function(data){
                    if(data.IsSuccess) {
                        if(data.Data.IsRemoveRecommended){
                            $http.post(activity_visitUrl,{KeyNO:ActiveKeyNO}).success(function (result) {
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

    $scope.ReturnBack = function(token) {
        $window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
    };

});
