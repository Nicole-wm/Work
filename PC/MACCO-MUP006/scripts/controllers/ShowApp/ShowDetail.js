maccoApp.controller('ShowDetailController', ['$sce','$scope','$window','$http','Upload','$rootScope','$modal',function($sce,$scope, $window,$http,Upload,$rootScope,$modal) {
	var type = getQueryStringByKey('Type');

    //选择图片
    var ShowImage= [];
    var filenames=[];
    $scope.Uploadimage = function(Id){
    	$("#ImgFile"+Id).click();
    	$("#ImgFile"+Id).on("change",function(event){
    		var ObjFile = this.files[0];
    		var fileURL = URL.createObjectURL(ObjFile);
    		$scope.showimgs[Id].ImageUrl=fileURL;
    		img = new Image();  
    		img.src = fileURL;  
    		img.onload = function() {
    			$("#ShowNodeDiv"+Id).find(".NodeDiv").remove();
    			$("#ShowImageDiv"+Id).show();
    			$("#HideImgDiv"+Id).attr("src",fileURL);
    			$scope.CountPoint[Id]=0;
    		} 
    		changefile("imageUrl"+Id);
    		function changefile(objfilename){//判断是否存在对应文件对应名字
    			var ObjNameNum=jQuery.inArray(objfilename,filenames);
    			if(ObjNameNum==-1){
    				filenames.push(objfilename);
    				ShowImage.push(ObjFile);
    			}else{
    				ShowImage[ObjNameNum]=ObjFile;
    			}
    		}
    		event.stopPropagation();
    	});
    }

	//点击图片在图片上画点
	function SetPoint(Id,x, y) {
		if($("#InputTagDiv"+Id).is(":hidden")){
			var CurPointId=Id+"NodeDiv"+$scope.CountPoint[Id];
			$scope.CurPointId=$scope.CountPoint[Id];
			var pointHtml='<div class="NodeDiv" id="'+CurPointId+'" style="left:'+x+'px; top:'+y+'px;"  curStyle="1"><div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div></div></div> ';
			$("#ShowNodeDiv"+Id).append(pointHtml);
			$("#InputTagDiv"+Id).show();
			$("#InputTagDiv"+Id).attr("curtagid",CurPointId);
			var newAddTag=$(".TagInputs"+Id).find("input");
			$.each(newAddTag, function(i,val){  
				newAddTag.eq(i).val("");
			});	
			$scope.CountPoint[Id]++; 
		}else{  
			
		}
	}

	//获取取点位置
	function windowToDiv(imgdiv,x, y) {
		var bbox = imgdiv.getBoundingClientRect();
		return {
			x: x - bbox.left * ($(imgdiv).width()/bbox.width), 
			y: y - bbox.top * ($(imgdiv).height()/bbox.height)
		};
	}

	//在图片加入所填标签（AppendDiv）
	function AppendTag(LineNum,SytleNum,TagArr,TagNum,textNum){
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
				var LineMR=-($("#TempText2").width()+61);
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line3 noteRight50"></div><div class="note_line note_line5 noteRight3"></div><div class="note_line note_line6 noteRight3"></div><div class="note_text noteFRight noteTextTop4" tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight" tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFRight noteTextTop2" style="margin-right:'+LineMR+'px"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}else{
				TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1 noteLineHeight noteLineTop"></div><div class="note_line note_line2 noteLineHeight"></div><div class="note_text noteFLeft noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
			}
		}else{
			TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'" >'+TagArr[0]+'</div></div>';
		}
		return TagHtml;
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

	//处理所操作的当前标签（新建或编辑）
	function CheckAllTag(ImageId,CurTagId,curStyle){
		var CurTagDetails=$(".TagInputs"+ImageId).find("input");
		var tags=[];
		$.each(CurTagDetails, function(i,val){      
			tags.push(CurTagDetails.eq(i).val());
		});

		var DoTag=CheckTagDetail(tags);
		if(DoTag[0]==0){
			$("#"+CurTagId).remove();
		}else{
			var NewHtml=AppendTag(DoTag[0],curStyle,DoTag[1],DoTag[2],DoTag[3]);
			$("#"+CurTagId).html(NewHtml);
			var ShowNodeDivHtml=$("#ShowNodeDiv"+ImageId).html();
			$scope.showimgs[ImageId].NodeDivHtml=$sce.trustAsHtml(ShowNodeDivHtml);
		}
	}
	if(type != 'Visit'){
		var TimeFn = null;
		//长按（点或者文字）移动标签
		$(document).on('mousedown','.note_dot_around,.note_dot,.note_text', function (event) {
			clearTimeout(TimeFn); 
			TimeFn = setTimeout(function() {  
				var bar=event.target;
				var box=bar.parentNode.parentNode;
				var ImgDiv=box.parentNode.parentNode.id;
				var maxW=$("#"+ImgDiv).width();
				var maxH=$("#"+ImgDiv).height();
				startDrag(bar,box,maxW,maxH);
				console.log("开始移动");
			},800);  
			event.stopPropagation();
		}); 

		//单击（点）来切换标签样式
		$(document).on('click','.note_dot_around,.note_dot', function (event) {
			clearTimeout(TimeFn);
			TimeFn = setTimeout(function(){
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
				var NewHtml=AppendTag(tagsText.length,NewStyle,tagsText,tagsNum,textsNum);
				ObjDiv.html(NewHtml);
				ObjDiv.attr("curstyle",NewStyle);
				var ImageId=ObjDivId.split('NodeDiv')[0];
				var ShowNodeDivHtml=$("#ShowNodeDiv"+ImageId).html();
				$scope.showimgs[ImageId].NodeDivHtml=$sce.trustAsHtml(ShowNodeDivHtml);
			},300);
			event.stopPropagation();
		});

		//删除某个标签后重命名图中剩余标签的ID
		function RenameImageTag(ImageId){ 
			var CurTagId=$("#ShowNodeDiv"+ImageId).find(".NodeDiv");
			$.each(CurTagId, function(i,val){      
				$(this).attr("id",ImageId+"NodeDiv"+i);
			});
		}

		//双击删除标签
		$(document).on('dblclick','.note_dot_around,.note_dot,.note_text', function (event) {
			clearTimeout(TimeFn);
			if (confirm('确定删除所选？')) {
				var ObjDivId=event.target.parentNode.parentNode.id;
				var ImageId=ObjDivId.split('NodeDiv')[0];
				$scope.CountPoint[ImageId]--;
				$("#"+ObjDivId).remove();
				RenameImageTag(ImageId);
			}
			event.stopPropagation();
		}); 

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

		//单击（文字）进行编辑
		$(document).on('click','.note_text', function (event) {
			clearTimeout(TimeFn);
			TimeFn = setTimeout(function(){
				var ObjDivId=event.target.parentNode.parentNode.id;
				var ImageId=ObjDivId.split('NodeDiv')[0];
				$("#InputTagDiv"+ImageId).show();
				$("#InputTagDiv"+ImageId).attr("curtagid",ObjDivId);
				var ObjDiv=$("#"+ObjDivId);
				var tagsText=DoImageTagText(ObjDiv);
				var UpdateTag=$(".TagInputs"+ImageId).find("input");
				$.each(UpdateTag, function(i,val){  
					UpdateTag.eq(i).val(tagsText[i]);
				});	
			},300);
			event.stopPropagation();
		});

		//点击图片添加点
		$(document).on('click','.ShowImageDiv', function (event) {
			var loc=windowToDiv(this,event.clientX,event.clientY);
			var x=parseInt(loc.x);
			var y=parseInt(loc.y);
			var ObjID=event.target.id;
			var Id=parseInt(ObjID.replace(/[^0-9]/ig,""));
			SetPoint(Id,x, y);
			event.stopPropagation();
		});

		//标签详情确认
		$scope.SureTag = function(ImageId){
			$("#InputTagDiv"+ImageId).hide();
			var CurTagId=$("#InputTagDiv"+ImageId).attr("curtagid");
			var curStyle=$("#"+CurTagId).attr("curstyle");
			if(curStyle){
				curStyle=curStyle*1;
			}else{
				curStyle=1;
			}
			CheckAllTag(ImageId,CurTagId,curStyle);
		};

		//标签详情取消
		$scope.CancelTag = function(ImageId){
			$("#InputTagDiv"+ImageId).hide();
			var TagId=$scope.CountPoint[ImageId]-1;
			var CurTagId=$("#InputTagDiv"+ImageId).attr("curtagid");
			var curStyle=$("#"+CurTagId).attr("curstyle");
			if(curStyle){
				curStyle=curStyle*1;
			}else{
				curStyle=1;
			}
			var IsNewTag=$("#"+ImageId+"NodeDiv"+TagId).find(".note_text");
			if(IsNewTag.length!=0){
				CheckAllTag(ImageId,CurTagId,curStyle);
			}else{
				$scope.CountPoint[ImageId]--;
				$("#"+ImageId+"NodeDiv"+TagId).remove();
			}
		};
	}

	function VisitShowIndex(){
		var ShowID = getQueryStringByKey("ID");
		var visitUrl =  window.$AppApiService + 'AdminApi/Showindex/FetchShowIndexDetail';

		$http.post(visitUrl,{ID:ShowID,Category:0}).success(function(data){
			if(data.IsSuccess) {
				$scope.UID = data.Data[0].UID;
				var url = window.$AppApiService + 'AdminApi/Systemuser/FetchSystemUser';
				var param = {
					UID:$scope.UID 
				};
				$http.post(url, param).success(function(data){
					if(data.IsSuccess) {
						$scope.Avatar = data.Data[0].Avatar;
						$scope.Username = data.Data[0].NickName;
					}
				});
				$scope.ShowDesc = data.Data[0].Description;
				$scope.CountPoint=[];
				$scope.showimgs=data.Data[0].ShowIndexDetail;
				var CountImg=$scope.showimgs.length;
				for(var i=0;i<CountImg;i++){
					$scope.CountPoint[i]=$scope.showimgs[i].TagCount*1;
					var CountTag=$scope.showimgs[i].TagCount*1;
					var CreateNodeDiv='';
					for(var j=0;j<CountTag;j++){
						var objShow=$scope.showimgs[i].TagDetail[j];
						var GetStyle=objShow.Type;
						var GetPoint=JSON.parse(objShow.SetPoint);
						var GetPointX=GetPoint[0];
						var GetPointY=GetPoint[1];
						var GetTags=[objShow.Brand,objShow.Product,objShow.Currency,objShow.Price,objShow.Country,objShow.Location];
						var DoGetTags=CheckTagDetail(GetTags);
						var GetHtml=AppendTag(DoGetTags[0],GetStyle,DoGetTags[1],DoGetTags[2],DoGetTags[3]);
						CreateNodeDiv=CreateNodeDiv+'<div class="NodeDiv" id="'+i+'NodeDiv'+j+'" style="left:'+GetPointX+'px;top:'+GetPointY+'px;" curstyle="'+GetStyle+'">'+GetHtml+'</div>';
					}
					$scope.showimgs[i].NodeDivHtml=$sce.trustAsHtml(CreateNodeDiv);
				}
			}
		});
	}
	if (type == 'Visit') {
		$scope.OperationType = '';
		$scope.canEdit = false;
		VisitShowIndex();
	}

	$scope.ReturnBack = function() {
		$window.location.href = '/ShowAppManagement/ShowManager.html?Token=' + $rootScope.Token;
	};

}]);
