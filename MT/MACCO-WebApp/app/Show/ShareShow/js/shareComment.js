var app = angular.module('maccoApp', ['infinite-scroll'], ['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);

app.factory('httpInterceptor', ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
    var loadingCount = 0;
    return {
        request: function (config) {
            if (++loadingCount === 1) $rootScope.$broadcast('loading:progress');
            return config || $q.when(config);
        },

        response: function (response) {
            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            return response || $q.when(response);
        },

        responseError: function (response) {
            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish');
            return $q.reject(response);
        }
    };
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

app.factory('macco', ['$http', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = 0;
    };


    var url = "http://" + window.hostname + '/MeiDeNi/ShowIndex/FetchShowIndexComment ';
    var ShowIndexID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');

    var param = {
        ShowIndexID: ShowIndexID,
        PageSize: 10,
        UID: uid
    };

    var contains = function (items, value) {
        var ret = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].ID == value) {
                ret = true;
                break;
            }
        }
        return ret;
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        param.LastCommentID = this.after;
        console.log(param);
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            if (items != undefined) {
                for (var i = 0; i < items.length; i++) {
                    if (!contains(this.items, items[i].ID)) {
                        if (items[i].YEAR > 0) {
                            items[i].commentTime = items[i].YEAR + '年前';
                        } else {
                            if (items[i].mouth > 0) {
                                items[i].commentTime = items[i].mouth + '月前';
                            } else {
                                if (items[i].DAY > 0) {
                                    items[i].commentTime = items[i].DAY + '天前';
                                } else {
                                    if (items[i].HOUR > 0) {
                                        items[i].commentTime = items[i].HOUR + '小时前';
                                    } else {
                                        if (items[i].min > 0) {
                                            items[i].commentTime = items[i].min + '分钟前';
                                        } else {
                                            items[i].commentTime = items[i].Sec + '秒前';
                                        }
                                    }
                                }
                            }
                        }
                        var CommentLiked = items[i].CommentLiked;
                        if (CommentLiked == 1) {
                            items[i].ShowCommentLike = true;
                        } else {
                            items[i].ShowCommentLike = false;
                        }

                        var LikeCount = items[i].LikeCount;
                        if (LikeCount == 0) {
                            items[i].LikeCount = "赞";
                        }

                        items[i].isanimate = true;


                        this.items.push(items[i]);
                    }
                    this.refresh = false;
                }

                if (items.length > 0) {
                    this.after = this.items[data.Data.length - 1].ID;
                } else {
                    this.after = 0;
                }
            }
        }.bind(this));

        this.busy = false;
    };
    return macco;
}]);

app.controller('shareCommentController', ['$scope', '$http', 'macco', '$window', '$location', '$rootScope', '$interval', '$timeout', function ($scope, $http, macco, $window, $location, $rootScope, $interval, $timeout) {
    $scope.macco = new macco();
    //点赞的动画 
    var zanAnimate = function (item) {
        item.isanimate = !item.isanimate;
        $scope.imgAnimate = "imgAnimate";
        $timeout(
            function () {
                item.isanimate = !item.isanimate;
            }, 500);
    };

    //评论点赞
    var SendLikeProductComment = function (commentID, isLiked) {
        var likeCommenturl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/LikeComment';
        var uid = window.getQueryStringByKey('UID');
        var likeCommentParam = {
            UID: uid,
            ShowCommentID: commentID,
            IsLike: isLiked
        };
        $http.post(likeCommenturl, likeCommentParam).success(function (data) {
        });
    };


    // 点赞事件
    $scope.ZanComment = function (item) {
        item.ShowCommentLike = !item.ShowCommentLike;
        if (item.ShowCommentLike == true) {
            zanAnimate(item);
        }
        var isLiked = 0;
        if (item.ShowCommentLike) {
            if (item.LikeCount == '赞') {
                item.LikeCount = 0;
            }
            item.LikeCount = item.LikeCount * 1 + 1;
            isLiked = 1;
        } else {
            item.LikeCount = item.LikeCount * 1 - 1;
            isLiked = 0;
            if (item.LikeCount == 0) {
                item.LikeCount = '赞';
            }
        }
        SendLikeProductComment(item.ID, isLiked);
    }

}]);




