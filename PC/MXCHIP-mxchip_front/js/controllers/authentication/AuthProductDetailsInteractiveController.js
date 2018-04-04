angular.module('FogApp').filter('propsFilter', function() {
	return function(items, props) {
		var out = [];
		if (angular.isArray(items)) {
			items.forEach(function(item) {
				var itemMatches = true;

				var keys = Object.keys(props);
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var arr = props[prop];
					for(var i=0;i<arr.length;i++){
						if(item.id==arr[i].id){
							itemMatches = false;
							break;
						}else{
							itemMatches = true;
						}
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			out = items;
		}
		return out;
	};
});


angular.module('FogApp').controller('AuthProductDetailsInteractiveController', ['$rootScope', '$scope', 'settings','$http', function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	var ID = getQueryStringByKey('ID');

	$scope.InterCount=0;//列表-指令总数
	$scope.InterID=-1;//列表-编辑-属性ID

	$scope.ModalType=-1;//弹框出现时-状态：默认1为新建，2为编辑
	$scope.CreatKeyFlag=0;//弹框-键值对中-新建输入行
	$scope.EditFlag=-1;//弹框-编辑-键值对ID
    $scope.KeyArr=[];//弹框-键值对默认
    $scope.SaveFlag=1;//弹框-键值对是否保存
	$scope.ParaArr = [];//弹框-参数集合
	$scope.multipleDemo = {};//弹框-参数集合
	$scope.multipleDemo.selectedPara = [];//弹框-已选参数

	/************************初始化数据************************/
	var GetAttributeFun=function(){/*获取数据-产品属性列表*/
		$.ajax({ 
            type: "GET", 
            url: "json/product_details_attribute.json", 
            dataType: "json",
            async:false,  
            success: function (response) { 
                ParaArr=response.data.result;
				$scope.ParaArr = ParaArr;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
	}

	GetAttributeFun();

	/*获取数据-产品管理-产品指令数据*/
	var GetProductDetailInterFun=function(){
		$.ajax({ 
            type: "GET", 
            url: "json/product_details_interactive.json", 
            dataType: "json",
            async:false,  
            success: function (response) { 
				$scope.InterCount=response.data.count;
				ProductInterArr=response.data.result;
				for(i=0;i<ProductInterArr.length;i++){
					for(j=0;j<ProductInterArr[i].product_parameter.length;j++){
						var currPara=ProductInterArr[i].product_parameter[j];
						if(currPara.is_required==1){
							currPara.IsMustText="是";
						}else{
							currPara.IsMustText="否";
						}
					}
				}
				$scope.ProductInterArr=ProductInterArr;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
	}

	/************************页面调用方法************************/
	GetProductDetailInterFun();
	
	$scope.EditInterFun=function(ID){/*Fun-列表-编辑*/
		GetAttributeFun();
		$scope.CreatKeyFlag=0;
		$scope.ModalStype=2;
		$scope.InterID=ID;
		for(i=0;i<ProductInterArr.length;i++){
			if(ProductInterArr[i].id==ID){
				$scope.ModalName=ProductInterArr[i].name;
				$scope.ModalType=ProductInterArr[i].commtype;
				if($scope.ModalType==0){
					$scope.ModalTypeText="状态";
				}else{
					$scope.ModalTypeText="命令";
				}
				$scope.ModalDesc=ProductInterArr[i].description;
				var CurparaArr=ProductInterArr[i].product_parameter;
				$scope.multipleDemo = {};
				$scope.multipleDemo.selectedPara=[];
				for(var j=0;j<CurparaArr.length;j++){
					CurparaArr[j].product_parameter.IsMust=CurparaArr[j].is_required;
					$scope.multipleDemo.selectedPara.push(CurparaArr[j].product_parameter);
				}
				$scope.KeyArr=angular.fromJson(ProductInterArr[i].metadata.data);
				break;
			}
		} 
	}
}]);
