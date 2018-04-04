function alertMsg(msg,mode,callback) { //mode为1，显示取消按钮
    msg = msg || '';
    mode = mode || 0;

    //蒙版
    var mask = document.createElement('div'); 
    mask.id="mask";
    document.body.appendChild(mask);
    $("#mask").fadeIn("slow");

    //弹框面板
    var AlertPanel =document.createElement('div');
    var AlertTitle =document.createElement('div');
    var AlertTitleText =document.createElement('div');
    var AlertTitleClose =document.createElement('div');
    var AlertContent =document.createElement('div');
    var AlertContentText =document.createElement('div');
    var AlertContentBtn =document.createElement('div');
    var ConfirmBtn =document.createElement('div');
    var CancelBtn =document.createElement('div');
    AlertPanel.id='AlertPanel';
    AlertTitle.className='AlertTitle';
    AlertTitleText.className='AlertTitleText';
    AlertTitleClose.className='AlertTitleClose';
    AlertContent.className='AlertContent';
    AlertContentText.className='AlertContentText';
    AlertContentBtn.className='AlertContentBtn';
    ConfirmBtn.className='ConfirmBtn';
    CancelBtn.className='CancelBtn';

    AlertTitleClose.id='AlertTitleClose';
    ConfirmBtn.id='ConfirmBtn';
    CancelBtn.id='CancelBtn';

    document.body.appendChild(AlertPanel);
    AlertPanel.appendChild(AlertTitle);
    AlertPanel.appendChild(AlertContent);
    AlertTitle.appendChild(AlertTitleText);
    AlertTitle.appendChild(AlertTitleClose);
    AlertContent.appendChild(AlertContentText);
    AlertContent.appendChild(AlertContentBtn);
    AlertContentBtn.appendChild(ConfirmBtn);
    if(mode==1){
        AlertContentBtn.appendChild(CancelBtn);
    }

    //弹框面板中文字
    AlertTitleText.innerHTML="提示框";
    ConfirmBtn.innerHTML="确定";
    CancelBtn.innerHTML="取消";
    AlertContentText.innerHTML=msg;

    //点击关闭
    document.getElementById('AlertTitleClose').onclick=function(){
        $("#mask").remove();
        $("#AlertPanel").remove();
    };

    //确认按钮
    document.getElementById('ConfirmBtn').onclick=function(){
        $("#mask").remove();
        $("#AlertPanel").remove();
        if(callback) callback('yes');
    };

    //取消 按钮 
    if(mode==1){
        document.getElementById('CancelBtn').onclick=function(){
            $("#mask").remove();
            $("#AlertPanel").remove();
            if(callback) callback('no');
        };
    };
}

function openDialog(url,width,height){
    var mask = document.createElement('div'); 
    mask.id="mask";
    document.body.appendChild(mask);
    $("#mask").fadeIn("slow");

    var PopPanel =document.createElement('div');
    PopPanel.id='PopPanel';
    PopPanel.style.width=width+'px';
    PopPanel.style.height=height+'px';
    document.body.appendChild(PopPanel);

    PopPanel.innerHTML="<iframe src='"+url+"' width='"+width+"' height='"+height+"'></iframe>";
}