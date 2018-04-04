$(".base-box li").on("click",function(e){
	var ProUrl=$(this).attr('linkurl');
	if(ProUrl){
		window.location.href=ProUrl;
	}
});

$("#container").on("click", ".cell",function(e){
	$(this).addClass('FullScreen');
	$('.pic-close').show();
});
$(".pic-close").on("click",function(e){
	$("#container .cell").removeClass('FullScreen');
	$('.pic-close').hide();
});

function PageInit(StartNum,InitEndNum,PerNum,CurImgUrl){
	PicInit(StartNum,InitEndNum,CurImgUrl);
	WaterFallInit(InitEndNum-1,PerNum,CurImgUrl);
}

function GetHtml(StartNum,EndNum,ImgSrc){
	var html='';
	for(var k=StartNum;k>=EndNum;k--){
		src=ImgSrc+k+".jpg";
		html+='<div class="cell"><img src="'+src+'" /></div>';
	}
	return html;
}

function PicInit(StartNum,EndNum,ImgSrc){
	$('#container').html(GetHtml(StartNum,EndNum,ImgSrc));
}

function WaterFallInit(StartNum,PerNum,ImgSrc){//现已存在的数量应为单数，PerNum为偶数
	var opt={
		getResource:function(index,render){
			var CountTime=Math.ceil(StartNum/PerNum);
			var html='';
			var src="";
			if(index<=CountTime){
				var CurStartNum=StartNum-(index-1)*PerNum;
				var CurEndNum=CurStartNum-PerNum+1;
				CurEndNum>0?true:CurEndNum=1;
				return $(GetHtml(CurStartNum,CurEndNum,ImgSrc));
			}
		}
	}
	$('#container').waterfall(opt);
}
