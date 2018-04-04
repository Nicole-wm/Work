function yHeight(areaHeigth, data, i) {
    var maxData = Math.max.apply(null, data);
    if (maxData == 0) {
        y = areaHeigth;
    } else {
        var y = areaHeigth - (areaHeigth * data[i] / maxData / 1.2);
    }
    return y;
}

function xWidth(areaWidth, data, i, xMove, ratio) {
    var length = data.length - 1;
    if (i == 0) {
        var x = areaWidth / length * i + xMove * ratio;
    } else {
        var x = areaWidth / length * i + xMove * ratio;
    }
    return x;
}

function demoArea(data, textColor,xMove) {
    var w = window.screen.width;
    var h = 150;
    var areaId = document.getElementById("areaThis");
    var area = areaId.getContext("2d");

    var getPixelRatio = function (context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    };

    var ratio = getPixelRatio(area);

    areaId.width = w * ratio;
    areaId.height = h * ratio;

    var areaWidth = (w - xMove * 2) * ratio;
    var areaHeigth = h * ratio;
    
    area.beginPath();
    area.moveTo(xMove * ratio, areaHeigth);
    var dotArray = new Array();
    var length = data.length;
    for (var i = 0; i < length; i++) {
        dotArray[i] = [xWidth(areaWidth, data, i, xMove, ratio), yHeight(areaHeigth, data, i)];
        area.lineTo(dotArray[i][0], dotArray[i][1]);
    }
    area.lineTo(areaWidth + xMove * ratio, areaHeigth);
    area.closePath();
    var gradient = area.createLinearGradient(0, 0, areaWidth, 0);
    gradient.addColorStop("0", "#ffdce7");
    gradient.addColorStop("1.0", "#ff4d84");
    area.fillStyle = gradient;
    area.fill();
    area.beginPath();
    area.moveTo(areaWidth + xMove * ratio, areaHeigth);
    area.lineTo(xMove * ratio, areaHeigth);
    area.strokeStyle = gradient;
    area.stroke();
    
    var length = data.length;
    for (var i = 0; i < length; i++) {
        area.fillStyle = textColor[i];
        area.font = "28px sans-serif";
        area.fillText(data[i], xWidth(areaWidth, data, i, xMove, ratio) - 6, yHeight(areaHeigth, data, i) - 20);

    }
}

function init() {
    // 两边留白距离
    var xMove = 16;
    var textColor = ["#fea872", "#e6c64a", "#39dba4", "#86c6ff", "#e9414e"];
    demoArea(productdata,textColor, xMove);
}