// 环境变量配置函数
var envConfig = function() {
    var currentEnv = window.location.hostname;
    if(currentEnv == "admin.imacco.me") {  
      window.$Token = false;
      window.$servie = 'http://publish.imacco.me/';
      window.$ProductionService = 'http://publish.imacco.com/';
      window.$AppApiService =  'http://v3.imacco.com/';
      window.$apiKey = '3751dec1e1d3109f028a85683fb8da02';
      window.$isTest = false;
    } else if(currentEnv == 'admin.5imakeup.me') {
      window.$Token = false;
      window.$servie = 'http://publish.5imakeup.me/';
      window.$ProductionService = 'http://publishTest.5imakeup.me/';
      window.$AppApiService =  'http://v3.imacco.com/';
      window.$apiKey = '3751dec1e1d3109f028a85683fb8da02';
      window.$isTest = false;
    } else if(currentEnv == 'admin.5imakeup.com') { // public dev env
        window.$Token = false;
        window.$servie = 'http://adminapi.5imakeup.com/';
        window.$ProductionService = 'http://publish.5imakeup.com/';
        window.$AppApiService =  'http://api.5imakeup.com/';
        window.$apiKey = '3751dec1e1d3109f028a85683fb8da02';
        window.$isTest = false;
    } else if(currentEnv == 'mup006.com') { // dev env for lokie
        window.$Token = false;
        window.$servie = 'http://adminapi.5imakeup.com/';
        window.$ProductionService = 'http://publish.5imakeup.com/';
        window.$AppApiService =  'http://api.5imakeup.com/';
        window.$apiKey = '3751dec1e1d3109f028a85683fb8da02';
        window.$isTest = false;
    } else {
      window.$Token = false;
      window.$servie = 'http://publish.imacco.me/';
      window.$ProductionService = 'http://publish.imacco.com/';
      window.$AppApiService =  'http://v3.imacco.com/';
      window.$apiKey = '3751dec1e1d3109f028a85683fb8da02';
      window.$isTest = false;
    }
}


envConfig();

// 从Query String获取某个值
var getQueryStringByKey = function (key) {
  var queryString = window.location.search;
  var queryStringArray = queryString.split('&');
  var currentQueryString = '';
  for (var i = 0; i < queryStringArray.length; i++) {
    var temp = queryStringArray[i];
    if (temp.indexOf(key) >= 0) {
      currentQueryString = queryStringArray[i];
      break;
    }
  }
  var currentQueryStringArray = currentQueryString.split('=');
  if (currentQueryStringArray.length > 1) {
    return currentQueryStringArray[1];
  } else {
    return '';
  }
};


var getModuelID = function () {
  var link = window.location.pathname;
  var linkArray = link.split('/');
  return linkArray[1];
};

//大文件上传
(function ($) {
  $.extend({
    CheckCancelFlag:function(){
        this.cancelFlag = 0;
    },
    ConfirmUpload:function(object, urlLink, getFilePath,create_url,objectCancelFlag){
        objectCancelFlag.cancelFlag = 0;
        if(object==undefined){
          alert("请先选择文件");
          return false;
        }
        var FilePath = getFilePath;
        var succeed = 0;
        var randomnumber = getRandomNumber(5);
        var file = object;
        var name = file[0].name;
        var size = file[0].size;
        var shardSize = 8 * 1024 * 100;		//以800k为一个分片
        var shardCount = Math.ceil(size / shardSize);  //总片数
        var url = urlLink;
        var i = -1;
          
        GetObject();
        function GetObject() {
          i++;
          var start = i * shardSize;		//计算每一片的起始位置
          var end = Math.min(size, start + shardSize);		//计算每一片的结束位置
          var form = new FormData();		//构造一个表单，FormData是HTML5新增的
          var fileData = file[0].slice(start, end);
          form.append("data", fileData);  //slice方法用于切出文件的一部分
          form.append("name", name);
          form.append("total", shardCount);  //总片数
          form.append("index", i + 1);        //当前是第几片
          form.append("randomnumber", randomnumber);    //生成随机数
          var UploadFile = function (url, callback) {
            $.ajax({
              url: url,
              type: "POST",
              data: form,
              async: false,        //同步
              processData: false,  //很重要，告诉jquery不要对form进行处理
              contentType: false,  //很重要，指定为false才能形成正确的Content-Type
              success: function (e) {
                callback(e);
              },
              error: function () {
                console.log("error");
              }
            });
          };
      
          UploadFile(url, function (result) {   
            var data = JSON.parse(result);
            if (data.IsSuccess) {
              if (!window.$isTest) {
                UploadFile(create_url,function(result){
                  console.log(result);
                  var create_data = JSON.parse(result);
                  if(create_data.IsSuccess) {
                    succeed = succeed + 1;
                    if(i < shardCount){
                      console.log(objectCancelFlag.cancelFlag);
                      if(objectCancelFlag.cancelFlag==0){
                        FilePath(data,create_data, succeed, shardCount);
                        setTimeout(show,100);
                      }else{
                        succeed=-1;
                        FilePath(data,create_data, succeed, shardCount);
                      }                                
                    }else{ 
                      return ;         
                    }
                  }else {
                    alert('出错');
                  }
                });
              }else{
                console.log(result);
                FilePath(data,null, succeed, shardCount);
              }
            } else {
              console.log("no");
            }
          });
        }
        function show(){
          GetObject();
        }
    }
  });
}(jQuery));


//生成随机数
var getRandomNumber = function (n) {
  var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
  var randomnumber = "";
  for (var i = 0; i < n; i++) {
    randomnumber += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return randomnumber;
};



//var phonecatApp = angular.module('maccoApp', []);
// Your app's root module...
var maccoApp = angular.module('maccoApp', ['infinite-scroll', 'ngFileUpload', 'ui.bootstrap'], function ($httpProvider, $locationProvider) {
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

