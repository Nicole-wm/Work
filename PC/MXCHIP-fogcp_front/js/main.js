
var FogApp = angular.module("FogApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "pascalprecht.translate"
    ]); 

FogApp.config(['$translateProvider', function ($translateProvider) {
    var lang = window.localStorage.lang||'zh-cn';
    $translateProvider.preferredLanguage(lang);
    $translateProvider.useStaticFilesLoader({
        prefix: '../i18n/',
        suffix: '.json'
    });
}]);

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

FogApp.controller('AppController', ['$scope', '$rootScope','$translate','$http',function($scope, $rootScope,$translate,$http) {
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); 
    });

    $rootScope.IsLoginFlag=true;

    $scope.switching = function(lang){
        $translate.use(lang);
        window.localStorage.lang = lang;
        window.location.reload();
    };
    $scope.cur_lang = $translate.use();
}]);

/* Setup Layout Part - Header */
FogApp.controller('HeaderController', ['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    if(localStorage.token){
        var GetInfoFun=function(){
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
FogApp.controller('SidebarController', ['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });

    if(localStorage.token){
        var GetListFun=function(){
            var Url = $rootScope.settings.portsPath+'business/list/';
            var Data = '';
            var PostParam = {
                method: 'GET',url:Url,data:Data,headers:{'AUTHORIZATION': "Token " + localStorage.token}
            };
            $http(PostParam).success(function(response){
                if(response.meta.code==0){
                    $scope.OpensService = response.data.opens;
                    for(var i=0;i<$scope.OpensService.length;i++){
                        if($scope.OpensService[i].ischecked){
                            var curService=$scope.OpensService[i].business.name;
                            if(curService=="CP"){
                                $rootScope.settings.role.cpOpen=true;
                                $rootScope.settings.layout.pageSidebarClosed = false;
                            }else if(curService=="IP"){
                                $rootScope.settings.role.ipOpen=true;
                                $rootScope.settings.layout.pageSidebarClosed = false;
                            }else if(curService=="OTA"){
                                $rootScope.settings.role.otaOpen=true;
                                $rootScope.settings.layout.pageSidebarClosed = false;
                            }else{
                            }
                        }else{
                        }
                    }
                }else{
                    CurErrorMessage=checkCode.showResult(response.meta.code,response.meta.message);
                    Common.alert({
                        message:"获取业务信息信息失败！原因："+CurErrorMessage,
                        operate: function (reselt) {  
                        }
                    })
                }
            }).error(function(response, status){
                console.log(response.error);
            });
        }
        GetListFun();
    }
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
FogApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/signin"); 
    $stateProvider
        // signin(登录)
        .state('signin', {
            url: '/signin',
            data: {pageTitle: '登录',pageSubTitle:'登录'},
        })
        // guide(产品智能中心)
        .state('guide', {
            url: "/guide.html",
            templateUrl: "views/guide.html",            
            data: {pageTitle: '引导',pageSubTitle:'智能中心'},
            controller: "GuideController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/GuideController.js',
                        ] 
                    });
                }]
            }
        })
        // Dashboard(产品智能中心)
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: '产品智能中心',pageSubTitle:'产品智能中心'},
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
        // ProductList（产品列表）
        .state('productlist', {
            url: "/product/product_list.html?type=?",
            templateUrl: "views/product/product_list.html?type=?",
            data: {pageTitle: '产品管理',pageSubTitle:'产品列表'},
            controller: "ProductListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',

                        'js/controllers/product/ProductListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // ProductAdd（添加产品）
        .state('productadd', {
            url: "/product/product_add.html",
            templateUrl: "views/product/product_add.html",
            data: {pageTitle: '产品管理',pageSubTitle:'添加产品'},
            controller: "ProductAddController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/plugins/jquery-file-upload/css/jquery.fileupload.css',

                        'js/controllers/product/ProductAddController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // ProductAddRead（产品添加说明）
        .state('productaddread', {
            url: "/product/product_add_read.html",
            templateUrl: "views/product/product_add_read.html",
            data: {pageTitle: '产品管理',pageSubTitle:'产品添加说明'},
        })
        // productdetails（产品信息）
        .state('productdetails', {
            url: "/product/product_details.html",
            templateUrl: "views/product/product_details.html",
            data: {pageTitle: '产品管理',pageSubTitle:'产品详情'},
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
                        '../assets/global/css/inbox.css',
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/product/ProductDetailsController.js',
                        'js/controllers/product/ProductDetailsBaseController.js',
                        'js/controllers/product/ProductDetailsInfoController.js',
                        'js/controllers/product/ProductDetailsAttributeController.js',
                        'js/controllers/product/ProductDetailsInteractiveController.js',
                        'js/controllers/ota/OTAListController.js',
                        'js/controllers/product/ProductDetailsTemplateController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // ProductValidation（产品验证）
        .state('productvalidationguide', {
            url: "/product/product_validationguide.html?type=?",
            templateUrl: "views/product/product_validationguide.html?type=?",
            data: {pageTitle: '产品管理',pageSubTitle:'产品验证'},
            controller: "ProductValidationGuideController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/debug.css',
                        'js/controllers/product/ProductValidationGuideController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // ProductValidation（产品验证）
        .state('productvalidation', {
            url: "/product/product_validation.html?type=?",
            templateUrl: "views/product/product_validation.html?type=?",
            data: {pageTitle: '产品管理',pageSubTitle:'产品验证'},
            controller: "ProductValidationController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/scripts/qrcode.js',
                        '../assets/pages/scripts/mqttws31.js',

                        'js/controllers/product/ProductValidationController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // ProductCount(产品统计)
        .state('productcount', {
            url: "/product/product_count.html?type=?",
            templateUrl: "views/product/product_count.html?type=?",            
            data: {pageTitle: '产品统计',pageSubTitle:'产品统计'},
            controller: "ProductCountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/product/ProductCountController.js',
                        ] 
                    });
                }]
            }
        })
        // AppList（应用列表）
        .state('applist', {
            url: "/app/app_list.html",
            templateUrl: "views/app/app_list.html",
            data: {pageTitle: '应用管理',pageSubTitle:'应用列表'},
            controller: "AppListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/app/AppListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // AppAdd（应用详情）
        .state('appadd', {
            url: "/app/app_add.html",
            templateUrl: "views/app/app_add.html",
            data: {pageTitle: '应用管理',pageSubTitle:'添加产品'},
            controller: "AppAddController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/app/AppAddController.js'
                        ] 
                    }]);
                }] 
            }
        })
         // AppDetails（应用详情）
         .state('appdetails', {
            url: "/app/app_details.html",
            templateUrl: "views/app/app_details.html",
            data: {pageTitle: '应用管理',pageSubTitle:'应用详情'},
            controller: "AppDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                        '../assets/global/css/inbox.css',

                        'js/controllers/app/AppDetailsController.js',
                        'js/controllers/app/AppDetailsBaseController.js',
                        'js/controllers/app/AppDetailsBindingController.js',
                        'js/controllers/app/SelectProductController.js',
                        'js/controllers/app/AppDetailsFunController.js',
                        'js/controllers/app/AppDetailsWeChatController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // AppCount(应用统计)
        .state('appcount', {
            url: "/app/app_count.html",
            templateUrl: "views/app/app_count.html",            
            data: {pageTitle: '应用统计',pageSubTitle:'应用统计'},
            controller: "AppCountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/app/AppCountController.js',
                        ] 
                    });
                }]
            }
        })
        // OTAList（OTA列表）
        .state('otalist', {
            url: "/ota/ota_list.html",
            templateUrl: "views/ota/ota_list.html",
            data: {pageTitle: 'OTA管理',pageSubTitle:'OTA列表'},
            controller: "OTAListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/ota/OTAListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // OTADetails（OTA详情）
        .state('otadetails', {
            url: "/ota/ota_details.html",
            templateUrl: "views/ota/ota_details.html",
            data: {pageTitle: 'OTA管理',pageSubTitle:'OTA信息'},
            controller: "OTADetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/ota/OTADetailsController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // TaskList（Task列表）
        .state('tasklist', {
            url: "/ota/task_list.html",
            templateUrl: "views/ota/task_list.html",
            data: {pageTitle: 'OTA管理',pageSubTitle:'任务列表'},
            controller: "TaskListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/ota/TaskListController.js'
                        ] 
                    }]);
                }]  
            }
        })
        // TaskDetails（Task详情）
        .state('taskdetails', {
            url: "/ota/task_details.html?type=?",
            templateUrl: "views/ota/task_details.html?type=?",
            data: {pageTitle: 'OTA管理',pageSubTitle:'任务信息'},
            controller: "TaskDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        'js/controllers/ota/TaskDetailsController.js',
                        'js/controllers/ota/SelectOTAController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // TasksList（Task列表）
        .state('taskslist', {
            url: "/ota/tasks_list.html?type=?",
            templateUrl: "views/ota/tasks_list.html?type=?",
            data: {pageTitle: 'OTA管理',pageSubTitle:'任务列表'},
            controller: "TasksListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/ota/TasksListController.js'
                        ] 
                    }]);
                }]  
            }
        })
        // TaskPush（Task推送）
        .state('taskpush', {
            url: "/ota/task_push.html?type=?",
            templateUrl: "views/ota/task_push.html?type=?",
            data: {pageTitle: 'OTA管理',pageSubTitle:'任务推送'},
            controller: "TaskPushController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/ota/TaskPushController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // LogList（Task列表）
        .state('loglist', {
            url: "/ota/log_list.html?type=?",
            templateUrl: "views/ota/log_list.html?type=?",
            data: {pageTitle: 'OTA管理',pageSubTitle:'日志列表'},
            controller: "LogListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/ota/LogListController.js'
                        ] 
                    }]);
                }]  
            }
        })
        .state('devicelist', {
            url: "/device/device_list.html",
            templateUrl: "views/device/device_list.html",
            data: {pageTitle: '设备管理',pageSubTitle:'设备列表'},
            controller: "DeviceListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/device/DeviceListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // DeviceDetails（设备详情）
        .state('devicedetails', {
            url: "/device/device_details.html",
            templateUrl: "views/device/device_details.html",
            data: {pageTitle: '设备管理',pageSubTitle:'设备信息'},
            controller: "DeviceDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/device/DeviceDetailsController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // DeviceCount(设备统计)
        .state('devicecount', {
            url: "/device/device_count.html",
            templateUrl: "views/device/device_count.html",            
            data: {pageTitle: '设备统计',pageSubTitle:'设备统计'},
            controller: "DeviceCountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/device/DeviceCountController.js',
                        ] 
                    });
                }]
            }
        })
        // UserList（用户列表）
        .state('userlist', {
            url: "/user/user_list.html",
            templateUrl: "views/user/user_list.html",
            data: {pageTitle: '用户管理',pageSubTitle:'用户列表'},
            controller: "UserListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/user/UserListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // UserCount(设备统计)
        .state('usercount', {
            url: "/user/user_count.html",
            templateUrl: "views/user/user_count.html",            
            data: {pageTitle: '用户统计',pageSubTitle:'用户统计'},
            controller: "UserCountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        'js/controllers/user/UserCountController.js',
                        ] 
                    });
                }]
            }
        })
        // CookBookList（食谱列表）
        .state('cookbooklist', {
            url: "/cookbook/cookbook_list.html",
            templateUrl: "views/cookbook/cookbook_list.html",
            data: {pageTitle: '食谱管理',pageSubTitle:'食谱列表'},
            controller: "CookBookListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/cookbook/CookBookListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        //CookBookAdd（添加食谱）
        .state('cookbookadd', {
            url: "/cookbook/cookbook_add.html",
            templateUrl: "views/cookbook/cookbook_add.html",
            data: {pageTitle: '食谱管理',pageSubTitle:'添加食谱'},
            controller: "CookBookAddController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/cookbook/CookBookAddController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // CookBookDetails（食谱列表）
        .state('cookbookdetails', {
            url: "/cookbook/cookbook_details.html",
            templateUrl: "views/cookbook/cookbook_details.html",
            data: {pageTitle: '食谱管理',pageSubTitle:'食谱信息'},
            controller: "CookBookDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                        'js/controllers/cookbook/CookBookDetailsController.js',
                        'js/controllers/cookbook/CookBookDetailsBaseController.js',
                        'js/controllers/cookbook/CookBookDetailsFormulaController.js',
                        'js/controllers/cookbook/CookBookDetailsStepsController.js',
                        'js/controllers/cookbook/CookBookDetailsControlController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // cookbookCount(设备统计)
        .state('cookbookcount', {
            url: "/cookbook/cookbook_count.html",
            templateUrl: "views/cookbook/cookbook_count.html",            
            data: {pageTitle: '食谱统计',pageSubTitle:'食谱统计'},
            controller: "CookBookCountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        'js/controllers/cookbook/CookBookCountController.js',
                        ] 
                    }]);
                }]
            }
        })
        //Center
        //Profile(账号管理)
        .state('profile', {
            url: "/center/profile.html",
            templateUrl: "views/center/profile.html",            
            data: {pageTitle: '账号管理',pageSubTitle:'账号管理'},
            controller: "ProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                        '../assets/global/css/inbox.css',

                        'js/controllers/center/ProfileController.js',
                        'js/controllers/center/BaseInfoController.js',
                        'js/controllers/center/SecureController.js',
                        'js/controllers/center/CompanyController.js',
                        'js/controllers/center/TeamController.js',
                        'js/controllers/center/OpenServiceController.js'
                        ] 
                    });
                }]
            }
        })
        //account(财务中心)
        .state('account', {
            url: "/account/account.html",
            templateUrl: "views/account/account.html",            
            data: {pageTitle: '财务中心',pageSubTitle:'财务中心'},
            controller: "AccountController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'FogApp',
                        files: [
                        '../assets/global/css/inbox.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                        'js/controllers/account/AccountController.js',
                        'js/controllers/account/MyaccountController.js',
                        'js/controllers/account/RechargeController.js',
                        'js/controllers/account/BillController.js',
                        'js/controllers/account/DealrecordController.js',
                        'js/controllers/account/InvoiceController.js',
                        'js/controllers/account/RefundController.js'
                        ] 
                    });
                }]
            }
        })

        // lora-app
        .state('loraapplist', {
            url: "/lora/application/app_list.html",
            templateUrl: "views/lora/application/app_list.html",
            data: {pageTitle: '应用管理',pageSubTitle:'我的应用'},
            controller: "AppListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/lora/application/AppListController.js',
                        ] 
                    }]);
                }] 
            }
        })
        // lora-appdetails
        .state('loraappdetails', {
            url: "/lora/application/app_details.html",
            templateUrl: "views/lora/application/app_details.html",
            data: {pageTitle: '应用管理',pageSubTitle:'应用详情'},
            controller: "AppDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/css/inbox.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                        'js/controllers/lora/application/AppDetailsController.js',
                        'js/controllers/lora/application/AppDetailsBaseController.js',
                        'js/controllers/lora/application/AppDetailsGroupController.js',
                        'js/controllers/lora/application/AppDetailsLogController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // lora-gat
        .state('loragatlist', {
            url: "/lora/gateway/gat_list.html",
            templateUrl: "views/lora/gateway/gat_list.html",
            data: {pageTitle: '网关管理',pageSubTitle:'我的网关'},
            controller: "GatListController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/pages/css/search.css',
                        
                        'js/controllers/lora/gateway/GatListController.js'
                        ] 
                    }]);
                }] 
            }
        })
        // lora-appdetails
        .state('loragatdetails', {
            url: "/lora/gateway/gat_details.html",
            templateUrl: "views/lora/gateway/gat_details.html",
            data: {pageTitle: '网关管理',pageSubTitle:'网关详情'},
            controller: "GatDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'FogApp',
                        files: [
                        '../assets/global/css/inbox.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                        'js/controllers/lora/gateway/GatDetailsController.js',
                        'js/controllers/lora/gateway/GatDetailsBaseController.js',
                        'js/controllers/lora/gateway/GatDetailsConfController.js',
                        'js/controllers/lora/gateway/GatDetailsCountController.js',
                        'js/controllers/lora/gateway/GatDetailsDatamsgController.js',
                        'js/controllers/lora/gateway/GatDetailsLogController.js'
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
                $location.url('/guide.html').replace(); 
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