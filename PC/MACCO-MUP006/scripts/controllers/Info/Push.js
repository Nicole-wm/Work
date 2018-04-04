maccoApp.controller('PushController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
 $scope.canEdit = true;
 var InfoKeyNo = getQueryStringByKey("KeyNO"); 
 $scope.Submit = function() {
  $("#mask").show();

  var PushUrl = window.$ProductionService + 'AdminApi/Information/TimePushInfo';
/*  var PushUrl = window.$servie  + 'AdminApi/Information/TimePushInfo';
*/
  var fields = {
    InfoKeyNo:InfoKeyNo,
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
      $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
      $("#mask").hide();
    } else {
      $window.alert('出错');
      $("#mask").hide();
    }
  });
};


$scope.ReturnBack = function(token) {
  $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
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
