maccoApp.controller('SingleTryMakeupController', ['$scope','$window','$http','Upload','$modal','$rootScope',function($scope, $window,$http,Upload,$modal,$rootScope) {
	var curToken = getQueryStringByKey('Token');
    var checkUrl = window.$servie + 'AdminApi/ColorWheel/CheckColorWheelKeyNo';
    var checkUrl2 = window.$ProductionService + 'AdminApi/ColorWheel/CheckColorWheelKeyNo';
    $http.post(checkUrl).success(function(data){
        $http.post(checkUrl2).success(function(result){
            if(data.Data==result.Data){
            }else{
                $("#mask").show();
                alert("后台数据发生错误，无法添加，详情咨询管理员！");
                window.location.href = '/index.html' + '?Token=' + curToken;
                $("#mask").hide();
            }
        });
    });
    var FetchColorUrl = window.$servie + "AdminApi/ColorWheel/FetchColorWheel";
    $scope.PaperNum=1;
    $scope.items =[];
    var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';
    $http.get(categoryUrl).success(function (data) {
      if (data.IsSuccess) {
       $scope.Categories = data.Data;
   }
});

	//更改分类选择

    $scope.currentSlice = null;
    
    $scope.colorWheelClick = function(slice) {
        // Highlight the corresponding row in the key table
        $('#chartData td').removeClass('highlight');
    /*    var labelCell = $('#chartData td:eq(' + (slice*2) + ')');
        var valueCell = $('#chartData td:eq(' + (slice*2+1) + ')');
        labelCell.addClass('highlight');
        valueCell.addClass('highlight');*/
        var IDCell = $('#chartData td:eq(' + (slice*4) + ')');
        var ColorCell = $('#chartData td:eq(' + (slice*4+1) + ')');
        var ImgCell = $('#chartData td:eq(' + (slice*4+2) + ')');
        var OperCell = $('#chartData td:eq(' + (slice*4+3) + ')');
        IDCell.addClass('highlight');
        ColorCell.addClass('highlight');
        ImgCell.addClass('highlight');
        OperCell.addClass('highlight');
    }
    
    $scope.changeColorWheel = function(color) {
        $scope.currentSlice = null;
        for(i=0;i<$scope.colors.length;i++) {
            var singleColor = $scope.colors[i];
            if(singleColor.ID == color.ID) {
                $scope.currentSlice = i;
                break;
            }
        }
    }
    
    $scope.ChangeChoose = function () {
      $("#ConnectContent").hide();
      $rootScope.ChooseCategorty=$scope.SelectedCategoy;
      var param = {
         CategoryID:$scope.SelectedCategoy
     };
     $http.post(FetchColorUrl,param).success(function(data){
         if(data.IsSuccess) {
            $scope.colors = data.Data;
            $scope.RGBs = [];
            for(var i=0;i<$scope.colors.length;i++) {
                var color = $scope.colors[i];
                $scope.RGBs.push(color);
            }

                // $scope.$watch('colors',function(value){
                //     $(pieChart);
                // });
            }
        });
 };

 $scope.SortChoose = function () {
    $("#ConnectContent").hide();
    $scope.RGBs = [];
    var color = [];
    for(i=0;i<$scope.colors.length;i++){
        var ColorCell = $('#chartData td:eq(' + (i*4+1) + ')').html();
        var ImgCell = $('#chartData td:eq(' + (i*4+2) + ')').find("img").attr("src");
        color ={ImageUrl:ImgCell,RGB:ColorCell};
        $scope.RGBs.push(color);
    }  
};

    //发布
    $scope.Publish = function(ID) {
    	if($window.confirm('确认发布？')) {
    		var PublishUrl = window.$servie + 'AdminApi/ColorWheel/PublishColorWheel';
    		var Publish_url = window.$ProductionService + 'AdminApi/ColorWheel/PublishColorWheel';
    		var param = {
    			CategoryID:$scope.SelectedCategoy,
    			apiKey: window.$apiKey
    		};
    		$http.post(PublishUrl, param).success(function (data) {
    			if (data.IsSuccess) {
    				if (data.Data.IsPublished) {
    					$http.post(Publish_url,param).success(function (result) {
    						if (result.IsSuccess) {
    							if (result.Data.IsPublished) {
    								$window.alert('发布成功');
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
    };

    //确认添加颜色按钮
    $scope.AddColor = function () {
    	$("#AddColor").show();
    	$("#UpdateColorBtn").hide();
    };
    //取消添加颜色按钮
    $scope.CancelAddColor = function () {
    	$("#AddColor").hide();
    };
	//确认添加颜色
	$scope.SubmitAddColor = function () {
		var Rgb=$("#hue-demo").val();
		if(Rgb==""){
			alert("请添加颜色！");
		}else if($scope.Banner==null){
			alert("请添加图片！");
		}else{
			$("#AddColor").hide();
			$("#mask").show();
			var createUrl = window.$servie + 'AdminApi/ColorWheel/CreateColorWheel';
			var create_url = window.$ProductionService + 'AdminApi/ColorWheel/CreateColorWheel';

			var fields = {
				CategoryID:$scope.SelectedCategoy,
				RGB:Rgb,
				apiKey:window.$apiKey
			};

			var files = [];
			files.push($scope.Banner);

			var postCreateFunc = function(url,callback) {
				Upload.upload({
					url: url,
					fields:fields,
					file: files,
					fileFormDataName:['ImageUrl']
				}).success(function (data, status, headers, config){
					callback(data);
				});
			};

			postCreateFunc(createUrl,function(data) {
				if(data.IsSuccess) {
					if (!window.$isTest) {
						postCreateFunc(create_url,function(result){
							if(result.IsSuccess) {
								if(result.Data.IsCreated) {
                                    if (data.Data.KeyNo==result.Data.KeyNo) {
                                        $scope.ChangeChoose();
                                        $("#mask").hide();
                                    }else{
                                        alert("后台添加数据发生错误，详情咨询管理员！");
                                        window.location.href = '/index.html' + '?Token=' + curToken;
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
						$scope.ChangeChoose();
						$("#mask").hide();
					}	
				} else {
					$window.alert('出错');
					$("#mask").hide();
				}
			});
		}
	};

    //显示对应产品
    $(document).on('click','#chartData tr', function (e) {
    	$("#ConnectContent").show();
    	var ObjColor=$(this).find("td:eq(1)").html();
      $scope.ObjColorKeyNo=$(this).find("td:eq(0)").html();
      var ProductUrl = window.$servie + 'AdminApi/ColorWheel/FetchColorWheelProduct';
      var param = {
          ColorWheelKeyNo:$scope.ObjColorKeyNo,
          apiKey: window.$apiKey
      };
      $http.post(ProductUrl,param).success(function (data) {
          if (data.IsSuccess) {
             $scope.items = data.Data;
         }
     });

  });

    //颜色表格的按钮事件
    $(document).on('click','#chartData td input', function (e) {
    	var TrCount=($("#chartData tr").length-1)*1;
    	var ObjId=e.target.id.toString();
    	var ObjID=$("#"+ObjId).parent().parent();
    	var PrevID=$("#"+ObjId).parent().parent().prev();
    	var NextID=$("#"+ObjId).parent().parent().next();

    	var ObjNum=ObjID.index(); 

    	var ObjTr=ObjID.html();
    	var PrevTr=PrevID.html();
    	var NextTr=NextID.html();

    	var ObjStyle=ObjID.attr("style");
    	var PrevStyle=PrevID.attr("style");  
    	var NextStyle=NextID.attr("style");

    	var ObjKeyNO=ObjID.find("td:eq(0)").html().toString();
    	if(ObjId.indexOf("update") > -1){
    		$("#AddColor").show();
    		$("#AddColorBtn").hide();
            $scope.BannerUrl = ObjID.find("td:eq(2) img").attr("src");
            $("#hue-demo").val(ObjID.find("td:eq(1)").html());
            $scope.SubmitUpdateColor = function () {
               $("#AddColor").hide();
               $("#mask").show();
               var Rgb=$("#hue-demo").val();
               var updateUrl = window.$servie + 'AdminApi/ColorWheel/UpdateColorWheel';
               var update_url = window.$ProductionService + 'AdminApi/ColorWheel/UpdateColorWheel';

               var fields = {
                ColorWheelKeyNo:ObjKeyNO,
                RGB:Rgb,
                apiKey:window.$apiKey
            };

            var files = [];
            var fileNames = [];
            if($scope.Banner != null) {
                files.push($scope.Banner);
                fileNames.push('ImageUrl');
            }

            var postCreateFunc = function(url,callback) {
                Upload.upload({
                 url: url,
                 fields:fields,
                 file: files,
                 fileFormDataName:fileNames
             }).success(function (data, status, headers, config){
                 callback(data);
             });
         };

         postCreateFunc(updateUrl,function(data) {
            if(data.IsSuccess) {
             if (!window.$isTest) {
              postCreateFunc(update_url,function(result){
               if(result.IsSuccess) {
                if(result.Data.IsUpdated) {
                 $scope.ChangeChoose();
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
              $scope.ChangeChoose();
              $("#mask").hide();
          }	
      } else {
         $window.alert('出错');
         $("#mask").hide();
     }
 });
     };
 }else if(ObjId.indexOf("up") > -1){
  if(ObjNum==1){
   alert("当前最顶部，无法上移");
}else{
   PrevID.html(ObjTr);
   ObjID.html(PrevTr);
   PrevID.attr("style",ObjStyle);
   ObjID.attr("style",PrevStyle);
   $scope.SortChoose();
}
}else if(ObjId.indexOf("down") > -1){
  if(ObjNum==TrCount){
     alert("当前最底部，无法下移");
 }else{
     NextID.html(ObjTr);
     ObjID.html(NextTr);
     NextID.attr("style",ObjStyle);
     ObjID.attr("style",NextStyle);
     $scope.SortChoose();
 }
}else if(ObjId.indexOf("delete") > -1){
  if ($window.confirm("确认删除此选项？")) {
     var deleteUrl = window.$servie + 'AdminApi/ColorWheel/DeleteColorWheel';
     var delete_url = window.$ProductionService + 'AdminApi/ColorWheel/DeleteColorWheel';
     var param = {
        ColorWheelKeyNo:ObjKeyNO,
        apiKey: window.$apiKey
    };
    $http.post(deleteUrl, param).success(function (data) {
        if (data.IsSuccess) {
           if (data.Data.IsDeleted) {
              $http.post(delete_url,param).success(function (result) {
                 if (result.IsSuccess) {
                    if (result.Data.IsDeleted) {
                       $window.alert('删除成功');
                       $scope.ChangeChoose();
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
}else{
}
}); 

    //确认排序
    $scope.SubmitOrderColor = function () {
    	var TrCount=($("#chartData tr").length-1)*1;
    	if(TrCount==0){
    		alert("请添加相关数据！");
    	}else{
    		$("#mask").show();
    		var OrdersArr=[];
    		var ColorWheelKeyNosArr=[];
    		for(i=0;i<TrCount;i++){
    			OrdersArr[i]=i;
    		}
    		$('#chartData tr').each( function() {
    			if($(this).index()!=0){
    				var ObjKeyNO=$(this).find("td:eq(0)").html();
    				ColorWheelKeyNosArr.push(ObjKeyNO);
    			}
    		});
    		var OrdersStr=OrdersArr.join(',');
    		var ColorWheelKeyNosStr=ColorWheelKeyNosArr.join(',');
    		var OrderUrl = window.$servie + 'AdminApi/ColorWheel/OrderColorWheel';
    		var Order_url = window.$ProductionService + 'AdminApi/ColorWheel/OrderColorWheel';
    		var param = {
    			ColorWheelKeyNos:ColorWheelKeyNosStr,
    			Orders:OrdersStr, 
    			apiKey: window.$apiKey
    		};
    		$http.post(OrderUrl, param).success(function (data) {
    			if (data.IsSuccess) {
    				if (data.Data.IsOrdered) {
    					$http.post(Order_url,param).success(function (result) {
    						if (result.IsSuccess) {
    							if (result.Data.IsOrdered) {
    								$window.alert('排序成功');
    								$scope.ChangeChoose();
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
    					$window.alert('出错');
    					$("#mask").hide();
    				}
    			}
    		});
    	}
    };

    //关联产品
    $scope.ConnectProduct = function() {
    	var modalInstance = $modal.open({
    		animation: true,
    		templateUrl: '/SingleMakeupManage/selectProduct.html',
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
    				for(var i=0;i<$scope.items.length;i++) {
    					if($scope.items[i].ID==selectedItem[j].ID){
    						$scope.items[i].create=true;
    						break;
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
    					for(var i=0;i<$scope.items.length;i++) {
    						if($scope.items[i].ID==selectedItem[j].ID){
    							$scope.items[i].create=true;
    							break;
    						}
    					}
    				}
    			}
    		}
    	}, function () {
    	});
    };

    $scope.DeleteConnectProduct = function(ID) {
    	if($window.confirm('将会删除关联的产品，确定要这样做吗？')) {
    		var products = $scope.items;
    		for (var j = 0; j < products.length; j++) {
    			if(products[j].ID==ID){
    				products.splice(j, 1);
    				$window.alert('删除成功');
    			}
    		}
    	}
    };

    $scope.SubmitConnectProduct = function () {
    	$("#mask").show();
    	var ProductKeyNo= [];
    	for(var i=0;i<$scope.items.length;i++) {
    		ProductKeyNo.push($scope.items[i].KeyNo);
    	}
    	var ProductKeyNoStr=ProductKeyNo.join(',');

    	var createProductUrl = window.$servie + 'AdminApi/ColorWheel/CreateColorWheelProduct';
    	var createProduct_url = window.$ProductionService + 'AdminApi/ColorWheel/CreateColorWheelProduct';
    	var param = {
    		ColorWheelKeyNo:$scope.ObjColorKeyNo,  
    		ProductKeyNos:ProductKeyNoStr,
    		apiKey: window.$apiKey
    	};
    	$http.post(createProductUrl, param).success(function (data) {
    		if (data.IsSuccess) {
    			if (data.Data.IsCreated) {
    				$http.post(createProduct_url,param).success(function (result) {
    					if (result.IsSuccess) {
    						if (result.Data.IsCreated) {
    							$window.alert('操作成功');
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
    				$window.alert('出错');
    				$("#mask").hide();
    			}
    		}
    	});
    };

    //添加颜色的颜色选择器
    $('.demo').each( function() {
    	$(this).minicolors({
    		control: $(this).attr('data-control') || 'hue',
    		defaultValue: $(this).attr('data-defaultValue') || '',
    		inline: $(this).attr('data-inline') === 'true',
    		letterCase: $(this).attr('data-letterCase') || 'lowercase',
    		opacity: $(this).attr('data-opacity'),
    		position: $(this).attr('data-position') || 'bottom left',
    		change: function(hex, opacity) {
    			var log;
    			try {
    				log = hex ? hex : 'transparent';
    				if( opacity ) log += ', ' + opacity;
    			} catch(e) {}
    		},
    		theme: 'default'
    	});
    });
}]);


/*//分页
$scope.Paper = function (flag) {
	var TrCount=($("#chartData tr").length-1)*1;
		var EndPaper=Math.floor(TrCount/5)+1;
		var PaperNum=$scope.PaperNum*1;
		if(flag==1){//上一页
			if(PaperNum==1){
				var i=0;
				$("#chartData tr").each(function(i) {
					if(i>5){
						$(this).hide();
				}else{
						$(this).show();
				}
			});
		}else{
				var j=0;
				$("#chartData tr").each(function(j) {
					if(j<=(PaperNum-1)*5&&j>(PaperNum-2)*5||j==0){
						$(this).show();
					}else{
						$(this).hide();
					}
				});
				$scope.PaperNum=PaperNum-1;
		}
	}else{
		if(PaperNum==EndPaper){
		}else{
			var k=0;
			$("#chartData tr").each(function(k) {
				if(k<=(PaperNum+1)*5&&k>PaperNum*5||k==0){
						$(this).show();
					}else{
						$(this).hide();
					}
				});
				$scope.PaperNum=PaperNum+1;
		}
	}	
};*/		