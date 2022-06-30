<?php

/**
 * 分享页面
 */
require '../api/Poncon.php';

header('Content-Type: text/html; charset=utf-8');

use Poncon\Poncon;

$poncon = new Poncon();

$conn = $poncon->initDb();

$config = $poncon->getConfig();

$table = $config['table']['collect'];

$username = $poncon->GET('u', null, true);
$keyword = $poncon->GET('s', null, true);

if (!$username) {
    die('用户名不能为空');
}
$sql = "SELECT * FROM $table WHERE username = '$username' AND `private` = 0 AND (`title` LIKE '%$keyword%' OR `url` LIKE '%$keyword%' OR `tag_list` LIKE '%$keyword%' OR `note` LIKE '%$keyword%') ORDER BY `update_time` DESC;";
$result = mysqli_query($conn, $sql);

?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.staticfile.org/bootstrap/4.6.0/css/bootstrap.min.css" />
    <script src="https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdn.staticfile.org/bootstrap/4.6.0/js/bootstrap.bundle.min.js"></script>
    <title><?php echo "$username 的分享" ?></title>
</head>

<body class="user-select-none">
    <div class="container my-4 my-sm-5">
        <h5 class="mb-3"><?php echo "来自用户 <mark class=\"badge badge-primary text-white\">$username</mark> 的分享" ?></h5>
        <?php
        if ($keyword) {
            echo '
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="?u=' . $username . '">返回</a></li>
                <li class="breadcrumb-item active" aria-current="page">' . $keyword . '</li>
            
            </ol>
        </nav>';
        }

        ?>

        <div class="collectList row">
            <?php
            $html = '';
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $tags = json_decode($row['tag_list'], true);
                $tagsHtml = '';
                foreach ($tags as $tag) {
                    $tagsHtml .= "<a href=\"?u={$username}&s={$tag}\" class=\"small mr-2\"># $tag</a>";
                }
                $html .= "
            <div class=\"col-xl-4 col-md-6 mb-3\">
                <div class=\"card px-3 py-2 h-100 d-flex flex-column justify-content-center shadow-sm\">
                    <div class=\"mb-1 font-weight-bold\" onclick=\"location.href='{$row['url']}'\">{$row['title']}</div>
                    <a class=\"mb-1 small text-muted\" target=\"_blank\" href=\"{$row['url']}\">{$row['url']}</a>
                    <div>{$tagsHtml}</div>
                </div>
            </div>";
            }
            echo $html;
            ?>

        </div>
    </div>
</body>

</html>