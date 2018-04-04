maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.DateTime = '';
    };

    var url = window.$AppApiService + 'MeiDeNi/MakeupEffectWall/FetchMakeupEffectWallForAdmin';

    var param = {
        PageSize: 16,
        LastID: 0
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        if (this.DateTime != undefined && this.DateTime != '') {
            param.DateTime = this.DateTime;
        } else {
            param.DateTime = '';
        }

        if (this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }else{
            param.LastID = 0;
        }
        
        console.log(param);
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                items[i].choiceflag=0;
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

maccoApp.controller('PhotoWallController', function ($scope, $http,macco, Upload, $window, $rootScope) {
    $scope.macco = new macco();

    var searchFn = function () {
        $scope.macco.after = '';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.DateTime = $scope.DateTime;
        $scope.$emit('list:search');
        $window.scroll(0,10);
    };

    $scope.btnsearch = searchFn;
    searchFn();

    $scope.Choice = function (thisID) {
        for(var i = 0;i<$scope.macco.items.length; i++){
            if($scope.macco.items[i].ID==thisID){
                if($scope.macco.items[i].choiceflag==0){ 
                    $scope.macco.items[i].choiceflag=1;
                }else{
                    $scope.macco.items[i].choiceflag=0;
                }
            }
        }
    };

    $scope.Delete = function () {
        var PhotoId= [];
        for(var i=0;i<$scope.macco.items.length;i++) {
            if($scope.macco.items[i].choiceflag==1){
                PhotoId.push($scope.macco.items[i].ID);
            }
        }
        var PhotoIdIdArr=PhotoId.join(',');
        if ($rootScope.Operating) {
            if ($window.confirm('确定删除？')) {
                var deleteUrl = window.$AppApiService + 'MeiDeNi/MakeupEffectWall/DeleteMakeupWallForAdmin';
                var param = {
                    MakeupEffectWallIDs: PhotoIdIdArr,
                    apiKey: window.$apiKey
                };

                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsDeleted) {
                            var count=0;
                            for(var i=0;i<$scope.macco.items.length;i++) {
                                if($scope.macco.items[i].choiceflag==1){
                                    $scope.macco.items.splice(i, 1);
                                    count++;
                                }
                            }
                            if(count==PhotoId.length){
                               $window.alert('删除成功');
                            }
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

});

$(function () {
    $('#Time').val("");
    var Time = 0;

    $('#Time').datetimepicker({
        minView: "month",
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        autoclose: true
    }).on('changeDate', function (ev) {
        Time = ev.date.valueOf();
    });

    //返回顶部
    $(".topbtn").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 0);
        return false;
    });
});