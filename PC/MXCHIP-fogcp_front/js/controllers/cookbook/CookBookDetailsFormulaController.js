angular.module('FogApp').controller('CookBookDetailsFormulaController', ['$rootScope', '$scope', 'settings','$modal', function($rootScope, $scope, settings,$modal) {
    var ID = getQueryStringByKey('ID');
    var currTabPage=2;

    /*获取数据-食谱管理-食谱配方设置*/
    var GetCBdetailFormulaFun=function(){
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_details_formula.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                CBFormulaArr=data.Data;
                $scope.CBFormulaArr = CBFormulaArr;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }

    /*列表初始化-食谱原料信息*/
    GetCBdetailFormulaFun();

    /*弹框-清空*/
    $scope.ClearForm=function(){
        $("#FormReset").click();
        $scope.ModalName="";
        $scope.ModalQuantity="";
        $scope.ModalRemark="";
    }

    /*列表操作-食谱原料编辑*/
    $scope.EditCBFun=function(ID){
        $.ajax({ 
            type: "GET", 
            url: "json/cookbook_details_formula.json", 
            dataType: "json",
            async:false,  
            success: function (data) { 
                CBFormulaArr=data.Data;
                for(i=0;i<CBFormulaArr.length;i++){
                    if(CBFormulaArr[i].ID==ID){
                        $scope.ModalName=CBFormulaArr[i].MaterName;
                        $scope.ModalQuantity=CBFormulaArr[i].MaterQuantity;
                        $scope.ModalRemark=CBFormulaArr[i].MaterRemark;
                        break;
                    }
                }
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        }); 
    }

    /*列表操作-食谱原料删除*/
    $scope.DeleteCBFun=function(ID){
        Common.confirm({
            title: "食谱原料",
            message: "确认删除该食谱原料？",
            operate: function (reselt) {
                if (reselt) {
                    Common.alert({
                        message: "该食谱原料删除成功！",
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
            title: "食谱原料",
            message: "确认食谱原料内容？",
            operate: function (reselt) {
                if (reselt) {
                    /*Tips：将创建的数据传到数据库并刷新页面*/
                    Common.alert({
                        message: "食谱原料更新成功！",
                        operate: function (reselt) {
                            $("#myModal_formula_btn").click();
                            $scope.ReloadFun(currTabPage);
                        }
                    })
                } else {
                }
            }
        })
    }
}]);