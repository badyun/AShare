const superagent = require('superagent');
const db = require('./db');
module.exports = class {
    constructor(id) {
        this.info = db('account').find({ id: id }).value()
    }

    // 登录
    async login(refresh_token) {
        try {
            if (!refresh_token) {
                let s = await superagent.post('https://auth.aliyundrive.com/v2/account/token')
                    .send({
                        refresh_token: this.info.refresh_token,
                        grant_type: "refresh_token"
                    });

                this.info = db('account').find({ id: this.info.id }).assign(s.body).write();
                return this.info
            } else {
                let s = await superagent.post('https://auth.aliyundrive.com/v2/account/token')
                    .send({
                        refresh_token: refresh_token,
                        grant_type: "refresh_token"
                    });
                let info = db('account').find({ user_id: s.body.user_id }).value()
                if (!info) {
                    info = db('account').insert(s.body).write()
                } else {
                    info = db('account').find({ user_id: s.body.user_id }).assign(s.body).write()
                }
                this.info = info
                return this.info
            }

        } catch (error) {
            // console.log(error)
            return Promise.reject('refresh_token存在问题')
        }

    }

    // 请求
    async http(url, params = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                let s = await superagent.post(url)
                    .set({
                        authorization: 'Bearer ' + this.info.access_token,
                        referer: 'https://www.aliyundrive.com/',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
                    })
                    .send(params)
                resolve(s.body)
            } catch (error) {
                if (error.status == 401) {
                    await this.login()
                    return this.http(url, params)
                } else {
                    reject(error.response.body.message)
                }
            }
        })

    }

    // 获取人信息
    async getInfo() {
        let s = await this.http('https://api.aliyundrive.com/v2/databox/get_personal_info');
        return s
    }

    // 列出文件
    async list(parent_file_id = 'root', limit = 200, order_by = 'name', order_direction = 'ASC', marker = null, list = []) {
        let s = await this.http('https://api.aliyundrive.com/v2/file/list', {
            drive_id: this.info.default_drive_id,
            fields: "*",
            image_thumbnail_process: "image/resize,w_160/format,jpeg",
            image_url_process: "image/resize,w_1920/format,jpeg",
            limit: limit,
            marker: null,
            order_by: order_by,
            order_direction: order_direction,
            parent_file_id: parent_file_id,
            video_thumbnail_process: "video/snapshot,t_0,f_jpg,w_300"
        })
        // console.log(s)
        list = list.concat(s.items)
        if (s.next_marker) {
            return this.list(parent_file_id, limit, order_by, order_direction, marker, list)
        } else {
            return list
        }
    }

    // 获取文件信息
    async node(file_id, user_name) {
        let s = await this.http('https://api.aliyundrive.com/v2/file/get_download_url', {
            drive_id: this.info.default_drive_id,
            file_id: file_id,
            expire_sec: 7200,
            file_name: user_name
        })
        return s
    }

    // 列出文件预览
    async previewVideo(file_id) {
        let s = await this.http('https://api.aliyundrive.com/v2/databox/get_video_play_info', {
            drive_id: this.info.default_drive_id,
            file_id: file_id
        })
        return s.template_list
    }

    // 获取文件夹信息
    async fileInfo(file_id) {
        let s = await this.http('https://api.aliyundrive.com/v2/file/get', {
            drive_id: this.info.default_drive_id,
            file_id: file_id
        })
        return s
    }


}
