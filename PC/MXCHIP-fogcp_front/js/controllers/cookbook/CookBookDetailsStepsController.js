angular.module('FogApp').controller('CookBookDetailsStepsController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
	var ID = getQueryStringByKey('ID');
    var currTabPage=3;
    
    /*获取数据-食谱管理-食谱步骤设置*/
    var GetCBdetailFormulaFun=function(){
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_details_steps.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                CBStepArr=data.Data;
                $scope.CBStepArr = CBStepArr;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }

    /*列表初始化-食谱步骤*/
    GetCBdetailFormulaFun();

    /*弹框-清空*/
    $scope.ClearForm=function(){
        $("#FormReset").click();
        $scope.ModalName="";
        $scope.ModalImageUrl="";
        $scope.ModalInstruction="";
        $("#ModalImageUrlId").attr("src","../assets/pages/img/fogdefault.jpg");
    }

    /*列表操作-食谱步骤编辑*/
    $scope.EditCBFun=function(ID){
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_details_steps.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                CBFormulaArr=data.Data;
                for(i=0;i<CBFormulaArr.length;i++){
                    if(CBFormulaArr[i].ID==ID){
                        $scope.ModalName=CBFormulaArr[i].Name;
                        $scope.ModalImageUrl=CBFormulaArr[i].ImageUrl;
                        $scope.ModalInstruction=CBFormulaArr[i].Instruction;
                        break;
                    }
                }
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }

    /*列表操作-食谱步骤删除*/
    $scope.DeleteCBFun=function(ID){
        Common.confirm({
            title: "食谱步骤",
            message: "确认删除该食谱步骤？",
            operate: function (reselt) {
                if (reselt) {
                    Common.alert({
                        message: "该食谱步骤删除成功！",
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
            title: "食谱步骤",
            message: "确认食谱步骤内容？",
            operate: function (reselt) {
                if (reselt) {
                    /*Tips：将创建的数据传到数据库并刷新页面*/
                    Common.alert({
                        message: "食谱步骤更新成功！",
                        operate: function (reselt) {
                            $("#myModal_step_btn").click();
                            $scope.ReloadFun(currTabPage);
                        }
                    })
                } else {
                }
            }
        })
    }
}]);
