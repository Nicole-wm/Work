phonecatApp.controller('ZanCtrl', function ($scope, $http,macco,$location, $rootScope,$interval) {
    var platform = window.getQueryStringByKey('platform');
    if (platform == 'iOS') {
      $scope.headTop = 'margin-top:17.5px';
    }
    $scope.macco = new macco();
    var tryMakeupID = window.getQueryStringByKey('ID');
    var uid = window.getQueryStringByKey('UID');
    //初始化赞呸
    var likecountUrl= "http://" + window.hostname + '/MeiDeNi/TryMakeup/FetchLikeCount';
    $http.post(likecountUrl, { TryMakeupID: tryMakeupID }).success(function (data) {
      if (data.IsSuccess) {
        var result = data.Data;
        if (result.length > 0) {
          $scope.DisLikeCount = result[0].DislikeCount * 1;
          $scope.LikeCount = result[0].LikeCount * 1;
          var total = result[0].DislikeCount * 1 + result[0].LikeCount * 1;
          if (total > 0) {
            $scope.PraiseStyle = "width:" + Math.ceil(result[0].LikeCount * 1 / total * 100) + '%';
            $scope.PeiStyle = "width:" + (100 - Math.ceil(result[0].LikeCount * 1 / total * 100)) + "%";
          } else {
            $scope.PraiseStyle = "width:50%";
            $scope.PeiStyle = "width:50%";
            $scope.DisLikeCount = 0;
            $scope.LikeCount = 0;
          }
        } else {
          $scope.PraiseStyle = "width:50%";
          $scope.PeiStyle = "width:50%";
          $scope.DisLikeCount = 0;
          $scope.LikeCount = 0;
        }
      }
    });
    /*赞和呸点击*/
    var TryMakeUpLike = function (flag) {
      var sendLikeUrl = "http://" + window.hostname + "/MeiDeNi/Trymakeup/Like";
      var sendparam = {
        TryMakeupID:tryMakeupID*1,
        IsLike: flag,
        UID: uid
      };
      $http.post(sendLikeUrl, sendparam).success(function (data) {
        if (data.IsSuccess) {
          if (uid != -1 && uid != "") {
            $rootScope.FetchCommentAvatar();
          }
        }
      });

      if (uid != '' && uid != -1) {
        var trackingUrl = "http://" + window.hostname + '/MeiDeNi/UserTracking/TrackingUser';
        var trackingData = {
          ObjectID: tryMakeupID * 1,
          Type:IsLike? 'LikeTryMakeup' : 'DisLikeTryMakeup',
          UID: uid
        };
        $http.post(trackingUrl, trackingData).success(function (data) {
          console.dir(data);
        });
      }
    };

    $scope.LikeTrigger = 0;
    $scope.UnlikeTigger = 0;
    var isLiked = true; // 是否已经点过
    $scope.LikeProductFn = function (flag) {
      $scope.likeBtnList = 'width:100%';
      if (isLiked) {
        if (flag == 1) {
          $scope.LikeCount = $scope.LikeCount * 1 + 1;
          $scope.LikeTrigger = 2;
          $scope.UnlikeTigger = 1;
          $scope.praiseHeadTrigger = 2;
          $scope.peiMouthHeadTrigger = 1;
        }
        else {
          $scope.DisLikeCount = $scope.DisLikeCount * 1 + 1;
          $scope.UnlikeTigger = 2;
          $scope.LikeTrigger = 1;
          $scope.peiMouthHeadTrigger = 2;
          $scope.praiseHeadTrigger = 1;
        }
        var newwidth = screen.width * 0.6 - 64;
        var total = $scope.LikeCount * 1 + $scope.DisLikeCount * 1;
        var likePrecent = $scope.LikeCount / total;
        var dislikePrecent = $scope.DisLikeCount / total;

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
        TryMakeUpLike(flag);
      }
    }
});

var objTop=0;
var platform = window.getQueryStringByKey('platform');
if (platform == 'iOS') {
  objTop=17.5;
}
$(window).on('scroll',function() {
  $("div[trigger='2']").each(function(){
    $(this).attr("trigger","1");
  })
  cTop = $(".btnAttitude").offset().top;
  sTop = $(window).scrollTop();
  if (sTop>=cTop-objTop) {
    $(".btnHead").css("visibility", "visible");
    $(".btnHead").addClass("trans-fadeout");
    $(".btnAttitude").css("visibility", "hidden");
  }else{
    $(".btnHead").css("visibility", "hidden");
    $(".btnHead").removeClass("trans-fadeout");
    $(".btnAttitude").css("visibility", "visible");
  }
});