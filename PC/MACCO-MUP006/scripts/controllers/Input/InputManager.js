maccoApp.controller('InputController', function ($scope, $http, Upload, $window, $rootScope) {
    $scope.stypes = [
		{ ID: 1, Name: "活动" },
		{ ID: 2, Name: "横幅" },
		{ ID: 3, Name: "品牌" },
		// { ID: 4, Name: "品牌关联产品" },
		{ ID: 4, Name: "资讯" },
        { ID: 5, Name: "产品" },
		{ ID: 6, Name: "TopProduct" },
		{ ID: 7, Name: "上妆" },
        { ID: 8, Name: "妆容封面" }
	];
    
    $scope.showList = function () {    
        var url = window.$servie + 'AdminApi/Input/FetchInputList';
        var param = {
            StartTime: $scope.StartTime,
            EndTime: $scope.TerminalTime,
            ID: $scope.UserName,
            SType: 0
        };
        
        if ($scope.SType != undefined && $scope.SType != '') {
			param.SType = $scope.SType;
		} else {
			param.SType = 0;
		}

        $http.post(url, param).success(function (data) {
            console.log(param);
            if (data.IsSuccess) {
                $scope.items = data.Data;
            }
        });
    };

    var adminListUrl = window.$servie + 'AdminApi/Input/FetchAdminName';
    $http.post(adminListUrl, null).success(function (data) {
        if (data.IsSuccess) {
            $scope.admins = data.Data;
        }
    });

    $scope.ReturnBack = function (token) {
        $window.location.href = '/InputManagement/InputManager.html?Token=' + $rootScope.Token;
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
