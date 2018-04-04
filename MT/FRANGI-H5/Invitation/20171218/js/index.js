 window.alert = function(name){   
 	var iframe = document.createElement("IFRAME");   
 	iframe.style.display="none";   
 	iframe.setAttribute("src",'');   
 	document.documentElement.appendChild(iframe);   
 	window.frames[0].window.alert(name);   
 	iframe.parentNode.removeChild(iframe);  
 }; 

 function PostData() {
 	$(".mask").show();
 	var ValFlag=true;
 	$("#FormApp input[type=text]").each(function(i){
 		var text = $(this).val();
 		if(text==""){
 			alert("请完整填写申请内容！");
 			ValFlag=false;
 			$(".mask").hide();
 			return false;
 		}
 	})
 	if(ValFlag){
 		$.ajax({
 			type: "POST",
 			url: "applicant.php",
 			data : $('#FormApp').serialize(),
 			success: function(msg) {
 				$(".mask").hide();
 				$('#FormApp')[0].reset(); 
 				alert("申请成功！");
 			}
 		});
 	}
 	return false;
 }
