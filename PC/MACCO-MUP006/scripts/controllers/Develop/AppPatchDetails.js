maccoApp.controller('ProjectDetailController', function ($scope,Upload,$http,$window,$rootScope) {
    var type = getQueryStringByKey('Type');
    var ProjectID = getQueryStringByKey("ID");
    $scope.PatchFile="";
    $scope.PatchFileName="";
    $scope.AddPatchFile = function(){
        $("#PatchFile").click();
        $("#PatchFile").on("change",function(){
            var ObjFile = this.files[0];
            if(ObjFile){
                $scope.Url=ObjFile.name;
                $scope.PatchFile=ObjFile;
                $scope.$apply();
            }
        });
    };

    if (type == 'Create') {
        $scope.OperationType = '(新增)';
        $scope.canEdit = true;
        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$AppApiService + 'AdminApi/Patch/CreatePatch';
            var fields = {
                Version: $scope.Version
            };

            var postCreateFunc = function (url, callback) {
                Upload.upload({
                    url: url,
                    fields:fields,
                    file:$scope.PatchFile,
                    fileFormDataName:'Url'
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
        var visitUrl =  window.$AppApiService + 'AdminApi/Patch/FetchPatchDetail';

        $http.post(visitUrl,{ID:ProjectID*1}).success(function(data){
            if(data.IsSuccess) {
                $scope.Version = data.Data[0].Version;
                $scope.Url = data.Data[0].Url;
            }
        });
    }
    if (type == 'Update') {
        $scope.OperationType = '(编辑)';
        $scope.canEdit = true;
        var visitUrl =  window.$AppApiService + 'AdminApi/Patch/FetchPatchDetail';

        $http.post(visitUrl,{ID:ProjectID*1}).success(function(data){
            if(data.IsSuccess) {
                $scope.Version = data.Data[0].Version;
                $scope.Url = data.Data[0].Url
            }
        });

        $scope.Submit = function () {
            $("#mask").show();
            var url = window.$AppApiService + 'AdminApi/Patch/UpdatePatch';
            var fields = {
                ID:ProjectID*1,
                Version: $scope.Version
            };

            var postCreateFunc = function (url, callback) {
                Upload.upload({
                    url: url,
                    fields:fields,
                    file:$scope.PatchFile,
                    fileFormDataName:'Url'
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
        $window.location.href = '/DeveToolManagement/AppPatchManager.html?Token=' + $rootScope.Token;
    };
});
