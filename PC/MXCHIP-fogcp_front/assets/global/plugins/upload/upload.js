accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
image_update = 0
image_create = 0

now = timestamp = Date.parse(new Date()) / 1000;

function send_request(file) {//传参数  文件夹名
    var xmlhttp = null;
    var url = '';
    /*var host = 'https://v3dev.fogcloud.io';*/

    var host = 'https://'+document.domain;

    if (file == 'localtest') {
        var Temptoken = ""
        Temptoken = {"accessid": "wHQNXGLIEo9fqHYy", "callback": "eyJjYWxsYmFja0JvZHlUeXBlIjogImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCIsICJjYWxsYmFja0JvZHkiOiAiZmlsZW5hbWU9JHtvYmplY3R9JnNpemU9JHtzaXplfSZtaW1lVHlwZT0ke21pbWVUeXBlfSZoZWlnaHQ9JHtpbWFnZUluZm8uaGVpZ2h0fSZ3aWR0aD0ke2ltYWdlSW5mby53aWR0aH0ifQ==", "host": "https://mxchip-fog.oss-cn-beijing.aliyuncs.com", "expire": 1495049765, "signature": "p1Pl1DcwHBpOKUBqGL6IXoqzRjQ=", "policy": "eyJjb25kaXRpb25zIjogW1sic3RhcnRzLXdpdGgiLCAiJGtleSIsICJwcm9maWxlLyJdXSwgImV4cGlyYXRpb24iOiAiMjAxNy0wNS0xOFQwMzozNjowNVoifQ==", "dir": "profile/"}
        return Temptoken
    }
    if (file == 'cookbook') {
        url = host + '/gettoken_cookbook';
    }
    if (file == 'product') {
        url = host + '/gettoken_product';
    }
    if (file == 'profile') {
        url = host + '/gettoken_profile';
    }
    if (file == 'ota') {
        url = host + '/gettoken_ota';
    }
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp != null) {
        serverUrl = url;
        xmlhttp.open("GET", serverUrl, false);
        xmlhttp.send(null);
        return xmlhttp.responseText
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {

    g_object_name_type = 'random_name';

    if (document.getElementById("mainimage_create") != undefined) {

        image_create = 1;
        image_update = 0;

    } else if (document.getElementById("mainimage_update") != undefined) {

        image_create = 0;
        image_update = 1;

    }
}

function get_signature(file) {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
        body = send_request(file);
        if (file == 'cookbook') {
            var obj = body;
        }
        else {
            var obj = eval("(" + body + ")");
        }
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback']
        key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename) {
    suffix = get_suffix(filename)
    g_object_name = key + random_string(10) + suffix
    
    /*g_object_name = key + filename*/

    return ''
}


function ota_calculate_object_name(filename,pid) {
    suffix = get_suffix(filename)
    g_object_name = key + pid +'/'+ random_string(10) + suffix

    return ''
}


function get_uploaded_object_name(filename) {
    return g_object_name
}

function set_upload_param(up, filename, ret, file,pid) {
    if (ret == false) {
        ret = get_signature(file);
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        if(pid!=""){
            ota_calculate_object_name(filename,pid)
        }else{
            calculate_object_name(filename)
        }
    }
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

function image_input_info(image_id, url_id, class_id, filename) {
    var url = 'https://mxchip-fog.oss-cn-beijing.aliyuncs.com/' + get_uploaded_object_name(filename.name);
    var div = document.getElementById(image_id);

    div.innerHTML = '<div hidden readonly class="col-md-10">' +
    '<input type="text" class="form-control" name="' + url_id + '"' + 'id="' + url_id + '"' +
    'value=' + url + '>' + '</div>';

    div.innerHTML += '<img style="width: 100%;height: 100%" class="' + class_id + '" src=' + url + " " + 'alt="Jcrop Example">';

    return ''
}

function image_input_error(image_id, class_id, filename, info) {

    var div = document.getElementById(image_id);
    div.innerHTML = info.response;
    div.innerHTML += '<img class="' + class_id + '" src=' + " " + 'alt="Jcrop Example">';

    return ''
}

function output_error(err) {
    if (err.code == -600) {
        Common.alert({
            message: "文件过大，请选择小于4mb的文件!",
            operate: function (reselt) { 
                return false;  
            }
        })
    }
    else if (err.code == -601) {
        Common.alert({
            message: "该图片格式不合法，请重新上传！",
            operate: function (reselt) { 
                return false;  
            }
        })
    }
    else if (err.code == -602) {
        Common.alert({
            message: "这个文件已经上传过一次",
            operate: function (reselt) { 
                return false;  
            }
        })
    }
    else {
        Common.alert({
            message: err.response,
            operate: function (reselt) { 
                return false;  
            }
        })
    }

    return ''
}

upload_image_func = function (fileType,// 文件类型
                              browse_but_id, // 选择文件button的id
                              container_id, // 选择文件和开始上传button所在div的id
                              selected_pic_ctr, // 展示选中图片名字的容器id，
                              upload_but_id, // 开始上传button的id
                              show_selected_pic, // 上传完后，展示图片的容器
                              url_input_id // 上传图片后oss地址存储的input的id
                              ) {
    var select_image = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: browse_but_id,
        container: document.getElementById(container_id),
        flash_swf_url: 'plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        multi_selection: false,

        filters: {//只允许上传图片
            mime_types: [ 
            {title: "Image files", extensions: "jpg,gif,png,bmp"},
            ],
            max_file_size: '4mb', //最大只能上传4mb的文件
            prevent_duplicates: false //允许选取重复文件
        },

        init: {
            PostInit: function () {
                document.getElementById(selected_pic_ctr).innerHTML = '';
                document.getElementById(upload_but_id).onclick = function () {
                    set_upload_param(select_image, '', false, fileType,'');
                    return false;
                };
            },

            FilesAdded: function (up, files) {
                if (up.files.length > 1) {
                    up.files = up.files.reverse();
                    up.splice(1, 999);
                }
                plupload.each(files, function (file) {
                    document.getElementById(selected_pic_ctr).innerHTML = '<label class="col-sm-2 control-label"> ' + "         " + '</label>'
                    + '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')'
                    + '<div class="progress-bar-image" style="width: 0%">'
                    + '</div>'
                    + '</div>';
                });
            },

            BeforeUpload: function (up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true,fileType,'');
            },

            UploadProgress: function (up, file) {
                $("#mask").show();
                var d = document.getElementById(file.id);
                var progBar = d.getElementsByTagName('div')[0];
                progBar.style.width = 2 * file.percent + 'px';
                progBar.setAttribute('aria-valuenow', file.percent);
            },

            FileUploaded: function (up, file, info) {
                if (info.status == 200) {
                    image_input_info(show_selected_pic, url_input_id, "product_image_min", file);
                }
                else {
                    image_input_error(show_selected_pic, "image_min", file, info);
                }
                $("#mask").hide();
            },
            Error: function (up, err) {
                $("#mask").hide();
                output_error(err);
            }
        }
    });
    select_image.init();
}

