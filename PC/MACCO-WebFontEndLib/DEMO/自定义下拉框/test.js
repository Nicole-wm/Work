$(function(){
	$("#macco-form").validate({
		
	})
	
	//列表
	$(".select_content ul li").click(function(){
		var objtext=$(this).text();
		$(this).parent().parent().prev().find("input").attr("value",objtext);
		$(this).parent().parent().attr("macco-select-content","true");
		$(this).parent().parent().hide();
	})


    //表格
	$(".select_content table td").click(function(){
		var objtext=$(this).text();
		$(this).parent().parent().parent().parent().prev().find("input").attr("value",objtext);
		$(this).parent().parent().parent().parent().attr("macco-select-content","true");
		$(this).parent().parent().parent().parent().hide();
	})

	//Div
	$(".select_content div").click(function(){
		var objtext=$(this).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
		$(this).parent().prev().find("input").attr("value",objtext);
		$(this).parent().attr("macco-select-content","true");
		$(this).parent().hide();
	})
})
