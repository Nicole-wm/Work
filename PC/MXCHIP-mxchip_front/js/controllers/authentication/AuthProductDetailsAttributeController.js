angular.module('FogApp').controller('AuthProductDetailsAttributeController', ['$rootScope', '$scope', 'settings','$modal','$http', function($rootScope, $scope, settings,$modal,$http) {
    /************************初始化变量************************/
    var ID = getQueryStringByKey('ID');

    var ParaKeys=[/*下拉框-属性读写类型*/
    { "pkey":"readonly","ParaKeyName":"可写"},
    { "pkey":"writable","ParaKeyName":"只读"},
    { "pkey":"fault","ParaKeyName":"故障"},
    { "pkey":"alert","ParaKeyName":"报警"}
    ]

    var ParaTypes=[/*下拉框-属性数据类型*/
    { "ptype":"int","ParaTypeName":"整型"},
    { "ptype":"float","ParaTypeName":"浮点型"},
    { "ptype":"string","ParaTypeName":"字符串"},
    { "ptype":"boolean","ParaTypeName":"布尔型型"}
    ]

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
        $.ajax({ 
            type: "GET", 
            url: "json/product_details_attribute.json", 
            dataType: "json",
            async:false,  
            success: function (response) { 
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
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }


    /************************页面调用方法************************/
    $scope.InitPage=function(){/*Fun-获取属性*/
        GetProductDetailAttributeFun();
    }

    $scope.InitPage();

    $scope.ReloadFun=function(){/*Fun-刷新数据*/
        $scope.InitPage();
    }

    $scope.EditProductFun=function(ID){/*Fun-列表-编辑*/
        ProductAttrArr = $scope.ProductAttrArr;
        for(i=0;i<ProductAttrArr.length;i++){
            if(ProductAttrArr[i].id==ID){
                $scope.ParaKeyName=ProductAttrArr[i].ParaKeyName;
                $scope.ParaTypeName=ProductAttrArr[i].ParaTypeName;
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
                break;
            }
        }
    }
}]);