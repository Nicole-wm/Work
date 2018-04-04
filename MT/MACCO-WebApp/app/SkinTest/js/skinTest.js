$(document).ready(function () {
	//自适应屏幕
	var skinType = '';
    var screenHeight = $(window).height();  //当前浏览器窗口的高
    if (screenHeight > 500) {
    	$(".btn").css({ bottom: screenHeight * 0.1 + "px" });
    } else {
    	$(".btn").css("bottom", "10px");
    }

    var ans = $(".div_c").height();
    $(".div_l").css("height", ans);
    $(".div_r").css("height", ans);

    $('.div_c li').click(function () {
    	var $radio = $(this).find("input[type=radio]"),
    	$flag = $radio.is(":checked");
    	if (!$flag) {
    		$radio.prop("checked", true);
    	}
    });

    $(".back").click(function () {
    	var obj_num = $(".number").text() * 1;
    	var obj_class = "content" + obj_num;

    	if (obj_num != 1 && obj_num != 11) {
    		$(".number").text(obj_num - 1);
    		var cur_num = $(".number").text() * 1;
    		var cur_class = "content" + cur_num;
    		$("." + obj_class).hide();
    		$("." + cur_class).show();

    		var ans = $("." + cur_class).find(".div_c").height();
    		$(".div_l").css("height", ans);
    		$(".div_r").css("height", ans);

    		$(".btn-2").text("下一步");
    	} else if(obj_num == 1 || obj_num == 11) {
    		var platform = window.getQueryStringByKey('platform');
    		if (platform == 'iOS') {
    		    window.webkit.messageHandlers.Back.postMessage("");
    		} else if (platform == 'Android') {
                console.log("sd");
    			window.demo.finishActivity();
    		}
    	}
    });

    $(".btn").click(function () {
    	var obj_num = $(".number").text() * 1;
    	var obj_class = "content" + obj_num;

    	if (!$("." + obj_class).find("input").is(':checked')) {
    		alert("请选择");
    	} else if (obj_num != 11) {
    		$(".number").text(obj_num + 1);
    		var cur_num = $(".number").text() * 1;
    		var cur_class = "content" + cur_num;
    		$("." + obj_class).hide();
    		$("." + cur_class).show();

    		var ans = $("." + cur_class).find(".div_c").height();
    		$(".div_l").css("height", ans);
    		$(".div_r").css("height", ans);

    		if (cur_num == 11) {
    			$(".btn-2").text("提交");
    		}
    	} else {
    		var score = 0;
    		for (var i = 1; i < 12; i++) {
    			var obj_div = "content" + i;
    			$("." + obj_div).find("input").each(function (index, element) {
    				if ($(this).is(':checked')) {
    					var option = index + 1;
    					score += option;
    				}
    			});
    		}
    		$(".main1").hide();
    		$(".main2").show();
    		$(".btn-2").text("我知道了");
    		for (var i = 0; i < 4; i++) {
    			var obj = "result" + i;
    			$("." + obj).hide();
    		}
    		if (score >= 11 && score <= 16) {
    			$(".result4").show();
    			skinType = '干性';
    		} else if (score >= 17 && score <= 26) {
    			$(".result3").show();
    			skinType = '中性';
    		} else if (score >= 27 && score <= 33) {
    			$(".result2").show();
    			skinType = '混合';
    		} else {
    			$(".result1").show();
    			skinType = '油性';
    		}
    	}
    });

    var getQueryStringByKey = function(key) {
    	var queryString = window.location.search;
    	var queryStringArray = queryString.split('&');
    	var currentQueryString = '';
    	for(var i=0;i<queryStringArray.length;i++) {
    		var temp = queryStringArray[i];
    		if(temp.indexOf(key) >= 0) {
    			currentQueryString = queryStringArray[i];
    			break;
    		}
    	}
    	var currentQueryStringArray = currentQueryString.split('=');
    	if(currentQueryStringArray.length > 1) {
    		return currentQueryStringArray[1];
    	} else {
    		return '';
    	}
    };

    $('#Sure').click(function(){
    	var uid = getQueryStringByKey("UID");
    	var userUrl = "http://" + window.hostname +  '/User/SetUserSkinType';
    	var platform = window.getQueryStringByKey('platform');
    	if (platform == 'iOS') {
    		window.webkit.messageHandlers.Result.postMessage(skinType);
    	} else if (platform == 'Android') {
    		window.demo.sendSkinType(skinType);
    	}
    });
});
