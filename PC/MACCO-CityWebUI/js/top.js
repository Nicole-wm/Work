//大标题
function setMenu(cursel) {
    var menuName="Menu"+cursel;
    $("#menu_ul li").removeClass("menu_ul_select");
    $("#"+menuName).addClass('menu_ul_select');
}
//选择菜单
function chooseMenu(cursel) {
    var menuName="Menu"+cursel;
    $("#menu_ul li").removeClass("menu_ul_select");
    $("#"+menuName).addClass('menu_ul_select');
    switch(cursel)
    {
        case 1:window.location.href="index.html";
        break;
        case 2:window.location.href="TradeOpenness.html";
        break;
        case 3:window.location.href="TradingPlatform.html";
        break;
        case 4:window.location.href="MarketCredit.html";
        break;
        case 5:window.location.href="TransactionData.html";
        break;
        case 6:window.location.href="BidEvaluationExpert.html";
        break;
        case 7:window.location.href="AdministrativeSupervision.html";
        break;
        case 8:window.location.href="PoliciesRegulations.html";
        break;
        case 9:window.location.href="MarketTrend.html";
        break;
        default:
    }
}
$(document).ready(function () {
    //搜索框
    $("#SearchInput").click(function(){
        if($(this).val()=="搜索关键字"){
         $(this).val("");
     }
 });
    $("#SearchInput").blur(function(){
        if($(this).val()==""){
         $(this).val("搜索关键字");
     }
 });
});
