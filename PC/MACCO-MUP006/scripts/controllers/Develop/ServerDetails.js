maccoApp.controller('ServerDetailController', function ($scope,Upload,$http,$window,$rootScope) {
    var type = getQueryStringByKey('Type');
    var ServerID = getQueryStringByKey("ID");
    $scope.stypes = [
    { ID: 1, Name: "PhysicalServer"},
    { ID: 2, Name: "Docker" },
    { ID: 3, Name: "KVM" }
    ];
    $scope.roles = [
    { ID: 1, Name: "Api"},
    { ID: 2, Name: "Web" }
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
    $scope.accounts = [
    { ID: 1, Name: "1"}
    ];

    if (type == 'Create') {
        $scope.OperationType = '(新增)';
        $scope.canEdit = true;
        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$servie + 'DeveloperTools/Server/CreateServer';
            var fields = {
                UserName:$rootScope.AdminUserName,
                SerevrName: $scope.ServerName,
                Role: $scope.SelectRole,
                Type: $scope.SType,
                State: $scope.State,
                AccountID: $scope.Account,
                OperatingSystem: $scope.OperatingSystem,
                IPAdress: $scope.IPAdress,
                Configure: $scope.Configure,
                Description: $scope.Description
            };

            var postCreateFunc = function (url, callback) {
                Upload.upload({
                    url: url,
                    fields: fields,
                }).success(function (data, status, headers, config) {
                    callback(data);
                });
            };

            postCreateFunc(url, function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsCreated) {
                        $scope.ReturnBack();
                        $("#mask").hide();
                    } else {
                        $window.alert('出错');
                        $("#mask").hide();
                    }
                } else {
                    $window.alert('出错');
                    $("#mask").hide();
                }
            });
        };
    }
    if (type == 'Visit') {
        $scope.canEdit = false;
        var visitUrl =  window.$servie + 'DeveloperTools/Server/FetchServerDetil';

        $http.post(visitUrl,{ServerID:ServerID}).success(function(data){
            if(data.IsSuccess) {
                $scope.ServerName = data.Data[0].ServerName;
                $scope.SelectRole = data.Data[0].Role*1;
                $scope.SType = data.Data[0].Type*1;
                $scope.State = data.Data[0].State*1;
                $scope.Account = data.Data[0].AccountID*1;
                $scope.OperatingSystem = data.Data[0].OperatingSystem*1;
                $scope.IPAdress = data.Data[0].IPAdress;
                $scope.Configure = data.Data[0].Configure;
                $scope.Description = data.Data[0].Description;
            }
        });
    }
    if (type == 'Update') {
        $scope.OperationType = '(编辑)';
        $scope.canEdit = true;
        var visitUrl =  window.$servie + 'DeveloperTools/Server/FetchServerDetil';

        $http.post(visitUrl,{ServerID:ServerID}).success(function(data){
            if(data.IsSuccess) {
                $scope.ServerName = data.Data[0].ServerName;
                $scope.SelectRole = data.Data[0].Role*1;
                $scope.SType = data.Data[0].Type*1;
                $scope.State = data.Data[0].State*1;
                $scope.Account = data.Data[0].AccountID*1;
                $scope.OperatingSystem = data.Data[0].OperatingSystem*1;
                $scope.IPAdress = data.Data[0].IPAdress;
                $scope.Configure = data.Data[0].Configure;
                $scope.Description = data.Data[0].Description;
            }
        });

        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$servie + 'DeveloperTools/Server/UpdateServer';
            var fields = {
                ServerID:ServerID,
                UserName:$rootScope.AdminUserName,
                SerevrName: $scope.ServerName,
                Role: $scope.SelectRole,
                Type: $scope.SType,
                State: $scope.State,
                AccountID: $scope.Account,
                OperatingSystem: $scope.OperatingSystem,
                IPAdress: $scope.IPAdress,
                Configure: $scope.Configure,
                Description: $scope.Description
            };


            var postCreateFunc = function (url, callback) {
                Upload.upload({
                    url: url,
                    fields: fields,
                }).success(function (data, status, headers, config) {
                    callback(data);
                });
            };

            postCreateFunc(url, function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsUpdated) {
                        $scope.ReturnBack();
                        $("#mask").hide();
                    } else {
                        $window.alert('出错');
                        $("#mask").hide();
                    }
                } else {
                    $window.alert('出错');
                    $("#mask").hide();
                }
            });
        };

    }
    $scope.ReturnBack = function(token) {
        $window.location.href = '/DeveToolManagement/ServerManager.html?Token=' + $rootScope.Token;
    };
});
