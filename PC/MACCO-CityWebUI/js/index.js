//滚动
(function ($) {
    $.fn.extend({
        Scroll: function (opt, callback) {
            if (!opt) var opt = {};
            var _this = this.eq(0).find("ul:first");
            var lineH = _this.find("li:first").height(), 
            line = opt.line ? parseInt(opt.line, 10) : parseInt(this.height() / lineH, 10), 
            speed = opt.speed ? parseInt(opt.speed, 10) : 500,
            timer = opt.timer ? parseInt(opt.timer, 10) : 2000;
            if (line == 0) line = 1;
            var upHeight = 0 - line * lineH;
            var downHeight=line * lineH - 0;
            scrollUp = function () {
                _this.animate(
                    { marginTop: upHeight },
                    speed,
                    function () {
                        for (i = 1; i <= line; i++) {
                            _this.find("li:first").appendTo(_this);
                        }
                        _this.css({ marginTop: 0 });
                    }
                    );
            },

            scrollDown = function () {
                _this.animate(
                    { marginTop: downHeight },
                    speed,
                    function () {
                        _this.find("li:last").prependTo(_this);
                        _this.css({ marginTop: 0 });
                    }
                    )
            }
            var timerID
            
            _this.hover(function () {
                clearInterval(timerID);
            }, function () {
                timerID = setInterval("scrollUp()", timer);
            }).mouseout();
        }
    })
})(jQuery);

$(document).ready(function () {
    //重要公告滚动
    $("#scrollDiv").Scroll({line:1,speed:1000,timer:2000});
});


//重要公告
$.ajax({ 
    type: "GET", 
    url: "json/IndexZYGG.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        announcArr=data.Data;
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

var dpArr=[];
//平台动态
$.ajax({ 
    type: "GET", 
    url: "json/IndexPTDT.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        dpArrFirst=data.Data[0];
        for(i=0;i<3;i++){
          dpArr[i]=data.Data[i+1]; 
      }
  }, 
  error: function (XMLHttpRequest, textStatus, errorThrown) { 
    alert(errorThrown); 
} 
});
//招标公告
$.ajax({ 
    type: "GET", 
    url: "json/IndexZBGG.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        zbggArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//开标记录
$.ajax({ 
    type: "GET", 
    url: "json/IndexKBJL.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        kbjlArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//评标公示
$.ajax({ 
    type: "GET", 
    url: "json/IndexPBGS.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        pbgsArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//中标公告
$.ajax({ 
    type: "GET", 
    url: "json/IndexZOBGG.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        zobggArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//合同备案
$.ajax({ 
    type: "GET", 
    url: "json/IndexHTBA.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        htbaArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

//通知专区
$.ajax({ 
    type: "GET", 
    url: "json/IndexTZGG.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        tzzqArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//学习专区
$.ajax({ 
    type: "GET", 
    url: "json/IndexXXZQ.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        xxzqArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//评委考试
$.ajax({ 
    type: "GET", 
    url: "json/IndexPWKS.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        pwksArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//监督公告
$.ajax({ 
    type: "GET", 
    url: "json/IndexJDGG.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        jdggArr=data.Data; 
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//交易数据
$.ajax({ 
    type: "GET", 
    url: "json/IndexJYSJ.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        jysjArrTitle=data.Data.Title;
        jysjArr=data.Data.Projects;
        jysjCount1=0;
        jysjCount2=0;
        jysjCount3=0;
        for(i=0;i<data.Data.Projects.length;i++){
            jysjCount1=jysjCount1+data.Data.Projects[i].Count*1;
            jysjCount2=jysjCount2+data.Data.Projects[i].TransAmount*1;
            jysjCount3=jysjCount3+data.Data.Projects[i].BidAmount*1;
        }
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

//滚动图片
$.ajax({ 
    type: "GET", 
    url: "json/IndexBanner.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        BannerList=data.Data;
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
var model = avalon.define({
    $id:"indexController",
    BannerList:BannerList,
    announcList:announcArr,
    dpListFirst:dpArrFirst,
    dpList:dpArr,
    zbggList:zbggArr,
    kbjlList:kbjlArr,
    pbgsList:pbgsArr,
    zobggList:zobggArr,
    htbaList:htbaArr,
    tzzqList:tzzqArr,
    xxzqList:xxzqArr,
    pwksList:pwksArr,
    jdggList:jdggArr,
    jysjTitle:jysjArrTitle,
    jysjList:jysjArr,
    jysjCount1:jysjCount1,
    jysjCount2:jysjCount2,
    jysjCount3:jysjCount3,
    currentIndex:1,
    setTab: function(index) {
        model.currentIndex = index;
    },
    currentIndex2:1,
    Tabchange: function(index) {
        model.currentIndex2 = index;
    },
    currentBanner:1,
    CurBannerID:BannerList[0].ID,
    CurBannerTitle:BannerList[0].Title,
    BtnBannerClick:function(index){
        BannerListCount=BannerList.length;
        if(index==2){
            if(model.currentBanner<BannerListCount){
                model.currentBanner++;
            }else{
                model.currentBanner=1;
            }
        }else{
            if(model.currentBanner>1){
                model.currentBanner--;
                model.CurBannerTitle=BannerList[model.currentBanner-1].Title;
                model.CurBannerID=BannerList[model.currentBanner-1].ID;
            }else{
                model.currentBanner=BannerListCount;
            }
        }
        model.CurBannerTitle=BannerList[model.currentBanner-1].Title;
        model.CurBannerID=BannerList[model.currentBanner-1].ID;
    }
}); 
//Banner图片滚动
var BannerTimer = setInterval(function() {model.BtnBannerClick(2)},2500);
function BannerHover(){
    clearInterval(BannerTimer);
}
function BannerOut(){
    BannerTimer = setInterval(function() {model.BtnBannerClick(2)},2500);
}
