maccoApp.controller('BannerDetailController', ['$scope','$window','$http','$modal','Upload','$rootScope',function($scope, $window,$http,$modal,Upload,$rootScope) {
	var checkUrl = window.$servie + 'AdminApi/Banner/CheckBannerKeyNo';
	var checkUrl2 = window.$ProductionService + 'AdminApi/Banner/CheckBannerKeyNo';
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
	{ID:'2',Desc:"资讯"},
	{ID:'3',Desc:"上妆"},     
	{ID:'4',Desc:"活动"}
	];

	$scope.BannerRowImgWidth=null;
	bannerrowpic.onload = function() {
		var picWidth=$("#bannerrowpic").width();
		console.log(picWidth);
		$scope.BannerRowImgWidth=picWidth;
		if(picWidth % 414!=0&&picWidth % 375!=0){        	
			$("#selectBannerRowPic").attr("src","");
			$scope.$apply(function(){
				$scope.Banner=undefined;
			});       
			setTimeout("alert('上传图片宽度不是414px或者375px的倍数，请重新上传!')",0);
		}
	}

	var type = getQueryStringByKey('Type');

	if (type == 'Create') {
		$scope.OperationType = '(新增)';
		$scope.canEdit = true;
		$scope.NeedBanner = true;
		$scope.bannerlinkshow=false;

		$scope.Submit = function() {
			$("#mask").show();
			var url = window.$servie + 'AdminApi/Banner/CreateBanner';
			var bannerlink_create_url = window.$ProductionService + 'AdminApi/Banner/CreateBanner';

			var fields = {
				UserName:$rootScope.AdminUserName,
				Type: $scope.SelectedCategoy,
				KeyNO:$scope.item.KeyNo,
				apiKey : window.$apiKey
			};

			var Banner = $scope.Banner;

			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: Banner,
					fileFormDataName:'Banner'
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(url,function(data) {
				console.log(data);
				if(data.IsSuccess) {
					if(data.Data.IsCreated) {
						console.log(data);
						postCreateFunc(bannerlink_create_url,function(result) {
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
	
	$scope.AddNew = function() {
		$rootScope.SelectedCategoy= $scope.SelectedCategoy;
		
		var modalInstance = $modal.open({
			animation: true,
			templateUrl: '/BannerManagement/selectBannerLink.html',
			controller: "selectBannerLinkController",
			resolve: {
				items: function () {
					return $scope.selectedBannerLink;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.bannerlinkshow=true;
			$scope.item= selectedItem[0];
		}, function () {
		});
	};

	$scope.ReturnBack = function(token) {
		$window.location.href = '/BannerManagement/BannerManager.html?Token=' + $rootScope.Token;
	};

}]);
