<?php

/**
 * 中文分词
 */

require 'Poncon.php';

use Poncon\Poncon;

$poncon = new Poncon();

$text = $poncon->GET('text', '', true);

$result = $poncon->request('http://39.96.43.154:8080/api', 'POST', json_encode(['text' => $text]), 'Content-Type: application/json');

$result = json_decode($result, true);

$words = $result['words'];

$data = [];

foreach ($words as $word) {
    $data[] = $word['text'];
}

$poncon->success('分词成功', $data);
