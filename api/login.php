<?php

/**
 * 用户登录
 */

require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

// 初始化数据库
$conn = $poncon->initDb();

$username = $poncon->POST('username', null, true);
$password = $poncon->POST('password', null, true);

if (!$username || !$password) {
    $poncon->error(900, '参数缺失');
}

// 登录验证
$poncon->login($conn, $username, $password);

$poncon->success('登录成功', [
    'username' => $username,
    'password' => $password
]);
