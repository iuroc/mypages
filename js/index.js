$(document).ready(function () {
    $('body').removeClass('fade')

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
            Poncon.login(Poncon.getStorage('username'), Poncon.getStorage('password'))
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
        } else {
            location.href = Poncon.entryPage
        }


        // 主页隐藏返回按钮
        if (target == 'home' || target == 'login') {
            $('.btn-back-oyp').css({ 'display': 'none' })
        } else {
            $('.btn-back-oyp').css({ 'display': 'block' })
        }
    }

    window.addEventListener('hashchange', function (event) {
        // 监听Hash改变 通过location.hash='xxx'可触发
        var hash = new URL(event.newURL).hash
        router(hash)
    })
})