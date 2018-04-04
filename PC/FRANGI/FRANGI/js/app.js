var FrangiApp=angular.module("FrangiApp",['ui.router','oc.lazyLoad']);

FrangiApp.controller('AppController', ['$scope', '$rootScope',function($scope, $rootScope) {
}]);

FrangiApp.controller('FooterController', ['$scope', '$rootScope',function($scope, $rootScope) {
    $scope.PostData=function(){
        var email = $('#footerMail').val();
        function ValFlagFun(email){
            if(!email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)) {   
                alert("邮箱不正确！请重新输入");    
                $("#footerMail").focus();  
                return false
            }else{
                return true
            }
        }  

        if(ValFlagFun(email)){
            $.ajax({
                type: "POST",
                url: "api/subscribe.php",
                data : $('#FormApp').serialize(),
                success: function(msg) {
                    $('#FormApp')[0].reset(); 
                    alert("订阅成功！");
                },
                error:function(xhr,status,statusText){
                    console.log(xhr.status)
                }
            });
        }
    }
}]);
 
FrangiApp.config(["$stateProvider","$urlRouterProvider","$locationProvider",function($stateProvider,$urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise("/"); 
    $stateProvider
    .state("home", {
        url: "/",
        templateUrl: "views/home.html?v=18040301",
        data: {pageTitle:'FRANGI官方网站'},
        controller: "HomeController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'FrangiApp',
                    files: [
                    'css/home.css?v=18040301',
                    'js/controllers/HomeController.js'
                    ] 
                }]);
            }] 
        }
    })
    .state("frangistory", {
        url:"/frangistory",
        templateUrl: "views/frangistory.html",
        data: {pageTitle:'品牌故事'}
    })
    .state("shop", {
        url:"/shop",
        templateUrl: "views/shop.html",
        data: {pageTitle:'线下门店'}
    })
    .state("awards", {
        url:"/awards",
        templateUrl: "views/awards.html?v=18040302",
        data: {pageTitle:'国际设计'}
    })
    .state("top", {
        url:"/top",
        templateUrl: "views/top.html",
        data: {pageTitle:'明星产品'}
    })
    .state('productcategories', {
        url: "/product_categories?ID",
        templateUrl: "views/product_categories.html",
        data: {pageTitle: '产品系列'},
        controller: "ProductCategoriesController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'FrangiApp',
                    files: [
                    'css/product_categories.css',
                    'js/controllers/ProductCategoriesController.js'
                    ] 
                }]);
            }] 
        }
    })
    .state('product', {
        url: "/product?ID",
        templateUrl: "views/product.html",
        data: {pageTitle: '产品详情'},
        controller: "ProductController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'FrangiApp',
                    files: [
                    'css/product.css',
                    'js/controllers/ProductController.js'
                    ] 
                }]);
            }] 
        }
    })
    .state("404", {
        url:"/404",
        templateUrl: "404.html",
        data: {pageTitle:'404'}
    })
    $locationProvider.html5Mode(true);
}]);

FrangiApp.run(["$rootScope","$state",function($rootScope,$state) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {  
    })  

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) { 
        $('html,body').scrollTop(0);
    })  

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    }) 
}]);
