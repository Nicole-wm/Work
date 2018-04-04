/*评论加载*/
phonecatApp.factory('macco', function ($http) {
	var macco = function () {
		this.items = [];
		this.busy = false;
		this.after = '';
	};

	var url = "http://" + window.hostname + '/MeiDeNi/Information/FetchInformationComment';
	var infoID = window.getQueryStringByKey('ID');
	var uid = window.getQueryStringByKey('UID');
	var param = {
		InfoID: infoID,
		PageSize: 10,
		LastCommentID: 0,
		UID:uid
	};

	var contains = function (items, value) {
		var ret = false;
		for (var i = 0; i < items.length; i++) {
			if (items[i].ID == value) {
				ret = true;
				break;
			}
		}
		return ret;
	};

	macco.prototype.nextPage = function () {
		param.LastCommentID = this.after;
		$http.post(url, param).success(function (data) {
			var items = data.Data;
			for (var i = 0; i < items.length; i++) {
			}	
			
			if (this.items.length > 0) {
				this.after = this.items[this.items.length - 1].ID;
			} else {
				this.after = 0;
			}
			
			this.busy = false;
		}.bind(this));
	};

	return macco;
});


phonecatApp.controller('activityIndexController', function ($scope,$http,macco,$location, $rootScope,$interval) {
	$scope.macco = new macco();
});
