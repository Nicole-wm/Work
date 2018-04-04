<?php
/**
 * 微信jssdk和Oauth功能类
 * 包含分享签名,获取openid,获取用户信息,获取全局票据等
 * Author zyq 微信cuczyq qq527758142
 *
 * 2017-6-12
 */

error_reporting(E_ALL^E_NOTICE^E_WARNING);
date_default_timezone_set('PRC');//设置时区

$WXAPPID = "";
$WXSN = "";

//$c_config = mysql_query(' SELECT * FROM game_config ORDER BY ID ASC LIMIT 1 ');
//if ($row = mysql_fetch_array($c_config)){
//    $WXAPPID = $row['c_wxappid'];
//    $WXSN = $row['c_wxsn'];
//}


define('APPID', $WXAPPID);               //设置appid
define('APPSN', $WXSN);                  //设置apps


define('_USERAGENT_', $_SERVER['HTTP_USER_AGENT']);
define('_REFERER_', 'https://mp.weixin.qq.com');


if (!function_exists('dump')) {
    function dump($arr)
    {
        echo '<pre>' . print_r($arr, TRUE) . '</pre>';
    }

}

function curl_file_get_contents($durl)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $durl);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_USERAGENT, _USERAGENT_);
    curl_setopt($ch, CURLOPT_REFERER, _REFERER_);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // windows跳过SSL证书检查
    $r = curl_exec($ch);
    curl_close($ch);
    return $r;
}

class jssdk
{
    private $appid;
    private $appsn;
    private $url;

    public $_auth2_openid = 'auth2_openid';
    public $_auth2_nickname = 'auth2_nickname';
    public $_auth2_headimgurl = 'auth2_headimgurl';
    public $_auth2_sex = 'auth2_sex';

    function __construct($appId = '', $appSecret = '', $urlx = '')
    {
        if (!empty($appId)) {
            $this->appid = $appId;
        } else {
            $this->appid = APPID;
        }

        if (!empty($appSecret)) {
            $this->appsn = $appSecret;
        } else {
            $this->appsn = APPSN;
        }

        $this->url = (empty($urlx)) ? "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] : $urlx;
    }

    public function get_curl($url)
    {

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // windows跳过SSL证书检查
        curl_setopt($ch, CURLOPT_URL, $url);
        $data = curl_exec($ch);
        curl_close($ch);
        return json_decode($data, 1);
    }

