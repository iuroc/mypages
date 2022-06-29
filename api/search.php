<?php

/**
 * 搜索记录
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

// 初始化数据库
$conn = $poncon->initDb();

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);
$keyword = $poncon->POST('keyword', null, true);
$page = $poncon->POST('page', 0, true);
$pageSize = $poncon->POST('pageSize', 36, true);
$offset = $page * $pageSize;

if (!$username || !$password) {
    $poncon->error(900, '参数缺失');
}

// 登录验证
$poncon->login($conn, $username, $password);

$data = [];

$config = $poncon->getConfig();
$table = $config['table']['collect'];
preg_match('/^#\s*(.*)$/', $keyword, $matches);
if (isset($matches[1])) {
    // 搜索标签
    $tag = $matches[1];
    $sql = "SELECT * FROM `$table` WHERE `tag_list` LIKE '%$tag%' ORDER BY `update_time` DESC LIMIT $pageSize OFFSET $offset;";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $row['tag_list'] = json_decode($row['tag_list'], true);
        array_push($data, $row);
    }
    $poncon->success('获取成功', $data);
} else {
    // 搜索所有
    $sql = "SELECT * FROM `$table` WHERE `username` = '$username' AND `title` LIKE '%$keyword%' OR `url` LIKE '%$keyword%' OR `tag_list` LIKE '%$keyword%' ORDER BY `update_time` DESC LIMIT $pageSize OFFSET $offset;";
    $result = mysqli_query($conn, $sql);
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $row['tag_list'] = json_decode($row['tag_list'], true);
        array_push($data, $row);
    }
    $poncon->success('获取成功', $data);
}
