maccoApp.factory('maccoData',function($http,$window,$rootScope) {
	var macco = function() {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.CategoryID = 0;
		this.BrandID = 0;
		this.SType = '';
	};

	macco.prototype.nextPage = function() {
		/*var bannerLinkUrl = window.$servie + 'AdminApi/Product/SearchProduct';*/
		var bannerLinkUrl = window.$ProductionService + 'AdminApi/Product/SearchProduct';
		var param = {
			PageSize:5
		};
		this.busy = true;

		if(this.SType  != undefined && this.SType != '') {
			param.Stype = this.SType;
		} else {
			param.Stype = 0;
		}
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

		$http.post(bannerLinkUrl,param).success(function(data) {
			for (var i = 0; i < data.Data.length; i++) {
				data.Data[i].Selected = 0;
				this.items.push(data.Data[i]);
				//this.items[i].Seleted = 0;
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

maccoApp.controller('selectBannerLinkController', ['$scope','$window','$http','maccoData','$rootScope','$modalInstance',function($scope, $window,$http,maccoData,$rootScope,$modalInstance) {
	$scope.maccoData = new maccoData();	

	$scope.Search = function() {
		$scope.maccoData.items = [];
		$scope.maccoData.busy = false;
		$scope.maccoData.after = '';
		$scope.maccoData.CategoryID = $scope.SelectedCategoy;
		$scope.maccoData.BrandID = $scope.SelectBrand;
		$scope.maccoData.Keyword = $scope.Keyword;
		$scope.maccoData.SType = 1;
		$scope.$emit('list:search');
		$window.scroll(0,10);
	};
	
	var categoryUrl = window.$servie + 'AdminApi/Category/FetchCategory';	
	$http.get(categoryUrl).success(function(data){
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

	$scope.SureChoose = function() {
		var selected = [];
		$scope.selected = selected;

		for(var i=0;i<$scope.maccoData.items.length;i++) {
			if($scope.maccoData.items[i].Selected!=0) {
				selected.push($scope.maccoData.items[i]);
			}
		}
		$modalInstance.close($scope.selected);		
	};
	
}]);