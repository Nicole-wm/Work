maccoApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Stype = '';
	};

	var url = window.$servie + 'AdminApi/Homepage/FetchUnPublishData';
	var param = {
		PageSize: 10,
		LastID: 0,
		Stype:0
	};


	macco.prototype.nextPage = function () {
		this.busy = true;
		if (this.after != undefined && this.after != '') {
			param.LastID = this.after;
		}
		param.Stype = this.Stype;
		$http.post(url, param).success(function (data) {
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				this.items.push(items[i]);
				var ispublish = items[i].IsPublish;
				if (ispublish == "0") {
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				} else if (ispublish == "1") {
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 1;
				} else if (ispublish == "2") {
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				} else if (ispublish == "3") {
					items[i].IsPublishFlag = 0;
					items[i].IsTimePublishFlag = 0;
				}else if (ispublish == "4") {
					items[i].IsPublishFlag = 1;
					items[i].IsTimePublishFlag = 0;
				}
				var isdeleted = items[i].IsDeleted;
				if (isdeleted == "1") {
					items[i].IsDeletedFlag = 1;
				} else {
					items[i].IsDeletedFlag = 0;
				}
				var isrecommended = items[i].IsRecommended;
				if (isrecommended == "1") {
					items[i].IsRecommendedFlag = 1;
				} else {
					items[i].IsRecommendedFlag = 0;
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

maccoApp.controller('IndexAppController',function ($scope, $http ,macco,$window, $rootScope){
	$scope.stypes = [
	{ID:0,Name:"当天"},
	{ID:1,Name:"最近7天"},
	{ID:2,Name:"最近15天"},
	{ID:3,Name:"最近30天"},     
	];

	$scope.Categorys = [
	{ ID: 0, Name: "资讯"},
	{ ID: 1, Name: "活动"},
	{ ID: 2, Name: "试妆"},
	{ ID: 3, Name: "产品"},
	{ ID: 4, Name: "Top10"}
	];

	$scope.macco = new macco();
	$scope.search = function () {
		$scope.CurType= $scope.PublishCategory*1;
		$scope.macco.after = '';
		$scope.macco.items = [];
		$scope.macco.busy = false;
		$scope.macco.Stype = $scope.PublishCategory*1;
		$scope.$emit('list:search');
		$window.scroll(0, 10);
	};
	$scope.search();

	Menu3();
	$scope.showMenu = function (flag) { 
		if(flag==1){
			$("#chart1").show();
			$("#chart2").hide();
			$("#chart3").hide();
			Menu1();
		}else if(flag==2){
			$("#chart2").show();
			$("#chart1").hide();
			$("#chart3").hide();
			Menu2();
		}else{
			$("#chart3").show();
			$("#chart1").hide();
			$("#chart2").hide();
			Menu3();
		}
	}

	function Menu1(){
		$scope.SType=0;
		var AllData=[];
		$scope.Datas=[];
		$scope.Dates=[];
		$scope.Sum=0;

		$scope.showList = function (flag) { 
			$scope.Datas=[];
			$scope.Dates=[];
			var Stypes=0;
			var StartTime="";
			var EndTime="";

			if(flag==1){
				Stypes=$scope.SType;
				$('#StartTime').val("");
				$('#TerminalTime').val("");
			}else{
				Stypes=4;
				StartTime=$scope.StartTime;
				EndTime=$scope.TerminalTime;
				$('#QuitTime').val("");
			}

			var url = window.$AppApiService + 'AdminApi/Homepage/GetIndexData';
			var param = {
				StartTime:StartTime,
				EndTime:EndTime,
				Stype:Stypes,
				LastID:0
			};

			$http.post(url, param).success(function (data) {
				if (data.IsSuccess) {
					AllData=data.Data;
					if(AllData.length>0){
						$scope.Sum=AllData[0].Sum;
					}else{
						$scope.Sum=0;
					}
					for(var i=0;i<AllData.length;i++){
						$scope.Datas[i]=AllData[i].cnt*1;
						$scope.Dates[i]=AllData[i].Date;
					}
					draw();
				}
			});
		};

		$scope.showList(1);

		function draw(){
			$('#containerChart').highcharts({
				chart: {
					type: 'area'
				},
				title: {
					text: '用户统计  '
				},
				xAxis: {
					categories: $scope.Dates,
				},
				yAxis: {
					title: {
						text: '用户数量（人）'
					},
					min:0,
				},
				tooltip: {
					shared: true	
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					area: {
						fillColor: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
							stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
							]
						},
						lineWidth: 1,
						marker: {
							enabled: false
						},   
						shadow: false,
						states: {
							hover: {
								lineWidth: 1
							}
						},
						threshold: null,
						dataLabels: {
							enabled: true,
							style: {
								color: '#606060',
								fontSize: '11px',
							},
						},
					}
				},

				series: [{
					data: $scope.Datas,
					name: '总计',
					tooltip: {
						valueSuffix: '人'
					}
				}]
			});
		}
	}
	function Menu2(){
		$scope.SType2=0;
		$scope.Category=0;
		var AllData2=[];
		$scope.Datas2=[];
		$scope.Dates2=[];
		$scope.PublishCount=0;
		$scope.UnPublishCount=0;

		$scope.showList2 = function (flag) { 
			$scope.Datas2=[];
			$scope.Dates2=[];
			var Categorys=0;
			var StartTime="";
			var EndTime="";

			if(flag==1){
				Categorys=$scope.Category*1;
				Stypes=$scope.SType2;
				$('#StartTime2').val("");
				$('#TerminalTime2').val("");
			}else if(flag==2){
				Categorys=$scope.Category*1;
				Stypes=4;
				StartTime=$scope.StartTime2;
				EndTime=$scope.TerminalTime2;
				$('#QuitTime2').val("");
			}else{
				Categorys=$scope.Category*1;
				Stypes=$scope.SType2;
				StartTime=$scope.StartTime2;
				EndTime=$scope.TerminalTime2;
			}

			var url2 = window.$servie + 'AdminApi/Homepage/GetPublishData';
			var param = {
				StartTime:StartTime,
				EndTime:EndTime,
				Stype:Stypes,
				Category:Categorys,
				LastID:0
			};
			$http.post(url2, param).success(function (data) {
				if (data.IsSuccess) {
					AllData2=data.Data;
					if(AllData2.length>0){
						$scope.PublishCount=AllData2[0].Sum;
						$scope.UnPublishCount=AllData2[0].Sum;
					}else{
						$scope.PublishCount=0;
					}
					for(var i=0;i<AllData2.length;i++){
						$scope.Datas2[i]=AllData2[i].cnt*1;
						$scope.Dates2[i]=AllData2[i].Date;
					}
					draw2();
				}
			});
		};
		$scope.showList2(1);

		function draw2(){
			$('#containerChart2').highcharts({
				chart: {
					type: 'area'
				},
				title: {
					text: '发布统计  '
				},
				xAxis: {
					categories: $scope.Dates2,
				},
				yAxis: {
					title: {
						text: '发布数量（条）'
					},
					min:0,
				},
				tooltip: {
					shared: true	
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					area: {
						fillColor: {
							linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
							stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
							]
						},
						lineWidth: 1,
						marker: {
							enabled: false
						},   
						shadow: false,
						states: {
							hover: {
								lineWidth: 1
							}
						},
						threshold: null,
						dataLabels: {
							enabled: true,
							style: {
								color: '#606060',
								fontSize: '11px',
							},
						},
					}
				},

				series: [{
					data: $scope.Datas2,
					name: '总计',
					tooltip: {
						valueSuffix: '条'
					}
				}]
			});
		}
	}
	function Menu3(){
		$scope.PublishCategory=0;
		$scope.CurType=0;
	}

	$scope.InfoUpdate = function (ID,IsPublish,KeyNo) {
		if(IsPublish==4){
			$window.alert("请先取消定时发布，再修改信息！");
		}else{
			var url = '/InformationManage/informationDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID + '&KeyNo=' + KeyNo;
			$window.open(url);
		}
	};
	$scope.InfoVisit = function (ID) {
		var url = '/InformationManage/informationDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.open(url);
	};
	$scope.InfoDelete = function (ID) {
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
											$scope.search();
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
								$scope.search();
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
	$scope.InfoPublish = function (KeyNo) {
		if ($rootScope.Operating) {
			if ($window.confirm("数据将被发布到外网，确定吗？")) {
				var publishUrl = window.$servie + 'AdminApi/Information/PublishInfo';
				var production_publishUrl = window.$ProductionService + 'AdminApi/Information/PublishInfo';
				var param = {
					InfoKeyNo: KeyNo,
					apiKey: window.$apiKey
				};
				console.log(param.InfoKeyNo);
				$http.post(publishUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							$http.post(production_publishUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsPublished) {
										$window.alert('发布成功');
										$scope.search();
									} else {
										$window.alert('出错');
									}
								}
							});
						} else {
							$window.alert('出错');
						}
					} else {
						$window.alert('出错');
					}
				});

			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.InfoTimePublish = function (ID,token) {
		if ($rootScope.Operating) {
			var url = '/InformationManage/TimePublishDetails.html?Token=' + token + '&ID=' + ID;
			$window.open(url);
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.InfoPush = function (KeyNO, token) {
		if ($rootScope.Operating) {
			var url = '/InformationManage/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ;
			$window.open(url);
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	}
	$scope.InfoMakeWeb = function (KeyNO,ID,token) {
		var url = '/InformationManage/MakeWeb.html?Token=' + token + '&KeyNO=' + KeyNO + '&ID=' + ID ;
		$window.open(url);
	}


	$scope.ActivityUpdate = function (ID,IsPublish) {
		if(IsPublish==4){
			$window.alert("请先取消定时发布，再修改信息！");
		}else{
			var url = '/ActivityManagement/ActivityDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID;
			$window.open(url);
		}
	};
	$scope.ActivityVisit = function (ID) {
		var url = '/ActivityManagement/ActivityDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.open(url);
	};
	$scope.ActivityDelete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定要这样做吗？')) {
				var deleteUrl = window.$servie + 'AdminApi/Activity/DeleteActivity';
				var activity_deleteUrl = window.$ProductionService + 'AdminApi/Activity/DeleteActivity';
				var param = {
					KeyNO: ID,
					apiKey: window.$apiKey
				};

				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							$http.post(activity_deleteUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsDeleted) {
										$window.alert('删除成功');
										$scope.search();
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
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.ActivityPublish = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm("数据将被发布到外网，确定吗？")) {
				var publishUrl = window.$servie + 'AdminApi/Activity/PublishActivity';
				var activity_publishUrl = window.$ProductionService + 'AdminApi/Activity/PublishActivity';
				var param = {
					KeyNO: ID,
					apiKey: window.$apiKey
				};
				$http.post(publishUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							$http.post(activity_publishUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsPublished) {
										$window.alert('发布成功');
										$scope.search();
									} else {
										$window.alert('出错');
									}
								}
							});
						} else {
							$window.alert('出错');
						}
					} else {
						$window.alert('出错');
					}
				});


			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.ActivityTimePublish = function (ID, token) {
		if ($rootScope.Operating) {
			var url = '/ActivityManagement/TimePublishDetails.html?Token=' + token + '&ID=' + ID ;
			$window.open(url);
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.ActivityPush = function (KeyNO, token) {
		if ($rootScope.Operating) {
			var url = '/ActivityManagement/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ; 
			$window.open(url);
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.ActivityToHome = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定推送到首页吗？')) {
				var ActiveKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Activity/RecommendActivity';
				var activity_visitUrl = window.$ProductionService + 'AdminApi/Activity/RecommendActivity';
				$http.post(visitUrl,{KeyNO:ActiveKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRecommended){
							$http.post(activity_visitUrl,{KeyNO:ActiveKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRecommended) {
										alert("推送首页成功");
										$scope.search();
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
	$scope.ActivityRemoveHome = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定取消推送？')) {
				var ActiveKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Activity/RemoveRecommendActivity';
				var activity_visitUrl = window.$ProductionService + 'AdminApi/Activity/RemoveRecommendActivity';

				$http.post(visitUrl,{KeyNO:ActiveKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRemoveRecommended){
							$http.post(activity_visitUrl,{KeyNO:ActiveKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRemoveRecommended) {
										alert("取消推送首页成功");
										$scope.search();
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

	$scope.TryMakeUpUpdate = function (ID,IsPublish,KeyNo) {
		if(IsPublish==4){
			$window.alert("请先取消定时发布，再修改信息！");
		}else{
			var url = '/MakeupManage/MakeUpDetail.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID + '&KeyNo=' + KeyNo;
			$window.open(url);           
		}
	};
	$scope.TryMakeUpVisit = function (ID) {
		var url = '/MakeupManage/MakeUpDetail.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID;
		$window.open(url);     
	};
	$scope.TryMakeUpDelete = function (keyNO) {
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
									$scope.search();
								});
							} else {
								$window.alert('删除成功');
								$scope.search();
							}
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TryMakeUpPublish = function (keyNO) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定要发布吗')) {
				var url = window.$servie + 'AdminApi/TryMakeup/PublishTryMakeup';
				var production_deleteUrl = window.$ProductionService + 'AdminApi/TryMakeup/PublishTryMakeup';
				var param = {
					TryMakeupKeyNo: keyNO,
					apiKey: window.$apiKey
				};
				$http.post(url, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublish) {
							if (!window.$isTest) {
								$http.post(production_deleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsPublish) {
											$window.alert('发布成功');
											$scope.search();
										}
									}
								});
							} else {
								$window.alert('发布成功');
								$scope.search();
							}
						}
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TryMakeUpTimePublish = function (ID,token) {
		if ($rootScope.Operating) {
			var url = '/MakeupManage/tryMakeTimePublishDetails.html?Token=' + token + '&ID=' + ID;
			$window.open(url);     
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TryMakeUpPush = function (KeyNO, token) {
		if ($rootScope.Operating) {
			var url = '/MakeupManage/PushDetails.html?Token=' + token + '&KeyNO=' + KeyNO ;
			$window.open(url);     
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TryMakeUpToStar = function (KeyNO,token,HasStarImageUrlflag) {
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
											$scope.search();
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
	$scope.TryMakeUpRemoveStar = function (KeyNO,token) {
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
										$scope.search();
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

	$scope.ProductUpdate = function (ID, token) {
		var url = '/ProductManagement/productDetail.html?Token=' + token + '&Type=Update&ID=' + ID;
		$window.open(url);
	};
	$scope.ProductVisit = function (ID, token) {
		var url = '/ProductManagement/productDetail.html?Token=' + token + '&Type=Visit&ID=' + ID;
		$window.open(url);
	};
	$scope.ProductDelete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会删除产品,确认吗')) {
				var deleteUrl = window.$servie + 'AdminApi/Product/DeleteProduct';
				var productionDeleteUrl = window.$ProductionService + 'AdminApi/Product/DeleteProduct';
				var param = {
					ProductKeyNo: ID,
					apiKey: window.apiKey
				};
				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							if (!window.$isTest) {
								$http.post(productionDeleteUrl, param).success(function (ret) {
									if (ret.IsSuccess) {
										if (ret.Data.IsDeleted) {
											$window.alert('删除成功');
											$scope.search();
										}
									} else {
										$window.alert('删除失败');
									}
								});
							} else {
								$window.alert('删除成功');
								$scope.search();
							}
						} else {
							$window.alert('删除失败');
						}
					} else {
						$window.alert('删除失败');
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.ProductPublish = function (keyno, BrandIsPublish) {
		console.log(BrandIsPublish);
		if ($rootScope.Operating) {
			if (BrandIsPublish == 1) {
				if ($window.confirm('将会发布该产品到外网,确认吗')) {
					var deleteUrl = window.$servie + 'AdminApi/Product/PublishProduct';
					var productionDeleteUrl = window.$ProductionService + 'AdminApi/Product/PublishProduct';
					var param = {
						ProductKeyNo: keyno,
						apiKey: window.apiKey
					};
					$http.post(deleteUrl, param).success(function (data) {
						if (data.IsSuccess) {
							if (data.Data.IsPublish) {
								if (!window.$isTest) {
									$http.post(productionDeleteUrl, param).success(function (ret) {
										if (ret.IsSuccess) {
											if (ret.Data.IsPublish) {
												$window.alert('发布成功');
												$scope.search();
											}
										} else {
											$window.alert('发布失败');
										}
									});
								} else {
									$window.alert('发布成功');
									$scope.search();
								}
							} else {
								$window.alert('发布失败');
							}
						} else {
							$window.alert('发布失败');
						}
					});
				}
			} else {
				$window.alert('该产品对应品牌没有发布，请先发布对应品牌！');
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	
	$scope.TopUpdate = function (ID,KeyNo) {
		var url = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type=Update&ID=' + ID +'&KeyNO=' + KeyNo;
		$window.open(url);
	};
	$scope.TopVisit = function (ID,KeyNo) {
		var url = '/TopManagement/TopDetails.html?Token=' + $rootScope.Token + '&Type=Visit&ID=' + ID +'&KeyNO=' + KeyNo;
		$window.open(url);
	};
	$scope.TopDelete = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会删除Top,确认吗')) {
				var deleteUrl = window.$servie + 'AdminApi/TopProduct/DeleteTopProduct';
				var productionDeleteUrl = window.$ProductionService + 'AdminApi/TopProduct/DeleteTopProduct';
				var param = {
					KeyNO: ID,
					apiKey: window.apiKey
				};

				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsDeleted) {
							$http.post(productionDeleteUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsDeleted) {
										$window.alert('删除成功');
										$scope.search();
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
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TopPublish = function (ID) {
		if ($rootScope.Operating) {
			if ($window.confirm('将会发布该Top到外网,确认吗')) {
				var deleteUrl = window.$servie + 'AdminApi/TopProduct/PublishTopProduct';
				var productionPublishUrl = window.$ProductionService + 'AdminApi/TopProduct/PublishTopProduct';
				var param = {
					KeyNO: ID,
					apiKey: window.apiKey
				};
				$http.post(deleteUrl, param).success(function (data) {
					if (data.IsSuccess) {
						if (data.Data.IsPublished) {
							$http.post(productionPublishUrl, param).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsPublished) {
										$window.alert('发布成功');
										$scope.search();
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
					}
				});
			}
		} else {
			$window.alert('没有权限，详情请咨询超级管理员！');
		}
	};
	$scope.TopToHome = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定推送到首页吗？')) {
				var TopKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Topproduct/RecommendTopProduct';
				var top_visitUrl = window.$ProductionService + 'AdminApi/Topproduct/RecommendTopProduct';

				$http.post(visitUrl,{KeyNO:TopKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRecommended){
							$http.post(top_visitUrl,{KeyNO:TopKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRecommended) {
										alert("推送首页成功");
										$scope.search();
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
	$scope.TopRemoveHome = function (KeyNO,token) {
		if ($rootScope.Operating) {
			if ($window.confirm('确定取消推送？')) {
				var TopKeyNO = KeyNO;
				var visitUrl =  window.$servie + 'AdminApi/Topproduct/RemoveRecommendTopProduct';
				var top_visitUrl = window.$ProductionService + 'AdminApi/Topproduct/RemoveRecommendTopProduct';

				$http.post(visitUrl,{KeyNO:TopKeyNO}).success(function(data){
					if(data.IsSuccess) {
						if(data.Data.IsRemoveRecommended){
							$http.post(top_visitUrl,{KeyNO:TopKeyNO}).success(function (result) {
								if (result.IsSuccess) {
									if (result.Data.IsRemoveRecommended) {
										alert("取消推送首页成功");
										$scope.search();
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

});

$(function () {
	$('#StartTime').val("");
	$('#TerminalTime').val("");
	$('#StartTime2').val("");
	$('#TerminalTime2').val("");
	var startTime = 0;
	var endTime = 0;
	var startTime2 = 0;
	var endTime2 = 0;
	$('#StartTime').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		language: 'zh-CN',
		autoclose: true
	}).on('changeDate', function (ev) {
		startTime = ev.date.valueOf();
		if (startTime && endTime && (startTime > endTime)) {
			alert("开始时间不能迟于结束时间！");
			$('#StartTime').val("");
		}
	});

	$('#TerminalTime').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		language: 'zh-CN',
		autoclose: true
	}).on('changeDate', function (ev) {
		endTime = ev.date.valueOf();
		if (startTime && endTime && (startTime > endTime)) {
			alert("结束时间不能早于开始时间！");
			$('#TerminalTime').val("");
		}
	});

	$('#StartTime2').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		language: 'zh-CN',
		autoclose: true
	}).on('changeDate', function (ev) {
		startTime2 = ev.date.valueOf();
		if (startTime2 && endTime2 && (startTime2 > endTime2)) {
			alert("开始时间不能迟于结束时间！");
			$('#StartTime2').val("");
		}
	});

	$('#TerminalTime2').datetimepicker({
		minView: "month",
		format: "yyyy-mm-dd",
		language: 'zh-CN',
		autoclose: true
	}).on('changeDate', function (ev) {
		endTime2 = ev.date.valueOf();
		if (startTime2 && endTime2 && (startTime2 > endTime2)) {
			alert("结束时间不能早于开始时间！");
			$('#TerminalTime2').val("");
		}
	});
});
