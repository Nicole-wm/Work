maccoApp.controller('ProductDetailController', ['$scope','$window','$http','Upload','$rootScope','$modal',function($scope, $window,$http,Upload,$rootScope,$modal) {
  var TopKeyNO = getQueryStringByKey('TopKeyNO');
  var TopID = getQueryStringByKey('TopID');
  var ProductKeyNO = getQueryStringByKey('KeyNO');
  var ProductID = getQueryStringByKey('ID');
  var type = getQueryStringByKey('Type');
  var url = window.$servie + 'AdminApi/Topproduct/FetchTopProductTopicDetail';
  var param = {
    TopProductKeyNo:TopKeyNO,
    ProductKeyNo:ProductKeyNO
  };
  $http.post(url, param).success(function(data){
    if(data.IsSuccess) {
      $scope.Title = data.Data[0].Title;
      $scope.ImageUrl = data.Data[0].PicImageUrl;
      $scope.Description = data.Data[0].Content ;
      $scope.comments = data.Data[0].Comment;
      $scope.UserKeyNo = data.Data[0].UserKeyNo;
      if(data.Data[0].PicImageUrl){
        $scope.NeedBanner=false;
      }else{
        $scope.NeedBanner=true;
      }
      var url = window.$AppApiService + 'AdminApi/Topproduct/FetchTopSystemUser';
      var param = {
        UserKeyNo:$scope.UserKeyNo 
      };
      $http.post(url, param).success(function(data){
        if(data.IsSuccess) {
          $scope.Avatar = data.Data[0].Avatar;
          $scope.Username = data.Data[0].NickName;
        }
      });
    }
  });

  if (type == 'Visit') {
    $scope.canEdit = false;
  }

  if (type == 'Update') {
    $scope.canEdit = true;
    $scope.OperationType = '(新建&编辑)';

    $scope.AddNew = function() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: '/TopManagement/selectConnectUser.html',
        controller: "selectUserController",
        resolve: {
          items: function () {
            return $scope.selectedProduct;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        console.log(selectedItem);
        $scope.User=selectedItem[0].NickName;
        $scope.Avatar=selectedItem[0].Avatar;
        $scope.UserKeyNo=selectedItem[0].KeyNo;
      }, function () {
      });
    };

    $scope.Submit = function() {
      $("#mask").show();
      var createUrl = window.$servie + 'AdminApi/Topproduct/CreateTopProductTopicDetail';
      var create_url = window.$ProductionService + 'AdminApi/Topproduct/CreateTopProductTopicDetail';
      var fields = {
        TopProductKeyNo:TopKeyNO,
        ProductKeyNo:ProductKeyNO,
        Title: $scope.Title,
        Content: $scope.Description,
        Comment: $scope.comments,
        UserKeyNo: $scope.UserKeyNo,
        apiKey:window.$apiKey
      };
      var files = [];
      if($scope.Banner != null) {
        files.push($scope.Banner);
      }
      
      var postCreateFunc = function(url,callback) {
        Upload.upload({
          url: url,
          fields:fields,
          file: files,
          fileFormDataName:'PicImageUrl'
        }).success(function (data, status, headers, config){
          callback(data);
        });
      };
      
      postCreateFunc(createUrl,function(data) {
        if(data.IsSuccess) {
          if (!window.$isTest) {
            postCreateFunc(create_url,function(result){
              if(result.IsSuccess) {
                if(result.Data.IsCreated) {
                  $window.location.href = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type='+type+'&ID=' + TopID +'&KeyNO=' + TopKeyNO;
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
          }else{
            $window.location.href = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type='+type+'&ID=' + TopID +'&KeyNO=' + TopKeyNO;
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
    $window.location.href = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type='+type+'&ID=' + TopID +'&KeyNO=' + TopKeyNO;
  };
}]);