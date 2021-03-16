const Cloud = require('../utils/cloud');
const db = require('../utils/db')
module.exports = async (req, res) => {
    let info = db('account').find({ user_id: req.params.user_id }).value()
    const cloud = new Cloud(info.id)
    let s = await cloud.node(req.params.parent_file_id, req.params.user_name)
    if (s) {
        res.redirect(s.url);
    } else {
        res.sendStatus(401)
    }
}