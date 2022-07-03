const Poncon = {
    title: 'My Pages', // 网页总标题
    baseUrl: '', // 项目安装目录，不以/结尾
    storageKey: 'my_pages', // 本地存储键名
    entryPage: '#/home', // 主页，路由出错时加载
    loginStatus: 0, // 登录状态 0:未登录 1: 已登录
    tagList: [], // 标签列表
    pageLoad: {}, // 页面加载状态
    setting() { // 网页设置
        return {
            newWindowOpen: !this.getStorage('newWindowOpen'), // 当前页打开
        }
    },
    data: { // 网页数据
        listType: 'load', // 列表类型 load 正常加载 search 搜索
        tagListObjSelected: {}, // 当前选中的标签
        tagListObj: {}, // 标签列表
        tagListObjTemp: {}, // 筛选后的标签列表
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
        data = JSON.parse(data)
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
    showModal(modalName, mode, mode2) {
        if (modalName == 'addCollect') {
            var modal = $('.modal-addCollect')
            if (this.editMode == 'update' && mode == 'add') {
                this.cleanInput()
            }
            $('.modal-addCollect').unbind()
            if (mode2 == 'search') {
                $('.modal-addCollect').on('hidden.bs.modal', function () {
                    var modal = $('.modal-searchCollect')
                    modal.modal('show')
                    var input = modal.find('.input-keyword')
                    input.focus()
                })
            } else if (mode2 == 'byTag') {
                $('.modal-addCollect').on('hidden.bs.modal', function () {
                    var modal = $('.modal-tagList')
                    modal.modal('show')
                })
            }

            // 加载标签列表
            Poncon.loadTagList('edit')
            var tags = Poncon.data.tagListObj
            var tagsHtml = this.makeTags(tags, 'edit')
            modal.find('.allTagList').html(tagsHtml)
            // 新增收藏
            $('.modal-addCollect').modal('show')


            modal.find('.input-url').removeAttr('readonly')
            modal.find('.getHost').removeAttr('disabled')

            this.editMode = mode // 编辑模式 add: 新增 update: 更新
            if (mode == 'add') {
                $('.modal-addCollect .input-url').focus()
                modal.find('.addCollect').html('添加收藏')
                modal.find('.addCollect').html('添加收藏')
            } else {
                modal.find('.addCollect').html('确定编辑')
                modal.find('.modal-title').html('编辑收藏')
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
        } else if (modalName == 'tagList') {
            var modal = $('.modal-tagList')
            modal.modal('show')
            this.loadTagList()
            this.backToTagList()
            modal.find('.input-keyword').val('').focus()
        } else if (modalName == 'userSetting') {
            var modal = $('.modal-userSetting')
            modal.modal('show')
            this.loadSetting()
        }
    },
    /**
     * 加载设置项
     */
    loadSetting() {
        var modal = $('.modal-userSetting')
        var target = this
        $('#customSwitch_newWindow')[0].checked = this.setting().newWindowOpen
        $('#customSwitch_newWindow').unbind().on('change', function () {
            var newWindowOpen = !$('#customSwitch_newWindow')[0].checked
            target.setStorage('newWindowOpen', newWindowOpen)
        })
        var shareUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'share/?u=' + this.getStorage('username')
        modal.find('.input-shareUrl').val(shareUrl)
    },
    /**
     * 加载标签列表
     */
    loadTagList(mode) {
        if (mode != 'edit') {
            var modal = $('.modal-tagList')
            var target = this
            this.data.tagListObj = {}
            this.data.tagListObjTemp = {}
            this.data.tagListObjSelected = {}
        }
        var target = this
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/get_tag_list.php',
            data: {
                username: this.getStorage('username'),
                password: this.getStorage('password')
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if (mode == 'edit') {
                        target.data.tagListObj = data.data
                        return
                    }
                    if (data.data.length == 0) {
                        modal.find('.tagList').html(`<img src="img/cat-2722309_640.png" class="img-fluid mb-4" style="max-height: 150px;" alt="暂无标签">
                                                    <div class="h5 text-muted mb-4">
                                                        当前暂无标签
                                                    </div>`)
                        return
                    }
                    target.loadTagListHtml(data.data)
                    modal.find('.allUnSelectTag').hide()
                    modal.find('.allSelectTag').show()
                    modal.find('.submitSelect').attr('disabled', 'disabled')
                    return
                }
                alert(data.msg)
            },
            async: false
        })
        return this.data.tagListObj
    },
    loadTagListHtml(obj) {
        this.data.tagListObj = obj
        this.data.tagListObjTemp = obj
        var modal = $('.modal-tagList')
        var list = this.sortByKey(obj)
        var html = this.makeTags(list, 'all')
        modal.find('.tagList').html(html)

    },
    /**
     * 对象按键名的拼音排序
     * @param {object} obj 对象
     * @returns {object} 排序后的对象
     */
    sortByKey(obj) {
        var list = {}
        Object.keys(obj).sort(function (a, b) {
            return a.localeCompare(b)
        }).forEach((key) => {
            list[key] = obj[key]
        })
        return list
    },
    /**
     * 新增标签
     * @param {string} tagName 标签名 如果为空则读取input
     */
    addTag(tagName) {
        var target = this
        var modal = $('.modal-addCollect')
        var tagName = tagName ? tagName : modal.find('.input-tagName').val()
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
            url: this.baseUrl + 'api/get_title.php',
            data: {
                url: url
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                modal.find('button.getWebTitle').html('获取').removeAttr('disabled')
                modal.find('.input-title').val(data.data)
                target.fenci()
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
                modal.find('.input-tagName').focus()
            })
        }
    },
    // 新增收藏
    addCollect() {
        var target = this
        var modal = $('.modal-addCollect')
        var url = $.trim(modal.find('.input-url').val())
        var title = $.trim(modal.find('.input-title').val())
        var note = $.trim(modal.find('.input-note').val())
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
                mode: this.editMode,
                note: note
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
        node.find('.title').text(modal.find('.input-title').val())
        node.find('.note').text(modal.find('.input-note').val())
        node.find('.url').text(modal.find('.input-url').val())
        node.find('.card-body').attr('data-private', $('#customSwitch_private')[0].checked ? 1 : 0)
        var tagsHtml = ''
        this.tagList.forEach((tag) => {
            tagsHtml += `<div class="border border-dark rounded small px-2 d-inline-block mr-1 mb-2">${tag}</div>`
        })
        node.find('.tags').html(tagsHtml).attr('data-tags', encodeURIComponent(JSON.stringify(this.tagList)))
        node.find('.update_time').html(this.parseDate(new Date().getTime()))
    },
    /**
     * 清空输入框
     */
    cleanInput() {
        var modal = $('.modal-addCollect')
        modal.find('.input-url').val('')
        modal.find('.input-title').val('')
        modal.find('.input-tagName').val('')
        this.tagList = []
        modal.find('.tagList').html('')
        modal.find('.input-note').val('')
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
     * @param {string} mode all: 所有标签
     * @returns {string}
     */
    makeTags(tagList, mode) {
        var html = ''
        if (mode == 'all') {
            for (var tag in tagList) {
                html += `<div class="btn btn-sm btn-light border mb-2 mr-2" onclick="Poncon.tagListChecked(event)"><span class="tag">${tag}</span> <span class="ml-1 badge badge-light">${tagList[tag]}</span></div>`
            }
            return html
        } else if (mode == 'edit') {
            for (var tag in tagList) {
                html += `<div class="btn btn-sm btn-light border mb-2 mr-2" onclick="Poncon.addTagListChecked(event)"><span class="tag">${tag}</span> <span class="ml-1 badge badge-light">${tagList[tag]}</span></div>`
            }
            return html
        }
        tagList.forEach(tag => {
            html += `<div class="btn btn-sm btn-secondary mb-2 mr-2">${tag}</div>`
        })
        return html
    },
    /**
     * 新增收藏或编辑收藏时标签的单击事件
     * @param {event} event 事件对象
     */
    addTagListChecked(event) {
        var ele = $(event.target)
        if (!ele.hasClass('btn')) {
            ele = ele.parent()
        }
        var tagName = ele.find('.tag').text()
        var modal = $('.modal-addCollect')
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
     * 新增或编辑收藏时标签的单击事件
     * @param {event} event 事件对象
     */
    tagListChecked(event) {
        var ele = $(event.target)
        if (!ele.hasClass('btn')) {
            ele = ele.parent()
        }
        var tagName = ele.find('.tag').text()
        if (ele.hasClass('btn-light')) {
            ele.removeClass('btn-light')
            ele.addClass('btn-primary')
            ele.removeClass('bg-warning')
            this.data.tagListObjSelected[tagName] = this.data.tagListObj[tagName]
        } else {
            ele.removeClass('btn-primary')
            ele.addClass('btn-light')
            this.indexTags()
            delete this.data.tagListObjSelected[tagName]
        }
        if (Object.keys(this.data.tagListObjSelected).length
            == Object.keys(this.data.tagListObjTemp).length
            && Object.keys(this.data.tagListObjTemp).length > 0) {
            var modal = $('.modal-tagList')
            modal.find('.allUnSelectTag').show()
            modal.find('.allSelectTag').hide()
        } else {
            var modal = $('.modal-tagList')
            modal.find('.allUnSelectTag').hide()
            modal.find('.allSelectTag').show()
        }
        this.disabledButton()
    },
    /**
     * 中文分词
     */
    fenci() {
        var target = this
        var modal = $('.modal-addCollect')
        var title = modal.find('.input-title').val()
        var note = modal.find('.input-note').val()
        $.ajax({
            url: this.baseUrl + 'api/fenci.php',
            type: 'GET',
            data: {
                text: title + ' ' + note
            },
            success: (data) => {
                if (data.code == 200) {
                    var tags = data.data
                    tags.forEach(tag => {
                        tag.length > 1 ? target.addTag(tag) : null
                    })
                }
            }
        })
    },
    /**
     * 筛选标签
     */
    screeningTag() {
        var modal = $('.modal-tagList')
        var keyword = $.trim(modal.find('.input-keyword').val())
        this.data.tagListObjSelected = {}
        this.data.tagListObjTemp = {}
        for (var tag in this.data.tagListObj) {
            if (tag.indexOf(keyword) != -1) {
                this.data.tagListObjTemp[tag] = this.data.tagListObj[tag]
            }
        }
        var list = this.data.tagListObjTemp
        list = this.sortByKey(list)
        modal.find('.tagList').html(this.makeTags(list, 'all'))
        if (keyword) {
            this.allSelectTag()
        }
        this.backToTagList()
    },
    /**
     * 索引标签
     */
    indexTags() {
        var modal = $('.modal-tagList')
        var keyword = $.trim(modal.find('.input-keyword').val())
        var eles = modal.find('.tagList .btn')
        for (var i = 0; i < eles.length; i++) {
            if (eles[i].innerText.search(keyword) != -1 && keyword) {
                $(eles[i]).addClass('bg-warning')
            } else {
                $(eles[i]).removeClass('bg-warning')
            }
        }
    },


    /**
     * 全选标签
     */
    allSelectTag() {
        var modal = $('.modal-tagList')
        modal.find('.allUnSelectTag').show()
        modal.find('.allSelectTag').hide()
        var tagList = $('.tagList')
        tagList.find('.btn').removeClass('btn-light')
        tagList.find('.btn').addClass('btn-primary')
        this.data.tagListObjSelected = JSON.parse(JSON.stringify(this.data.tagListObjTemp))
        this.disabledButton()
    },
    /**
     * 取消全选标签
     */
    allUnSelectTag() {
        var modal = $('.modal-tagList')
        modal.find('.allUnSelectTag').hide()
        modal.find('.allSelectTag').show()
        var tagList = $('.tagList')
        tagList.find('.btn').removeClass('btn-primary')
        tagList.find('.btn').addClass('btn-light')
        this.data.tagListObjSelected = {}
        this.disabledButton()
    },
    /**
     * 当全不选时禁用确定按钮
     */
    disabledButton() {
        if (Object.keys(this.data.tagListObjSelected).length == 0) {
            $('.modal-tagList').find('.submitSelect').attr('disabled', 'disabled')
        } else {
            $('.modal-tagList').find('.submitSelect').removeAttr('disabled')
        }
    },
    /**
     * 根据标签获取收藏列表
     * @param {object} tags 标签名
     */
    loadCollectListByTag(tags, page) {
        var modal = $('.modal-tagList')
        if (page == 0) {
            modal.find('.tagList').hide()
            modal.find('.collectList').html('').show()
            modal.find('.allSelectTag, .allUnSelectTag').hide()
            modal.find('.submitSelect').hide()
            modal.find('.backToList').show()
        }
        tags = JSON.stringify(Object.keys(tags))
        var target = this
        $.ajax({
            method: 'post',
            url: this.baseUrl + 'api/get_collect_list_by_tag.php',
            data: {
                tags: tags,
                username: this.getStorage('username'),
                password: this.getStorage('password'),
                page: page,
                pageSize: 36
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    var collectList = data.data
                    if (collectList.length == 0) {
                        target.setting().isBottom_byTag = 1
                        return
                    }
                    var html = target.makeList(collectList, 'byTag')
                    modal.find('.collectList').append(html)
                    new ClipboardJS('.copybtn', {
                        container: modal[0]
                    })
                    target.data.nowPage_byTag = page
                    target.setting().isBottom_byTag = 0
                    return
                }
                target.setting().isBottom_byTag = 1
                alert(data.msg)
            }
        })
    },
    /**
     * 从筛选后的收藏列表返回标签列表
     */
    backToTagList() {
        var modal = $('.modal-tagList')
        modal.find('.tagList').show()
        modal.find('.collectList').hide()
        modal.find('.submitSelect').show()
        modal.find('.backToList').hide()
        if (Object.keys(this.data.tagListObjSelected).length
            == Object.keys(this.data.tagListObjTemp).length
            && Object.keys(this.data.tagListObjTemp).length > 0) {
            var modal = $('.modal-tagList')
            modal.find('.allUnSelectTag').show()
            modal.find('.allSelectTag').hide()
        } else {
            var modal = $('.modal-tagList')
            modal.find('.allUnSelectTag').hide()
            modal.find('.allSelectTag').show()
        }
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
                pageSize: 36
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if (data.data.length == 0) {
                        target.setting().isBottom = 1
                        return
                    }

                    var html = target.makeList(data.data)
                    _page.find('.collectList').append(html)
                    new ClipboardJS('.copybtn')
                    target.data.nowPage = page
                    target.setting().isBottom = 0
                    return
                }
                target.setting().isBottom = 1
                // alert(data.msg)
            }
        })
    },
    /**
     * 将数据列表转为HTML代码
     * @param {array} dataList 数据列表
     */
    makeList(dataList, mode) {
        var html = ''
        _class = (mode == 'search') || (mode == 'byTag') ? 'mb-4' : 'col-xl-4 col-lg-6 mb-4'
        dataList.forEach((item) => {
            var tagsHtml = ''
            item.tag_list.forEach((tag) => {
                tagsHtml += `<div class="border border-dark rounded px-2 d-inline-block mr-1 mb-2 small">${tag}</div>`
            })
            html += `<div class="${_class}">
                        <div class="card shadow-sm h-100 border-secondary bg-light">
                            <div class="card-body px-3 py-2 d-flex flex-column justify-content-center" data-private="${item.private}">
                                <div class="title mb-1 oyp-limit-line font-weight-bold" title="${item.title}" onclick="Poncon.goHref('${item.url}');">${item.title}</div>
                                <a class="text-secondary url oyp-limit-line small mb-1" href="${item.url}" onclick="Poncon.goHref('${item.url}'); return false;">${item.url}</a>
                                <div class="note text-info mb-1">${item.note}</div>
                                <div class="tags" data-tags="${encodeURIComponent(JSON.stringify(item.tag_list))}">${tagsHtml}</div>
                                <div class="btns">
                                    <a class="text-danger mr-2" onclick="Poncon.listItemDelete(event, '${item.url}', '${item.update_time}')">删除</a>
                                    <a class="text-primary mr-2 copybtn" data-clipboard-text="${item.url}" onclick="alert('复制成功')">复制</a>
                                    <a class="text-success mr-2" onclick="Poncon.listItemEdit(event, '${mode}')">编辑</a>
                                    <span class="float-right text-muted update_time">${this.parseDate(parseInt(item.update_time) * 1000)}</span>
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
    listItemEdit(event, mode) {
        var ele = $(event.target).parents('.card-body')
        var title = ele.find('.title').text()
        var url = ele.find('.url').text()
        var note = ele.find('.note').text()
        var tags = JSON.parse(decodeURIComponent(ele.find('.tags').attr('data-tags')))
        this.tagList = tags
        this.tagList = this.unique(this.tagList)
        var private = ele.attr('data-private')
        this.showModal('addCollect', 'update', mode)
        if (mode == 'search') {
            $('.modal-searchCollect').modal('hide')
        } else if (mode == 'byTag') {
            $('.modal-tagList').modal('hide')
        }
        var modal = $('.modal-addCollect')
        modal.find('.tagList').html(this.makeTags(this.tagList))
        this.giveClick('.tagList')
        modal.find('.input-title').val(title)
        modal.find('.input-note').val(note)
        modal.find('.input-url').val(url).attr('readonly', 'readonly')
        modal.find('.getHost').attr('disabled', 'disabled')
        modal.find('#customSwitch_private')[0].checked = private == '1' ? true : false
        this.editMode = 'update'
        this.editingNode = $(event.target).parents('.mb-4') // 正在编辑的节点
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
        if (this.setting().newWindowOpen) {
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
                pageSize: 36
            },
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if (data.data.length == 0) {
                        target.setting().isBottom_search = 1
                        return
                    }
                    var html = target.makeList(data.data, 'search')
                    modal.find('.searchList').append(html)
                    new ClipboardJS('.copybtn', {
                        container: modal[0]
                    })
                    target.data.nowPage_search = page
                    target.data.keyword = keyword
                    target.setting().isBottom_search = 0
                    return
                }
                this.setting().isBottom_search = 1
                alert(data.msg)
            }
        })
    },
    /**
     * 退出登录
     */
    logout() {
        if (confirm('确定退出吗？')) {
            localStorage.removeItem(this.storageKey)
            location.reload()
        }

    }
}