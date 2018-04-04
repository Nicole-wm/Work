/*评论加载*/
phonecatApp.factory('macco', ['$http',function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
	};

	var url = "http://" + window.hostname + '/MeiDeNi/Information/FetchInformationComment';
	var infoID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');
	var param = {
		InfoID: infoID,
		PageSize: 10,
		LastCommentID: 0,
		UID:uid
	};

	var contains = function (items, value) {
		var ret = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].ID == value) {
				ret = true;
				break;
			}
		}
		return ret;
	};

	macco.prototype.nextPage = function () {
		param.LastCommentID = this.after;
		$http.post(url, param).success(function (data) {
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				if (!contains(this.items, items[i].ID)) {
					items[i].isWin = items[i].IsWin*1;
					items[i].isanimate = 1;
					if(items[i].IsLiked == 1) {
						items[i].IsLikedStr = 'true';
						items[i].PeiZan = '赞';
					} else if(items[i].IsLiked == 0) {
						items[i].IsLikedStr = 'false';
						items[i].PeiZan = '呸';
					} else {
						items[i].IsLikedStr = 'null';
						items[i].PeiZan = '';
					}
					
					if(items[i].CommentLiked == -1) {
						items[i].IsCommentLiked = false;
					} else if(items[i].CommentLiked == 0) {
						items[i].IsCommentLiked = false;
					} else {
						items[i].IsCommentLiked = true;
					}

					if(items[i].LikeCount*1==0){
						items[i].LikeCount = "赞";
					}
					
					if (items[i].YEAR > 0) {
						items[i].CreateTime = items[i].YEAR + '年前';
					} else {
						if (items[i].mouth > 0) {
							items[i].CreateTime = items[i].mouth + '月前';
						} else {
							if (items[i].DAY > 0) {
								items[i].CreateTime = items[i].DAY + '天前';
							} else {
								if (items[i].HOUR > 0) {
									items[i].CreateTime = items[i].HOUR + '小时前';
								} else {
									if (items[i].min > 0) {
										items[i].CreateTime = items[i].min + '分钟前';
									} else {
										items[i].CreateTime = items[i].Sec + '秒前';
									}
								}
							}
						}
					}
					
					this.items.push(items[i]);
				}
			}	
			
			if (this.items.length > 0) {
				this.after = this.items[this.items.length - 1].ID;
			} else {
				this.after = 0;
			}
			
			this.busy = false;
		}.bind(this));
	};

	return macco;
}]);


phonecatApp.controller('CommentCtrl', ['$scope', '$http', 'macco', '$location', '$rootScope', '$interval', '$timeout',function ($scope, $http, macco, $location, $rootScope, $interval,$timeout) {
	$scope.macco = new macco();
	var infoID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');
	
	$scope.LikeAvatarListCount = 0;
	$scope.LikeAvatarList = [];
	var getLikeAvatarList = function() {
		var getLikeAvatrUrl = "http://" + window.hostname + '/MeiDeNi/Information/FetchInformationLikeList';
		var param = {
			InfoID:infoID
		};
		$http.post(getLikeAvatrUrl,param).success(function(data){
			if(data.IsSuccess) {
				$scope.LikeAvatarListCount = data.Data.LikeCount;
				if(data.Data.LikeCount<=99){
					$scope.NewLikeAvatarListCount = data.Data.LikeCount;
				}else{
					$scope.NewLikeAvatarListCount ="99+";
				}
				$scope.LikeAvatarList = data.Data.Avatars;
			}
		});
	}
	var url = "http://" + window.hostname + '/MeiDeNi/Information/FetchInformationComment';
	var infoID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');
	var param = {
		InfoID: infoID,
		PageSize: 10,
		LastCommentID: 0,
		UID:uid
	};
	$http.post(url,param).success(function(data){
		if(data.Data[0]){
			$scope.CommentCount=data.Data[0].CommentCount;
		}else{
			$scope.CommentCount=0;
		}
	});

	$rootScope.getLikeAvatarList = getLikeAvatarList;
	getLikeAvatarList();
	
	$scope.LikeComment = function(item) {
		if(!item.IsCommentLiked){
			zanAnimate(item);
		}
		if(item.LikeCount=="赞"){
			item.LikeCount=0;
		}
		item.IsCommentLiked = !item.IsCommentLiked;
		if(item.IsCommentLiked) {
			item.LikeCount++;
		} else {
			if(item.LikeCount==1){
				item.LikeCount="赞";
			}else{
				item.LikeCount--;
			}
		}
		
		var isLike = 0;
		if(item.IsCommentLiked) {
			isLike = 1;
		} else {
			isLike = 0;
		}
		
		var sendLikeDataUrl = "http://" + window.hostname + '/MeiDeNi/Information/LikeComment';
		var likeInfoParam = {
			UID:uid,
			InfoCommentID:item.ID,
			IsLike:isLike
		}
		
		$http.post(sendLikeDataUrl,likeInfoParam).success(function(data){
		});
	};
	 //点赞的动画 
	 var zanAnimate = function(item) {
	 	item.isanimate = !item.isanimate;
	 	$scope.imgAnimate = "imgAnimate";
	 	$timeout(
	 		function() {
	 			item.isanimate = !item.isanimate;
	 		}, 500);
	 };

	 var share = window.getQueryStringByKey('share');
	 if(share == 'no') {
	 	$scope.IsShowFooter = false;
	 } else {
	 	$scope.IsShowFooter = true;
	 }

	 $scope.reloadDataFn = function () { 
	 	$scope.macco.after = '';
	 	$scope.macco.items = [];
	 	$scope.$emit('list:reload');
	 	$('#scrollToThis').trigger('click');
	 };

	 $scope.download = function(){
	    var the_href='http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';//获得下载链接
	    window.location="http://www.baidu.com";//打开某手机上的某个app应用
	    setTimeout(function(){
	      window.location=the_href;//如果超时就跳转到app下载页
	    },1000);
	};
}]);
