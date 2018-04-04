maccoApp.factory('macco', function ($http, $window) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.CategoryID = '';
		this.BrandID = '';
	};


	macco.prototype.nextPage = function () {
		var param = {
			PageSize: 10
		};
		if (this.CategoryID != undefined && this.CategoryID != '') {
			param.CategoryID = this.CategoryID;
		}

		if (this.BrandID != undefined && this.BrandID != '') {
			param.BrandID = this.BrandID;
		}

		if (this.Keyword != undefined) {
			param.Keyword = this.Keyword;
		} else {
			param.Keyword = '';
		}

		if (this.after != undefined && this.after != '') {
			param.LastID = this.after;
		}

		/*var productSearchUrl = window.$servie + 'AdminApi/Product/SearchProduct';*/
		var productSearchUrl = window.$ProductionService + 'AdminApi/Product/SearchProduct';
		$http.post(productSearchUrl, param).success(function (data) {
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);
			}
			if(this.items.length!=0){
				this.after = this.items[this.items.length - 1].ID;
			}
			this.busy = false;
		}.bind(this));
		this.busy = false;
	};

	return macco;
});


maccoApp.controller('makeupDetailController', ['$scope', '$window', '$http', 'Upload', '$rootScope', '$modal', function ($scope, $window, $http, Upload, $rootScope, $modal) {	  
	var checkUrl = window.$servie + 'AdminApi/TryMakeup/CheckTryMakeupKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/TryMakeup/CheckTryMakeupKeyNo';
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

	Starpic.onload = function() {
	    var picWidth=$("#Starpic").width();
	    var picHeight=$("#Starpic").height();
	    if(picWidth!=150||picHeight!=180){
	    	$("#StarpicSelect").attr("src","");
	    	$scope.$apply(function(){
	    		$scope.StarImage=undefined;
			});  
			setTimeout("alert('上传图片应为150px*180px，请重新上传!')",0); 
	    }
	}

	var type = getQueryStringByKey('Type');
	if (type == 'Create') {
		$scope.NeedShareImage = true;
		var makeupCategoryUrl = window.$servie + 'AdminApi/Trymakeup/FetchFullTryMakeupCategory';
		var params = null;
		$http.post(makeupCategoryUrl, params).success(function (data) {
			if (data.IsSuccess) {
				$scope.Categories = data.Data;
			}
		});
		$scope.WebShowSubmit=true;
		$scope.VideoShowSubmit=true;
		

		$scope.canEdit = true;
		$scope.OperationType = '新增';

		$scope.needRequried = true;

		var courses = [];
		var course = {
			CourseStep: "CourseStep1",
			Products: []
		};
		courses.push(course);
		$scope.Courses = courses;

		$scope.WebShowSubmit=true;
		$scope.VideoShowSubmit=true;
		$scope.VideoCancel=true;
		//文件上传成功后获取地址
		$scope.WebFilePath=null;
		$scope.WebFilePath2=null;
		$scope.VideoFilePath=null;
		$scope.VideoFilePath2=null;

		$scope.VideoHeigth=null;
		$scope.VideoWidth=null;


		$scope.IndexImgWidth=null;
		$scope.ThumbnailImgWidth=null;

		indexpic.onload = function() {
			var picWidth=$("#indexpic").width();
			$scope.IndexImgWidth=picWidth;
			if(picWidth%414!=0&&picWidth % 375!=0){
				$("#selectIndexPic").attr("src","");
				$scope.$apply(function(){
					$scope.IndexImage=undefined;
				});  
				setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);     
			}
		}

		$scope.ThumbnailImgWidth=null;

		thumbnailpic.onload = function() {
			var picWidth=$("#thumbnailpic").width();
			$scope.ThumbnailImgWidth=picWidth;
			if(picWidth%414!=0&&picWidth % 375!=0){
				$("#selectThumbnailPic").attr("src","");
				$scope.$apply(function(){
					$scope.Thumbnail=undefined;
				});
				setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);       
			}
		}
		
		var width=0;
		var height=0;
		var indexVideo = document.getElementById('indexVideo');
		indexVideo.addEventListener('loadedmetadata',function(e){
			width = this.videoWidth;
			height = this.videoHeight;
		});
		
		var webUpload = function(){
			var webCancelTag = new $.CheckCancelFlag();
			$scope.WebCancelUpload=function(){
				$scope.WebContent = undefined;
				$scope.WebUploadProgress = "";
				webCancelTag.cancelFlag = 1;
			}
			$scope.WebConfirmUpload=function(){
				var url = window.$servie + "AdminApi/Fileapi/UploadFile";
				var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
				$.ConfirmUpload($scope.WebContent,url,getWebFilePath,create_url,webCancelTag);
			}
			var getWebFilePath = function(data,data2,succeed,shardCount){
				if(data.Data.IsStop){
					$scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;	
					$scope.WebFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;	
					$scope.WebUploadProgress = "上传成功！";
					$scope.WebShowSubmit =false;
				}else{
					if(succeed!=-1){
						$scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
					}else{
						$scope.WebUploadProgress = "已取消上传";
						$scope.WebContent=null;
					}
				}
				$scope.$apply();
			};
		}
		
		webUpload();
		
		var  videoUpload = function(){
			var videoCancelTag = new $.CheckCancelFlag();
			$scope.VideoCancelUpload=function(){
				$scope.Video = undefined;
				$scope.VideoUploadProgress = "";
				videoCancelTag.cancelFlag = 1;
			}
			$scope.VideoConfirmUpload=function(){
				var url = window.$servie + "AdminApi/Fileapi/UploadFile";
				var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
				$.ConfirmUpload($scope.Video,url,getVideoFilePath,create_url,videoCancelTag);
			}
			var getVideoFilePath = function(data,data2,succeed,shardCount){
				if(data.Data.IsStop){
					$scope.VideoFilePath=data.Data.TempPath+"/"+data.Data.RealName;
					$scope.VideoFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;
					$scope.VideoHeigth=height;
					console.log($scope.VideoHeigth);
					$scope.VideoWidth=width;
					$scope.VideoUploadProgress = "上传成功！";
					$scope.VideoShowSubmit =false;
				}else{
					if(succeed!=-1){
						$scope.VideoUploadProgress = "进度："+succeed+"/"+shardCount;
					}else{
						$scope.VideoUploadProgress = "已取消上传";
						$scope.Video=null;
					}
				}
				$scope.$apply();				
			};
		}
		
		videoUpload();

		$scope.AddCourse = function () {
			var newcourse = {
				CourseStep: "CourseStep" + (courses.length + 1),
				Products: []
			};
			courses.push(newcourse);
		};

		$scope.DeleteCouse = function (idx) {
			if (courses.length > 1) {
				courses.splice(idx, 1);
			} else {
				alert('必须有个步骤');
			}
		};

		$scope.AddNewProduct = function (idx) {
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: '/MakeupManage/selectConnectProduct.html',
				controller: "selectProductController",
				resolve: {
					items: function () {
						return $scope.selectedProduct;
					}
				}
			});

			var contains = function (objs, obj, idx, property) {
				var result = false;

				for (var j = 0; j < objs[idx].length; j++) {
					if (objs[idx][j][property] == obj[property]) {
						result = true;
						break;
					}
				}

				return result;
			};

			modalInstance.result.then(function (selectedItem) {
				$scope.selectedProduct = selectedItem;
				for (var j = 0; j < selectedItem.length; j++) {
					if (!contains($scope.Courses[idx], selectedItem[j], "Products", "ID")) {
						$scope.Courses[idx].Products= [];
						$scope.Courses[idx].Products.push(selectedItem[j]);
					}
				}
			}, function () {
			});
		};



		$scope.DeleteProduct = function (idx, courseIdx) {
			var products = $scope.Courses[courseIdx].Products;
			for (var j = 0; j < products.length; j++) {
				products.splice(idx, 1);
			}
		};


		$scope.Submit = function () {
			if ($scope.Courses.length == 0) {
				$scope.missProduct = true;
			} else {
				var checkFlag = true;
				for (var i = 0; i < $scope.Courses.length; i++) {
					if ($scope.Courses[i].Products.length == 0) {
						alert("缺少产品！");
						$scope.missProduct = true;
						checkFlag = false;
						break;
					}else{
						$("#mask").show();
					}
				}
				if (checkFlag) {
					var submitCourses = [];
					for (var i = 0; i < $scope.Courses.length; i++) {
						var submitCourse = {
							CourseStep: 'CourseStep' + (i + 1),
							Products: []
						};
						for (var j = 0; j < $scope.Courses[i].Products.length; j++) {
							var pid = $scope.Courses[i].Products[j].KeyNo;
							submitCourse.Products.push(pid);
						}

						submitCourses.push(submitCourse);
					}

					var courseJSON = angular.toJson(submitCourses);

					var url = window.$servie + 'AdminApi/Trymakeup/CreateTryMakeup';
					var production_url = window.$ProductionService + 'AdminApi/Trymakeup/CreateTryMakeup';
					
					if($scope.VideoHeigth==null){
						$scope.Video="";
						$scope.VideoFilePath="";
						$scope.VideoHeigth="";
						$scope.VideoWidth="";
						$scope.VideoFilePath2="";
					}
					if($scope.WebFilePath==null){
						alert("内容页面没有上传");
						return false;
					}
					
					var fields = {
						UserName:$rootScope.AdminUserName,
						Name: $scope.Name,
						apiKey : window.$apiKey,
						WebPath : $scope.WebFilePath,
						VideoPath : $scope.VideoFilePath,
						VideoHeight : $scope.VideoHeigth,
						VideoWidth : $scope.VideoWidth,
						CategoryKeyNo :  $scope.SelectedCategoy,
						Description: $scope.Description,
						RelatedProduct : courseJSON
					};
					
					var fields2 = {
						UserName:$rootScope.AdminUserName,
						Name: $scope.Name,
						apiKey : window.$apiKey,
						WebPath : $scope.WebFilePath2,
						VideoPath : $scope.VideoFilePath2,
						VideoHeight : $scope.VideoHeigth,
						VideoWidth : $scope.VideoWidth,
						CategoryKeyNo :  $scope.SelectedCategoy,
						Description: $scope.Description,
						RelatedProduct : courseJSON
					};
					
					var files = [];
					var fileFormDataNames = [];
					files.push($scope.IndexImage);
					files.push($scope.Thumbnail);
					files.push($scope.ShareImage); 
					fileFormDataNames.push('IndexImage');
					fileFormDataNames.push('Thumbnail');
					fileFormDataNames.push('ShareImage');

					if($scope.StarImage != undefined) {
						files.push($scope.StarImage);
						fileFormDataNames.push('TryImage');
					}

					var postCreateData = function (addr,dataFields,callback) {
						Upload.upload({
							url: addr,
							fields : dataFields,
							file : files,
							fileFormDataName : fileFormDataNames
						}).success(function (data, status, headers, config) {
							callback(data);
						});
					}

					
					postCreateData(url, fields, function (data) {
						if (data.IsSuccess) {
							if (data.Data.IsCreated) {
								if (!window.$isTest) {
									postCreateData(production_url,fields2, function (result) {
										if (result.IsSuccess) {
											if (result.Data.IsCreated) {
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
									$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
									$("#mask").hide();
								}
							}
						} else {
							$window.alert('出错');
							$("#mask").hide();
						}
					});
					
				}
			}
		};

	}

	if (type == 'Visit') {
		$scope.canEdit = false;
		$scope.OperationType = '';
		$scope.needRequried = false;
		var tryMakeupID = getQueryStringByKey('ID');
		var makeupUrl = window.$servie + 'AdminApi/Trymakeup/FetchAdminMakupDetail';
		var param = {
			TryMakeupID: tryMakeupID
		};
		$http.post(makeupUrl, param).success(function (data) {
			if (data.IsSuccess) {
				$scope.Name = data.Data.Name;
				var makeupCategoryUrl = window.$servie + 'AdminApi/Trymakeup/FetchFullTryMakeupCategory';
				var params = null;
				$http.post(makeupCategoryUrl, params).success(function (data1) {
					if (data1.IsSuccess) {
						$scope.Categories = data1.Data;
						$scope.SelectedCategoy = data.Data.CategoryKeyNo;
						$scope.Courses = data.Data.Categories;
						$scope.WebContent = data.Data.WebUrl;
						$scope.VideoUrl = data.Data.VideoUrl;
						$scope.Thumbnail = data.Data.Thumbnail;
						$scope.IndexImage = data.Data.IndexImage;
						$scope.Description = data.Data.Description;
						$scope.ShareImageUrl = data.Data.ShareImageUrl;
						$scope.StarImageUrl = data.Data.TryImage;
					}
				});
			}
		});
	}

	if (type == 'Update') {
		$scope.canEdit = true;
		$scope.OperationType = '';
		$scope.needRequried = false;
		$scope.webUpload = false;
		$scope.videoUpload = false;
		$scope.WebShowSubmit=true;
		$scope.VideoShowSubmit=true;
		var tryMakeupID = getQueryStringByKey('ID');
		var makeupUrl = window.$servie + 'AdminApi/Trymakeup/FetchAdminMakupDetail';
		var param = {
			TryMakeupID: tryMakeupID
		};


		$http.post(makeupUrl, param).success(function (data) {
			if (data.IsSuccess) {
				$scope.Name = data.Data.Name;
				var makeupCategoryUrl = window.$servie + 'AdminApi/Trymakeup/FetchFullTryMakeupCategory';
				var params = null;
				$http.post(makeupCategoryUrl, params).success(function (data1) {
					if (data1.IsSuccess) {
						$scope.Categories = data1.Data;
						$scope.SelectedCategoy = data.Data.CategoryKeyNo;
					}
				});
				$scope.Courses = data.Data.Categories;
				$scope.WebContent = data.Data.WebUrl;
				$scope.Thumbnail = data.Data.Thumbnail;
				$scope.IndexImage = data.Data.IndexImage;
				$scope.KeyNO = data.Data.KeyNo;
				$scope.Description = data.Data.Description;
				$scope.ShareImageUrl = data.Data.ShareImageUrl;
				$scope.StarImageUrl = data.Data.TryImage;
				$scope.AddCourse = function () {
					var newcourse = {
						CourseStep: "CourseStep" + ($scope.AddCourse.length + 1),
						Products: [

						]
					};
					$scope.Courses.push(newcourse);
				};

				$scope.DeleteCouse = function (idx) {
					if ($scope.Courses.length > 1) {
						$scope.Courses.splice(idx, 1);
					} else {
						alert('必须有个步骤');
					}
				};

				$scope.AddNewProduct = function (idx) {
					var modalInstance = $modal.open({
						animation: true,
						templateUrl: '/MakeupManage/selectConnectProduct.html',
						controller: "selectProductController",
						resolve: {
							items: function () {
								return $scope.selectedProduct;
							}
						}
					});

					var contains = function (objs, obj, idx, property) {
						var result = false;

						for (var j = 0; j < objs[idx].length; j++) {
							if (objs[idx][j][property] == obj[property]) {
								result = true;
								break;
							}
						}

						return result;
					};

					modalInstance.result.then(function (selectedItem) {
						$scope.selectedProduct = selectedItem;
						for (var j = 0; j < selectedItem.length; j++) {
							if (!contains($scope.Courses[idx], selectedItem[j], "Products", "ID")) {
								$scope.Courses[idx].Products= [];
								$scope.Courses[idx].Products.push(selectedItem[j]);
							}
						}

					}, function () {

					});
				};

				$scope.DeleteProduct = function (idx, courseIdx) {
					var products = $scope.Courses[courseIdx].Products;
					for (var j = 0; j < products.length; j++) {
						products.splice(idx, 1);
					}
				};

				$scope.IndexImgWidth=null;
				$scope.ThumbnailImgWidth=null;
				
				indexpic.onload = function() {
					var picWidth=$("#indexpic").width();
					$scope.IndexImgWidth=picWidth;
					if(picWidth%414!=0&&picWidth % 375!=0){
						$("#selectIndexPic").attr("src","");
						$scope.$apply(function(){
							$scope.IndexImage=undefined;
						});  
						setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);     
					}
				}
				
				$scope.ThumbnailImgWidth=null;
				
				thumbnailpic.onload = function() {
					var picWidth=$("#thumbnailpic").width();
					$scope.ThumbnailImgWidth=picWidth;
					if(picWidth%414!=0&&picWidth % 375!=0){
						$("#selectThumbnailPic").attr("src","");
						$scope.$apply(function(){
							$scope.Thumbnail=undefined;
						});
						setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);       
					}
				}
				
				var updateWidth;
				var updateHeight;
				var indexVideo2 = document.getElementById('indexVideo');
				indexVideo2.addEventListener('loadedmetadata',function(e){
					updateWidth = this.videoWidth;
					updateHeight = this.videoHeight;
				});
				
				
				var editwebUpload = function(){
					var webCancelTag = new $.CheckCancelFlag();
					$scope.WebCancelUpload=function(){
						$scope.WebContent = undefined;
						$scope.WebUploadProgress = "";
						webCancelTag.cancelFlag = 1;
					}
					$scope.WebConfirmUpload=function(){
						var url = window.$servie + "AdminApi/Fileapi/UploadFile";
						var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
						$.ConfirmUpload($scope.WebContent,url,getWebFilePaths,create_url,webCancelTag);
					}
					var getWebFilePaths = function(data,data2,succeed,shardCount){
						if(data.Data.IsStop){
							$scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;
							$scope.WebFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;	
							$scope.WebUploadProgress = "上传成功！";
							$scope.webUpload = !$scope.webUpload;
							$scope.WebShowSubmit =false;
						}else{
							if(succeed!=-1){
								$scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
							}else{
								$scope.WebUploadProgress = "已取消上传";
								$scope.WebContent=null;
							}
						}
						$scope.$apply();
					};

				}
				
				editwebUpload();
				
				var  editvideoUpload = function(){
					var videoCancelTag = new $.CheckCancelFlag();
					$scope.VideoCancelUpload=function(){
						$scope.Video = undefined;
						$scope.VideoUploadProgress = "";
						videoCancelTag.cancelFlag = 1;
					}
					$scope.VideoConfirmUpload=function(){
						var url = window.$servie + "AdminApi/Fileapi/UploadFile";
						var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
						$.ConfirmUpload($scope.Video,url,getVideoFilePaths,create_url,videoCancelTag);
					}
					var getVideoFilePaths = function(data,data2,succeed,shardCount){
						if(data.Data.IsStop){
							$scope.VideoFilePath=data.Data.TempPath+"/"+data.Data.RealName;
							$scope.VideoFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;
							$scope.VideoHeigth=updateHeight;
							$scope.VideoWidth=updateWidth;
							$scope.VideoUploadProgress = "上传成功！";
							$scope.videoUpload = !$scope.videoUpload;
							$scope.VideoShowSubmit =false;
						}else{
							if(succeed!=-1){
								$scope.VideoUploadProgress = "进度："+succeed+"/"+shardCount;
							}else{
								$scope.VideoUploadProgress = "已取消上传";
								$scope.Video=null;
							}
						}	
						$scope.$apply();			
					};
				}	
				editvideoUpload();	

				var KeyNO = getQueryStringByKey('KeyNo');

				$scope.Submit = function () {
					$("#mask").show();
					if ($scope.Courses.length == 0) {
						$scope.missProduct = true;
					} else {
						var checkFlag = true;

						for (var i = 0; i < $scope.Courses.length; i++) {
							if ($scope.Courses[i].Products.length == 0) {
								$scope.missProduct = true;
								checkFlag = false;
								break;
							}
						}

						if (checkFlag) {
							var submitCourses = [];
							for (var i = 0; i < $scope.Courses.length; i++) {
								var submitCourse = {
									CourseStep: 'CourseStep' + (i + 1),
									Products: []
								};
								for (var j = 0; j < $scope.Courses[i].Products.length; j++) {
									var pid = $scope.Courses[i].Products[j].KeyNo;
									submitCourse.Products.push(pid);
								}

								submitCourses.push(submitCourse);
							}

							var courseJSON = angular.toJson(submitCourses);

							var url = window.$servie + 'AdminApi/Trymakeup/UpdateTryMakeup';
							var production_upd_url = window.$ProductionService + 'AdminApi/Trymakeup/UpdateTryMakeup';
							var fields;
							var fields2;
							if($scope.webUpload){
								if($scope.videoUpload){
									fields = {
										KeyNO:KeyNO,
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										WebPath : $scope.WebFilePath,
										VideoPath : $scope.VideoFilePath,
										VideoHeight : $scope.VideoHeigth,
										VideoWidth : $scope.VideoWidth,
										Description: $scope.Description
									};
									fields2 = {
										KeyNO:KeyNO,						
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										WebPath : $scope.WebFilePath2,
										VideoPath : $scope.VideoFilePath2,
										VideoHeight : $scope.VideoHeigth,
										VideoWidth : $scope.VideoWidth,
										Description: $scope.Description
									};
								}else{
									fields = {
										KeyNO:KeyNO,					
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										WebPath : $scope.WebFilePath,
										Description: $scope.Description
									};
									fields2 = {
										KeyNO:KeyNO,							
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										WebPath : $scope.WebFilePath2,
										Description: $scope.Description
									};
								}
							}else{
								if($scope.videoUpload){
									fields = {
										KeyNO:KeyNO,						
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										VideoPath : $scope.VideoFilePath,
										VideoHeight : $scope.VideoHeigth,
										VideoWidth : $scope.VideoWidth,
										Description: $scope.Description
									};
									fields2 = {
										KeyNO:KeyNO,						
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										VideoPath : $scope.VideoFilePath2,
										VideoHeight : $scope.VideoHeigth,
										VideoWidth : $scope.VideoWidth,
										Description: $scope.Description
									};
								}else{
									fields = {
										KeyNO:KeyNO,						
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										Description: $scope.Description
									};
									fields2 = {
										KeyNO:KeyNO,						
										Name: $scope.Name,
										apiKey:window.$apiKey,
										CategoryKeyNo: $scope.SelectedCategoy,
										RelatedProduct : courseJSON,
										Description: $scope.Description
									};
								}
							}
							
							
							
							var files = [];
							var fileFormDataNames = [];
							if ($scope.IndexImage != undefined) {
								files.push($scope.IndexImage);
								fileFormDataNames.push('IndexImage');
							}

							if ($scope.Thumbnail != undefined) {
								files.push($scope.Thumbnail);
								fileFormDataNames.push('Thumbnail');
							}

							if($scope.ShareImage != undefined) {
								files.push($scope.ShareImage);
								fileFormDataNames.push('ShareImage');
							}

							if($scope.StarImage != undefined) {
								files.push($scope.StarImage);
								fileFormDataNames.push('TryImage');
							}


							var postUpdateDataFunc = function (url,dataFields, callback) {
								Upload.upload({
									url: url,
									fields: dataFields,
									file: files,
									fileFormDataName: fileFormDataNames
								}).success(function (data, status, headers, config) {
									callback(data);
								});
							}

							if ($scope.makeupDetail.$valid) {
								postUpdateDataFunc(url,fields, function (data) {
									if (data.IsSuccess) {
										if (data.Data.IsUpdated) {
											if (!window.$isTest) {
												postUpdateDataFunc(production_upd_url,fields2, function (result) {
													if (result.IsSuccess) {
														if (result.Data.IsUpdated) {
															$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
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
											} else {
												$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
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
								})
							}
						}
					}
				};
			}
		});
}

$scope.ReturnBack = function (token) {
	$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
};
}]);
