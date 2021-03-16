module.exports = [
    {
        name: "favicon.ico",
        path: '/favicon.ico',
        method: 'GET'
    },
    {
        name: '获取管理员登录页验证码',
        path: '/api/user/login',
        method: 'GET'
    },
    {
        name: '执行登陆请求',
        path: '/api/user/login',
        method: 'POST'
    },
    {
        name: '获取文件夹信息',
        path: '/api/share/public',
        method: 'GET'
    },
    {
        name: '视频',
        path: '/api/file/previewVideo',
        method: 'GET'
    },
    {
        name: '获取下载链接',
        path: '/api/share/downLoad',
        method: 'GET'
    }
]