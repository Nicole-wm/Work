$(function(){
	$.ajax({
		type: "GET",
		url: "../wxconfig/myapi.php",
		data: "urlparam="+encodeURIComponent(window.location.href).split('#')[0],
		success: function(data){
			var result = JSON.parse(data);						
			if (result != null) {  
				wx.config({  
					debug: false,  
					appId: result.appId,  
					timestamp: result.timestamp,  
					nonceStr: result.nonceStr,  
					signature: result.signature,  
					jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage','hideMenuItems']  
				});  
			}  
		},
		error: function(){

		}
	});
});


wx.ready(function () {
	var sharedata = {
		title: 'FRANGI跨界招商',
		desc: '如何让你的服装生意赚钱更多？服装+美妆模式，为您裂变价值！',
		link:'http://h5.frangi.cn/InvestmentGuideV1/index.html',
		imgUrl: 'http://h5.frangi.cn/IMG/shareIco.png',
		success: function () {
		},
		cancel: function () {
		}
	};
	wx.onMenuShareAppMessage(sharedata);
	wx.onMenuShareTimeline(sharedata);
	wx.hideMenuItems({
		menuList: [
		'menuItem:share:qq',
		'menuItem:share:QZone'
		] 
	});
});