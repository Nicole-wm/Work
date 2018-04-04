maccoApp.controller('ProjectDetailController', function ($scope,Upload,$http,$window,$rootScope) {
    var type = getQueryStringByKey('Type');
    var ProjectID = getQueryStringByKey("ID");

    if (type == 'Create') {
        $scope.OperationType = '(新增)';
        $scope.canEdit = true;
        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$servie + 'DeveloperTools/Project/CreateProject';
            var fields = {
                UserName:$rootScope.AdminUserName,
                ProjectName: $scope.ProjectName,
                SourceControl: $scope.SourceControl,
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
        var visitUrl =  window.$servie + 'DeveloperTools/Project/FetchProjectDetil';

        $http.post(visitUrl,{ProjectID:ProjectID}).success(function(data){
            if(data.IsSuccess) {
                $scope.ProjectName = data.Data[0].ProjectName;
                $scope.Description = data.Data[0].Description;
                $scope.SourceControl = data.Data[0].SourceControl;
            }
        });
    }
    if (type == 'Update') {
        $scope.OperationType = '(编辑)';
        $scope.canEdit = true;
        var visitUrl =  window.$servie + 'DeveloperTools/Project/FetchProjectDetil';

        $http.post(visitUrl,{ProjectID:ProjectID}).success(function(data){
            if(data.IsSuccess) {
                $scope.ProjectName = data.Data[0].ProjectName;
                $scope.Description = data.Data[0].Description;
                $scope.SourceControl = data.Data[0].SourceControl;
            }
        });

        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$servie + 'DeveloperTools/Project/UpdateProject';
            var fields = {
                ProjectID:ProjectID,
                ProjectName: $scope.ProjectName,
                SourceControl: $scope.SourceControl,
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
        $window.location.href = '/DeveToolManagement/ProjectManager.html?Token=' + $rootScope.Token;
    };
});
