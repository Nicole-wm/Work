maccoApp.controller('InformationDetailController', ['$scope','$window','$http','Upload','$rootScope','$modal',function($scope, $window,$http,Upload,$rootScope,$modal) {
	var checkUrl = window.$servie + 'AdminApi/Information/CheckInfoKeyNo';
  var checkUrl2 = window.$ProductionService + 'AdminApi/Information/CheckInfoKeyNo';
  $http.post(checkUrl).success(function(data){
    $http.post(checkUrl2).success(function(result){
      if(data.Data==result.Data){
      }else{
        $("#mask").show();
        alert("后台数据发生错误，无法添加，详情咨询管理员！");
        $scope.ReturnBack();
        $("#mask").hide();
      }
    });
  });
  var type = getQueryStringByKey('Type');
  
  sharepic.onload = function() {
    var maxsize =32*1024;//32k  
    var picWidth=$("#sharepic").width();
    var picHeight=$("#sharepic").height();
    var picSize=$scope.ShareImage[0].size;
    if(picSize>maxsize||picWidth!=150||picHeight!=150){
      $("#sharepicSelect").attr("src","");
      $scope.ShareImage=undefined;
      $scope.$apply(); 
      if(picSize>maxsize){
        setTimeout("alert('上传图片应该小于32k，请重新上传!')",0);
      }else{
        setTimeout("alert('上传图片宽度或高度不是150px，请重新上传!')",0);
      }
    }
  }

  if (type == 'Create') {
    $scope.OperationType = '(新增)';
    $scope.canEdit = true;
    $scope.NeedBanner = true;
    $scope.NeedShareImage = true;

    $scope.WebShowSubmit=true;
    $scope.VideoShowSubmit=true;
		//文件上传成功后获取地址
		$scope.WebFilePath=null;
		$scope.VideoFilePath=null;

		$scope.VideoHeigth=null;
		$scope.VideoWidth=null;

		$scope.ImgWidth=null;
		
		var width;
		var height
		var indexVideo = document.getElementById('indexVideo');
		indexVideo.addEventListener('loadedmetadata',function(e){
			width = this.videoWidth;
			height = this.videoHeight;
		});

    var webUpload = function(){
      var webCancelTag = new $.CheckCancelFlag();
      $scope.WebCancelUpload=function(){
        $scope.Web = undefined;
        $scope.WebUploadProgress = "";
        webCancelTag.cancelFlag = 1;
      }
      $scope.WebConfirmUpload=function(){
        var url = window.$servie + "AdminApi/Fileapi/UploadFile";
        var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
        $.ConfirmUpload($scope.Web,url,getWebFilePath,create_url,webCancelTag);			
      }		

      var getWebFilePath = function(data,data2,succeed,shardCount){			
        if(data.Data.IsStop){
          $scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;
          $scope.WebFilePath2=data2.Data.TempPath+"/"+ data2.Data.RealName;		
          $scope.WebUploadProgress = "上传成功！";
          $scope.WebShowSubmit=false;
          $scope.WebUrl=true;
        }else{
          if(succeed!=-1){
            $scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
          }else{
            $scope.WebUploadProgress = "已取消上传";
            $scope.Web=null;
          }
        }
        $scope.$apply();
      };
    }

    webUpload();

    var videoUpload = function(){
      var videoCancelTag = new $.CheckCancelFlag();

      $scope.VideoCancelUpload=function(){
        $scope.Video = undefined;
        $scope.VideoUploadProgress = "";
        videoCancelTag.cancelFlag = 1;
      }
      $scope.VideoConfirmUpload=function(){
        var url = window.$servie + "AdminApi/Fileapi/UploadFile";
        var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
        $.ConfirmUpload($scope.Video,url,getVideoFilePath,create_url,videoCancelTag);
      }
      var getVideoFilePath = function(data,data2,succeed,shardCount){
        if(data.Data.IsStop){
          $scope.VideoFilePath=data.Data.TempPath+"/"+data.Data.RealName;
          $scope.VideoFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;
          $scope.VideoHeigth=height;
          $scope.VideoWidth=width; 
          $scope.VideoUploadProgress = "上传成功！";
          $scope.VideoShowSubmit=!$scope.VideoShowSubmit;
        }else{
          if(succeed!=-1){
            $scope.VideoUploadProgress = "进度："+succeed+"/"+shardCount;
          }else{
            $scope.VideoUploadProgress = "已取消上传";
            $scope.Video=null;
          }
        }
        $scope.$apply();				
      };
    };
    videoUpload();
    $scope.Submit = function() {
      if($scope.InfoDetail.$valid) {	
        $("#mask").show();
        var url = window.$servie + 'AdminApi/Information/CreateInfo';
        var production_create_url = window.$ProductionService + 'AdminApi/Information/CreateInfo';
        if($scope.VideoHeigth==null){
          $scope.Video="";
          $scope.VideoFilePath="";
          $scope.VideoHeigth="";
          $scope.VideoWidth="";
          $scope.VideoFilePath2="";
        }
        var fields = {
          UserName:$rootScope.AdminUserName,
          Title: $scope.Title,
          Description: $scope.Description,
          apiKey : window.$apiKey,
          WebPath : $scope.WebFilePath,
          VideoPath : $scope.VideoFilePath,
          VideoHeight : $scope.VideoHeigth,
          VideoWidth : $scope.VideoWidth
        };

        var fields2 = {
          UserName:$rootScope.AdminUserName,
          Title: $scope.Title,
          Description: $scope.Description,
          apiKey : window.$apiKey,
          WebPath : $scope.WebFilePath2,
          VideoPath : $scope.VideoFilePath2,
          VideoHeight : $scope.VideoHeigth,
          VideoWidth : $scope.VideoWidth
        };

        var Banner = $scope.Banner;
        var ShareImage = $scope.ShareImage;
        var files = [];
        files.push($scope.Banner);
        files.push($scope.ShareImage); 

        var postCreateFunc = function(url,dataField,callback) {
          Upload.upload({
            url: url,
            fields:dataField,
            file: files,
            fileFormDataName:['Banner','ShareImage']
          }).success(function (data, status, headers, config){
            callback(data);
          });
        };
        postCreateFunc(url,fields,function(data) {
          if(data.IsSuccess) {
            if (!window.$isTest) {
              postCreateFunc(production_create_url,fields2,function(result){
                if(result.IsSuccess) {
                  if(result.Data.IsCreated) {
                    if (data.Data.KeyNo==result.Data.KeyNo) {
                      $scope.ReturnBack();
                      $("#mask").hide();
                    }else{
                      alert("后台添加数据发生错误，详情咨询管理员！");
                      $scope.ReturnBack();
                      $("#mask").hide();
                    }
                  }else {
                    $window.alert('出错');
                    $("#mask").hide();
                  }
                }else{
                  $window.alert('出错');
                  $("#mask").hide();
                }
              });
            }else{
              $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
              $("#mask").hide();
            }							
          }else{
            $window.alert('出错');
            $("#mask").hide();
          }
        });
      }
    };	
  }

  if (type == 'Visit') {
    $scope.OperationType = '';
    $scope.canEdit = false;

    $scope.showCNameErr = false;
    $scope.showENameErr = false;
    var InfoID = getQueryStringByKey("ID");
    var visitUrl =  window.$servie + 'AdminApi/Information/FetchInfoDetilForAdmin';
    $http.post(visitUrl,{InfoID:InfoID}).success(function(data){
      if(data.IsSuccess) {
        if(data.Data.length >0) {
          $scope.ImageUrl = data.Data[0].ImageUrl;
          $scope.ShareImageUrl = data.Data[0].ShareImageUrl;
          $scope.WebUrl =  data.Data[0].WebUrl;
          $scope.Title = data.Data[0].Title;
          $scope.Description = data.Data[0].Description;
          $scope.VideoUrl = data.Data[0].VideoLink;
        }
      }
    });
  }

  if (type == 'Update') {
    $scope.OperationType = '(编辑)';
    $scope.canEdit = true;
    $scope.showCNameErr = false;
    $scope.showENameErr = false;
    $scope.webUpload=false;
    $scope.videoUpload=false;
    $scope.WebShowSubmit=true;
    $scope.VideoShowSubmit=true;

    var InfoID = getQueryStringByKey("ID");
    var visitUrl =  window.$servie + 'AdminApi/Information/FetchInfoDetilForAdmin';

    var updateWidth;
    var updateHeight;
    var indexVideo2 = document.getElementById('indexVideo');
    indexVideo2.addEventListener('loadedmetadata',function(e){
      updateWidth = this.videoWidth;
      updateHeight = this.videoHeight;
    });
    $http.post(visitUrl,{InfoID:InfoID}).success(function(data){
      if(data.IsSuccess) {
        if(data.Data.length >0) {
          $scope.ImageUrl = data.Data[0].ImageUrl;
          $scope.ShareImageUrl = data.Data[0].ShareImageUrl;
          $scope.WebUrl =  data.Data[0].WebUrl;
          $scope.Title = data.Data[0].Title;
          $scope.Description = data.Data[0].Description;
          $scope.VideoUrl = data.Data[0].VideoLink;
        }
      }
    });
    $scope.NeedBanner = false;
    $scope.ImgWidth=null;

    var editWebUpload = function(){
      var webCancelTag = new $.CheckCancelFlag();

      $scope.WebCancelUpload=function(){
        $scope.Web = undefined;
        $scope.WebUploadProgress = "";
        webCancelTag.cancelFlag = 1;
      }
      
      $scope.WebConfirmUpload=function(){
        var url = window.$servie + "AdminApi/Fileapi/UploadFile";
        var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
        $.ConfirmUpload($scope.Web,url,getWebFilePaths,create_url,webCancelTag);      
      }   

      var getWebFilePaths = function(data,data2,succeed,shardCount){      
        if(data.Data.IsStop){
          $scope.WebFilePath=data.Data.TempPath+"/"+data.Data.RealName;  
          $scope.WebFilePath2=data2.Data.TempPath+"/"+ data2.Data.RealName;  
          $scope.WebUploadProgress = "上传成功！";
          $scope.webUpload = !$scope.webUpload;
          $scope.WebShowSubmit=!$scope.WebShowSubmit;
          $scope.WebUrl=true;
        }else{
          if(succeed!=-1){
            $scope.WebUploadProgress = "进度："+succeed+"/"+shardCount;
          }else{
            $scope.WebUploadProgress = "已取消上传";
            $scope.Web=null;
          }
        }
        $scope.$apply();
      };
    };
    editWebUpload();

    var  editVideoUpload = function(){
      var videoCancelTag = new $.CheckCancelFlag();

      $scope.VideoCancelUpload=function(){
        $scope.Video = undefined;
        $scope.VideoUploadProgress = "";
        videoCancelTag.cancelFlag = 1;
      }
      $scope.VideoConfirmUpload=function(){
        var url = window.$servie + "AdminApi/Fileapi/UploadFile";
        var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
        $.ConfirmUpload($scope.Video,url,getVideoFilePaths,create_url,videoCancelTag);
      }

      var getVideoFilePaths = function(data,data2,succeed,shardCount){
        if(data.Data.IsStop){
          $scope.VideoFilePath=data.Data.TempPath+"/"+data.Data.RealName;
          $scope.VideoFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;
          $scope.VideoHeigth=updateHeight;
          $scope.VideoWidth=updateWidth;
          $scope.VideoUploadProgress = "上传成功！";
          $scope.videoUpload = !$scope.videoUpload;
          $scope.VideoShowSubmit=!$scope.VideoShowSubmit;
        }else{
          if(succeed!=-1){
            $scope.VideoUploadProgress = "进度："+succeed+"/"+shardCount;
          }else{
            $scope.VideoUploadProgress = "已取消上传";
            $scope.Video=null;
          }
        } 
        $scope.$apply();      
      };
    };
    editVideoUpload();

    var KeyNO = getQueryStringByKey("KeyNo");
    $scope.Submit = function() {
      var fields;
      var fields2;

      if($scope.InfoDetail.$valid) {   
        $("#mask").show(); 
        var url = window.$servie + 'AdminApi/Information/UpdateInfo';
        var production_update_url = window.$ProductionService + 'AdminApi/Information/UpdateInfo';
        if($scope.webUpload){
          if($scope.videoUpload){
            fields = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              WebPath : $scope.WebFilePath,
              VideoPath : $scope.VideoFilePath,
              VideoHeigth : $scope.VideoHeigth,
              VideoWidth : $scope.VideoWidth
            };
            fields2 = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              WebPath : $scope.WebFilePath2,
              VideoPath : $scope.VideoFilePath2,
              VideoHeigth : $scope.VideoHeigth,
              VideoWidth : $scope.VideoWidth
            };
          }else{
            fields = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              WebPath : $scope.WebFilePath
            };
            fields2 = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              WebPath : $scope.WebFilePath2
            };
          }
        }else{
          if($scope.videoUpload){
            fields = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              VideoPath : $scope.VideoFilePath,
              VideoHeight : $scope.VideoHeigth,
              VideoWidth : $scope.VideoWidth
            };
            fields2 = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey,
              VideoPath : $scope.VideoFilePath2,
              VideoHeight : $scope.VideoHeigth,
              VideoWidth : $scope.VideoWidth
            };
          }else{
            fields = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey
            };
            fields2 = {
              KeyNO : KeyNO,           
              Title: $scope.Title,
              Description: $scope.Description,
              apiKey:window.$apiKey
            };
          }
        }
        var files = [];
        var fileNames = [];
        if($scope.Banner != null) {
          files.push($scope.Banner);
          fileNames.push('Banner');
        }
        if($scope.ShareImage != null) {
          files.push($scope.ShareImage);
          fileNames.push('ShareImage');
        }

        var postCreateFunc = function(url,dataField,callback) {
          Upload.upload({
            url: url,
            fields:dataField,
            file: files,
            fileFormDataName:fileNames
          }).success(function (data, status, headers, config){
            console.log(data);
            callback(data);
          });
        };

        postCreateFunc(url,fields,function(data) {
          if(data.IsSuccess) {
            if (!window.$isTest) {
              postCreateFunc(production_update_url,fields2,function(result){   
                if(result.IsSuccess) {
                  if(result.Data.IsUpdated) {
                    $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
                    $("#mask").hide();
                  } else {
                    $window.alert('出错');
                    $("#mask").hide();
                  }
                } else {
                  $window.alert('出错');
                  $("#mask").hide();
                }
              });
            }else{
              $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
              $("#mask").hide();
            }  
          } else {
            $window.alert('出错');
            $("#mask").hide();
          }
        });
      }
    };
  }


  $scope.ReturnBack = function(token) {
    $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
  };
}]);