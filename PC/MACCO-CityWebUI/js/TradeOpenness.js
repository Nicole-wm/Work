//今日统计
$.ajax({ 
    type: "GET", 
    url: "json/TradeOpennessCount.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        ZBGGCount=data.Data.ZBGGCount;
        KBJLCount=data.Data.KBJLCount;
        PBGSCount=data.Data.PBGSCount;
        ZHBGGCount=data.Data.ZHBGGCount;
        HTBACount=data.Data.HTBACount;
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});
//交易公开列表
var JYGKArr=[];
var JYGKArr1=[];
var JYGKArr2=[];
var JYGKArr3=[];
var JYGKArr4=[];
var JYGKArr5=[];
$.ajax({ 
    type: "GET", 
    url: "json/TradeOpennessList.json", 
    dataType: "json",
    async:false,  
    success: function (data) {
        var i=0;
        var j=0;
        var k=0;
        var m=0;
        var n=0;
        var o=0;
        var p=0;
        for(i=0;i<5;i++){
            JYGKArr[j++]=data.Data.DataList[i]; 
            AllPage=data.Data.PageDetails.AllPage;
            CurPage=data.Data.PageDetails.CurPage;
        }
        for(i=5;i<10;i++){
            JYGKArr1[k++]=data.Data.DataList[i];
            AllPage1=data.Data.PageDetails.AllPage1;
            CurPage1=data.Data.PageDetails.CurPage1;  
        }
        for(i=10;i<15;i++){
            JYGKArr2[m++]=data.Data.DataList[i]; 
            AllPage2=data.Data.PageDetails.AllPage2;
            CurPage2=data.Data.PageDetails.CurPage2; 
        }
        for(i=15;i<20;i++){
            JYGKArr3[n++]=data.Data.DataList[i];  
            AllPage3=data.Data.PageDetails.AllPage3;
            CurPage3=data.Data.PageDetails.CurPage3;
        }
        for(i=20;i<25;i++){
            JYGKArr4[o++]=data.Data.DataList[i]; 
            AllPage4=data.Data.PageDetails.AllPage4;
            CurPage4=data.Data.PageDetails.CurPage4; 
        }
        for(i=25;i<30;i++){
            JYGKArr5[p++]=data.Data.DataList[i]; 
            AllPage5=data.Data.PageDetails.AllPage5;
            CurPage5=data.Data.PageDetails.CurPage5; 
        }
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

var model = avalon.define({
    $id:"TradeOpennessController",
    currentIndex:1,
    currentTime:0,
    Page1:0,
    Page2:0,
    Page3:1,
    Page4:1,
    ZBGGCount:ZBGGCount,
    KBJLCount:KBJLCount,
    PBGSCount:PBGSCount,
    ZHBGGCount:ZHBGGCount,
    HTBACount:HTBACount,
    JYGKList:JYGKArr,
    AllPage:AllPage,
    CurPage:CurPage,
    TimeClick: function(cur) {
        model.currentTime = cur;
        model.Page1=0;
        model.Page2=0;
        model.Page3=1;
        model.Page4=1;
        model.CurPage=1;
    },

    MenuClick: function(cur) {
        model.currentIndex = cur;
        model.Page1=0;
        model.Page2=0;
        model.Page3=1;
        model.Page4=1;
        model.CurPage=1;
        switch(cur*1)
        {
            case 1: 
            model.JYGKList=JYGKArr;
            model.AllPage=AllPage;
            model.CurPage=CurPage;
            break;
            case 2: 
            model.JYGKList=JYGKArr1;
            model.AllPage=AllPage1;
            model.CurPage=CurPage1;
            break;
            case 3: 
            model.JYGKList=JYGKArr2;
            model.AllPage=AllPage2;
            model.CurPage=CurPage2;
            break;
            case 4: 
            model.JYGKList=JYGKArr3;
            model.AllPage=AllPage3;
            model.CurPage=CurPage3;
            break;
            case 5: 
            model.JYGKList=JYGKArr4;
            model.AllPage=AllPage4;
            model.CurPage=CurPage4;
            break;
            case 6: 
            model.JYGKList=JYGKArr5;
            model.AllPage=AllPage5;
            model.CurPage=CurPage5;
            break;
            default: 
            model.JYGKList=JYGKArr;
            model.AllPage=AllPage;
            model.CurPage=CurPage;
        }
    },

    PageClick: function(cur) {
        switch(cur*1)
        {
            case 1: 
            model.JYGKList=JYGKArr2;
            model.CurPage=1;
            model.Page1=0;
            model.Page2=0;
            model.Page3=1;
            model.Page4=1;       
            break;
            case 2: 
            model.Page3=1;
            model.Page4=1;
            if(model.CurPage>1){
                if(model.CurPage==2){
                    model.Page1=0;
                    model.Page2=0;
                }
                model.JYGKList=JYGKArr3;
                model.CurPage=model.CurPage-1;
            }
            break;
            case 3:
            model.Page1=1;
            model.Page2=1;
            if(model.CurPage<model.AllPage){
                if(model.CurPage==model.AllPage-1){
                    model.Page3=0;
                    model.Page4=0;
                }
                model.JYGKList=JYGKArr3;
                model.CurPage=model.CurPage+1;
                model.Page1=1;
                model.Page2=1;
            }
            break;
            case 4: 
            model.JYGKList=JYGKArr5;
            model.CurPage=model.AllPage;
            model.Page3=0;
            model.Page4=0;
            model.Page1=1;
            model.Page2=1;
            break;
            default: 
        }
    },

}); 