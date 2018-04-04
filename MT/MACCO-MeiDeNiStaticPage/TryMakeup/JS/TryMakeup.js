
$(document).ready(function () {

	$('#footer').on('selectstart', false);

	$('#head').on('click', function () {
		var platform = window.getQueryStringByKey('platform');
		if (platform == 'iOS') {
			if (window.webkit) {
				window.webkit.messageHandlers.tryMakeup.postMessage('');
			} else {
				window.location.href = "macco://TryMakeup/";
			}
		} else if (platform == 'Android') {
			window.demo.tryMakeup();
		}
	});

});

function showHideBtn() {
	var platform = window.getQueryStringByKey('platform');
	if (platform == 'iOS') {
		$('.btn').hide();
	} else {
		$('.btn').show();
	}
}


function changeImg(str) {
	$('#model').attr('src', str);
}

function getScrollTop(){
	$(window).on('scroll',function(){
		var scrollTop = $(window).scrollTop();
		return scrollTop;
	});
}
