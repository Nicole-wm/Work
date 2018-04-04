maccoApp.controller('UserController', function ($scope,$http,Upload, $window, $rootScope) {
    console.log($rootScope);
    console.log($rootScope.Role);
    $scope.addroles = [
    { ID: 0, RoleName: "超级管理员" },
    { ID: 1, RoleName: "开发人员" },
    { ID: 2, RoleName: "编辑主管" },
    { ID: 3, RoleName: "普通编辑" },
    { ID: 4, RoleName: "来宾" }
    ];

    $scope.roles = [
    { ID: 0, RoleName: "超级管理员" },
    { ID: 1, RoleName: "开发人员" },
    { ID: 2, RoleName: "编辑主管" },
    { ID: 3, RoleName: "普通编辑" },
    { ID: 4, RoleName: "来宾" }
    ];

    $scope.showList = function () {    
        var url = window.$servie + 'AdminApi/Role/FetchRoleList';
        var param = {
            SType:-1,
        };

        if ($scope.SType==0) {
           param.SType = 0;
       }else if ($scope.SType != undefined && $scope.SType != '') {
           param.SType = $scope.SType;
       } else {
           param.SType = -1;
       }

       $http.post(url,param).success(function (data) {
        if (data.IsSuccess) {
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                switch(parseInt(items[i].Role)){
                    case 0:items[i].RoleName="超级管理员";break;
                    case 1:items[i].RoleName="开发人员";break;
                    case 2:items[i].RoleName="编辑主管";break;
                    case 3:items[i].RoleName="普通编辑";break;
                    default:items[i].RoleName="来宾";
                }
            }
            $scope.items=items;
        }
    });
   };

$scope.AddInput = function () {    
      if(parseInt($rootScope.Role) == 1){
           $scope.addroles = [
           { ID: 1, RoleName: "开发人员" },
           { ID: 2, RoleName: "编辑主管" },
           { ID: 3, RoleName: "普通编辑" },
           { ID: 4, RoleName: "来宾" }
           ];
      }else if(parseInt($rootScope.Role) == 2){
        $scope.addroles = [
        { ID: 2, RoleName: "编辑主管" },
        { ID: 3, RoleName: "普通编辑" },
        { ID: 4, RoleName: "来宾" }
        ];
    }else{
        $scope.addroles = [
        { ID: 0, RoleName: "超级管理员" },
        { ID: 1, RoleName: "开发人员" },
        { ID: 2, RoleName: "编辑主管" },
        { ID: 3, RoleName: "普通编辑" },
        { ID: 4, RoleName: "来宾" }
        ];
    }
    if ($rootScope.Operating) {
        $scope.addpeople = "";
        $scope.canadd = true;
        $scope.Sumbit = function () {
            $scope.canadd = false;
            var url = window.$servie + 'AdminApi/Role/CreateRole';
            var fields = {
                LoginUserName:$rootScope.AdminUserName,
                UserName: $scope.addpeople,
                Password: $scope.addpassword,
                SType:$scope.RoleID
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
                    if (data.Data.IsPass) {
                        $window.location.href = '/UserManagement/UserManager.html?Token=' + $rootScope.Token;
                    } else {
                        $window.alert('用户名已经存在');
                    }
                } else {
                    $window.alert('出错');
                }
            });
        };
        
    } else {
        $window.alert('没有权限，详情请咨询超级管理员！');
    }

};

$scope.Delete = function (ID,Role) {
 if ($rootScope.Operating&&(parseInt($rootScope.Role)<=parseInt(Role))){
    if ($window.confirm('确定删除所选人员吗？')) {
        var deleteUrl = window.$servie + 'AdminApi/Role/DeleteRole';
        var production_deleteUrl = window.$ProductionService + 'AdminApi/Role/DeleteRole';
        var param = {
            ID: ID,
            LoginUserName:$rootScope.AdminUserName,
            apiKey: window.$apiKey,
        };

        $http.post(deleteUrl, param).success(function (data) {
            if (data.IsSuccess) {
                if (data.Data.IsDeleted) {
                    $window.location.href = '/UserManagement/UserManager.html?Token=' + $rootScope.Token;
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
    $window.location.href = '/UserManagement/UserManager.html?Token=' + $rootScope.Token;
};

});
