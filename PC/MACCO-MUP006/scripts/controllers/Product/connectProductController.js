maccoApp.controller('connectProductController', function($scope, $http,Upload,$window,$rootScope,$modal) {
	var searchFn = function() {
		$scope.items =[];
		var id = getQueryStringByKey('ID');
		var url = window.$servie + 'AdminApi/Product/FetchConnectProductList';

		$http.post(url,{ID:id}).success(function(data){
			if(data.IsSuccess) {
				$scope.items = data.Data;
			}
		});
	};

	searchFn();

	$scope.AddNew = function() {
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: '/ProductManagement/selectConnectProduct.html',
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
					}
				}
			}
		}, function () {
		});
	};

	$scope.Delete = function(ID) {
		if($window.confirm('将会删除对应品牌故事产品，确定要这样做吗？')) {
			var products = $scope.items;
			for (var j = 0; j < products.length; j++) {
				if(products[j].KeyNo==ID&&products[j].ImageUrl){
					var deleteUrl =  window.$servie + 'AdminApi/Product/DeleteConnectProductList';
					var productionDeleteUrl =  window.$ProductionService + 'AdminApi/Product/DeleteConnectProductList';
					var brandKeyNo= getQueryStringByKey('KeyNo');
					var param = {
						BrandKeyNo:brandKeyNo,
						ProductKeyNo:ID,
						apiKey:window.apiKey
					};
					$http.post(deleteUrl,param).success(function(data){
						if(data.IsSuccess) {
							if(data.Data.IsDeleted) {
								if(!window.$isTest) {
									$http.post(productionDeleteUrl,param).success(function(ret){
										if(ret.IsSuccess) {
											if(ret.Data.IsDeleted) {
												$window.alert('删除成功');
												searchFn();
											}
										} else {
											$window.alert('删除失败');
										}
									});
								} else {
									$window.alert('删除成功');
									searchFn();
								}
							} else {
								$window.alert('删除失败');
							}
						} else {
							$window.alert('删除失败');
						}
					}); 
				}
				if(products[j].KeyNo==ID&&!products[j].ImageUrl){
					products.splice(j, 1);
					$window.alert('删除成功');
				}
			}
		}
	};

	$scope.Submit = function() {
		var uploadflag=true;
		for(var i=0;i<$scope.items.length;i++) {
			if(!$scope.items[i].StoryImage&&!$scope.items[i].ImageUrl){
				uploadflag=false;
				alert("有相关故事图片没有上传！");
				return;
			}
		}

		if(uploadflag){
			var updateUrl = window.$servie + 'AdminApi/Product/CreateConnectProduct';
			var production_update_url = window.$ProductionService + 'AdminApi/Product/CreateConnectProduct';
			var id = getQueryStringByKey('KeyNo');

			var ProductId= [];
			var ProductStoryImage= [];
			var filenames=[];
			for(var i=0;i<$scope.items.length;i++) {
				ProductId.push($scope.items[i].KeyNo);
				if($scope.items[i].StoryImage) {
					ProductStoryImage.push($scope.items[i].StoryImage);
					filenames.push("imageUrl"+i);
				}else{
					ProductStoryImage.push($scope.items[i].ImageUrl);
					filenames.push("imageUrl"+i);
				}
			}

			var ProductIdsArr=ProductId.join(',');

			var fields = {
				BrandKeyNo:id,
				ProductKeyNos:ProductIdsArr,
				apiKey:window.$apiKey
			};

			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: ProductStoryImage,
					fileFormDataName:filenames,
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(updateUrl,function(data) {
				if(data.IsSuccess) {
					postCreateFunc(production_update_url,function(result){
						if(result.IsSuccess) {
							if(result.Data.IsCreated) {
								$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
							} else {
								$window.alert('出错');
							}
						} else {
							$window.alert('出错');
						}
					});
				} else {
					$window.alert('出错');
				}
			});
		}
	}

	$scope.ReturnBack = function(token) {
		$window.location.href = '/ProductManagement/brandList.html?Token=' + $rootScope.Token;
	};
	
}); 