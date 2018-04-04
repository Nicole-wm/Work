$(function(){
	$.ajax({
		type: "GET",
		url: "../../wxconfig/myapi.php",
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
		title: 'FRANGI跨界招商会 | 邀请函',
		desc: '服装+美妆，多元化盈利模式，让您的服装生意更赚钱！',
		link:'http://h5.frangi.cn/Invitation/20171218',
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