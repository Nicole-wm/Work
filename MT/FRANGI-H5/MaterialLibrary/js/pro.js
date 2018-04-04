/*Url截取*/
var getQueryStringByKey = function (key) {
	var queryString = window.location.href;
	var queryStringArray = queryString.split('&');
	var currentQueryString = '';
	for (var i = 0; i < queryStringArray.length; i++) {
		var temp = queryStringArray[i];
		if (temp.indexOf(key) >= 0) {
			currentQueryString = queryStringArray[i];
			break;
		}
	}
	var currentQueryStringArray = currentQueryString.split('=');
	if (currentQueryStringArray.length > 1) {
		return currentQueryStringArray[1];
	} else {
		return '';
	}
};

var CurPro = '';
if(getQueryStringByKey('Pro')){
	CurPro = getQueryStringByKey('Pro');
}else{
	CurPro = '';
}

var CurTitle=$("title").html();
switch(CurPro)
{
	case 'pro-god':
	CurTitle='明星单品女神水';
	break;
	case 'pro-mask':
	CurTitle='面膜';
	break;
	case 'pro-revitalizing':
	CurTitle='男士活力润养';
	break;
	case 'pro-hydro':
	CurTitle='菁容焕采系列';
	break;
	case 'pro-joyful':
	CurTitle='雪颜晶透系列';
	break;
	case 'pro-hydra':
	CurTitle='玉肌水润系列';
	break;
	case 'pro-gift':
	CurTitle='礼盒系列';
	break;
	default:
}
if(CurPro){
	$("title").html(CurTitle)
}

function BackTagList(){
	window.location.href='taglist.html?Pro='+CurPro;
}

$(".tag-box li").on("click",function(e){
	var ProUrl=$(this).attr('linkurl');
	if(ProUrl){
		window.location.href=ProUrl+'?Pro='+CurPro;
	}
});