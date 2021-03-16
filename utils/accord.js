const CryptoJS = require('crypto-js');

module.exports = class {
    constructor(key, iv) {
        this.key = CryptoJS.enc.Utf8.parse(key);
        this.iv = CryptoJS.enc.Utf8.parse(iv);

        let all = ['富强', '民主', '文明', '和谐', '自由', '平等'];

        let all1 = all
        let tmp1 = []
        for (let index in all) {
            let ele = all[index]
            for (let xindex in all1) {
                let xele = all1[xindex]
                tmp1.push(ele + xele)
            }
        }

        let tmp2 = []
        let tmp3 = {}
        let tmp4 = {}

        for (let i = 0; i < 26; i++) {
            tmp2.push(String.fromCharCode(97 + i))
        }

        for (let i = 0; i <= 9; i++) {
            tmp2.push(i)
        }

        for (let index in tmp2) {
            tmp3[tmp2[index]] = tmp1[index]
            tmp4[tmp1[index]] = tmp2[index]
        }

        this.tmp3 = tmp3
        this.tmp4 = tmp4
    }

    autoEn(data) {
        data = data.split('');
        let r = ''
        for (let index in data) {
            let ele = data[index]
            r += this.tmp3[ele]
        }
        return r
    }

    autoDn(data) {
        data = data.split('')
        let r = ''
        let s = ''
        for (let index in data) {
            s += data[index]
            if (index % 4 == 3) {
                r += this.tmp4[s]
                s = ''
            }
        }
        return r
    }

    // 加密
    encrypt(data) {
        try {
            data = JSON.stringify(data)
        } catch (e) {
            //TODO handle the exception
        }
        const result = CryptoJS.AES.encrypt(data, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let hexData = result.ciphertext.toString();
        return this.autoEn(hexData);
    }

    // 解密
    decrypt(cipher) {
        cipher = this.autoDn(cipher)
        let encryptedHexStr = CryptoJS.enc.Hex.parse(cipher);
        let encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        const decrypted = CryptoJS.AES.decrypt(encryptedBase64Str, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let result = CryptoJS.enc.Utf8.stringify(decrypted);
        try {
            result = JSON.parse(result)
        } catch (e) {
            //TODO handle the exception
        }
        return result
    }
}
