$(document).ready(function () {
    $('body').removeClass('fade')
    new ClipboardJS('.copybtn')
    if (!location.hash.split('/')[1]) {
        history.replaceState({}, null, Poncon.entryPage)
    }

    // 加载路由
    router(location.hash)



    /**
     * 响应路由控制
     * @param {string} hash 页面的hash，如#/home/
     */
    function router(hash) {

        if (!Poncon.loginStatus) {
            Poncon.login(Poncon.getStorage('username'), Poncon.getStorage('password'), true)
        }

        scrollTo(0, 0)
        // 获取目标界面标识
        hash = hash.split('/')
        var target = hash[1]
        // 交换界面显示
        $('.page-oyp').css('display', 'none')
        try {
            var page = $('.page-' + target)
            page.css('display', 'block')
        } catch {
            location.href = Poncon.entryPage
        }
        // 判断目标界面标识 执行对应模块的载入事件
        if (target == 'home') {
            document.title = '主页 - ' + Poncon.title
            $('.webTitle').html(Poncon.title)
            if (!Poncon.pageLoad.home) {
                Poncon.pageLoad.home = true
                Poncon.setting.isBottom = 0
            }
            Poncon.loadCollectList(0)
        } else if (target == 'login') {
            $('.webTitle').html('')
            if (hash[2] == 'register') {
                document.title = '用户注册 - ' + Poncon.title
                page.find('.sub-page-login').hide()
                page.find('.sub-page-register').show()
            } else {
                document.title = '用户登录 - ' + Poncon.title
                page.find('.sub-page-register').hide()
                page.find('.sub-page-login').show()
            }
        } else if (target == 'user') {
            document.title = '个人中心 - ' + Poncon.title
            $('.webTitle').html('个人中心')
        } else {
            location.href = Poncon.entryPage
        }


        // 主页隐藏返回按钮
        if (target == 'home' || target == 'login') {
            $('.btn-back-oyp').css({ 'display': 'none' })
        } else {
            $('.btn-back-oyp').css({ 'display': 'block' })
        }

        if (target == 'home') {
            $('.userCenter').css('display', 'inline-block')
        } else {
            $('.userCenter').css('display', 'none')
        }

    }

    window.addEventListener('hashchange', function (event) {
        // 监听Hash改变 通过location.hash='xxx'可触发
        var hash = new URL(event.newURL).hash
        router(hash)
    })




    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop()
        var scrollHeight = $(document).height()
        var windowHeight = $(this).height()
        if (location.hash.split('/')[1] == 'home' && scrollTop + windowHeight + 50 > scrollHeight && !Poncon.setting.isBottom) {
            Poncon.setting.isBottom = 1
            // if (Poncon.data.listType == 'search') {
            // Poncon.searchCollect(Poncon.data.keyword, Poncon.data.nowPage + 1)
            // } else if (Poncon.data.listType == 'load') {
            Poncon.loadCollectList(Poncon.data.nowPage + 1)
            // }
        }
    })

    $('.modal-searchCollect .modal-body').scroll(function () {
        var scrollTop = $(this)[0].scrollTop
        var scrollHeight = $(this)[0].scrollHeight
        var offsetHeight = $(this)[0].offsetHeight
        if (location.hash.split('/')[1] == 'home' && scrollTop + offsetHeight + 50 > scrollHeight && !Poncon.setting.isBottom_search) {
            Poncon.setting.isBottom_search = 1
            Poncon.searchCollect(Poncon.data.keyword, Poncon.data.nowPage_search + 1)
        }
    })

    $('.modal-tagList .modal-body').scroll(function () {
        var modal = $('.modal-tagList')
        var scrollTop = $(this)[0].scrollTop
        var scrollHeight = $(this)[0].scrollHeight
        var offsetHeight = $(this)[0].offsetHeight
        if (location.hash.split('/')[1] == 'home' && scrollTop + offsetHeight + 50 > scrollHeight && !Poncon.setting.isBottom_byTag && modal.find('.tagList').css('display') == 'none') {
            Poncon.setting.isBottom_byTag = 1
            Poncon.loadCollectListByTag(Poncon.data.tagListObjSelected, Poncon.data.nowPage_byTag + 1)
        }
    })


})