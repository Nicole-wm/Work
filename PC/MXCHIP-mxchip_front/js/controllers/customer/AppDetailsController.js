angular.module('FogApp').controller('AppDetailsController', ['$rootScope', '$scope', 'settings','$uibModal','$http',function($rootScope, $scope, settings,$uibModal,$http) {
    /************************初始化变量************************/ 
    var ID = getQueryStringByKey('ID');
    
    /************************初始化数据************************/
    var GetListFun=function(){/*管理-列表*/
        $.ajax({ 
            type: "GET", 
            url: "json/app_details.json", 
            dataType: "json",
            async:false,  
            success: function (response) { 
                $scope.AppName=response.data.name;
                $scope.ShortName=response.data.shortname;
                $scope.Description=response.data.description;
                var ListArr=[];
                var CurList=response.data.app_product_set;
                for(var i=0;i<CurList.length;i++){
                    ListArr.push(CurList[i].product);
                }
                for(i=0;i<ListArr.length;i++){
                    if(ListArr[i].status==1){
                        ListArr[i].StateText="已上线";
                    }else{
                        ListArr[i].StateText="开发中";
                    }
                }
                $scope.ListArr=ListArr;
            }, 
            error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
            } 
        });
    }

    GetListFun();
    
    /************************页面调用方法************************/
    $scope.ReloadFun=function(){/*Fun-刷新*/
        window.location.href = '#/customer/app_list.html';
    }
}]);
