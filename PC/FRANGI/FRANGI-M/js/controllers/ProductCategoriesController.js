angular.module('FrangiApp').controller('ProductCategoriesController', ['$scope','$http','$stateParams',function($scope,$http,$stateParams) {
	/************************初始化变量************************/ 
	var ID = $stateParams.ID*1;
	$scope.Cur_proAll=[];
	$scope.Cur_pro={};
	$scope.Cur_cate={};
	$scope.Cur_Cataid=0;
	$scope.Cur_Catalog='';
	$scope.IsGift=0;
	if(ID==8){
		$scope.IsGift=1;
	}
	/************************初始化数据************************/
	var GetCateListFun=function(){
		ID>=1&&ID<=8?true:ID=8;
		$.ajax({ 
			type: "GET", 
			url: "json/product_categories.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				if(response.IsSuccess){
					var CateArr=response.Data.result;
					for(i=0;i<CateArr.length;i++){
						if(ID==CateArr[i].id){
							for( var key in CateArr[i]){
								$scope.Cur_cate[key]=CateArr[i][key];
							}
							var Cur_prolist=CateArr[i].prolist;
							$scope.Cur_proAll=[].concat(GetProDetailFun(Cur_prolist));
							break;
						}
					}
					$scope.Cur_Name=$scope.Cur_cate['pname'];
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	var GetProDetailFun=function(ProList){
		var ProAll=[];
		$.ajax({ 
			type: "GET", 
			url: "json/product.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				if(response.IsSuccess){
					var ProductArr=response.Data.result;
					for(i=0;i<ProductArr.length;i++){
						for(j=0;j<ProList.length;j++){
							if(ProList[j]*1==ProductArr[i].id){
								ProAll.push(ProductArr[i]);
							}
						}
					}
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
		return ProAll;
	}

	GetCateListFun();
}]);
