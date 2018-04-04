var isVideoPlay = false;
var videoHeight = 0;

$(document).ready(function () {
	var videoPlayer = document.getElementById('curVideo');
	if(videoPlayer!=null){
		var videoHeight =$("#VideoPlay").height();
        console.log(videoHeight);
		$(".divProduct").css({'height':videoHeight+'px'});
		$(".maskVideo").hide();
		$(".videoMask").hide();

		$(".closeVideo").hide();
	
		var isVideoPlay = false;
		videoPlayer.addEventListener('playing', function () {
			isVideoPlay = true;
			$(".divProduct").css({'height':videoHeight+'px'});
		});
	
		videoPlayer.addEventListener('ended', function () {
			isVideoPlay = false;
		});
	
		videoPlayer.addEventListener('pause', function () {
			isVideoPlay = false;
		});

        var head = $('#head').height();
        var add_zan=$('#add_zan').height();
        var mainPointAbove=$('#mainPointAbove').height();
        var total=head+videoHeight+add_zan+mainPointAbove;
        
		$(window).on('scroll',function(){
            var scrollTop = $(window).scrollTop();
            if(scrollTop>total){
			     if(isVideoPlay){
					$("#VideoPlay").removeClass("ProductVideo").addClass("newproduct");					
					$("#curVideo").attr("height","smallVideoHeigth");
					$("#curVideo").removeAttr("controls");
                    var newproductheight =$(".newproduct").height();
                    $(".maskVideo").css({"height":newproductheight+'px'});
                    $(".videoMask").css({"height":newproductheight+'px'});
                    $(".maskContent").css({"line-height":newproductheight+'px'});   
                    $(".maskContent div").css({"line-height":newproductheight});    
                    $(".closeVideo").show();
					$(".videoMask").show();
                    $(".divProduct").show();
                    $("#stopbtn").show();
				}
			}else{
					$(".maskVideo").hide();
					$(".closeVideo").hide();
					$(".videoMask").hide();
					$("#VideoPlay").removeClass("newproduct").addClass("ProductVideo");
					$(".divProduct").hide();
					$("#curVideo").attr("height","videoHeight");
					$("#curVideo").attr("controls","controls");
				}
		});
		$("#closebtn").on('click',function(){
			$(".closeVideo").hide();
			$("#VideoPlay").removeClass("newproduct").addClass("ProductVideo");
			$(".divProduct").hide();
			$("#video").attr("height","videoHeight");
            var closeTop = head + add_zan + mainPointAbove;
            $(window).scrollTop(closeTop);
			videoPlayer.pause();
			$("#curVideo").attr("controls","controls");
		});
		var maskhide;
	
		$(".videoMask").on('click',function(){
			$(".maskVideo").show();
			$("#startbtn").hide();
			maskhide =setTimeout("$('.maskVideo').hide()",2000);
		});
	
		$("#stopbtn").on('click',function(){
			clearTimeout(maskhide);
			videoPlayer.pause();
			$("#startbtn").show();
			$("#stopbtn").hide();
		});
	
		$("#startbtn").on('click',function(){
			videoPlayer.play();
			$("#startbtn").hide();
			$("#stopbtn").show();
			$(".maskVideo").hide();
		});
	} 
});

function screenbtnClick(){
    var platform = window.getQueryStringByKey('platform');
    if (platform == 'Android') {
         var myVid=document.getElementById("curVideo");
         myVid.webkitRequestFullScreen();
    }else {       
        var myVideo=document.getElementById("curVideo");
        myVideo.webkitEnterFullscreen();
    } 
}
function stopvideo(){
    var videoPlayer = document.getElementById('curVideo');
    videoPlayer.pause();   
}
