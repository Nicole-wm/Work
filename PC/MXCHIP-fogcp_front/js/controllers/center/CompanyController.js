angular.module('FogApp').controller('CompanyController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$("#pic1_img img").attr("src","../assets/pages/img/fogdefault.jpg");
	$("#pic2_img img").attr("src","../assets/pages/img/fogdefault.jpg");
	$("#pic3_img img").attr("src","../assets/pages/img/fogdefault.jpg");

	$scope.companyStates=4;
	/************************初始化数据************************/
	function judge(obj){
		for(var i in obj){
			return true;
		}
		return false;
	}

	var GetInfoFun=function(param){
		var Url = $rootScope.settings.portsPath+'profile/company/verf/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CompanyInfo=response.data;
				if(!judge(CompanyInfo)){
					$scope.companyStates=4;
				}else{
					$scope.companyname = CompanyInfo.name;
					$scope.bnumber = CompanyInfo.buslicnum;
					$scope.bentity = CompanyInfo.corporation;
					$scope.subenter = CompanyInfo.parentcompany;
					$scope.braddress = CompanyInfo.regaddr;
					$scope.tel = CompanyInfo.telephone;
					$scope.url = CompanyInfo.website;
					$scope.pic1 = CompanyInfo.groupnumpic;
					$scope.pic2 = CompanyInfo.buslicpic;
					$scope.pic3 = CompanyInfo.taxregpic;
					$scope.infoerror = CompanyInfo.infoerror;
					$scope.ischecked = CompanyInfo.ischecked;
					$scope.checkedtime = CompanyInfo.checkedtime;

					if($scope.ischecked){
						if($scope.infoerror){
							$scope.companyStates=1;//未通过
						}else{
							$scope.companyStates=2;//通过
						}
					}else{
						$scope.companyStates=3;//审核中
					}
				}
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取企业认证信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

GetInfoFun();

/************************页面调用方法************************/
/*Fun-图片上传*//*profile*/
upload_image_func('profile','pic1_selectbtn','pic1_btn','pic1_name','pic1_upbtn','pic1_img','pic1_input');
upload_image_func('profile','pic2_selectbtn','pic2_btn','pic2_name','pic2_upbtn','pic2_img','pic2_input');
upload_image_func('profile','pic3_selectbtn','pic3_btn','pic3_name','pic3_upbtn','pic3_img','pic3_input');

function CheckFun(param){
	function CheckImg(obj) {
		if(obj!=""&&obj!=null&&obj!=undefined){
			return true;
		}else{
			return false;
		}
	}
	if(CheckImg(param.groupnumpic)){
		if(CheckImg(param.buslicpic)){
			if(CheckImg(param.taxregpic)){
				return true;
			}else{
				Common.alert({
					message: "请上传税务登记证图！",
					operate: function (reselt) { 
						return false;  
					}
				})
			}
		}else{
			Common.alert({
				message: "请上传工商执照图！",
				operate: function (reselt) {
					return false;   
				}
			})
		}
	}else{
		Common.alert({
			message: "请上传组织机构代码图！",
			operate: function (reselt) {
				return false;   
			}
		})
	}
}

/*提交*/
$scope.CompanyInfoFun=function(){
	var param= {
		name:$scope.companyname,
		buslicnum:$scope.bnumber,
		corporation:$scope.bentity,
		parentcompany:$scope.subenter,
		regaddr:$scope.braddress,
		telephone:$scope.tel,
		website:$scope.url,
		groupnumpic:$("#pic1_img img").attr("src"),
		buslicpic:$("#pic2_img img").attr("src"),
		taxregpic:$("#pic3_img img").attr("src")
	};
	if(CheckFun(param)){
		var Url = $rootScope.settings.portsPath+'profile/company/verf/';
		var Data = param;
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "企业认证",
			message: "确认提交企业基本信息？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "企业基本信息提交成功！",
								operate: function (reselt) {   
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"企业基本信息提交失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "企业基本信息提交失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}
}

	$scope.ReloadFun=function(){//刷新页面
		$("#CompanyModalCloseBtn").click();
		GetInfoFun();
	}
}]);
