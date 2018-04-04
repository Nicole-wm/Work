
/* 
=============================================================================== 
combobox  
............................................................................... 

------------------------------------------------------------------------------- 
编写时间：2014/10/05
...............................................................................
编写人：ChenShiMin
=============================================================================== 
*/

(function ($) {

    var ComboboxUnit = {
        //初始化
        init: function (target, opts) {
            //if (!target.hasClass("ipt-combobox")) {
            //    target.addClass("ipt-combobox").attr("readonly", opts["readonly"]);  //只读
            //}

            if (opts.btnDropCtl) {
                var ipt_btn = (typeof opts.btnDropCtl == "string") ? $("#" + opts.btnDropCtl) : opts.btnDropCtl;
                if (ipt_btn.length > 0 && opts.url) {
                    ComboboxUnit.initEvent(target, ipt_btn, opts);
                }
            }
            else {
                //判断是否追加过combobox元素
                var targetName = target.attr("name") == undefined ? "" : target.attr("name");
                var targetValue = target.val();  //code值
                var targetText = target.attr("text"); //name值
                targetText = targetText == undefined ? "" : targetText;
                target.removeAttr("name"); //属性名称移除
                target.removeAttr("text"); //属性移除
                //target.val(targetText);
                var parent = target.parent("[name=jquery_combobox]").hasClass("drop_box");  //判断是否调用过init
                if (!parent) {
                    //var pp = $("<div style=\"float: left;\"></div>")
                    var pp = $("<div class=\"bigpanel\"></div>")
                    pp.appendTo(target.parent());

                    var ppt = $("<div class=\"drop_box\" name=\"jquery_combobox\"></div>");
                    var ipt_val = $("<input name=\"" + targetName + "\" type=\"hidden\" value=\"" + targetValue + "\" />");
                    var ipt_btn = $("<input class=\"drop_button\" type=\"button\">");
                    ppt.append(target);
                    ppt.append(ipt_btn);
                    ppt.append(ipt_val);

                    pp.append(ppt);
                    pp.append("<div class=\"drop_panel\" style=\"display:none; position:absolute\"></div>");

                    if (ipt_btn) {
                        if (opts.url || opts.data != null) {
                            ComboboxUnit.initEvent(target, ipt_btn, opts);
                        }
                    }
                }
                else {
                    var ipt_btn = target.siblings(".drop_button");
                    if (ipt_btn.length > 0)
                    {
                        ipt_btn.unbind("click");
                        target.closest(".drop_box").siblings(".drop_panel").removeAttr("load");  //移除属性
                        ComboboxUnit.initEvent(target, ipt_btn, opts);
                    }
                }
            }
        }
        //事件绑定
        , initEvent: function (target, ipt_btn, opts) {
            ipt_btn.bind("click", function (e) {
                var panel = $(e.target).parent().siblings(".drop_panel");
                if (panel.is(":visible")) {
                    panel.css({ display: "none" });
                }
                else {
                    ComboboxUnit.loadData(target, panel, opts); //数据加载
                }

                return false;
            });

            //onfocus
            if (opts.focusShow)
            {
                target.bind("click", function (e) {
                    ipt_btn.trigger("click");
                    return false;
                });
            }

        },
        //数据加载
        loadData: function (target, panel, opts)
        {
            var state = panel.attr("load");
            var objArray = [];
            if (opts.refresh) {
                objArray = ComboboxUnit.getDropList(opts);
            }
            else {
                if (state == "load") {
                    ComboboxUnit.lockPanel(target.get(0), panel.get(0), opts);
                    panel.css({ display: "block" });
                    return false;
                }
                else {
                    objArray = ComboboxUnit.getDropList(opts);
                    if (!opts.refresh) {
                        panel.attr("load", "load");  //标示数据获取过
                    }
                }
            }

            panel.empty();
            //下拉项目add
            if (objArray != null && objArray.length > 0) {
                var textField = opts.textField;
                var valueField = opts.valueField;
                var html = [];
                html.push("<ul>");
                for (var i = 0; i < objArray.length; i++) {
                    if (objArray[i][valueField] != undefined && objArray[i][textField] != undefined) {
                        html.push("<li tagValue=\"" + objArray[i][valueField] + "\">" + objArray[i][textField] + "</li>");
                    }
                }
                html.push("</ul>");
                panel.append($(html.join("\n")));

                ComboboxUnit.lockPanel(target.get(0), panel.get(0), opts); //定位

                //panel click
                panel.find("li").hover(function (e) {
                    if (!$(this).hasClass("hover")) {
                        $(this).addClass("hover");
                    }
                }, function (e) {
                    if ($(this).hasClass("hover")) {
                        $(this).removeClass("hover");
                    }
                }).click(function (e) {
                    var tagValue = e.target.getAttribute("tagValue");
                    var tagName = e.target.innerHTML;
                    target.val(tagName);
                    $(this).closest("div").siblings(".drop_box").find(":hidden").val(tagValue);

                    if (opts.onChange) {
                        opts.onChange(tagValue, tagName);
                    }

                    panel.css({ display: "none" });
                    return false;
                });
            }
            else {
                panel.append("<div class=\"drop_empty\">未找到相关记录</div>");
                ComboboxUnit.lockPanel(target.get(0), panel.get(0), opts); //定位
            }

        },
        //获取下拉数据项
        getDropList: function (opts) {
            var objList = [];
            if (opts.data != null && opts.data.length > 0) {
                for (var i = 0; i < opts.data.length; i++) {
                    objList.push(opts.data[i]);
                }
            }
            else {
                $.ajax({
                    type: "GET",
                    url: opts.url,
                    async: false,
                    success: function (data) {
                        objList = $.parseJSON(data);
                    }
                });
            }
            return objList;
        },
        //控件定位
        lockPanel: function (target, panel, opts)
        {
            var iHeight = target.offsetHeight;
            var iWidth = (opts.width == null) ? target.offsetWidth : (opts.width.toString().replace("px", "") + "px");
            opts.height = (opts.height == "" || opts.height == "auto") ? "auto" : opts.height.toString().replace("px", "") + "px";
            var pos = ComboboxUnit.getControlPos(target);
            if (opts.lockTop) {
                panel.style.display = "block";
                var pHeight = panel.offsetHeight;
                panel.style.cssText = "display:block ; width:" + (iWidth) + "px; height:" + opts.height + " ;top:" + (pos.top - pHeight) + "px;left:" + pos.left + "px;";
            }
            else {
                pos.top += iHeight - 1;
                panel.style.cssText = "display:block; width:" + (iWidth) + "px; height:" + opts.height  + " ;top:" + pos.top + "px;left:" + pos.left + "px;";
            }
        },
        //获取控件距离left 和 top
        getControlPos: function (targetCtl)
        {
            if (typeof (targetCtl) == "string")
            {
                targetCtl = document.getElementById(targetCtl);
            }

            var pos = { top: 0, left: 0 }
            if (targetCtl != null) {
                var eT = 0;
                var eL = 0;
                var p = targetCtl;
                var sT = this.getWindowScrollTop();  //当前窗口滚动条的 Top
                var sL = this.getWindowScrollLeft(); //当前窗口滚动条的 Left
                var eH = targetCtl.offsetHeight;
                var eW = targetCtl.offsetWidth;
                while (p && p.tagName.toUpperCase() != "BODY") {
                    eT += p.offsetTop;  //top
                    eL += p.offsetLeft; //left
                    var tagName = p.tagName.toUpperCase();

                    //滚动条处理
                    if (tagName == "BODY") {
                        if (p.scrollLeft != null) {
                            eL -= p.scrollLeft;
                        }
                        if (p.scrollTop != null) {
                            eT -= p.scrollTop;
                        }
                    }

                    p = p.offsetParent;
                }

                if (p.tagName.toUpperCase() == "DIV") {
                    eT += p.offsetTop;
                    eL += p.offsetLeft;
                }

                pos.top = eT;
                pos.left = eL;
            }

            return pos;
        },
        //获取滚动条距离top距离
        getWindowScrollTop: function () {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            }
            else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        //获取滚动条距离left距离
        getWindowScrollLeft: function () {
            var scrollLeft = 0;
            if (document.documentElement && document.documentElement.scrollLeft) {
                scrollLeft = document.documentElement.scrollLeft;
            }
            else if (document.body) {
                scrollLeft = document.body.scrollLeft;
            }
            return scrollLeft;
        }
    };
 
    //combobx
    $.fn.jq_combobox = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.jq_combobox.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        else {
            var settings = {
                url: "",
                data: [],
                width: null,
                height: "auto",
                readonly: true,
                textField: "value",
                valueField: "id",
                dataPanel: null,  //datapanel
                valueCtl: null,  //valueCtl
                btnDropCtl: null,  //下拉按钮
                refresh: false,  //每次获取最新数据
                lockTop: false,
                onChange: null
            }

            $.extend(true, settings, options);

            ComboboxUnit.init(this, settings);  //下拉框初始化

        }
    }

    //方法
    $.fn.jq_combobox.methods = {

        //获取下拉框value值
        getValue: function (target) {
            return target.siblings(":hidden").val();
        },
        //获取文本框text值
        getText: function (target) {
            return target.val();
        },
        //设置value值
        setValue: function (target, opts) {
            target.val(opts.name);
            target.siblings(":hidden").val(opts.id);
        },
        //清空值
        clear: function (target) {
            target.val("");
            target.siblings(":hidden").val("");
        },
        //opts = { url:"",data:[] }
        reset: function (target, opts) {
            target.jq_combobox("clear");
            target.jq_combobox(opts);
        }
    }

    //body click
    $(document).click(function () {
        var drop = $(".drop_panel");
        if (drop.is(":visible")) {
            drop.css({ display: "none" });
        }
    });

})(jQuery)