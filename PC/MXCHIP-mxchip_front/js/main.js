
var FogApp = angular.module("FogApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
    ]); 

FogApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({

    });
}]);

FogApp.config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);

/* Setup global settings */
FogApp.factory('settings', ['$rootScope', function($rootScope) {
    var envConfig = function() {
        var currentEnv = window.location.hostname;
        if(currentEnv == "fogcloud.io") { 
            CurInter = 'https://api.fogcloud.io/';
        } else if(currentEnv == 'v3test.fogcloud.io') {
            CurInter = 'https://v3testapi.fogcloud.io/';
        } else if(currentEnv == 'v3seal.fogcloud.io') {
            CurInter = 'https://v3sealapi.fogcloud.io/';
        } else {
            CurInter = 'https://v3devapi.fogcloud.io/';
        }
    }
    envConfig();

    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        role: {
            cpOpen: false, 
            ipOpen: false, 
            otaOpen: false 
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layout',
        portsPath: CurInter+'v3/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

FogApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); 
    });

    $rootScope.IsLoginFlag=true;
}]);

/* Setup Layout Part - Header */
FogApp.controller('HeaderController', ['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    
    if(localStorage.token){
        var GetInfoFun=function(param){
            var Url = $rootScope.settings.portsPath+'accounts/info/';
            var Data = '';
            var PostParam = {
                method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
            };
            $http(PostParam).success(function(response){
                if(response.meta.code==0){
                    CurUser=response.data;
                    $scope.UserName=CurUser.user.username;
                    $scope.ImageUrl=CurUser.headimage;
                }else{
                    CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                    Common.alert({
                        message:"获取用户信息失败！原因："+CurErrorMessage,
                        operate: function (reselt) {  
                        }
                    })
                }
            }).error(function(response, status){
                console.log(response.error);
            });
        }

        GetInfoFun();

        $scope.LogOut=function(){
            var Url = $rootScope.settings.portsPath+'accounts/signout/';
            var Data = "";
            var PostParam = {
                method: 'POST',url:Url,data:Data,headers:{'Authorization': "token " + localStorage.token}
            };

            Common.confirm({
                title: "注销",
                message: "确认注销？",
                operate: function (reselt) {
                    if (reselt) {
                        $http(PostParam).success(function(response){
                            if(response.meta.code==0){
                                localStorage.clear();
                                Common.alert({
                                    message: "注销成功！",
                                    operate: function (reselt) {   
                                        window.location.href = '#/signin';
                                    }
                                })
                            }else{
                                CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                                Common.alert({
                                    message:"注销失败！原因："+CurErrorMessage,
                                    operate: function (reselt) {  
                                    }
                                })
                            }
                        }).error(function(response, status){
                            Common.alert({
                                message: "注销失败！原因："+response.error,
                                operate: function (reselt) {    
                                }
                            })
                        });
                    } else {
                    }
                }
            })
        }
    }else{
        $rootScope.IsLoginFlag=false;
        window.location.href="#/signin";
    }
    
}]);

