var productdata = [0, 0, 0, 0, 0];

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
        this.refresh = false;
        this.after = 0;
        this.BirthDay = '';
        this.SkinType = '';
        this.nocomment = false;
        this.isFirst = true;
    };

    var url = "http://" + window.hostname + '/MeiDeNi/Product/FetchNewProductCommentPage';
    var productID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');
    var param = {
        BirthDay: '',
        SkinType: '',
        ProductID: productID,
        PageSize: 10,
        LastID: 0,
        UID: uid
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
        param.BirthDay = this.BirthDay;
        param.SkinType = this.SkinType;
        param.LastID = this.after;
        $http.post(url, param).success(function (data) {
            var items = data.Data;
            console.log(items);
            if (this.isFirst) {
                if (data.Data.length == 0) {
                    this.nocomment = true;
                } else {
                    this.nocomment = false;
                }
            }
            this.isFirst = false;
            for (var i = 0; i < items.length; i++) {
                if (!contains(this.items, items[i].ID)) {
                    items[i].isanimate = true;
                    var commentlike = items[i].CommentLiked * 1;
                    console.log(commentlike);
                    if (commentlike) {
                        items[i].ShowCommentLike = true;
                    } else {
                        items[i].ShowCommentLike = false;
                    }
                    var SkinType = items[i].SkinType;
                    if (SkinType == "干性") {
                        items[i].SkinType = '干性皮肤';
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    } else if (SkinType == "油性") {
                        items[i].SkinType = "油性皮肤";
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    } else if (SkinType == "混合") {
                        items[i].SkinType = '混合性皮肤';
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    } else if (SkinType == "中性") {
                        items[i].SkinType = '中性皮肤';
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    } else if (SkinType == "敏感") {
                        items[i].SkinType = '敏感性皮肤';
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    } else {
                        items[i].SkinType = '';
                    }

                    if (items[i].LikeCount == 0) {
                        items[i].LikeCount = '赞';
                    }
                    var assess = items[i].Assess;
                    if (assess == 0) {
                        items[i].assess = true;
                        items[i].assessurl = '';
                    } else if (assess == 1) {
                        items[i].assess = false;
                        items[i].assessurl = 'image/bad.png';
                        items[i].stateText = '糟糕';
                        items[i].stateColor = 'bad';
                    } else if (assess == 2) {
                        items[i].assess = false;
                        items[i].assessurl = 'image/common.png';
                        items[i].stateText = '普通';
                        items[i].stateColor = 'common';
                    } else if (assess == 3) {
                        items[i].assess = false;
                        items[i].assessurl = 'image/nice.png';
                        items[i].stateText = '不错';
                        items[i].stateColor = 'nice';
                    } else if (assess == 4) {
                        items[i].assess = false;
                        items[i].assessurl = 'image/good.png';
                        items[i].stateText = '好评';
                        items[i].stateColor = 'good';
                    } else if (assess == 5) {
                        items[i].assess = false;
                        items[i].assessurl = 'image/verygood.png';
                        items[i].stateText = '棒呆';
                        items[i].stateColor = 'verygood';
                    } else {
                        items[i].assess = true;
                        items[i].assessurl = '';
                    }
                    
                    // 添加中奖名单
                    var prize = items[i].IsWin;
                    if(prize == 1){
                        items[i].userPrizeComment = "userPrizeComment";
                        items[i].isprize = true;
                    }

                    items[i].IsLike = items[i].IsLike * 1;
                    if (items[i].IsLike == 0) {
                        items[i].LikeOrPei = "呸";
                        items[i].LikeStyle = "pei_head";
                    } else if (items[i].IsLike == 1) {
                        items[i].LikeOrPei = "赞";
                        items[i].LikeStyle = "zan_head";
                    } else {
                        items[i].LikeOrPei = "";
                        items[i].LikeStyle = "";
                    }

                    if (items[i].Age != '') {
                        items[i].leftsign = '(';
                        items[i].rightsign = ')';
                    }
                    if (items[i].Age == '' || items[i].SkinType == '') {
                        items[i].or = '';
                    } else {
                        items[i].or = '/';
                    }

                    if (items[i].YEAR > 0) {
                        items[i].DateDiff = items[i].YEAR + '年前';
                    } else {
                        if (items[i].mouth > 0) {
                            items[i].DateDiff = items[i].mouth + '月前';
                        } else {
                            if (items[i].DAY > 0) {
                                items[i].DateDiff = items[i].DAY + '天前';
                            } else {
                                if (items[i].HOUR > 0) {
                                    items[i].DateDiff = items[i].HOUR + '小时前';
                                } else {
                                    if (items[i].min > 0) {
                                        items[i].DateDiff = items[i].min + '分钟前';
                                    } else {
                                        items[i].DateDiff = items[i].Sec + '秒前';
                                    }
                                }
                            }
                        }
                    }
                    this.items.push(items[i]);
                }
                this.refresh = false;
            }

            if (items.length > 0) {
                this.after = this.items[items.length - 1].ID;
            } else {
                this.after = 0;
            }
        }.bind(this));

        this.busy = false;
    };
    return macco;
}]);


