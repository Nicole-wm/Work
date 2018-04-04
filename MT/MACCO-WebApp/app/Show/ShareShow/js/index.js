var app = angular.module('maccoApp', ['infinite-scroll'], ['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
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

app.factory('httpInterceptor', ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
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

app.factory('macco', ['$http', function ($http) {
    var macco = function () {
        this.items = [];
        this.busy = false;
        this.after = 0;
    };


    var url = "http://" + window.hostname + '/MeiDeNi/Showindex/FetchShowIndexLikeData ';
    var ShowIndexID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');


    var param = {
        UID: uid,
        LastID: 0,
        PageSize: 10
    };

    var contains = function (items, value) {
        var ret = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].ID == value) {
                ret = true;
                break;
            }
        }
        return ret;
    };

    macco.prototype.nextPage = function () {
        this.busy = true;
        param.LastID = this.after;
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            if (items != undefined) {
                for (var i = 0; i < items.length; i++) {
                    if (!contains(this.items, items[i].ID)) {
                        var IsLiked = items[i].IsLiked;
                        if (IsLiked == -1) {
                            items[i].ShowMayLike = false;
                        } else {
                            items[i].ShowMayLike = true;
                        }
                        var TagSource = items[i].TagSource;
                        if (TagSource == "") {
                            items[i].TagSource = "编辑精选";
                        }

                        this.items.push(items[i]);
                    }
                    this.refresh = false;
                }

                if (items.length > 0) {
                    this.after = this.items[data.Data.length - 1].ID;
                } else {
                    this.after = 0;
                }
            }
        }.bind(this));

        this.busy = false;
    };
    return macco;
}]);

