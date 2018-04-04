maccoApp.factory('maccoData',function($http,$window) {
	var KeyNo  = window.getQueryStringByKey('KeyNO');
	var macco = function() {
		this.ActivityKeyNo = KeyNo;
		this.items = [];
		this.busy = false;
		this.after = '';
		this.Keyword = '';
		this.Stype = '';
	};

	macco.prototype.nextPage = function() {
		var param = {
			ActivityKeyNo:KeyNo,
			PageSize:5,
			Stype:0
		};
		this.busy = true;
		if (this.Stype != undefined && this.Stype != '') {
            param.Stype = this.Stype;
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
		
		/*var productSearchUrl = window.$servie + 'AdminApi/Activity/FetchUserJoinActivity';*/
		var productSearchUrl = window.$AppApiService + 'AdminApi/Activity/FetchUserJoinActivity';
		$http.post(productSearchUrl,param).success(function(data) {
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

maccoApp.controller('selectUserController', ['$scope','$window','$http','maccoData','$rootScope','$modalInstance',function($scope, $window,$http,maccoData,$rootScope,$modalInstance) {
	$scope.maccoData = new maccoData();	
    $scope.stypes = [
        { ID: 0, Name: "真实用户" },
        { ID: 1, Name: "系统用户" }
    ];

	$scope.Search = function() {
		$scope.maccoData.items = [];
		$scope.maccoData.busy = false;
		$scope.maccoData.after = '';
        $scope.maccoData.Stype = $scope.SType;
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