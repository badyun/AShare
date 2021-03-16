const router = require('express').Router();

const forbidden = (req, res) => {
    return res.return({
        success: false,
        status: 20800,
        result: null,
        errMsg: 401
    })
}

const fileMode = require('../controller/file');
const fileSMode = require('../controller/fileS');
const accountMode = require('../controller/account');
const shareMode = require('../controller/share');
const userMode = require('../controller/user');

for (let key in fileSMode) {
    router.route('/api/file/' + key)
        .post(fileSMode[key].post || forbidden)
        .get(fileSMode[key].get || forbidden)
        .put(fileSMode[key].put || forbidden)
        .delete(fileSMode[key].delete || forbidden)
}
for (let key in accountMode) {
    router.route('/api/account/' + key)
        .post(accountMode[key].post || forbidden)
        .get(accountMode[key].get || forbidden)
        .put(accountMode[key].put || forbidden)
        .delete(accountMode[key].delete || forbidden)
}
for (let key in shareMode) {
    router.route('/api/share/' + key)
        .post(shareMode[key].post || forbidden)
        .get(shareMode[key].get || forbidden)
        .put(shareMode[key].put || forbidden)
        .delete(shareMode[key].delete || forbidden)
}
for (let key in userMode) {
    router.route('/api/user/' + key)
        .post(userMode[key].post || forbidden)
        .get(userMode[key].get || forbidden)
        .put(userMode[key].put || forbidden)
        .delete(userMode[key].delete || forbidden)
}


router.route('/file/:user_id/:parent_file_id/:user_name').get(fileMode)

module.exports = router