$(document).ready(function () {
	$(".alert").click(function(){
		alertMsg("取消成功");
	});

	$(".confirm").click(function(){
		alertMsg('是否确定',1,function(choose){
			if(choose=='yes') {
				alert('选择了确定');
			}else{
				alert('选择了取消');
			}
		})
	});

	$(".prom").click(function(){
		openDialog('testpop.html',350,300);
	});

	
});