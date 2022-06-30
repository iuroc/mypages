# mypages

一款标签化管理网页收藏的工具

## 开发宗旨

- 简约、轻量、便捷

## 安装说明

- 将 `public` 目录上传到主机
- 复制 `config.default.php` 为 `config.php`
- 将 `config.php` 中的数据库账号密码填写完整
- 运行 `index.html` 即可

## 示意图

![手机网页端](https://raw.githubusercontent.com/oyps/mypages/main/img/at_phone.jpg)

![电脑网页端](https://raw.githubusercontent.com/oyps/mypages/main/img/at_computer.jpg)

## 功能

- 用户登陆注册
- 添加URL收藏，一键获取title，并支持设置标签
- 整体列表按时间排序，可按标签筛选列表
- 可随时编辑和删除收藏记录
- 根据收藏列表自动生成标签列表，用户可多选标签进行一次性加载
- 可生成个人收藏页，不显示私密部分（bate）
- 主页上显示完整收藏列表，列表项上包含标签
- 单击按钮弹出模态框，可以新增收藏
- 点击列表中的标签，弹出模态框加载该标签（bate）
- 不支持重复URL

### 标签定义规则推荐

- 标签能拆解的，尽量拆解，比如 `编程教程`，拆成 `编程` + `教程`
- 对于实在不能拆解的，需保留，比如 `搜索引擎` 不能拆成 `搜索` + `引擎`
- 这样一来，可以最大限度减少标签数量，提高筛选效率
