maccoApp.controller('ActivityDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Activity/CheckActivityKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Activity/CheckActivityKeyNo';
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

	var type = getQueryStringByKey('Type');
	$scope.WebShowSubmit=true;
	$scope.WebFilePath=null;
	$scope.WebFilePath2 =null;

	bannerpic.onload = function() {
		var picWidth=$("#bannerpic").width();
		if(picWidth %347!=0){
			$("#selectBannerPic").attr("src","");
			$scope.Banner=undefined;
			$scope.$apply(); 
			setTimeout("alert('上传图片宽度不是347px的倍数，请重新上传!')",0);
		}
	}

	sharepic.onload = function() {
	    var maxsize =32*1024;//32k  
	    var picWidth=$("#sharepic").width();
	    var picHeight=$("#sharepic").height();
	    var picSize=$scope.ShareImage[0].size;
	    if(picSize>maxsize||picWidth!=150||picHeight!=150){
	    	$("#sharepicSelect").attr("src","");
	    	$scope.ShareImage=undefined;
	    	$scope.$apply(); 
	    	if(picSize>maxsize){
	    		setTimeout("alert('上传图片应该小于32k，请重新上传!')",0);
	    	}else{
	    		setTimeout("alert('上传图片宽度或高度不是150px，请重新上传!')",0);
	    	} 
	    }
	}
	bannerdetailpic.onload = function() {
		var picWidth=$("#bannerdetailpic").width();
		if(picWidth % 414!=0&&picWidth % 375!=0){
			$("#selectBannerDetailPic").attr("src","");
			$scope.BannerDetail=undefined;   
			$scope.$apply(); 
			setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);
		}
	}
	
	var webUpload = function(){
		var webCancelTag = new $.CheckCancelFlag();

		$scope.WebCancelUpload=function(){
			$scope.Web = undefined;
			$scope.WebUploadProgress = "";
			webCancelTag.cancelFlag = 1;
		}
		$scope.WebConfirmUpload=function(){
			var url = window.$servie + "AdminApi/Fileapi/UploadFile";
			var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
			$.ConfirmUpload($scope.Web,url,getWebFilePath,create_url,webCancelTag);			
		}		
		var getWebFilePath = function(data,data2,succeed,shardCount){			
			if(data.Data.IsStop){
				$scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;
				$scope.WebFilePath2=data2.Data.TempPath+"/"+ data2.Data.RealName;		
				$scope.WebUploadProgress = "上传成功！";
				$scope.WebShowSubmit=false;
				$scope.WebUrl=true;
			}else{
				if(succeed!=-1){
					$scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
				}else{
					$scope.WebUploadProgress = "已取消上传";
					$scope.Web=null;
				}
			}
			$scope.$apply();
		};
	}
	webUpload();

	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.NeedBanner = true;  
		$scope.NeedBannerdetail = true;  
		$scope.BannerImgWidth=null;
		$scope.NeedShareImage = true;

		$scope.Submit = function() {
			$("#mask").show();
			var createUrl = window.$servie + 'AdminApi/Activity/CreateActivity';
			var activity_create_url = window.$ProductionService + 'AdminApi/Activity/CreateActivity';

			if($scope.WebFilePath==null){
				alert("内容没有上传");
				return false;
			}

			var fields = {
				UserName:$rootScope.AdminUserName,
				Title: $scope.Title,
				Description: $scope.ActiveDesc,
				StartTime: $scope.StartTime,
				EndTime: $scope.TerminalTime,
				WebFile : $scope.WebFilePath,
				apiKey:window.$apiKey
			};

			var fields2 = {
				UserName:$rootScope.AdminUserName,
				Title: $scope.Title,
				Description: $scope.ActiveDesc,
				StartTime: $scope.StartTime,
				EndTime: $scope.TerminalTime,
				WebFile : $scope.WebFilePath2,
				apiKey:window.$apiKey
			};

			var files = [];
			files.push($scope.Banner);
			files.push($scope.BannerDetail);
			files.push($scope.ShareImage); 

			var postCreateFunc = function(url,dataField,callback) {
				Upload.upload({
					url: url,
					fields:dataField,
					file: files,
					fileFormDataName:['Banner','DetailImage','ShareImage']
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};
			
			postCreateFunc(createUrl,fields,function(data) {
				if(data.IsSuccess) {
					if (!window.$isTest) {
						postCreateFunc(activity_create_url,fields2,function(result){
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
						$window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
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
		$scope.OperationType = '';
		$scope.canEdit = false;
		$("#StartTimeFlag").hide();
		$("#TerminalTimeFlag").hide();

		var ActiveID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Activity/FetchActivityDetail';

		$http.post(visitUrl,{ID:ActiveID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data.Title;
				$scope.ActiveDesc = data.Data.Description;
				$scope.BannerUrl = data.Data.Banner;
				$scope.BannerDetailUrl = data.Data.DetailImage;
				$scope.StartTime = data.Data.StartTime;
				$scope.TerminalTime = data.Data.EndTime;
				$scope.WebUrl = data.Data.WebUrl;
				$scope.ShareImageUrl = data.Data.ShareImageUrl;
			}
		});
	}
	
	if (type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = true;
		$scope.NeedBanner = false;
		$scope.NeedBannerdetail = false;

		var ActiveID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Activity/FetchActivityDetail';

		$http.post(visitUrl,{ID:ActiveID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data.Title;
				$scope.ActiveDesc = data.Data.Description;
				$scope.BannerUrl = data.Data.Banner;
				$scope.BannerDetailUrl = data.Data.DetailImage;
				$scope.StartTime = data.Data.StartTime;
				$scope.TerminalTime = data.Data.EndTime;
				$scope.WebUrl = data.Data.WebUrl;
				$scope.KeyNo = data.Data.KeyNO;
				$scope.ShareImageUrl = data.Data.ShareImageUrl;
			}
		});

		$scope.Submit = function() {
			$("#mask").show();
			var updateUrl = window.$servie + 'AdminApi/Activity/UpdateActivty';
			var activity_update_url = window.$ProductionService + 'AdminApi/Activity/UpdateActivty';

			if($scope.WebUrl==null){
				alert("内容没有上传");
				return false;
			}

			var fields = {
				KeyNO:$scope.KeyNo,
				Title: $scope.Title,
				Description: $scope.ActiveDesc,
				StartTime: $scope.StartTime,
				EndTime: $scope.TerminalTime,
				WebFile : $scope.WebFilePath,
				apiKey:window.$apiKey
			};

			var fields2 = {
				KeyNO:$scope.KeyNo,
				Title: $scope.Title,
				Description: $scope.ActiveDesc,
				StartTime: $scope.StartTime,
				EndTime: $scope.TerminalTime,
				WebFile : $scope.WebFilePath2,
				apiKey:window.$apiKey
			};

			var files = [];
			var fileNames = [];
			if($scope.Banner != null) {
				files.push($scope.Banner);
				fileNames.push('Banner');
			}

			if($scope.BannerDetail != null) {
				files.push($scope.BannerDetail);
				fileNames.push('DetailImage');
			}

			if($scope.ShareImage != null) {
				files.push($scope.ShareImage);
				fileNames.push('ShareImage');
			}

			var postCreateFunc = function(url,dataField,callback) {
				Upload.upload({
					url: url,
					fields:dataField,
					file: files,
					fileFormDataName:fileNames
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};
			
			postCreateFunc(updateUrl,fields,function(data) {
				if(data.IsSuccess) {
					if (!window.$isTest) {
						postCreateFunc(activity_update_url,fields2,function(result){
							if(result.IsSuccess) {
								if(result.Data.IsUpdated) {
									$window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
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
						$window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
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
		$window.location.href = '/ActivityManagement/ActivityManager.html?Token=' + $rootScope.Token;
	};

	$(function(){
		$('#StartTime').val("");
		$('#TerminalTime').val("");
		var startTime=0;
		var endTime= 0;

		$('#StartTime').datetimepicker({
			format: 'yyyy-mm-dd hh:ii', 
			language: 'zh-CN', 
			autoclose:true 
		}).on('changeDate',function(ev){
			startTime = ev.date.valueOf();
			if(startTime&&endTime&&(startTime>endTime)){
				alert("开始时间不能迟于结束时间！");
				$('#StartTime').val("");
				$("#StartTimeFlag").show();
			}else{
				$("#StartTimeFlag").hide();
			}
		});

		$('#TerminalTime').datetimepicker({
			format: 'yyyy-mm-dd hh:ii', 
			language: 'zh-CN', 
			autoclose:true
		}).on('changeDate',function(ev){
			endTime = ev.date.valueOf();
			if(startTime&&endTime&&(startTime>endTime)){
				alert("结束时间不能早于开始时间！");
				$('#TerminalTime').val("");
				$("#TerminalTimeFlag").show();
			}else{
				$("#TerminalTimeFlag").hide();
			}
		});
	});

}]);
