// 从Query String获取某个值
var getQueryStringByKey = function (key) {
  var queryString = window.location.href;
  var queryStringArray = queryString.split('&');
  var currentQueryString = '';
  for (var i = 0; i < queryStringArray.length; i++) {
    var temp = queryStringArray[i];
    if (temp.indexOf(key) >= 0) {
      currentQueryString = queryStringArray[i];
      break;
    }
  }
  var currentQueryStringArray = currentQueryString.split('=');
  if (currentQueryStringArray.length > 1) {
    return currentQueryStringArray[1];
  } else {
    return '';
  }
};

var getModuelID = function () {
  var link = window.location.pathname;
  var linkArray = link.split('/');
  return linkArray[1];
};

var checkCode={
  showResult:function(code,message){
    var CurErrorMessage="";
    if(code==401||code==403){
      window.location.href="#/signin";
      window.location.reload(); 
    }else{
      var CurMessage=message;
      if(CurMessage instanceof Object){ 
        var count=1;
        jQuery.each(CurMessage, function(i, val) {  
          CurErrorMessage = CurErrorMessage + count +"：" +i+ "：" +val +"；"; 
          count++;
        });
      }else if(typeof(CurMessage)==="string"){ 
        CurErrorMessage=CurMessage;
      }else{
        CurErrorMessage="不详";
      }
    }
    return CurErrorMessage;
  }
}

/*common*/
var Common = {
  confirm:function(params){
    var model = $("#common_confirm_model");
    model.find(".title").html(params.title)
    model.find(".message").html(params.message)

    $("#common_confirm_btn").click()
    model.find(".cancel").die("click")
    model.find(".ok").die("click")

    model.find(".ok").live("click",function(){
      params.operate(true)
    })

    model.find(".cancel").live("click",function(){
      params.operate(false)
    })
  },

  alert:function(params){
    var model = $("#common_alert_model");
    model.find(".message").html(params.message)

    $("#common_alert_btn").click()
    model.find(".ok").die("click")
    model.find(".ok").live("click",function(){
      params.operate(true)
    })
  },

  notify:function(params){
    var model = $("#common_notify_model");
    model.find(".message").html(params.message)

    $("#common_notify_btn").click()
    function NotifyClose(){ 
      $("#common_notify_model").hide();
      $(".modal-backdrop").remove();
    } 
    window.setTimeout(NotifyClose,1300); 
  }
}
