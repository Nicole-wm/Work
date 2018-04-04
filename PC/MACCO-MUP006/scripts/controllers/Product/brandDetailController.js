maccoApp.controller('brandDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Product/CheckBrandKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Product/CheckBrandKeyNo';
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
	$scope.ImgWidth=null;

	pic.onload = function() {
		var picWidth=$("#pic").width();
		console.log(picWidth);
		$scope.ImgWidth=picWidth;
		if(picWidth % 414!=0&&picWidth % 375!=0){
			$("#imgSelect").attr("src","");
			$scope.$apply(function(){
				$scope.brandImage=undefined;
			});     
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
				$scope.hasStoryflag = false;
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

	$scope.hasStoryFn=function(){
		$scope.hasStoryflag = true;
		if($scope.hasStory==false){
			$scope.brandImage = "";
			$("#imgSelect").attr("src","");
			$scope.Web = undefined;
			$scope.hasStoryflag = false;
		}
	}

	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = false;
		$scope.NeedBanner = true;  
		$scope.Submit = function() {	
			$("#mask").show();		
			var url = window.$servie + 'AdminApi/Product/CreateBrand';
			var production_create_url = window.$ProductionService + 'AdminApi/Product/CreateBrand';

			var fields = {
				UserName:$rootScope.AdminUserName,
				cname:$scope.cname,
				ename:$scope.ename,
				hasStory:$scope.hasStory,
				apiKey : window.$apiKey,
				WebPath : $scope.WebFilePath
			};

			var fields2 = {
				UserName:$rootScope.AdminUserName,
				cname:$scope.cname,
				ename:$scope.ename,
				hasStory:$scope.hasStory,
				apiKey : window.$apiKey,
				WebPath : $scope.WebFilePath2
			};

			var files = [];
			var fileNames = [];
			if($scope.Banner!= null) {
				files.push($scope.Banner);
				fileNames.push('BrandImageUrl');
			}
			
			if($scope.brandImage!= null) {
				files.push($scope.brandImage);
				fileNames.push('BrandImage');
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

			postCreateFunc(url,fields,function(data) {
				if(data.IsSuccess) {
					if (!window.$isTest) {
						postCreateFunc(production_create_url,fields2,function(result){
							if(result.IsSuccess) {
								if(result.Data.Processed) {
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
					}else{
						$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
						$("#mask").hide();
					}	
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			});
		};	
	}
	
	if(type == 'Visit') {
		$scope.OperationType = '';
		$scope.canEdit = true;
		// $scope.hasStory = false; 
		$scope.showCNameErr = false;
		$scope.showENameErr = false;
		var brandID = getQueryStringByKey('ID');
		var param = {
			ID:brandID
		};
		var serviceUrl = window.$servie + 'AdminApi/Product/FetchBrandDetail';
		$http.post(serviceUrl,param).success(function(data){
			console.log(data);
			if(data.IsSuccess) {
				$scope.cname = data.Data.CName;
				$scope.ename = data.Data.EName;
				$scope.BannerUrl = data.Data.BrandImageUrl;
				if(data.Data.HasStory!= 0){
					$scope.hasStory = true; 
					$scope.BannerImageUrl = data.Data.BannerImageUrl;
					$scope.Web= data.Data.StoryUrl;
				}else{
					$scope.hasStory = false; 
					$scope.BannerImageUrl = "";
					$scope.Web= "";
				}
			}
		});
	}
	
	if(type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = false;
		$scope.hasStoryflag = false;
		$scope.NeedBanner = false;
		$scope.showCNameErr = false;
		$scope.showENameErr = false;

		var brandID = window.getQueryStringByKey('ID');
		var param = {
			ID:brandID
		};
		var serviceUrl = window.$servie + 'AdminApi/Product/FetchBrandDetail';

		$http.post(serviceUrl,param).success(function(data){
			console.log(data);
			if(data.IsSuccess) {
				$scope.KeyNo = data.Data.KeyNo;
				$scope.cname = data.Data.CName;
				$scope.ename = data.Data.EName;
				$scope.BannerUrl = data.Data.BrandImageUrl;
				if(data.Data.HasStory!= 0){
					$scope.hasStory = true; 
					$scope.BannerImageUrl = data.Data.BannerImageUrl;
					$scope.Web= data.Data.StoryUrl;
				}else{
					$scope.hasStory = false; 
					$scope.BannerImageUrl = "";
					$scope.Web = "";
				}
			}
		});
		$scope.Submit = function() {
			$("#mask").show();
			var url = window.$servie + 'AdminApi/Product/UpdateBrand';
			var production_update_url = window.$ProductionService + 'AdminApi/Product/UpdateBrand';
			var brandID = window.getQueryStringByKey('ID');
			
			if($scope.hasStory){
				if($scope.Web==null){
					alert("内容没有上传");
					return false;
				}
			}
			var fields = {
				BrandKeyNo:$scope.KeyNo,
				cname:$scope.cname,
				ename:$scope.ename,
				hasStory:$scope.hasStory,
				apiKey : window.$apiKey,
				WebPath : $scope.WebFilePath
			};

			var fields2 = {
				BrandKeyNo:$scope.KeyNo,
				cname:$scope.cname,
				ename:$scope.ename,
				hasStory:$scope.hasStory,
				apiKey : window.$apiKey,
				WebPath : $scope.WebFilePath2
			};

			var files = [];
			var fileNames = [];
			if($scope.brandImage!= null&&$scope.hasStory) {
				files.push($scope.brandImage);
				fileNames.push('BrandImage');
			}

			if($scope.Banner!= null) {
				files.push($scope.Banner);
				fileNames.push('BrandImageUrl');
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

			postCreateFunc(url,fields,function(data) {
				if(data.IsSuccess) {
					if (!window.$isTest) {
						postCreateFunc(production_update_url,fields2,function(result){
							if(result.IsSuccess) {
								if(result.Data.Processed) {
									$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
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
						$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
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
		$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
	};
	
}]);
