maccoApp.controller('sidebarController',function($scope,$http,$rootScope){
	var currentUrl = window.location.href;
	var currentPages = currentUrl.split('/');
	var currentPage = currentPages[currentPages.length -1];
	
	var token = window.getQueryStringByKey('Token');
	window.$Token = token;
	var moduleID = getModuelID();
	$scope.IsDeveloper=0;
	if(currentPage == 'login.html') {
		return true;
	} else {
		var checkLoginUrl = window.$servie + 'AdminApi/Admin/CheckLoginStatus';
		var param = {
			Token:window.$Token
		};
		$http.post(checkLoginUrl,param).success(function(data){
			if(data.IsSuccess) {
				if(!data.Data.IsLogined) {
					$rootScope.Token = '';
					$rootScope.AdminUserName = '';
					$rootScope.Role = '';
					window.location.href="/login.html";
				} else {
					$rootScope.Token = window.$Token;
					$rootScope.AdminUserName = data.Data.UserName;
					$rootScope.Role = data.Data.Role;
                    if(parseInt($rootScope.Role) == 0||parseInt($rootScope.Role) == 1){
						$scope.IsDeveloper=1;
					}
					if(parseInt($rootScope.Role) == 0||parseInt($rootScope.Role) == 1||parseInt($rootScope.Role) == 2){
						$rootScope.Operating=true;
					}else{
						$rootScope.Operating=false;
					}
					OpenSubmenu(moduleID);
				}
			} else {
				$rootScope.Token = '';
				window.location.href="/login.html";
			}
		});
	}
});