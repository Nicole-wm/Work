angular.module('FogApp').controller('OTADetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
	/************************初始化变量************************/
	if(getQueryStringByKey('ID')){/*OTAid*/
		var ID = getQueryStringByKey('ID');	
	}else{
		var ID = '';
	}

	if(getQueryStringByKey('Proid')){/*产品id*/
		var Proid = getQueryStringByKey('Proid');
	}else{
		var Proid = '';
	}

	if(getQueryStringByKey('type')){/*类别，cp，ip，ota*/
		var Curtype = getQueryStringByKey('type');
	}else{
		var Curtype=0;
	}

	$scope.ModalStype=1;//1:新建
	$scope.CheckDate=false;
	$scope.showFileFlag=true;
	/************************初始化数据************************/
	var GetProListFun = function () {/*产品列表*/
		var Url = $rootScope.settings.portsPath+'product/list/?type='+Curtype;
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'Authorization': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				ProductArrs=response.data.result;
				$scope.ProductArrs = ProductArrs;
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

	GetProListFun();
	/************************页面调用方法************************/
	/*Fun-OTA文件上传*/
	upload_file_func('ota','ota_btn','ota_selectbtn','ota_upbtn','CurFile_Name','CurFile_Size','CurFile_MD5','CurFile_Url',Proid);

	$scope.FileClick=function(){/*选择OTA文件*/
		$scope.showFileFlag=false;
		$scope.CheckDate=true;
	}

	$scope.CheckDateFun =function(param){
		if(param.file_name!=''&&param.size!=''&&param.md5!=''&&param.file_url!=''){
			return true;		
		}else{
			Common.alert({
				message: "请上传文件！",
				operate: function (reselt) {
					return false;					
				}
			})
		}
	}

	$scope.SureFun=function(flag){/*OTA提交*/
		var File_name=$("#CurFile_Name").val();
		var File_size=$("#CurFile_Size").val();
		var File_md5=$("#CurFile_MD5").val();
		var File_url=$("#CurFile_Url").val();
		
		var param= {
			product:Proid,
			version:$scope.software,
			component:$scope.firmwaretype,
			description:$scope.description,
			extend:'',
			file_name:File_name,
			size:File_size,
			md5:File_md5,
			file_url:File_url,
			customize:$scope.customize
		};

		var Url = $rootScope.settings.portsPath+'ota/files/';
		var Data = param;
		var PostParam = {
			method:'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		if(flag){
			if($scope.CheckDateFun(param)){
				Common.confirm({ 
					title: "OTA信息",
					message: "确认提交OTA信息？",
					operate: function (reselt) {
						if (reselt) {
							$http(PostParam).success(function(response){
								if(response.meta.code==0){
									Common.alert({
										message: "OTA信息提交成功！",
										operate: function (reselt) {
											$scope.ReloadFun();							
										}
									})
								}else{
									CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
									Common.alert({
										message:"OTA信息提交失败！原因："+CurErrorMessage,
										operate: function (reselt) {  
										}
									})
								}
							}).error(function(response, status){
								Common.alert({
									message: "OTA信息提交失败！原因："+response.error,
									operate: function (reselt) {
									}
								})
							});
						} else {
						}
					}
				})
			}
		}else{
			$scope.ReloadFun();
		}
	}

	$scope.ReloadFun=function(){/*Fun-刷新*/
		window.location.href = '#/product/product_details.html?type='+Curtype+'&ID='+Proid; 
	}
}]);
