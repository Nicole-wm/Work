angular.module('FogApp').controller('InvoiceController', ['$rootScope', '$scope', 'settings','$http',function($rootScope, $scope, settings,$http) {
	/************************初始化变量************************/
	$scope.InvoiceType="0";

	var InvoiceTypes=[
		{ "ID":"0","InvoiceName":"全部"},
		{ "ID":"1","InvoiceName":"未审核"},
		{ "ID":"2","InvoiceName":"已通过"},
		{ "ID":"3","InvoiceName":"已拒绝"},
		{ "ID":"4","InvoiceName":"已开具"}
	]

	$scope.InvoiceTypes=InvoiceTypes;
	/************************初始化数据************************/
	var handleDatePickers = function () {
		if (jQuery().datepicker) {
			$('.date-picker').datepicker({
				rtl: App.isRTL(),
				orientation: "left",
				autoclose: true
			});
		}
		$( document ).scroll(function(){
			$('.date-picker').datepicker('place'); 
		});
	}

	handleDatePickers();

	/************************页面调用方法************************/
	$scope.ClearForm=function(){/*Fun-弹框清空*/
        $("#FormReset").click();
    }

	$scope.SearchInvoice=function(){
		console.log($scope.BTime);
		console.log($scope.ETime);
	}

	$scope.EditInvoiceFun=function(item){
		$scope.ModalReceiptName="Mark";
		$scope.ModalContactInfo="18018018018";
		$scope.ModalExpressAddress="上海普陀长征镇金沙江路2145号B栋5号楼9楼";
		$scope.ModalPostCode="21000";
	}

	$scope.DeleteInvoiceFun=function(){
		Common.confirm({
			title: "发票信息",
			message: "确认删除发票信息？",
			operate: function (reselt) {
				Common.alert({
					message: "删除发票信息成功！",
					operate: function (reselt) {
					}
				})
				/*if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "删除发票信息成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							Common.alert({
								message: "删除发票信息失败！原因："+response.meta.message,
								operate: function (reselt) { 
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "删除发票信息失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}*/
			}
		})
	}

	$scope.EditInvoiceName=function(){
		Common.confirm({
			title: "修改发票抬头",
			message: "确认修改发票抬头？",
			operate: function (reselt) {
				Common.alert({
					message: "修改发票抬头成功！",
					operate: function (reselt) {
					}
				})
				/*if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "修改发票抬头成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							Common.alert({
								message: "修改发票抬头失败！原因："+response.meta.message,
								operate: function (reselt) { 
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "修改发票抬头失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}*/
			}
		})
	}

	$scope.EditAddressFun=function(item){
		$scope.ModalReceiptName="Mark";
		$scope.ModalContactInfo="18018018018";
		$scope.ModalExpressAddress="上海普陀长征镇金沙江路2145号B栋5号楼9楼";
		$scope.ModalPostCode="21000";
	}

	$scope.DeleteAddressFun=function(){
		Common.confirm({
			title: "删除寄送地址",
			message: "确认删除寄送地址？",
			operate: function (reselt) {
				Common.alert({
					message: "删除寄送地址成功！",
					operate: function (reselt) {
					}
				})
				/*if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "删除寄送地址成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							Common.alert({
								message: "删除寄送地址失败！原因："+response.meta.message,
								operate: function (reselt) { 
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "删除寄送地址失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}*/
			}
		})
	}

	$scope.AddAddressFun=function(){
		Common.confirm({
			title: "寄送地址信息",
			message: "确认寄送地址信息？",
			operate: function (reselt) {
				Common.alert({
					message: "寄送地址信息保存成功！",
					operate: function (reselt) {
						$("#ModalAddressClose").click();//!!!
					}
				})
				/*if (reselt) {
					$http(PostParam).success(function(response){
						if(response.meta.code==0){
							Common.alert({
								message: "寄送地址信息保存成功！",
								operate: function (reselt) {	
									$scope.ReloadFun();
								}
							})
						}else{
							Common.alert({
								message: "寄送地址信息保存失败！原因："+response.meta.message,
								operate: function (reselt) { 
								}
							})
						}
					}).error(function(response, status){
						Common.alert({
							message: "修改寄送地址失败！原因："+response.error,
							operate: function (reselt) {	
							}
						})
					});
				} else {
				}*/
			}
		})
	}

	$scope.ReloadFun=function(){//刷新页面
	}
}]);