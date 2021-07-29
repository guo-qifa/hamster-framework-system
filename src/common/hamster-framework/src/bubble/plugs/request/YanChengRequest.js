import axios from "axios";

var pool = {};  //缓存池

var _call = function (methods, url, p, headers) {
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

/**
* 请求数据
* @param {*} path 接口映射配置中的键名
* @param  {...any} arg 请求参数
*/
export function request(path, query, arg) {
    //路径验证拼装
    var cfg = Interface.list[path.split(".")[0]];
    if (cfg[path.split(".").pop()]) {
        cfg = cfg[path.split(".").pop()].concat(Interface.list.common[path.split(".").pop()] ? Interface.list.common[path.split(".").pop()] : []);
    } else {
        alert("请求路径不存在");
        return;
    }
    if (cfg[1].indexOf("{") >= 0) {
        cfg[1] = this.__replacePathParame(cfg[1], query);
        return this._call(cfg[0], Host.replace("@port", (Interface.port[cfg[1].split("/")[0]] || Interface.port.default)) + cfg[1], arg);
    } else {
        return this._call(cfg[0], Host.replace("@port", (Interface.port[cfg[1].split("/")[0]] || Interface.port.default)) + cfg[1], query);
    }
}