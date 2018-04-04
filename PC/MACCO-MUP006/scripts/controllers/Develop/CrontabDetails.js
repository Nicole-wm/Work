maccoApp.controller('CrontabDetailController', function ($scope,Upload,$http,$window,$rootScope) {
    var type = getQueryStringByKey('Type');
    var CrontabID = getQueryStringByKey("ID");
    $scope.stypes = [
    { ID: 1, Name: "系统"},
    { ID: 2, Name: "应用" }
    ];
    $scope.WebShowSubmit=true;
    $scope.WebFilePath=null;
    $scope.WebFilePath2 =null;
    
    var webUpload = function(){
        var webCancelTag = new $.CheckCancelFlag();

        $scope.WebCancelUpload=function(){
            $scope.Web = undefined;
            $scope.WebUploadProgress = "";
            webCancelTag.cancelFlag = 1;
        }
        $scope.WebConfirmUpload=function(){
            var url = window.$servie + "AdminApi/Fileapi/UploadFile";
            var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
            $.ConfirmUpload($scope.Web,url,getWebFilePath,create_url,webCancelTag);         
        }       
        var getWebFilePath = function(data,data2,succeed,shardCount){           
            if(data.Data.IsStop){
                $scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;
                $scope.WebFilePath2=data2.Data.TempPath+"/"+ data2.Data.RealName;       
                $scope.WebUploadProgress = "上传成功！";
                $scope.WebShowSubmit=false;
                $scope.WebUrl=true;
            }else{
                if(succeed!=-1){
                    $scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
                }else{
                    $scope.WebUploadProgress = "已取消上传";
                    $scope.Web=null;
                }
            }
            $scope.$apply();
        };
    }
    webUpload();

    if (type == 'Create') {
        $scope.OperationType = '(新增)';
        $scope.canEdit = true;
        $scope.NeedWeb = true;  
        var ServerUrl = window.$servie + 'DeveloperTools/Server/FetchServerName';
        var params = null;
        $http.post(ServerUrl, params).success(function (data) {
            if (data.IsSuccess) {
                $scope.Servers = data.Data;
            }
        });
        var ProjectUrl = window.$servie + 'DeveloperTools/Project/FetchProjectName';
        var params = null;
        $http.post(ProjectUrl, params).success(function (data) {
            if (data.IsSuccess) {
                $scope.Projects = data.Data;
            }
        });

        $scope.Submit = function () {
            $("#mask").show();
            if($scope.WebFilePath==null){
                alert("路径没有上传");
                $("#mask").hide();
                return false;
            }
            var url = window.$servie + 'DeveloperTools/Crontab/CreateCrontab';
            var fields = {
                UserName:$rootScope.AdminUserName,
                CrontabName: $scope.CrontabName,
                Command: $scope.Command,
                Description: $scope.Description,
                Type: $scope.SType,
                ServerID: $scope.ServerID,
                ProjectID: $scope.ProjectID,
                Path: $scope.WebFilePath,
                LogTableName: $scope.LogTableName
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
        $scope.NeedWeb = false;  
        var visitUrl =  window.$servie + 'DeveloperTools/Crontab/FetchCrontabDetil';

        $http.post(visitUrl,{CrontabID:CrontabID}).success(function(data){
            if(data.IsSuccess) {
                $scope.CrontabName = data.Data[0].CrontabName;
                $scope.Command = data.Data[0].Command;
                $scope.Description = data.Data[0].Description;
                $scope.SType = data.Data[0].Type*1;
                $scope.WebUrl = data.Data[0].Path;
                $scope.LogTableName = data.Data[0].LogTableName;
                var ServerUrl = window.$servie + 'DeveloperTools/Server/FetchServerName';
                var ProjectUrl = window.$servie + 'DeveloperTools/Project/FetchProjectName';
                var params = null;
                $http.post(ServerUrl, params).success(function (data1) {
                    if (data1.IsSuccess) {
                        $http.post(ProjectUrl, params).success(function (data2) {
                            if (data2.IsSuccess) {
                                $scope.Servers=data1.Data;
                                $scope.Projects=data2.Data;
                                $scope.ServerID = data.Data[0].ServerID;
                                $scope.ProjectID = data.Data[0].ProjectID;
                            }
                        });
                    }
                });
            }
        });
    }
    if (type == 'Update') {
        $scope.OperationType = '(编辑)';
        $scope.canEdit = true;
        $scope.NeedWeb = false;  
        var visitUrl =  window.$servie + 'DeveloperTools/Crontab/FetchCrontabDetil';

        $http.post(visitUrl,{CrontabID:CrontabID}).success(function(data){
            if(data.IsSuccess) {
                $scope.CrontabName = data.Data[0].CrontabName;
                $scope.Command = data.Data[0].Command;
                $scope.Description = data.Data[0].Description;
                $scope.SType = data.Data[0].Type*1;
                $scope.WebUrl = data.Data[0].Path;
                $scope.LogTableName = data.Data[0].LogTableName;
                var ServerUrl = window.$servie + 'DeveloperTools/Server/FetchServerName';
                var ProjectUrl = window.$servie + 'DeveloperTools/Project/FetchProjectName';
                var params = null;
                $http.post(ServerUrl, params).success(function (data1) {
                    if (data1.IsSuccess) {
                        $http.post(ProjectUrl, params).success(function (data2) {
                            if (data2.IsSuccess) {
                                $scope.Servers=data1.Data;
                                $scope.Projects=data2.Data;
                                $scope.ServerID = data.Data[0].ServerID;
                                $scope.ProjectID = data.Data[0].ProjectID;
                            }
                        });
                    }
                });
            }
        });

        $scope.Submit = function () {
            $("#mask").show();

            if($scope.WebUrl==null){
                alert("路径没有上传");
                $("#mask").hide();
                return false;
            }

            var url = window.$servie + 'DeveloperTools/Crontab/UpdateCrontab';
            var fields = {
                CrontabID:CrontabID,
                CrontabName: $scope.CrontabName,
                Command: $scope.Command,
                Description: $scope.Description,
                Type: $scope.SType,
                ServerID: $scope.ServerID,
                ProjectID: $scope.ProjectID,
                Path: $scope.WebFilePath,
                LogTableName: $scope.LogTableName
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
        $window.location.href = '/DeveToolManagement/CrontabManager.html?Token=' + $rootScope.Token;
    };
});
