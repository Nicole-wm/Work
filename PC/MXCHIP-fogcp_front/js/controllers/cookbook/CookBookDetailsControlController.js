angular.module('FogApp').controller('CookBookDetailsControlController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
	var ID = getQueryStringByKey('ID');
	var currTabPage=4;
	$scope.IsInterFlag=false;

	/*获取数据-食谱管理-食谱设备控制设置*/
	var GetCBdetailControlFun=function(){
		$.ajax({ 
			type: "GET", 
			url: "json/cookbook_details_controls.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				CBControlArr=data.Data;
				$scope.CBControlArr = CBControlArr;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		}); 
	}

	/*列表初始化-食谱设备控制*/
	GetCBdetailControlFun();

	/*弹框-清空*/
	$scope.ClearForm=function(){
		$("#FormReset").click();
		$scope.ModalName="";
		$scope.ModalInstruction="";
		$scope.ModalInter="";
	}

	/*弹框操作-食谱管理-食谱设备控制下拉指令数据*/
	var GetCBInterFun=function(){
		$.ajax({ 
			type: "GET", 
			url: "json/cookbook_details_controls_inters.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				$scope.Inters = data.Data;
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		}); 
	}

	GetCBInterFun();

	/*弹框操作-食谱管理-食谱设备控制下拉指令*/
	$scope.ChangeInter=function(){
		$scope.IsInterFlag=false;
		$scope.TableInter=[];
		for(var i=0;i<$scope.Inters.length;i++){
			if($scope.Inters[i].ID==$scope.ModalInter){
				if($scope.Inters[i].Minvalue||$scope.Inters[i].Maxvalue){
					$scope.IsInterFlag=true;
					$scope.TableInter=$scope.Inters[i];
				}
				break;
			}
		}
	}

	$scope.InterBlurFun=function(){
		if(!isNaN($scope.ModalInterValue)){
			if($scope.ModalInterValue>=$scope.TableInter.Minvalue&&$scope.ModalInterValue<=$scope.TableInter.Maxvalue){
			}else{
				$scope.ModalInterValue="";
				Common.alert({
					message: "该设备控制指令输入范围有误，请重新输入！",
					operate: function (reselt) {
						$scope.ReloadFun(currTabPage);
					}
				})
			}
		}else{
			$scope.ModalInterValue="";
			Common.alert({
				message: "该设备控制指令输入格式有误，请重新输入！",
				operate: function (reselt) {
					$scope.ReloadFun(currTabPage);
				}
			})
		}
	}

	/*列表操作-食谱设备控制编辑*/
	$scope.EditCBFun=function(ID){
		$.ajax({ 
			type: "GET", 
			url: "json/cookbook_details_controls.json", 
			dataType: "json",
			async:false,  
			success: function (data) { 
				CBContorlArr=data.Data;
				for(i=0;i<CBContorlArr.length;i++){
					if(CBContorlArr[i].ID==ID){
						$scope.ModalName=CBContorlArr[i].Name;
						$scope.ModalInstruction=CBContorlArr[i].Instruction;
						$scope.ModalInter=CBContorlArr[i].InterID;
						$scope.ModalInterValue=CBContorlArr[i].InterValue*1;
						$scope.ChangeInter();
						break;
					}
				}
			}, 
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		}); 
	}

	/*列表操作-食谱设备控制删除*/
	$scope.DeleteCBFun=function(ID){
		Common.confirm({
			title: "食谱设备控制",
			message: "确认删除该设备控制指令？",
			operate: function (reselt) {
				if (reselt) {
					Common.alert({
						message: "该设备控制指令删除成功！",
						operate: function (reselt) {
							$scope.ReloadFun(currTabPage);
						}
					})
				} else {
				}
			}
		})
	}

	/*弹框操作-点击保存进行新建和编辑*/
	$scope.EditFormulaFun=function(){
		Common.confirm({
			title: "食谱设备控制",
			message: "确认食谱设备控制内容？",
			operate: function (reselt) {
				if (reselt) {
					/*Tips：将创建的数据传到数据库并刷新页面*/
					Common.alert({
						message: "食谱设备控制更新成功！",
						operate: function (reselt) {
							$("#myModal_control_btn").click();
							$scope.ReloadFun(currTabPage);
						}
					})
				} else {
				}
			}
		})
	}
}]);
