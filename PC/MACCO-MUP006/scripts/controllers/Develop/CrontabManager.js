maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.Keyword = '';
    };

    var url = window.$servie + 'DeveloperTools/Crontab/FetchCrontab';

    var param = {
        PageSize: 10,
        LastID: 0,
        Keyword:''
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        if (this.Keyword != undefined) {
            param.Keyword = this.Keyword;
        } else {
            param.Keyword = '';
        }
        if(this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                var isType= items[i].Type;
                if(isType== "1") {
                    items[i].TypeText = "系统";
                }else{
                    items[i].TypeText = "应用";
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

maccoApp.controller('CrontabController', function ($scope,macco,$http,$window,$rootScope) {
    $scope.macco = new macco();
    var searchFn = function () {
        $scope.macco.after = '';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.Keyword = $scope.Keyword;
        $scope.$emit('list:search');
        $window.scroll(0, 10);
    };

    $scope.Search = searchFn;
    searchFn();

    $scope.AddNew = function () {
        var url = '/DeveToolManagement/CrontabDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID) {
        var url = '/DeveToolManagement/CrontabDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Visit = function (ID) {
        var url = '/DeveToolManagement/CrontabDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Delete = function (ID) {
        if ($window.confirm('确定要这样做吗？')) {
            var deleteUrl = window.$servie + 'DeveloperTools/Crontab/DeleteCrontab';
            var param = {
                CrontabID: ID,
                apiKey: window.$apiKey
            };

            $http.post(deleteUrl, param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsDeleted) {
                        $window.alert('删除成功');
                        $window.location.href = '/DeveToolManagement/CrontabManager.html?Token=' + $rootScope.Token;
                    } else {
                        $window.alert('出错');
                    }
                }
            });
        }
    };
});
