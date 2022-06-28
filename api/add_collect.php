<?php

/**
 * 新增收藏
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

// 初始化数据库
$conn = $poncon->initDb();

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);
$tags = $poncon->POST('tags', null, true); // JSON数组[...]
$title = $poncon->POST('title', null, true);
$url = $poncon->POST('url', null, true);
$private = $poncon->POST('private', 0, true); // 0:公开 1:私密
$update_time = time();

if (!$username || !$password || !$title || !$url) {
    $poncon->error(900, '参数缺失');
}

// 登录验证
$poncon->login($conn, $username, $password);

$config = $poncon->getConfig();
$table = $config['table']['collect'];

// 判断URL是否存在

$sql = "SELECT `url` FROM `$table` WHERE `url` = '$url' LIMIT 1;";
$result = mysqli_query($conn, $sql);
if (mysqli_num_rows($result) > 0) {
    $poncon->error(904, '记录已经存在');
}

// 增加收藏
$sql = "INSERT INTO `$table` (`username`, `tag_list`, `update_time`, `title`, `url`, `private`) VALUES ('$username', '$tags', $update_time, '$title', '$url', $private);";

$result = mysqli_query($conn, $sql);
if (!$result) {
    $poncon->error(903, '数据库错误');
}

$poncon->success('收藏成功');
