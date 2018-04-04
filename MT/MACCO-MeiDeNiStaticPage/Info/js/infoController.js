var isVideoPlay = false;
var videoHeight = 0;
$(document).ready(function () {
	var videoPlayer = document.getElementById('curVideo');
	if (videoPlayer != null) {
		var videoHeight = $(".ProductVideo").height();
		$(".divProduct").css({ 'height': videoHeight + 'px' });
		$(".mask").hide();
		$(".videoMask").hide();

		$(".closeVideo").hide();

		var isVideoPlay = false;
		videoPlayer.addEventListener('playing', function () {
			isVideoPlay = true;
			$(".divProduct").css({ 'height': videoHeight + 'px' });
		});

		videoPlayer.addEventListener('ended', function () {
			isVideoPlay = false;
		});

		videoPlayer.addEventListener('pause', function () {
			isVideoPlay = false;
		});

		$(window).on('scroll', function () {
			var scrollTop = $(window).scrollTop();
			var head = $('#mainTitle').height();
			if (scrollTop > videoHeight) {
				if (isVideoPlay) {
					$("#VideoPlay").removeClass("ProductVideo").addClass("newproduct");
					$("#curVideo").attr("height", "smallVideoHeigth");
					$("#curVideo").removeAttr("controls");
					var newproductheight = $(".newproduct").height();
					$(".mask").css({ "height": newproductheight + 'px' });
					$(".videoMask").css({ "height": newproductheight + 'px' });
					$(".maskContent").css({ "line-height": newproductheight + 'px' });
					$(".closeVideo").show();
					$(".videoMask").show();
					$(".divProduct").show();
					$("#stopbtn").show();
				}
			} else {
				$(".mask").hide();
				$(".closeVideo").hide();
				$(".videoMask").hide();
				$("#VideoPlay").removeClass("newproduct").addClass("ProductVideo");
				$(".divProduct").hide();
				$("#curVideo").attr("height", "videoHeight");
				$("#curVideo").attr("controls", "controls");
			}
		});
		$("#closebtn").on('click', function () {
			$(".closeVideo").hide();
			$("#VideoPlay").removeClass("newproduct").addClass("ProductVideo");
			$(".divProduct").hide();
			$("#video").attr("height", "videoHeight");
			$(window).scrollTop(0);
			videoPlayer.pause();
			$("#curVideo").attr("controls", "controls");
		});
		var maskhide;

		$(".videoMask").on('click', function () {
			$(".mask").show();
			$("#startbtn").hide();
			maskhide = setTimeout("$('.mask').hide()", 2000);
		});

		$("#stopbtn").on('click', function () {
			clearTimeout(maskhide);
			videoPlayer.pause();
			$("#startbtn").show();
			$("#stopbtn").hide();
		});

		$("#startbtn").on('click', function () {
			videoPlayer.play();
			$("#startbtn").hide();
			$("#stopbtn").show();
			$(".mask").hide();
		});
	}
});

// 进入全屏接口
function screenfullClick() {
	var platform = window.getQueryStringByKey('platform');
	if (platform == 'Android') {
		var myVid = document.getElementById("curVideo");
		myVid.webkitRequestFullScreen();
		window.demo.Backscreenfull();
	} else {
		var myVideo = document.getElementById("curVideo");
		myVideo.webkitEnterFullscreen();
	}
};

// 判断是否是全屏
function isFullScreen(){
	var de = document;
	if (de.webkitIsFullScreen){
		return true;
	}else{
		return false;
	}
}

// 退出全屏
function exitFullscreen() {
	var de = document;
	de.webkitCancelFullScreen();
}

function stopvideo() {
	var videoPlayer = document.getElementById('curVideo');
	videoPlayer.pause();
}
var phonecatApp = angular.module('maccoApp', ['infinite-scroll'], ['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
	// Use x-www-form-urlencoded Content-Type
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	/**
	 * The workhorse; converts an object to x-www-form-urlencoded serialization.
	 * @param {Object} obj
	 * @return {String}
	 */
	 var param = function (obj) {
	 	var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

	 	for (name in obj) {
	 		value = obj[name];

	 		if (value instanceof Array) {
	 			for (i = 0; i < value.length; ++i) {
	 				subValue = value[i];
	 				fullSubName = name + '[' + i + ']';
	 				innerObj = {};
	 				innerObj[fullSubName] = subValue;
	 				query += param(innerObj) + '&';
	 			}
	 		}
	 		else if (value instanceof Object) {
	 			for (subName in value) {
	 				subValue = value[subName];
	 				fullSubName = name + '[' + subName + ']';
	 				innerObj = {};
	 				innerObj[fullSubName] = subValue;
	 				query += param(innerObj) + '&';
	 			}
	 		}
	 		else if (value !== undefined && value !== null)
	 			query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	 	}

	 	return query.length ? query.substr(0, query.length - 1) : query;
	 };

	// Override $http service's default transformRequest
	$httpProvider.defaults.transformRequest = [function (data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
}]);

phonecatApp.factory('httpInterceptor', ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
	var loadingCount = 0;
	return {
		request: function (config) {
			if (++loadingCount === 1) $rootScope.$broadcast('loading:progress');
			return config || $q.when(config);
		},

		response: function (response) {
			if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
			return response || $q.when(response);
		},

		responseError: function (response) {
			if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
			return $q.reject(response);
		}
	};
}]).config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
}]);

