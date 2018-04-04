maccoApp.controller('TopDetailController', ['$scope','$window','$http','Upload','$rootScope','$modal',function($scope, $window,$http,Upload,$rootScope,$modal) {
    var checkUrl = window.$servie + 'AdminApi/TopProduct/CheckTopProductKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/TopProduct/CheckTopProductKeyNo';
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

	$scope.items =[];
	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';
	$http.get(categoryUrl).success(function(data){
		if(data.IsSuccess) {
			$scope.Categories = data.Data;
		}
	});

	var type = getQueryStringByKey('Type');

	$scope.BannerImgWidth=null;
	$scope.TopImgWidth=null;

	bannerpic.onload = function() {
		var picWidth=$("#bannerpic").width();
		$scope.BannerImgWidth=picWidth;
		if(picWidth % 414!=0&&picWidth % 375!=0){
			$("#selectBannerPic").attr("src","");
			$scope.$apply(function(){
				$scope.Banner=undefined;
			});       
			setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);
		}
	}

	topimagepic.onload = function() {
		var picWidth=$("#topimagepic").width();
		$scope.TopImgWidth=picWidth;
		if(picWidth % 414!=0&&picWidth % 375!=0){
			$("#selectTopPic").attr("src","");
			$scope.$apply(function(){
				$scope.TopImage=undefined;
			});       
			setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);
		}
	}  
	
	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.topProductShow=false;
		$scope.NeedBannerImage = true;
		$scope.NeedTopImage = true;
		$scope.Submit = function() {
			if($scope.items.length==0){
				alert("请添加产品!");
			}else{
				$("#mask").show();
				var ProductId= [];

				for(var i=0;i<$scope.items.length;i++) {
					ProductId.push($scope.items[i].KeyNo);
				}
				var ProductIdArr=ProductId.join(',');
				console.dir(ProductIdArr);

				if($scope.TopDetail.$valid) {
					var createUrl = window.$servie + 'AdminApi/TopProduct/CreateTopProduct';
					var top_create_url = window.$ProductionService + 'AdminApi/TopProduct/CreateTopProduct';

					var fields = {
						UserName:$rootScope.AdminUserName,
						Title: $scope.Title,
						Description: $scope.Description,
						ProductKeyNos:ProductIdArr,
						apiKey:window.$apiKey
					};

					var files = [];
					files.push($scope.Banner);
					files.push($scope.TopImage);

					var postCreateFunc = function(url,callback) {
						Upload.upload({
							url: url,
							fields:fields,
							file: files,
							fileFormDataName:['BannerImage','TitleImage']
						}).success(function (data, status, headers, config){
							callback(data);
						});
					};

					postCreateFunc(createUrl,function(data) {
						if(data.IsSuccess) {
							if (!window.$isTest) {
								postCreateFunc(top_create_url,function(result){
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
							}else{
								$window.location.href = '/TopManagement/TopManager.html?Token=' + $rootScope.Token;
								$("#mask").hide();
							}	
						} else {
							$window.alert('出错');
							$("#mask").hide();
						}
					});
				}
			}
		};
	};
	
	if (type == 'Visit') {
		$scope.OperationType = '';
		$scope.canEdit = false;
		$scope.NeedBannerImage = false;
		$scope.NeedTopImage = false;
		$scope.topProductShow=true;
		var TopID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/TopProduct/FetchTopProductDetail';

		$http.post(visitUrl,{ID:TopID}).success(function(data){
			if(data.IsSuccess) {
				$scope.Title = data.Data[0].Title;
				$scope.BannerUrl = data.Data[0].BannerImage;
				$scope.TopImageUrl = data.Data[0].TitleImage;
				$scope.items = data.Data[0].Products;
				$scope.Description = data.Data[0].Description;
				for(i=0;i<data.length;i++){
					$scope.items[i].create=true;
				}
			}
		});
	};
	
	if (type == 'Update') {
		$scope.OperationType = '(编辑)';
		$scope.canEdit = true;
		$scope.NeedBannerImage = false;
		$scope.NeedTopImage = false;
		$scope.topProductShow=true;

		var OldID=[];

		var TopID = getQueryStringByKey("ID");
		var visitUrl =  window.$servie + 'AdminApi/TopProduct/FetchTopProductDetail';

		$http.post(visitUrl,{ID:TopID}).success(function(data){
			if(data.IsSuccess) {
				$scope.KeyNO = data.Data[0].KeyNo;
				$scope.Title = data.Data[0].Title;
				$scope.BannerUrl = data.Data[0].BannerImage;
				$scope.TopImageUrl = data.Data[0].TitleImage;
				$scope.items = data.Data[0].Products;
				$scope.Description = data.Data[0].Description;
				for(i=0;i<data.Data[0].Products.length;i++){
					OldID[i]=data.Data[0].Products[i].KeyNo;
				}
			}
		});

		$scope.Submit = function() {
			var SameID=[];
			var AddID=[];
			var RemoveID=[];

			var AllID=[];
			var Flag=[];

			if($scope.items.length==0){
				alert("请添加产品！");
			}else{
				$("#mask").show();
				var ProductKeyNo= [];
				var ProductID=[];
				for(var i=0;i<$scope.items.length;i++) {
					ProductKeyNo.push($scope.items[i].KeyNo);
					ProductID.push($scope.items[i].KeyNo);
				}
				
				console.dir('旧ID:'+OldID);
				console.dir('新ID:'+ProductID);
				if(true){
					var i=0;
					for(i=0;i<ProductID.length;i++){
						for(j=0;j<OldID.length;j++){
							if(ProductID[i]==OldID[j]){
								SameID.push(ProductID[i]);
							}
						}
					}
					if(i==ProductID.length){
						for(m=0;m<OldID.length;m++){
							for(n=0;n<SameID.length;n++){
								if(SameID[n]==OldID[m]){
									OldID[m]=0;
									break;
								}
							}
						}
						if(m==OldID.length){
							for(m=0;m<OldID.length;m++){
								if(OldID[m]!=0){
									RemoveID.push(OldID[m]);
								}
							}
						}
						for(a=0;a<ProductID.length;a++){
							for(b=0;b<SameID.length;b++){
								if(SameID[b]==ProductID[a]){
									ProductID[a]=0;
									break;
								}
							}
						}
						if(a==ProductID.length){
							for(b=0;b<ProductID.length;b++){
								if(ProductID[b]!=0){
									AddID.push(ProductID[b]);
								}
							}
						}
					}
				}
				console.dir('same:'+SameID);
				console.dir('add:'+AddID);
				console.dir('remove:'+RemoveID);
				if(true){
					for(i=0;i<SameID.length;i++){
						AllID.push(SameID[i]);
						Flag.push(1);
					}
					if(i==SameID.length){
						for(j=0;j<AddID.length;j++){
							AllID.push(AddID[j]);
							Flag.push(0);
						}
						if(j==AddID.length){
							for(k=0;k<RemoveID.length;k++){
								AllID.push(RemoveID[k]);
								Flag.push(2);
							}
						}
					}
				}
				console.dir('AllID:'+AllID);
				console.dir('Flag:'+Flag);
				var ProductKeyNoArr=AllID.join(',');
				var FlagArr=Flag.join(',');

				if($scope.TopDetail.$valid) {
					var updateUrl = window.$servie + 'AdminApi/TopProduct/UpdateTopProduct';
					var top_update_url = window.$ProductionService + 'AdminApi/TopProduct/UpdateTopProduct';

					var fields = {
						KeyNO:$scope.KeyNO,
						Title: $scope.Title,
						Description: $scope.Description,
						ProductKeyNos:ProductKeyNoArr,
						Flags:FlagArr,
						apiKey:window.$apiKey
					};

					var files = [];
					var filesNames = [];
					if($scope.Banner != null) {
						files.push($scope.Banner);
						filesNames.push("BannerImage");
					}
					if($scope.TopImage != null){
						files.push($scope.TopImage);
						filesNames.push("TitleImage");
					}

					var postCreateFunc = function(url,callback) {
						Upload.upload({
							url: url,
							fields:fields,
							file: files,
							fileFormDataName:filesNames
						}).success(function (data, status, headers, config){
							callback(data);
						});
					};

					postCreateFunc(updateUrl,function(data) {
						if(data.IsSuccess) {
							if (!window.$isTest) {
								postCreateFunc(top_update_url,function(result){
									if(result.IsSuccess) {
										if(result.Data.IsUpdated) {
											$window.location.href = '/TopManagement/TopManager.html?Token=' + $rootScope.Token;
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
								$window.location.href = '/TopManagement/TopManager.html?Token=' + $rootScope.Token;
								$("#mask").hide();
							}	
						} else {
							$window.alert('出错');
							$("#mask").hide();
						}
					});
				}
			}
		};

	};

	$scope.SelectCategoy = true;
	$scope.Select=function(){
		$scope.SelectCategoy = false;
	}

	$scope.ReturnBack = function(token) {
		$window.location.href = '/TopManagement/TopManager.html?Token=' + $rootScope.Token;
	};

	$scope.AddNew = function() {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: '/TopManagement/selectTopProduct.html',
			controller: "selectProductController",
			resolve: {
				items: function () {
					return $scope.selectedProduct;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selectedProduct = selectedItem;
			var flag=1;
			for (var j = 0; j < selectedItem.length; j++) {
				var products = $scope.items;
				if(products.length=="0"){
					$scope.items.push(selectedItem[j]);
					$scope.topProductShow=true;
					if (type == 'Create') {
						for(var i=0;i<$scope.items.length;i++) {
							$scope.items[i].create=true;
						}
					}else{
						for(var i=0;i<$scope.items.length;i++) {
							if($scope.items[i].ID==selectedItem[j].ID){
								$scope.items[i].create=true;
								break;
							}
						}
					}
				}else{
					for (var i = 0; i < products.length; i++) {
						if(products[i].ID==selectedItem[j].ID){
							flag=0;
							$window.alert('已经存在该产品');
							return;
						}
					}
					if(flag){
						$scope.items.push(selectedItem[j]);
						$scope.topProductShow=true;
						if (type == 'Create') {
							for(var i=0;i<$scope.items.length;i++) {
								$scope.items[i].create=true;
							}
						}else{
							for(var i=0;i<$scope.items.length;i++) {
								if($scope.items[i].ID==selectedItem[j].ID){
									$scope.items[i].create=true;
									break;
								}
							}
						}
					}
				}
			}
		}, function () {
		});
	};

	$scope.Delete = function(ID) {
		if($window.confirm('将会删除对应产品，确定要这样做吗？')) {
			var products = $scope.items;
			for (var j = 0; j < products.length; j++) {
				if(products[j].ID==ID){
					products.splice(j, 1);
					$window.alert('删除成功');
				}
			}
		}
	};

	$scope.ProductDetail = function (ID,KeyNO,token) {
		var TopID = getQueryStringByKey('ID');
		var TopKeyNO= getQueryStringByKey('KeyNO');
		var type = getQueryStringByKey('Type');
		var url = '/TopManagement/TopProductDetails.html?Token=' + token + '&Type=' +type+'&KeyNO=' + KeyNO + '&ID=' + ID + '&TopKeyNO=' + TopKeyNO + '&TopID=' + TopID;
		$window.location.href = url;
	};
}]);
