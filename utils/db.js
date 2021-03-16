const lodashId = require('lodash-id')
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');
const Accord = require('../utils/accord');
const accord = new Accord('z6V_&H^NC$DDApLz', '(}$B7aT(zW970yHz')

try {
    fs.mkdirSync('./data')
} catch (error) {

}

if (!fs.existsSync('./data/这里都是数据库文件，别作死！')) {
    fs.writeFileSync('./data/这里都是数据库文件，别作死！', '这里都是数据库文件，别作死！')
}

module.exports = (name) => {
    const adapter = new FileSync(`./data/${name}`, {
        serialize: (data) => accord.encrypt(data),
        deserialize: (data) => accord.decrypt(data)
    })
    const db = low(adapter)
    db._.mixin(lodashId)
    if (!db.has('data').value()) {
        db.set('data', []).write()
    }
    return db.get('data')
}