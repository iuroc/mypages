const Poncon = {
    title: 'My Pages', // 网页总标题
    baseUrl: '', // 项目安装目录，不以/结尾
    storageKey: 'my_pages', // 本地存储键名
    entryPage: '#/home', // 主页，路由出错时加载
    loginStatus: 0, // 登录状态 0:未登录 1: 已登录
    tagList: [], // 标签列表
    pageLoad: {}, // 页面加载状态
    setting: { // 网页设置
        newWindowOpen: true, // 新窗口打开
    },
    data: { // 网页数据
        listType: 'load', // 列表类型 load 正常加载 search 搜索
    },
    /**
     * 用户登陆
     * @param {string} username 用户名
     * @param {string} password 密文密码
     * @returns {boolean} 是否验证成功
     */
    login(username, password, ifLoad) {
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
                    if (ifLoad) {
                        location.href = target.entryPage
                    }
                    return true
                }
                if (!ifLoad) {
                    alert(data.msg)
                }
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
     * @param {string} password 明文密码
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
    },
    /**
     * 显示模态框
     * @param {string} modalName 模态框名称
     */
    showModal(modalName, mode) {
        if (modalName == 'addCollect') {
            // 新增收藏
            $('.modal-addCollect').modal('show')

            var modal = $('.modal-addCollect')
            modal.find('.input-url').removeAttr('readonly')
            modal.find('.getHost').removeAttr('disabled')

            this.editMode = mode // 编辑模式 add: 新增 update: 更新
            if (mode == 'add') {
                $('.modal-addCollect .input-url').focus()
                modal.find('.addCollect').html('添加收藏')
            } else {
                modal.find('.addCollect').html('确定编辑')
            }
        } else if (modalName == 'searchCollect') {
            // 搜索收藏
            var modal = $('.modal-searchCollect')
            modal.modal('show')
            var input = modal.find('.input-keyword')
            input.focus()
            if (!input.val() && modal.find('.searchList').html().match(/^\s*$/)) {
                this.clickSearch()
            }
        }
    },
    /**
     * 新增标签
     */
    addTag() {
        var target = this
        var modal = $('.modal-addCollect')
        var tagName = modal.find('.input-tagName').val()
        tagName = $.trim(tagName)
        if (!tagName) {
            return
        }
        this.tagList.push(tagName)
        this.tagList = this.unique(this.tagList)
        modal.find('.tagList').html(this.makeTags(this.tagList))
        this.giveClick('.tagList')
        modal.find('.input-tagName').val('').focus()
    },
    /**
     * 获取URL中的主域部分
     */
    getHostFromUrl() {
        var target = this
        var modal = $('.modal-addCollect')
        var ele = modal.find('.input-url')
        try {
            var url = new URL(ele.val())
        } catch {
            alert('网址格式错误')
            return
        }
        ele.val(url.origin)
    },
    /**
     * 获取网页标题
     */
    getWebTitle() {
        var target = this
        var modal = $('.modal-addCollect')
        var ele = modal.find('.input-url')
        try {
            var temp = new URL(ele.val())
        } catch {
            alert('网址格式错误')
            return
        }
        var url = ele.val()
        modal.find('button.getWebTitle').html('获取中').attr('disabled', 'disabled')
        $.ajax({
            method: 'post',
            url: Poncon.baseUrl + 'api/get_title.php',
            data: {
                url: url
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                modal.find('button.getWebTitle').html('获取').removeAttr('disabled')
                modal.find('.input-title').val(data.data)
            }
        })
    },
    /**
     * 为某个容器中的组件绑定单击事件
     * @param {string} select 选择器名称
     */
    giveClick(select) {
        var target = this
        if (select == '.tagList') {
            var modal = $('.modal-addCollect')
            modal.find('.tagList div').unbind().click(function () {
                var tagName = $(this).text()
                target.removeArray(target.tagList, tagName)
                modal.find('.tagList').html(target.makeTags(target.tagList))
                target.giveClick('.tagList')
            })
        }
    },
    // 新增收藏
    addCollect() {
        var target = this
        var modal = $('.modal-addCollect')
        var url = $.trim(modal.find('.input-url').val())
        var title = $.trim(modal.find('.input-title').val())
        try {
            var temp = new URL(url)
        } catch {
            alert('网址格式错误')
            return
        }
        if (!title) {
            alert('请输入网页标题')
            return
        }
        var tags = JSON.stringify(this.tagList)
        var private = $('#customSwitch_private')[0].checked ? 1 : 0
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/add_collect.php',
            data: {
                username: this.getStorage('username'),
                password: this.getStorage('password'),
                url: url,
                title: title,
                tags: tags,
                private: private,
                mode: this.editMode
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    $('.modal-addCollect').modal('hide')
                    if (target.editMode == 'add') {
                        // 新增收藏 更新列表 清空表单
                        target.loadCollectList(0)
                        target.cleanInput()
                    } else if (target.editMode == 'update') {
                        // 更新收藏 更新当前列表项 清空表单
                        target.updateEditingNode()
                        target.cleanInput()
                    }
                    return
                }
                alert(data.msg)
            }
        })
    },
    /**
     * 更新正在编辑的收藏项
     */
    updateEditingNode() {
        var node = $(this.editingNode)
        var modal = $('.modal-addCollect')
        console.log(this.editingNode)
        node.find('.title').text(modal.find('.input-title').val())
        node.find('.url').text(modal.find('.input-url').val())
        node.find('.card-body').attr('data-private', $('#customSwitch_private')[0].checked ? 1 : 0)
        var tagsHtml = ''
        Poncon.tagList.forEach((tag) => {
            tagsHtml += `<div class="border border-dark rounded px-2 d-inline-block mr-1 mb-2"># ${tag}</div>`
        })
        node.find('.tags').html(tagsHtml).attr('data-tags', encodeURIComponent(JSON.stringify(this.tagList)))
    },
    /**
     * 清空输入框
     */
    cleanInput() {
        var modal = $('.modal-addCollect')
        modal.find('.input-url').val('')
        modal.find('.input-title').val('')
        modal.find('.input-tagName').val('')
        Poncon.tagList = []
        modal.find('.tagList').html('')
    },
    /**
     * 删除数组中某个值
     * @param {array} array 待操作数组
     * @param {any} need 需要删除的值
     */
    removeArray(array, need) {
        array.map((value, index) => {
            if (value == need) {
                array.splice(index, 1)
            }
        })
        return array
    },
    /**
     * 生成标签列表
     * @param {array} tagList 数据列表
     * @returns {string}
     */
    makeTags(tagList) {
        var html = ''
        tagList.forEach(tag => {
            html += `<div class="btn btn-sm btn-secondary mb-3 mr-3">${tag}</div>`
        })
        return html
    },
    /**
     * 
     * @param {string} eventName 回车触发的事件名称
     */
    inputKeyup(event, eventName) {
        if (event.keyCode == 13) {
            this[eventName]()
        }
    },
    /**
     * 返回随机颜色类名
     * @returns
     */
    randomColor() {
        var colorList = ['danger', 'secondary', 'primary', 'dark', 'info', 'success']
        var index = Math.floor(Math.random() * colorList.length)
        return colorList[index]
    },
    /**
     * 删除数组中重复元素
     * @param {array} arr 待操作数组
     * @returns {array}
     */
    unique(arr) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1)
                    j--
                }
            }
        }
        return arr
    },
    /**
     * 主页加载收藏列表
     * @param {number} page 页码 从0开始
     */
    loadCollectList(page) {
        var target = this
        var _page = $('.page-home')
        if (page == 0) {
            _page.find('.collectList').html('')
        }
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/get_collect_list.php',
            data: {
                username: this.getStorage('username'),
                password: this.getStorage('password'),
                page: page,
                pageSize: 15
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if (data.data.length == 0) {
                        target.setting.isBottom = 1
                        return
                    }
                    var html = target.makeList(data.data)
                    _page.find('.collectList').append(html)
                    Poncon.data.nowPage = page
                    Poncon.setting.isBottom = 0
                    Poncon.data.listType = 'load'
                    return
                }
                Poncon.setting.isBottom = 1
                alert(daat.msg)
            }
        })
    },
    /**
     * 将数据列表转为HTML代码
     * @param {array} dataList 数据列表
     */
    makeList(dataList, mode) {
        var html = ''
        mode = mode == 'search' ? 'mb-4' : 'col-xl-4 col-lg-6 mb-4'
        dataList.forEach((item) => {
            var tagsHtml = ''
            item.tag_list.forEach((tag) => {
                tagsHtml += `<div class="border border-dark rounded px-2 d-inline-block mr-1 mb-2"># ${tag}</div>`
            })
            html += `<div class="${mode}">
                        <div class="card shadow-sm h-100 border-secondary bg-light">
                            <div class="card-body" data-private="${item.private}">
                                <h5 class="title mb-2 oyp-limit-line" title="${item.title}" onclick="Poncon.goHref('${item.url}');">${item.title}</h5>
                                <a class="text-secondary url oyp-limit-line mb-2" href="${item.url}" onclick="Poncon.goHref('${item.url}'); return false;">${item.url}</a>
                                <div class="tags" data-tags="${encodeURIComponent(JSON.stringify(item.tag_list))}">${tagsHtml}</div>
                                <div class="btns">
                                    <a class="text-danger mr-2" onclick="Poncon.listItemDelete(event, '${item.url}', '${item.update_time}')">删除</a>
                                    <a class="text-primary mr-2 copybtn" data-clipboard-text="${item.url}" onclick="alert('复制成功')">复制</a>
                                    <a class="text-success mr-2" onclick="Poncon.listItemEdit(event)">编辑</a>
                                    <span class="float-right text-muted">${this.parseDate(parseInt(item.update_time) * 1000)}</span>
                                </div>
                            </div>
                        </div>
                    </div>`
        })
        return html
    },
    /**
     * 编辑收藏记录
     * @param {event} event 事件对象
     */
    listItemEdit(event) {
        var ele = $(event.target).parents('.card-body')
        var title = ele.find('.title').text()
        var url = ele.find('.url').text()
        var tags = JSON.parse(decodeURIComponent(ele.find('.tags').attr('data-tags')))
        this.tagList = tags
        this.tagList = this.unique(this.tagList)
        var private = ele.attr('data-private')
        this.showModal('addCollect', 'update')
        var modal = $('.modal-addCollect')
        modal.find('.tagList').html(this.makeTags(this.tagList))
        this.giveClick('.tagList')
        modal.find('.input-title').val(title)
        modal.find('.input-url').val(url).attr('readonly', 'readonly')
        modal.find('.getHost').attr('disabled', 'disabled')
        modal.find('#customSwitch_private')[0].checked = private == '1' ? true : false
        this.editMode = 'update'

        Poncon.editingNode = $(event.target).parents('.col-xl-4') // 正在编辑的节点
    },
    /**
     * 删除收藏
     */
    listItemDelete(event, url, time) {
        if (!confirm('确定删除吗？')) {
            return
        }
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/delete_collect.php',
            data: {
                username: this.getStorage('username'),
                password: this.getStorage('password'),
                url: url,
                time: time
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    $(event.target).parent().parent().parent().parent().remove()
                    return
                }
                alert(data.msg)
            }
        })
    },
    /**
     * 跳转网址
     * @param {url} url 网址
     */
    goHref(url) {
        if (Poncon.setting.newWindowOpen) {
            window.open(url)
            return
        }
        location.href = url
    },
    /**
     * 格式化时间戳
     * @param {number} date 时间戳
     * @returns {string}
     */
    parseDate(date) {
        function two(t) {
            if (t < 10) {
                return '0' + t
            }
            return t
        }
        date = new Date(date)
        return two(date.getFullYear()) + '-' + two(date.getMonth() + 1) + '-' + two(date.getDate()) + ' ' + two(date.getHours()) + ':' + two(date.getMinutes())
    },
    /**
     * 单击搜索事件
     */
    clickSearch() {
        var modal = $('.modal-searchCollect')
        var keyword = modal.find('.input-keyword').val()
        this.searchCollect(keyword, 0)
    },
    /**
     * 搜索收藏列表
     * @param {string} keyword 搜索关键词
     * @param {number} page 页码 从0开始
     */
    searchCollect(keyword, page) {
        var target = this
        var modal = $('.modal-searchCollect')

        if (page == 0) {
            modal.find('.searchList').html('')
        }
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/search.php',
            data: {
                username: this.getStorage('username'),
                password: this.getStorage('password'),
                keyword: keyword,
                page: page,
                pageSize: 15
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if (data.data.length == 0) {
                        target.setting.isBottom_search = 1
                        return
                    }
                    var html = target.makeList(data.data, 'search')
                    modal.find('.searchList').append(html)
                    Poncon.data.nowPage_search = page
                    Poncon.data.keyword = keyword
                    Poncon.setting.isBottom_search = 0
                    Poncon.data.listType = 'search'
                    return
                }
                Poncon.setting.isBottom_search = 1
                alert(data.msg)
            }
        })
    }
}