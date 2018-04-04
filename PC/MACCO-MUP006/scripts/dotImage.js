maccoApp.directive('dotImage',[function($scope)
{
  return {
    restrict:'E',
    scope: {
      dots: '=dots',
      imageurl:'=imageurl'
    },
    template:'<canvas></canvas>',
    link:function(scope,element) {
      var CurDots=scope.dots;
      var canvas = element[0].firstChild; 
      scope.$watch('dots',function(){
        var canvas = element[0].firstChild; 
        var CurDots=scope.dots;
        var CurImg=scope.imageurl;
        ctx = canvas.getContext("2d"); 
        img = new Image();  
        img.src = CurImg;  
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0); 
          ToDot(canvas,CurDots);
        } 
      });
    }
  }
}    
]);

function ToDot(canvas,CurDots){
  for(var i=0;i<CurDots.length;i++){
    var x=CurDots[i][0];
    var y=CurDots[i][1];
    ToDraw(canvas,x,y,i);
  }
}

function ToDraw(canvas,x,y,i){
  cxt = canvas.getContext("2d");  
  cxt.beginPath();
  cxt.arc(x,y,4,0,360,false);
  ctx.font = '18px Verdana';
  cxt.fillStyle="#3399FF";
  ctx.fillText(i,x+10,y+10);
  cxt.fill();
  cxt.lineWidth=3;
  cxt.strokeStyle="#3399FF";
  cxt.stroke();
  cxt.closePath();
}