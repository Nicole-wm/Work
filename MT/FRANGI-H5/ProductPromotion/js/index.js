/*首页上下滑动*/
var startPosition={};
var endPosition={};
var moveLength=0;
var MoveFlag=false;  
$('.banner-container').on('touchstart', function(e){ 
	var touch = e.touches[0];  
	startPosition = {  
		y: touch.pageY 
	};
	MoveFlag=false;
}).on('touchmove', function(e){ 
	e.preventDefault();
	var touch = e.touches[0]; 
	endPosition = {  
		y: touch.pageY
	};
	MoveFlag=true;
}).on('touchend', function(e){
	if(MoveFlag){
		if(endPosition){
			moveLength = endPosition.y - startPosition.y;
			var Slide=$('.banner-slide-cur').attr("id");
			var SlideOp=$('.banner-slide-pre-op').attr("id");
			var CurSlide=false;
			if(Slide){
				CurSlide=Slide;
			}else{
				if(SlideOp){
					CurSlide=SlideOp;
				}else{
					CurSlide=false;
				}
			}
			if(moveLength>0){
				ToDown(CurSlide);
			}else if(moveLength<0){
				ToUp(CurSlide);
			}else{
			}
		}
	}
});
/*点击进入详情内页*/
$('.banner-slide').on('click', function(){ 
	var SlideCount=$('.banner-slide').length;
	var CurClickSlide=this.id;
	if(CurClickSlide){
		if(!$(this).hasClass('banner-slide-init1')&&!$(this).hasClass('banner-slide-cur')&&!$(this).hasClass('banner-slide-pre-op')){
			var CurObjStr=CurClickSlide.split("-"); 
			var DoObj=CurObjStr[0]+'-'+(CurObjStr[1]*1-1);
			ToUp(DoObj);
		}else{
			var ProUrl=$(this).attr('linkurl');
			window.location.href=ProUrl;
		}
	}
});
/*下拉*/
function ToDown(CurSlide){
	$(".bottom-container").show();
	if(CurSlide!='banner-1'){
		$('.banner-slide').removeClass();
		$('.banner-container div').addClass('banner-slide');
		if(CurSlide){
			$('#'+CurSlide).prev().addClass('banner-slide-pre-op');
			$('#'+CurSlide).addClass('banner-slide-cur-op');
			$('#'+CurSlide).next().addClass('banner-slide-nex');
			$('#'+CurSlide).next().next().addClass('banner-slide-nex');
		}else{
			$("#banner-1").addClass('banner-slide-pre-op');
			$("#banner-2").addClass('banner-slide-cur-op');
			$("#banner-3").addClass('banner-slide-nex');
			$("#banner-4").addClass('banner-slide-nex');
		}
	}else{
	}
}
/*上拉*/
function ToUp(CurSlide){
	$(".bottom-container").show();	
	var SlideCount=$('.banner-slide').length;
	if(CurSlide!=('banner-'+SlideCount)){
		$('.banner-slide').removeClass();
		$('.banner-container div').addClass('banner-slide');
		if(CurSlide){
			$('#'+CurSlide).addClass('banner-slide-pre');
			$('#'+CurSlide).next().addClass('banner-slide-cur');
			$('#'+CurSlide).next().next().addClass('banner-slide-nex');
			$('#'+CurSlide).next().next().next().addClass('banner-slide-nex');
		}else{
			$("#banner-1").addClass('banner-slide-pre');
			$("#banner-2").addClass('banner-slide-cur');
			$("#banner-3").addClass('banner-slide-nex');
			$("#banner-4").addClass('banner-slide-nex');
		}
	}else{
	}
	if(CurSlide=='banner-6'){
		$(".bottom-container").hide();
	}
}
