maccoApp.controller('timePublishController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
   $scope.canEdit = true;
    var ID = getQueryStringByKey("ID"); 
    var visitUrl =  window.$servie + 'AdminApi/Showindex/FetchTimePublishShowIndex';
    $http.post(visitUrl,{ID:ID}).success(function(data){
        if(data.IsSuccess) {
            if(data.Data[0].PublishTime != '0000-00-00 00:00:00'){
                $scope.PublishTime = data.Data[0].PublishTime;
            }
            $scope.KeyNo = data.Data[0].KeyNo;
        }
    });

    $scope.Submit = function() {
        var updateUrl = window.$servie + 'AdminApi/Showindex/TimePublishShowIndex';
        var show_update_url = window.$ProductionService + 'AdminApi/Showindex/TimePublishShowIndex';

        var fields = {
            KeyNo:$scope.KeyNo,
            PublishTime: $scope.PublishTime,
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
                if (!window.$isTest) {
                    postCreateFunc(show_update_url,function(result){
                        if(result.IsSuccess) {
                            if(result.Data.IsTimePublished) {
                                $scope.ReturnBack();
                            } else {
                                $window.alert('出错');
                            }
                        } else {
                            $window.alert('出错');
                        }
                    });
                }else{
                    $scope.ReturnBack();
                }	
            } else {
                $window.alert('出错');
            }
        });
    };

    $scope.ReturnBack = function() {
        $window.location.href = '/ShowManagement/ShowManager.html?Token=' + $rootScope.Token;
    };

    $scope.Cancel = function(){
        if ($window.confirm("将会取消定时发布，确定吗？")) {
            var cancelUrl = window.$servie + 'AdminApi/Showindex/RemoveTimePublishShowIndex';
            var show_cancel_url = window.$ProductionService + 'AdminApi/Showindex/RemoveTimePublishShowIndex';
            var param = {
                KeyNo: $scope.KeyNo,
                apiKey: window.$apiKey
            };
            $http.post(cancelUrl,param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsRemoveTimePublished) {
                        $http.post(show_cancel_url, param).success(function (result) {
                            if (result.IsSuccess) {
                                if (result.Data.IsRemoveTimePublished) {
                                    $window.alert('已取消定时发布');
                                    $scope.ReturnBack();
                                } else {
                                    $window.alert('出错');
                                }
                            }
                        });
                    } else {
                        $window.alert('出错');
                    }
                } else {
                    $window.alert('出错');
                }
            });

        }
    }

	$(function(){
		$('#PublishTime').val("");
		var PublishTime=0;

		$('#PublishTime').datetimepicker({
            minuteStep: 30,
			format: 'yyyy-mm-dd hh:ii', 
			language: 'zh-CN', 
			autoclose:true 
		}).on('changeDate',function(ev){
			PublishTime = ev.date.valueOf();
		})
	});

}]);
