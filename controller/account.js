const Cloud = require('../utils/cloud');
const db = require('../utils/db')
module.exports = {
    list: {
        async get(req, res) {
            let s = db('account').filter({ adminId: req.info.userInfo.id }).value()
            res.return(s)
        },
        async put(req, res) {
            const cloud = new Cloud()
            try {
                let info = await cloud.login(req.body.refresh_token)
                let userInfo = await cloud.getInfo()
                Object.assign(info, userInfo.personal_space_info)
                info.adminId = req.info.userInfo.id
                info.createTime = new Date()
                info.tip = req.body.tip
                info.type = true
                db('account').find({ id: info.id }).assign(info).write()
                res.return('添加成功')
            } catch (error) {
                // console.log(error)
                res.error(error)
            }
        },
        async post(req, res) {
            let s = db('account').find({ adminId: req.info.userInfo.id, id: req.body.id }).value()
            if (!s) {
                res.error('当前天翼账号不属于该管理员')
            } else {
                db('account').find({ adminId: req.info.userInfo.id, id: req.body.id }).assign(req.body).write()
                db('account').find({ adminId: req.info.userInfo.id, id: req.body.id }).assign({ cookie: null }).write()
                try {
                    await cloud.login(req.body.refresh_token)
                    db('account').find({ adminId: req.info.userInfo.id, id: req.body.id }).assign({ type: true }).write()
                    res.return('修改成功')
                } catch (error) {
                    db('account').find({ adminId: req.info.userInfo.id, id: req.body.id }).assign({ type: false }).write()
                    res.error(error)
                }
            }
        },
        async delete(req, res) {
            db('account').remove({ adminId: req.info.userInfo.id, id: req.body.id }).write()
            res.return('删除成功')
        }
    }
}