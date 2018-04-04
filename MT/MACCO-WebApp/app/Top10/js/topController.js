var phonecatApp = angular.module('maccoApp',[], ['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
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
phonecatApp.factory('httpInterceptor', ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
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

phonecatApp.controller('topController', ['$scope', '$http', '$location', '$rootScope', '$interval', function ($scope, $http, $location, $rootScope, $interval) {
    var topicID = window.getQueryStringByKey('TopicID');
    var topicDetailUrl = "http://" + window.hostname + '/MeiDeNi/Product/FetchTopProductDetailPage';
    var param = {
        TopProudctTopicID: topicID
    };

    $http.post(topicDetailUrl, param).success(function (data) {
        if (data.IsSuccess) {
            console.dir(data);
            $scope.Title = data.Data.Title;
            $scope.Description = data.Data.Description;
            $scope.TitleImage = data.Data.TitleImage;
            $scope.Details = data.Data.Details;
            for (var i = 0; i < data.Data.Details.length; i++) {
                if (data.Data.Details[i].Rank > 5) {
                    var rank = 5;
                } else if (data.Data.Details[i].Rank < 0) {
                    var rank = 0;
                } else {
                    var rank = data.Data.Details[i].Rank;
                }
                var rankInt = parseInt(rank);
                var halfStarCount = 0;
                var rank_c = rank - rankInt;
                if (rank_c == 0.5) {
                    var halfStarCount = 1;
                } else if (rank_c > 0.5) {
                    rankInt = rankInt + 1;
                }
                var emptyStarCount = 5 - rankInt - halfStarCount;
                var fullStars = [];
                var halfStars = [];
                var emptyStars = [];
                for (var q = 0; q < rankInt; q++) {
                    fullStars.push(q);
                }
                for (var j = 0; j < halfStarCount; j++) {
                    halfStars.push(j);
                }
                for (var k = 0; k < emptyStarCount; k++) {
                    emptyStars.push(k);
                }
                $scope.Details[i].FullStars = fullStars;
                $scope.Details[i].HalfStars = halfStars;
                $scope.Details[i].EmptyStars = emptyStars;
                /*
                  var rank = data.Data.Details[i].Rank*1;
                  if(rank == 0) {
                    $scope.Details[i].FullStars = [];
                    $scope.Details[i].HalfStars = [];
                    $scope.Details[i].EmptyStars = [1,2,3,4,5];
                  } else {
                    var fullRank = Math.floor(rank);
                    if(rank - fullRank == 0) {
                      $scope.Details[i].HalfStars = [];
                      $scope.Details[i].FullStars = [];
                      $scope.Details[i].EmptyStars = [];
                      for(var j=0;j<fullRank;j++) {
                        $scope.Details[i].FullStars.push(1);
                      }
                      for(var j=0;j<5-fullRank ;j++) {
                        $scope.Details[i].EmptyStars.push(1);
                      }
                    } else {
                      $scope.Details[i].HalfStars = [1];
                      $scope.Details[i].FullStars = [];
                      $scope.Details[i].EmptyStars = [];
                      for(var j=0;j<fullRank;j++) {
                        $scope.Details[i].FullStars.push(1);
                      }
                      for(var j=0;j<5-fullRank-1;j++) {
                        $scope.Details[i].EmptyStars.push(1);
                      }
                    }
                }*/
            }
        }
    });

    $scope.redirectFunc = 'redirect';
    $scope.redirect = function (productID) {
        if (platform != null && platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.pushToProduction.postMessage(productID);
            } else {
                window.location.href = "macco://RedirectProduct/" + productID;
            }
        } else if (platform != null && platform == 'Android') {
            window.demo.gotoProduction(productID);
        } else {
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
        }
    };

    var platform = window.getQueryStringByKey('platform');
    if (platform == 'iOS') {
        if (window.webkit) {
            window.webkit.messageHandlers.EndLoading.postMessage("true");
        } else {
            window.location.href = "macco://EndLoading/";
        }
    } else if (platform == 'Android') {
        window.demo.endLoading();
    }
    var share = window.getQueryStringByKey('share');
    if (share == 'no') {
        $scope.IsShowFooter = false;
    } else {
        $scope.IsShowFooter = true;
    }
    $scope.download = function () {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
    };
}]);

function GetDesc() {
    return $("#descText").text();
}