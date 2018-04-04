maccoApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.SType = '';
		this.Keyword = '';
	};

	var url = window.$servie + 'AdminApi/Information/FetchInfoList';
	var param = {
		PageSize: 10,
		LastID: 0,
		Keyword: ""
	};


	macco.prototype.nextPage = function () {
		this.busy = true;
		if (this.SType != undefined && this.SType != '') {
			param.SType = this.SType;
		} else {
			param.SType = 0;
		}
		if (this.after != undefined && this.after != '') {
			param.LastID = this.after;
		}
		if (this.Keyword != '') {
			param.Keyword = this.Keyword;
		} else {
			param.Keyword = 0;
		}
		$http.post(url, param).success(function (data) {
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);

				items[i].RealViewCount=0;
				items[i].RealLikeCount=0;
				var RealDataUrl = window.$AppApiService + 'AdminApi/Information/FetchInfoRealLike';

				var realparam = {
					InfoKeyNo:items[i].KeyNo
				};

				$.ajax({ 
					type: "POST", 
					url: RealDataUrl, 
					data:realparam,
					dataType: "json",
					async:false,  
					success: function (data) {
						items[i].RealViewCount=data.Data[0].ViewCount;
						items[i].RealLikeCount=data.Data[0].LikeCount;
					}, 
					error: function (XMLHttpRequest, textStatus, errorThrown) { 
						alert(errorThrown); 
					} 
				});

				var ispublish = items[i].IsPublish;
				if (ispublish == "0") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				} else if (ispublish == "1") {
					items[i].IsPublishText = "是";
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 1;
				} else if (ispublish == "2") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				} else if (ispublish == "3") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				}else if (ispublish == "4") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 0;
				}
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}
			}
			if (this.items.length != 0) {
				this.after = this.items[this.items.length - 1].ID;
			}
			this.busy = false;
		}.bind(this));
		this.busy = false;
	};

	return macco;
});

maccoApp.controller('InfoListController', function ($scope, $http, macco, $window, $rootScope) {
	$scope.stypes = [
	{ ID: 0, Name: "全部不包括删除" },
	{ ID: 1, Name: "已发布不含已删除" },
	{ ID: 2, Name: "未发布不含已删除" },
	{ ID: 3, Name: "删除但未发布" },
	{ ID: 4, Name: "删除已发布" }
	];

	$scope.macco = new macco();
	var searchFn = function () {
		$scope.macco.after = '';
		$scope.macco.items = [];
		$scope.macco.busy = false;
		$scope.macco.SType = $scope.SType;
		$scope.macco.Keyword = $scope.Keyword;
		$scope.$emit('list:search');
		$window.scroll(0, 10);
	};
	$scope.search = searchFn;
	searchFn();

	$scope.AddNew = function () {
		var url = '/InformationManage/informationDetails.html?Token=' + $rootScope.Token + '&Type=Create';
		$window.location.href = url;
	};

	$scope.Update = function (ID,IsPublish,KeyNo) {
		if(IsPublish==4){
			$window.alert("请先取消定时发布，再修改信息！");
		}else{
			var url = '/InformationManage/informationDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID + '&KeyNo=' + KeyNo;
			$window.location.href = url;
		}
	};

	$scope.Visit = function (ID) {
		var url = '/InformationManage/informationDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
	};

	$scope.Delete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定要这样做吗？')) {
				var deleteUrl = window.$servie + 'AdminApi/Information/DeleteInfo';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/Information/DeleteInfo';
				var param = {
					KeyNo: ID,
					apiKey: window.$apiKey
				};

				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (result) {
									if (result.IsSuccess) {
										if (result.Data.IsDeleted) {
											$window.alert('删除成功');
											searchFn();
										} else {
											$window.alert('出错');
										}
									} else {
										$window.alert('出错');
									}
								}).error(function (data) {
									console.dir(data);
								});
							} else {
								$window.alert('删除成功');
								searchFn();
							}
						} else {
							$window.alert('出错');
						}
					}
				});

			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.EditComment = function (KeyNo,token) {
		var url = '/InformationManage/CommentManager.html?Token=' + token + '&KeyNo=' + KeyNo;
		$window.location.href = url;
	};

	// 发布
	$scope.Publish = function (KeyNo,IsPublish) {
		if ($rootScope.Operating) {
			$scope.PublishText="";
			if (IsPublish == 0) {
				$scope.LikeShowFlag=KeyNo;
				$scope.SubmitPublishText=function(){
					if ($window.confirm("数据将被发布到外网，确定吗？")) {
						for(var i=0;i<$scope.macco.items.length;i++){
							if($scope.macco.items[i].KeyNo==KeyNo){
								$scope.PublishText=$scope.macco.items[i].PublishText;
							}
						}
						PublishFun();
					}else{
						$scope.LikeShowFlag=0;
					}
				}
			}else{
				if ($window.confirm("数据将被发布到外网，确定吗？")) {
					PublishFun();
				}
			}
			function PublishFun(){
				$("#mask").show();
				var publishUrl = window.$servie + 'AdminApi/Information/PublishInfo';
				var production_publishUrl = window.$ProductionService + 'AdminApi/Information/PublishInfo';
				var param = {
					InfoKeyNo: KeyNo,
					PushContent:$scope.PublishText,
					apiKey: window.$apiKey
				};
				var PushPublishInfoUrl = window.$ProductionService + 'AdminApi/Information/PushInfo';
				var Pushparam= {
					InfoKeyNo: KeyNo,
					PushContent:$scope.PublishText
				};

				$http.post(publishUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							$http.post(production_publishUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsPublished) {
										if($scope.PublishText==""||$scope.PublishText==undefined){
											$window.alert('发布成功');
											$scope.ReturnBack ();
											$("#mask").hide();
										}else{
											$http.post(PushPublishInfoUrl,Pushparam).success(function (data) {
												if (data.IsSuccess) {
													if (data.Data.IsPushed) {
														$window.alert('发布并推送成功');
														$scope.ReturnBack ();
														$("#mask").hide();
													}else{
														$window.alert('发布成功、推送失败，详情请咨询超级管理员！');
														scope.ReturnBack ();
														$("#mask").hide();
													}
												}else{
													$window.alert('发布成功、推送失败，详情请咨询超级管理员！');
													$scope.ReturnBack ();
													$("#mask").hide();
												}
											});
										}
									} else {
										$window.alert('发布出错');
										$("#mask").hide();
									}
								}
							});
						} else {
							$window.alert('发布出错');
							$("#mask").hide();
						}
					} else {
						$window.alert('发布出错');
						$("#mask").hide();
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	
	$scope.TimePublish = function (ID,token) {
		if ($rootScope.Operating) {
			var url = '/InformationManage/TimePublishDetails.html?Token=' + token + '&ID=' + ID;
			$window.location.href = url;
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	
	$scope.Push = function (KeyNO, token) {
		if ($rootScope.Operating) {
			var url = '/InformationManage/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ;
			$window.location.href = url;
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	}
    //制作网页
    $scope.MakeWeb = function (KeyNO,ID,token) {
    	var url = '/InformationManage/MakeWeb.html?Token=' + token + '&KeyNO=' + KeyNO + '&ID=' + ID ;
    	$window.location.href = url;
    }

    $scope.ReturnBack = function(token) {
    	$window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
    };
});