app.controller('shareController', ['$sce','$scope', '$http', 'macco', '$window', '$location', '$rootScope', '$interval', '$timeout', function ($sce,$scope, $http, macco, $window, $location, $rootScope, $interval, $timeout) {
    $scope.macco = new macco();
    // 基本数据的接口地址
    var shareDetailUrl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/FetchShowIndexDetail';
    var ID = window.getQueryStringByKey('ID');
    var param = {
        ShowIndexID: ID
    };

    var LikePercentTextWidth = $(".LikePercentText").width();
    var PercentLineWidth = $(window).width() * 1 - 2 * LikePercentTextWidth * 1;
    $scope.PercentLine = 'width:' + PercentLineWidth + 'px';

    $scope.addlike = 1;
    $scope.addunlike = 1;

    //获取赞呸初始值
    $scope.LikeCountText = "喜欢";
    $scope.UnLikeCountText = "不喜欢";

    var FetchshareDetailUrl = function () {
        $http.post(shareDetailUrl, param).success(function (data) {
            if (data.IsSuccess) {
                var item = data.Data[0];
                if (item.YEAR > 0) {
                    item.DateDiff = item.YEAR + '年前';
                } else {
                    if (item.mouth > 0) {
                        item.DateDiff = item.mouth + '月前';
                    } else {
                        if (item.DAY > 0) {
                            item.DateDiff = item.DAY + '天前';
                        } else {
                            if (item.HOUR > 0) {
                                item.DateDiff = item.HOUR + '小时前';
                            } else {
                                if (item.min > 0) {
                                    item.DateDiff = item.min + '分钟前';
                                } else {
                                    item.DateDiff = item.Sec + '秒前';
                                }
                            }
                        }
                    }
                }

                if (data.Data.length > 0) {
                    $scope.LikeCount = item.LikeCount * 1;
                    $scope.UnLikeCount = item.UnLikeCount * 1;
                    LineWidth();
                    $scope.LikePrecent = 'width:' + $scope.LikeLineWidth + 'px;background-color: #ff4c84;';
                    $scope.UnLikePrecent = 'width:' + $scope.UnLikeLineWidth + 'px;background: #ffc002;';
                } else {
                    $scope.LikeCount = 0;
                    $scope.UnLikeCount = 0;
                }

                item.ShowIndexDetail[0].currentShow = "currentShow";

                $scope.share = item;
                
                $scope.share.ShowIndexDetail=data.Data[0].ShowIndexDetail;
                $scope.showimgs=$scope.share.ShowIndexDetail;
                $scope.CountPoint=[];
                var CountImg=$scope.showimgs.length;
                for(var i=0;i<CountImg;i++){
                    $scope.CountPoint[i]=$scope.showimgs[i].TagCount*1;
                    var CountTag=$scope.showimgs[i].TagCount*1;
                    var CreateNodeDiv='';
                    for(var j=0;j<CountTag;j++){
                        var objShow=$scope.showimgs[i].TagDetail[j];
                        var GetStyle=objShow.Type;
                        var GetPoint=JSON.parse(objShow.SetPoint);
                        var GetPointX=GetPoint[0];
                        var GetPointY=GetPoint[1];
                        var GetTags=[objShow.Brand,objShow.Product,objShow.Currency,objShow.Price,objShow.Country,objShow.Location];
                        var DoGetTags=CheckTagDetail(GetTags);
                        var GetHtml=AppendTag(DoGetTags[0],GetStyle,DoGetTags[1],DoGetTags[2],DoGetTags[3]);
                        CreateNodeDiv=CreateNodeDiv+'<div class="NodeDiv" id="'+i+'NodeDiv'+j+'" style="left:'+GetPointX+'px;top:'+GetPointY+'px;" curstyle="'+GetStyle+'">'+GetHtml+'</div>';
                    }
                    $scope.showimgs[i].NodeDivHtml=$sce.trustAsHtml(CreateNodeDiv);
                }
            }
        });
    };
    FetchshareDetailUrl();

    /*************************************TagDotStart**************************************/
    //处理标签空格等
    function CheckTagDetail(tags){
        var linetags=[];
        var TextNumTemp=[];
        if(tags[0]!=""&&tags[1]!=""){
            linetags[0]=tags[0]+" "+tags[1];
            TextNumTemp[0]=0;
        }else if(tags[0]!=""){
            linetags[0]=tags[0];
            TextNumTemp[0]=1;
        }else if(tags[1]!=""){
            linetags[0]=tags[1];
            TextNumTemp[0]=2;
        }else{
            linetags[0]="";
        }

        if(tags[2]!=""&&tags[3]!=""){
            linetags[1]=tags[3]+" "+tags[2];
            TextNumTemp[1]=0;
        }else if(tags[2]!=""){
            linetags[1]=tags[2];
            TextNumTemp[1]=2;
        }else if(tags[3]!=""){
            linetags[1]=tags[3];
            TextNumTemp[1]=1;
        }else{
            linetags[1]="";
        }

        if(tags[4]!=""&&tags[5]!=""){
            linetags[2]=tags[4]+" "+tags[5];
            TextNumTemp[2]=0;
        }else if(tags[4]!=""){
            linetags[2]=tags[4];
            TextNumTemp[2]=1;
        }else if(tags[5]!=""){
            linetags[2]=tags[5];
            TextNumTemp[2]=2; 
        }else{
            linetags[2]="";
        }
        var TagArr=[];
        var TagNum=[];
        var TextNum=[];
        var LineNum=0;
        for(var i=0;i<3;i++){
            if(linetags[i]!=""){
                TagArr.push(linetags[i]);
                TagNum.push(i);
                TextNum.push(TextNumTemp[i]);
                LineNum++;
            }
        }
        return [LineNum,TagArr,TagNum,TextNum]
    } 
    //在图片加入所填标签（AppendDiv）
    function AppendTag(LineNum,SytleNum,TagArr,TagNum,textNum){
        var TagHtml="";
        if(LineNum==1)  {
            if(SytleNum==1){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
            }else if(SytleNum==2){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg note_dot_right"></div><div class="note_dot_around note_dot_around_right"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
            }else if(SytleNum==3){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_text noteFLeft noteTextLeft" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
            }else if(SytleNum==4){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line5 noteRight3"></div><div class="note_text noteFLeft  tagNum="'+TagNum[0]+'""  textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
            }else{
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div></div>';
            }
        }else if(LineNum==2)    {
            if(SytleNum==1){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1"></div><div class="note_line note_line2"></div><div class="note_text noteFLeft noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft" tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
            }else if(SytleNum==2){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg noteRight9"></div><div class="note_dot_around noteRight5"></div><div class="note_line note_line1 noteRight"></div><div class="note_line note_line2 noteRight"></div><div class="note_text noteFRight noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
            }else if(SytleNum==3){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_line note_line4"></div><div class="note_text noteFLeft noteTextTop4 noteTextLeft"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
            }else if(SytleNum==4){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line5 noteRight3"></div><div class="note_line note_line6 noteRight3"></div><div class="note_text noteFRight noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
            }else{
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1"></div><div class="note_line note_line2"></div><div class="note_text noteFLeft noteTextTop4"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div></div>';
            }
        }else if(LineNum==3)    {
            if(SytleNum==1){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1 noteLineHeight noteLineTop"></div><div class="note_line note_line2 noteLineHeight"></div><div class="note_text noteFLeft noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
            }else if(SytleNum==2){
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg noteRight9"></div><div class="note_dot_around noteRight5"></div><div class="note_line note_line1 noteLineHeight noteLineTop noteRight"></div><div class="note_line note_line2 noteLineHeight noteRight"></div><div class="note_text noteFRight noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFRight noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
            }else if(SytleNum==3){
                $("#TempText1").html(TagArr[2]);
                var LineML=-($("#TempText1").width()+40);
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line3"></div><div class="note_line note_line4"></div><div class="note_line note_line5 noteLeft2"></div><div class="note_text noteFLeft noteTextTop4 noteTextLeft" tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextLeft"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop2" style="margin-left:'+LineML+'px"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
            }else if(SytleNum==4){
                $("#TempText2").html(TagArr[2]);
                var LineMR=-($("#TempText2").width()+61);
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg  note_dot_2right"></div><div class="note_dot_around  note_dot_around_2right"></div><div class="note_line note_line3 noteRight50"></div><div class="note_line note_line5 noteRight3"></div><div class="note_line note_line6 noteRight3"></div><div class="note_text noteFRight noteTextTop4" tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFRight" tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFRight noteTextTop2" style="margin-right:'+LineMR+'px"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
            }else{
                TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_line note_line1 noteLineHeight noteLineTop"></div><div class="note_line note_line2 noteLineHeight"></div><div class="note_text noteFLeft noteTextTop5"  tagNum="'+TagNum[0]+'" textNum="'+textNum[0]+'">'+TagArr[0]+'</div><div class="note_text noteFLeft noteTextTop2"  tagNum="'+TagNum[1]+'" textNum="'+textNum[1]+'">'+TagArr[1]+'</div><div class="note_text noteFLeft noteTextTop"  tagNum="'+TagNum[2]+'" textNum="'+textNum[2]+'">'+TagArr[2]+'</div></div>';
            }
        }else{
            TagHtml='<div class="NoteContent"><div class="note_dot note_dot_bg"></div><div class="note_dot_around"></div><div class="note_text noteFLeft noteTextTop2" tagNum="'+TagNum[0]+'"  textNum="'+textNum[0]+'" >'+TagArr[0]+'</div></div>';
        }
        return TagHtml;
    }

    /*************************************TagDotEnd**************************************/
    //点喜欢或不喜欢比例条以及数据
    function LineWidth() {
        $(".LikeLine").width(0);
        $(".UnlikeLine").width(0);
        var LikeCount = $scope.LikeCount;
        var UnLikeCount = $scope.UnLikeCount;
        var AllCount = LikeCount + UnLikeCount;
        if (AllCount == 0) {
            var LikeLinePercent = 50;
        } else {
            var LikeLinePercent = Math.round((LikeCount / AllCount) * 100);
        }
        var UnLikeLinePercent = 100 - LikeLinePercent;
        var LikeLineWidth = Math.round(PercentLineWidth * LikeLinePercent / 100);
        var UnLikeLineWidth = PercentLineWidth - LikeLineWidth;
        $scope.LikeLinePercent = LikeLinePercent;
        $scope.UnLikeLinePercent = UnLikeLinePercent;
        $scope.LikeLineWidth = LikeLineWidth;
        $scope.UnLikeLineWidth = UnLikeLineWidth;
    }

    //点喜欢或不喜欢动画
    var zanAnimate = function (flag) {
        if (flag) {
            $scope.addlike = !$scope.addlike;
        } else {
            $scope.addunlike = !$scope.addunlike;
        }
        $scope.likeAnimate = "likeAnimate";
        $scope.unlikeAnimate = "unlikeAnimate";
        $timeout(
            function () {
                if (flag) {
                    $scope.addlike = !$scope.addlike;
                } else {
                    $scope.addunlike = !$scope.addunlike;
                }
            }, 500);
    };

    // 点击喜欢喝不喜欢按钮
    var isclickLiked = true;// 是否已经点过
    $scope.LikeProductFn = function (flag) {
        if (isclickLiked) {
            zanAnimate(flag);
            if (flag) {
                $scope.LikeCount = $scope.LikeCount + 1;
            } else {
                $scope.UnLikeCount = $scope.UnLikeCount + 1
            }
            LineWidth();
            $(".LikeLine").animate({ width: $scope.LikeLineWidth + "px" }, 2000);
            $(".UnlikeLine").animate({ width: $scope.UnLikeLineWidth + "px" }, 2000);
            if ($scope.LikeCount * 1 > 9999) {
                $scope.LikeCountText = "9999+";
            } else {
                $scope.LikeCountText = $scope.LikeCount;
            }
            if ($scope.UnLikeCount * 1 > 9999) {
                $scope.UnLikeCountText = "9999+";
            } else {
                $scope.UnLikeCountText = $scope.UnLikeCount;
            }

            var maylikeurl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/Like';
            var uid = window.getQueryStringByKey('UID');
            var ID = window.getQueryStringByKey('ID');
            var maylikeParam = {
                UID: uid,
                ShowIndexID: ID,
                IsLike: flag
            };
            $http.post(maylikeurl, maylikeParam).success(function (data) {
            });
            isclickLiked = false;
        }

    }

    // 评论数据的接口
    var commentUrl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/FetchShowIndexComment';
    var ID = window.getQueryStringByKey('ID');
    var UID = window.getQueryStringByKey('UID');
    var param = {
        ShowIndexID: ID,
        PageSize: 3,
        UID: UID
    };

    $scope.allCommentTitle = true;

    var FetchCommentDetailUrl = function () {
        $http.post(commentUrl, param).success(function (data) {
            if (data.IsSuccess) {
                if (data.Data.length == 0) {
                    $scope.allCommetnCount = 0;
                } else {
                    $scope.allCommetnCount = data.Data[0].CommentCount;
                    if (data.Data[0].CommentCount <= 3) {
                        $scope.allCommentTitle = true;
                    } else {
                        $scope.allCommentTitle = false;
                    }
                }
                console.log(data.Data.length);
                var item = data.Data;
                for (var i = 0; i < item.length; i++) {
                    if (item[i].YEAR > 0) {
                        item[i].commentTime = item[i].YEAR + '年前';
                    } else {
                        if (item[i].mouth > 0) {
                            item[i].commentTime = item[i].mouth + '月前';
                        } else {
                            if (item[i].DAY > 0) {
                                item[i].commentTime = item[i].DAY + '天前';
                            } else {
                                if (item[i].HOUR > 0) {
                                    item[i].commentTime = item[i].HOUR + '小时前';
                                } else {
                                    if (item[i].min > 0) {
                                        item[i].commentTime = item[i].min + '分钟前';
                                    } else {
                                        item[i].commentTime = item[i].Sec + '秒前';
                                    }
                                }
                            }
                        }
                    }
                    var CommentLiked = item[i].CommentLiked;
                    if (CommentLiked == 1) {
                        item[i].ShowCommentLike = true;
                    } else {
                        item[i].ShowCommentLike = false;
                    }

                    var LikeCount = item[i].LikeCount;
                    if (LikeCount == 0) {
                        item[i].LikeCount = "赞";
                    }

                    item[i].isanimate = true;
                }

                $scope.comments = item;

            }
        });
    };
    FetchCommentDetailUrl();

    // 点击所有评论
    $scope.allTitleClick = function () {
        var ID = window.getQueryStringByKey('ID');
        var UID = window.getQueryStringByKey('UID');
        window.location.href = "allComment.html?ID=" + ID + "&UID=" + UID;
    }

    //点赞的动画 
    var zanAnimate = function (item) {
        item.isanimate = !item.isanimate;
        $scope.imgAnimate = "imgAnimate";
        $timeout(
            function () {
                item.isanimate = !item.isanimate;
            }, 500);
    };

    //评论点赞
    var SendLikeProductComment = function (commentID, isLiked) {
        var likeCommenturl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/LikeComment';
        var uid = window.getQueryStringByKey('UID');
        var likeCommentParam = {
            UID: uid,
            ShowCommentID: commentID,
            IsLike: isLiked
        };
        $http.post(likeCommenturl, likeCommentParam).success(function (data) {
        });
    };

    // 点赞事件
    $scope.ZanComment = function (item) {
        item.ShowCommentLike = !item.ShowCommentLike;
        if (item.ShowCommentLike == true) {
            zanAnimate(item);
        }
        var isLiked = 0;
        if (item.ShowCommentLike) {
            if (item.LikeCount == '赞') {
                item.LikeCount = 0;
            }
            item.LikeCount = item.LikeCount * 1 + 1;
            isLiked = 1;
        } else {
            item.LikeCount = item.LikeCount * 1 - 1;
            isLiked = 0;
            if (item.LikeCount == 0) {
                item.LikeCount = '赞';
            }
        }
        SendLikeProductComment(item.ID, isLiked);
    }

    // 可能喜欢部分点赞
    $scope.shareZan = function (item) {
        item.ShowMayLike = !item.ShowMayLike;
        var isLiked = -1;
        if (item.ShowMayLike) {
            item.LikeCount = item.LikeCount * 1 + 1;
            isLiked = 1;
        } else {
            item.LikeCount = item.LikeCount * 1 - 1;
            isLiked = -1;
        }
        var maylikeurl = "http://" + window.hostname + '/MeiDeNi/ShowIndex/Like';
        var uid = window.getQueryStringByKey('UID');
        var maylikeParam = {
            UID: uid,
            ShowIndexID: item.ID,
            IsLike: isLiked
        };
        $http.post(maylikeurl, maylikeParam).success(function (data) {
        });
    }

}]);

