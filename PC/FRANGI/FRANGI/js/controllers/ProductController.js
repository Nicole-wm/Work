angular.module('FrangiApp').controller('ProductController', ['$scope','$http','$stateParams','$location','$anchorScroll',function($scope,$http,$stateParams,$location,$anchorScroll) {
	/************************初始化变量************************/ 
	var ID = $stateParams.ID*1;
	$scope.Cur_sugAll=[];
	$scope.Cur_pro={};
	$scope.Cur_cate={};
	$scope.Cur_Cataid=0;
	$scope.Cur_Catalog='';
	/************************初始化数据************************/
	var GetProDetailFun=function(){
		ID>=0&&ID<=36?true:ID=0;
		$.ajax({ 
			type: "GET", 
			url: "json/product.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				if(response.IsSuccess){
					var ProductArr=response.Data.result;
					$scope.ProAll=ProductArr;
					for(i=0;i<ProductArr.length;i++){
						if(ID==ProductArr[i].id){
							for( var key in ProductArr[i]){
								$scope.Cur_pro[key]=ProductArr[i][key];
							}
							if(ProductArr[i].suglist){
								var Cur_suglist=ProductArr[i].suglist;
								$scope.Cur_sugAll=[].concat(GetSugProFun(Cur_suglist));
							}
							break;
						}
					}
					if($scope.Cur_pro['catalogid']*1!=0){
						GetCateLogFun($scope.Cur_pro['catalogid']);
					}
					$scope.Cur_Name=$scope.Cur_pro['pname'];
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	var GetCateLogFun=function(CateID){
		$.ajax({ 
			type: "GET", 
			url: "json/product_categories.json", 
			dataType: "json",
			async:false,  
			success: function (response) { 
				if(response.IsSuccess){
					var CateArr=response.Data.result;
					for(i=0;i<CateArr.length;i++){
						if(CateID==CateArr[i].id){
							for( var key in CateArr[i]){
								$scope.Cur_cate[key]=CateArr[i][key];
								$scope.Cur_Cataid=$scope.Cur_cate['id'];
								$scope.Cur_Catalog=$scope.Cur_cate['pname'];
							}
							break;
						}
					}
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	}

	var GetSugProFun=function(ProList){
		var ProAll=[];
		for(i=0;i<$scope.ProAll.length;i++){
			for(j=0;j<ProList.length;j++){
				if(ProList[j]*1==$scope.ProAll[i].id){
					ProAll.push($scope.ProAll[i]);
				}
			}
		}
		return ProAll;
	}
	
	GetProDetailFun();
	/************************Fun************************/
	$scope.gotoPro = function() {
		$location.hash('pro_content');
		$anchorScroll();
	};
}]);
