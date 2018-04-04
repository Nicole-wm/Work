var objPage=0;
var objPage=window.getQueryStringByKey("page");
if(!objPage){
	objPage=0;
}

//行政监督
var Arr=[];
var Arr1=[];
var Arr2=[];
var Arr3=[];
var Arr4=[];
$.ajax({ 
    type: "GET", 
    url: "json/AdministrativeSupervisionList.json", 
    dataType: "json",
    async:false,  
    success: function (data) {
        var i=0;
        var j=0;
        var k=0;
        var m=0;
        var n=0;
        var o=0;
        for(i=0;i<10;i++){
            Arr[j++]=data.Data.DataList[i]; 
            AllPage=data.Data.PageDetails.AllPage;
            CurPage=data.Data.PageDetails.CurPage;
        }
        for(i=10;i<20;i++){
            Arr1[k++]=data.Data.DataList[i]; 
            AllPage1=data.Data.PageDetails.AllPage2;
            CurPage1=data.Data.PageDetails.CurPage2; 
        }
        for(i=20;i<30;i++){
            Arr2[m++]=data.Data.DataList[i]; 
            AllPage2=data.Data.PageDetails.AllPage4;
            CurPage2=data.Data.PageDetails.CurPage4; 
        }
        for(i=5;i<15;i++){
            Arr3[n++]=data.Data.DataList[i]; 
            AllPage3=data.Data.PageDetails.AllPage4;
            CurPage3=data.Data.PageDetails.CurPage4; 
        }
        for(i=15;i<25;i++){
            Arr4[o++]=data.Data.DataList[i]; 
            AllPage4=data.Data.PageDetails.AllPage4;
            CurPage4=data.Data.PageDetails.CurPage4; 
        }
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

var model = avalon.define({
    $id:"ASjs",
    currentIndex:objPage*1,
    Page1:0,
    Page2:0,
    Page3:1,
    Page4:1,
    typeID:12,
    ASList:Arr,
    AllPage:AllPage,
    CurPage:CurPage,
    MenuClick: function(cur) {
      model.currentIndex = cur;
      model.Page1=0;
      model.Page2=0;
      model.Page3=1;
      model.Page4=1;
  },

  PageClick: function(cur) {
    switch(cur*1)
    {
        case 1: 
        model.ASList=Arr1;
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
            model.ASList=Arr2;
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
            model.ASList=Arr3;
            model.CurPage=model.CurPage+1;
            model.Page1=1;
            model.Page2=1;
        }
        break;
        case 4: 
        model.ASList=Arr4;
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