upload_file_func = function (fileType,// 文件类型
                            container_id, // 选择文件和开始上传button所在div的id
                            browse_btn_id, // 选择文件
                            upload_btn_id, // 开始上传
                            filename_input_id,
                            filesize_input_id,
                            filemd5_input_id,
                            fileurl_input_id,
                            ProId
                            ) {
    var UploadeOTA = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: browse_btn_id,
        container: document.getElementById(container_id),
        flash_swf_url: 'plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url: 'plupload-2.1.2/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        
        filters: {
            prevent_duplicates: false 
        },

        init: {
            PostInit: function () {
                document.getElementById(filename_input_id).value = '';
                document.getElementById(filesize_input_id).value = '';
                document.getElementById(filemd5_input_id).value = '';
                document.getElementById(fileurl_input_id).value = '';
                document.getElementById(upload_btn_id).onclick = function () {
                    set_upload_param(UploadeOTA, '', false, fileType,ProId);
                    return false;
                };
            },

            FilesAdded: function (up, files) {
                plupload.each(files, function (file) {
                    var size = plupload.formatSize(file.size).toLocaleUpperCase();
                    document.getElementById(filename_input_id).value=file.name;
                    document.getElementById(filesize_input_id).value=size;
                });
            },

            BeforeUpload: function (up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true,fileType,ProId);
            },

            UploadProgress: function (up, file) {
                $("#mask").show();/*file.percent文件长传百分比*/
            },

            FileUploaded: function (up, file, info) {
                if (info.status == 200) {
                    var url = 'https://mxchip-fog.oss-cn-beijing.aliyuncs.com/' + get_uploaded_object_name(file.name);
                    var etag = info.responseHeaders.substr(7);
                    var etag = etag.substr(0, etag.indexOf('"'));
                    document.getElementById(filemd5_input_id).value=etag;
                    document.getElementById(fileurl_input_id).value=url;
                    $("#mask").hide();
                }else {
                    $("#mask").hide();
                    console.log(up, file, info)
                }
            },

            Error: function (up, err) { 
                $("#mask").hide();
                output_error(err);
            }
        }
    });
    UploadeOTA.init();
}