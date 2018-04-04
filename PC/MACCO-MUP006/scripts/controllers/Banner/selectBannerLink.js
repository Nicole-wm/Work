maccoApp.factory('maccoData',function($http,$window,$rootScope) {
	var macco = function() {
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.SType = '';
	};

	macco.prototype.nextPage = function() {
		//资讯
		if($rootScope.SelectedCategoy==2){
			var bannerLinkUrl = window.$servie + 'AdminApi/Information/FetchInfoList';
		}
		//上妆
		if($rootScope.SelectedCategoy==3){			
			var bannerLinkUrl = window.$servie + 'AdminApi/TryMakeup/FetchTryMakeupAdminList';
		}
		//活动
		if($rootScope.SelectedCategoy==4){
			var bannerLinkUrl = window.$servie + 'AdminApi/Activity/FetchActivityList';
		}
		
		var param = {
			PageSize:10
		};

		if(this.SType  != undefined && this.SType != '') {
			param.Stype = this.SType;
		} else {
			param.Stype = 0;
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
		$scope.maccoData.after = '';
		$scope.maccoData.Keyword = $scope.Keyword;
		$scope.maccoData.SType = $scope.SType;
		$scope.$emit('list:search');
		$window.scroll(0,10);
	};

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