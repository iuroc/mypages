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


$config = $this->getConfig();
$table = $config['table']['collect'];
preg_match('/^#\s*(.*)$/', $keyword, $matches);
if ($matches[1]) {
    // 搜索标签
    $tag = $matches[1];
    $sql = "SELECT * FROM `$table` WHERE `name` LIKE '%$keyword%'";
} else {
    // 搜索所有
    $sql = "SELECT * FROM `$table` WHERE `name` LIKE '%$keyword%'";
}
