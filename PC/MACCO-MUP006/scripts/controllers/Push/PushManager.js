maccoApp.controller('PushController', function($scope,$http,Upload,$window,$rootScope,$modal) {
    var url = window.$ProductionService + 'AdminApi/TimePush/FetchTimePushList';
/*    var url = window.$servie + 'AdminApi/TimePush/FetchTimePushList';
*/
    $http.post(url).success(function (data) {
        if (data.IsSuccess) {
            $scope.items = data.Data.data.schedules;
            for(i=0;i<$scope.items.length;i++){
                $scope.items[i].KeyNo=data.Data.data.schedules[i].schedule_id;
                $scope.items[i].Time=data.Data.data.schedules[i].trigger.single.time;
                $scope.items[i].Content=data.Data.data.schedules[i].push.notification.alert;
                $scope.items[i].Comment=data.Data.data.schedules[i].push.platform;
            }
        }
    });

    $scope.Delete = function(KeyNo) {
        if ($rootScope.Operating) {
            $("#mask").show();
            if ($window.confirm('确定删除对应推送吗？')) {
/*                var deleteUrl = window.$servie + 'AdminApi/TimePush/DeleteTimePush';*/    
            var deleteUrl = window.$ProductionService + 'AdminApi/TimePush/DeleteTimePush';

                var param = {
                    ScheduleID:KeyNo,
                    apiKey: window.$apiKey
                };

                $http.post(deleteUrl, param).success(function (data) {
                    if (data.IsSuccess) {
                        if (data.Data.IsDeleted) {
                            $window.alert('删除成功');
                            $("#mask").hide();
                            $window.location.href = '/PushManagement/PushManager.html?Token=' + $rootScope.Token;
                        } else {
                            $window.alert('出错');
                            $("#mask").hide();
                        }
                    }
                });
            }
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };
}); 