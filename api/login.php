<?php

/**
 * 用户登录
 */

require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

// 初始化数据库
$conn = $poncon->initDb();

$username = $poncon->GET('username');
$password = $poncon->GET('password');

if (!$username || !$password) {
    $poncon->error(900, '参数缺失');
}


// 判断账号密码是否正确
$sql = "SELECT * FROM `mypages_user` WHERE `username` = '$username' AND `password` = '$password'";
$result = mysqli_query($conn, $sql);
if (!$result) {
    $poncon->error(903, '数据库错误');
}

if (mysqli_num_rows($result) == 0) {
    $poncon->error(907, '账号或密码错误');
}

$poncon->success('登录成功', [
    'username' => $username,
    'password' => $password
]);
