$(document).ready(function () {
    // 通过原生select控件创建自定义下拉框
    var pic1 = DropDownList.create({
        select:$('#select1'),
        attrs:{
            column :4,
            width :210,
        },
    });
    pic1.change(function(){
        if(pic1.val()){
            window.open(pic1.val(),"_blank");
        }
    });
    var pic2 = DropDownList.create({
        select:$('#select2'),
        attrs:{
            column :3,
            width :210,
        },
    });
    pic2.change(function(){
       if(pic2.val()){
            window.open(pic2.val(),"_blank");
        }
    });
    var pic3 = DropDownList.create({
        select:$('#select3'),
        attrs:{
            column :9,
            width :210,
        },
    });
    pic3.change(function(){
        if(pic3.val()){
            window.open(pic3.val(),"_blank");
        }
    });
    var pic4 = DropDownList.create({
        select:$('#select4'),
        attrs:{
            column :4,
            width :210,
        },
    });
    pic4.change(function(){
        if(pic4.val()){
            window.open(pic4.val(),"_blank");
        }
    });
});
