<?php

/**
 * 用户注册
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


// 查询用户名是否存在
$sql = "SELECT * FROM `mypages_user` WHERE `username` = '$username'";
$result = mysqli_query($conn, $sql);
if (!$result) {
    $poncon->error(903, '数据库错误');
}
if (mysqli_num_rows($result) > 0) {
    $poncon->error(901, '用户名已存在');
}

// 插入用户信息
$sql = "INSERT INTO `mypages_user` (`username`, `password`, `register_time`) VALUES ('$username', '$password', " . time() . ")";
$result = mysqli_query($conn, $sql);
if (!$result) {
    $poncon->error(903, '数据库错误');
}

$poncon->success('注册成功', [
    'username' => $username,
    'password' => $password
]);
