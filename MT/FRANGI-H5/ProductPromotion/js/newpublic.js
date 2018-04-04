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
		title: CurProName,
		desc: CurProDesc,
		link:'http://h5.frangi.cn/ProductPromotion/view/'+CurProUrl,
		imgUrl: 'http://h5.frangi.cn/IMG/shareIco.png',
		success: function () {
		},
		cancel: function () {
		}
	};
	console.log(sharedata);
	wx.onMenuShareAppMessage(sharedata);
	wx.onMenuShareTimeline(sharedata);
	wx.hideMenuItems({
		menuList: [
		'menuItem:share:qq',
		'menuItem:share:QZone'
		] 
	});
});

/*微信内-自动播放*/
function autoPlayAudio(id) {
	var audio=document.getElementById(id);
	wx.config({
		debug: false,
		appId: '',
		timestamp: 1,
		nonceStr: '',
		signature: '',
		jsApiList: []
	});
	wx.ready(function() {
		audio.play();
	});
}
/*背景音乐-自动播放*/
if($("#music-bg").length>0){
	autoPlayAudio("music-bg");
}
/*背景音乐-播放暂停*/
function MusicBgClick(){
	if($(".icon-music").attr("play") == "1"){
		$(".icon-music").removeClass("open");
		$(".icon-music").attr("play","0")
		document.getElementById("music-bg").pause();
	}else{
		$(".icon-music").attr("play","1");
		$(".icon-music").addClass("open");
		document.getElementById("music-bg").play();
	}
};

$("img.lazy").lazyload({
	placeholder : "../img/base/loading.jpg",    
	effect : "fadeIn"  
});
