maccoApp.factory('macco', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.Keyword = '';
        this.Stype = 0;
        this.Role='';
        this.State = '';
        this.OperatingSystem='';
    };

    var url = window.$servie + 'DeveloperTools/Server/FetchServer';

    var param = {
        PageSize: 10,
        LastID: 0,
        Keyword:'',
        Stype:0,
        Role:'',
        State:'',
        OperatingSystem:''
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        if (this.Keyword != undefined) {
            param.Keyword = this.Keyword;
        } else {
            param.Keyword = '';
        }
        if (this.Stype != undefined && this.Stype != '') {
            param.Stype = this.Stype;
        } else {
            param.Stype = 0;
        }
        if (this.Role != undefined && this.Role != '') {
            param.Role = this.Role;
        } else {
            param.Role = '';
        }
        if (this.State != undefined && this.State != '') {
            param.State = this.State;
        } else {
            param.State = '';
        }
        if (this.OperatingSystem != undefined && this.OperatingSystem != '') {
            param.OperatingSystem = this.OperatingSystem;
        } else {
            param.OperatingSystem = '';
        }
        if(this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                var isType= items[i].Type;
                if(isType== "1") {
                    items[i].TypeText = "PhysicalServer";
                }else if(isType== "2") {
                    items[i].TypeText = "Docker";
                }else{
                    items[i].TypeText = "KVM";
                }
                var isRole = items[i].Role;
                if(isRole == "1") {
                    items[i].RoleText = "Api";
                }else{
                    items[i].RoleText = "Web";
                }
                var isState = items[i].State;
                if(isState == "1") {
                    items[i].StateText = "Power off";
                }else if(isState == "2") {
                    items[i].StateText = "Running";
                }else if(isState == "3") {
                    items[i].StateText = "Building";
                }else{
                    items[i].StateText = "Failed";
                }  
                var isOperatingSystem = items[i].OperatingSystem;
                if(isOperatingSystem == "1") {
                    items[i].OperatingSystemText = "Centos";
                }else{
                    items[i].OperatingSystemText = "Windows";
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

maccoApp.controller('ServerController', function ($scope,macco,$http,$window,$rootScope) {
    $scope.macco = new macco();
    $scope.stypes = [
    { ID: 1, Name: "PhysicalServer"},
    { ID: 2, Name: "Docker" },
    { ID: 3, Name: "KVM" }
    ];
    $scope.roles = [
    { ID: 1, Name: "Api"},
    { ID: 2, Name: "Web"}
    ];
    $scope.states = [
    { ID: 1, Name: "Power off"},
    { ID: 2, Name: "Running" },
    { ID: 3, Name: "Building"},
    { ID: 4, Name: "Failed" }
    ];
    $scope.operatingsystems = [
    { ID: 1, Name: "Centos"},
    { ID: 2, Name: "Windows" }
    ];

    var searchFn = function () {
        $scope.macco.after = '';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.Keyword = $scope.Keyword;
        $scope.macco.Stype = $scope.SType;
        $scope.macco.Role = $scope.SelectRole;
        $scope.macco.State = $scope.State;
        $scope.macco.OperatingSystem = $scope.OperatingSystem;
        $scope.$emit('list:search');
        $window.scroll(0, 10);
    };

    $scope.Search = searchFn;
    searchFn();

    $scope.AddNew = function () {
        var url = '/DeveToolManagement/ServerDetails.html?Token=' + $rootScope.Token + '&Type=Create';
        $window.location.href = url;
    };

    $scope.Update = function (ID) {
        var url = '/DeveToolManagement/ServerDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Visit = function (ID) {
        var url = '/DeveToolManagement/ServerDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
        $window.location.href = url;
    };

    $scope.Delete = function (ID) {
        if ($window.confirm('确定要这样做吗？')) {
            var deleteUrl = window.$servie + 'DeveloperTools/Server/DeleteServer';
            var param = {
                ServerID: ID,
                apiKey: window.$apiKey
            };

            $http.post(deleteUrl, param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsDeleted) {
                        $window.alert('删除成功');
                        $window.location.href = '/DeveToolManagement/ServerManager.html?Token=' + $rootScope.Token;
                    } else {
                        $window.alert('出错');
                    }
                }
            });
        }
    };
});
