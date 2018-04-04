var phonecatApp = angular.module('maccoApp', [], function ($httpProvider, $locationProvider) {
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

phonecatApp.controller('activityController', function ($scope, $http, $location, $rootScope) {
  var url = "http://" + window.hostname + '/MeiDeNi/Activity/FetchActivityDetail';
  var activityID = window.getQueryStringByKey('ID');
  var param = {
    ActivityID: activityID
  };
  
  $http.post(url, param).success(function (data) {
    if (data.IsSuccess) {
      //活动时间
      EndTimeStr = data.Data.EndTime;
      StartTimeStr = data.Data.StartTimem;
      var endTime = EndTimeStr.split('-');
      var startTime = StartTimeStr.split('-');
      EndTime=endTime[0]+"年"+endTime[1]+"月"+endTime[2]+"日";
      StartTime=startTime[0]+"年"+startTime[1]+"月"+startTime[2]+"日";
      Time=StartTime+"  -  "+EndTime;
      $scope.Time=Time;
  
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
      
      if($scope.LeftDay == 0) {
        $scope.IsFinish = true;
        $scope.LeftDayStr = "已经结束";
      } else {
        $scope.LeftDayStr = "剩余" + $scope.LeftDay + "天";
        $scope.IsFinish = false;
      }

      var present = ($scope.LeftDay / $scope.TotalDay) * 100;
      if(present > 50) {
        $scope.LeftStatus = 1;
      } else if(present<=50 && present >0) {
       $scope.LeftStatus = 0;
     } else {
       $scope.LeftStatus = -1;
     }
     var percentStr = present + '%';

     $scope.leftStyle = 'width:' + percentStr;

     //假的参加人数
     $scope.JoinCount = data.Data.JoinCount;
     if(data.Data.JoinCount<=99){
       $scope.JoinCountNew = data.Data.JoinCount;
     }else{
       $scope.JoinCountNew ="99+";
     }
   }
 });
  
  var url2 = "http://" + window.hostname + '/MeiDeNi/Activity/FetchUserJoinActivty';
  $http.post(url2, param).success(function (data) {
    if (data.IsSuccess) {
      $scope.JoinList = data.Data;
    }
  });

  var uid = window.getQueryStringByKey('UID');
  var joinFn = function() {
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
       window.demo.joinActivity(processType,shouldLogin,objectID);
    } else {
       window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004";
    }
  };
  
  if(uid == "") {
    $scope.Join = joinFn;
    $scope.title = "马上参与";
    $scope.btnJoin_n = "btnJoin_n";
  } else {
    var url3 = "http://" + window.hostname + '/MeiDeNi/Activity/JudgeUserJoinActivity';
    var param2 = {
      ActivityID:activityID,
      UID:uid
    };
    $http.post(url3, param2).success(function (data) {
      if (data.IsSuccess) {
        if(data.Data.CanJoin) {
          $scope.Join = joinFn;
          $scope.title = "马上参与";
          $scope.btnJoin_n = "btnJoin_n";
        } else {
          $scope.Join = function(){
          };
          $scope.title = "已经参与";
          $scope.btnJoin_n = "btnJoinDisable_n";
        }
      } else {
        $scope.Join = joinFn;
        $scope.title = "马上参与";
        $scope.btnJoin_n = "btnJoin_n";
      }
    });
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
    }else{
      window.demo.endLoading();
    }
 });
});
