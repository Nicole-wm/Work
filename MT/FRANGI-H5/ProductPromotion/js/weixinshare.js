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
		title: 'FRANGI产品介绍',
		desc: '明星单品，臻享礼盒，7大焕颜系列喂饱你的肌肤',
		link:'http://h5.frangi.cn/ProductPromotion/',
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