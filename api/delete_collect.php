<?php

/**
 * 删除收藏
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$conn = $poncon->initDb();

$config = $poncon->getConfig();

$data = [];

$table = $config['table']['collect'];

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);
// 通过URL和时间戳去删除收藏
$url = $poncon->POST('url', null, true);
$time = $poncon->POST('time', null, true);

if (!$username || !$password || !$url || !$time) {
    $poncon->error(900, '参数缺失');
}

$poncon->login($conn, $username, $password);

$sql = "DELETE FROM `$table` WHERE `username` = '$username' AND `url` = '$url' AND `update_time` = '$time';";
$result = mysqli_query($conn, $sql);

if ($result) {
    $poncon->success('删除成功');
} else {
    $poncon->error(910, '删除失败');
}
