/*评论加载*/
phonecatApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
	};
    var winurl = "http://" + window.hostname + '/MeiDeNi/Activity/FetchShowAwardActivity';
    var activityID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');
	var param = {
		ActivityID: activityID,
		LastID: 0,
		PageSize: 10,
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
		param.LastID = this.after;
		$http.post(winurl, param).success(function (data) {
            console.log(data);
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
                
				if (!contains(this.items, items[i].ID)) {	
                    if(items[i].BeLiked * 1 == 1) {
                      items[i].IsCommentLiked = true;
                    } else {
                       items[i].IsCommentLiked = false;
                    }
                     var skintype = items[i].SkinType;
                     if (skintype == "干性") {
                        items[i].ShowSkin = true;
                        items[i].skintype = "../image/gan.png";
                    } else if (skintype == "油性") {
                        items[i].ShowSkin = true;
                        items[i].skintype = "../image/you.png";
                    } else if (skintype == "混合") {
                        items[i].ShowSkin = true;
                        items[i].skintype = "../image/hun.png";
                    } else if (skintype == "中性") {
                        items[i].ShowSkin = true;
                        items[i].skintype = "../image/zhong.png";
                    } else if (skintype == "敏感") {
                        items[i].ShowSkin = true;
                        items[i].skintype = "../image/ming.png";
                    } else {
                        items[i].ShowSkin = false;
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
});


phonecatApp.controller('CommentCtrl', function ($scope,$http,macco,$location, $rootScope,$interval) {
    $scope.macco = new macco();
	var uid = window.getQueryStringByKey('UID');
	$scope.LikeComment = function(item) {
		item.IsCommentLiked = !item.IsCommentLiked;
		if(item.IsCommentLiked) {
			item.LikeCount++;
		} else {
			item.LikeCount--;
		}
		
		var IsLike = 0;
		if(item.IsCommentLiked) {
			IsLike = 1;
		} else {
			IsLike = 0;
		}
		
		var sendLikeDataUrl = "http://" + window.hostname + '/MeiDeNi/Activity/LikeShowAward';
		var likeInfoParam = {
			UID:uid,
			AwardID:item.ID,
			IsLike:IsLike
		}
		
		$http.post(sendLikeDataUrl,likeInfoParam).success(function(data){
			console.dir(data);
		});
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
        $("body").scrollTop(150);
	};
	
	$scope.download = function(){
		window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
	};
});
