var DetailsID=0;
var DetailsID=window.getQueryStringByKey("ID");
var Type=window.getQueryStringByKey("Type");
if(!DetailsID){
	DetailsID=0;
}

switch(Type*1)
{
    case 0: TypeText="";
    break;
    case 1: TypeText="交易公开>";
    break;
    case 2: TypeText="重要公告>";
    break;
    case 3: TypeText="平台动态>";
    break;
    case 4: TypeText="招标公告>";
    break;
    case 5: TypeText="开标记录>";
    break;
    case 6: TypeText="评标公示>";
    break;
    case 7: TypeText="中标公告>";
    break;
    case 8: TypeText="合同备案>";
    break;
    case 9: TypeText="通知公告>";
    break;
    case 10: TypeText="学习专区>";
    break;
    case 11: TypeText="评委考试>";
    break;
    case 12: TypeText="监督公告>";
    break;
    case 13: TypeText="资料下载>";
    break;
    case 14: TypeText="法律法规>";
    break;
    case 15: TypeText="部门规章>";
    break;
    case 16: TypeText="规范性文件>";
    break;
    case 17: TypeText="其他>";
    break;
    default: TypeText="";
}

$.ajax({ 
    type: "GET", 
    url: "json/TestData.json", 
    dataType: "json",
    async:false,  
    success: function (data) { 
        TestData=data.Data;
        for(var i=0;i<TestData.length;i++){
        	if(TestData[i].ID*1==DetailsID*1){
        		ID=TestData[i].ID;
        		Title=TestData[i].Title;
        		Time=TestData[i].Time;
                ReadCount=TestData[i].ReadCount;
                Content=TestData[i].Content;
                if(i==0||i==1){
                    IDPre=TestData[TestData.length*1-1].ID;
                    TitlePre=TestData[TestData.length*1-1].Title;
                }else{
                    IDPre=TestData[i-1].ID;
                    TitlePre=TestData[i-1].Title;
                }
                if(i==TestData.length-1){
                    IDNext=TestData[1].ID;
                    TitleNext=TestData[1].Title;
                }else{
                    IDNext=TestData[i+1].ID;
                    TitleNext=TestData[i+1].Title;
                }
                return;
            }
        }
    }, 
    error: function (XMLHttpRequest, textStatus, errorThrown) { 
        alert(errorThrown); 
    } 
});

var model = avalon.define({
    $id:"detailsjs",
    ID:ID,
    Title:Title,
    Time:Time,
    ReadCount:ReadCount,
    Content:Content,
    IDPre:IDPre,
    TitlePre:TitlePre,
    IDNext:IDNext,
    TitleNext:TitleNext,
})