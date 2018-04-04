maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.StartTime='';
        this.EndTime='';
    };

    var url = window.$AppApiService  +  'AdminApi/User/SearchUserInfo';

    var param = {
        PageSize: 10,
        LastID:0
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        if (this.StartTime != undefined && this.StartTime != '') {
            param.StartTime = this.StartTime;
        }else{
            param.StartTime = "";
        }
        if (this.EndTime != undefined && this.EndTime != '') {
            param.EndTime = this.EndTime;
        }else{
            param.EndTime = "";
        }
        if (this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }
        $http.post(url, param).success(function (data) {
            var items = data.Data[0].UserInfo;
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
            }
            if (this.items.length != 0) {
                this.after = this.items[this.items.length - 1].UID;
            }
            this.busy = false;

        }.bind(this));
        this.busy = false;

    };
    return macco;
    

});

maccoApp.controller('AppUserController', function ($scope, $http, Upload, $window, $rootScope,$modal,macco) {
    $scope.macco = new macco();
    var searchFn = function () {
       $scope.macco.after = '';
       $scope.macco.items = [];
       $scope.macco.busy = false;
       $scope.macco.StartTime = $scope.StartTime,
       $scope.macco.EndTime = $scope.TerminalTime,
       $scope.$emit('list:search');
       $window.scroll(0, 10);
   };
   $scope.search = searchFn;
   searchFn(); 
   $scope.showList = function () {    
    searchFn(); 
    var url = window.$AppApiService + 'AdminApi/User/SearchUserInfo';
    var param = {
        StartTime: $scope.StartTime,
        EndTime: $scope.TerminalTime,
        PageSize: 10,
        LastID: 0
    };

    $http.post(url, param).success(function (data) {
        console.log(data);
        if (data.IsSuccess) {
            $scope.Sum=data.Data[0].Sum;
            $scope.LastDayCnt=data.Data[0].LastDayCnt;
            $scope.Cnt=data.Data[0].Cnt;
        }
    });
};
$scope.showList();
$scope.AddInput = function () {
    if ($rootScope.Operating) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/AppUserManagement/AddUser.html',
            controller: "AddUserController",
            resolve: {
                items: function () {
                    return $scope.selectedProduct;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selectedProduct = selectedItem;
            $scope.items.push(selectedItem[0]);
        }, function () {
        });
    } else {
        $window.alert('没有权限，详情请咨询超级管理员！');
    }

};

$scope.Delete = function (KeyNo) {
    if ($rootScope.Operating){
        if ($window.confirm('确定删除所选人员吗？')) {
            var deleteUrl = window.$servie + 'AdminApi/User/DeleteSystemUser ';
            var user_deleteUrl = window.$AppApiService + 'AdminApi/Role/DeleteRole';
            var param = {
                UserKeyNo:KeyNo,
                apiKey: window.$apiKey,
            };
            $http.post(deleteUrl, param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsDeleted) {
                        $http.post(user_deleteUrl, param).success(function (result) {
                            if (result.IsSuccess) {
                                if (result.Data.IsDeleted) {
                                    $window.location.href = '/AppUserManagement/AppUserManager.html?Token=' + $rootScope.Token;
                                    $window.alert('删除成功');
                                } else {
                                    $window.alert('出错');
                                }
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

$scope.ReturnBack = function (token) {
    $window.location.href = '/AppUserManagement/AppUserManager.html?Token=' + $rootScope.Token;
};

$(function () {
    $('#StartTime').val("");
    $('#TerminalTime').val("");
    var startTime = 0;
    var endTime = 0;

    $('#StartTime').datetimepicker({
        minView: "month",
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        autoclose: true
    }).on('changeDate', function (ev) {
        startTime = ev.date.valueOf();
        if (startTime && endTime && (startTime > endTime)) {
            alert("开始时间不能迟于结束时间！");
            $('#StartTime').val("");
        }
    });

    $('#TerminalTime').datetimepicker({
        minView: "month",
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        autoclose: true
    }).on('changeDate', function (ev) {
        endTime = ev.date.valueOf();
        if (startTime && endTime && (startTime > endTime)) {
            alert("结束时间不能早于开始时间！");
            $('#TerminalTime').val("");
        }
    });
});

});
