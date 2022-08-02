<?php

/**
 * 获取网页标题
 */
require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();
$url = $poncon->POST('url', null, true);

$input = json_decode('{
  "options": {
    "http": {
      "method": "GET",
      "header": "Content-type: application/x-www-form-urlencoded\n",
      "content": "",
      "timeout": 900
    },
    "ssl": {
      "verify_peer": false,
      "verify_peer_name": false
    }
  },
  "url": "' . $url . '",
  "charset": "utf-8"
}', true);

// $http是个数组，前端需要传入一个JSON
$options = $input['options'];
$charset = $input['charset'];
if ($charset != 'utf-8') {
    $header = $options['http']['header'];
    $options['http']['header'] = iconv('utf-8', $charset, $header);
}
$context = stream_context_create($options);
$ym = file_get_contents($input['url'], false, $context);
foreach ($http_response_header as $key => $value) {
    $item = explode(':', $value);
    if (strtolower($item[0]) == 'content-encoding' && strtolower($item[1]) == ' gzip') {
        $result = gzdecode($result);
    }
}

if ($charset != 'utf-8') {
    $result = iconv($charset, 'utf-8//IGNORE', $result);
}



if (!$url) {
    $poncon->error(900, '参数缺失');
}


$title = $poncon->sj($ym, '<title', '</title>');
$title = $poncon->sj($title, '>', null);
// 去除实体
$title = html_entity_decode($title);

$poncon->success('获取成功', $title);
