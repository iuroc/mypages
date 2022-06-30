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
$note = $poncon->POST('note', null, true); // 备注
$update_time = time();
$mode = $poncon->POST('mode', 'add', true); // add:新增 update:更新

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
if (mysqli_num_rows($result) > 0 && $mode == 'add') {
    $poncon->error(904, '记录已经存在');
} else if (mysqli_num_rows($result) == 0 && $mode == 'update') {
    $poncon->error(904, '记录不存在');
}
if ($mode == 'add') {
    // 增加收藏
    $sql = "INSERT INTO `$table` (`username`, `tag_list`, `update_time`, `title`, `url`, `private`, `note`) VALUES ('$username', '$tags', $update_time, '$title', '$url', $private, '$note');";
} else if ($mode == 'update') {
    // 更新
    $sql = "UPDATE `$table` SET `tag_list` = '$tags', `title` = '$title', `url` = '$url', `private` = '$private', `update_time` = '$update_time', `note` = '$note' WHERE `url` = '$url' LIMIT 1;";
}

$result = mysqli_query($conn, $sql);
if (!$result) {
    $poncon->error(903, '数据库错误');
}

$poncon->success('成功');
