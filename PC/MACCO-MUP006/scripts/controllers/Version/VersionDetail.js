maccoApp.controller('VersionDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Version/CheckVersionKeyNo ';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Version/CheckVersionKeyNo ';
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

	$scope.Categories=[
	{ID:'0',Desc:"IOS"},
	{ID:'1',Desc:"Android"}
	];

	var type = getQueryStringByKey('Type');
	$scope.WebShowSubmit=true;
	$scope.WebFilePath=null;
	$scope.WebFilePath2 =null;

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
		var tags = [];
		var tagObj = new Object();
		tagObj.Title = '';
		tagObj.Description = '';
		tags.push(tagObj);
		
		$scope.tags = tags;
		
		$scope.AddTag = function(){
			var tag = {};
			tag.Title = '';
			tag.Description = '';
			tags.push(tag);	
		};
		
		$scope.DeleteTag = function(index) {
			tags.splice(index, 1);
		};

		$scope.Submit = function() {
			$("#mask").show();
			var createUrl = window.$servie + 'AdminApi/Version/CreateVersion';
			var activity_create_url = window.$ProductionService + 'AdminApi/Version/CreateVersion';

			var Data= {};
			for(var i=0;i<$scope.tags.length;i++) {
				Data[i]=$scope.tags[i];
			}
			var fields = {
				UserName:$rootScope.AdminUserName,
				Title: $scope.Title,
				WebFile : $scope.WebFilePath,
				Platform : $scope.SelectedCategoy,
				DetailDataJson:angular.toJson(Data),
				apiKey:window.$apiKey
			};

			var fields2 = {
				UserName:$rootScope.AdminUserName,
				Title: $scope.Title,
				WebFile : $scope.WebFilePath2,
				Platform : $scope.SelectedCategoy,
				DetailDataJson:angular.toJson(Data),
				apiKey:window.$apiKey
			};

			var Banner = $scope.Banner;

			var postCreateFunc = function(url,dataField,callback) {
				Upload.upload({
					url: url,
					fields:dataField,
					file: Banner,
					fileFormDataName:'DetailImage'
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
						$scope.ReturnBack();
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
		$scope.NeedBanner = false;
		var ActiveID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Version/FetchVersionDetail';

		$http.post(visitUrl,{ID:ActiveID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data.Title;
				$scope.SelectedCategoy = data.Data.Platform;
				$scope.WebUrl = data.Data.WebUrl;
				$scope.BannerUrl = data.Data.ImageUrl;
				$scope.tags = angular.fromJson(data.Data.DetailDataJson);
			}
		});
	}
	
	if (type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = true;
		$scope.NeedBanner = false;
		var ActiveID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/Version/FetchVersionDetail';
        var tags =[];
        
		$http.post(visitUrl,{ID:ActiveID}).success(function(data){
			if(data.IsSuccess) {
				$scope.KeyNo = data.Data.KeyNo;
				$scope.Title = data.Data.Title;
				$scope.SelectedCategoy = data.Data.Platform;
				$scope.WebUrl = data.Data.WebUrl;
				$scope.BannerUrl = data.Data.ImageUrl;
				$scope.tags = angular.fromJson(data.Data.DetailDataJson);
				$.each($scope.tags, function() {
					tags.push(this);
				});
				$scope.AddTag = function(){
					var tag = {};
					tag.Title = '';
					tag.Description = '';
					tags.push(tag);	
					$scope.tags=tags;
				};
				$scope.DeleteTag = function(index) {
					tags.splice(index, 1);
					$scope.tags=tags;
				};
			}
		});

		
		$scope.Submit = function() {
			$("#mask").show();
			var updateUrl = window.$servie + 'AdminApi/Version/UpdateVersion';
			var activity_update_url = window.$ProductionService + 'AdminApi/Version/UpdateVersion';

			var Data= {};

			for(var i=0;i<tags.length;i++) {
				Data[i]=tags[i];
			}

			if($scope.WebUrl==null){
				alert("内容没有上传");
				return false;
			}

			var fields = {
				KeyNo:$scope.KeyNo,
				Title: $scope.Title,
				WebFile : $scope.WebFilePath,
				Platform : $scope.SelectedCategoy,
				DetailDataJson:angular.toJson(Data),
				apiKey:window.$apiKey
			};

			var fields2 = {
				KeyNo:$scope.KeyNo,
				Title: $scope.Title,
				WebFile : $scope.WebFilePath2,
				Platform : $scope.SelectedCategoy,
				DetailDataJson:angular.toJson(Data),
				apiKey:window.$apiKey
			};

			var files = [];
			var fileNames = [];
			if($scope.Banner != null) {
				files.push($scope.Banner);
				fileNames.push('DetailImage');
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
		};
	}

	$scope.ReturnBack = function(token) {
		$window.location.href = '/VersionManagement/VersionManager.html?Token=' + $rootScope.Token;
	};
}]);
