/// <reference path="../../../typings/angularjs/angular.d.ts"/>

var phonecatApp = angular.module('maccoApp',['infinite-scroll'], function ($httpProvider, $locationProvider) {
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


phonecatApp.controller('ProductListCtrl', function ($scope, $http,macco,$location, $rootScope,$interval) {
  $scope.macco = new macco();
  var tryMakeupID = window.getQueryStringByKey('ID');
  var uid = window.getQueryStringByKey('UID');
  var imageGUID = window.getQueryStringByKey('ImageGuid');
  var platform = window.getQueryStringByKey('platform');

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
      window.location.href = "http://" + window.location.hostname + '/Web/Product/product.html?ID=' + productID;
    }
  };


  if (imageGUID != null) {
    var imageAddr = "http://" + window.hostname + '/MeiDeNi/MakeupEffectWall/GetImageUrl';
    var param = {
      ImageGuid: imageGUID
    };

    $http.post(imageAddr, param).success(function (data) {
      if (data.IsSuccess) {
        if (data.Data.length > 0) {
          $scope.ImageUrl = data.Data[0].ImageUrl;
          $scope.HasImage = true;
        } else {
          $scope.HasImage = false;
        }
      }
    });
  }

  var param = {
    TryMakeupID: tryMakeupID
  };
  var url1 = "http://" + window.hostname + '/MeiDeNi/TryMakeup/FetchTryMakeupProduct';
  var url2 = "http://" + window.hostname + '/MeiDeNi/TryMakeup/FetchAdminMakupDetail';
  $http.post(url1, param).success(function (data) {
    if (data.IsSuccess) {
      $scope.Products = data.Data;
    }
  });

  $http.post(url2, param).success(function (data) {
    if (data.IsSuccess) {
      $scope.Name = data.Data.Name;
    }
  });

  $scope.domain = 'api.5imakeup.com';
  $rootScope.$on('loading:finish', function () {
    var platform = window.getQueryStringByKey('platform');
    window.setTimeout(function(){
     if (platform == 'iOS') {
      if (window.webkit) {
        window.webkit.messageHandlers.EndLoading.postMessage("true");
      } else {
        window.location.href = "macco://EndLoading/";
      }
    } else if (platform == 'Android') {
      var src = document.getElementById('mask').src;
      window.demo.loadMaskImageUrl(src)
      window.demo.endLoading();  
    }
  },1000);
  });
});

phonecatApp.controller('ProductStepCtrl', function ($scope,$http,$rootScope) {
  var tryMakeupID = window.getQueryStringByKey('ID');
  var param = {
    TryMakeupID: tryMakeupID
  };
  var url1 = "http://" + window.hostname + '/MeiDeNi/TryMakeup/FetchTryMakeupProduct';
  $http.post(url1, param).success(function (data) {
    var step=$scope.productQuery;
    for(i=0;i<data.Data.length;i++){
      if (data.Data[i].CourseStep==step) {
        $scope.Product= data.Data[i];
        if(data.Data[i].Rank>5){
          var rank = 5;
        }else if(data.Data[i].Rank<0){
          var rank = 0;
        }else{
          var rank = data.Data[i].Rank;
        }
        var rankInt = parseInt(rank);
        var halfStarCount =0;
        var rank_c =rank-rankInt;
        if(rank_c==0.5){
           var halfStarCount =1;
        }else if(rank_c>0.5){
           rankInt=rankInt+1;
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
        $scope.FullStars = fullStars;
        $scope.HalfStars = halfStars;
        $scope.EmptyStars = emptyStars;
      }
    }
  });
});
