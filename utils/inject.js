// 日志输出美化
const moment = require('moment');
require('colors');
console.info = (val) => {
    console.log('[Info]'.blue + '    ' + moment(new Date()).format('YYYY-MM-DD hh:mm:ss') + ' ' + val)
}

// 数据表格式化
console.info('连接数据库')
const db = require('./db');
const UserMode = db('user')
const AccountMode = db('account')
const ShareMode = db('share')

const userNum = UserMode.size().value();
if (userNum == 0) {
    const randomString = require('random-string')
    const username = randomString({ length: 6 });
    const password = randomString({ length: 16 });
    UserMode.insert({
        username: username,
        password: password,
        role: 1,
        time: new Date(),
        type: true
    }).write()
    console.info(`初始管理员账号：${username}`)
    console.info(`初始管理员密码：${password}`)
} else {
    const { username, password } = UserMode.find().value()
    console.info(`当前管理员账号：${username}`)
    console.info(`当前管理员密码：${password}`)
}

// 检测可用端口
async function port() {
    const portfinder = require('portfinder');
    const result = await portfinder.getPortPromise({
        port: 5201
    })
    console.info(`服务运行在：http://127.0.0.1:${result}`)
    return result
}


module.exports = {
    UserMode,
    AccountMode,
    ShareMode,
    port
}