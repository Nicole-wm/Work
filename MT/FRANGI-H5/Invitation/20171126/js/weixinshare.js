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
		title: 'FRANGI 期待与美丽的您一起绽放——邀请函',
		desc: '暨素颜霜新品发布会,特邀金教授＆20时尚博主共话美颜肌密',
		link:'http://h5.frangi.cn/Invitation/20171126',
		imgUrl: 'http://h5.frangi.cn/Invitation/20171126/img/share.png',
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