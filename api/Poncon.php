<?php

/**
 * @author 鹏优创
 * @version 1.0
 */

namespace Poncon;

header('Content-Type: application/json');

class Poncon
{
    /**
     * 创建ID，语法：createId([$length])
     * @param int $length 长度 范围：1-32
     * @return string
     */
    function createId(...$args)
    {
        return substr(str_shuffle(md5(str_shuffle(time()))), 0, isset($args[0]) ? $args[0] : 10);
    }

    /**
     * 获取POST参数，语法：POST($key[, $default]);
     * @param string $key 参数名
     * @param mixed $default 默认值
     * @return mixed
     */
    function POST($key, ...$args)
    {
        return isset($_POST[$key]) && $_POST[$key] ? $_POST[$key] : (isset($args[0]) ? $args[0] : null);
    }
    /**
     * 获取GET参数，语法：GET($key[, $default]);
     * @param string $key 参数名
     * @param mixed $default 默认值
     * @return mixed
     */
    function GET($key, ...$args)
    {
        return isset($_GET[$key]) && $_GET[$key] ? $_GET[$key] : (isset($args[0]) ? $args[0] : null);
    }

    /**
     * 发送请求，语法：request($url[, $method[, $data[, $header[, $return]]]]);
     * @param string $url 请求地址
     * @param string $method 请求方式
     * @param string|array $data 请求数据
     * @param string $header 请求头
     * @param bool|null $return 是否返回curl对象 默认为false 即直接返回结果
     * @return mixed
     */
    function request($url, ...$args)
    {
        $method = isset($args[0]) ? $args[0] : 'GET';
        $data = isset($args[1]) ? $args[1] : null;
        $header = isset($args[2]) ? $args[2] : null;
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HEADER, $header);
        if (isset($args[3]) && $args[3] == true) {
            return $ch;
        } else {
            $result = curl_exec($ch);
            curl_close($ch);
            return $result;
        }
    }

    /**
     * 截取两个字符串之间的字符串，不包含两端，语法：sj($str, $start, $end);
     * @param string $str 待操作字符串
     * @param string|null $start 开始字符串
     * @param string|null $end 结束字符串
     * @return string
     */
    function sj($str, $start, $end)
    {
        $j1 = $start ? strpos($str, $start) : 0;
        $j2 = $start ? strlen($start) : 0;
        $j3 = strlen($str);
        $j4 = ($j1 + $j2);
        $j5 = ($j3 - $j4);
        $j6 = substr($str, $j4, $j5);
        $j7 = $end ? strpos($j6, $end) : $j5;
        $j8 = substr($j6, 0, $j7);
        return $j8;
    }

    /**
     * 返回错误信息，语法：error($code, $msg);
     * @param int $code 错误码
     * @param string $msg 错误信息
     */
    function error($code, $msg)
    {
        die(json_encode([
            'code' => $code,
            'msg' => $msg
        ]));
    }

    /**
     * 返回成功信息，语法：success($msg);
     * @param string $msg 成功信息
     */
    function success($msg, ...$args)
    {
        echo json_encode([
            'code' => 200,
            'msg' => $msg,
            'data' => isset($args[0]) ? $args[0] : null
        ]);
    }

    /**
     * 获取配置信息，语法：getConfig();
     */
    function getConfig()
    {
        require 'config.php';
        return $config;
    }

    /**
     * 初始化数据库，语法：initDB();
     */
    function initDb()
    {
        $config = $this->getConfig();
        $conn = mysqli_connect($config['mysql']['host'], $config['mysql']['user'], $config['mysql']['pass'], $config['mysql']['db']);
        if (!$conn) {
            die(json_encode([
                'code' => 903,
                'msg' => '数据库错误'
            ]));
        }
        // 新建用户表
        $sql = "CREATE TABLE IF NOT EXISTS `mypages_user` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `username` varchar(255) NOT NULL, -- 用户名
            `password` varchar(255) NOT NULL, -- 密码 md5密文
            `register_time` int(11) NOT NULL, -- 注册时间
            PRIMARY KEY (`id`) -- 主键
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $this->error(903, '数据库错误');
        }
        // 新建收藏表
        $sql = "CREATE TABLE IF NOT EXISTS `mypages_collect` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `username` int(11) NOT NULL, -- 收藏者用户名
            `title` varchar(255) NOT NULL, -- 网页标题
            `url` varchar(255) NOT NULL, -- 网址
            `update_time` int(11) NOT NULL, -- 更新时间
            `tag_list` TEXT NOT NULL, -- 标签列表，以逗号分隔
            `private` int(11) NOT NULL, -- 0:公开 1:私密
            PRIMARY KEY (`id`) -- 主键
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            $this->error(903, '数据库错误');
        }
        return $conn;
    }
}
