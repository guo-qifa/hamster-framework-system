import axios from "axios";
import LocalStorage from '../../lib/localStorage';
import BASE64 from '../../lib/base64';

var pool = {};

var _call = function () {
    var config = this.interfaceConfig.list;
 
    var port = this.interfaceConfig.port;
    var path = arguments[0];
    var _this = this;

    if (path.indexOf("delete") >= 0) {
        path = path.replace("delete", "_delete");
    }
    var cfg = config[path.split(".")[0]];
    if (cfg[path.split(".").pop()]) {
        cfg = cfg[path.split(".").pop()].concat(config.common[path.split(".").pop()] ? config.common[path.split(".").pop()] : []);
    } else {
        alert("请求路径不存在");
        return;
    }
    var p = "gsc-post:";
    for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] == "function") {
            break;
        }
        // p += (i > 1 ? "&" : "") + (i - 1) + "=" + cfg[i + 1] + ":" + arguments[i];
        p += (i > 1 ? ":," : "") + (cfg[i + 1] == 'json' ? 's' : cfg[i + 1]) + ":" + (cfg[i + 1] == 'json' ? JSON.stringify(arguments[i]) : arguments[i]);
    }

    var rs = new Promise(function (resolve, reject) {
        if (pool[path]) {
            resolve(pool[path]);
            return;
        }
        if (path.indexOf("region") >= 0) {
            delete pool["region.tree"]
        }
        if (path.indexOf("organization") >= 0) {
            delete pool["organization.tree"]
        }
        // axios.post(_this.getHost(cfg[1]), p, { headers: { 'appid': 2, grapesid: window.bubbleStore.getItem("grapesid") } }).then(function (v) {
        axios.post(_this.getHost(cfg[1].split("/")[0]) + cfg[1], p, { headers: { 'appid': 1, grapesid: LocalStorage.getItem("grapesid") } }).then(function (v) {
            if (v.data && (path == "region.tree" || path == "organization.tree")) {
                pool[path] = v.data;
            }
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
 * 表格请求通用参数处理
 * @param {*} v 参数列表
 */
var fixParame = function (v) {
    var rs = v;
    if (!v) {
        return v;
    }

    if (v instanceof Array) {
        rs = [];
        for (let i = 0; i < v.length; i++) {
            const element = v[i];
            if (element.logic == "date") {
                rs.push({ field: element.field || element.key, logic: ">", value: new Date(element.value.split(",")[0]).valueOf() });
                rs.push({ field: element.field || element.key, logic: "<", value: new Date(element.value.split(",")[1]).valueOf() });
            } else {
                let item = { field: element.field || element.key, logic: element.logic, value: element.valueType == 'number' ? parseInt(element.value) : element.value };
                if (element.link_logic) {
                    item.link_logic = element.link_logic;
                }
                rs.push(item);
            }
        }
    }

    return rs;
}

/**
 * 请求数据
 * @param {*} path 接口映射配置中的键名
 * @param  {...any} arg 请求参数
 */
export function request(...arg) {
    return new Promise((resolve, reject) => {
        _call.apply(this, arg).then((v) => {
            if (v.errorcode != 0) {
                reject(v.message || v.record);
            } else {
                resolve(v);
            }
        }).catch(v => {
            reject(v.message);
        });
    });
}

/**
 * 请求表格数据
 * @param {*} path 
 * @param {Object} arg 请求参数
 * arg:{ "filter": Object, "pageNum": Number, "pageSize": Number }
 */
export function requestTable(path, ...arg) {
    arg[2] = fixParame(arg[2]);
    if (arg[2].length) {
        path += "Ex";
        arg[2] = JSON.stringify(arg[2]);
    } else {
        arg.pop();
    }
    return new Promise((resolve, reject) => {
        _call.apply(this, [path, ...arg]).then((v) => {
            //表格数据json结构适配
            if (v.errorcode != 0) {
                reject(v.message || v.record);
            } else {
                v.data = { records: v.record.data, total: v.record.totalSize, currentPage: v.record.currentPage, pageSize: v.record.pageSize };
                delete v.record;
                resolve(v);
            }
        }).catch(v => {
            reject(v);
        });
    });
}

/**
 * 请求树状数据
 * @param {*} path 
 * @param {Object} arg 请求参数
 */
export function requestTree(path, ...arg) {
    arg[0] = fixParame(arg[0]);
    if (arg[0] instanceof Array) {
        arg[0] = JSON.stringify(arg[0]);
    }
    return new Promise((resolve, reject) => {
        _call.apply(this, [path, ...arg]).then((v) => {
            if (v.errorcode != 0) {
                reject(v.message || v.record);
            } else {
                resolve(v);
            }
        }).catch(v => {
            reject(v);
        });
    });
}

/**
 * 登录
 * @param {*} path 
 * @param {Object} arg 表格请求参数
 */
export function requestLogin(path, ...arg) {
    return new Promise((resolve, reject) => {
        _call.apply(this, [path, ...arg]).then((v) => {
            //登录会话信息处理
       
            if (v.errorcode != 0) {
                reject(v.message || v.record);
            } else {
                this.LS.setItem("loginInfo", v.record, 12 * 60 * 60 * 1000);
                this.LS.setItem("grapesid", v.record.GrapeSID, 12 * 60 * 60 * 1000);
                resolve(v);
            }
        }).catch(v => {
            reject(v.message);
        });
    });
}


export function replaceGrapeBase64(v) {
    return v ? BASE64.encode(typeof v === "object" ? JSON.stringify(v) : v).replace(/\//g, "@t").replace(/\+/g, "@w") : v;
}