angular.module('FogApp').controller('CookBookListController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
	//分页属性
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.maxSize = 5;
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	$scope.Keyword="";
	$scope.CBCategory=0;

	function InitPage(currentPage){
		return param={
			currentPage:currentPage,
			pageSize:$scope.pageSize,
			CBCategory:$scope.CBCategory,
			Keyword:$scope.Keyword
		}
	}

	var param=InitPage(1);

	/*食谱管理-食谱分类类别*/
	$.ajax({ 
		type: "GET", 
		url: "json/cookbook_category.json", 
		dataType: "json",
		async:false,  
		success: function (data) { 
			CBCategorys=data.Data;
			$scope.CBCategorys = CBCategorys;
		}, 
		error: function (XMLHttpRequest, textStatus, errorThrown) { 
			alert(errorThrown); 
		} 
	});

	/*食谱管理-产品*/
	$.ajax({ 
		type: "GET", 
		url: "json/product_list.json", 
		dataType: "json",
		async:false,  
		success: function (data) { 
			ProductArrs=data.Data;
			$scope.ProductArrs = ProductArrs;
		},  
		error: function (XMLHttpRequest, textStatus, errorThrown) { 
			alert(errorThrown); 
		} 
	});

	/*食谱管理-食谱列表*/
	var GetListFun = function (param) {
		$scope.CookBookList=[];
		$scope.CookBookCount=0;
		$.ajax({ 
			type: "GET", 
			url: "json/cookbook_list.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				$scope.totalItems=data.Data.totalItems;
				$scope.CookBookList = data.Data.ListArr;
				$scope.CookBookCount=$scope.CookBookList.length;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	GetListFun(param);

	$scope.SearchFun = function () {
		if ($scope.Keyword != undefined && $scope.Keyword != '') {
			Keyword = $scope.Keyword;
		} else {
			Keyword = "";
		}
		if ($scope.CBCategory != undefined && $scope.CBCategory != '') {
			CBCategory = $scope.CBCategory;
		} else {
			CBCategory = 0;
		}

		param = {
			Keyword: Keyword,
			CBCategory:CBCategory
		};

		GetListFun(param);
	}

	/*食谱删除*/
	$scope.DelectFun=function(ID){
		Common.confirm({
			title: "食谱删除",
			message: "确认删除该食谱？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "食谱删除成功！",
						operate: function (reselt) {
							$scope.ReloadFun();
						}
					})
				} else {
				}
			}
		})
	}

	//分页
	$scope.pageChanged = function()
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};

	$scope.ReloadFun=function(){
		window.location.href = '#/cookbook/cookbook_list.html';
	}
}]);
