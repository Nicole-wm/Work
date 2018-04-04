maccoApp.controller('HairDetailController', ['$scope','$window','$http','$modal','Upload','$rootScope',function($scope, $window,$http,$modal,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Hairstyle/CheckHairStyleKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Hairstyle/CheckHairStyleKeyNo';
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
	$scope.ISNumber = function(curImage,obj){
		var likeValue=obj;
		var BigNum=0;
		if(curImage==1){
			BigNum=$scope.Dots.length;
		}else if(curImage==2){
			BigNum=$scope.DisDots.length;
		}else{

		}
		var regex = /^[1-9]\d*|0$/;
		var isValidata = regex.test(likeValue);
		if(obj!=undefined){
			if(isValidata&&((obj*1)<BigNum)){
				return true;
			}else{
				if(curImage==1){
					$window.alert("效果图特征值输入有误（请输入效果图中所选点的序号）");
				}else if(curImage==2){
					$window.alert("距离图特征值输入有误（请输入距离图中所选点的序号）");
				}else{

				}
				return false;
			}
		}
	};

	var files = [];
	var filesName = [];
	$scope.Dots=[];
	$scope.BigImgUrl="";
	$scope.DisDots=[];
	$scope.SpecImage="";
	//取点位置
	function windowToDiv(imgdiv,x, y) {
		var bbox = imgdiv.getBoundingClientRect();
		return {
			x: x - bbox.left * ($(imgdiv).width()/bbox.width), 
			y: y - bbox.top * ($(imgdiv).height()/bbox.height)
		};
	}
	
	$scope.AddDot = function(event,id){
		if($scope.canEdit == true){
			$("#UndoBtn"+id).show();
			$("#ReDrawBtn"+id).show();
			var loc=windowToDiv(event.target,event.clientX,event.clientY);
			var x=parseInt(loc.x);
			var y=parseInt(loc.y);
			if(id==1){
				$scope.Dots.push([x,y]);
				var tempArr=[];
				for(var i=0;i<$scope.Dots.length;i++){
					tempArr.push($scope.Dots[i]);
				}
				$scope.Dots=tempArr;
			}
			if(id==2){
				$scope.DisDots.push([x,y]);
				var tempArr=[];
				for(var i=0;i<$scope.DisDots.length;i++){
					tempArr.push($scope.DisDots[i]);
				}
				$scope.DisDots=tempArr;
			}
		}
	}

	$scope.BtnUploadimage = function(id){
		$("#ImgFile"+id).click();
		$("#ImgFile"+id).on("change",function(){
			var ObjFile = this.files[0];
			var fileURL = URL.createObjectURL(ObjFile);
			if(ObjFile){
				$("#UndoBtn"+id).hide("slow");
				$("#ReDrawBtn"+id).hide("slow");
				if(id==1){
					$scope.BigImgUrl=fileURL;
					$scope.Dots=[];
					files[0]=ObjFile; 
					filesName[0]="AlphaImage";
				}
				if(id==2){
					$scope.SpecImage=fileURL;
					$scope.DisDots=[];
					files[1]=ObjFile; 
					filesName[1]="SpecImage";
				}
				$scope.$apply();
			}
		});
	}

	function CanvasDot(id){
		if(id==1){
			var tempArr=[];
			for(var i=0;i<$scope.Dots.length-1;i++){
				tempArr.push($scope.Dots[i]);
			}
			$scope.Dots=tempArr;
		}
		if(id==2){
			var tempArr=[];
			for(var i=0;i<$scope.DisDots.length-1;i++){
				tempArr.push($scope.DisDots[i]);
			}
			$scope.DisDots=tempArr;
		}
	}

	$scope.ReToCanvas = function(id){
		CanvasDot(id);
		$("#UndoBtn"+id).hide("slow");
		$("#ReDrawBtn"+id).hide("slow");
		if(id==1){
			$scope.Dots=[];
		}
		if(id==2){
			$scope.DisDots=[];
		}
	}

	$scope.UndoToDraw = function(id){
		if(id==1){
			if($scope.Dots.length==1){
				$("#UndoBtn"+id).hide("slow");
				$("#ReDrawBtn"+id).hide("slow");
			}
		}
		if(id==2){
			if($scope.DisDots.length==1){
				$("#UndoBtn"+id).hide("slow");
				$("#ReDrawBtn"+id).hide("slow");
			}
		}
		CanvasDot(id);
	}

	var type = getQueryStringByKey('Type');
	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.NeedSmallImg = true;
		$scope.chooseImg = true;
		$scope.chooseImg2 = true;
		$scope.Submit = function() {
			if($scope.SmallImg==null){
				alert("提示图没有上传");
				return false;
			}else{
				files.push($scope.SmallImg);
				filesName.push("Thumbnail");
			}
			var CurArr=$scope.Dots;
			if(CurArr.length==0){
				alert("请在效果图中选出选区。");
				return false;
			}
			var DisArr=$scope.DisDots;
			if(DisArr.length==0){
				alert("请在距离图中选出选区。");
				return false;
			}
			var check1=$scope.ISNumber(1,$scope.Feature1);
			var check2=$scope.ISNumber(1,$scope.Feature2);
			var check3=$scope.ISNumber(1,$scope.Feature3);
			var check4=$scope.ISNumber(1,$scope.Feature4);
			var check5=$scope.ISNumber(1,$scope.Feature5);
			var check6=$scope.ISNumber(1,$scope.Feature6);
			var check7=$scope.ISNumber(1,$scope.Feature7);
			var dcheck1=$scope.ISNumber(2,$scope.Distance1);
			var dcheck2=$scope.ISNumber(2,$scope.Distance2);
			var dcheck3=$scope.ISNumber(2,$scope.Distance3);
			var dcheck4=$scope.ISNumber(2,$scope.Distance4);
			var dcheck5=$scope.ISNumber(2,$scope.Distance5);
			var dcheck6=$scope.ISNumber(2,$scope.Distance6);
			var dcheck7=$scope.ISNumber(2,$scope.Distance7);
			var CheckNumFlag=check1&&check2&&check3&&check4&&check5&&check6&check7;
			var dCheckNumFlag=dcheck1&&dcheck2&&dcheck3&&dcheck4&&dcheck5&&dcheck6&dcheck7;
			if(CheckNumFlag&&dCheckNumFlag){
				var FeatureIndex={"Forehead":0,"LeftTopEarFace":0,"LeftBottomEarFace":0,"LeftTopCheekFace":0,"RightTopEarFace":0,"RightBottomEarFace":0,"RightTopCheekFace":0};
				FeatureIndex.Forehead=$scope.Feature1*1;
				FeatureIndex.LeftTopEarFace=$scope.Feature2*1;
				FeatureIndex.LeftBottomEarFace=$scope.Feature3*1;
				FeatureIndex.LeftTopCheekFace=$scope.Feature4*1;
				FeatureIndex.RightTopEarFace=$scope.Feature5*1;
				FeatureIndex.RightBottomEarFace=$scope.Feature6*1;
				FeatureIndex.RightTopCheekFace=$scope.Feature7*1;
				var DistanceIndex={"LeftEyeLeft":0,"RightEyeRight":0,"MouthLeft":0,"MouthRight":0,"FaceLeft":0,"FaceRight":0,"ForeHead":0};
				DistanceIndex.LeftEyeLeft=$scope.Distance1*1;
				DistanceIndex.RightEyeRight=$scope.Distance2*1;
				DistanceIndex.MouthLeft=$scope.Distance3*1;
				DistanceIndex.MouthRight=$scope.Distance4*1;
				DistanceIndex.FaceLeft=$scope.Distance5*1;
				DistanceIndex.FaceRight=$scope.Distance6*1;
				DistanceIndex.ForeHead=$scope.Distance7*1;
				$("#mask").show();
				var createUrl = window.$servie + 'AdminApi/Hairstyle/CreateHairStyle';
				var create_url = window.$ProductionService + 'AdminApi/Hairstyle/CreateHairStyle';
				var fields = {
					Title: $scope.Title,
					Category:1,
					SetPoint:CurArr,
					FeatureIndex:FeatureIndex,
					Distance:DisArr,
					DistanceIndex:DistanceIndex,
					apiKey:window.$apiKey
				};
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

				postCreateFunc(createUrl,function(data) {
					if(data.IsSuccess) {
						if (!window.$isTest) {
							postCreateFunc(create_url,function(result){
								if(result.IsSuccess) {
									if(result.Data.IsCreated) {
										if (data.Data.KeyNo==result.Data.KeyNo) {
											$scope.ReturnBack();
											$("#mask").hide();
										}else{
											alert("后台数据发生错误，无法添加，详情咨询管理员！");
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
						}else{
							$scope.ReturnBack();						
							$("#mask").hide();
						}	
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				});
			}
		};	

	}

	if (type == 'Visit') {
		$scope.canEdit = false;
		$scope.NeedSmallImg = false;
		$scope.chooseImg = false;
		$scope.chooseImg2 = false;
		var HairID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Hairstyle/FetchHairStyleDetail';

		$http.post(visitUrl,{ID:HairID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data.Title;
				$scope.SmallImgUrl = data.Data.Thumbnail;
				$scope.BigImgUrl = data.Data.AlphaImage;
				$scope.Dots=JSON.parse(data.Data.SetPoint);
				setTimeout(function(){
					$scope.SpecImage = data.Data.SpecImage;
					$scope.DisDots=JSON.parse(data.Data.Distance);
					$scope.$apply();
				},500);
				var FeatureIndex=JSON.parse(data.Data.FeatureIndex);
				if(FeatureIndex){
					$scope.Feature1=FeatureIndex.Forehead*1;
					$scope.Feature2=FeatureIndex.LeftTopEarFace*1;
					$scope.Feature3=FeatureIndex.LeftBottomEarFace*1;
					$scope.Feature4=FeatureIndex.LeftTopCheekFace*1;
					$scope.Feature5=FeatureIndex.RightTopEarFace*1;
					$scope.Feature6=FeatureIndex.RightBottomEarFace*1;
					$scope.Feature7=FeatureIndex.RightTopCheekFace*1;
				}else{
					$scope.Feature1=0;
					$scope.Feature2=0;
					$scope.Feature3=0;
					$scope.Feature4=0;
					$scope.Feature5=0;
					$scope.Feature6=0;
					$scope.Feature7=0;
				}
				var DistanceIndex=JSON.parse(data.Data.DistanceIndex);
				if(DistanceIndex){
					$scope.Distance1=DistanceIndex.LeftEyeLeft*1;
					$scope.Distance2=DistanceIndex.RightEyeRight*1;
					$scope.Distance3=DistanceIndex.MouthLeft*1;
					$scope.Distance4=DistanceIndex.MouthRight*1;
					$scope.Distance5=DistanceIndex.FaceLeft*1;
					$scope.Distance6=DistanceIndex.FaceRight*1;
					$scope.Distance7=DistanceIndex.ForeHead*1;
				}else{
					$scope.Distance1=0;
					$scope.Distance2=0;
					$scope.Distance3=0;
					$scope.Distance4=0;
					$scope.Distance5=0;
					$scope.Distance6=0;
					$scope.Distance7=0;
				}
			}
		});
	}

	if (type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = true;
		$scope.NeedSmallImg = false;
		$scope.chooseImg = true;
		$scope.chooseImg2 = true;
		$("#UndoBtn1").show();
		$("#ReDrawBtn1").show();
		$("#UndoBtn2").show();
		$("#ReDrawBtn2").show();

		var HairID = getQueryStringByKey("ID");
		var HairKeyNo = getQueryStringByKey("KeyNo");
		var visitUrl =  window.$servie + 'AdminApi/Hairstyle/FetchHairStyleDetail';

		$http.post(visitUrl,{ID:HairID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data.Title;
				$scope.SmallImgUrl = data.Data.Thumbnail;
				$scope.BigImgUrl = data.Data.AlphaImage;
				$scope.Dots=JSON.parse(data.Data.SetPoint);
				setTimeout(function(){
					$scope.SpecImage = data.Data.SpecImage;
					$scope.DisDots=JSON.parse(data.Data.Distance);
					$scope.$apply();
				},500);
				var FeatureIndex=JSON.parse(data.Data.FeatureIndex);
				if(FeatureIndex){
					$scope.Feature1=FeatureIndex.Forehead*1;
					$scope.Feature2=FeatureIndex.LeftTopEarFace*1;
					$scope.Feature3=FeatureIndex.LeftBottomEarFace*1;
					$scope.Feature4=FeatureIndex.LeftTopCheekFace*1;
					$scope.Feature5=FeatureIndex.RightTopEarFace*1;
					$scope.Feature6=FeatureIndex.RightBottomEarFace*1;
					$scope.Feature7=FeatureIndex.RightTopCheekFace*1;
				}else{
					$scope.Feature1=0;
					$scope.Feature2=0;
					$scope.Feature3=0;
					$scope.Feature4=0;
					$scope.Feature5=0;
					$scope.Feature6=0;
					$scope.Feature7=0;
				}
				var DistanceIndex=JSON.parse(data.Data.DistanceIndex);
				if(DistanceIndex){
					$scope.Distance1=DistanceIndex.LeftEyeLeft*1;
					$scope.Distance2=DistanceIndex.RightEyeRight*1;
					$scope.Distance3=DistanceIndex.MouthLeft*1;
					$scope.Distance4=DistanceIndex.MouthRight*1;
					$scope.Distance5=DistanceIndex.FaceLeft*1;
					$scope.Distance6=DistanceIndex.FaceRight*1;
					$scope.Distance7=DistanceIndex.ForeHead*1;
				}else{
					$scope.Distance1=0;
					$scope.Distance2=0;
					$scope.Distance3=0;
					$scope.Distance4=0;
					$scope.Distance5=0;
					$scope.Distance6=0;
					$scope.Distance7=0;
				}
			}
		});

		$scope.Submit = function() {
			if($scope.SmallImg==null){
			}else{
				files.push($scope.SmallImg);
				filesName.push("Thumbnail");
			}
			var CurArr=$scope.Dots;
			console.log(CurArr);
			if(CurArr.length==0){
				alert("请在效果图中选出发型选区。");
				return false;
			}			
			var DisArr=$scope.DisDots;
			if(DisArr.length==0){
				alert("请在距离图中选出选区。");
				return false;
			}
			var check1=$scope.ISNumber(1,$scope.Feature1);
			var check2=$scope.ISNumber(1,$scope.Feature2);
			var check3=$scope.ISNumber(1,$scope.Feature3);
			var check4=$scope.ISNumber(1,$scope.Feature4);
			var check5=$scope.ISNumber(1,$scope.Feature5);
			var check6=$scope.ISNumber(1,$scope.Feature6);
			var check7=$scope.ISNumber(1,$scope.Feature7);
			var dcheck1=$scope.ISNumber(2,$scope.Distance1);
			var dcheck2=$scope.ISNumber(2,$scope.Distance2);
			var dcheck3=$scope.ISNumber(2,$scope.Distance3);
			var dcheck4=$scope.ISNumber(2,$scope.Distance4);
			var dcheck5=$scope.ISNumber(2,$scope.Distance5);
			var dcheck6=$scope.ISNumber(2,$scope.Distance6);
			var dcheck7=$scope.ISNumber(2,$scope.Distance7);
			var CheckNumFlag=check1&&check2&&check3&&check4&&check5&&check6&check7;
			var dCheckNumFlag=dcheck1&&dcheck2&&dcheck3&&dcheck4&&dcheck5&&dcheck6&dcheck7;
			if(CheckNumFlag&&dCheckNumFlag){
				var FeatureIndex={"Forehead":0,"LeftTopEarFace":0,"LeftBottomEarFace":0,"LeftTopCheekFace":0,"RightTopEarFace":0,"RightBottomEarFace":0,"RightTopCheekFace":0};
				FeatureIndex.Forehead=$scope.Feature1*1;
				FeatureIndex.LeftTopEarFace=$scope.Feature2*1;
				FeatureIndex.LeftBottomEarFace=$scope.Feature3*1
				FeatureIndex.LeftTopCheekFace=$scope.Feature4*1;
				FeatureIndex.RightTopEarFace=$scope.Feature5*1;
				FeatureIndex.RightBottomEarFace=$scope.Feature6*1;
				FeatureIndex.RightTopCheekFace=$scope.Feature7*1;
				var DistanceIndex={"LeftEyeLeft":0,"RightEyeRight":0,"MouthLeft":0,"MouthRight":0,"FaceLeft":0,"FaceRight":0,"ForeHead":0};
				DistanceIndex.LeftEyeLeft=$scope.Distance1*1;
				DistanceIndex.RightEyeRight=$scope.Distance2*1;
				DistanceIndex.MouthLeft=$scope.Distance3*1;
				DistanceIndex.MouthRight=$scope.Distance4*1;
				DistanceIndex.FaceLeft=$scope.Distance5*1;
				DistanceIndex.FaceRight=$scope.Distance6*1;
				DistanceIndex.ForeHead=$scope.Distance7*1;
				$("#mask").show();
				var UpdateUrl = window.$servie + 'AdminApi/Hairstyle/UpdateHairStyle';
				var Update_url = window.$ProductionService + 'AdminApi/Hairstyle/UpdateHairStyle';
				var fields = {
					KeyNO: HairKeyNo,
					Title: $scope.Title,
					Category:1,
					SetPoint:CurArr,
					FeatureIndex:FeatureIndex,
					Distance:DisArr,
					DistanceIndex:DistanceIndex,
					apiKey:window.$apiKey
				};
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

				postCreateFunc(UpdateUrl,function(data) {
					if(data.IsSuccess) {
						if (!window.$isTest) {
							postCreateFunc(Update_url,function(result){
								if(result.IsSuccess) {
									if(result.Data.IsUpdated) {
										$scope.ReturnBack();
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
							$scope.ReturnBack();						
							$("#mask").hide();
						}	
					} else {
						$window.alert('出错');
						$("#mask").hide();
					}
				});
			}
		};	
	}

	$scope.ReturnBack = function(token) {
		$window.location.href = '/HairManagement/HairManagement.html?Token=' + $rootScope.Token;
	};

}]);
