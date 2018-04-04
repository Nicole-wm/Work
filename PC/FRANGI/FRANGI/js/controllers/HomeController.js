angular.module('FrangiApp').controller('HomeController', ['$scope','$http','$stateParams','$window',function($scope,$http,$stateParams,$window) {
	$scope.curpro=1;
	function ChangeSize(){
		var c1_middleHeight=$('.hc1_middle img').height();
		var c1_lbottomHeight=$('.c1_lbottom').height();
		var blankMHeight=$('.blank_m').height();
		$('.c1_left').height(c1_middleHeight);
		$('.c1_ltop').height(c1_middleHeight-c1_lbottomHeight-blankMHeight);
		var hc3_middleHeight=$('.hc3_middle img').height();
		$('.hc3_left').height(hc3_middleHeight);
	}   
	var w = angular.element($window);
	w.bind('resize', function(){
		ChangeSize();
	});
	$('img').on('load',function(){
		ChangeSize(); 
	});

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

	var HomeProInit={"c1":[1,26,30,32],"c2":[24,34,0,23],"c3":[37,38,39,40]}
	var HomeProArr={"c1":[],"c2":[],"c3":[]};

	HomeProArr.c1=[].concat(GetProDetailFun(HomeProInit.c1));
	HomeProArr.c2=[].concat(GetProDetailFun(HomeProInit.c2));
	HomeProArr.c3=[].concat(GetProDetailFun(HomeProInit.c3));
	
	$scope.HomeProArr=HomeProArr;

}]);
