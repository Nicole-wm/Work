angular.module('FogApp').controller('LoginController', ['$rootScope', '$scope', 'settings','$window','$http','$interval',function($rootScope, $scope, settings,$window,$http,$interval) {
    /************************初始化变量************************/
    $scope.PageNum=1;//登录状态
    $scope.LoginRemeber=false;
    $scope.ForgetEmail="";
    $scope.ForgetPsd="";
    $scope.ForgetRpsd="";
    $scope.ForgetVCode="";

    $scope.RegisterUsername="";
    $scope.RegisterEmail="";
    $scope.RegisterPsd="";
    $scope.RegisterRpsd="";
    $scope.RegisterVCode="";

    var RegParam= {
        username:'',
        identification:'',
        password:'',
        vercode:''
    };

    var FogParam= {
        identification:'',
        newpasswd:'',
        vercode:''
    };

    /************************页面调用方法************************/
    $scope.MenuFun=function(PageNum){/*Fun-切换菜单*/
        $("#LoginFormReset").click();
        $("#ForgetFormReset").click();
        $("#RegisterFormReset").click();
        $scope.PageNum=PageNum;
    }

    $scope.LoginFun = function () {/*Fun-登录*/
        var PageParam={
            identification:$scope.LoginUsername,
            password:$scope.LoginPsd,
            rememberme:$scope.LoginRemeber
        };
        var ValidFlag=ValidateFun(PageParam);
        if(ValidFlag){ 
            var Url = $rootScope.settings.portsPath+'accounts/signin/';
            var Data = PageParam;
            var PostParam = {
                method: 'POST',url:Url,data:Data,headers:{}
            };
            $http(PostParam).success(function(response){
                if(response.meta.code==0){
                    localStorage.token=response.data.token;
                    window.location.href = '#/dashboard.html'; 
                    window.location.reload();
                }else{
                    alert("登录失败！原因："+response.meta.message);
                }
            }).error(function(response, status){
                alert("登录失败！原因："+response.error);
            });
        }else{
            console.log("输入的数据有问题");
        }
    };
    
    function ValidateFun(PageParam){/*Fun-登录验证*/
        if(PageParam.UserName!=""&&PageParam.Password!=""){
            return true;
        }else{
            return false;
        }
    }
    
    $scope.RegisterItem=function(item){/*Fun-注册-验证*/
        if(item==1){//验证用户名
            var Uname=$scope.RegisterUsername;
            var checkReg =/^[A-Za-z0-9_.]*$/;
            if(Uname==""){
                alert("请输入用户名！");
                return false;
            }else if(Uname.length<3||Uname.length>36){
                alert("用户名长度为3-36位,请重新输入！");
                return false;
            }else if(!checkReg.test(Uname)){
                alert("用户名由字母、数字、下划线或点组成,请重新输入！");
                return false;
            }else{
                return true;
            }
        }else if(item==2){//验证邮箱
            var Email=$scope.RegisterEmail;
            var checkReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
            if(Email==""){
                alert("请输入邮箱！");
                return false;
            }else if(!checkReg.test(Email)){
                alert("邮箱格式有误,请重新输入！");
                return false;
            }else{
                return true;
            }
        }else if(item==3){//验证密码
            var Psd1=$scope.RegisterPsd;
            var Psd2=$scope.RegisterRpsd;
            if(Psd1!=""){
                if(Psd1.length<6||Psd1.length>18){
                    alert("密码长度为6-18位,请重新输入！");
                    return false;
                }else if(Psd2!=""){
                    if(Psd1!=Psd2){
                        alert("确认密码输入不一致，请重新输入！");
                        return false;
                    }else{
                        return true;
                    }
                }else if(Psd2==""){
                    alert("请输入确认密码！");
                    return false;
                }
            }else{
                alert("请输入密码！");
                return false;
            }
        }else if(item==4){//验证验证码
            var VCode=$scope.RegisterVCode;
            if(VCode==""){
                alert("请输入验证码！");
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    $scope.RegisterFun=function(){/*Fun-注册-提交*/
        var RegParam= {
            username:$scope.RegisterUsername,
            identification:$scope.RegisterEmail,
            password:$scope.RegisterPsd,
            vercode:$scope.RegisterVCode
        };
        if($scope.RegisterItem(1)){
            if($scope.RegisterItem(2)){
                if($scope.RegisterItem(3)){
                    if($scope.RegisterItem(4)){
                        var Url = $rootScope.settings.portsPath+'accounts/signup/';
                        var Data = RegParam;
                        var PostParam = {
                            method: 'POST',url:Url,data:Data,headers:{}
                        };
                        $http(PostParam).success(function(response){
                            if(response.meta.code==0){
                                alert("注册成功！请登录！");
                                $scope.MenuFun(1);
                            }else{
                                var curCode=response.meta.code;
                                var message="";
                                if(curCode==29010){
                                    message="参数错误";
                                }else if(curCode=29020){
                                    message="验证码错误";
                                }else if(curCode=29021){
                                    message="验证码过期";
                                }else if(curCode=29033){
                                    message="邮箱或手机号码格式错误";
                                }else{
                                }
                                alert("注册失败！原因："+message);
                            }
                        }).error(function(response, status){
                            alert("注册失败！原因："+response.error);
                        });
                    }
                }
            }
        }
    }

    $scope.ForgetItem=function(item){/*Fun-忘记密码-验证*/
        if(item==1){//验证邮箱
            var Email=$scope.ForgetEmail;
            var checkReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
            if(Email==""){
                alert("请输入邮箱！");
            }else if(!checkReg.test(Email)){
                alert("邮箱格式有误,请重新输入！");
            }else{
                return true;
            }
        }else if(item==2){//验证密码
            var Psd1=$scope.ForgetPsd;
            var Psd2=$scope.ForgetRpsd;
            if(Psd1!=""){
                if(Psd1.length<6||Psd1.length>18){
                    alert("密码长度为6-18位,请重新输入！");
                }else if(Psd2!=""){
                    if(Psd1!=Psd2){
                        alert("确认密码输入不一致，请重新输入！");
                    }else{
                        return true;
                    }
                }else{
                }
            }else{
            }
        }else{
        }
    }

    $scope.ForgetFun=function(){/*Fun-忘记密码-确认*/
        var FogParam= {
            identification:$scope.ForgetEmail,
            newpasswd:$scope.ForgetPsd,
            vercode:$scope.ForgetVCode
        };
        if($scope.ForgetItem(1)){
            if($scope.ForgetItem(2)){
                var Url = $rootScope.settings.portsPath+'accounts/password/reset/';
                var Data = FogParam;
                var PostParam = {
                    method: 'PUT',url:Url,data:Data,headers:{}
                };
                $http(PostParam).success(function(response){
                    if(response.meta.code==0){
                        alert("密码重置成功，请登录！");
                        $scope.MenuFun(1);
                    }else{
                        var curCode=response.meta.code;
                        var message="";
                        if(curCode==29010){
                            message="参数错误";
                        }else if(curCode=29020){
                            message="验证码错误";
                        }else if(curCode=29021){
                            message="验证码过期";
                        }else if(curCode=29033){
                            message="邮箱或手机号码格式错误";
                        }else{
                        }
                        alert("密码重置失败！原因："+message);
                    }
                }).error(function(response, status){
                    alert("密码重置失败！原因："+response.error);
                });
            }
        }
    }

    $scope.SendVCode=function(curtype,Curidentification){/*Fun-注册-发送验证码 0为注册验证码，1位重置密码验证码*/
        var Url = $rootScope.settings.portsPath+'accounts/vercode/';
        var Data = {
            identification:Curidentification,
            type:curtype
        };
        var PostParam = {
            method: 'POST',url:Url,data:Data,headers:{}
        };
        $http(PostParam).success(function(response){
            if(response.meta.code==0){
                alert("验证码已发送至邮箱，注意查收！");
            }else{
                alert("验证码发送失败！原因："+response.meta.message);
            }
        }).error(function(response, status){
            alert("验证码发送失败！原因："+response.error);
        });
    } 

    var wait= 60; 
    function time(o) {/*Fun-获取验证码*/
        console.log();
        if (wait == 0) {  
            o.removeAttribute("disabled");           
            o.value="获取验证码"; 
            wait = 60;  
        } else { 
            o.setAttribute("disabled", true);  
            o.value="重新发送(" + wait + ")"; 
            wait--;  
            setTimeout(function() {  
                time(o)  
            },  
            1000)  
        }  
    }  

    $scope.VCBtnFun=function(flag){
        if(flag==1){
            var curFlag=$scope.RegisterItem(2);
            if(curFlag){
                $scope.SendVCode(0,$scope.RegisterEmail); 
                time(document.getElementById("VCBtn1"));
            }
        }else if(flag==2){
            var curFlag=$scope.ForgetItem(1);
            if(curFlag){
                $scope.SendVCode(1,$scope.ForgetEmail); 
                time(document.getElementById("VCBtn2"));
            }
        }else{
        }
    }
}]);