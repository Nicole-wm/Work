angular.module('FogApp').controller('SelectProductController', ['$rootScope', '$scope', 'settings','$modalInstance','ExistItems','$http','SelectType',function($rootScope, $scope, settings,$modalInstance,ExistItems,$http,SelectType) {
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');	
	}else{
		var ID = '';
	}

	if(getQueryStringByKey('type')){
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

	$scope.SelectType = SelectType;

	/*弹框-产品列表*/
	var GetListFun=function(param){
		var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		if($scope.SelectType==1){
			var Url = $rootScope.settings.portsPath+'app/productinfo/?appid='+ID;
		}else{
			var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		}
		
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				var ListArr=response.data.result;
				if($scope.SelectType==1){
					var ListArr=[];
					var CurList=response.data;
					for(var i=0;i<CurList.length;i++){
						ListArr.push(CurList[i].product);
					}
				}else{
					var ListArr=response.data.result;
				}

				for(i=0;i<ListArr.length;i++){
					if(ListArr[i].status==1){
						ListArr[i].StateText="已上线";
					}else{
						ListArr[i].StateText="开发中";
					}
				}
				
				$scope.ListArr=ListArr;
				var res = [];
				for(var i=0;i<$scope.ListArr.length;i++){
					var repeat = false;
					for(var j=0;j<ExistItems.length;j++){
						if($scope.ListArr[i].productid==ExistItems[j].productid){
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
					message:"获取产品列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}

		}).error(function(response, status){
			console.log(response.error);
		});
	}

	if(ID){
		GetListFun();
	}
	
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
