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
		title: 'FRANGI品牌介绍',
		desc: 'FRANGI源自法国的天然护肤品牌，坚持“天然植物为原料，顶尖科技为辅助”的理念，阐释着对美的全新概念和独立态度，将艺术、文化、生物等多种元素融入到产品设计与研发中。',
		link:'http://h5.frangi.cn/BrandPromotion/',
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