$(document).ready(function () {
    var hammer = new Hammer($("#uploadImg").get(0));
    hammer.on("swipeleft", function () {
        var $ele = $("#uploadImg").find(".currentShow");
        var hasNextClass = $ele.next().hasClass("ShowImageDiv");
        if (hasNextClass) {
            var currentHeigth = $ele.height();
            var nextHeight = $ele.next(".ShowImageDiv").height();
            $ele.next(".ShowImageDiv").height(currentHeigth);
            $ele.animate({ "left": "-100%" }, 500, function () {
                $ele.removeClass("currentShow").hide();
            });
            $ele.next(".ShowImageDiv").css({ "display": "inline-block" }).animate({ "left": "0px", "height": nextHeight + "px" }, 500, function () {
                $ele.next(".ShowImageDiv").addClass("currentShow");
            });
        }
    });

    hammer.on("swiperight", function () {
        var $ele = $("#uploadImg").find(".currentShow");
        var hasPreClass = $ele.prev().hasClass("ShowImageDiv");
        if (hasPreClass) {
            var currentHeigth = $ele.height();
            var preHeight = $ele.prev(".ShowImageDiv").height();
            $ele.prev(".ShowImageDiv").height(currentHeigth);
            $ele.animate({ "left": "100%" }, 500, function () {
                $ele.removeClass("currentShow").hide();
            });
            $ele.prev(".ShowImageDiv").css({ "display": "inline-block" }).animate({ "left": "0px", "height": preHeight + "px" }, 500, function () {
                $ele.prev(".ShowImageDiv").addClass("currentShow");
            });
        }
    });
});

