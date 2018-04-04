maccoApp.directive('colorWheel',[function($scope)
{
  return {
    restrict:'E',
    scope: {
      colors: '=colors',
      width: '=width',
      height: '=height',
      slice: '=slice',
      callback: '=callback'
    },
    template:'<canvas id="chart"></canvas>',
    link:function(scope, element, attrs) {
      var canvas = element[0].firstChild; 
      if(scope.width == undefined || scope.height == undefined) {
        canvas.width = 600;
        canvas.height = 500;
      } else {
        canvas.width = scope.width;
        canvas.height = scope.height;
      }
      
      var colorWheel;
      scope.$watch('slice',function(value){
        if(value != null) {
          colorWheel.toggleSlice(value);
        }
      });
      
      scope.$watch('colors',function(value){
        if(value != null) {
          colorWheel = new colorWheelObject();
          colorWheel.canvas = canvas;
          colorWheel.chartColours = [];
          colorWheel.chartImages = [];
          for(var i=0;i<scope.colors.length;i++) {
            colorWheel.chartColours.push(scope.colors[i]['RGB']);
            colorWheel.chartImages.push(scope.colors[i]['ImageUrl'])
          }
          
          colorWheel.init();
          colorWheel.slickClick = scope.callback;
        }
      });             
    }
  }
}    
]);
function colorWheelObject() {
  // Config settings
  this.chartSizePercent = 55;                        // The chart radius relative to the canvas width/height (in percent)
  this.sliceBorderWidth = 1;                         // Width (in pixels) of the border around each slice
  this.sliceBorderStyle = "#FFFFFF";                    // Colour of the border around each slice
  this.sliceGradientColour = "#ddd";                 // Colour to use for one end of the chart gradient
  this.maxPullOutDistance = 25;                      // How far, in pixels, to pull slices out when clicked
  this.pullOutFrameStep = 4;                         // How many pixels to move a slice with each animation frame
  this.pullOutFrameInterval = 40;                    // How long (in ms) between each animation frame
  this.pullOutLabelPadding = 65;                     // Padding between pulled-out slice and its label  
  this.pullOutLabelFont = "bold 16px 'Trebuchet MS', Verdana, sans-serif";  // Pull-out slice label font
  this.pullOutValueFont = "bold 12px 'Trebuchet MS', Verdana, sans-serif";  // Pull-out slice value font
  this.pullOutValuePrefix = "$";                     // Pull-out slice value prefix
  this.pullOutShadowColour = "rgba( 0, 0, 0, .5 )";  // Colour to use for the pull-out slice shadow
  this.pullOutShadowOffsetX = 5;                     // X-offset (in pixels) of the pull-out slice shadow
  this.pullOutShadowOffsetY = 5;                     // Y-offset (in pixels) of the pull-out slice shadow
  this.pullOutShadowBlur = 5;                        // How much to blur the pull-out slice shadow
  this.pullOutBorderWidth = 2;                       // Width (in pixels) of the pull-out slice border
  this.pullOutBorderStyle = "#333";                  // Colour of the pull-out slice border
  this.chartStartAngle =  Math.PI;              // Start the chart at 12 o'clock instead of 3 o'clock

  // Declare some variables for the chart
  this.canvas;                       // The canvas element in the page
  this.currentPullOutSlice = -1;     // The slice currently pulled out (-1 = no slice)
  this.currentPullOutDistance = 0;   // How many pixels the pulled-out slice is currently pulled out in the animation
  this.animationId = 0;              // Tracks the interval ID for the animation created by setInterval()
  this.chartData = [];               // Chart data (labels, values, and angles)
  this.chartColours = [];            // Chart colours (pulled from the HTML table)
  this.totalValue = 0;               // Total of all the values in the chart
  this.canvasWidth;                  // Width of the canvas, in pixels
  this.canvasHeight;                 // Height of the canvas, in pixels
  this.centreX;                      // X-coordinate of centre of the canvas/chart
  this.centreY;                      // Y-coordinate of centre of the canvas/chart
  this.chartRadius;                  // Radius of the pie chart, in pixels
  this.chartImages;
  this.slickClick;
  this.init = function() {
    if ( typeof this.canvas.getContext === 'undefined' ) {
      return;
    }
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.centreX = this.canvasWidth / 2;
    this.centreY = this.canvasHeight / 2;
    this.chartRadius = Math.min( this.canvasWidth, this.canvasHeight ) / 2 * ( this.chartSizePercent / 100 );
    
    var currentRow = -1;
    var currentCell = 0;
    
    for(var colorRGB in this.chartColours) {
      currentRow++;
      var value = 1;
      this.totalValue += value;
      value = value.toFixed(2);
      this.chartData[currentRow] = [];
      this.chartData[currentRow]['label'] = this.chartColours[currentRow];
      this.chartData[currentRow]['value'] = value;
      hex = this.chartColours[currentRow].match(/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/);
      this.chartColours[currentRow] = [ parseInt(hex[1],16) ,parseInt(hex[2],16), parseInt(hex[3], 16) ];
    }

    var currentPos = 0; 

    

    for ( var slice in this.chartData ) {
      this.chartData[slice]['startAngle'] = 2 * Math.PI * currentPos;
      this.chartData[slice]['endAngle'] = 2 * Math.PI * ( currentPos + ( this.chartData[slice]['value'] / this.totalValue ) );
      currentPos += this.chartData[slice]['value'] / this.totalValue;
    }

    this.drawChart();
    
    this.canvas.onclick = this.handleChartClick;
  }

  var target = this;
  this.handleChartClick = function( clickEvent ) {
    var mouseX = clickEvent.pageX - this.offsetLeft;
    var mouseY = clickEvent.pageY - this.offsetTop;
    var xFromCentre = mouseX - target.centreX;
    var yFromCentre = mouseY - target.centreY;
    var distanceFromCentre = Math.sqrt( Math.pow( Math.abs( xFromCentre ), 2 ) + Math.pow( Math.abs( yFromCentre ), 2 ) );
    
    if ( distanceFromCentre <= target.chartRadius ) {
      var clickAngle = Math.atan2( yFromCentre, xFromCentre ) - target.chartStartAngle;
      if ( clickAngle < 0 ) clickAngle = 2 * Math.PI + clickAngle;

      for ( var slice in target.chartData ) {
        if ( clickAngle >= target.chartData[slice]['startAngle'] && clickAngle <= target.chartData[slice]['endAngle'] ) {
          target.toggleSlice ( slice );
          return;
        }
      }
    }
    target.pushIn();
  }

  this.toggleSlice = function(slice ) {
    if ( slice == this.currentPullOutSlice ) {
      this.pushIn();
    } else {
      this.startPullOut ( slice );
    }
  }

  this.startPullOut = function( slice ) {
    if ( this.currentPullOutSlice == slice ) {
      return;
    };

    this.currentPullOutSlice = slice;
    this.currentPullOutDistance = 0;
    this.currentPullOutDistance = this.maxPullOutDistance;
    this.drawChart();
    
    this.slickClick(slice);
  }

  this.animatePullOut  = function( slice ) {
    this.currentPullOutDistance += this.pullOutFrameStep;
    if ( this.currentPullOutDistance >= this.maxPullOutDistance ) {
      clearInterval( this.animationId );
      return;
    }
    this.drawChart();
  }

  this.pushIn = function() {
    this.currentPullOutSlice = -1;
    this.currentPullOutDistance = 0;
    clearInterval( this.animationId );
    this.drawChart();
  }

  this.drawChart = function() {
    var context = this.canvas.getContext('2d');
    context.clearRect ( 0, 0, this.canvasWidth, this.canvasHeight );
    
    this.drawSlice( context, 0,this.chartData.length );
  }

  var that = this;
  this.drawSlice = function( context, slice ,total ) {
    var startAngle = that.chartData[slice]['startAngle']  + that.chartStartAngle;
    var endAngle = that.chartData[slice]['endAngle']  + that.chartStartAngle;

    if ( slice == that.currentPullOutSlice ) {
      var midAngle = (startAngle + endAngle) / 2;
      var actualPullOutDistance = that.currentPullOutDistance * that.easeOut( that.currentPullOutDistance / that.maxPullOutDistance, .8 );
      startX = that.centreX + Math.cos(midAngle) * actualPullOutDistance;
      startY = that.centreY + Math.sin(midAngle) * actualPullOutDistance;
      context.fillStyle = 'rgb(' + that.chartColours[slice].join(',') + ')';
      context.textAlign = "center";
      context.font = that.pullOutLabelFont;
      context.fillText( that.chartData[slice]['label'], that.centreX + Math.cos(midAngle) * ( that.chartRadius + that.maxPullOutDistance + that.pullOutLabelPadding ), that.centreY + Math.sin(midAngle) * ( that.chartRadius + that.maxPullOutDistance + that.pullOutLabelPadding ) );
      context.font = that.pullOutValueFont;   
      context.shadowOffsetX = that.pullOutShadowOffsetX;
      context.shadowOffsetY = that.pullOutShadowOffsetY;
      context.shadowBlur = that.pullOutShadowBlur;

    } else {
      startX = that.centreX;
      startY = that.centreY;
    }
    
    context.beginPath();
    context.moveTo( startX, startY );
    context.arc( startX, startY, that.chartRadius, startAngle, endAngle, false );
    context.lineTo( startX, startY );
    context.closePath();
    if ( slice == that.currentPullOutSlice ) {
      context.lineWidth = that.pullOutBorderWidth;
      context.strokeStyle = that.pullOutBorderStyle;
    } else {
      context.lineWidth = that.sliceBorderWidth;
      context.strokeStyle = that.sliceBorderStyle;
    }
    
    context.stroke();
    
    that.drawParentImageImage(context,that.chartImages[slice],slice,total,that.drawSlice);
  }

  this.drawParentImageImage = function(context,imageSource,slice,total,callback) {
    var img=new Image();

    img.onload = function() {
      var pattern = context.createPattern(img, 'repeat');
      context.fillStyle = pattern;
      context.shadowColor = ( slice == this.currentPullOutSlice ) ? this.pullOutShadowColour : "rgba( 0, 0, 0, 0 )";
      context.fill();
      
      slice = slice +1;
      if(slice != total ) {
        callback(context,slice,total);
      }
    };
    
    img.src=imageSource;
  };

   this.easeOut = function(ratio, power ) {
    return ( Math.pow ( 1 - ratio, power ) + 1 );
  }
};