var scope;
var AddTagFromApp;

app.controller('productController', ['$scope', '$http', 'macco', '$window', '$location', '$rootScope', '$interval', '$timeout', function ($scope, $http, macco, $window, $location, $rootScope, $interval, $timeout) {
    var platform = window.getQueryStringByKey('platform');
    if (platform == 'iOS') {
        $(".productlogo").css('margin-top', '30px');
    }
    scope = $scope;
    $scope.macco = new macco();
    $scope.alertmask = true;
    var productID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');

    // 加载动画
    $rootScope.$on('loading:finish', function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.EndLoading.postMessage("true");
            } else {
                window.location.href = "macco://EndLoading/";
            }
        } else if (platform == 'Android') {
            window.demo.endLoading();
        }
    });

    // 返回按钮
    // 点击返回上一页
    $scope.GoBack = function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.popVC.postMessage("");
            } else {
                window.location.href = "macco://topVC/";
            }
        } else if (platform == 'Android') {
            window.demo.finishActivity();
        }
    }

    // 显示详情
    $scope.ShowDetail = function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.goToDetail.postMessage("");
            } else {
                window.location.href = "macco://goToDetail/";
            }
        } else if (platform == 'Android') {
            window.demo.goToDetail();
        }
    };

    // 刷新Tag
    AddTagFromApp = function (tagname, likeCount, productTagID) {
        var tagObj = {};
        tagObj.TagName = tagname;
        tagObj.LikeCount = likeCount;
        tagObj.ProductTagID = productTagID;


        var tempArray = [];
        tempArray.push(tagObj);
        for (var j = 0; j < $scope.Tags.length; j++) {
            var newTagObj = {};
            newTagObj.TagName = scope.Tags[j].TagName;
            newTagObj.LikeCount = scope.Tags[j].LikeCount;
            newTagObj.ProductTagID = scope.Tags[j].ProductTagID;
            if (scope.Tags[j].IsShow != undefined) {
                newTagObj.IsShow = scope.Tags[j].IsShow;
            }
            tempArray.push(newTagObj);
        }

        if (tempArray.length == 0) {
            $scope.hasNoTags = true;
        } else {
            $scope.hasNoTags = false;
        }
        for (var i = 0; i < tempArray.length; i++) {
            tempArray[i].IsShow = true;
            if (i > 6) {
                tempArray[i].IsShow = false;
            }
        }

        $scope.Tags = [];
        $scope.Tags = tempArray;
        // $scope.$apply();
        window.scroll(0, 10);
    };

    // 添加Tag
    $scope.AddTag = function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.addTag.postMessage("");
            } else {
                window.location.href = "macco://addTag/";
            }
        } else if (platform == 'Android') {
            window.demo.addTag();
        }
    };

    var AddTagCount = function (productTagID) {
        var TagCountUrl = "http://" + window.hostname + "/MeiDeNi/Product/LikeProductTag";
        var tagcountparam = {
            ProductTagID: productTagID * 1
        };
        $http.post(TagCountUrl, tagcountparam).success(function (data) {
        });
    };

    //Tag点赞
    $scope.ClickTag = function (tag) {
        if (tag.IsClicked == undefined) {
            tag.LikeCount++;
            tag.IsClicked = true;
            AddTagCount(tag.ProductTagID);
        }
    }

    $scope.hasNoTags = false;


    // 产品基本数据的接口地址
    var productDetailUrl = "http://" + window.hostname + '/MeiDeNi/Product/FetchNewProductDetailPage';
    var param = {
        ProductID: productID
    };
    var FetchProductDetail = function () {
        $http.post(productDetailUrl, param).success(function (data) {
            if (data.IsSuccess) {
                $scope.Product = data.Data;
                $scope.Tags = data.Data.Tags;
                $scope.Comments = data.Data.Comments;
                var Assess = data.Data.Assess;
                for (var i = 0; i < Assess.length; i++) {
                    var AssessValue = Assess[i].Assess * 1;
                    var AssessCount = Assess[i].AssessCount * 1;
                    if (AssessValue != 0) {
                        productdata[AssessValue - 1] = AssessCount;
                    }
                }
                init();

                // productChart();
                if (data.Data.Tags.length == 0) {
                    $scope.hasNoTags = true;
                    $scope.tagheight = 0;
                } else {
                    $scope.hasNoTags = false;
                    if (data.Data.Tags.length <= 9) {
                        $scope.tagheight = 1;
                    } else {
                        $scope.tagheight = 2;
                    }
                }

                checkTagHeight(data.Data.Tags.length);

                // 星星和人数
                var rank;
                var dataRank = data.Data.Rank * 2;
                var intdataRank = Math.round(dataRank) / 2;
                if (intdataRank > 5) {
                    rank = 5;
                } else if (intdataRank < 0) {
                    rank = 0;
                } else {
                    rank = intdataRank;
                }
                var rankInt = parseInt(rank);
                var halfStarCount = 0;
                var rank_c = rank - rankInt;
                if (rank_c == 0.5) {
                    halfStarCount = 1;
                } else if (rank_c > 0.5) {
                    rankInt = rankInt + 1;
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
                $scope.RankPercent = data.Data.Rank * 2;
                $scope.macco.refresh = 0;
                // checkTagHeight();
                // $timeout(checkTagHeight, 0);
            }
        });
    };

    $scope.ShowHideTags = function () {
        var listHeight = $(".comment_list").height();
        if (listHeight == 96) {
            $(".comment_list").css({ "height": "auto" });
            $(".comment_details .comment_detail").show();
            $(".comment_pull img").attr({ "src": "image/push.png" });
        } else {
            $(".comment_list").css({ "height": "96px" });
            $(".comment_pull img").attr({ "src": "image/pull.png" });
        }
    }

    FetchProductDetail();
    var ProductLike = function (flag) {
        var sendLikeUrl = "http://" + window.hostname + "/MeiDeNi/Product/LikeProduct";
        var sendparam = {
            ProductID: productID * 1,
            IsLike: flag,
            UID: uid
        };
        $http.post(sendLikeUrl, sendparam).success(function (data) {
            if (data.IsSuccess) {
                if (uid != -1 && uid != "") {
                    FetchProductDetail();
                }
            }
        });

        if (uid != '' && uid != -1) {
            var trackingUrl = "http://" + window.hostname + '/MeiDeNi/UserTracking/TrackingUser';
            var trackingData = {
                ObjectID: productID * 1,
                Type: flag ? 'LikeProduct' : 'DisLikeProduct',
                UID: uid
            };
            $http.post(trackingUrl, trackingData).success(function (data) {
            });
        }
    };


    $scope.LikeTrigger = 0;
    $scope.UnlikeTigger = 0;
    var isLiked = true; // 是否已经点过
    /*
     *  是否已经点赞
     */
    $scope.LikeProductFn = function (flag) {
        $scope.likeBtnList = 'width:100%';
        if (isLiked) {
            if (flag == 1) {
                $scope.Product.LikeCount = $scope.Product.LikeCount * 1 + 1;
                $scope.LikeTrigger = 2;
                $scope.UnlikeTigger = 1;
                $scope.praiseHeadTrigger = 2;
                $scope.peiMouthHeadTrigger = 1;
            }
            else {
                $scope.Product.UnLikeCount = $scope.Product.UnLikeCount * 1 + 1;
                $scope.UnlikeTigger = 2;
                $scope.LikeTrigger = 1;
                $scope.peiMouthHeadTrigger = 2;
                $scope.praiseHeadTrigger = 1;
            }
            var newwidth = screen.width * 0.7 - 60;
            var total = $scope.Product.LikeCount * 1 + $scope.Product.UnLikeCount * 1;
            var likePrecent = $scope.Product.LikeCount / total;
            var dislikePrecent = $scope.Product.UnLikeCount / total;

            var animateTime = 1000;
            var animateDuration = 10;
            var animateCount = animateTime / animateDuration;
            var likePrecentUnit = likePrecent / animateCount;
            var dislikePrecentUnit = dislikePrecent / animateCount;
            var aninateLoop = 1;
            $scope.LikePrecent = 'width:0px';
            $scope.DisLikePrecent = 'width:0px';
            $interval(function () {
                var newLikePrecent = newwidth * aninateLoop * likePrecentUnit;
                var newDisLikePrecent = newwidth * aninateLoop * dislikePrecentUnit;
                $scope.LikePrecent = 'width:' + newLikePrecent + 'px;background-color: #ff4a83;';
                $scope.DisLikePrecent = 'width:' + newDisLikePrecent + 'px;background: #1dd1c6;';
                aninateLoop = aninateLoop + 1;
                if (aninateLoop == animateCount + 1) {
                    var zanwidth = parseInt($(".like").width());
                    var peiwidth = newwidth - zanwidth;
                    $scope.LikePrecent = 'width:' + zanwidth + 'px;background-color: #ff4a83;';
                    $scope.DisLikePrecent = 'width:' + peiwidth + 'px;background: #1dd1c6;';
                }
            }, animateDuration, animateCount, true, function () {
            });

            isLiked = false;

            ProductLike(flag);
        }

    }

    //评论点赞
    var SendLikeProductComment = function (commentID, isLiked) {
        var likeCommenturl = "http://" + window.hostname + '/MeiDeNi/Product/UserProductCommentLike';
        var uid = window.getQueryStringByKey('UID');
        var likeCommentParam = {
            UID: uid,
            CommentID: commentID,
            IsLike: isLiked
        };
        $http.post(likeCommenturl, likeCommentParam).success(function (data) {
        });
    };

    //点赞的动画 
    var zanAnimate = function (item) {
        item.isanimate = !item.isanimate;
        $scope.imgAnimate = "imgAnimate";
        $timeout(
            function () {
                item.isanimate = !item.isanimate;
            }, 500);
    };

    $scope.ZanComment = function (item) {
        console.log(item.CommentLiked);
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

    var share = window.getQueryStringByKey('share');
    if (share == 'no') {
        $scope.IsShowFooter = false;
    } else {
        $scope.IsShowFooter = true;
        $scope.imgBackHide = true;
        $scope.addImgclass = "addImgclass";
    }

    $scope.download = function () {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.imacco.mup004';
    };

    //下拉刷新
    var addUpRefresh = function () {
        var mouseStart_height;
        var mouseMove_height;
        var mouseStop_height;
        var scrollTop;

        $(document).bind('touchstart', function (e) {
            mouseStart_height = e.originalEvent.changedTouches[0].pageY;
        });

        $(document).bind('touchmove', function (e) {
            mouseMove_height = e.originalEvent.changedTouches[0].pageY;
            scrollTop = $(document).scrollTop();
            if (scrollTop == 0) {
                if (mouseMove_height - mouseStart_height >= 30) {
                    $scope.macco.refresh = 1;
                    // $scope.$apply();
                }
            }
        });

        $(document).bind('touchend', function (e) {
            mouseStop_height = e.originalEvent.changedTouches[0].pageY;
            if (scrollTop == 0) {
                if (mouseStop_height - mouseStart_height >= 30) {
                    FetchProductDetail();
                    $scope.reloadDataFn();
                }
            }
        });
    };
    addUpRefresh();

    //选择年龄
    var selecAgePublic = function () {
        var skin = $scope.skin;
        var skintext;
        if (skin == '所有肤质') {
            skintext = '';
        } else if (skin == '油性肤质') {
            skintext = '油性';
        } else if (skin == '干性肤质') {
            skintext = '干性';
        } else if (skin == '混合肤质') {
            skintext = '混合';
        }
        else if (skin == '中性肤质') {
            skintext = '中性';
        }
        else if (skin == '敏感肤质') {
            skintext = '敏感';
        }
        $scope.macco.SkinType = skintext;
        $scope.macco.busy = false;
        $scope.macco.items = [];
        $scope.macco.after = 0;
        $scope.macco.isFirst = true;
        $scope.$emit('list:reload');
        window.scroll(0, 10);
    };

    $scope.age = '所有年龄';
    $scope.agetext = function () {
        var age = $scope.age;
        var BirthDay;
        if (age == '所有年龄') {
            $scope.macco.BirthDay = '';
            selecAgePublic();
        } else if (age == '18岁以下') {
            $scope.macco.BirthDay = '18岁以下';
            selecAgePublic();
        } else if (age == '19-24岁') {
            $scope.macco.BirthDay = '19-24岁';
            selecAgePublic();
        } else if (age == '25-30岁') {
            $scope.macco.BirthDay = '25-30岁';
            selecAgePublic();
        } else if (age == '31-40岁') {
            $scope.macco.BirthDay = '31-40岁';
            selecAgePublic();
        }
    };

    var selecSkinPublic = function () {
        var age = $scope.age;
        var BirthDay;
        if (age == '所有年龄') {
            BirthDay = '';
        } else if (age == '18岁以下') {
            BirthDay = '18岁以下';
        } else if (age == '19-24岁') {
            BirthDay = '19-24岁';
        } else if (age == '25-30岁') {
            BirthDay = '25-30岁';
        } else if (age == '31-40岁') {
            BirthDay = '31-40岁';
        }
        $scope.macco.BirthDay = BirthDay;
        $scope.macco.busy = false;
        $scope.macco.items = [];
        $scope.macco.after = 0;
        $scope.macco.isFirst = true;
        $scope.$emit('list:reload');
        window.scroll(0, 10);
    };

    //选择肤质
    $scope.skin = '所有肤质';
    $scope.skintext = function () {
        var skinType;
        var skin = $scope.skin;

        if (skin == '所有肤质') {
            $scope.macco.SkinType = '';
            selecSkinPublic();
        } else if (skin == '干性肤质') {
            $scope.macco.SkinType = '干性';
            selecSkinPublic();
        } else if (skin == '油性肤质') {
            $scope.macco.SkinType = '油性';
            selecSkinPublic();
        } else if (skin == '混合肤质') {
            $scope.macco.SkinType = '混合';
            selecSkinPublic();
        } else if (skin == '中性肤质') {
            $scope.macco.SkinType = '中性';
            selecSkinPublic();
        } else if (skin == '敏感肤质') {
            $scope.macco.SkinType = '敏感';
            selecSkinPublic();
        }
    };
    // 点击评分 弹出评论
    $scope.expressionClick = function () {
        var platform = window.getQueryStringByKey('platform');
        if (platform == 'iOS') {
            if (window.webkit) {
                window.webkit.messageHandlers.alertComment.postMessage("");
            } else {
                window.location.href = "macco://alertComment/";
            }
        } else if (platform == 'Android') {
            window.demo.alertComment();
        }
    };

    $scope.reloadDataFn = function () {
        FetchProductDetail();
        $scope.macco.after = 0;
        $scope.macco.items = [];
        $scope.macco.isFirst = true;
        $scope.$emit('list:reload');
        window.scroll(0, 10);
    };
}]);

