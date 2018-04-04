<?php
require_once "jssdk.class.php";

$uurl = "";
if(is_array($_GET)&&count($_GET)>0)//先判断是否通过get传值了
{
    if(isset($_GET["urlparam"]))//是否存在"urlparam"的参数
    {
        $uurl=$_GET["urlparam"];//存在
    }
}

$cfg_appid = "wx99c6d016f620e437";
$cfg_screct = "a210e567af63e3ce82d95d2bf1fc7876";
$weixin = new jssdk($cfg_appid, $cfg_screct, $uurl);

$signPackage = $weixin->get_sign();

$data = array(
  'appId' => $signPackage["appId"], 
  'timestamp' => $signPackage["timestamp"],
  'nonceStr' => $signPackage["nonceStr"],
  'signature' => $signPackage["signature"]);
  
echo json_encode($data);