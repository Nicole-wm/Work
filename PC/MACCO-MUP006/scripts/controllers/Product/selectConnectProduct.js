maccoApp.factory('maccoData',function($http,$window) {
	var brandID = window.getQueryStringByKey('ID');
	var macco = function() {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.CategoryID = '';
		this.BrandID = brandID;
		this.SType = 1;
	};

	macco.prototype.nextPage = function() {
		var param = {
			PageSize:5,
			Stype:1
		};
		this.busy = true;
		if(this.CategoryID  != undefined && this.CategoryID != '') {
			param.CategoryID = this.CategoryID;
		}
		
		if(this.BrandID != undefined && this.BrandID != '') {
			param.BrandID = this.BrandID;
		} 
		if(this.Keyword != undefined) {
			param.Keyword = this.Keyword;
		} else {
			param.Keyword = '';
		}
		if(this.after != undefined && this.after != '') {
			param.LastID = this.after;
		}
		
		/*var productSearchUrl = window.$servie + 'AdminApi/Product/SearchProduct';*/
		var productSearchUrl = window.$ProductionService + 'AdminApi/Product/SearchProduct';

		$http.post(productSearchUrl,param).success(function(data) {
			console.log(data);
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
				items[i].Seleted = false;
				this.items.push(items[i]);
			}
			if(this.items.length!=0){
				this.after = this.items[this.items.length - 1].ID;
			}
			this.busy = false;
		}.bind(this));
		this.busy = false;
	};

	return macco;
});

maccoApp.controller('selectProductController', ['$scope','$window','$http','maccoData','$rootScope','$modalInstance',function($scope, $window,$http,maccoData,$rootScope,$modalInstance) {
	$scope.maccoData = new maccoData();	
	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';
	$http.get(categoryUrl).success(function(data){
		console.log(data);
		if(data.IsSuccess) {
			$scope.Categories = data.Data;
		}
	});
	
	var brandListUrl =  window.$servie + 'AdminApi/Product/FetchBrand';
	$http.post(brandListUrl,null).success(function(data){
		if(data.IsSuccess) {
			$scope.Brands = data.Data;
		}
	});

	$scope.Search = function() {
		$scope.maccoData.items = [];
		$scope.maccoData.busy = false;
		$scope.maccoData.after = '';
		$scope.maccoData.CategoryID = $scope.SelectedCategoy;
		$scope.maccoData.Keyword = $scope.Keyword;
		$scope.$emit('list:search');
		$window.scroll(0,10);
	};
	
	$scope.SureChoose = function() {
		var selected = [];
		$scope.selected = selected;
		for(var i=0;i<$scope.maccoData.items.length;i++) {
			if($scope.maccoData.items[i].Seleted) {
				selected.push($scope.maccoData.items[i]);
			}
		}
		$modalInstance.close($scope.selected);
	};
	
}]);