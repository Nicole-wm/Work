var ShareAppId='wxc6335fdd38e0b73f';
var ShareAppsecret='a210e567af63e3ce82d95d2bf1fc7876';
var Sharetimestamp=new Date().getTime();
var SharenonceStr=randomString(15);
var Sharesignature='';

function randomString(len) {
	　　len = len || 15;
	　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';  
	　　var maxPos = $chars.length;
	　　var num = '';
	　　for (i = 0; i < len; i++) {
		num += $chars.charAt(Math.floor(Math.random() * maxPos));
	　　}
	　　return num;
}

function GetAccessToken(){
	/*$.ajax({
		type: "GET",
		url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+ShareAppId+"&secret="+ShareAppsecret,
		data: {},
		dataType: "json",
		success: function(data){
			console.log(data);
		}
	});*/
}

GetAccessToken();

function DoToken(){
/*	$.ajax({
		type: "Get",
		url: "../wxConfig.txt",
		data: "json",
		success: function(data){
			console.log(JSON.parse(data).access_token);
		}
	}); */
}

DoToken();
console.log(Sharetimestamp);
console.log(SharenonceStr);

wx.config({
	debug: true,
	appId: 'wxc6335fdd38e0b73f',
	timestamp: '1502163688',
	nonceStr: '88888888',
	signature: 'c9cc812142a4686d6237a23fff1498dbe1ba05f1',
	jsApiList: [
	'checkJsApi',
	'onMenuShareTimeline',
	'onMenuShareAppMessage',
	'onMenuShareQQ',
	'onMenuShareWeibo'
	]
});
window.jssdk_share = {
	'title': 'FRANGI',
	'desc': 'FRANGI产品推广',
	'imgUrl': 'http://h5.frangi.cn/IMG/shareIco.png',
	'link': 'http://h5.frangi.cn/ProductPromotion/index.html'
};
wx.ready(function() {
	window.onMenuShareTimeline = function() {
		wx.onMenuShareTimeline({
			title: jssdk_share.title, 
			desc: jssdk_share.desc,
			link: jssdk_share.link,
			imgUrl: jssdk_share.imgUrl,
			success: function() {
			},
			cancel: function() {
			}
		});
	}
	onMenuShareTimeline();

	window.onMenuShareAppMessage = function() {
		wx.onMenuShareAppMessage({
			title: jssdk_share.title,
			desc: jssdk_share.desc,
			link: jssdk_share.link,
			imgUrl: jssdk_share.imgUrl,
			type: '',
			dataUrl: '', 
			success: function() {
			},
			cancel: function() {
			}
		});
	}
	onMenuShareAppMessage();
});
