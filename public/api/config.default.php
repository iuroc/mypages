<?php

/**
 * 配置文件
 * 请将数据库账号密码填写完整
 */

$config = [
    'mysql' => [
        'host' => 'localhost',
        'user' => 'root',
        'pass' => '', // 数据库密码
        'db' => '' // 数据库名称
    ],
    'table' => [
        'user' => 'mypages_user', // 用户表
        'collect' => 'mypages_collect' // 收藏表
    ]
];

