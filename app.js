const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const filter = require('./utils/filter');
const router = require('./router/index');
const { port } = require('./utils/inject');

(async () => {
    app.use(express.static(__dirname + '/public'));

    // 数据解析
    app.use(bodyParser.json({ limit: '50mb' }));

    // 请求拦截器
    app.use(filter)

    // 挂载路由
    app.use(router)

    app.listen(await port())
})()

