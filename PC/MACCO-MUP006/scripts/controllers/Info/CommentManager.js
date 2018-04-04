
maccoApp.factory('macco',function($http) {
   var macco = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
    this.SType = '';
};
var url = window.$AppApiService + 'AdminApi/Information/FetchInformationComment';
var KeyNO = getQueryStringByKey("KeyNo");
var param = {
    PageSize : 10,
    LastCommentID : 0,
    KeyNO : KeyNO
}; 

macco.prototype.nextPage = function() {
    this.busy = true;
    if(this.after != undefined && this.after != '') {
        param.LastCommentID = this.after;
    }
    $http.post(url, param).success( function(data) {
        console.log(data);
        var items = data.Data;
        for (var i = 0; i < items.length; i++) {
            this.items.push(items[i]);
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


    $scope.AddNew = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/InformationManage/CommentDetails.html',
            controller: "CommentDetailController",
            resolve: {
                items: function () {
                    return $scope.selectedProduct;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selectedProduct = selectedItem;
            $scope.items.push(selectedItem[0]);
        }, function () {
        });
    };

    $scope.Delete = function(InfoCommentID) {
        if ($rootScope.Operating) {
            var production_deleteUrl = window.$AppApiService + 'AdminApi/Information/DeleteInfoComment';
            var param = {
                InfoCommentID:InfoCommentID,
                apiKey:window.$apiKey
            };
        
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