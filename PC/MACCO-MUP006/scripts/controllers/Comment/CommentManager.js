maccoApp.factory('macco',function($http) {
 var macco = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
    this.SType = '';
};

var url = window.$AppApiService + 'AdminApi/Comment/FetchComment';

var param = {
    PageSize : 10,
    LastID : 0
}; 

macco.prototype.nextPage = function() {
    this.busy = true;
    if(this.SType != undefined && this.SType != '') {
        param.SType = this.SType;
    } else {
        param.SType = 0;
    }
    if(this.after != undefined && this.after != '') {
        param.LastID = this.after;
    }
    $http.post(url, param).success( function(data) {
         console.log(data);
        for (var i = 0; i < data.Data.length; i++) {
            console.log(data);
            this.items.push(data.Data[i]);
        }
        if(this.items.length!=0){
            this.after = this.items[this.items.length - 1].ID;
        }
        this.busy = false;
    }.bind(this));
    this.busy = false;
};
return macco;
});

maccoApp.controller('CommentListController', function($scope, $http,Upload,macco,$window,$rootScope,$modal) {
    $scope.items =[];
    $scope.macco = new macco(); 

    $scope.stypes = [
    {ID:0,Name:"资讯"},
    {ID:1,Name:"上妆"},
    {ID:2,Name:"产品"}      
    ];
    
    var searchFn = function() {
        $scope.macco.after ='';
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.SType = $scope.SType;
        $scope.$emit('list:search');
        $window.scroll(0,10);
    };
    
    $scope.search = searchFn;
    searchFn();

    $scope.Delete = function(ID) {
        if ($rootScope.Operating) {
            if($scope.SType=="2"){
                var production_deleteUrl = window.$AppApiService + 'AdminApi/Product/DeleteProductComment';
                var param = {
                    ProductCommentID:ID,
                    apiKey:window.$apiKey
                };
            }else if($scope.SType=="1"){
                var production_deleteUrl = window.$AppApiService + 'AdminApi/TryMakeup/DeleteTryMakeupComment';
                var param = {
                    TryMakeupCommentID:ID,
                    apiKey:window.$apiKey
                };
            }else {
                var production_deleteUrl = window.$AppApiService + 'AdminApi/Information/DeleteInfoComment';
                var param = {
                    InfoCommentID:ID,
                    apiKey:window.$apiKey
                };
            }
            
            if (!window.$isTest) {
                $http.post(production_deleteUrl,param).success(function(result){
                    if(result.IsSuccess) {
                        if(result.Data.IsDeleted) {
                            if($window.confirm('将会删除对应评论，确定要这样做吗？')) {
                                $window.alert('删除成功');
                                searchFn();
                            }
                        } else {
                            $window.alert('出错');
                        }
                    } else {
                        $window.alert('出错');
                    }
                }).error(function(data){
                    console.dir(data);  
                });
            }else{
                $window.alert('外网不能删除评论');
            }    
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };
}); 