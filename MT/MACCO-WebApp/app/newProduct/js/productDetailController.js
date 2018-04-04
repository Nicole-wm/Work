/// <reference path="../../../typings/angularjs/angular.d.ts"/>
//var phonecatApp = angular.module('maccoApp', []);

var phonecatApp = angular.module('maccoApp', ['infinite-scroll'], function ($httpProvider, $locationProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
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

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function (data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

phonecatApp.factory('httpInterceptor', function ($q, $rootScope, $log) {
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
}).config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});

phonecatApp.directive('macco-imageLoader', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('load', function () {

      });
    }
  };
});

phonecatApp.controller('productDetailController', function ($scope, $http, $location, $rootScope) {
  var productID = window.getQueryStringByKey('ID');
  var param = {
    ProductID: productID
  };
  
  var productDetailUrl = "http://" +  window.hostname + '/MeiDeNi/Product/FetchProductDetailPage';
  $http.post(productDetailUrl,param).success(function(data){
    if (data.IsSuccess) {
      $scope.Product = data.Data;
        // 星星和人数
        var rank = data.Data.Rank;
        var rankInt = parseInt(rank);
        var halfStarCount = rank - rankInt == 0.5 ? 1 : 0;
        var emptyStarCount = 5 - rank - halfStarCount;
        var fullStars = [];
        var halfStars = [];
        var emptyStars = [];
        for(var i=0;i<rankInt;i++) {
          fullStars.push(i); 
        }
        
        for(var j=0;j<halfStarCount;j++) {
          halfStars.push(j);
        }
        for(var k=0;k<emptyStarCount;k++) {
          emptyStars.push(k); 
        }
        
        $scope.FullStars = fullStars;
        $scope.HalfStars = halfStars;
        $scope.EmptyStars = emptyStars;
        
        $scope.RankPercent = '(' + data.Data.RankPercent + '%人点赞)';
      }
    });


  // $rootScope.$on('loading:finish', function () { 
  //   var platform = getQueryStringByKey('platform');
  //   if (platform == 'iOS') {
  //     if (window.webkit) {
  //       window.webkit.messageHandlers.EndLoading.postMessage("true");
  //     } else {
  //       window.location.href = "macco://EndLoading/";
  //     }
  //   } else if (platform == 'Android') {
  //       window.demo.endLoading();
  //   }
  // });
  
});

$(document).ready(function () {
  var objTop=0;
  var platform = window.getQueryStringByKey('platform');
  if (platform == 'iOS') {
    objTop="20px";
    $(".top").css("padding-top",objTop);
    $(".p_content").css("padding-top",objTop);
  }
  $("#back").click(function(){
    var platform = window.getQueryStringByKey('platform');
    if (platform == 'iOS') {
      console.log("iOS");
      window.webkit.messageHandlers.Back.postMessage("");
    } else if (platform == 'Android') {
      console.log("Android");
      window.demo.finishActivity();
    }
  });
});