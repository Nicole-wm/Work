maccoApp.controller('PushController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
 $scope.canEdit = true;
 var ActiveKeyNO = getQueryStringByKey("KeyNO"); 
 $scope.Submit = function() {
  $("#mask").show();
  var PushUrl = window.$ProductionService + 'AdminApi/Activity/TimePushActivity';
/*  var PushUrl = window.$servie  + 'AdminApi/Activity/TimePushActivity';
*/
  var fields = {
    ActivityKeyNo:ActiveKeyNO,
    PushTime:$scope.PushTime,
    Content:$scope.Content,
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

  postCreateFunc(PushUrl,function(data) {
    if(data.Data.IsTimePushed) {
      $window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
      $("#mask").hide();
    } else {
      $window.alert('出错');
      $("#mask").hide();
    }
  });
};


$scope.ReturnBack = function(token) {
  $window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
};

$(function(){
  $('#PushTime').val("");
  var PushTime=0;
  $('#PushTime').datetimepicker({
    format: 'yyyy-mm-dd hh:ii:ss', 
    language: 'zh-CN', 
    autoclose:true 
  }).on('changeDate',function(ev){
   PushTime = ev.date.valueOf();
 })
});
}]);
