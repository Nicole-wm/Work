
(function () {
  var ie = !!(window.attachEvent && !window.opera);
  var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
  var fn = [];
  var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
  var d = document;
  d.ready = function (f) {
    if (!ie && !wk && d.addEventListener)
      return d.addEventListener('DOMContentLoaded', f, false);
    if (fn.push(f) > 1) return;
    if (ie)
      (function () {
        try { d.documentElement.doScroll('left'); run(); }
        catch (err) { setTimeout(arguments.callee, 0); }
      })();
    else if (wk)
      var t = setInterval(function () {
        if (/^(loaded|complete)$/.test(d.readyState))
          clearInterval(t), run();
      }, 0);
  };


	var ImageDocumentReady = function(callback) {
		var images = document.getElementsByTagName('img');
		var img_count = images.length;
		var img_cnt = 0;
		for(i=0;i<img_count;i++) {
			var curr_img = images[i];
			if(curr_img.complete) {
				img_cnt++;
				if(img_cnt==img_count-1) {
					if(callback) {
						callback();
					}
					
				}
			}
			images[i].onload = function() {
				img_cnt++;
				curr_img.onload = null;
				if(img_cnt==img_count-1) {
					if(callback) {
						callback();
					}
				}
			}
		}
	}

	var browser={
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
               	trident: u.indexOf('Trident') > -1, //IE内核
	            presto: u.indexOf('Presto') > -1, //opera内核
	            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
	            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	            iPad: u.indexOf('iPad') > -1, //是否iPad
	            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
	            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
	            qq: u.match(/\sQQ/i) == " qq" //是否QQ


                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
    };

    var imageLoadedFunc = function() {
		ImageDocumentReady(imageLoaded);
	};

    var initFunc = function() {
      document.querySelector('a.btn').setAttribute('href','http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004'); 
      var search = window.location.search;
    	if(search != "") {
    		var searchItems = search.split('&');
    		var searchItem = searchItems[0].replace('?','').split('=');
    		if(searchItem[0] == 'share') {
    			var shareTitle = document.querySelector('.footer');
    			shareTitle.style.display = 'none';
    		}
    	} else {
    		var shareTitle = document.querySelector('.footer');
    		shareTitle.style.display = 'static';
    	}
    	

    	var obj = document.querySelector(".footer");
      
    	// obj.onclick = function(event) {
    	// 	 var url='http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
    	// 	 window.location.href=url;
    	// };
    };

	
    document.ready(initFunc);
    window.onload = function() {
      document.querySelector('a.btn').setAttribute('href','http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004');  
      var obj = document.querySelector(".footer");
    	obj.onclick = function(event) {
    		 var url='http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
    		 window.location.href=url;
    	}; 
    }

})();


// for angularjs

