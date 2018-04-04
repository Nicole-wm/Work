<?php
$con = mysql_connect("localhost:3306","h5","a73fb578d8");
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}
mysql_select_db("h5", $con);
$sql="INSERT INTO applicant(pname,linkman,phone,address,arange,total,signtime)
VALUES
('$_POST[pname]','$_POST[linkman]','$_POST[phone]','$_POST[address]','$_POST[arange]','$_POST[total]',now())";

if (!mysql_query($sql,$con))
{
	die('Error: ' . mysql_error());
}
echo "1 record added";
mysql_close($con)
?>