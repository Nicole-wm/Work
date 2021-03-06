maccoApp.controller('timePublishController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
   $scope.canEdit = true;
    var coverID = getQueryStringByKey("ID");
    var visitUrl =  window.$servie + 'AdminApi/TryMakeup/FetchTimePublishTryMakeupCategory';

    $http.post(visitUrl,{ID:coverID}).success(function(data){
        if(data.IsSuccess) {
            if(data.Data[0].PublishTime != '0000-00-00 00:00:00'){
                $scope.PublishTime = data.Data[0].PublishTime;
            }
            $scope.KeyNo = data.Data[0].KeyNo;
        }
    });

    $scope.Submit = function() {
        var updateUrl = window.$servie + 'AdminApi/TryMakeup/TimePublishTryMakeupCategory ';
        var activity_update_url = window.$ProductionService + 'AdminApi/TryMakeup/TimePublishTryMakeupCategory ';

        var fields = {
            CategoryKeyNo :$scope.KeyNo,
            PublishTime : $scope.PublishTime,
            apiKey:window.$apiKey
        };

        var fields2 = {
            CategoryKeyNo :$scope.KeyNo,
            PublishTime: $scope.PublishTime,
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
            if(data.IsSuccess) {
                if (!window.$isTest) {
                    postCreateFunc(activity_update_url,fields2,function(result){
                        if(result.IsSuccess) {
                            if(result.Data.IsTimePublished) {
                                $window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
                            } else {
                                $window.alert('出错');
                            }
                        } else {
                            $window.alert('出错');
                        }
                    });
                }else{
                    $window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
                }	
            } else {
                $window.alert('出错');
            }
        });
    };


	$scope.ReturnBack = function(token) {
		$window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
	};
    
    $scope.Cancel = function(){
        if ($window.confirm("将会取消定时发布，确定吗？")) {
            var cancelUrl = window.$servie + 'AdminApi/TryMakeup/RemoveTimePublishTryMakeupCategory';
            var info_cancel_url = window.$ProductionService + 'AdminApi/TryMakeup/RemoveTimePublishTryMakeupCategory';
            var param = {
                CategoryKeyNo: $scope.KeyNo,
                apiKey: window.$apiKey
            };
            $http.post(cancelUrl, param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsRemoveTimePublished) {
                        $http.post(info_cancel_url, param).success(function (result) {
                            if (result.IsSuccess) {
                                if (result.Data.IsRemoveTimePublished) {
                                    $window.alert('已取消定时发布');
                                    $window.location.href = '/MakeupManage/coverList.html?Token=' + $rootScope.Token;
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
