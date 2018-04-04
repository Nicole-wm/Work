maccoApp.controller('productDetailController', ['$scope','$window','$http','Upload','$rootScope',function($scope, $window,$http,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Product/CheckProductKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Product/CheckProductKeyNo';
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
	$scope.WebShowSubmit=true;
	$scope.WebFilePath=null;
	
	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';
	
	$http.get(categoryUrl).success(function(data){
		if(data.IsSuccess) {
			$scope.Categories = data.Data;
		}
	});
	
	var brandListUrl =  window.$servie + 'AdminApi/Product/FetchFullBrand';
	$http.post(brandListUrl,null).success(function(data){
		console.log(data);
		if(data.IsSuccess) {
			$scope.Brands = data.Data;
		}
	});

	$scope.ImgWidth=null;
	pic.onload = function() {
		var picWidth=$("#pic").width();
		var picHeight=$("#pic").height();
		console.log(picWidth);
		$scope.ImgWidth=picWidth;
		if(picWidth % 350!=0||picHeight % 350!=0){
			$("#imgSelect").attr("src","");
			$scope.$apply(function(){
				$scope.brandImage=undefined;
			});     
			setTimeout("alert('上传图片宽度、长度不是350px，请重新上传!')",0);  
		}
	}

	//上传测评页面
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
				$scope.hasEvalflag = false;
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

	$scope.hasEvalFn=function(){
		$scope.hasEvalflag = true;
		if($scope.hasEval==false){
			$scope.Web = undefined;
			$scope.hasEvalflag = false;
		}
	}

	$scope.JudgeColor = function(){		
		var colorValue = $(this)[0].color;
		var regex =/^[0-9a-fA-F]{6}$/;
		var isValidata = regex.test(colorValue);
		if(isValidata){
			
		}else{
			$window.alert("请输入16进制RGB(例如：ffffff)");
		} 
	};

	$scope.TagLikeName = function(){		
		var likeName = $(this)[0].tag.Name;
		if(likeName!=undefined&&likeName!=""&&likeName.length<=20){
			
		}else{
			$window.alert("输入内容应不为空且小于20个字符");
		}
	};

	$scope.TagLikeCount = function(){		
		var likeValue = $(this)[0].tag.LikeCount;
		var regex = /^[0-9]*[1-9][0-9]*$/　;
		var isValidata = regex.test(likeValue);
		if(isValidata){
			
		}else{
			$window.alert("请输入正整数");
		}
	};

	function CheckColorFun(ObjData,i){
		var colorValue =ObjData;
		var regex =/^[0-9a-fA-F]{6}$/;
		var isValidata = regex.test(colorValue);
		if(isValidata){
			
		}else{
			$window.alert("第"+i+"个颜色请输入16进制RGB(例如：ffffff)！");
			$scope.CheckFlag=0;
			return;
		} 
	}

	function CheckTagFun(ObjData,i){
		var likeName = ObjData.Name;
		if(likeName!=undefined&&likeName!=""&&likeName.length<=20){
			var likeValue = ObjData.LikeCount;
			var regex = /^[0-9]*[1-9][0-9]*$/　;
			var isValidata = regex.test(likeValue);
			if(isValidata){
			}else{
				$window.alert("第"+i+"个Tag喜欢数请输入正整数");
				$scope.CheckFlag=0;
				return;
			}
		}else{
			$window.alert("第"+i+"个Tag请输入内容应不为空且小于20个字符");
			$scope.CheckFlag=0;
			return;
		}

	}
	function CheckTagColor(){
		$scope.CheckFlag=1;
		var CheckColor = $scope.colors;
		var CheckTag = $scope.tags;
		for(i=0;i<CheckColor.length;i++){
			CheckColorFun(CheckColor[i],i+1);
		}
		for(i=0;i<CheckTag.length;i++){
			CheckTagFun(CheckTag[i],i+1);
		}
	}
	
	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.productImageNeed = true;
		
		var colors = [''];
		var tags = [];
		var tagObj = new Object();
		tagObj.Name = '';
		tagObj.LikeCount = '';
		tags.push(tagObj);
		
		$scope.colors = colors;
		$scope.tags = tags;
		
		$scope.AddTag = function(){
			var tag = {};
			tag.Name = '';
			tag.LikeCount = '';
			tags.push(tag);	
		};
		
		$scope.DeleteTag = function(index) {
			if(tags.length >1) {
				tags.splice(index, 1);
			} else {
				alert('必须有个一个Tag');
			}
		};
		
		$scope.AddNewColor = function(){
			colors.push('');	
		};
		
		$scope.DeleteColor = function(index) {
			if(colors.length >1) {
				colors.splice(index, 1);
			} else {
				alert('必须有个一个颜色');
			}
		};

		$scope.Submit = function() {
			CheckTagColor();
			if($scope.CheckFlag==0){
				console.log("输入的数据有问题");
			}else{
				if($scope.productDetail.$valid) {
					$("#mask").show();
					var createUrl = window.$servie + 'AdminApi/Product/CreateProduct';
					var production_create_url = window.$ProductionService + 'AdminApi/Product/CreateProduct';

					var productImageFile = $scope.ProductImage;
					var tagNames = [];
					var tagLikeCounts = [];
					for(var i=0;i<$scope.tags.length;i++) {
						tagNames.push($scope.tags[i].Name);
						tagLikeCounts.push($scope.tags[i].LikeCount);
					}

					var LikeJSONData = {};
					LikeJSONData.Skin1 = $scope.Skin1;
					LikeJSONData.Skin2 = $scope.Skin2;
					LikeJSONData.Skin3 = $scope.Skin3;
					LikeJSONData.Skin4 = $scope.Skin4;
					LikeJSONData.Skin5 = $scope.Skin5;

					LikeJSONData.Age1 = $scope.Age1;
					LikeJSONData.Age2 = $scope.Age2;
					LikeJSONData.Age3 = $scope.Age3;
					LikeJSONData.Age4 = $scope.Age4;

					var fields = {
						UserName:$rootScope.AdminUserName,
						CategoryID: $scope.SelectedCategoy,
						BrandKeyNo: $scope.SelectBrand,
						ProductCName:$scope.ProductCName,
						ProductEName:$scope.ProductEName,
						Description:$scope.ProductDesc,
						Specification:$scope.Specification,
						Price:$scope.Price,
						Rank:$scope.Rank,
						Colors:$scope.colors.join(','),
						Tags:tagNames.join(','),
						TagCounts:tagLikeCounts.join(','),
						LikeJSONData:angular.toJson(LikeJSONData),
						hasEval:$scope.hasEval,
						WebPath : $scope.WebFilePath,
						apiKey:window.$apiKey
					};
					var fields2 = {
						UserName:$rootScope.AdminUserName,
						CategoryID: $scope.SelectedCategoy,
						BrandKeyNo: $scope.SelectBrand,
						ProductCName:$scope.ProductCName,
						ProductEName:$scope.ProductEName,
						Description:$scope.ProductDesc,
						Specification:$scope.Specification,
						Price:$scope.Price,
						Rank:$scope.Rank,
						Colors:$scope.colors.join(','),
						Tags:tagNames.join(','),
						TagCounts:tagLikeCounts.join(','),
						LikeJSONData:angular.toJson(LikeJSONData),
						hasEval:$scope.hasEval,
						WebPath : $scope.WebFilePath2,
						apiKey:window.$apiKey
					};

					var postCreateFunc = function(url,dataField,callback) {
						Upload.upload({
							url: url,
							fields:dataField,
							file: productImageFile,
							fileFormDataName:'ProductImage'
						}).success(function (data, status, headers, config){
							callback(data);
						});
					};

					postCreateFunc(createUrl,fields,function(data) {
						if(data.IsSuccess) {
							if(data.Data.IsCreated) {
								if(!window.$isTest) {
									postCreateFunc(production_create_url,fields2,function(result){
										if(result.IsSuccess) {
											if(result.Data.IsCreated) {
												if (data.Data.KeyNo==result.Data.KeyNo) {
													$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
													$("#mask").hide();
												}else{
													alert("后台添加数据发生错误，详情咨询管理员！");
													$scope.ReturnBack();
													$("#mask").hide();
												}
											} else {
												$window.alert('failed');
												$("#mask").hide();
											}
										} else {
											$window.alert('failed');
											$("#mask").hide();
										}
									});
								} else {
									$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
									$("#mask").hide();
								}
							} else {
								$window.alert('failed');
								$("#mask").hide();
							}
						} else {
							$window.alert('failed');
							$("#mask").hide();
						}
					});

				}
			}
		};
	} 

	if(type == 'Visit') {
		$scope.OperationType = '';
		$scope.canEdit = false;
		var visitApi = window.$servie + 'AdminApi/Product/FetchProductFullDetail';
		var productID = window.getQueryStringByKey('ID');
		var param = {
			ProductID: productID
		};
		$http.post(visitApi,param).success(function(data){
			if(data.IsSuccess) {
				$scope.ProductCName = data.Data.ProductCName;
				$scope.ProductEName = data.Data.ProductEName;
				$scope.ProductDesc = data.Data.Description;
				$scope.Specification = data.Data.Specification;
				$scope.Price = data.Data.Price;
				$scope.SelectedCategoy = data.Data.CategoryID;
				$scope.SelectBrand = data.Data.BrandKeyNo;
				$scope.Rank = data.Data.Rank;
				$scope.ProductImageUrl = data.Data.ProductImageUrl;
				$scope.colors = data.Data.Colors;
				$scope.tags = data.Data.Tags;
				var likeData = angular.fromJson(data.Data.LikeDataJSON);
				$scope.Skin1 = likeData.Skin1;
				$scope.Skin2 = likeData.Skin2;
				$scope.Skin3 = likeData.Skin3;
				$scope.Skin4 = likeData.Skin4;
				$scope.Skin5 = likeData.Skin5;

				$scope.Age1 = likeData.Age1;
				$scope.Age2 = likeData.Age2;
				$scope.Age3 = likeData.Age3;
				$scope.Age4 = likeData.Age4;

				if(data.Data.hasEval!= 0){
					$scope.hasEval = true; 
					$scope.Web= data.Data.WebPath;
				}else{
					$scope.hasEval = false; 
					$scope.Web = "";
				}
			}
		});
	}

	if(type == 'Update') {
		$scope.OperationType = '(更新)';
		$scope.canEdit = true;
		$scope.productImageNeed = false;
		$scope.hasEvalflag = false;

		$scope.colors = colors;
		$scope.AddNewColor = function(){
			colors.push('');	
		};
		$scope.AddNewColor = function(){
			$scope.colors.push('');	
		};

		$scope.DeleteColor = function(index) {
			if($scope.colors.length >1) {
				$scope.colors.splice(index, 1);
			} else {
				alert('必须有个一个颜色');
			}
		};

		var visitApiUrl = window.$servie + 'AdminApi/Product/FetchProductFullDetail';
		var productID = window.getQueryStringByKey('ID');
		var param = {
			ProductID: productID
		};


		var tags = [];

		$http.post(visitApiUrl,param).success(function(data){
			if(data.IsSuccess) {
				$scope.KeyNo = data.Data.KeyNo;
				$scope.ProductCName = data.Data.ProductCName;
				$scope.ProductEName = data.Data.ProductEName;
				$scope.ProductDesc = data.Data.Description;
				$scope.Specification = data.Data.Specification;
				$scope.Price = data.Data.Price;
				$scope.SelectedCategoy = data.Data.CategoryID;
				$scope.SelectBrand = data.Data.BrandKeyNo;
				$scope.Rank = data.Data.Rank;
				$scope.ProductImageUrl = data.Data.ProductImageUrl;
				$scope.colors = data.Data.Colors;
				$scope.tags = data.Data.Tags;
				var likeData = angular.fromJson(data.Data.LikeDataJSON);
				$scope.Skin1 = likeData.Skin1;
				$scope.Skin2 = likeData.Skin2;
				$scope.Skin3 = likeData.Skin3;
				$scope.Skin4 = likeData.Skin4;
				$scope.Skin5 = likeData.Skin5;

				$scope.Age1 = likeData.Age1;
				$scope.Age2 = likeData.Age2;
				$scope.Age3 = likeData.Age3;
				$scope.Age4 = likeData.Age4;

				if(data.Data.hasEval!= 0){
					$scope.hasEval = true; 
					$scope.Web= data.Data.WebPath;
				}else{
					$scope.hasEval = false; 
					$scope.Web = "";
				}
				tags= $scope.tags;
				$scope.AddTag = function(){
					var tag = {};
					tag.Name = '';
					tag.LikeCount = '';
					tags.push(tag);	
					$scope.tags = tags;
				};

				$scope.DeleteTag = function(index) {
					if(tags.length >1) {
						tags.splice(index, 1);
						$scope.tags = tags;
					} else {
						alert('必须有个一个Tag');
					}
				};
			}
		});

		$scope.Submit = function() {
			if($scope.hasEval){
				if($scope.Web==null){
					alert("内容没有上传");
					return false;
				}
			}
			CheckTagColor();
			if($scope.CheckFlag==0){
				console.log("输入的数据有问题");
			}else{
				if($scope.productDetail.$valid) {
					$("#mask").show();
					var updateUrl = window.$servie + 'AdminApi/Product/UpdateProduct';
					var production_updateUrl = window.$ProductionService + 'AdminApi/Product/UpdateProduct';
					var productImageFile = $scope.ProductImage;

					var tagNames = [];
					var tagLikeCounts = [];
					for(var i=0;i<$scope.tags.length;i++) {
						tagNames.push($scope.tags[i].Name);
						tagLikeCounts.push($scope.tags[i].LikeCount);
					}

					var LikeJSONData = {};
					LikeJSONData.Skin1 = $scope.Skin1;
					LikeJSONData.Skin2 = $scope.Skin2;
					LikeJSONData.Skin3 = $scope.Skin3;
					LikeJSONData.Skin4 = $scope.Skin4;
					LikeJSONData.Skin5 = $scope.Skin5;

					LikeJSONData.Age1 = $scope.Age1;
					LikeJSONData.Age2 = $scope.Age2;
					LikeJSONData.Age3 = $scope.Age3;
					LikeJSONData.Age4 = $scope.Age4;

					var fields = {
						ProductKeyNo:$scope.KeyNo,
						CategoryID: $scope.SelectedCategoy,
						BrandKeyNo: $scope.SelectBrand,
						ProductCName:$scope.ProductCName,
						ProductEName:$scope.ProductEName,
						Description:$scope.ProductDesc,
						Specification:$scope.Specification,
						Price:$scope.Price,
						Rank:$scope.Rank,
						Colors:$scope.colors.join(','),
						Tags:tagNames.join(','),
						TagCounts:tagLikeCounts.join(','),
						LikeJSONData:angular.toJson(LikeJSONData),
						hasEval:$scope.hasEval,
						WebPath : $scope.WebFilePath,
						apiKey:window.$apiKey
					};

					var fields2 = {
						ProductKeyNo:$scope.KeyNo,
						CategoryID: $scope.SelectedCategoy,
						BrandKeyNo: $scope.SelectBrand,
						ProductCName:$scope.ProductCName,
						ProductEName:$scope.ProductEName,
						Description:$scope.ProductDesc,
						Specification:$scope.Specification,
						Price:$scope.Price,
						Rank:$scope.Rank,
						Colors:$scope.colors.join(','),
						Tags:tagNames.join(','),
						TagCounts:tagLikeCounts.join(','),
						LikeJSONData:angular.toJson(LikeJSONData),
						hasEval:$scope.hasEval,
						WebPath : $scope.WebFilePath2,
						apiKey:window.$apiKey
					};

					var postUpdateFunc = function(url,dataField,callback) {
						Upload.upload({
							url: url,
							fields:dataField,
							file: productImageFile,
							fileFormDataName:'ProductImage'
						}).success(function (data, status, headers, config){
							callback(data);
						});
					}

					if(productImageFile != undefined) {
						postUpdateFunc(updateUrl,fields,function(data) {
							if(data.IsSuccess) {
								if(data.Data.IsUpdated) {
									if(!window.$isTest) {
										postUpdateFunc(production_updateUrl,fields2,function(result){
											if(result.IsSuccess) {
												if(result.Data.IsUpdated) {
													$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
													$("#mask").hide();
												} else {
													$window.alert('failed');
													$("#mask").hide();
												}
											} else {
												$window.alert('failed');
												$("#mask").hide();
											}
										});
									} else {
										$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
										$("#mask").hide();
									}
								} else {
									$window.alert('failed');
									$("#mask").hide();
								}
							} else {
								$window.alert('failed');
								$("#mask").hide();
							}
						});

					} else {
						$http.post(updateUrl,fields).success(function(data) {
							if(data.IsSuccess) {
								if(data.Data.IsUpdated) {
									if(!window.$isTest) {
										$http.post(production_updateUrl,fields2).success(function(ret) {
											if(ret.IsSuccess) {
												if(ret.Data.IsUpdated) {
													$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
													$("#mask").hide();
												} else {
													$window.alert('failed');
													$("#mask").hide();
												}
											} else {
												$window.alert('failed');
												$("#mask").hide();
											}
										});	
									} else {
										$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
										$("#mask").hide();
									}
								} else {
									alert('failed');
									$("#mask").hide();
								}
							}
						});
					}
				}
			}
		};

	}

	$scope.ReturnBack = function(token) {
		$window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
	};

}]);