$(document).ready(function () {
    var platform = window.getQueryStringByKey('platform');
    var commentbgTop;
    var resetTop = 0;
    var opt = {
        preset: 'select',
        theme: "default",
        mode: "scroller",
        display: "bottom",
        animate: "slideup"
    }
    $('.agetext').scroller(opt);
    $(".skintext").scroller(opt);

    var producttitleTop = $(".producttitle").offset().top;

    $(document).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (platform == 'iOS') {
            if (scrollTop >= producttitleTop - 18) {
                $(".producttitle").addClass("titleColorIos");
                $(".productscore").css("margin-top", "30px");
            } else {
                $(".productscore").css("margin-top", "8px");
                $(".producttitle").removeClass("titleColorIos");
            }

            commentbgTop = $(".commentbg").offset().top - 34;
            var positonState = $(".fixcomment").css("position");
            if (positonState == 'relative') {
                if (scrollTop >= commentbgTop) {
                    resetTop = commentbgTop;
                    $(".comment").css("margin-top", "119px");
                    $(".fixcomment").css({ "position": "fixed", "top": "34px", "left": "0px", "margin-top": "0px" });
                }
            } else {
                if (scrollTop < resetTop) {
                    $(".comment").css("margin-top", "0px");
                    $(".fixcomment").css({ "position": "relative", "margin-top": "30px", "top": "0px" });
                }
            }
        } else {
            if (scrollTop >= producttitleTop) {
                $(".producttitle").addClass("titleColor");
                $(".productscore").css("margin-top", "73px");
            } else {
                $(".productscore").css("margin-top", "8px");
                $(".producttitle").removeClass("titleColor");
            }

            commentbgTop = $(".commentbg").offset().top - 22;
            var positonState = $(".fixcomment").css("position");
            if (positonState == 'relative') {
                if (scrollTop >= commentbgTop) {
                    resetTop = commentbgTop;
                    $(".comment").css("margin-top", "111px");
                    $(".fixcomment").css({ "position": "fixed", "top": "22px", "left": "0px", "margin-top": "0px" });
                }
            } else {
                if (scrollTop < resetTop) {
                    $(".comment").css("margin-top", "0px");
                    $(".fixcomment").css({ "position": "relative", "margin-top": "30px", "top": "0px" });
                }
            }
        }
    });
});

function checkTagHeight(length) {
    if (length <= 9) {
        $(".comment_pull").hide();
        $(".comment_list").css({ "height": "auto" });
    } else {
        $(".comment_pull").show();
        $(".comment_list").css({ "height": "96px" });   
    }
};

function reloadData() {
    setTimeout(function () {
        document.getElementById('ReloadData').click();
    }, 1000);
}
