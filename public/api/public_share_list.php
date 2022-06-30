<?php

/**
 * 共享列表
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$conn = $poncon->initDb();

$config = $poncon->getConfig();

$username = $poncon->POST('username', null, true);
$page = $poncon->POST('page', 0, true);
$pageSize = $poncon->POST('pageSize', 36, true);
$offset = $page * $pageSize;

$table = $config['table']['collect'];

$data = [];

$sql = "SELECT * FROM `$table` WHERE `username` = '$username' ORDER BY `update_time` DESC LIMIT $pageSize OFFSET $offset;";


$result = mysqli_query($conn, $sql);

if (!$result) {
    $poncon->error(903, '数据库错误');
}

while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    unset($row['id']);
    unset($row['username']);
    $data[] = $row;
}

$poncon->success('获取成功', $data);
