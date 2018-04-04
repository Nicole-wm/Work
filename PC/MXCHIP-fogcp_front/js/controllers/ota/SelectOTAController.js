angular.module('FogApp').controller('SelectOTAController', ['$rootScope', '$scope', 'settings','$modalInstance','ExistItems','$http','SelectType',function($rootScope, $scope, settings,$modalInstance,ExistItems,$http,SelectType) {
	$scope.Proid = SelectType;
	$scope.totalItems=0;
	$scope.ListArr =[];

	/*弹框-OTA列表*/
	var GetListFun=function(){
		var Url = $rootScope.settings.portsPath+'ota/files/?product='+$scope.Proid;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.totalItems=response.data.count;
				$scope.ListArr = response.data.results;
				var res = [];
				for(var i=0;i<$scope.ListArr.length;i++){
					var repeat = false;
					for(var j=0;j<ExistItems.length;j++){
						if($scope.ListArr[i].ofid==ExistItems[j].ofid){
							repeat = true;
							break;
						}
					}
					if(!repeat){
						res.push($scope.ListArr[i]);
					}
				}
				$scope.ModalListArr=res;
				$scope.totalItems=res.length;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取OTA列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}

		}).error(function(response, status){
			console.log(response.error);
		});
	} 

	GetListFun();

	$scope.SureSelectFun=function(){
		var selected = [];
		$scope.selected = selected;
		for(var i=0;i<$scope.ModalListArr.length;i++) {
			if($scope.ModalListArr[i].Seleted) {
				selected.push($scope.ModalListArr[i]);
			}
		}
		$modalInstance.close($scope.selected);
	}

	$scope.CancelSelectFun=function(){
		$modalInstance.close();
	}
}]);
