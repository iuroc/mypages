<?php

/**
 * 获取网页标题
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$url = $poncon->GET('url', null, true);
if (!$url) {
    $poncon->error(900, '参数缺失');
}

$ym = $poncon->request($url, 'GET', null, "referer: $url\norigin: $url");
$title = $poncon->sj($ym, '<title>', '</title>');
// 去除实体
$title = html_entity_decode($title);

$poncon->success('获取成功', $title);
