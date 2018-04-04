maccoApp.controller('MakeWebController', ['$scope','$window','$http','Upload','$rootScope','$modal',function($scope, $window,$http,Upload,$rootScope,$modal) {
    //是否已经存在制作好的页面
    var InfoID = getQueryStringByKey("KeyNO");
    var EditUrl = window.$servie + 'AdminApi/Information/FetchEditInfo';
    var fields = {
        InfoKeyNo:InfoID,
        apiKey:window.$apiKey
    };

    $http.post(EditUrl,fields).success(function(data){
        if(data.IsSuccess) {
            if(data.Data){
                $scope.OpType = '编辑';
                var TempURL=data.Data.TempURL.length;
                var EditStrs=data.Data.EditStrs;
                var RelatedProductInfo=data.Data.RelatedProductInfo;

                var EditStrsBody=EditStrs.substring(EditStrs.indexOf('<body ng-controller="InformationController">')+44,EditStrs.indexOf("</body>"));
                $("#EditHtml").html(EditStrsBody);
                if($("#EditHtml div#mainBanner").length > 0){//banner
                    var EditBannerSrc=$("#EditHtml div#mainBanner").find("img").attr("src");
                    var EditBannerSrcName= EditBannerSrc.substring(TempURL);
                    $("#WebHtml div#mainBanner").show();
                    $("#WebHtml div#mainBanner").find("img").attr({src:EditBannerSrc,srcname:EditBannerSrcName});
                }
                if($("#EditHtml div#mainVideo").length > 0){//video
                    var EditVideoPoster=$("#EditHtml div#mainVideo").find("video").attr("poster");
                    var EditVideoPosterName= EditVideoPoster.substring(TempURL);
                    var EditVideoSrc=$("#EditHtml div#mainVideo").find("source").attr("src");
                    var EditVideoSrcName= EditVideoSrc.substring(TempURL);
                    $("#WebHtml div#mainVideo").show();
                    $("#WebHtml div#mainVideo").find("video").attr({poster:EditVideoPoster,postername:EditVideoPosterName,src:EditVideoSrc});
                    $("#WebHtml div#mainVideo").find("video").html(EditVideoSrcName);
                }
                if($("#EditHtml div#mainTitle").length > 0){//标题
                    var EditTitle=$("#EditHtml div#mainTitle").html();
                    $("#WebHtml div#mainTitle").show();
                    $("#WebHtml div#mainTitle").html(EditTitle);
                }
                if($("#EditHtml div#mainContent").length > 0){//正文
                    $("#EditHtml div#mainContent div").each(function(){
                        if($(this).attr("class")=='intro'){//引言
                            var EditIntro=$(this).html();
                            $("#WebHtml div#mainContent").append("<div class='ClickClear'></div><div class='intro dodelete edittext' contenteditable='true' title='输入文字'>"+EditIntro+"</div>");
                        }

                        if($(this).attr("class")=='pinkrules'){//分割线
                            var EditRules=$(this).html();
                            $("#WebHtml div#mainContent").append("<div class='ClickClear'></div><div class='pinkrules dodelete edittext' title='输入文字'>"+EditRules+"</div>");
                        }

                        if($(this).attr("class")=='detail'){//文字
                            var EditDetail=$(this).html();
                            $("#WebHtml div#mainContent").append("<div class='ClickClear'></div><div class='detail addtext dodelete edittext' contenteditable='true' title='输入文字'>"+EditDetail+"</div>");
                        }

                        if($(this).attr("class")=='ContentTitle'){//正文小标题
                            var EditTitle=$(this).html();
                            $("#WebHtml div#mainContent").append("<div class='ClickClear'></div><div class='ContentTitle addtext dodelete edittext' contenteditable='true' title='输入文字'>"+EditTitle+"</div>");
                        }

                        if($(this).attr("class")=='ProductImages'){//图片
                            var ImageNum=$("#WebHtml div#mainContent .ProductImages").length;
                            var DivId="image" + ImageNum;
                            var FileId="filePicker" + ImageNum;
                            var ImgId="preview" + ImageNum;
                            var ImgSrc=$(this).find("img").attr("bn-lazy-src");
                            var ImgSrcName=ImgSrc.substring(TempURL);
                            $("#WebHtml div#mainContent").append("<div class='ClickClear'></div><div class='ProductImages dodelete' id='"+DivId+"'><input type='file' id='"+FileId+"' style='display:none' accept='image/*'><img id='"+ImgId+"' title='图片"+ImageNum+"' src='"+ImgSrc+"' srcname='"+ImgSrcName+"'></div>");
                        }
                        if($(this).attr("class")=='productDiv'){//产品
                            var StepNum=$("#WebHtml .ProductSetp").length+1;
                            var StepId="CourseStep" + StepNum;
                            var CurProduct=RelatedProductInfo[StepNum-1];
                            $("#mainContent").append("<div class='ClickClear'></div><div class='ProductSetp dodelete' id='"+StepId+"' productKeyNo='"+CurProduct.ProductKeyNo+"'><img src='"+CurProduct.ProductImageUrl+"'>"+CurProduct.ProductName+"</div>");
                        }
                    });
                }
            }else{
                $scope.OpType = '新建';
            }
        } else {
            $window.alert('出错');
            $("#mask").hide();
        }
    });

    var InfoImage= [];//图片
    var filenames=[];//文件名
    $scope.AddHtml = function(step) {
      switch(step){
    		case 1:AddBanner();break;//添加banner
            case 2:AddVideoImage();break;//添加视频
            case 3:$("#mainTitle").show();break;//添加标题
            case 4:$("#mainContent").append("<div class='ClickClear'></div><div class='detail addtext dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加正文中文字
            case 5:AddImage();break;//添加正文中图片
            case 6:AddProduct();break;//添加产品
            case 7:$("#mainContent").append("<div class='ClickClear'></div><div class='ContentTitle addtext dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加正文中
            case 8:$("#mainContent").append("<div class='ClickClear'></div><div class='intro dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加引言
            case 9:$("#mainContent").append("<div class='ClickClear'></div><div class='pinkrules dodelete edittext' title='输入文字'><span><em contenteditable='true' ></em></span></div>");break;break;//添加分割线
            default:;
        }
    };

    //文件选择框（图片或视频）
    function Uploadimage(FileId,ObjId,Stype){
        $("#"+FileId).click();
        $("#"+FileId).on("change",function(event){
            var ObjFile = this.files[0];
            var fileURL = URL.createObjectURL(ObjFile);
            var fileName =ObjFile.name;
            var objImageNum=parseInt(ObjId.replace(/[^0-9]/ig,""));

            if(Stype=="image"){
                $("#"+ObjId).attr("src",fileURL);
                $("#"+ObjId).attr("srcname",fileName);
            }else if(Stype=="videoImage"){
                $("#"+ObjId).attr("poster",fileURL);
                $("#"+ObjId).attr("postername",fileName);
            }else if(Stype=="video"){
                $("#"+ObjId).attr("src",fileURL);
                $("#"+ObjId).html(fileName);
            }else{

            }

            if($("#"+ObjId).attr("id")=="BannerSrc"){
                changefile("BannerImage");
            }else if($("#"+ObjId).attr("id")=="VideoPoster"){
                changefile("VideoImage");
            }else{
                changefile("imageUrl"+objImageNum);
            }

            function changefile(objfilename){//判断是否存在对应文件对应名字
                var ObjNameNum=jQuery.inArray(objfilename,filenames);
                if(ObjNameNum==-1){
                    filenames.push(objfilename);
                    InfoImage.push(ObjFile);
                }else{
                    InfoImage[ObjNameNum]=ObjFile;
                }
            }
            event.stopPropagation();
        });
    }

    //1、添加Banner图片
    function AddBanner(){
        $("#mainBanner").show();
        $("#VideoPoster").attr("src","");
        $("#VideoPoster").attr("poster","");
        $("#mainVideo").hide();
        Uploadimage(BannerFile.id,BannerSrc.id,"image");
    }

    //2、添加视频图片
    function AddVideoImage(){
        $("#mainVideo").show();
        $("#BannerSrc").attr("src","");
        $("#mainBanner").hide();
        Uploadimage(VideoFile.id,VideoPoster.id,"videoImage");
    }

    //5、添加正文中图片
    function AddImage(){
    	var ImageNum=$("#WebHtml div.ProductImages").length;
    	var DivId="image" + ImageNum;
    	var FileId="filePicker" + ImageNum;
    	var ImgId="preview" + ImageNum;
    	$("#mainContent").append("<div class='ClickClear'></div><div class='ProductImages dodelete' id='"+DivId+"'><input type='file' id='"+FileId+"' style='display:none' accept='image/*'><img id='"+ImgId+"' title='图片"+ImageNum+"'></div>");
    }


    function AddProduct(ObjId){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '/InformationManage/selectProduct.html',
            controller: "selectProductController",
            resolve: {
                items: function () {
                    return $scope.selectedProduct;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            if(ObjId){
                $("#"+ObjId).attr("productKeyNo",selectedItem[0].KeyNo);
                $("#"+ObjId).empty();
                $("#"+ObjId).html("<img src='"+selectedItem[0].ProductImageUrl+"'>"+selectedItem[0].ProductCName+"");
            }else{
                var StepNum=$(".ProductSetp").length+1;
                var StepId="CourseStep" + StepNum;
                $("#mainContent").append("<div class='ClickClear'></div><div class='ProductSetp dodelete' id='"+StepId+"' productKeyNo='"+selectedItem[0].KeyNo+"'><img src='"+selectedItem[0].ProductImageUrl+"'>"+selectedItem[0].ProductCName+"</div>");
            }
        }, function () {
        });
    };

    //添加
    $(document).on('click','#mainContent .ClickClear', function (event) {
        var event = event || window.event;
        var style = ClickMenu.style;
        style.display = "block";
        style.top = event.clientY + "px";
        style.left = event.clientX + "px";
        var obj=$(this);
        $scope.ClickMenu = function(step) {
            switch(step){
                case 1:obj.before("<div class='ClickClear'></div><div class='detail addtext dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加正文中文字
                case 2:EditAddImage();break;//添加正文中图片
                case 3:EditAddProduct();break;//添加产品
                case 4:obj.before("<div class='ClickClear'></div><div class='ContentTitle addtext dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加正文中
                case 5:obj.before("<div class='ClickClear'></div><div class='intro dodelete edittext' contenteditable='true' title='输入文字'></div>");break;//添加引言
                case 6:obj.before("<div class='ClickClear'></div><div class='pinkrules dodelete edittext' title='输入文字'><span><em contenteditable='true' ></em></span></div>");break;break;//添加分割线
                default:;
            }
            $("#ClickMenu").hide();
        };
        function EditAddImage(){
            var ImageNum=$("#WebHtml div.ProductImages").length;
            var DivId="image" + ImageNum;
            var FileId="filePicker" + ImageNum;
            var ImgId="preview" + ImageNum;
            obj.before("<div class='ClickClear'></div><div class='ProductImages dodelete' id='"+DivId+"'><input type='file' id='"+FileId+"' style='display:none' accept='image/*'><img id='"+ImgId+"' title='图片"+ImageNum+"'></div>");
        }


        function EditAddProduct(ObjId){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: '/InformationManage/selectProduct.html',
                controller: "selectProductController",
                resolve: {
                    items: function () {
                        return $scope.selectedProduct;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if(ObjId){
                    $("#"+ObjId).attr("productKeyNo",selectedItem[0].KeyNo);
                    $("#"+ObjId).empty();
                    $("#"+ObjId).html("<img src='"+selectedItem[0].ProductImageUrl+"'>"+selectedItem[0].ProductCName+"");
                }else{
                    var StepNum=$(".ProductSetp").length+1;
                    var StepId="CourseStep" + StepNum;
                    obj.before("<div class='ClickClear'></div><div class='ProductSetp dodelete' id='"+StepId+"' productKeyNo='"+selectedItem[0].KeyNo+"'><img src='"+selectedItem[0].ProductImageUrl+"'>"+selectedItem[0].ProductCName+"</div>");
                }
            }, function () {
            });
        };
    });

    var TimeFn = null;//区别双击或者单击
    //单击视频实现更改
    $(document).on('click','#VideoPoster', function (e) {
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function(){
            Uploadimage(VideoSrcFile.id,VideoPoster.id,"video");
        },300);
    });
    //单击banner实现更改
    $(document).on('click','#BannerSrc', function (e) {
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function(){
            AddBanner();
        },300);
    });
    //单击正文中产品实现更改
    $(document).on('click','.ProductSetp', function (e) {
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function(){
            var ObjId=e.target.id;
            AddProduct(ObjId);
        },300);
    }); 
    //单击正文中图片实现图片更改
    $(document).on('click','.ProductImages', function (e) {
        clearTimeout(TimeFn);
        TimeFn = setTimeout(function(){
            var ObjId=e.target.id;
            var FileId="filePicker"+parseInt(ObjId.replace(/[^0-9]/ig,""));
            Uploadimage(FileId,ObjId,"image");
        },300);
    }); 
    //双击删除内容中的文字或图片或产品
    $(document).on('dblclick','.dodelete', function () {
        clearTimeout(TimeFn);
        if (confirm('确定删除所选？')) {
            $(this).prev().remove();
            $(this).remove();
            RenameImage();//删除后，剩余部分重命名id
        }
    }); 

    //监控粘贴(ctrl+v),如果是粘贴过来的东东，则保留纯文字
    $(document).on('paste','.edittext', function (e) {
        setTimeout(function(){
            var content= e.target.innerHTML;
            content=content.replace(/<[^>]*>|/g,""); 
            e.target.innerHTML=content;
        },1)
    });
    //若有回车按钮，则替换div为br
    $(document).on('keydown','.edittext', function (e) {
        setTimeout(function(){
            if (e.keyCode == 13){
                var content= e.target.innerHTML;
                content=content.replace(/<div>/g,"<br>"); 
                content=content.replace(/<\/div>/g,""); 
                e.target.innerHTML=content;  
                console.log(content);
            }
        },1)
    });

    //获取选中字符串
    $(document).on('click','#SureText', function () {
        var selected=window.getSelection();
        var selectedRange=selected.getRangeAt(0);
        
        console.log(selectedRange);
        console.log(selectedRange.commonAncestorContainer);
        console.log(selectedRange.startContainer);
        console.log(selectedRange.startOffset);
        console.log(selectedRange.endContainer);
        console.log(selectedRange.endOffset);

        console.log(selected.anchorNode);
        console.log(selected.anchorOffset);
        console.log(selected.focusNode);
        console.log(selected.focusOffset);

        selectedRange.setStart(selected.anchorNode,selected.anchorOffset);
        selectedRange.setEnd(selected.focusNode,selected.focusOffset);

        var TextSize=$("#TextSize").val();
        var TextColor=$("#hue-demo").val();
        if(!selected.isCollapsed){
            if(isNaN(TextSize*1)){
                alert("文字大小应为数字！");
            }else{
                var e=document.createElement("span");
                if(TextSize){
                    e.style.fontSize=TextSize+"px";
                }
                if(TextColor){
                    e.style.color=TextColor;
                }
                if($("#TextCheck").is(':checked')){
                    e.style.fontWeight="bolder";
                }else{
                    /*e.style.fontWeight="normal";*/
                }
                selectedRange.surroundContents(e);
            }
        }else{
            alert("请选中需编辑文本");
        }
    });
    //图片删除后重命名Id
    function RenameImage(){ 
        //正文中图片Id重命名
        $("div[class='ProductImages dodelete']").each(function(i){
            $(this).attr("id","image"+i);
            $(this).find("img").attr("title","图片"+i);
        });
        //正文中产品Id重命名
        $("div[class='ProductSetp dodelete']").each(function(i){
            var objNum=i+1;
            $(this).attr("id","CourseStep"+objNum);
        });
    }

    //点击预览
    $scope.PreviewWeb = function() {
        var VideoPosterSrc=$("#VideoPoster").attr("src");//获取视频地址
        var VideoPosterSrcPoster=$("#VideoPoster").attr("poster");//获取视频图片
        var HasBanner=$("#BannerSrc").attr("src");//获取Banner图片
        var mainTitleTxt=$("#mainTitle").html();//获取标题
        if((VideoPosterSrc&&VideoPosterSrcPoster&&!HasBanner)||(!VideoPosterSrc&&!VideoPosterSrcPoster&&HasBanner)){
            if(!mainTitleTxt){
                alert("缺少标题");
            }else{ 
                $("#mask").show();
                MakeWeb();//整合代码，上传至服务器
            } 
        }else if(VideoPosterSrc&&!VideoPosterSrcPoster){
            alert("缺少视频图片");
        }else if(!VideoPosterSrc&&VideoPosterSrcPoster){
            alert("缺少视频");
        }else if(!HasBanner){
            alert("缺少banner或视频");
        }else{
            alert("出错");
        }
    };

    //上传至服务器
    function MakeWeb(){ 
        $("#LayoutDiv1 div#mainBanner").remove();
        $("#LayoutDiv1 div#mainVideo").remove();
        $("#LayoutDiv1 div#mainContent").empty();
        var VideoPosterSrc=$("#VideoPoster").attr("src");//视频地址
        var VideoPosterSrcName=$("#VideoPoster").html();//视频地址名字
        var VideoPosterSrcPoster=$("#VideoPoster").attr("poster");//视频图片
        var VideoPosterSrcPosterName=$("#VideoPoster").attr("postername");//视频图片名字
        var HasBanner=$("#BannerSrc").attr("src");//banner图片
        var HasBannerName=$("#BannerSrc").attr("srcname");//banner图片名字
        var mainTitleTxt=$("#mainTitle").html();//标题内容

        var submitCourses = [];

        var randomStrs = '0123456789qwertyuioplkjhgfdsazxcvbnm';
        var res = "";
        for (var i=0;i <32;i++) {
            var id = Math.ceil(Math.random()*35);
            res += randomStrs[id];
        }
        
        $scope.VideoFilePath="";
        $scope.VideoImage="";
        $scope.BannerImage="";

        if(!HasBanner){//添加视频代码
            $("#LayoutDiv1 div#mainTitle").before('<div id="mainVideo"><div class="divProduct" id="VideoPlayPlaceHold"></div><div class="ProductVideo" id="VideoPlay"><video controls="controls" webkit-playsinline id="curVideo" poster="'+VideoPosterSrcPosterName+'"><source src="'+VideoPosterSrcName+'" type="video/mp4"></video><div class="videoMask"></div><div class="closeVideo"><img src="../images/videoclose.png" id="closebtn"></div><div class="mask"><div class="maskContent"><div class="maskLeft"><img src="../images/videostop.png" id="stopbtn"><img src="../images/play.png" id="startbtn"></div><div class="maskMiddle"><img src="../images/xuxian.png"></div><div class="maskRight"><img src="../images/quanping.png" id="screenbtn" onclick="screenfullClick()"></div></div></div></div></div><div class="clear">');
        }else{//添加banner代码
            $("#LayoutDiv1 div#mainTitle").before('<div id="mainBanner" class="banner"><img src="'+HasBannerName+'"></div><div class="clear"></div>');
        }

        $("#LayoutDiv1 div#mainTitle").html(mainTitleTxt);//添加标题代码

        $("#mainContent div").each(function(){
            if($(this).attr("class")=='intro dodelete edittext'&&($(this).html())){//添加引言
                $("#LayoutDiv1 div#mainContent").append("<div class='intro'>"+$(this).html()+"</div>");
            }
            if($(this).attr("class")=='pinkrules dodelete edittext'&&($(this).html())){//添加分割线
                $("#LayoutDiv1 div#mainContent").append("<div class='pinkrules'>"+$(this).html()+"</div>");
            }
            if($(this).attr("class")=='ContentTitle addtext dodelete edittext'&&($(this).html())){//添加正文小标题
                $("#LayoutDiv1 div#mainContent").append("<div class='ContentTitle'>"+$(this).html()+"</div>");
            }
            if($(this).attr("class")=='detail addtext dodelete edittext'&&($(this).html())){//添加正文文字代码
                $("#LayoutDiv1 div#mainContent").append("<div class='detail'>"+$(this).html()+"</div>");
            }
            if($(this).attr("class")=='ProductImages dodelete'&&($(this).find("img").attr("src"))){//添加正文图片代码
                $("#LayoutDiv1 div#mainContent").append("<div class='ProductImages'><img bn-lazy-src='"+$(this).find("img").attr("srcname")+"' src='../images/imageLoading.png'></div>");
            }
            if($(this).attr("class")=='ProductSetp dodelete'){//添加正文产品代码
                $("#LayoutDiv1 div#mainContent").append('<div class="productDiv"><div ng-controller="ProductStepCtrl" ng-model="productQuery" ng-init="productQuery=\''+$(this).attr("id")+'\'"><div ng-include="\'/Info/product.html?v='+res+'\'"></div></div></div>');
                var courseStep=$(this).attr("id");
                var courseproduct=$(this).attr("productKeyNo");

                var submitCourse = {
                    CourseStep:courseStep,
                    Products: []
                };
                submitCourse.Products.push(courseproduct);
                submitCourses.push(submitCourse);
            }
        });
        var courseJSON = angular.toJson(submitCourses);

        //ng-include
        var zanHtml='<input type="hidden" ng-model="zanurl" ng-init="zanurl=\'/Info/zan.html?v='+res+'\'" /><div id="add_zan" ng-include="zanurl"></div>';
        var commentHtml='<input type="hidden" ng-model="templateurl" ng-init="templateurl=\'/Info/comments.html?v='+res+'\'" /><div id="add_comment" ng-include="templateurl"></div>';
        $("#LayoutDiv1 div#mainZan").empty();
        $("#LayoutDiv1 div#mainFooter").empty();
        $("#LayoutDiv1 div#mainZan").append(zanHtml);
        $("#LayoutDiv1 div#mainFooter").append(commentHtml);

        //html代码
        var body=$("#MakeHtml").html();
        var tou='<!doctype html><html class="" ng-app="maccoApp"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title></title><style>@font-face {font-family: \'youyuan\';src: url(data:font/ttf;base64,FONTBASE64) format(\'truetype\');}</style><link rel="stylesheet" type="text/css" href="../public/boilerplate.min.css?v='+res+'" charset="utf-8"><link rel="stylesheet" type="text/css" href="../public/comment.min.css?v='+res+'" charset="utf-8"><link rel="stylesheet" type="text/css" href="../public/video.min.css?v='+res+'" charset="utf-8"><link rel="stylesheet" type="text/css" href="../public/publicComment.min.css?v='+res+'" charset="utf-8"><link rel="stylesheet" type="text/css" href="../public/zan.min.css?v='+res+'" charset="utf-8"><link rel="stylesheet" type="text/css" href="../public/imageLazyLoad.min.css?v='+res+'" charset="utf-8"><script type="text/javascript" src="/JS/config.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="/JS/jquery-2.1.4.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="/JS/node_modules/angular/angular.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="/JS/node_modules/angular/ng-infinite-scroll.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="../js/infoController.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="../js/CommentCtrl.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="../js/ZanCtrl.min.js?v='+res+'" charset="utf-8"></script><script type="text/javascript" src="../js/imageLazyLoad.min.js?v='+res+'" charset="utf-8"></script></head><body ng-controller="InformationController">';
        var wei='</body></html>';
        var str=tou+body+wei;

        //上传服务器
        var PostVideo = function(){
            var InfoID = getQueryStringByKey("KeyNO");
            var MakeHtmlUrl = window.$servie + 'AdminApi/Information/EditInfo';
            var MakeHtml_Url = window.$ProductionService + 'AdminApi/Information/EditInfo';
            var fields = {
                InfoKeyNo:InfoID, 
                HtmlStr:str,
                VideoPath:$scope.VideoFilePath,
                RelatedProduct : courseJSON,
                apiKey:window.$apiKey,
            };
            var fields2 = {
                InfoKeyNo:InfoID, 
                HtmlStr:str,
                VideoPath:$scope.VideoFilePath2,
                RelatedProduct : courseJSON,
                apiKey:window.$apiKey,
            };

            var postCreateFunc = function(url,dataField,callback) {
                Upload.upload({
                    url: url,
                    fields:dataField,
                    file: InfoImage,
                    fileFormDataName:filenames,
                }).success(function (data, status, headers, config){
                    callback(data);
                });
            };

            postCreateFunc(MakeHtmlUrl,fields,function(data) {
                if(data.IsSuccess) {
                    $scope.FolderName1=data.Data[0].FolderName;
                    if (!window.$isTest) {
                        postCreateFunc(MakeHtml_Url,fields2,function(result){
                            if(result.IsSuccess) {
                                $scope.FolderName2=result.Data[0].FolderName;
                                alert("点击跳转预览，记得回来保存哦！");
                                $window.open(data.Data[0].webUrl);
                                $scope.cansave=true;
                                $("#mask").hide();
                            } else {
                                $window.alert('出错');
                                $("#mask").hide();
                            }
                        });
                    }
                } else {
                    $window.alert('出错');
                    $("#mask").hide();
                }
            });
        };

        //上传视频至服务器
        var  videoUpload = function(){
            var videoCancelTag = new $.CheckCancelFlag();

            $scope.VideoConfirmUpload=function(){
                var url = window.$servie + "AdminApi/Fileapi/UploadFile";
                var create_url = window.$ProductionService + "AdminApi/Fileapi/UploadFile";
                $.ConfirmUpload($scope.Video,url,getVideoFilePath,create_url,videoCancelTag);
            }

            var getVideoFilePath = function(data,data2,succeed,shardCount){
                if(data.Data.IsStop){
                    $scope.VideoFilePath=data.Data.TempPath+"/"+data.Data.RealName;
                    $scope.VideoFilePath2=data2.Data.TempPath+"/"+data2.Data.RealName;
                    PostVideo();     
                }else{
                }
                $scope.$apply();                
            };
        };

        //有视频的传
        var videoUrl=VideoPosterSrc.substring(0,4);
        if(videoUrl&&videoUrl!="http"){
            videoUpload();       
            $scope.VideoConfirmUpload();
        }else{ 
            PostVideo();         
        }
    }

    $scope.SaveWeb = function() {
        $("#mask").show();
        var InfoID = getQueryStringByKey("KeyNO");
        var MakeUrl = window.$servie + 'AdminApi/Information/SaveEditInfo';
        var Make_url = window.$ProductionService + 'AdminApi/Information/SaveEditInfo';
        var fields = {
            InfoKeyNo:InfoID, 
            FolderName:$scope.FolderName1,
            apiKey:window.$apiKey
        };

        var fields2 = {
            InfoKeyNo:InfoID, 
            FolderName:$scope.FolderName2,
            apiKey:window.$apiKey
        };

        $http.post(MakeUrl,fields).success(function(data){
            if(data.IsSuccess) {
                if (!window.$isTest) {
                    $http.post(Make_url,fields2).success(function(result){
                        if(result.IsSuccess) {
                            if(result.Data.IsSaved) {
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

    };

    $scope.CopyHtml = function() {
        var copyHtml=$("#WebHtml").html();
        $("#WebHtmlCopy").text(copyHtml);
    };

    $scope.PasteHtml = function() { 
        var pasteHtmlStr=$("#WebHtmlCopy").text();
        $("#WebHtml").html(pasteHtmlStr);
    };

    $scope.ReturnBack = function(token) {
      $window.location.href = '/InformationManage/informationManager.html?Token=' + $rootScope.Token;
  };
}]);

