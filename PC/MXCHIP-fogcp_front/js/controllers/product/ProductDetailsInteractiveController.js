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


angular.module('FogApp').controller('ProductDetailsInteractiveController', ['$rootScope', '$scope', 'settings','$http', function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	if(getQueryStringByKey('ID')){
		var ID = getQueryStringByKey('ID');	
	}else{
		var ID = '';
	}
	
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
		var Url = $rootScope.settings.portsPath+'product/parameterlist/?product='+ID;
		var Data ='';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				ParaArr=response.data.result;
				$scope.ParaArr = ParaArr;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取产品属性列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	/*获取数据-产品管理-产品指令数据*/
	var GetProductDetailInterFun=function(){
		var Url = $rootScope.settings.portsPath+'product/commandlist/?product='+ID;
		var Data ='';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
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
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取产品指令失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	if(ID){
		GetAttributeFun();
		GetProductDetailInterFun();
	}

	/************************页面调用方法************************/
	$scope.InitPage=function(){/*Fun-获取指令*/
		GetProductDetailInterFun();
	}

	$scope.ReloadFun=function(){/*Fun-刷新数据*/
		$scope.InitPage();
	}

	$scope.CheckFun=function(flag){/*Fun-弹框单选框*/
		$scope.ModalType=flag;
	}

	$scope.CheckPara=function(Curpara){/*Fun-弹框复选框*/
		Curpara.IsMust=!Curpara.IsMust;
	}  

	$scope.ClearForm=function(){/*Fun-弹框清空*/
		GetAttributeFun();
		$("#FormReset").click();
		$scope.ModalStype=1;
		$scope.InterID=-1;
		$scope.ModalName="";
		$scope.ModalType=-1;
		$scope.ModalDesc="";
		$scope.multipleDemo.selectedPara=[];
		$scope.KeyArr=[];
	}

	$scope.EditInterFun=function(ID){/*Fun-列表-编辑*/
		GetAttributeFun();
		$scope.CreatKeyFlag=0;
		$scope.ModalStype=2;
		$scope.InterID=ID;
		for(i=0;i<ProductInterArr.length;i++){
			if(ProductInterArr[i].id==ID){
				$scope.ModalName=ProductInterArr[i].name;
				$scope.ModalType=ProductInterArr[i].commtype;
				$scope.ModalDesc=ProductInterArr[i].description;
				var CurparaArr=ProductInterArr[i].product_parameter;
				$scope.multipleDemo = {};
				$scope.multipleDemo.selectedPara=[];
				for(var j=0;j<CurparaArr.length;j++){
					CurparaArr[j].product_parameter.IsMust=CurparaArr[j].is_required;
					$scope.multipleDemo.selectedPara.push(CurparaArr[j].product_parameter);
				}
				$scope.KeyArr=angular.fromJson(ProductInterArr[i].metadata.data);
				$scope.KayArrID(); 
				break;
			}
		} 
	}

	$scope.DeleteInterFun=function(InterID){/*Fun-列表-删除*/
		var Url = $rootScope.settings.portsPath+'product/coproductcommandinfo/?id='+InterID;
		var Data = '';
		var PostParam = {
			method: 'delete',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "产品交互指令",
			message: "确认删除产品交互指令？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "产品交互指令删除成功！",
								operate: function (reselt) {
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"产品交互指令删除失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "产品交互指令删除失败！原因："+response.error,
							operate: function (reselt) {
							}
						})
					});
				} else {
				}
			}
		})
	}

	/*Fun-弹框-变量*/
	$scope.KeyArr=[];
	$scope.InitCount= $scope.KeyArr.length+1;

	$scope.KayArrID=function(){/*Fun-弹框-生成键值对数组ID*/
		for(i in $scope.KeyArr){
			$scope.KeyArr[i].ID= i*1;
		}
	}

	$scope.KayArrID();

	$scope.AddKey=function(){/*Fun-弹框-新建键值*/
		if($scope.CreatKeyFlag==1||$scope.SaveFlag==0){
			Common.alert({
				message: "有新建属性暂未保存，请先保存。",
				operate: function (reselt) {
				}
			})
		}else{
			$scope.CreatKeyFlag=1;
			$scope.KeyName="";
			$scope.KeyValue="";
		}
	}

	$scope.SaveNewKey=function(flag){/*Fun-弹框-保存键值*/
		if(flag){
			if($scope.KeyName!=""&&$scope.KeyValue!=""){
				$scope.CreatKeyFlag=0;
				$scope.KeyArr.unshift({"ID":$scope.InitCount++ ,"KeyName":$scope.KeyName,"KeyValue":$scope.KeyValue}); 
			}else{
				Common.alert({
					message: "新建属性键名或者键值不得为空！",
					operate: function (reselt) {
					}
				})
			}
		}else{
			$scope.CreatKeyFlag=0;
		}
	}

	$scope.DeleteKey=function(Key){/*Fun-弹框-删除键值*/
		$scope.KeyArr.splice($scope.KeyArr.indexOf(Key), 1);
	}

	$scope.EditKey=function(Key,ID){/*Fun-弹框-编辑键值*/
		$scope.SaveFlag=0;
		$scope.EditFlag=ID;
		var initKey=Key;
		var CurLine=$scope.KeyArr.indexOf(Key);
	}

	$scope.SaveEditKey=function(flag,ID){/*Fun-弹框-键值-保存取消*/
		$scope.SaveFlag=1;
		$scope.EditFlag=-1;
		if(flag){
			var curName=$("#EditName"+ID).val();
			var curValue=$("#EditValue"+ID).val();
			if(curName!=""&&curValue!=""){
				for(var i=0;i<$scope.KeyArr.length;i++){
					if($scope.KeyArr[i].ID==ID){
						$scope.KeyArr[i].KeyName=curName;
						$scope.KeyArr[i].KeyValue=curValue;
					}
				}
			}else{
				Common.alert({
					message: "编辑属性键名或者键值不得为空！",
					operate: function (reselt) {
					}
				})
			} 
		}else{
		}
	}

	$scope.SureInterFun=function(){/*Fun-弹框-保存*/
		var JsonAttr = {"data":$scope.KeyArr};
		var MethodStype="POST";
		var Modalparameter=[];
		var ModalselectedPara=$scope.multipleDemo.selectedPara;

		for(var i=0;i<ModalselectedPara.length;i++){
			var paramID=ModalselectedPara[i].id;
			var parammMust=ModalselectedPara[i].IsMust;
			if(parammMust){
				parammMust=1;
			}else{
				parammMust=0;
			}
			var paramobj={'product_parameter':paramID,'is_required':parammMust};
			Modalparameter.push(paramobj);
		}

		var PageParam={
			"product":ID,
			"name":$scope.ModalName,
			"commtype":$scope.ModalType,
			"description":$scope.ModalDesc,
			"parameter":angular.toJson(Modalparameter),
			"metadata":JsonAttr
		}

		if($scope.ModalStype==2){
			PageParam.id=$scope.InterID;
			MethodStype="PUT";
		}else{
			MethodStype="POST";
		}

		var Url = $rootScope.settings.portsPath+'product/coproductcommandinfo/';
		var Data = PageParam;
		var PostParam = {
			method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "产品交互指令",
			message: "确认产品交互指令内容？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "产品交互指令提交成功！",
								operate: function (reselt) {
									$("#myModal_command_btn").click();
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"产品交互指令提交失败，原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						console.log(response.error);
						Common.alert({
							message: "产品交互指令提交失败，原因："+response.error,
							operate: function (reselt) {
							}
						})
					});
				} else {
				}
			}
		})
	}
}]);
