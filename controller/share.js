const { get } = require('superagent');
const Cloud = require('../utils/cloud');
const db = require('../utils/db');
module.exports = {
    list: {
        async get(req, res) {
            let s = db('share').filter({ adminId: req.info.userInfo.id }).value()
            res.return(s)
        },
        async put(req, res) {
            req.body.adminId = req.info.userInfo.id
            req.body.time = new Date()
            req.body.type = true
            let s = db('share').find({ adminId: req.body.adminId, user_id: req.body.user_id, file_id: req.body.file_id }).value()

            if (s && s != undefined) {
                db('share').find({ adminId: req.body.adminId, userId: req.body.userId, fileId: req.body.fileId }).assign(req.body).write()
            } else {
                // console.log(req.body)
                db('share').insert(req.body).write()
            }
            res.return('请至我的分享查看')
        },
        async post(req, res) {
            db('share').find({ adminId: req.info.userInfo.id, id: req.body.id }).assign(req.body).write()
            res.return('操作成功')
        },
        async delete(req, res) {
            db('share').remove({ adminId: req.info.userInfo.id, id: req.body.id }).write()
            res.return('删除成功')
        }
    },
    downLoad: {
        async get(req, res) {
            if (!req.query.id) {
                return res.error('当前链接已失效')
            }

            let s = db('share').find({ id: req.query.id, type: true }).value()
            if (!s) {
                return res.error({
                    name: '404 not found',
                    errMsg: '当前链接已失效1'
                })
            } else {
                // console.log(s)
                if (s.password && !req.query.password) {
                    return res.error({
                        name: s.name,
                        errMsg: '请输入密码'
                    })
                } else if (s.password && req.query.password && s.password != req.query.password) {
                    return res.error({
                        name: s.name,
                        errMsg: '密码不正确'
                    })
                } else {
                    // 获取子目录信息
                    let info = db('account').find({ user_id: s.user_id }).value()
                    let cloud = new Cloud(info.id)


                    let r = await cloud.node(req.query.file_id, req.query.user_name)
                    return res.return(r)
                }
            }
        }
    },
    public: {
        async get(req, res) {
            if (!req.query.id) {
                return res.error('当前链接已失效')
            }
            // try {} catch (error) {
            //     console.log(error)
            //     return res.error({
            //         name: '404 not found',
            //         errMsg: '当前链接已失效2'
            //     })
            // }

            let s = db('share').find({ id: req.query.id, type: true }).value()
            if (!s) {
                return res.error({
                    name: '404 not found',
                    errMsg: '当前链接已失效1'
                })
            } else {
                // console.log(s)
                if (s.password && !req.query.password) {
                    return res.error({
                        name: s.name,
                        errMsg: '请输入密码'
                    })
                } else if (s.password && req.query.password && s.password != req.query.password) {
                    return res.error({
                        name: s.name,
                        errMsg: '密码不正确'
                    })
                } else {
                    // 获取子目录信息
                    let info = db('account').find({ user_id: s.user_id }).value()
                    let cloud = new Cloud(info.id)

                    if (req.query.file_id) {
                        // console.log(req.query)
                        let fileInfo = await cloud.fileInfo(req.query.file_id)
                        let r = await cloud.list(req.query.file_id)
                        // let faInfo = await cloud.fileInfo(fileInfo.parent_file_id)
                        let k = {
                            name: fileInfo.name,
                            item: [],
                            user_id: s.user_id,
                            file_id: req.query.file_id,
                            parent_file_id: fileInfo.parent_file_id,
                            // parent_file_name: faInfo.name
                        }
                        for (let index in r) {
                            let ele = r[index]
                            k.item.push({
                                name: ele.name,
                                file_id: ele.file_id,
                                type: ele.type,
                                size: ele.size,
                                created_at: ele.created_at,
                                file_extension: ele.file_extension,
                                thumbnail: ele.thumbnail,
                                category: ele.category
                            })
                        }
                        res.return(k)
                    } else {
                        let r = await cloud.list(s.file_id)
                        let k = {
                            name: s.name,
                            user_id: s.user_id,
                            item: [],
                            file_id: s.file_id,
                            parent_file_id: null,
                            faId: s.file_id
                            // parent_file_name: null
                        }
                        for (let index in r) {
                            let ele = r[index]
                            k.item.push({
                                name: ele.name,
                                file_id: ele.file_id,
                                type: ele.type,
                                size: ele.size,
                                created_at: ele.created_at,
                                file_extension: ele.file_extension,
                                thumbnail: ele.thumbnail,
                                category: ele.category
                            })
                        }
                        res.return(k)
                    }
                }
            }

        }
    }
}