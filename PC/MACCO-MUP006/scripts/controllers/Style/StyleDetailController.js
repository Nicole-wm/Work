maccoApp.controller('StyleDetailController', ['$scope','$window','$http','$modal','Upload','$rootScope',function($scope, $window,$http,$modal,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Style/CheckStyleKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Style/CheckStyleKeyNo';
	$http.post(checkUrl).success(function(data){
		$http.post(checkUrl2).success(function(result){
			if(data.Data==result.Data){
			}else{
				$("#mask").show();
				alert("后台数据发生错误，无法添加，详情咨询管理员！");
				$scope.ReturnBack();
				$("#mask").hide();
			}
		});
	});

	var type = window.getQueryStringByKey('Type');
	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';
	$http.get(categoryUrl).success(function(data){
		if(data.IsSuccess) {
			$scope.Categories = data.Data;
		}
	});

	bannerpic.onload = function() {
		var picWidth=$("#bannerpic").width();
		var picHeight=$("#bannerpic").height();
		if(picWidth!=140||picHeight!=110){
			$("#selectBannerPic").attr("src","");
			$scope.Banner=undefined;
			$scope.$apply(); 
			setTimeout("alert('上传图片宽高应为140px*110px，请重新上传!')",0);
		}
	}

	$scope.Plies=[
	{ID:'0',Desc:"0"},
	{ID:'1',Desc:"1"},
	{ID:'2',Desc:"2"},     
	{ID:'3',Desc:"3"}
	];

	var files = [];
	var filesName = [];
	$scope.DotArr=[];
	$scope.count=0;
	//取点
	function windowTocanvas(canvas,x, y) {
		var bbox = canvas.getBoundingClientRect();
		return {
			x: x - bbox.left * (canvas.width / bbox.width), 
			y: y - bbox.top * (canvas.height / bbox.height)
		};
	}
	//画点
	function ToDraw(canvas,x,y,i){
		cxt = canvas.getContext("2d");  
		cxt.beginPath();
		cxt.arc(x,y,5,0,360,false);
		cxt.fillStyle="#ffffff";
		ctx.fillText(i,x+10,y+10);
		cxt.fill();
		cxt.lineWidth=2;
		cxt.strokeStyle="#FF99CC";
		cxt.stroke();
		cxt.closePath();
	}

	//画Canvas
	function ToCanvas(fileURL){
		$("#CanvasDiv").empty();
		var canvasdiv=$('<canvas></canvas>');
		canvasdiv.attr('id','Imgcanvas');  
		canvasdiv.appendTo("#CanvasDiv"); 
		var canvas = document.getElementById("Imgcanvas"); 
		ctx = canvas.getContext("2d"); 
		img = new Image(); 
		img.src = fileURL;  
		img.onload = function() {
			canvasdiv.css('background',"#FF99CC"); 
			canvasdiv.attr('width',img.width); 
			canvasdiv.attr('height',img.height);
			ctx.drawImage(img, 0, 0);  
			if($scope.DotArr.length>0){
				$("#DotBtn").click();
			}
		} 
		$("#DotBtn").click(function(){
			for(i=0;i<$scope.count;i++){
				var x=$scope.DotArr[i][0];
				var y=$scope.DotArr[i][1];
				var canvas = document.getElementById("Imgcanvas"); 
				ToDraw(canvas,x,y,i);
			}
		});

		Imgcanvas.onclick=function(event){
			$("#UndoBtn").show();
			$("#ReDrawBtn").show();
			var loc=windowTocanvas(Imgcanvas,event.clientX,event.clientY);
			var x=parseInt(loc.x);
			var y=parseInt(loc.y);
			ToDraw(Imgcanvas,x, y,$scope.count);
			$scope.DotArr[$scope.count++]=[x,y];
		}
	}

	function noChangeImg(){
		var fileURL=$("#BigImgDiv").attr("src");
		if(fileURL){
			ToCanvas(fileURL,$scope.DotArr);
		}
	}

	function InitImg(ObjFile,fileURL){
		$("#BigImgDiv").attr("src",fileURL);
		$scope.count=0;
		if(ObjFile){
			$("#UndoBtn").hide("slow");
			$("#ReDrawBtn").hide("slow");
			ToCanvas(fileURL);
			files[0]=ObjFile;
			filesName[0]="AlphaImage";
		}
	}

	$scope.Uploadimage = function(){
		$("#ImgFile").click();
		$("#ImgFile").on("change",function(){
			var ObjFile = this.files[0];
			var fileURL = URL.createObjectURL(ObjFile);
			InitImg(ObjFile,fileURL);
		});
	}


	$scope.BtnUploadimage = function(){
		$("#ImgFile").click();
		$("#ImgFile").off("change"); 
		$("#ImgFile").change(function(){
			var ObjFile = this.files[0];
			var fileURL = URL.createObjectURL(ObjFile);
			var img = new Image(); 
			img.src = fileURL;  
			img.onload = function(){
				var picWidth=img.width;
				var picHeight=img.height;
				if($scope.SelectedCategoy==4){
					if(picWidth!=242||picHeight!=300){
						$("#BigImgDiv").attr("src","");
						$scope.BigImg=undefined;
						$scope.$apply(); 
						setTimeout("alert('上传图片宽高应为242px*300px，请重新上传!')",0);
					}else{
						$scope.DotArr=[];
						InitImg(ObjFile,fileURL);
					}
				}else{
					if(picWidth!=350||picHeight!=250){
						$("#BigImgDiv").attr("src","");
						$scope.BigImg=undefined;
						$scope.$apply(); 
						setTimeout("alert('上传图片宽高应为350px*250px，请重新上传!')",0);
					}else{
						$scope.DotArr=[];
						InitImg(ObjFile,fileURL);
					}
				} 
			}
		});
	}

	$scope.ReToCanvas = function(){
		$scope.DotArr=[];
		FetchDotArr=[];
		$scope.count=0;
		noChangeImg();
		$("#UndoBtn").hide("slow");
		$("#ReDrawBtn").hide("slow");
	}

	$scope.UndoToDraw = function(){
		if($scope.count==1){
			$("#UndoBtn").hide("slow");
			$("#ReDrawBtn").hide("slow");
		}
		var objDotNum=$scope.count-1;
		$scope.DotArr.splice(objDotNum, 1);
		noChangeImg();
		$scope.count--;
	}

	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.NeedBanner = true;
		$scope.chooseImg = true;
		$scope.Submit = function() {
			var CurArr=$scope.DotArr;
			$("#mask").show();
			var url = window.$servie + 'AdminApi/Style/CreateStyle';
			var create_url = window.$ProductionService + 'AdminApi/Style/CreateStyle';

			var fields = {
				UserName:$rootScope.AdminUserName,
				CategoryID: $scope.SelectedCategoy,
				Level: $scope.SelectedPlies,
				SetPoint:CurArr,
				CourseDesc:$scope.CourseDesc,
				apiKey : window.$apiKey
			};

			if($scope.Banner==null){
				alert("提示图没有上传");
				return false;
			}else{
				files.push($scope.Banner);
				filesName.push("Thumbnail");
			}

			if($scope.CourseImage==null){
			}else{
				files.push($scope.CourseImage);
				filesName.push("CourseImage");
			}
			
			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: files,
					fileFormDataName:filesName
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(url,function(data) {
				if(data.IsSuccess) {
					if(data.Data.IsCreated) {
						postCreateFunc(create_url,function(result) {
							if(result.IsSuccess) {
								if(result.Data.IsCreated) {
									if (data.Data.KeyNo==result.Data.KeyNo) {
										$scope.ReturnBack();
										$("#mask").hide();
									}else{
										alert("后台添加数据发生错误，详情咨询管理员！");
										$scope.ReturnBack();
										$("#mask").hide();
									}
								} else {
									$window.alert('出错');
									$("#mask").hide();
								}
							} else {
								$window.alert('出错');
								$("#mask").hide();
							}
						});
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			});
		};	
	}
	
	if (type == 'Visit') {
		$scope.canEdit = false;
		$scope.NeedBanner = false;
		$scope.chooseImg = false;
		var StyleID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Style/FetchStyleDetail';

		$http.post(visitUrl,{ID:StyleID}).success(function(data){
			if(data.IsSuccess) {
				$scope.KeyNo = data.Data.KeyNo;
				$scope.ImageUrl = data.Data.Thumbnail;
				$scope.SelectedCategoy = data.Data.CategoryID;
				$scope.SelectedPlies = data.Data.Level;
				$scope.BigImgUrl = data.Data.AlphaImage;
				$scope.DotArr=JSON.parse(data.Data.SetPoint);
				$scope.count=$scope.DotArr.length;
				$scope.CourseDesc=data.Data.CourseDesc;
				$scope.CourseImageUrl=data.Data.CourseImageUrl;
				DoCanvasDot();
			}
		});

		function DoCanvasDot(){
			var fileURL=$scope.BigImgUrl;
			if(fileURL){
				ToCanvas(fileURL);
			}
		}
	}

	if (type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = true;
		$scope.NeedBanner = false;
		$scope.chooseImg = true;
		var StyleID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Style/FetchStyleDetail';

		$http.post(visitUrl,{ID:StyleID}).success(function(data){
			if(data.IsSuccess) {
				$scope.KeyNo = data.Data.KeyNo;
				$scope.ImageUrl= data.Data.Thumbnail;
				$scope.SelectedCategoy = data.Data.CategoryID;
				$scope.SelectedPlies = data.Data.Level;
				$scope.BigImgUrl = data.Data.AlphaImage;
				$scope.DotArr=JSON.parse(data.Data.SetPoint);
				$scope.count=$scope.DotArr.length;
				$scope.CourseDesc=data.Data.CourseDesc;
				$scope.CourseImageUrl=data.Data.CourseImageUrl;
				if($scope.count!=0){
					$("#UndoBtn").show();
					$("#ReDrawBtn").show();
				}
				DoCanvasDot();
			}
		});

		function DoCanvasDot(){
			var fileURL=$scope.BigImgUrl;
			if(fileURL){
				ToCanvas(fileURL);
			}
		}

		$scope.Submit = function() {
			var CurArr=$scope.DotArr;
			$("#mask").show();
			var url = window.$servie + 'AdminApi/Style/UpdateStyle';
			var create_url = window.$ProductionService + 'AdminApi/Style/UpdateStyle';

			var fields = {
				KeyNO:$scope.KeyNo,
				CategoryID: $scope.SelectedCategoy,
				Level: $scope.SelectedPlies,
				SetPoint:CurArr,
				CourseDesc:$scope.CourseDesc,
				apiKey : window.$apiKey
			};

			if($scope.Banner != null) {
				files.push($scope.Banner);
				filesName.push('Thumbnail');
			}
			
			if($scope.CourseImage!=null){
				files.push($scope.CourseImage);
				filesName.push("CourseImage");
			}

			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: files,
					fileFormDataName:filesName
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(url,function(data) {
				if(data.IsSuccess) {
					if(data.Data.IsUpdated) {
						if (!window.$isTest) {
							postCreateFunc(create_url,function(data) {
								if(data.IsSuccess) {
									if(data.Data.IsUpdated) {
										$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
										$("#mask").hide();
									} else {
										$window.alert('出错');
										$("#mask").hide();
									}
								} else {
									$window.alert('出错');
									$("#mask").hide();
								}
							});
						}else{
							$window.alert('出错');
							$("#mask").hide();	
						}
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			});
		};	
	}


	$scope.ReturnBack = function(token) {
		$window.location.href = '/StyleManager/StyleManager.html?Token=' + $rootScope.Token;
	};

}]);
