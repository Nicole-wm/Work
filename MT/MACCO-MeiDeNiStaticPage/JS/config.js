
var envConfig = function() {
    var currentEnv = window.location.hostname;
    if(currentEnv == 's.imacco.me')  {
      window.hostname= 'api.imacco.me/';
    } else if(currentEnv == 's.imacco.com')  {
      window.hostname= 'v3.imacco.com/';
    } else if(currentEnv == 'web.5imakeup.com/')  {
      window.hostname= 'publish.5imakeup.com/';
    } else {
      window.hostname= 'api.5imakeup.com/';
    }
}

envConfig();

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