    public function post_curl($url, $post = '')
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // windows跳过SSL证书检查
        $data = curl_exec($ch);
        curl_close($ch);
        return json_decode($data, 1);
    }

    private function get_randstr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }


    public function get_jsapi_ticket()
    {

        $file = 'access_ticket_log.txt';

        if (defined('SAE_TMP_PATH')) {
            $mem = memcache_init();//此处是sae写法
            $ticket = memcache_get($mem, 'ticket');
            if (empty($ticket)) {
                $accessToken = $this->get_access_token();
                $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
                $result = $this->get_curl($url);
                $ticket = $result["ticket"];
                memcache_set($mem, 'ticket', $ticket, 0, 7200);
            }
        } else {
            // 重新获取access_token

            $data = json_decode(file_get_contents("jsapi_ticket.json"));
//            $data = json_decode(curl_file_get_contents("jsapi_ticket.json"));
            if ($data->expire_time < time()) {

                $content = date("Y-m-d H:i", time()) . " jsapi_ticket 过期    " . $data->expire_time . " < " . time() . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

                $accessToken = $this->get_access_token();
                $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
                $result = $this->get_curl($url);
                $ticket = $result["ticket"];

                $content = date("Y-m-d H:i", time()) . " jsapi_ticket 过期   新的ticket " . $ticket . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

                if ($ticket) {
                    $data->expire_time = time() + 7200;
                    $data->jsapi_ticket = $ticket;
                    $fp = fopen("jsapi_ticket.json", "w");
                    fwrite($fp, json_encode($data));
                    fclose($fp);
                }

                $content = date("Y-m-d H:i", time()) . " jsapi_ticket 新的  expire_time：  " . $data->expire_time . "  --- jsapi_ticket： " . $data->jsapi_ticket . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

            } else {
                $ticket = $data->jsapi_ticket;

                $content = date("Y-m-d H:i", time()) . " jsapi_ticket 没过期  expire_time：  " . $data->expire_time . "  --- jsapi_ticket： " . $data->jsapi_ticket . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }
            }
        }

        return $ticket;
    }

    /**
     * 获取access token
     */
    public function get_access_token()
    {
        $file = 'access_ticket_log.txt';

        if (defined('SAE_TMP_PATH')) {
            $mem = memcache_init();//此处是sae写法
            $access_token = memcache_get($mem, 'access_token');
            if (empty($access_token)) {
                $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" . $this->appid . "&secret=" . $this->appsn;
                $result = $this->get_curl($url);
                $access_token = $result["access_token"];
                memcache_set($mem, 'access_token', $access_token, 0, 7200);
            }
        } else {
            $data = json_decode(file_get_contents("access_token.json"));
//            $data =  json_decode(curl_file_get_contents("access_token.json"));
            if ($data->expire_time < time()) {

                $content = date("Y-m-d H:i", time()) . " access_token 过期    " . $data->expire_time . " < " . time() . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

                $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={$this->appid}&secret={$this->appsn}";
                $result = $this->get_curl($url);
                $access_token = $result["access_token"];
                $content = date("Y-m-d H:i", time()) . " access_token 过期  新的  access_token： " . $access_token . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

                if ($access_token) {
                    $data->expire_time = time() + 7200;
                    $data->access_token = $access_token;
                    $fp = fopen("access_token.json", "w");
                    fwrite($fp, json_encode($data));
                    fclose($fp);
                }

                $content = date("Y-m-d H:i", time()) . " access_token 新的  expire_time：  " . $data->expire_time . "  --- access_token： " . $data->access_token . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

            } else {
                $access_token = $data->access_token;

                $content = date("Y-m-d H:i", time()) . " access_token 没过期  expire_time：  " . $data->expire_time . "  --- access_token： " . $data->access_token . "    \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }
            }
        }
        return $access_token;
    }

    /**
     * 获取JSSDK接口签名
     * @return array
     */
    public function get_sign()
    {
        $file = 'access_ticket_log.txt';

        $content = date("Y-m-d H:i", time()) . " get_sign 获取签名    " . "    \n";
        if ($f = file_put_contents($file, $content, FILE_APPEND)) {
        }

        $jsapi_ticket = $this->get_jsapi_ticket();

        $url = $this->url;
        $timestamp = time();
        $nonceStr = $this->get_randstr();
        $string = "jsapi_ticket=$jsapi_ticket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";
        
        
        $signature = sha1($string);

        $signPackage = array(
            "appId" => $this->appid,
            "nonceStr" => $nonceStr,
            "timestamp" => $timestamp,
            "url" => $url,
            "signature" => $signature,
            "rawString" => $string
            );
        if ($f = file_put_contents($file, $signPackage, FILE_APPEND)) {
        }
        return $signPackage;
    }

    /**
     * 获取Code
     * @param $redirect_uri
     * @param string $scope
     * @param int $state
     */
    public function get_code($redirect_uri, $scope = 'snsapi_base', $state = 1)
    {
        //snsapi_userinfo
        if ($redirect_uri[0] == '/') {
            $redirect_uri = substr($redirect_uri, 1);
        }
        $redirect_uri = urlencode($redirect_uri);
        $response_type = 'code';
        $appid = $this->appid;
        $url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' . $appid . '&redirect_uri=' . $redirect_uri . '&response_type=' . $response_type . '&scope=' . $scope . '&state=' . $state . '#wechat_redirect';
        header('Location: ' . $url, true, 301);
    }

    /**
     * 获取openid
     * @param $code
     * @return mixed
     */
    public function get_openid($code)
    {
        /*
        $grant_type = 'authorization_code';
        $appid = $this->appid;
        $appsn = $this->appsn;
        $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . $appid . '&secret=' . $appsn . '&code=' . $code . '&grant_type=' . $grant_type . '';
        $data = json_decode(file_get_contents($url), 1);
        return $data;
        */

        $grant_type = 'authorization_code';
        $appid = $this->appid;
        $appsn = $this->appsn;
        $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . $appid . '&secret=' . $appsn . '&code=' . $code . '&grant_type=' . $grant_type . '';
        $data = $this->get_curl($url);
        return $data;
    }

    /**
     * 通过openid获取用户信,不会弹出窗口
     *
     * snsapi_base
     *
     * 可以获取是否关注
     * @param $openid
     * @return mixed
     */
    public function get_user($openid)
    {
        $accessToken = $this->get_access_token();

        $url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token={$accessToken}&openid={$openid}&lang=zh_CN";
//        $data = json_decode(file_get_contents($url), 1);
        $data = json_decode(curl_file_get_contents($url), 1);
        return $data;
    }

    /**
     * 用弹出获取用户信息
     *
     * snsapi_userinfo
     *
     * @param $accessToken
     * @param $openid
     * @return mixed
     */

    public function get_user1($accessToken, $openid)
    {
        $url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' . $accessToken . '&openid=' . $openid . '&lang=zh_CN';
//        $data = json_decode(file_get_contents($url), 1);
        $data = json_decode(curl_file_get_contents($url), 1);
        return $data;
    }


    /**
     * 判断是否关注公众号
     * @param $accessToken
     * @param $openid
     * @return int
     */
    public function isguanzhu($openid)
    {
        $userinfo_guanzhu = $this->get_user($openid);
        $isguanzhu = empty($userinfo_guanzhu['subscribe']) ? 0 : 1;

        if (isset($userinfo_guanzhu['errcode'])) {
            echo "授权错误" . $userinfo_guanzhu['errcode'];

            // 授权错误，删除token，重新获取

            unlink("access_token.json");
            unlink("jsapi_ticket.json");

            return 2;
        }

        return $isguanzhu;
    }


    /**
     * 获取微信用户信息
     *
     * 加入关注公众号标识
     *
     * @param $back_url  获取授权成功后，返回的链接
     * @return mixed
     */
    public function getAuth($back_url)
    {

        $file = 'access_ticket_log.txt';

        //TODO WKL 改成游戏当前的链接地址
        if (empty($back_url)) {
//            $back_url = $cfg_oauth_cb_url;
//            return null;
        }

        // Scope  snsapi_base：不弹出, snsapi_userinfo：弹出授权对话框
        //$scope = "snsapi_base";
        $scope = "snsapi_userinfo";

        if (isset($_GET["code"])) {
            $code = $_GET["code"];

            $arr = $this->get_openid($code);

            if (empty($arr)) {
                header('Location: ' . $back_url);
            }

            $access_token = $arr["access_token"];
            $openid = $arr["openid"];

            if ($scope == "snsapi_base") {
                $userinfo = $this->get_user($openid);//通过openid获取用户信,不会弹出窗口
            } else {
                $userinfo = $this->get_user1($access_token, $openid);//用弹出获取用户信息
            }

            if (!empty($userinfo)) {

                // 查是否关注公众号 begin
                $isguanzhu = $this->isguanzhu($openid);
                $userinfo['guanzhu'] = $isguanzhu;
                $_SESSION["authinfo"] = $userinfo;
                // 查是否关注公众号 end

                $content = date("Y-m-d H:i", time()) . " getAuth 授权  成功       昵称：" . $userinfo['nickname'] . " --- 关注：" . $userinfo['guanzhu'] . "  \n";
                if ($f = file_put_contents($file, $content, FILE_APPEND)) {
                }

                return $userinfo;
            }

        } else {
            $this->get_code($back_url, $scope);
        }

    }

    /*
    function getUserInfo($openid, $ACCESS_TOKEN = '', $scope = "snsapi_userinfo")
    {

        if ($ACCESS_TOKEN == '' || $scope == 'snsapi_base') {
            $userinfo = $this->get_user($openid);//通过openid获取用户信,不会弹出窗口
        } else {
            $userinfo = $this->get_user1($ACCESS_TOKEN, $openid);//用弹出获取用户信息
        }

        //设置cookie信息
        setcookie($this->_auth2_headimgurl, $userinfo['headimgurl'], time() + 3600 * 24);
        setcookie($this->_auth2_nickname, $userinfo['nickname'], time() + 3600 * 24);
        setcookie($this->_auth2_openid, $openid, time() + 3600 * 24);
        setcookie($this->_auth2_sex, $userinfo['sex'], time() + 3600 * 24);

        return $userinfo;
    }
    */

    /*
    function getAuth2($openid)
    {

        $arr = $this->get_openid($code);
        //    $arr = $weixin->get_openid_crul($code);

        $access_token = $arr["access_token"];
        $openid = $arr["openid"];

        $userinfo = $this->get_user1($access_token, $openid);//用弹出获取用户信息


        //设置cookie信息
        setcookie($this->_auth2_headimgurl, $userinfo['headimgurl'], time() + 3600 * 24);
        setcookie($this->_auth2_nickname, $userinfo['nickname'], time() + 3600 * 24);
        setcookie($this->_auth2_openid, $openid, time() + 3600 * 24);
        setcookie($this->_auth2_sex, $userinfo['sex'], time() + 3600 * 24);

        return $userinfo;
    }
    */
}

?>