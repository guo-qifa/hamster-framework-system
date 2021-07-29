import { Slider } from "element-ui";
import floatObj from "@/bubble/lib/floatObj"

var tableConfig = {
    user: [
        {
            text: "真实姓名",
            key: "realname"
        },
        {
            text: "身份证号",
            key: "_name"
        },
        // {
        //     text: "用户身份证",
        //     key: "_name"
        // },
        // {
        //     text: "登录密码",
        //     key: "upw"
        // },
        {
            text: "状态",
            key: "state",
            dictionary: "userState",
            color: {
                0: "text-success",
                20: "text-warning",
                4: "text-danger",
                20: "text-danger"
            }
        },
        {
            text: "IC卡号",
            key: "ic_openid"
        },
        {
            text: "所在单位",
            key: "did#name"
        },
        {
            text: "用户余额",
            key: "balance",
            render: function (v) {
                return v.balance == 0 || !v.balance ? '-' : floatObj.divide(v.balance, 100);
            }
        },
        {
            text: "初始余额",
            key: "init_balance",
            render: function (v) {
                return v.init_balance == 0 || !v.init_balance ? '-' : floatObj.divide(v.init_balance, 100);
            }
        },
        {
            text: "校准余额",
            key: "check",
            render: function (v) {
                if (v.check == '') {
                    return "<span style='color:#909399'>待校准</span>";
                } else {
                    return "<span style='color:" + (v.check == v.balance ? '#27c24c' : '#f05050') + "'>" + floatObj.divide(v.check, 100) + "</span>";
                }
            }
        },
        {
            text: "入职时间",
            key: "createAt",
            type: "date"
        }
    ],
    manager: [
        // {
        //     text: "用户ID",
        //     key: "_id"
        // },
        {
            text: "用户名",
            key: "username"
        },
        {
            text: "登录账号",
            key: "_name"
        },
        {
            text: "创建时间",
            key: "time",
            type: "date"
        },
        {
            text: "管理单位",
            key: "did#name",
            emptyText: "-"
        },
        {
            text: "管理场景",
            key: "sid#name",
            render: function (v) {
                if (v.sid.indexOf(",")) {
                    return v["sid&Array"].map(v => v.name).join(",");
                } else {
                    return v.sid ? v["sid#name"] : "-";
                }
            }
        },
        {
            text: "管理员类型",
            key: "_weigh",
            render: function (v) {
                if (v._weight == 100) {
                    return "场景管理员";
                }
                if (v._weight == 1000) {
                    return "部门管理员";
                }
                return "总管理员";
            }
        },
    ],
    goods: [ 
        {
            text: "商品名称",
            key: "name"
        },
        {
            text: "商品分类",
            key: "cid"
        },
        {
            text: "商品简介",
            key: "brief"
        },
        {
            text: "商品详情",
            key: "desc"
        },
        {
            text: "商品状态",
            key: "state",
            dictionary: "goodState",
            color: {
                0: "text-success",
                1: "text-warning",
                2: "text-dark",
                3: "text-info",
                4: "text-danger"
            }
        },
        {
            text: "创建时间",
            key: "createAt",
            type: "date"
        }
    ],
    order: [
        {
            text: "订单号",
            key: "SN"
        },
        {
            text: "订单价格",
            key: "totalPrice",
            render: function (v) {
                return v.totalPrice == 0 || !v.totalPrice ? '-' : floatObj.divide(v.totalPrice, 100);
            }
        },
        {
            text: "订单状态",
            key: "state",
            dictionary: "orderState",
            color: {
                10: "text-success",
                2: "text-warning",
                0: "text-info",
                4: "text-danger",
                20: "text-danger"
            }
        },
        // {
        //     text: "创建时间",
        //     key: "createAt",
        //     type: "date"
        // },
        {
            text: "确认时间",
            key: "confirmAt",
            type: "date"
        },
        {
            text: "订单类型",
            key: "orderClass",
            dictionary: "orderClass",
            color: {
                1: "text-success",
                2: "text-danger"
            }
        },
        {
            text: "取消时间",
            key: "cancelAt",
            type: "date"
        },
        {
            text: "订单设备",
            key: "producer"
        },
        {
            text: "消费人",
            key: "consumer#realname"
        },
        {
            text: "消费场景",
            key: "sid#name"
        },
    ],
    scene: [
        // {
        //     text: "场景ID",
        //     key: "_id"
        // },
        {
            text: "城市编码",
            key: "cityCode"
        },
        {
            text: "场景名称",
            key: "name"
        },
        {
            text: "所属单位",
            key: "did#name"
        },
        {
            text: "场景分类",
            key: "scid#name"
        },
        {
            text: "收费类型",
            key: "costType",
            dictionary: "costType"
        },
        {
            text: "收费金额",
            key: "price",
            render: function (v) {
                return v.price == 0 || !v.price ? '-' : floatObj.divide(v.price, 100);
            }
        },
        {
            text: "场景开启状态",
            key: "state",
            dictionary: "sceneState",
            color: {
                0: "text-success",
                1: "text-danger"
            }
        }
    ],
    device: [
        {
            text: "设备ID",
            key: "did"
        },
        {
            text: "设备名称",
            key: "name"
        },
        {
            text: "所属场景",
            key: "sid",
            render: function (v) {
                return v["sid#name"];
            }
        },
        {
            text: "设备状态",
            key: "state",
            dictionary: "deviceState",
            color: {
                0: "text-success",
                1: "text-danger"
            }
        },
        {
            text: "创建时间",
            key: "createAt",
            type: "date"
        }
    ],
    iccard: [
        {
            text: "IC卡号",
            key: "cid"
        },
        {
            text: "绑定用户",
            key: "uid#realname"
        },
        {
            text: "IC卡状态",
            key: "state",
            dictionary: "deviceState",
            color: {
                0: "text-success",
                1: "text-danger"
            }
        },
        {
            text: "创建时间",
            key: "createAt",
            type: "date"
        }
    ],
    sceneCategory: [
        // {
        //     text: "场景分类ID",
        //     key: "_id"
        // },
        {
            text: "场景分类名称",
            key: "name"
        },
        {
            text: "场景分类编码",
            key: "code"
        },
        {
            text: "目标码（安康码）",
            key: "targetCode"
        }
    ],
    task: [
        {
            text: "计划任务名称",
            key: "name"
        },
        {
            text: "间隔类型",
            key: "taskClass",
            dictionary: "taskClass"
        },
        {
            text: "间隔值",
            key: "taskValue",
            render: (v) => {
                if (v.taskValue.split) {
                    var l = v.taskValue.split("#");
                    var index = 0;
                    for (let i = 0; i < l.length; i++) {
                        if (l[i] > 0) {
                            index = i;
                        }
                    }
                    var text = ["年", "月", "星期", "号", "点"]
                    return index == 2 ? `<p>${l[index] ? text[index] + l[index] : '-'}</p>` : `<p>${l[index] ? l[index] + text[index] : '-'}</p>`
                } else {
                    return v.taskValue + "分钟";
                }
            }
        },
    ]
}

export default tableConfig;