
maccoApp.factory('macco',function($http) {
   var macco = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
    this.SType = '';
};

/*var url = window.$servie + 'AdminApi/Activity/FetchShowAwardActivity';*/
var url = window.$AppApiService + 'AdminApi/Activity/FetchShowAwardActivity';
var id = getQueryStringByKey("ID");
var KeyNO = getQueryStringByKey("KeyNO");
macco.prototype.nextPage = function() {
    var param = {
        PageSize : 10,
        LastID : 0,
        ActivityKeyNo:KeyNO
    }; 
    this.busy = true;
    if(this.after != undefined && this.after != '') {
        param.LastID= this.after;
    }
    $http.post(url, param).success( function(data) {
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
            templateUrl: '/ActivityManagement/CommentDetails.html',
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

    $scope.Delete = function(CommentID) {
        if ($rootScope.Operating) {
              /*var production_deleteUrl = window.$servie + 'AdminApi/Activity/DeleteAwardActivity';*/  
             var production_deleteUrl = window.$AppApiService + 'AdminApi/Activity/DeleteAwardActivity';          
             var param = {
                ID:CommentID,
                apiKey:window.$apiKey
            };

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
        } else {
            $window.alert('没有权限，详情请咨询超级管理员！');
        }
    };
}); 