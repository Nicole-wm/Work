﻿/**
   拖拽div
   关键事件:mouseDown, mouseMove,mouseUp
**/

var params={
  top:0,
  left:0,
  currentX:0,
  currentY:0,
  flag:false
};

/**
obj.currentStyle[attr]
getComputedStyle(obj,false)[attr] 获取DOM非行间样式
**/
var getCss=function(o,key){
  return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];
}

var startDrag=function(bar,target,maxW,maxH,callback){
  if(getCss(target,'left')!='auto'){
    params.left=getCss(target,'left');
  }
  if(getCss(target,'top')!='auto'){
    params.top=getCss(target,'top');
  }
  bar.onmousedown=function(event){
    params.flag=true;
    if(!event){
      event=window.even;
      bar.onselectstart=function(){ //IE和Chrome适用，防止内容被选中默认是true
        return false;
      }
    }
    var e=event;
    params.currentX=e.clientX;
    params.currentY=e.clientY;
  }
  
  document.onmouseup=function(){
    params.flag=false;
    if(getCss(target,"left") !='auto'){
      params.left=getCss(target,'left');
    }
    if(getCss(target,'top') !='auto'){
      params.top=getCss(target,'top');
    }
  }
  document.onmousemove=function(event){
    var e=event?event:window.event;
    if(params.flag){
      var nowX=e.clientX,nowY=e.clientY;
      var disX=nowX-params.currentX, disY=nowY-params.currentY;
      var ObjX=parseInt(params.left)+disX;
      var ObjY=parseInt(params.top)+disY;
      if(ObjX<0){
        ObjX=0;
      }else if(ObjX>maxW){
        ObjX=maxW;
      }else{

      }
      if(ObjY<50){
        ObjY=50;
      }else if(ObjY>maxH-35){
        ObjY=maxH-35;
      }else{

      }
      target.style.left=ObjX+'px';
      target.style.top=ObjY+'px';
    }
    
    if(callback=='function'){
      callback(parseInt(params.left)+disX,parseInt(params.top)+disY);
    }
  }
}