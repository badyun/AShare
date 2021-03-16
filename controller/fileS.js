const Cloud = require('../utils/cloud')
const db = require('../utils/db')
module.exports = {
    list: {
        async get(req, res) {

            if (!req.query.user_id) {
                return res.error("阿里云账号不存在")
            }
            let info = db('account').find({ user_id: req.query.user_id }).value()
            if (!info) {
                return res.error("阿里云账号不存在")
            }

            const cloud = new Cloud(info.id)

            try {
                let list = await cloud.list(req.query.parent_file_id)
                res.return(list)
            } catch (error) {
                // console.log(error)
                res.error(error)
            }

        }
    },
    previewVideo: {
        async get(req, res) {
            let info = db('account').find({ user_id: req.query.user_id }).value()
            const cloud = new Cloud(info.id)
            let s = await cloud.previewVideo(req.query.file_id)
            if (s) {
                res.return(s)
            } else {
                res.sendStatus(401)
            }
        }
    }
}