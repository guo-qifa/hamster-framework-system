import axios from "axios";

var Net = function () {
    var pool = {};  //缓存池
    this._call = function (methods, url, p, headers) {
        var rs = new Promise(function (resolve, reject) {
            if (pool[url]) {
                resolve(pool[url]);
                return;
            }
            axios[methods](url, p, { headers: headers }).then(function (v) {
                try {
                    resolve(v.data)
                } catch (error) {
                    reject(error)
                }
            }).catch(function (error) {
                reject(error)
            });
        });

        return rs;
    }
}

export default new Net();