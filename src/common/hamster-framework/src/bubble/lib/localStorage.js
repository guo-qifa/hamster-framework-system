var cache = {};
var expire = {};

class LocalStorage {
    constructor() {
        this.__init();
    }

    __init() {
        cache = localStorage.getItem("bubbleCache") ? JSON.parse(localStorage.getItem("bubbleCache")) : {};
        expire = localStorage.getItem("bubbleExpire") ? JSON.parse(localStorage.getItem("bubbleExpire")) : {};
    }

    __writeCache() {
        localStorage.setItem("bubbleCache", JSON.stringify(cache));
        localStorage.setItem("bubbleExpire", JSON.stringify(expire));
    }

    /**
     * 设置缓存
     * @param {*} k 键
     * @param {*} v 值
     * @param {*} t 超时时间
     */
    setItem(k, v, t) {
        cache[k] = v;
        if (t && typeof t === "number") {
            expire[k] = new Date().valueOf() + t;
        } else {
            delete expire[k];
        }
        this.__writeCache();
    }

    /**
     * 获取缓存
     * @param {*} k 键
     */
    getItem(k) {
        if (expire[k]) {
            if (expire[k] > new Date().valueOf()) {
                try {
                    return JSON.parse(cache[k]);
                } catch (error) {
                    return cache[k];
                }
            } else {
                return null;
            }
        } else {
            try {
                return cache[k] === undefined ? null : JSON.parse(cache[k]);
            } catch (error) {
                return cache[k] === undefined ? null : cache[k];
            }
        }
    }

    /**
     * 删除缓存
     * @param {*} k 
     */
    removeItem(k) {
        delete cache[k];
        delete expire[k];
        this.__writeCache();
    }

    /**
     * 清除缓存
     */
    clear() {
        cache = {};
        expire = {};
        this.__writeCache();
    }
}

export default new LocalStorage();