var phonecatApp = angular.module('maccoApp', ['infinite-scroll'],['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
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

phonecatApp.controller('InformationController', ['$scope', '$http', '$location', '$rootScope', '$interval',function ($scope, $http, $location, $rootScope, $interval) {
  var infoID = window.getQueryStringByKey('ID');
  var uid = window.getQueryStringByKey('UID');
  var param = {
    InfoID:infoID
  };
  var url =  "http://" +  window.hostname + '/MeiDeNi/Information/FetchInfoDetailPage';
  // 查询数据
  $http.post(url,param).success(function(data) {
      if(data.IsSuccess) {
        var totalLikeCount = data.Data[0].LikeCount *1 + data.Data[0].UnLikeCount*1;
        if(totalLikeCount != 0) {
          $scope.ShowLikePrecent = true;
            var totalLikePrecent = Math.floor(data.Data.LikeCount *1 / totalLikeCount * 100);
            if(totalLikePrecent != NaN) {
                $scope.TotalLikePrecent = totalLikePrecent * 1;
            } else {
                $scope.TotalLikePrecent = 0;
            }
        } else {
          $scope.TotalLikePrecent = 0;
          $scope.ShowLikePrecent = false;
          totalLikePrecent = 0;
        }
        
        var likePrecent;
        var dislikePrecent ;
        if(totalLikeCount != 0) {
          likePrecent = data.Data[0].LikeCount / totalLikeCount * 100;
          dislikePrecent = data.Data[0].UnLikeCount / totalLikeCount * 100;
        } else {
          likePrecent = 50;
          dislikePrecent = 50;
        }
        
        $scope.LikePrecent = 'width:' + likePrecent + '%';
        $scope.DisLikePrecent = 'width:' + dislikePrecent + '%';
        
        $scope.LikeCount = data.Data[0].LikeCount;
        $scope.UnLikeCount = data.Data[0].UnLikeCount;
        $scope.LikeTrigger = 0;
        $scope.UnlikeTigger = 0;
        $scope.praiseHeadTrigger = 0;
        $scope.peiMouthHeadTrigger = 0;
      }
  });
  
  var isLiked;
  var animationInfo = function() {
    var animateTime = 1000;
      var animateDuration = 10;
      var animateCount = animateTime / animateDuration;
      
      var total = $scope.LikeCount * 1 + $scope.UnLikeCount *1;
      var likePrecent = $scope.LikeCount / total * 100;
      var likePrecentUnit = likePrecent / animateCount;
      
      var dislikePrecent = $scope.UnLikeCount / total * 100; 
      var dislikePrecentUnit = dislikePrecent / animateCount;
      var aninateLoop = 1;
      
      $scope.praiseHeadTrigger = 1;
      $scope.peiMouthHeadTrigger = 1;
      
      $scope.LikePrecent = 'width:0%';
      $scope.DisLikePrecent = 'width:0%';
      
      $interval(function() {
        var newLikePrecent = aninateLoop * likePrecentUnit;
        var newDisLikePrecent = aninateLoop * dislikePrecentUnit;
        $scope.LikePrecent = 'width:' + newLikePrecent + '%;background-color: #ff4a83;';
        $scope.DisLikePrecent = 'width:' + newDisLikePrecent + '%;background: #1dd1c6;';
        aninateLoop = aninateLoop + 1;
      },animateDuration,animateCount,true,function(){
        
      });
  }
  
  // 点赞
  $scope.LikeInfoFn = function(isLike) {  
    if(uid == '') {
      uid = -1;
    }
    if(!isLiked) {
      if(isLike == 0) {
        $scope.LikeTrigger = 2;
        $scope.UnlikeTigger = 1;
        $scope.UnLikeCount = $scope.UnLikeCount *1 + 1;  
          
      } else {
        $scope.LikeTrigger = 1;
        $scope.UnlikeTigger = 2;
        $scope.LikeCount = $scope.LikeCount * 1 + 1;
      }
      
      var likeUrl = "http://" +  window.hostname + '/MeiDeNi/Information/LikeInfo';
      var likeParam = {
        InfoID:infoID,
        UID:uid,
        IsLike:isLike
      };
      $http.post(likeUrl,likeParam).success(function(data) {
        console.dir(data);
      });
      animationInfo();
      isLiked = true;
    }
  }
}]);


function ScrollPage(scrollOffest) {
  console.log('scroll Offest:' + scrollOffest);
  var $btnList = $('#btnContainer')
    var sumDivScrollTop = scrollOffest;
    var $mainTitle = $('div.mainTitle');
    var $productImages = $('div.ProductImages');
    var mainTitleHeight = $mainTitle.height();
    var productImageHeight = $productImages.height();
    var totalHeight = mainTitleHeight + productImageHeight;
    
    if(sumDivScrollTop>= totalHeight) {
      $('div.btnList').css('opacity',0);
      $btnList.addClass('fixBtn');
      setTimeout(function() {
        $btnList.css({
          position:"absolute",
          top: sumDivScrollTop + 20
        });
        $btnList.addClass('fixBtnShow');
      },100)
      
    } else {
      $('div.btnList').css('opacity',1);
      $btnList.css({position:"static"});
      $btnList.removeClass('fixBtn');
      $btnList.removeClass('fixBtnShow');
    }
    
}

$(document).on('scroll',function() {
    var sumDivScrollTop = $(document).scrollTop();
    ScrollPage(sumDivScrollTop);
});

