const requestIp = require('request-ip');
const whitePath = require('./white');
const randomString = require('random-string');
const path = require('path');
const { createToken, checkToken } = require('./token');
const db = require('./db');
const Accord = require('./accord');
module.exports = async (req, res, next) => {
    const 富强 = randomString({
        length: 16,
        numeric: true,
        letters: true,
        special: true
    });
    const 民主 = randomString({
        length: 16,
        numeric: true,
        letters: true,
        special: true
    });
    const accord = new Accord(富强, 民主)
    res.header("x-fq", 富强);
    res.header("x-mz", 民主);
    res.error = (data, status) => {
        res.send(accord.encrypt({
            success: false,
            status: status || 20200,
            result: null,
            errMsg: data
        }))
    }
    res.return = (data) => {
        res.send(accord.encrypt({
            success: true,
            status: 20000,
            result: data,
            errMsg: null
        }))
    }
    const info = {
        ip: requestIp.getClientIp(req).replace('::ffff:', ''),// 获取ip
        url: req.url,// 获取请求路径
        path: req._parsedUrl.pathname,// 获取请求path
        method: req.method,// 获取请求方式
        userAgent: req.headers['user-agent'],// 获取Useragent
        query: req.query,
        params: req.params,
        body: req.body, 
        db: {
            UserMode: db('user'),
            AccountMode: db('account'),
            ShareMode: db('share')
        }
    }

    console.info(`[ip] ${info.ip}    [method] ${info.method}    [url] ${info.url}`)

    let auth = false

    // 白名单匹配
    whitePath.forEach(ele => {
        if (info.path.indexOf(ele.path) == 0 && ele.method == info.method) {
            req.info = info
            auth = true
        }
        if (info.path.indexOf('/file/') == 0) {
            req.info = info
            auth = true
        }
    })
    if (auth) {
        return next()
    }

    // 鉴权流程
    if (req.headers.authorization) {
        const authorization = req.headers.authorization
        if (checkToken(authorization)) {
            const userInfo = info.db.UserMode.find({ token: authorization }).value()
            if (userInfo) {
                info.userInfo = userInfo
                // const nextToken = createToken({ username: userInfo.username })
                // info.db.UserMode.find({ token: authorization }).assign({ token: nextToken }).write()
                // info.nextToken = nextToken
                req.info = info
                // res.header("nextToken", info.nextToken);
                return next()
            }
        }
    }

    // 没权限
    if (info.path.indexOf('/api/') == 0) {
        return res.error(401)
    } else {
        return res.sendFile(path.join(__dirname, '../public/index.html'))
    }
}