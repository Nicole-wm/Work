maccoApp.controller('WinController', ['$scope','$window','$http','Upload','$rootScope','$modal',function($scope, $window,$http,Upload,$rootScope,$modal) {
  var ActiveID = getQueryStringByKey("ID");
  var ActiveKeyNO = getQueryStringByKey("KeyNO");
  /*var visitUrl =  window.$servie + 'AdminApi/Activity/FetchActivityJoinDetail';*/
  var visitUrl =  window.$AppApiService + 'AdminApi/Activity/FetchActivityJoinDetail';

  $http.post(visitUrl,{ActivityKeyNo:ActiveKeyNO}).success(function(data){
    if(data.IsSuccess) {
      $scope.Title = data.Data.Title;
      $scope.JoinCount = data.Data.JoinCount;
    }
  });

  var searchFn = function() {
    $scope.items =[];
    var KeyNO = getQueryStringByKey('KeyNO');
    /* var url = window.$servie + 'AdminApi/Activity/FetchActivityWinUser';*/
    var url = window.$AppApiService + 'AdminApi/Activity/FetchActivityWinUser';

    $http.post(url,{ActivityKeyNo:KeyNO}).success(function(data){
      if(data.IsSuccess) {
        $scope.items = data.Data;
      }
    });
  };
  searchFn();

  $scope.AddNew = function() {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: '/ActivityManagement/selectConnectUser.html',
      controller: "selectUserController",
      resolve: {
        items: function () {
          return $scope.selectedProduct;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selectedProduct = selectedItem;
      var flag=1;
      for (var j = 0; j < selectedItem.length; j++) {
        var users = $scope.items;
        if(users.length=="0"){
          $scope.items.push(selectedItem[j]);
        }else{
          for (var i = 0; i < users.length; i++) {
            if(users[i].ID==selectedItem[j].ID){
              flag=0;
              $window.alert('已经存在该用户');
              return;
            }
          }
          if(flag){
            $scope.items.push(selectedItem[j]);
          }
        }
      }
    }, function () {
    });
  };

  $scope.Delete = function(ID) {
    if($window.confirm('将会删除对应获奖用户，确定要这样做吗？')) {
      var users = $scope.items;
      for (var j = 0; j < users.length; j++) {
        if(users[j].ID==ID){
           users.splice(j, 1);
          $window.alert('删除成功');
        }
      }
    }
  };

  $scope.Submit = function() {
    /*var updateUrl = window.$servie + 'AdminApi/Activity/CreateActivityWinUser';*/
    var updateUrl = window.$AppApiService + 'AdminApi/Activity/CreateActivityWinUser';
    var id = getQueryStringByKey('KeyNO');

    var UIDStr= [];
    for(var i=0;i<$scope.items.length;i++) {
      UIDStr.push($scope.items[i].UID);
    }

    var UIDStrsArr=UIDStr.join(',');

    var fields = {
      ActivityKeyNo:id,
      UIDStrs:UIDStrsArr,
      apiKey:window.$apiKey
    };

    var postCreateFunc = function(url,callback) {
      Upload.upload({
        url: url,
        fields:fields,
      }).success(function (data, status, headers, config){
        callback(data);
      });
    };

    postCreateFunc(updateUrl,function(data) {
      if(data.IsSuccess) {
       if(data.Data.IsCreated) {
        $window.location.href ='/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
      } else {
        $window.alert('出错');
      }
    } else {
      $window.alert('出错');
    }
  });
  }
  $scope.ReturnBack = function(token) {
    $window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
  };
}]);
