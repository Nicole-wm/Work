/*Url截取*/
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
