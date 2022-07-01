<?php

/**
 * 获取标签列表
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$conn = $poncon->initDb();

$config = $poncon->getConfig();

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);

if (!$username || !$password) {
    $poncon->error(900, '参数缺失');
}

$poncon->login($conn, $username, $password);

$sql = "SELECT `tag_list` FROM `{$config['table']['collect']}` WHERE `username` = '$username' ORDER BY `update_time` DESC;";

$result = mysqli_query($conn, $sql);

if (!$result) {
    $poncon->error(903, '数据库错误');
}
$data = [];

while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $list  = json_decode($row['tag_list'], true);
    foreach ($list as $tag) {
        if (!isset($data[$tag])) {
            $data[$tag] = 1;
        } else {
            $data[$tag]++;
        }
    }
}

$poncon->success('获取成功', $data);
