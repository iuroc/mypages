<?php

/**
 * 获取网页标题
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$url = $poncon->POST('url', null, true);
if (!$url) {
    $poncon->error(900, '参数缺失');
}

$ym = file_get_contents($url);

$title = $poncon->sj($ym, '<title', '</title>');
$title = $poncon->sj($title, '>', null);
// 去除实体
$title = html_entity_decode($title);

$poncon->success('获取成功', $title);
