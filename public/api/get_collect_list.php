<?php

/**
 * 获取收藏列表
 */

require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

// 初始化数据库
$conn = $poncon->initDb();

$data = [];

$config = $poncon->getConfig();
$table = $config['table']['collect'];

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);
$page = $poncon->POST('page', 0, true);
$pageSize = $poncon->POST('pageSize', 36, true);
$offset = $page * $pageSize;
if (!$username || !$password) {
    $poncon->error(900, '参数缺失');
}

// 登录验证
$poncon->login($conn, $username, $password);




$sql = "SELECT * FROM `$table` WHERE `username` = '$username' ORDER BY `update_time` DESC LIMIT $pageSize OFFSET $offset;";
$result = mysqli_query($conn, $sql);

if (!$result) {
    $poncon->error(903, '数据库错误');
}


while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $row['tag_list'] = json_decode($row['tag_list'], true);
    unset($row['id']);
    unset($row['username']);
    array_push($data, $row);
}
$poncon->success('获取成功', $data);
