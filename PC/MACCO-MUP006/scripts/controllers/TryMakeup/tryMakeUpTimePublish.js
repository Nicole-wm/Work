maccoApp.controller('timePublishController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
   $scope.canEdit = true;
    var ID = getQueryStringByKey("ID");
    var visitUrl =  window.$servie + 'AdminApi/TryMakeup/FetchTimePublishTryMakeup';

    $http.post(visitUrl,{ID:ID}).success(function(data){
        if(data.IsSuccess) {
            if(data.Data[0].PublishTime != '0000-00-00 00:00:00'){
                $scope.PublishTime = data.Data[0].PublishTime;
                $scope.Content = data.Data[0].PushContent;
            }
            $scope.KeyNo = data.Data[0].KeyNo;
        }
    });

    $scope.Submit = function() {
        var updateUrl = window.$servie + 'AdminApi/TryMakeup/TimePublishTryMakeup';
        var activity_update_url = window.$ProductionService + 'AdminApi/TryMakeup/TimePublishTryMakeup';

        var fields = {
            TryMakeupKeyNo :$scope.KeyNo,
            PublishTime : $scope.PublishTime,
            PushContent:$scope.Content,
            apiKey:window.$apiKey
        };

        var fields2 = {
            TryMakeupKeyNo :$scope.KeyNo,
            PublishTime : $scope.PublishTime,
            PushContent:$scope.Content,
            apiKey:window.$apiKey
        };
        
        var postCreateFunc = function(url,dataField,callback) {
            Upload.upload({
                url: url,
                fields:dataField,
            }).success(function (data, status, headers, config){
                callback(data);
            });
        };
        
        postCreateFunc(updateUrl,fields,function(data) {
            console.dir(data);
            if(data.IsSuccess) {
                if (!window.$isTest) {
                    postCreateFunc(activity_update_url,fields2,function(result){
                        if(result.IsSuccess) {
                            if(result.Data.IsTimePublished) {
                                $window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
                            } else {
                                $window.alert('出错');
                            }
                        } else {
                            $window.alert('出错');
                        }
                    });
                }else{
                    $window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
                }	
            } else {
                $window.alert('出错');
            }
        });
    };


	$scope.ReturnBack = function() {
		$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
	};
    
    $scope.Cancel = function(){
        if ($window.confirm("将会取消定时发布，确定吗？")) {
            var cancelUrl = window.$servie + 'AdminApi/TryMakeup/RemoveTimePublishTryMakeup';
            var info_cancel_url = window.$ProductionService + 'AdminApi/TryMakeup/RemoveTimePublishTryMakeup';
            var param = {
                TryMakeupKeyNo: $scope.KeyNo,
                apiKey: window.$apiKey
            };
            $http.post(cancelUrl, param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsRemoveTimePublished) {
                        $http.post(info_cancel_url, param).success(function (result) {
                            if (result.IsSuccess) {
                                if (result.Data.IsRemoveTimePublished) {
                                    $window.alert('已取消定时发布');
                                    $window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
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
