phonecatApp.controller('ZanCtrl',['$scope', '$http', '$interval','$rootScope', '$timeout', function ($scope, $http, $interval,$rootScope, $timeout) {
	var platform = window.getQueryStringByKey('platform');
	var infoID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');

	var LikePercentTextWidth=$(".LikePercentText").width();
	var PercentLineWidth=$(window).width()*1-2*LikePercentTextWidth*1;
	$scope.PercentLine='width:' + PercentLineWidth + 'px';

	$scope.addlike=1;
	$scope.addunlike=1;

	//获取赞呸初始值
	$scope.LikeCountText = "喜欢";
	$scope.UnLikeCountText = "不喜欢";

	var url = "http://" + window.hostname + '/MeiDeNi/Information/FetchInfoLikeCount';
	$http.post(url, { InfoID: infoID }).success(function (data) {
		if (data.IsSuccess) {
			var result = data.Data;
			if (result.length > 0) {
				$scope.LikeCount = result[0].LikeCount * 1;
				$scope.UnLikeCount = result[0].UnLikeCount * 1;
				LineWidth();
				$scope.LikePrecent = 'width:' + $scope.LikeLineWidth + 'px;background-color: #ff4c84;';
				$scope.UnLikePrecent = 'width:' + $scope.UnLikeLineWidth + 'px;background: #ffc002;';
			} else {
				$scope.LikeCount = 0;
				$scope.UnLikeCount = 0;
			}
		}
	});
    //点喜欢或不喜欢比例条以及数据
    function LineWidth(){
    	$(".LikeLine").width(0);
    	$(".UnlikeLine").width(0);
    	var LikeCount=$scope.LikeCount;
    	var UnLikeCount=$scope.UnLikeCount;
    	var AllCount=LikeCount+UnLikeCount;
    	if(AllCount==0){
    		var LikeLinePercent=50;
    	}else{
    		var LikeLinePercent=Math.round((LikeCount/AllCount)*100);
    	}
    	var UnLikeLinePercent=100-LikeLinePercent;
    	var LikeLineWidth=Math.round(PercentLineWidth*LikeLinePercent/100);
    	var UnLikeLineWidth=PercentLineWidth-LikeLineWidth;
    	$scope.LikeLinePercent = LikeLinePercent;
    	$scope.UnLikeLinePercent = UnLikeLinePercent;
    	$scope.LikeLineWidth=LikeLineWidth;
    	$scope.UnLikeLineWidth=UnLikeLineWidth;
    }
	//点喜欢或不喜欢动画
	var zanAnimate = function(flag) {
		if(flag){
			$scope.addlike= !$scope.addlike;
		}else{
			$scope.addunlike= !$scope.addunlike;
		}
		$scope.likeAnimate = "likeAnimate";
		$scope.unlikeAnimate = "unlikeAnimate";
		$timeout(
			function() {
				if(flag){
					$scope.addlike= !$scope.addlike;
				}else{
					$scope.addunlike= !$scope.addunlike;
				}
			}, 500);
	};

	/*赞和呸点击*/
	var UserLike = function (flag) {
		var sendLikeUrl = "http://" + window.hostname + "/MeiDeNi/Information/LikeInformation";
		var sendparam = {
			InfoID:infoID*1,
			IsLike: flag,
			UID: uid
		};
		$http.post(sendLikeUrl, sendparam).success(function (data) {
			if (data.IsSuccess) {
				if (uid != -1 && uid != "") {
					$rootScope.getLikeAvatarList();
				}
			}
		});
		if(uid != '' && uid != -1) {
			var trackingUrl = "http://" + window.hostname + '/MeiDeNi/UserTracking/TrackingUser';
			var trackingData = {
				ObjectID:infoID,
				Type:flag?'LikeInfo':'DisLikeInfo',
				UID:uid
			};
			$http.post(trackingUrl,trackingData).success(function(data){
				console.dir(data);
			});
		}
	};

	//点喜欢或不喜欢
	var isLiked = true; // 是否已经点过
	$scope.LikeProductFn = function (flag) {
		if (isLiked) {
			zanAnimate(flag);
			if(flag){
				$scope.LikeCount=$scope.LikeCount+1;
			}else{
				$scope.UnLikeCount=$scope.UnLikeCount+1
			}
			LineWidth();
			$(".LikeLine").animate({width:$scope.LikeLineWidth+"px"},2000);
			$(".UnlikeLine").animate({width:$scope.UnLikeLineWidth+"px"},2000);
			if($scope.LikeCount * 1>9999){
				$scope.LikeCountText="9999+";
			}else{
				$scope.LikeCountText = $scope.LikeCount;
			}
			if($scope.UnLikeCount * 1>9999){
				$scope.UnLikeCountText="9999+";
			}else{
				$scope.UnLikeCountText = $scope.UnLikeCount;
			}
			isLiked = false;
			UserLike(flag);
		}
	}
}]);

