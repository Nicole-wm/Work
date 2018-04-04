maccoApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
	};

	var url = window.$servie + 'AdminApi/TryMakeup/FetchTryMakeupAdminList';
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
		if (this.after != '') {
			param.LastID = this.after;
		} else {
			param.LastID = 0;
		}

		param.Keyword = this.Keyword;
		$http.post(url, param).success(function (data) {
			console.log(data);
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);
				
				items[i].RealViewCount=0;
				items[i].RealLikeCount=0;
				var RealDataUrl = window.$AppApiService + 'AdminApi/TryMakeup/FetchTryMakeupRealLike';

				var realparam = {
					TryMakeupKeyNo:items[i].KeyNo
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

				if (items[i].EffectID == null) {
					items[i].HasEffect = false;
				} else {
					items[i].HasEffect = true;
				}
				var ispublish = items[i].IsPublish;
				if (ispublish == "0") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
					items[i].IsStarPublishFlag = 0;
				} else if (ispublish == "1") {
					items[i].IsPublishText = "是";
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 1;
					items[i].IsStarPublishFlag = 1;
				} else if (ispublish == "2") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
					items[i].IsStarPublishFlag = 1;
				}else if (ispublish == "3") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
					items[i].IsStarPublishFlag = 0;
				}else if (ispublish == "4") {
					items[i].IsPublishText = "否";
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 0;
					items[i].IsStarPublishFlag = 0;
				}
				
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}

				var isstar = items[i].IsHotlook;
				if (isstar == "0") {
					items[i].IsStarText = "否";
					items[i].IsStarFlag = 0;
				} else{
					items[i].IsStarText = "是";
					items[i].IsStarFlag = 1;
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

maccoApp.controller('makeupListController', function ($scope, $http, macco, $window, $rootScope) {
	$scope.stypes = [
	{ ID: 0, Name: "全部不包括删除" },
	{ ID: 1, Name: "已发布不含已删除" },
	{ ID: 2, Name: "未发布不含已删除" },
	{ ID: 3, Name: "删除但未发布" },
	{ ID: 4, Name: "删除已发布" }
	];

	$scope.Search = function () {
		$scope.macco.items = [];
		$scope.macco.busy = false;
		$scope.macco.after = '';
		$scope.macco.Keyword = $scope.Keyword;
		$scope.macco.SType = $scope.SType;
		$scope.$emit('list:search');
		$window.scroll(0, 10);
	};

	$scope.macco = new macco();
	$scope.AddNew = function () {
		var url = '/MakeupManage/MakeUpDetail.html?Token=' + $rootScope.Token + '&Type=Create';
		$window.location.href = url;
	};

	$scope.Update = function (ID,IsPublish,KeyNo) {
		if(IsPublish==4){
			$window.alert("请先取消定时发布，再修改信息！");
		}else{
			var url = '/MakeupManage/MakeUpDetail.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID + '&KeyNo=' + KeyNo;
			$window.location.href = url;           
		}
	};

	$scope.Visit = function (ID) {
		var url = '/MakeupManage/MakeUpDetail.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.location.href = url;
	};
	$scope.Keyword = '';

	$scope.Delete = function (keyNO) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定要删除吗')) {

				var url = window.$servie + 'AdminApi/TryMakeup/DeleteTryMakeup';
				var product_delete_url = window.$ProductionService + 'AdminApi/TryMakeup/DeleteTryMakeup';
				var param = {
					KeyNO: keyNO,
					apiKey: window.$apiKey
				};

				$http.post(url, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(product_delete_url, param).success(function (ret) {
									$window.alert('删除成功');
									$scope.ReturnBack();
								});
							} else {
								$window.alert('删除成功');
								$scope.ReturnBack();
							}
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

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
				var url = window.$servie + 'AdminApi/TryMakeup/PublishTryMakeup';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/TryMakeup/PublishTryMakeup';
				var param = {
					TryMakeupKeyNo: KeyNo,
					PushContent:$scope.PublishText,
					apiKey: window.$apiKey
				};

				var PushPublishInfoUrl = window.$ProductionService + 'AdminApi/TryMakeup/PushTryMakeup';
				var Pushparam= {
					TryMakeupKeyNo: KeyNo,
					PushContent:$scope.PublishText
				};

				$http.post(url, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublish) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsPublish) {
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
															$scope.ReturnBack ();
															$("#mask").hide();
														}
													}else{
														$window.alert('发布成功、推送失败，详情请咨询超级管理员！');
														scope.ReturnBack ();
														$("#mask").hide();
													}
												});
											}
										}
									}
								});
							} else {
								$window.alert('发布成功');
								$scope.ReturnBack();
								$("#mask").hide();
							}
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.EditComment = function (KeyNo, token) {
		var url = '/MakeupManage/CommentManager.html?Token=' + token + '&KeyNo=' + KeyNo;
		$window.location.href = url;
	};
	
	$scope.TimePublish = function (ID,token) {
		if ($rootScope.Operating) {
			var url = '/MakeupManage/tryMakeTimePublishDetails.html?Token=' + token + '&ID=' + ID;
			$window.location.href = url;
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	}

	$scope.Push = function (KeyNO, token) {
		if ($rootScope.Operating) {
			var url = '/MakeupManage/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ;
			$window.location.href = url;
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	}

	$scope.ToStar = function (KeyNO,token,HasStarImageUrlflag) {
		if ($rootScope.Operating) {
			if(!HasStarImageUrlflag){
				alert("请先对该上妆添加明星妆容图片。");
			}else{
				if ($window.confirm('确定设为明星妆容吗？')) {
					var TryMakeUpKeyNO = KeyNO;
					var visitUrl =  window.$servie + 'AdminApi/TryMakeup/RecommendMakeup';
					var Makeup_visitUrl = window.$ProductionService + 'AdminApi/TryMakeup/RecommendMakeup';

					$http.post(visitUrl,{TryMakeupKeyNo:TryMakeUpKeyNO}).success(function(data){
						if(data.IsSuccess) {
							if(data.Data.IsRecommended){
								$http.post(Makeup_visitUrl,{TryMakeupKeyNo:TryMakeUpKeyNO}).success(function (result) {
									if (result.IsSuccess) {
										if (result.Data.IsRecommended) {
											alert("设为明星妆容成功");
											$scope.ReturnBack();
										} else {
											$window.alert('出错');
										}
									}
								});
							}
						}
					});
				}
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.RemoveStar = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定取消设为明星妆容？')) {
				var TryMakeUpKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/TryMakeup/RemoveRecommendMakeup';
				var Makeup_visitUrl = window.$ProductionService + 'AdminApi/TryMakeup/RemoveRecommendMakeup';

				$http.post(visitUrl,{TryMakeupKeyNo:TryMakeUpKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRemoveRecommended){
							$http.post(Makeup_visitUrl,{TryMakeupKeyNo:TryMakeUpKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRemoveRecommended) {
										alert("取消设为明星妆容成功");
										$scope.ReturnBack();
									} else {
										$window.alert('出错');
									}
								}
							});
						}
					}
				});
			}else{

			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};

	$scope.ReturnBack = function (token) {
		$window.location.href = '/MakeupManage/MakeUpList.html?Token=' + $rootScope.Token;
	};
});