/* Setup Layout Part - Sidebar */
FogApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
FogApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Theme Panel */
FogApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
FogApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
FogApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/signin"); 
    
    $stateProvider
        .state('signin', {
            url: '/signin',
            data: {pageTitle: '登录',pageSubTitle:'登录'},
        })

        // Dashboard(智能中心)
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Fog后台管理中心',pageSubTitle:'管理中心'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })
        // CustomerList（客户列表）
        .state('customerlist', {
            url: "/customer/customer_list.html",
            templateUrl: "views/customer/customer_list.html",
            data: {pageTitle: '客户管理',pageSubTitle:'客户列表'},
            controller: "CustomerListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/customer/CustomerListController.js',
                        ] 
                    }]);
                }] 
            }
        })

         // CustomerDetails（客户详情）
         .state('customerdetails', {
            url: "/customer/customer_details.html",
            templateUrl: "views/customer/customer_details.html",
            data: {pageTitle: '客户管理',pageSubTitle:'客户详情'},
            controller: "CustomerDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/customer/CustomerDetailsController.js',
                        ] 
                    }]);
                }] 
            }
        })

        // ProductList（产品列表）
        .state('productlist', {
            url: "/customer/product_list.html",
            templateUrl: "views/customer/product_list.html",
            data: {pageTitle: '客户管理',pageSubTitle:'产品列表'},
            controller: "ProductListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/customer/ProductListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // ProductDetails（产品详情）
        .state('productdetails', {
            url: "/customer/product_details.html",
            templateUrl: "views/customer/product_details.html",
            data: {pageTitle: '客户管理',pageSubTitle:'产品详情'},
            controller: "ProductDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [  
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',

                        'js/controllers/customer/ProductDetailsController.js',
                        'js/controllers/customer/ProductDetailsBaseController.js',
                        'js/controllers/customer/ProductDetailsAttributeController.js',
                        'js/controllers/customer/ProductDetailsInteractiveController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // AppList（应用列表）
        .state('applist', {
            url: "/customer/app_list.html",
            templateUrl: "views/customer/app_list.html",
            data: {pageTitle: '客户管理',pageSubTitle:'应用列表'},
            controller: "AppListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/customer/AppListController.js',
                        ] 
                    }]);
                }] 
            }
        })
         // AppDetails（应用详情）
         .state('appdetails', {
            url: "/customer/app_details.html",
            templateUrl: "views/customer/app_details.html",
            data: {pageTitle: '客户管理',pageSubTitle:'应用详情'},
            controller: "AppDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/customer/AppDetailsController.js',
                        ] 
                    }]);
                }] 
            }
        })

        // CustomerList（客户认证列表）
        .state('authcustomerlist', {
            url: "/authentication/customer_list.html",
            templateUrl: "views/authentication/customer_list.html",
            data: {pageTitle: '认证管理',pageSubTitle:'客户认证列表'},
            controller: "AuthCustomerListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/authentication/AuthCustomerListController.js',
                        ] 
                    }]);
                }] 
            }
        })

         // CustomerDetails（客户认证详情）
         .state('authcustomerdetails', {
            url: "/authentication/customer_details.html",
            templateUrl: "views/authentication/customer_details.html",
            data: {pageTitle: '认证管理',pageSubTitle:'客户认证详情'},
            controller: "AuthCustomerDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/authentication/AuthCustomerDetailsController.js',
                        ] 
                    }]);
                }] 
            }
        })

        // ProductList（产品认证列表）
        .state('authproductlist', {
            url: "/authentication/product_list.html",
            templateUrl: "views/authentication/product_list.html",
            data: {pageTitle: '认证管理',pageSubTitle:'产品认证列表'},
            controller: "AuthProductListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/authentication/AuthProductListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // ProductDetails（产品认证详情）
        .state('authproductdetails', {
            url: "/authentication/product_details.html",
            templateUrl: "views/authentication/product_details.html",
            data: {pageTitle: '认证管理',pageSubTitle:'产品认证详情'},
            controller: "AuthProductDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [  
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',

                        'js/controllers/authentication/AuthProductDetailsController.js',
                        'js/controllers/authentication/AuthProductDetailsBaseController.js',
                        'js/controllers/authentication/AuthProductDetailsAttributeController.js',
                        'js/controllers/authentication/AuthProductDetailsInteractiveController.js'
                        ] 
                    }]);
                }] 
            }
        })
     }]);

FogApp.run(["$rootScope", "settings", "$state","$location", function($rootScope, settings, $state,$location) {
    $rootScope.$state = $state; 
    $rootScope.$settings = settings;

    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
    })  

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {  
        var Hash= toState.name;
        var token=localStorage.token;

        if(token){
            if(Hash=="signin"){
                $rootScope.IsLoginFlag=true;
                $location.url('/dashboard.html').replace(); 
            }else{
                $rootScope.IsLoginFlag=true;
            }
        }else{
            localStorage.clear();
            $rootScope.IsLoginFlag=false; 
            $location.url('/signin').replace();                       
        }
    })  

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        localStorage.clear();      
        $rootScope.IsLoginFlag=false;
        $location.url('/signin').replace();  
    })  
}]);