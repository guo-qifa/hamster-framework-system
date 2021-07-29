import Vue from 'vue';
import Mock from "mockjs";
import regx from "./config/regx";      //常用正则表达式表
import MockConfig from "./config/mock";      //模拟请求表
import Dict from "./config/dictionary";    //字典表
import Choice from "./config/choiceConfig";      //表格选择配置
import Interface from "./config/interface";      //接口映射配置
import tableConfig from "./config/tableConfig";      //表格字段配置
import LocalStorage from './lib/localStorage';
import plugs from './plugs';
import BASE64 from './lib/base64';
import interfaceConfig from "./config/interface"
import "./style/bubble.css"

import Components from "./component"

var Host = "";
var UploadHost = "";
var MockMode = false;   //是否使用MOCK
var eventList = {};
var MockList = [];

class Bubble {
    /**
     * componentConfig
     * choiceConfig-选择配置
     * dictionaryConfig-字典配置
     * interfaceConfig-接口配置
     * tableConfig-表格配置
     * regxConfig-正则配置
     * mockConfig-模拟数据配置
     */
    constructor(config) {
        Host = config.Host;
        UploadHost = config.UploadHost;
        MockMode = !!config.MockMode;
        this.config = config;
        this.title = config.title || "";
        this.miniTitle = config.miniTitle || "";
        this.ChoiceConfig = Choice;
        this.Dictionary = Dict;
        this.Regx = regx;
        this.TableConfig = tableConfig;
        this.InterfaceConfig = {};
        if (config.componentConfig) {
            this.__initComponentConfig(config.componentConfig);
        }
        this.Plugs = Object.assign(plugs, config.plugs);

        this.LS = LocalStorage;

        this.__initPlug(config);
        this.__mock();
        this.__importIcon();
        this.globeConfig = config.globeConfig;
        // this.__registerComponents();

        if (config.globeConfig && config.globeConfig.beforePageLoad) {
            this.__initEach(config.globeConfig.beforePageLoad, config.router);
        }
    }

    /**
     * 初始化Config
     */
    __initComponentConfig(componentConfig) {
        this.ChoiceConfig = Object.assign(this.ChoiceConfig, componentConfig.ChoiceConfig);
        this.Dictionary = Object.assign(this.Dictionary, componentConfig.DictionaryConfig);
        this.Regx = Object.assign(this.Regx, componentConfig.RegxConfig);
        this.InterfaceConfig = Object.assign(this.InterfaceConfig, componentConfig.InterfaceConfig);
        this.TableConfig = Object.assign(this.TableConfig, componentConfig.TableConfig);
        MockList = MockConfig.concat(componentConfig.MockConfig);
    }

    /**
     * 初始化图标
     */
    __importIcon() {
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = 'http://at.alicdn.com/t/font_2204554_lac0acacci.js';
        document.body.appendChild(oScript);
    }

    /**
     * 初始化页面加载钩子
     */
    __initEach(cb, router) {
        router.beforeEach((to, from, next) => {
            cb.call(this, to.query, to, (v) => {
                this.pageLoadArguments = v || undefined;
                next();
            });
        });
    }

    /**
     * requestPlug处理
     */
    __initPlug(config) {
        var requestPlug = plugs[config.requestPlug + 'Request'];
        for (let tmp in requestPlug) {
            if (typeof requestPlug[tmp] === 'function') {
                this[tmp] = requestPlug[tmp].bind(this);
            }
        }
    }

    __registerComponents() {
        for (var tmp in Components) {
            Vue.component(tmp, Components[tmp]);
        }
    }

    __mock() {
        if (MockMode) {
            for (var i = 0; i < MockList.length; i++) {
                !MockList[i].disabled && Mock.mock(MockList[i].url, MockList[i].option);
            }
        }
    }

    __replacePathParame(path, v) {
        var hit = false;
        var left;
        var tmp = "";
        for (var i = 0; i < path.length; i++) {
            if (path[i] == "{") {
                left = i;
                hit = true;
                continue;
            }
            if (path[i] == "}") {
                hit = false;
                path = path.replace("{" + tmp + "}", v[tmp] ? v[tmp] : " ");
                i = left + (v[tmp] + "").length - 1;
                tmp = "";
            }
            if (hit) {
                tmp += path[i];
            }
        }
        return path;
    }

    getInterfaceConfig(name) {
        return Object.assign({}, this.interfaceConfig.list[name]);
    }

    subscribe(name, cb) {
        if (!eventList[name]) {
            eventList[name] = [];
        }
        eventList[name].push(cb);
    }

    trigger(name, ...arg) {
        if (name == 'loginout') {
            this.LS.removeItem("loginInfo");
        }
        if (eventList[name]) {
            eventList[name].forEach(v => {
                typeof v === 'function' && v.apply(this, arg);
            })
        }
    }

    getLoginInfo() {
        return this.LS.getItem("loginInfo");
    }

    dateFormat(fmt, date) {
        if (fmt == "timestamp") {
            return date.valueOf ? date.valueOf() : 0;
        }
        let ret;
        const opt = {
            "y+": date.getFullYear().toString(),        // 年
            "M+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "m+": date.getMinutes().toString(),         // 分
            "s+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    /**
     * 获取Host
     * @param {[string, undefined]} v 服务名称,获取对应服务端口
     */
    getHost(v) {
        let host = Host.default; 
        if (typeof Host === 'object') {
            if (v.indexOf(".") >= 0) {
                if (Host[v]) {
                    host = Host[v];
                } else if (Host[v.split(".")[0]]) {
                    host = Host[v.split(".")[0]]
                } else {
                    host = Host.default;
                }
            } else {
                if (Host[v]) {
                    host = Host[v];
                } else {
                    host = Host.default;
                }
            }
        }
        if (!host) {
        
            throw new Error("未配置默认域名");
        }
        return host.replace("@port", Interface.port[v] || Interface.port.default);
    }

    /**
     * 获取上传Host
     * @param {[string, undefined]} v 服务名称,获取对应服务端口
     */
    getUploadHost(v) {
        return UploadHost || Host.replace("@port", Interface.port[v] || Interface.port.default);
    }

    /**
     * base64编码
     * @param {*} s 待转字符串
     */
    replaceBase64(s) {
        return s ? BASE64.encode(typeof s === "object" ? JSON.stringify(s) : s) : s;
    }

    /**
     * base64解码
     * @param {*} s 待转base64编码字符串
     */
    deReplaceBase64(s) {
        return s ? BASE64.decode(s) : "";
    }

    
}


export default (Vue, config) => {
    if (!config.Host) {
        throw new Error("初始化Bubble必须存在Host参数");
    }

    Vue.prototype.$bubble = new Bubble(config);

    for (var tmp in Components) {
        Vue.component(tmp, Components[tmp]);
    }
}