<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>FRANGI经销商申请</title>
    <meta name="keywords" content="FRANGI经销商申请"/>
    <meta name="description" content="FRANGI经销商申请" />
    <link rel="icon" href="../../IMG/frangi.ico" type="image/x-icon">
    <!-- h5.frangi.cn Baidu tongji analytics -->
    <script src="../../JS/baiduhm.js"></script>
    <style type="text/css">
        html,body{
            margin: 0;
            padding: 0;
        }
        #data_tb
        {
            width:100%;
            border-collapse:collapse;
        }
        #data_tb td, #data_tb th 
        {
            font-size:1em;
            border:1px solid #98bf21;
            padding:3px 7px 2px 7px;
        }
        #data_tb th 
        {
            font-size:1.1em;
            text-align:left;
            padding-top:5px;
            padding-bottom:4px;
            background-color:#A7C942;
            color:#ffffff;
        }
    </style>  
</head> 

<body>
    <table id="data_tb">
       <thead>
           <th>编号</th>
           <th>公司名称</th>
           <th>联系人</th>
           <th>手机</th>
           <th>地区</th>
           <th>公司经营范围</th>
           <th>公司员工总数</th>
           <th>申请时间</th>
       </thead>
       <?php
            $con = mysqli_connect("localhost:3306","h5","a73fb578d8","h5");
            if (!$con) 
            { 
                die("连接错误: " . mysqli_connect_error()); 
            } 
            $sql = "select * from applicant order by signtime desc;";
            $result = mysqli_query($con,$sql);
            if($result){
                $rowcount=mysqli_num_rows($result);
                printf("总共返回 %d 行数据。",$rowcount);
                for($i=0;$i<$rowcount;$i++){
                    $sql_arr = mysqli_fetch_assoc($result);
                    $id = $sql_arr['id'];
                    $pname = $sql_arr['pname'];
                    $linkman = $sql_arr['linkman'];
                    $phone = $sql_arr['phone'];
                    $address = $sql_arr['address'];
                    $arange = $sql_arr['arange'];
                    $total = $sql_arr['total'];
                    $signtime = $sql_arr['signtime'];
                    echo "<tr><td>$id</td><td>$pname</td><td>$linkman</td><td>$phone</td><td>$address</td><td>$arange</td><td>$total</td><td>$signtime</td></tr>";
                }
                mysqli_free_result($result);
            }
            mysqli_close($con);
        ?>
</table>
</body>
</html>
