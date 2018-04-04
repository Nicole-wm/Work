
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
    	obj.onclick = function(event) {
    		if(browser.versions.ios && browser.versions.webKit) {
    			var url = 'http://itunes.apple.com/cn/app/mei-ni-sui-shou-mei-pai-feng/id893109338?mt=8';
    			window.location.href=url;
    		} else if(browser.versions.android) {
    			alert('开发中，敬请期待');
    		} else {
    			alert('test');
    		}
    	};


    };

	
    document.ready(initFunc);

})();

