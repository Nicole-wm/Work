function createMenu(menu, num) {
    var i = 0;
    var j = 0;

    if (num > 0) {
        //一级菜单
        var menuDiv = $("<div><ul></ul></div>");
        menuDiv.attr("id", "menu1");
        menuDiv.attr("class","menu1");

        $("#menu").append(menuDiv);

        for (i = 0; i < menu.length ; i++) {
            if (menu[i].level == "1") {
                $("#menu1").find("ul").append("<li value=" + menu[i].id + "' path='" + menu[i].src + "'>" + menu[i].name + "</li>");
            }
        }
    }

    $(document).on('click', '.menu li', function (event) {
        var objId = $(this).val();
        var objPath = $(this).attr("path");
        var objMenu = $(this).parent().parent().attr("id");
        var objNum = objMenu.substring(4, objMenu.length) * 1 + 1;
        var newName = "menu" + objNum;
        var k = 0;

        for (k = objNum; k <= num; k++) {
            var removeMenu = "menu" + k;
            $("#" + removeMenu).remove();
        }
        
        var newMenu = $("<div><ul></ul></div>");
        newMenu.attr("id", newName);
        newMenu.attr("class", newName);

        $("#menu").append(newMenu);

        for (i = 0; i < menu.length ; i++) {
            if (menu[i].level == objNum && menu[i].parent_id == objId) {
                $("#" + newName).find("ul").append("<li value=" + menu[i].id + "' path='" + menu[i].src + "'>" + menu[i].name + "</li>");
            }
        }

        if (objPath) {
            $.get(objPath, function (data) {
                $("#content").empty();
                $("#content").append($(data));
            });
        }
        event.stopPropagation();
    });

    //点击空白处关闭菜单
    $(document).click(function (event) {
        var k = 0;
        for (k = 2;k <= num; k++) {
            var removeMenu = "menu" + k;
            $("#" + removeMenu).remove();
        }
    });
}