$(document).ready(function () {
	var ScreenWidth=$(window).width();
	$("#AddTagsDiv").width(ScreenWidth);
	$("#AddTagsDiv").height(ScreenWidth);
	$("#ShowImageDiv").width(ScreenWidth);
	$("#ShowImageDiv").height(ScreenWidth);
	DrawImg('images/1.png');
	function ImageInfo(){
		var ImageInfoArr=[];
		var x = $('#HideImgDiv').offset().left; 
		var y = $('#HideImgDiv').offset().top; 
		var width=$("#HideImgDiv").width();
		var height=$("#HideImgDiv").height();
		ImageInfoArr=[x,y,width,height];
		$("#ShowImageDiv").css({'left':ImageInfoArr[0]+'px','top':ImageInfoArr[1]+'px','width':ImageInfoArr[2]+'px','height':ImageInfoArr[3]+'px'});
	}

	//获取取点位置
	function windowToDiv(imgdiv,x, y) {
		var bbox = imgdiv.getBoundingClientRect();
		return {
			x: x - bbox.left * ($(imgdiv).width()/bbox.width), 
			y: y - bbox.top * ($(imgdiv).height()/bbox.height)
		};
	}	

	//点击图片在图片上画点
	function SetPoint(x,y) {
		var CurPointId="NodeDiv"+CountPoint;
		var pointHtml='<div class="NodeDiv" id="'+CurPointId+'" style="left:'+x+'px; top:'+y+'px;"  curStyle="1"><div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div></div></div> ';
		$("#ShowNodeDiv").append(pointHtml);
		HammerDotPressFun($("#"+CurPointId)); 
		HammerTagPanFun($("#"+CurPointId));
		window.webkit.messageHandlers.AddNewTag.postMessage(CountPoint);//IOS
		CountPoint++;
	}

	//点击图片添加点
	var ImageSizeFlag=1;
	var HammerDrawDot = propagating(new Hammer($("#ShowImageDiv").get(0)));
	HammerDrawDot.on("tap", function (event) {
		if(ImageSizeFlag){
			ImageInfo();
			ImageSizeFlag=0;
		}
		var loc=windowToDiv(event.target,event.pointers[0].clientX,event.pointers[0].clientY);
		var x=parseInt(loc.x);
		var y=parseInt(loc.y);
		SetPoint(x, y);
	});
});

	//删除某个标签后重命名图中剩余标签的ID
	function RenameImageTag(){ 
		var CurTagId=$("#ShowNodeDiv").find(".NodeDiv");
		$.each(CurTagId, function(i,val){      
			$(this).attr("id","NodeDiv"+i);
		});
	}

	function HammerDotPressFun(Obj){//长按（点）删除
		var HammerDotPress = new Hammer($(Obj).find(".note_dot").get(0));
		HammerDotPress.on("press", function (event) {
			if (confirm('确定删除所选？')) {
				var ObjDivId=event.target.parentNode.parentNode.id;
				var ImageId=ObjDivId.split('NodeDiv')[0];
				CountPoint--;
				$("#"+ObjDivId).remove();
				RenameImageTag();
			}
		});
	}

	function HammerDotTapFun(Obj){//单击（点）来切换标签样式
		var HammerDotTap =  propagating(new Hammer($(Obj).find(".note_dot").get(0)));
		HammerDotTap.off("tap").on("tap", function (event) {
			console.log(event);
			var ObjDivId=event.target.parentNode.parentNode.id;
			var ObjDiv=$("#"+ObjDivId);
			var CurStyle=ObjDiv.attr("curstyle");
			var NewStyle=1;
			if(CurStyle==4){
				var NewStyle=1;
			}else{
				var NewStyle=CurStyle*1+1;
			}
			var CurTag=ObjDiv.find(".note_text");
			var tagsText=[];
			var tagsNum=[];
			var textsNum=[];
			$.each(CurTag, function(i,val){      
				tagsText.push(CurTag.eq(i).html());
				var tagNum=CurTag.eq(i).attr("tagnum");
				tagsNum.push(tagNum);
				var textNum=CurTag.eq(i).attr("textnum");
				textsNum.push(textNum);
			});
			AppendTag(ObjDiv,tagsText.length,NewStyle,tagsText,tagsNum,textsNum);
			ObjDiv.attr("curstyle",NewStyle);
			event.stopPropagation();
		});
	}

	function HammerTextFun(Obj){//单击（文字）进行编辑
		var ObjTextCount=$(Obj).find(".note_text").length;
		for(var i=0;i<ObjTextCount;i++){
			var HammerText = propagating(new Hammer($(".note_text").get(i)));
			HammerText.off("tap").on("tap", function (event) {
				console.log(event);
				var ObjDivId=event.target.parentNode.parentNode.id;
				var TagId=ObjDivId.split('NodeDiv')[1];
				var ObjDiv=$("#"+ObjDivId);
				var tagsText=DoImageTagText(ObjDiv);
				var TagJson={"ID":"","Brand":"","Product":"","Currency":"","Price":"","Country":"","Location":""};
				TagJson.ID=TagId;
				TagJson.Brand=tagsText[0];
				TagJson.Product=tagsText[1];
				TagJson.Currency=tagsText[2];
				TagJson.Price=tagsText[3];
				TagJson.Country=tagsText[4];
				TagJson.Location=tagsText[5];
				console.log(TagId);
				console.log(TagJson);
				window.webkit.messageHandlers.UpdateTag.postMessage(TagJson);//IOS
				event.stopPropagation();
			});
		}
	}

	function HammerTagPanFun(Obj){//移动
		var ObjDivCount=$(Obj).find("div").length;
		for(var i=0;i<ObjDivCount;i++){
			var HammerTagPan = new Hammer($(Obj).find("div").get(i));
			HammerTagPan.on("pan", function (event) {
				if(event.deltaX>10||event.deltaX<-10||event.deltaY>10||event.deltaY<-10)
				{
					var maxW=$("#HideImgDiv").width();
					var maxH=$("#HideImgDiv").height();
					var ObjX=event.pointers[0].clientX+event.deltaX;
					var ObjY=event.pointers[0].clientY+event.deltaY;
					var objNode=event.target.parentNode.parentNode;
					if(ObjX<0){
						ObjX=0;
					}else if(ObjX>maxW){
						ObjX=maxW;
					}else{

					}
					if(ObjY<50){
						ObjY=50;
					}else if(ObjY>maxH-35){
						ObjY=maxH-35;
					}else{

					}
					objNode.style.left=ObjX+"px";
					objNode.style.top=ObjY+"px";
				}
			});
		}
	}

	var CountPoint=0;
	function DoImageTagText(ObjDiv){
		var CurTag=ObjDiv.find(".note_text");
		var tagsText=["","","","","",""];
		var tagsInput=[];
		var tagsNum=[];
		var textsNum=[];
		$.each(CurTag, function(i,val){  
			var tagNum=CurTag.eq(i).attr("tagnum");
			tagsNum.push(tagNum);
			var textNum=CurTag.eq(i).attr("textnum");
			textsNum.push(textNum);
		});	

		for(var i=0;i<tagsNum.length;i++){
			var CurText=CurTag.eq(i).html();
			if(textsNum[i]==0){
				var CurText1=CurText.split(' ')[0];
				var CurText2=CurText.split(' ')[1];
			}else if(textsNum[i]==1){
				var CurText1=CurText;
				var CurText2="";
			}else if(textsNum[i]==2){
				var CurText1="";
				var CurText2=CurText;
			}else{

			}
			if(tagsNum[i]*1==0){
				tagsText[0]=CurText1;
				tagsText[1]=CurText2;
			}else if(tagsNum[i]*1==1){
				tagsText[3]=CurText1;
				tagsText[2]=CurText2;
			}else if(tagsNum[i]*1==2){
				tagsText[4]=CurText1;
				tagsText[5]=CurText2;
			}else{

			}
		}
		return tagsText;
	}
	//在图片加入所填标签（AppendDiv）
	function AppendTag(Obj,LineNum,SytleNum,TagArr,TagNum,textNum){
		var TagHtml="";
		if(LineNum==1)	{
			if(SytleNum==1){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
			}else if(SytleNum==2){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg note_dot_right"></div><div class="note_dot_around note_dot_around_right"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
			}else if(SytleNum==3){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_text noteFLeft noteTextLeft" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
			}else if(SytleNum==4){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line5 noteRight3"></div><div class="note_text noteFLeft  tagNum="'+TagNum[0]+'""  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
			}else{
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
			}
		}else if(LineNum==2)	{
			if(SytleNum==1){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1"></div><div class="note_line note_line2"></div><div class="note_text noteFLeft noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft" tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
			}else if(SytleNum==2){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg noteRight9"></div><div class="note_dot_around noteRight5"></div><div class="note_line note_line1 noteRight"></div><div class="note_line note_line2 noteRight"></div><div class="note_text noteFRight noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
			}else if(SytleNum==3){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_line note_line4"></div><div class="note_text noteFLeft noteTextTop4 noteTextLeft"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
			}else if(SytleNum==4){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line5 noteRight3"></div><div class="note_line note_line6 noteRight3"></div><div class="note_text noteFRight noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
			}else{
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1"></div><div class="note_line note_line2"></div><div class="note_text noteFLeft noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
			}
		}else if(LineNum==3)	{
			if(SytleNum==1){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1 noteLineHeight noteLineTop"></div><div class="note_line note_line2 noteLineHeight"></div><div class="note_text noteFLeft noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}else if(SytleNum==2){
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg noteRight9"></div><div class="note_dot_around noteRight5"></div><div class="note_line note_line1 noteLineHeight noteLineTop noteRight"></div><div class="note_line note_line2 noteLineHeight noteRight"></div><div class="note_text noteFRight noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFRight noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}else if(SytleNum==3){
				$("#TempText1").html(TagArr[2]);
				var LineML=-($("#TempText1").width()+40);
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_line note_line4"></div><div class="note_line note_line5 noteLeft2"></div><div class="note_text noteFLeft noteTextTop4 noteTextLeft" tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop2" style="margin-left:'+LineML+'px"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}else if(SytleNum==4){
				$("#TempText2").html(TagArr[2]);
				var LineMR=-($("#TempText2").width()+62);
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line3 noteRight50"></div><div class="note_line note_line5 noteRight3"></div><div class="note_line note_line6 noteRight3"></div><div class="note_text noteFRight noteTextTop4" tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight" tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFRight noteTextTop2" style="margin-right:'+LineMR+'px"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}else{
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1 noteLineHeight noteLineTop"></div><div class="note_line note_line2 noteLineHeight"></div><div class="note_text noteFLeft noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}
		}else{
			TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'" >'+TagArr[0]+'</div></div>';
		}/*
		return TagHtml;*/
		Obj.html(TagHtml);
		HammerDotTapFun(Obj);
		HammerTextFun(Obj);
		HammerDotPressFun(Obj); 
		HammerTagPanFun(Obj);
	}
	//处理标签空格等
	function CheckTagDetail(tags){
		var linetags=[];
		var TextNumTemp=[];
		if(tags[0]!=""&&tags[1]!=""){
			linetags[0]=tags[0]+" "+tags[1];
			TextNumTemp[0]=0;
		}else if(tags[0]!=""){
			linetags[0]=tags[0];
			TextNumTemp[0]=1;
		}else if(tags[1]!=""){
			linetags[0]=tags[1];
			TextNumTemp[0]=2;
		}else{
			linetags[0]="";
		}

		if(tags[2]!=""&&tags[3]!=""){
			linetags[1]=tags[3]+" "+tags[2];
			TextNumTemp[1]=0;
		}else if(tags[2]!=""){
			linetags[1]=tags[2];
			TextNumTemp[1]=2;
		}else if(tags[3]!=""){
			linetags[1]=tags[3];
			TextNumTemp[1]=1;
		}else{
			linetags[1]="";
		}

		if(tags[4]!=""&&tags[5]!=""){
			linetags[2]=tags[4]+" "+tags[5];
			TextNumTemp[2]=0;
		}else if(tags[4]!=""){
			linetags[2]=tags[4];
			TextNumTemp[2]=1;
		}else if(tags[5]!=""){
			linetags[2]=tags[5];
			TextNumTemp[2]=2; 
		}else{
			linetags[2]="";
		}
		var TagArr=[];
		var TagNum=[];
		var TextNum=[];
		var LineNum=0;
		for(var i=0;i<3;i++){
			if(linetags[i]!=""){
				TagArr.push(linetags[i]);
				TagNum.push(i);
				TextNum.push(TextNumTemp[i]);
				LineNum++;
			}
		}
		return [LineNum,TagArr,TagNum,TextNum]
	}

	//确认标签内容（OC端）
	function SureAddTag(TagsJson,CurTagId){/*
		var CurTagId=0;
		var TagsJson={"Brand":"雅诗兰黛","Product":"眼霜","Currency":"人民币","Price":"120","Country":"中国","Location":"上海"};*/
		var TagsArr=[TagsJson.Brand,TagsJson.Product,TagsJson.Currency,TagsJson.Price,TagsJson.Country,TagsJson.Location];
		var DoTag=CheckTagDetail(TagsArr);
		var CurTagId=CurTagId*1;
		var curStyle=$("#NodeDiv"+CurTagId).attr("curstyle");
		if(DoTag[0]==0){
			$("#NodeDiv"+CurTagId).remove();
		}else{
			AppendTag($("#NodeDiv"+CurTagId),DoTag[0],curStyle,DoTag[1],DoTag[2],DoTag[3]);
		}
	}
	//TagsJson（OC端）
	function GetTagsJson(){
		var curTagDetail=[];
		for(var i=0;i<CountPoint;i++){
			var CurTagId="NodeDiv"+i;
			var CurTagObj=$("#"+CurTagId);
			var tagsText=DoImageTagText(CurTagObj);
			var curTagJson={"Detail":[{"Brand":"","Product":"","Currency":"","Price":"","Country":"","Location":""}],"SetPoint":"","TagType":""};
			curTagJson.SetPoint=""+"["+CurTagObj.position().left+","+CurTagObj.position().top+"]"+"";
			curTagJson.TagType=CurTagObj.attr("curstyle");
			curTagJson.Detail[0].Brand=tagsText[0];
			curTagJson.Detail[0].Product=tagsText[1];
			curTagJson.Detail[0].Price=tagsText[2];
			curTagJson.Detail[0].Currency=tagsText[3];
			curTagJson.Detail[0].Country=tagsText[4];
			curTagJson.Detail[0].Location=tagsText[5];
			curTagDetail.push(curTagJson);
		}
		var curTagDetailJson=JSON.stringify(curTagDetail);
		console.log(curTagDetailJson);
		window.webkit.messageHandlers.goNext.postMessage(curTagDetailJson);//IOS
	}
	//获取图片（OC端）
	function DrawImg(BaseUrl){
		$("#HideImgDiv").attr("src",BaseUrl);
	}