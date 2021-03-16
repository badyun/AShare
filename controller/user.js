const { registerClick } = require('../utils/geetest');
const jwt = require('../utils/token');
const db = require('../utils/db')
module.exports = {
    login: {
        async post(req, res) {
            let userInfo = db('user').find({
                username: req.body.username,
                password: req.body.password
            }).value()
            if (userInfo) {
                let token = jwt.createToken({ username: req.body.username, time: new Date() }, 3600 * 2)
                let expireTime = new Date(new Date().getTime() + 3600 * 2 * 1000)
                db('user')
                    .find({
                        username: req.body.username,
                        password: req.body.password
                    })
                    .assign({ expireTime: expireTime, token: token })
                    .write()
                return res.return({
                    token: token,
                    role: userInfo.role
                })
            } else {
                return res.error('账号或密码错误')
            }
        },
        async get(req, res) {
            return res.return(await registerClick())
        }
    },
    change: {
        post(req, res) {
            if (!req.body.username && !req.body.password) {
                return res.error('缺失必要参数')
            }
            if (req.body.username) {
                db('user').find({ id: req.info.userInfo.id }).assign({ username: req.body.username }).write()
            }
            if (req.body.password) {
                db('user').find({ id: req.info.userInfo.id }).assign({ password: req.body.password, token: null }).write()
            }
            return res.return('修改成功')
        }
    },
    loginOut: {
        post(req, res) {
            if (req.info.userInfo) {
                db('user').find({ id: req.info.userInfo.id }).assign({ token: null }).write()
            }
            res.return('登出成功')
        }
    }
}