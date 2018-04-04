(function($) {
	var canUse=true;
	if(canUse){
		$.fn.extend({ 
			validate: function( options ) {  			
				this.attr( "novalidate", "novalidate" );
				validator = new $.validator( options, this[0] );
				var initSet=true;	//initSet是true时加载页面就显示错误通知，是false时就提交时判断显示错误信息。
				if(initSet){
					$.validator.init();
				}else{
					$(".maccoError").hide();
				}
			}
		});
	} 
}(jQuery));

(function($) {
	$.validator = function( options) {
	};

	$.extend($.validator, {
		init: function(){
			$.validator.defaultShowError();
		},
		defaultShowError: function(){
			$.validator.methods.textselect();
		},

		eachDiv:function(callback){
			$("div").each(function(){
				var	element=$(this);
				callback(element);
			});
		},

		selectresult:function(element){
			element.find("div").each(function(){
				if($(this).attr("macco-select-result")){
					$(this).click(function(){
						element.find("div").each(function(){
							if($(this).attr("macco-select-content")){
								var flag=$(this).attr("macco-select-content");
								var hasErrorLabel= element.attr("macco-error-label");
								if(flag=="true"){
									$(this).show();
									$(this).attr("macco-select-content","false");
									$(hasErrorLabel).hide();
								}
								if(flag=="false"){
									$(this).hide();
									$(this).attr("macco-select-content","true");
									element.find("div").each(function(){
										if($(this).attr("macco-select-result")&&$(this).val()==''){
											$(hasErrorLabel).show();
										}
									});
								}
							}
						});
					});
				}
			});
		},

		// 有效的方法
		methods: {
			textselect: function(){
				$.validator.eachDiv(function(element){
					var hasSelect=element.attr("macco-select");
					if(hasSelect=="true"){
						$.validator.selectresult(element);
					}else{
						var hasErrorLabel= element.attr("macco-error-label");
						$(hasErrorLabel).show();
					}
				});
			},


		}
	});
}(jQuery));