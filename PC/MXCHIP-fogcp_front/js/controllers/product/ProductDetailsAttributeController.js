angular.module('FogApp').controller('ProductDetailsAttributeController', ['$rootScope', '$scope', 'settings','$modal','$http', function($rootScope, $scope, settings,$modal,$http) {
    /************************初始化变量************************/
    if(getQueryStringByKey('ID')){
        var ID = getQueryStringByKey('ID'); 
    }else{
        var ID = '';
    }
    
    $scope.AttrCount=0;//列表属性总数
    $scope.ParaID=-1;//列表-编辑-属性ID
    
    $scope.ModalStype=1;//弹框出现时-状态：默认1为新建，2为编辑
    $scope.CreatKeyFlag=0;//弹框-键值对中-新建输入行
    $scope.EditFlag=-1;//弹框-编辑-键值对ID
    $scope.KeyArr=[];//弹框-键值对默认
    $scope.SaveFlag=1;//弹框-键值对是否保存

    var ParaKeys=[/*下拉框-属性读写类型*/
    { "pkey":"readonly","ParaKeyName":"可写"},
    { "pkey":"writable","ParaKeyName":"只读"},
    { "pkey":"fault","ParaKeyName":"故障"},
    { "pkey":"alert","ParaKeyName":"报警"}
    ]

    $scope.ParaKeys=ParaKeys;

    var ParaTypes=[/*下拉框-属性数据类型*/
    { "ptype":"int","ParaTypeName":"整型"},
    { "ptype":"float","ParaTypeName":"浮点型"},
    { "ptype":"string","ParaTypeName":"字符串"},
    { "ptype":"boolean","ParaTypeName":"布尔型型"}
    ]

    $scope.ParaTypes=ParaTypes;

    var InitModal=function(){
        $scope.ParaIdentifier="";
        $scope.ParaName="";
        $scope.ParaKey="";
        $scope.ParaType="";
        $scope.IsModify=false;
        $scope.KeyArr=[];
        $scope.Units="";
        $scope.Symbol="";
        $scope.Minvalue=null;
        $scope.Maxvalue=null;
        $scope.ParaDescription="";
    }

    InitModal();

    /************************初始化数据************************/
    var GetProductDetailAttributeFun=function(){/*获取数据-产品管理-产品属性数据*/
        var Url = $rootScope.settings.portsPath+'product/parameterlist/?product='+ID;
        var Data ='';
        var PostParam = {
            method: 'GET',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
        };
        $http(PostParam).success(function(response){
            if(response.meta.code==0){
                $scope.AttrCount=response.data.count;
                ProductAttrArr=response.data.result;
                for(i=0;i<ProductAttrArr.length;i++){
                    CurParaKey=ProductAttrArr[i].pkey;
                    CurParaType=ProductAttrArr[i].ptype;
                    for(var j=0;j<ParaKeys.length;j++){
                        if(ParaKeys[j].pkey==CurParaKey){
                            ProductAttrArr[i].ParaKeyName=ParaKeys[j].ParaKeyName;
                        }
                    }
                    for(var j=0;j<ParaTypes.length;j++){
                        if(ParaTypes[j].ptype==CurParaType){
                            ProductAttrArr[i].ParaTypeName=ParaTypes[j].ParaTypeName;
                        }
                    }
                }
                $scope.ProductAttrArr = ProductAttrArr;
            }else{
                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                Common.alert({
                    message:"获取产品属性数据失败！原因："+CurErrorMessage,
                    operate: function (reselt) {  
                    }
                })
            }
        }).error(function(response, status){
            console.log(response.error);
        });
    }

    if(ID){
        GetProductDetailAttributeFun();
    }
    /************************页面调用方法************************/
    $scope.InitPage=function(){/*Fun-获取属性*/
        GetProductDetailAttributeFun();
    }

    $scope.ReloadFun=function(){/*Fun-刷新数据*/
        $scope.InitPage();
    }

    $scope.CheckFun=function(){/*Fun-弹框复选框*/
        $scope.IsModify=!$scope.IsModify;
    }

    $scope.ClearForm=function(){/*Fun-弹框清空*/
        $("#FormReset").click();
        $scope.ModalStype=1;
        $scope.ParaID=-1;
        $scope.CreatKeyFlag=0;
        $scope.EditFlag=-1;
        $scope.IsModify=false;
        $scope.ParaIdentifier="";
        InitModal();
    }

    $scope.EditProductFun=function(ID){/*Fun-列表-编辑*/
        $scope.ParaID=ID;
        $scope.ModalStype=2;
        $scope.CreatKeyFlag=0;
        $scope.EditFlag=-1;
        ProductAttrArr = $scope.ProductAttrArr;
        for(i=0;i<ProductAttrArr.length;i++){
            if(ProductAttrArr[i].id==ID){
                for(var j=0;j<ParaKeys.length;j++){
                    if(ParaKeys[j].pkey==CurParaKey){
                        ProductAttrArr[i].ParaKeyName=ParaKeys[j].ParaKeyName;
                    }
                }
                for(var j=0;j<ParaTypes.length;j++){
                    if(ParaTypes[j].ptype==CurParaType){
                        ProductAttrArr[i].ParaTypeName=ParaTypes[j].ParaTypeName;
                    }
                }
                $scope.ParaIdentifier=ProductAttrArr[i].identifier;
                $scope.ParaName=ProductAttrArr[i].pname;
                $scope.ParaKey=ProductAttrArr[i].pkey;
                $scope.ParaType=ProductAttrArr[i].ptype;
                $scope.Units=ProductAttrArr[i].units;
                $scope.Minvalue=ProductAttrArr[i].minvalue;
                $scope.Maxvalue=ProductAttrArr[i].maxvalue;
                $scope.Symbol=ProductAttrArr[i].symbol;
                $scope.IsModify=ProductAttrArr[i].ismodify;
                $scope.ParaDescription=ProductAttrArr[i].description;
                $scope.KeyArr=angular.fromJson(ProductAttrArr[i].attributes.data);
                if($scope.KeyArr){
                }else{
                    $scope.KeyArr=[];
                }
                $scope.KayArrID();
                break;
            }
        }
    }

    $scope.DeleteProductFun=function(ParamID){/*Fun-列表-删除*/
        var Url = $rootScope.settings.portsPath+'product/parameterinfo/?id='+ParamID;
        var Data = '';
        var PostParam = {
            method: 'delete',url:Url,data:Data,headers:{'Content-Type': 'application/x-www-form-urlencoded','Accept':'*/*','AUTHORIZATION': "Token " + localStorage.token}
        };

        Common.confirm({
            title: "产品功能属性",
            message: "确认删除该产品功能属性？",
            operate: function (reselt) {
                if (reselt) {
                    $http(PostParam).success(function(response){
                        if(response.meta.code==0){
                            Common.alert({
                                message: "该产品功能属性删除成功！",
                                operate: function (reselt) {
                                    $scope.ReloadFun();
                                }
                            })
                        }else{
                            CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                            Common.alert({
                                message:"该产品功能属性删除失败！原因："+CurErrorMessage,
                                operate: function (reselt) {  
                                }
                            })
                        }
                    }).error(function(response, status){
                        Common.alert({
                            message: "该产品功能属性删除失败！原因："+response.error,
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
                message: "有属性暂未保存，请先保存。",
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

    function ValidMess(){/*Fun-弹框-验证信息*/
        Common.alert({
            message: "产品功能属性范围有误，请重新输入",
            operate: function (reselt) {
                return false;
            }
        })
    }

    $scope.ModalValid=function(flag,value){/*Fun-弹框-验证 flag:1：验证属性标识。2：数字*/
        var checkResult = 1;
        var message="";

        if(flag==1){
            message="属性标识";
            var checkReg =/^[A-Za-z_][A-Za-z0-9_]*$/;
            checkResult = checkReg.test(value);
        }else if(flag==2){
            message="最小值";
            if(null==value||value==""){ 
                $scope.Minvalue=null;      
            }else{
                checkResult =!isNaN(value);
            }
        }else{
            message="最大值";
            if(null==value||value==""){ 
                $scope.Maxvalue=null;      
            }else{
                checkResult =!isNaN(value);
            }
        }
        if(checkResult){
            return true;
        }else{
            Common.alert({
                message: message+"格式有误，请重新输入",
                operate: function (reselt) {
                    return false;
                }
            })
        }
    }

    function ValidateFun(){/*Fun-弹框-验证*/
        if($scope.CreatKeyFlag==1||$scope.SaveFlag==0){
            Common.alert({
                message: "有属性暂未保存，请先保存。",
                operate: function (reselt) {
                }
            })
        }else{
            if($scope.ModalValid(1,$scope.ParaIdentifier)){
                if($scope.ModalValid(2,$scope.Minvalue)){
                    if($scope.ModalValid(3,$scope.Maxvalue)){
                        if($scope.Minvalue!=null){
                            if($scope.Maxvalue!=null){
                                if($scope.Minvalue<=$scope.Maxvalue){
                                    return true;
                                }else{
                                    ValidMess();
                                }
                            }else{
                                ValidMess();
                            }
                        }else{
                            if($scope.Maxvalue!=null){
                                ValidMess();
                            }else{
                                return true;
                            }
                        }
                    }else{
                    }
                }else{
                }
            }else{ 
            }
        }
    }

    $scope.EditAttrFun=function(){/*Fun-弹框-保存*/
        var JsonAttr = {"data":$scope.KeyArr};
        var MethodStype="POST";
        var PageParam={    
            'product':ID,
            'identifier':$scope.ParaIdentifier,
            'pname':$scope.ParaName,
            'pkey':$scope.ParaKey,
            'ptype':$scope.ParaType,
            'units':$scope.Units,
            'symbol':$scope.Symbol,
            'minvalue':$scope.Minvalue,
            'maxvalue':$scope.Maxvalue,
            'description':$scope.ParaDescription,
            'ismodify':$scope.IsModify,
            'attributes':JsonAttr
        };
        if($scope.ModalStype==2){
            PageParam.id=$scope.ParaID;
            MethodStype="PUT";
        }else{
            MethodStype="POST";
        }

        var ValidFlag=ValidateFun(PageParam);
        if(ValidFlag){
            var Url = $rootScope.settings.portsPath+'product/parameterinfo/';
            var Data = PageParam;
            var PostParam = {
                method:MethodStype,url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
            };

            Common.confirm({
                title: "产品功能属性",
                message: "确认产品功能属性内容？",
                operate: function (reselt) {
                    if (reselt) {
                        $http(PostParam).success(function(response){
                            if(response.meta.code==0){
                                Common.alert({
                                    message: "产品功能属性提交成功！",
                                    operate: function (reselt) {
                                        $("#myModal_parameter_btn").click();
                                        $scope.ReloadFun();
                                    }
                                })
                            }else{
                                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                                Common.alert({
                                    message:"产品功能属性提交失败，原因："+CurErrorMessage,
                                    operate: function (reselt) {  
                                    }
                                })
                            }
                        }).error(function(response, status){
                            console.log(response.error);
                            Common.alert({
                                message: "产品功能属性提交失败，原因："+response.error,
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

}]);