phonecatApp.factory('macco', ['$http', function ($http) {
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
		UID: uid
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
			console.dir(items);
			for (var i = 0; i < items.length; i++) {
				if (!contains(this.items, items[i].ID)) {
					if (items[i].IsLiked == -1) {
						items[i].IsLikedStr = 'null';
						items[i].PeiZan = '';
					} else if (items[i].IsLiked == 0) {
						items[i].IsLikedStr = 'false';
						items[i].PeiZan = '呸';
					} else {
						items[i].IsLikedStr = 'true';
						items[i].PeiZan = '赞';
					}

					if (items[i].CommentLiked == -1) {
						items[i].IsCommentLiked = false;
					} else if (items[i].CommentLiked == 0) {
						items[i].IsCommentLiked = false;
					} else {
						items[i].IsCommentLiked = true;
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

phonecatApp.controller('InformationController', ['$scope', '$http', '$location', '$rootScope', 'macco', function ($scope, $http, $location, $rootScope, macco) {
	$scope.macco = new macco();

	var share = window.getQueryStringByKey('share');

	if (share == 'no') {
		$scope.IsShowFooter = true;
	} else {
		$scope.IsShowFooter = false;
	}
	var shareFlag = window.getQueryStringByKey('share');
	if (shareFlag == 'no') {
		$scope.IsShowFooter = false;
	} else {
		$scope.IsShowFooter = false;
	}
}]);
phonecatApp.controller('ProductStepCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	var tryMakeupID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');
	var platform = window.getQueryStringByKey('platform');

	$scope.redirectFunc = 'redirect';
	$scope.redirect = function (productID) {
		if (platform != null && platform == 'iOS') {
			if (window.webkit) {
				if (window.webkit.messageHandlers.pushToProduction) {
					window.webkit.messageHandlers.pushToProduction.postMessage(productID);
				} else {
					alert("该功能需要更新App!");
					window.location.href = 'https://itunes.apple.com/us/app/mei-ni-ke-yi-sui-dian-sui/id893109338?mt=8';
				}
			} else {
				window.location.href = "macco://RedirectProduct/" + productID;
			}
		} else if (platform != null && platform == 'Android') {
			window.demo.gotoProduction(productID);
		} else {
			window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004";
		}
	};

	var infoID = window.getQueryStringByKey('ID');
	var param = {
		InfoID: infoID
	};
	var url1 = "http://" + window.hostname + '/MeiDeNi/Information/FetchInfoProduct';

	$http.post(url1, param).success(function (data) {
		var step = $scope.productQuery;
		for (i = 0; i < data.Data.length; i++) {
			if (data.Data[i].CourseStep == step) {
				$scope.Product = data.Data[i];
				if (data.Data[i].Rank > 5) {
					var rank = 5;
				} else if (data.Data[i].Rank < 0) {
					var rank = 0;
				} else {
					var rank = data.Data[i].Rank;
				}
				var rankInt = parseInt(rank);
				var halfStarCount = 0;
				var rank_c = rank - rankInt;
				if (rank_c == 0.5) {
					var halfStarCount = 1;
				} else if (rank_c > 0.5) {
					rankInt = rankInt + 1;
				}
				var emptyStarCount = 5 - rankInt - halfStarCount;
				var fullStars = [];
				var halfStars = [];
				var emptyStars = [];
				for (var q = 0; q < rankInt; q++) {
					fullStars.push(q);
				}
				for (var j = 0; j < halfStarCount; j++) {
					halfStars.push(j);
				}
				for (var k = 0; k < emptyStarCount; k++) {
					emptyStars.push(k);
				}
				$scope.FullStars = fullStars;
				$scope.HalfStars = halfStars;
				$scope.EmptyStars = emptyStars;
			}
		}
	});
}]);


function ReloadData() {
	var reloadDataBtn = document.getElementById('ReloadData');
	reloadDataBtn.click();
}

function getScrollTop() {
	$(window).on('scroll', function () {
		var scrollTop = $(window).scrollTop();
		return scrollTop;
	});
}
