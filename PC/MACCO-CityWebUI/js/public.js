window.getQueryStringByKey = function (key) {
	var queryString = window.location.search;
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

var objPage=0;
var objPage=window.getQueryStringByKey("page");
if(!objPage){
	objPage=0;
}

var model = avalon.define({
	$id:"publicjs",
	currentIndex:objPage*1,
	MenuClick: function(index) {
		model.currentIndex = index;
	}
})