const Poncon = {
    title: 'My Pages', // 网页总标题
    baseUrl: '', // 项目安装目录，不以/结尾
    storageKey: 'my_pages', // 本地存储键名
    entryPage: '#/home', // 主页，路由出错时加载
    loginStatus: 0, // 登录状态 0:未登录 1: 已登录
    /**
     * 用户登陆
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {boolean} 是否验证成功
     */
    login(username, password) {
        if (!username || !password) {
            this.notLogin()
            return false
        }
        var success
        var target = this
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/login.php',
            data: {
                username: username,
                password: password
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    success = true
                    target.setStorage('username', username)
                    target.setStorage('password', password)
                    target.loginStatus = 1
                    return true
                }
                alert(data.msg)
                target.notLogin()
                success = false
                return false
            },
            async: false
        })
        return success
    },
    /**
     * 获取存储值
     * @param {string} key 键名
     * @returns {any} 返回值
     */
    getStorage(key) {
        var data = localStorage[this.storageKey]
        try {
            data = JSON.parse(data)
            return data[key]
        } catch {
            return null
        }
    },
    /**
     * 设置存储值
     * @param {string} key 键名
     * @param {any} value 值
     */
    setStorage(key, value) {
        var data = localStorage[this.storageKey]
        data = data ? data : '{}'
        var data = JSON.parse(data)
        data[key] = value
        localStorage[this.storageKey] = JSON.stringify(data)
    },
    /**
     * 未登录状态
     */
    notLogin() {
        if (location.hash.split('/')[1] != 'login') {
            location.hash = '/login/register'
        }
    },
    /**
     * 点击登录
     */
    clickLogin() {
        var page = $('.page-login .sub-page-login')
        var username = page.find('.input-username').val()
        var password = page.find('.input-password').val()
        if (!username.match(/^\w{4,20}$/) || !password.match(/^\w{8,20}$/)) {
            alert('请输入正确的格式')
            return
        }

        if (this.login(username, md5(password))) {
            location.href = this.entryPage
        }
    },
    /**
     * 点击注册
     */
    clickRegister() {
        var page = $('.page-login .sub-page-register')
        var username = page.find('.input-username').val()
        var password = page.find('.input-password').val()
        var password2 = page.find('.input-password2').val()
        if (password != password2) {
            alert('两次输入的密码不一致')
            return
        } else if (!username.match(/^\w{4,20}$/) || !password.match(/^\w{8,20}$/)) {
            alert('请输入正确的格式')
            return
        }
        this.register(username, password)
    },
    /**
     * 用户注册
     * @param {string} username 用户名
     * @param {string} password 密码
     */
    register(username, password) {
        var target = this
        password = md5(password)
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/register.php',
            data: {
                username: username,
                password: password
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    target.setStorage('username', username)
                    target.setStorage('password', password)
                    target.loginStatus = 1
                    location.href = target.entryPage
                    return
                }
                alert(data.msg)
            }
        })
    }
}