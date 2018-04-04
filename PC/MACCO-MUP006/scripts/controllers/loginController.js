/**
 * @author lokie wang
 */
maccoApp.controller('loginController',function ($scope, $http){
	$scope.Login = function() {
		var param = {
			UserName:$scope.username,
			Password:$scope.password
		};
		console.dir(param);
		var url = window.$servie + 'AdminApi/Admin/Login';
		
		$http.post(url,param).success(function(data){
			if(data.IsSuccess) {
				if(data.Data.IsLogined) {
					window.location.href = '/index.html' + '?Token=' + data.Data.Token;
				} else {
					alert('密码或者用户名错误');
				}
			} else {
				alert('密码或者用户名错误');
			}
		});
	};
});
