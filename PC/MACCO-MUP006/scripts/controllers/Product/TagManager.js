maccoApp.factory('macco', function ($http) {
    var ProductKeyNo = window.getQueryStringByKey('KeyNo');
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = '';
        this.Keyword = '';
    };

    /*var SearchUrl = window.$servie + 'AdminApi/Tag/FetchProductTag';*/
    var SearchUrl = window.$AppApiService +'AdminApi/Tag/FetchProductTag';
    var param = {
        ProductKeyNo:ProductKeyNo,
        PageSize: 10,
        LastID: 0
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        if (this.Keyword != undefined) {
            param.Keyword = this.Keyword;
        } else {
            param.Keyword = '';
        }

        if (this.after != undefined && this.after != '') {
            param.LastID = this.after;
        }

        $http.post(SearchUrl, param).success(function (data) {
            var items = data.Data;
            for (var i = 0; i < items.length; i++) {
                this.items.push(items[i]);
            }
            if (this.items.length != 0) {
                this.after = this.items[this.items.length - 1].ID;
            }
            this.busy = false;
        }.bind(this));
        this.busy = false;
    };
    return macco;
});

maccoApp.controller('TagController', function ($scope,$http,macco,Upload,$window, $rootScope) {
    $scope.macco = new macco();
    var searchFn = function () {
        $scope.macco.items = [];
        $scope.macco.busy = false;
        $scope.macco.after = '';
        $scope.macco.Keyword = $scope.Keyword;
        $scope.$emit('list:search');
        $window.scroll(0, 10);
    };
    $scope.search = searchFn;
    searchFn();

    var ProductID = window.getQueryStringByKey('ID');
    var ProductKeyNo = window.getQueryStringByKey('KeyNo');
    $scope.AddInput = function () {  
        $scope.canadd = true;
        $scope.Sumbit = function () {
            if($scope.addcontent==""||$scope.addcontent==undefined){
                alert("内容不能为空");
            }else{
                $scope.canadd = false;
                /*var url = window.$servie + 'AdminApi/Tag/CreateProductTag';*/
                var url = window.$AppApiService + 'AdminApi/Tag/CreateProductTag';
                var fields = {
                    ProductKeyNo:ProductKeyNo,
                    TagName: $scope.addcontent,
                    LikeCount: $scope.addlikecount
                };

                var postCreateFunc = function (url, callback) {
                    Upload.upload({
                        url: url,
                        fields: fields,
                    }).success(function (data, status, headers, config) {
                        callback(data);
                    });
                };

                postCreateFunc(url, function (data) {
                    if (data.IsSuccess) { 
                        if (!data.Data.IsPublish) {
                            $window.alert('产品未发布，不能向外网添加Tag');
                        }else{
                            if (data.Data.IsCreated) {
                                searchFn();
                                $window.alert('添加成功');
                            }else{
                                $window.alert('Tag已经存在,请重新输入');
                            }
                        }
                    } else {
                        $window.alert('出错');
                    }
                });
            }
        };
    };

    $scope.Delete = function (tagid) {
        if ($window.confirm('确认删除此Tag？')) {
            /*var deleteUrl = window.$servie + 'AdminApi/Tag/DeleteProductTag';*/
            var deleteUrl = window.$AppApiService + 'AdminApi/Tag/DeleteProductTag';
            var param = {
                ProductTagID:tagid,
                apiKey: window.$apiKey,
            };

            $http.post(deleteUrl,param).success(function (data) {
                if (data.IsSuccess) {
                    if (data.Data.IsDeleted) {
                        searchFn();
                        $window.alert('删除成功');
                    } else {
                        $window.alert('出错');
                    }
                }
            });
        }
    };

    $scope.Cancel = function () {
        $scope.canadd = false;
    };

    $scope.ReturnBack = function (token) {
        $window.location.href = '/ProductManagement/productList.html?Token=' + $rootScope.Token;
    };
});
