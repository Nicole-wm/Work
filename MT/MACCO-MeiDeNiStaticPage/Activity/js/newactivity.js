var phonecatApp = angular.module('maccoApp',['infinite-scroll'], function ($httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
var addPersonCount;
phonecatApp.factory('httpInterceptor', function ($q, $rootScope, $log) {
    var loadingCount = 0;
    return {
        request: function (config) {
            if (++loadingCount === 1) $rootScope.$broadcast('loading:progress');
            return config || $q.when(config);
        },

        response: function (response) {
            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            return response || $q.when(response);
        },

        responseError: function (response) {
            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            return $q.reject(response);
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
});


phonecatApp.controller('newactivityController', function ($scope, $http,macco, $location, $rootScope) {
    $scope.macco = new macco();
    var url = "http://" + window.hostname + '/MeiDeNi/Activity/FetchActivityDetail';
    var activityID = window.getQueryStringByKey('ID');
    var param = {
        ActivityID: activityID
    };

    var uid = window.getQueryStringByKey('UID');
    var share = window.getQueryStringByKey('share');
    if (share == 'no') {
        $scope.shareline1 = "分享本活动至";
        $scope.shareline2 = "微信朋友圈 新浪微博即送";
    } else {
        $scope.shareline1 = "下载美的你APP";
        $scope.shareline2 = "获取更多免费礼品";
    }

    var joinFn = function () {
        var platform = window.getQueryStringByKey('platform');
        var processType = $scope.type;
        var shouldLogin = $scope.shouldLogin;
        var objectID = $scope.ObjectID;

        if (platform == 'iOS') {
            var param = {
                'shouldLogin': shouldLogin,
                'type': processType,
                'objID': objectID
            };
            if (window.webkit) {
                window.webkit.messageHandlers.JoinActivity.postMessage(param);
            } else {
                window.location.href = "macco://JoinActivity/type=" + processType + '&shouldLogin=' + shouldLogin + '&objID=' + objectID;
            }
        } else if (platform == 'Android') {
            window.demo.joinActivity(processType, shouldLogin, objectID);
        } else {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
        }
    };
    
     $http.post(url, param).success(function (data) {
         console.log("data",data);
        if (data.IsSuccess) {
            $scope.WinUsers = data.Data.WinUsers;
            //活动时间
            var StartTimeStr = data.Data.StartTimem;
            var EndTimeStr = data.Data.EndTime;
            $scope.starttime = StartTimeStr;
            $scope.endtime = EndTimeStr;
            var endTime = EndTimeStr.split('-');
            var startTime = StartTimeStr.split('-');
            var EndTime = endTime[0] + "年" + endTime[1] + "月" + endTime[2] + "日";
            var StartTime = startTime[0] + "年" + startTime[1] + "月" + startTime[2] + "日";
            var Time = StartTime + "  -  " + EndTime;
            $scope.Time = Time;

            if (data.Data.LeftDay < 0) {
                $scope.LeftDay = 0;
            } else {
                $scope.LeftDay = data.Data.LeftDay;
            }
            if (data.Data.TotalDay <= 0) {
                $scope.TotalDay = 1;
            } else {
                $scope.TotalDay = data.Data.TotalDay;
            }
            console.log("LeftDay",$scope.LeftDay);
            if ($scope.LeftDay == 0) {
                 $scope.Join = selectPhoto;
                $scope.activitying = true;
                $scope.activityed = false;
                $scope.title = "晒下奖品";
            } else {
                $scope.activitying = false;
                $scope.activityed = true;
                if (uid == "") {
                    $scope.Join = joinFn;
                    $scope.title = "马上参与";
                } else {
                    var url3 = "http://" + window.hostname + '/MeiDeNi/Activity/JudgeUserJoinActivity';
                    var param2 = {
                        ActivityID: activityID,
                        UID: uid
                    };
                    $http.post(url3, param2).success(function (data) {
                        console.dir(data);
                        if (data.IsSuccess) {
                            if (data.Data.CanJoin) {
                                $scope.Join = joinFn;
                                $scope.title = "马上参与";
                            } else {
                                $scope.Join = joinFn;
                                $scope.title = "再玩一次，机会翻番";
                            }
                        } else {
                            $scope.Join = joinFn;
                            $scope.title = "马上参与";
                        }
                    });
                }
            }
            //假的参加人数
            $scope.JoinCount = data.Data.JoinCount;
        }
    });
    
    var selectPhoto = function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.showAward.postMessage('');
            } else {
                 window.location.href = "macco://showAward";
            }
        } else {
             window.demo.showAward();
        }
    }
   
    $rootScope.$on('loading:finish', function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            $('#add_footer').show();
            if (window.webkit) {
                window.webkit.messageHandlers.EndLoading.postMessage("true");
            } else {
                window.location.href = "macco://EndLoading/";
            }
        } else {
            window.demo.endLoading();
        }
    });

    addPersonCount = function () {
        $scope.JoinCount = parseInt($scope.JoinCount) + 1;
        $scope.$apply();
    }
});

function ReloadData() {
	var reloadDataBtn = document.getElementById('ReloadData');
	reloadDataBtn.click();
}




