angular.module('FogApp').controller('ProductListController', ['$rootScope', '$scope', 'settings','$http', function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.totalItems=0;
	$scope.ListArr =[];
	$scope.currentPage = 1;
	$scope.pageSize = 10;

	var param = {
		Keyword: "",
		ProCategory:0
	};

	function InitPage(currentPage){
		return param={
			'page':currentPage,
			'limit':$scope.pageSize
		}
	}

	var param=InitPage(1);

	/************************初始化数据************************/
	var GetProCate=function(){/*产品管理-产品分类类别*/
		$.ajax({ 
			type: "GET", 
			url: "json/product_category.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				ProCategorys=response.data;
				$scope.ProCategorys=ProCategorys;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	GetProCate();

	var GetProListFun = function (param) {/*产品管理-产品列表*/
		$.ajax({ 
			type: "GET", 
			url: "json/product_list.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.result;
				for(var i=0;i<$scope.ListArr.length;i++){
					var CurObj=$scope.ListArr[i];
					if(CurObj.status==2){
						CurObj.StatusText="未审核";
					}else if(CurObj.status==1){ 
						CurObj.StatusText="上线";
					}else{
						CurObj.StatusText="未通过";
					}
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	GetProListFun(param);
	/************************页面调用方法************************/
	$scope.SearchProduct = function () {/*Fun-搜索产品*/
		if ($scope.Keyword != undefined && $scope.Keyword != '') {
			Keyword = $scope.Keyword;
		} else {
			Keyword = "";
		}
		if ($scope.ProCategory != undefined && $scope.ProCategory != '') {
			ProCategory = $scope.ProCategory;
		} else {
			ProCategory = 0;
		}

		param = {
			Keyword: Keyword,
			ProCategory:ProCategory
		};

		GetProListFun(param);
	}

	$scope.SearchUser=function(){/*Fun-列表-搜索*/
		param=InitPage(1);
		GetListFun(param);
	}

	$scope.pageChanged = function()/*Fun-分页*/
	{
		param=InitPage($scope.currentPage);
		GetListFun(param);
	};
}]);
