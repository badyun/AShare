const crypto = require("crypto");

module.exports = new class {
    /**
     * 创建token
     *
     * @param {*} obj
     * @param {*} exp
     * @returns
     */
    createToken(params, exp) {
        let payload = {
            data: params,
            created: parseInt(Date.now() / 1000),//token生成的时间的，单位秒
            exp: exp || 3600//token有效期,精确到秒
        };

        //payload信息
        let base64Str = Buffer.from(JSON.stringify(payload), "utf8").toString("base64");

        //添加签名，防篡改
        let secret = "作者QQ:1178560551";
        let hash = crypto.createHmac('sha256', secret);
        hash.update(base64Str);
        let signature = hash.digest('base64');

        return base64Str + "." + signature;
    }

    checkToken(token) {
        let decodeToken = (token) => {

            let decArr = token.split(".");
            if (decArr.length < 2) {
                //token不合法
                return false;
            }

            let payload = {};
            //将payload json字符串 解析为对象
            try {
                payload = JSON.parse(Buffer.from(decArr[0], "base64").toString("utf8"));
            } catch (e) {
                return false;
            }

            //检验签名
            let secret = "作者QQ:1178560551";
            let hash = crypto.createHmac('sha256', secret);
            hash.update(decArr[0]);
            let checkSignature = hash.digest('base64');

            return {
                payload: payload,
                signature: decArr[1],
                checkSignature: checkSignature
            }
        }

        let resDecode = decodeToken(token);

        if (!resDecode) {
            return false;
        }

        //是否过期
        let expState = (parseInt(Date.now() / 1000) - parseInt(resDecode.payload.created)) > parseInt(resDecode.payload.exp) ? false : true;

        if (resDecode.signature === resDecode.checkSignature && expState) {
            return true;
        }

        return false;
    }

}