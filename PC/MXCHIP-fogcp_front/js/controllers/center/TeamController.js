angular.module('FogApp').controller('TeamController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.ShowFlag=false;
	$scope.SearchKey="";
	$scope.SearchFlag=false;
	$scope.ChooseTeam=[];
	$scope.MemberCount=0;

	$scope.ModaltotalItems=0;
	$scope.ModalListCount=0;
	$scope.ModalListArr =[];
	$scope.ModalcurrentPage = 1;
	$scope.ModalpageSize = 5;
	$scope.ModalmaxSize=5;

	$scope.Teamid="";
	$scope.IsAuthority=false;

	function ModalInitPage(currentPage){		
		return param={
			'page':currentPage,
			'limit':$scope.ModalpageSize
		} 
	}

	var Modalparam=ModalInitPage(1);

	/************************初始化数据************************/
	/*当前登录用户*/
	var GetCurUserFun=function(){
		var Url = $rootScope.settings.portsPath+'accounts/info/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				CurUser=response.data;
				$scope.CurUserEmail=CurUser.user.email;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取用户信息失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	/*成员列表*/
	var GetListFun = function (TID) {
		$scope.MemberCount= 0;
		$scope.ListArr = [];
		var Url = $rootScope.settings.portsPath+'team/member/list/?teamid='+TID;
		var Data ='';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};
		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				$scope.MemberCount=response.data.length;
				$scope.ListArr=response.data;
			}else{
				CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
				Common.alert({
					message:"获取成员列表失败！原因："+CurErrorMessage,
					operate: function (reselt) {  
					}
				})
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	/*团队列表*/
	var GetTeamFun=function(){
		var Url = $rootScope.settings.portsPath+'team/';
		var Data = '';
		var PostParam = {
			method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		$http(PostParam).success(function(response){
			if(response.meta.code==0){
				if(response.data.length==0){
					var Url = $rootScope.settings.portsPath+'team/';
					var Data = '';
					var PostParam = {
						method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
					};
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							$scope.IsAuthority=true;
							$scope.Teamid=response.data.teamid;
							GetListFun($scope.Teamid);
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"获取团队列表失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						console.log(response.error);
					});
				}else{
					$scope.IsAuthority=true;
					$scope.Teamid=response.data[0].teamid;
					GetListFun($scope.Teamid);
				}
			}else if(response.meta.code==29070){
				$scope.IsAuthority=false;
			}else{
			}
		}).error(function(response, status){
			console.log(response.error);
		});
	}

	function InitData(){
		GetCurUserFun();
		GetTeamFun();
	}

	InitData();

	/************************页面调用方法************************/
	$scope.ModalpageChanged = function()/*Fun-分页*/
	{
		Modalparam=ModalInitPage($scope.ModalcurrentPage);
		$scope.SearchPerson(Modalparam);
	};

	$scope.ClearForm=function(){/*弹框-清空*/
		$scope.SearchKey="";
		$scope.ChooseTeam=[];
		$scope.ModaltotalItems=0;
		$scope.ModalListArr=[];
		$scope.ShowFlag=false;
	}

	$scope.SearchPerson=function(Modalparam){/*Fun-查询邮箱*/
		$scope.SearchFlag = true;
		if($scope.SearchKey!=""){
			var Url = $rootScope.settings.portsPath+'team/member/search/?identification='+$scope.SearchKey+'&page='+param.page+'&limit='+param.limit;
			var Data ='';
			var PostParam = {
				method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
			}; 
			$http(PostParam).success(function(response){
				if(response.meta.code==0){
					$scope.ModaltotalItems = response.data.count;
					$scope.ModalListArr = response.data.results;
				}else{
					CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
					Common.alert({
						message:"邮箱查询失败！原因："+CurErrorMessage,
						operate: function (reselt) {  
						}
					})
				}
			}).error(function(response, status){
				console.log(response.error);
			});
		}else{
			$scope.ListCount=0;
		}
	}

	$scope.ModalChoose=function(ObjEmail){/*Fun-选择*/
		var IsExitFlag=0;
		var ObjArr=$scope.ChooseTeam;
		for(var i=0;i<ObjArr.length;i++){
			if(ObjArr[i]==ObjEmail){
				IsExitFlag=1;
				break;
			}
		}
		if(IsExitFlag){
			$scope.ChooseTeam.splice(i,1);
			$scope.ShowFlag=false;
		}else{
			$scope.ChooseTeam.push(ObjEmail);
			$scope.ShowFlag=true;
		}
	}

	$scope.AddMemberFun=function(){/*Fun-添加成员*/
		var Url = $rootScope.settings.portsPath+'team/member/';
		var Data = {
			'identifications':$scope.ChooseTeam,
			'teamid':$scope.Teamid
		};
		var PostParam = {
			method: 'POST',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "添加团队成员",
			message: "确认添加团队成员？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "添加团队成员成功！",
								operate: function (reselt) {	
									$("#myModal_parameter_btn").click();
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"添加团队成员失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "添加团队成员失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.DeleteMemberFun=function(Email){/*Fun-删除成员*/
		var Url = $rootScope.settings.portsPath+'team/member/?identification='+Email+"&&teamid="+$scope.Teamid;
		var Data = '';
		var PostParam = {
			method: 'DELETE',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
		};

		Common.confirm({
			title: "成员删除",
			message: "确认删除该成员？",
			operate: function (reselt) {
				if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "成员删除成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
							Common.alert({
								message:"成员删除失败！原因："+CurErrorMessage,
								operate: function (reselt) {  
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "成员删除失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}
			}
		})
	}

	$scope.ReloadFun=function(){//刷新页面
		InitData();
	}
}]);
