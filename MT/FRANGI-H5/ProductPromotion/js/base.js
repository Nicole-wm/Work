/*目录滑动*/
var sbarstartPosition={};
var sbarendPosition={};
var sbarmoveLength=0;
var sbarMoveFlag=false; 

$(".sidebar-container").on("touchstart", ".Sidebar",function(e){
	var touch = e.touches[0];  
	sbarstartPosition = {  
		x: touch.pageX
	};
	sbarMoveFlag=false;
}).on('touchmove',".Sidebar", function(e){ 
	e.preventDefault();
	var touch = e.touches[0]; 
	sbarendPosition = {  
		x: touch.pageX
	};
	sbarMoveFlag=true;
}).on('touchend',".Sidebar", function(e){
	if(sbarMoveFlag){
		if(sbarendPosition){
			sbarmoveLength = sbarendPosition.x - sbarstartPosition.x;
			if(sbarmoveLength<-100){
				SidebarClick();
			}else{
			}
		}
	}
});
$(".sidebar-container").on("click", ".Sidebar-content li",function(e){
	var ProUrl=$(this).attr('linkurl');
	window.location.href=ProUrl;
});
function SidebarClick(){
	if($(".sidebar-container").hasClass('fadeInLeft')){
		$(".sidebar-container").removeClass('fadeInLeft').addClass('fadeOutLeft');
		$(".Top-SiderBtn .top-lineBtn").eq(0).removeClass('top-tlinepBtn').addClass('top-op-tlinepBtn');
		$(".Top-SiderBtn .top-lineBtn").eq(1).removeClass('top-clinepBtn').addClass('top-op-clinepBtn');
		$(".Top-SiderBtn .top-lineBtn").eq(2).removeClass('top-blinepBtn').addClass('top-op-blinepBtn');
	}else{
		$(".sidebar-container").removeClass('fadeOutLeft').addClass('fadeInLeft');
		$(".Top-SiderBtn .top-lineBtn").eq(0).removeClass('top-op-tlinepBtn').addClass('top-tlinepBtn');
		$(".Top-SiderBtn .top-lineBtn").eq(1).removeClass('top-op-clinepBtn').addClass('top-clinepBtn');
		$(".Top-SiderBtn .top-lineBtn").eq(2).removeClass('top-op-blinepBtn').addClass('top-blinepBtn');
	}
}

/*手势点击-点击*/
function TapClick(){
	$('.guide-container').hide();
	var Linkurl='view/pro-god.html';
	var Slideurl=$('.banner-slide-cur').attr("linkurl");
	var SlideOpurl=$('.banner-slide-pre-op').attr("linkurl");
	if(Slideurl){
		Linkurl=Slideurl;
	}else{
		if(SlideOpurl){
			Linkurl=SlideOpurl;
		}
	}
	window.location.href=Linkurl;
}
/*手势点击-左右*/
function AroundClick(){
	$('.guide-container').hide();
}

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

var CurID =0;
if(getQueryStringByKey('ID')){
	CurID = getQueryStringByKey('ID')*1;
}else{
	CurID =0;
}

