var port = {
    default: 8080,
    user: 1001,
    manager: 1001,
    region: 1005,
    organization: 1004,
    goods: 1003,
    order: 1002,
    scene: 1006,
    device: 1007,
    taskScheduler: 1100
};

var list = {
    common: {
        page: ["int", "int"],
        pageEx: ["int", "int", "s"],
        insert: ["s"],
        _delete: ["s"],
        update: ["s", "s"],
        find: ["s", "s"],
        selectEx: ["s"]
    },
    manager: {
        page: ["post", "user/manager/page"],
        pageEx: ["post", "user/manager/pageEx"],
        login: ["post", "user/manager/login", "s", "s"],
        insert: ["post", "user/manager/insert"],
        update: ["post", "user/manager/update"],
        _delete: ["post", "user/manager/delete"],
        recharge: ["post", "user/manager/recharge", "s", "long"],
    },
    user: {
        page: ["post", "user/user/page"],
        pageEx: ["post", "user/user/pageEx"],
        insert: ["post", "user/user/insert"],
        update: ["post", "user/user/update"],
        _delete: ["post", "user/user/delete"],
        find: ["post", "user/user/find"],
        regulationBalance: ["post", "user/user/regulation_balance", 's'],
    },
    task: {
        page: ["post", "taskScheduler/taskScheduler/page"],
        pageEx: ["post", "taskScheduler/taskScheduler/pageEx"],
        insert: ["post", "taskScheduler/taskScheduler/insert"],
        update: ["post", "taskScheduler/taskScheduler/update"],
        _delete: ["post", "taskScheduler/taskScheduler/delete"],
    },
    goods: {
        page: ["post", "goods/goods/page"],
        pageEx: ["post", "goods/goods/pageEx"],
        insert: ["post", "goods/goods/insert"],
        update: ["post", "goods/goods/update"],
    },
    device: {
        page: ["post", "device/device/page"],
        pageEx: ["post", "device/device/pageEx"],
        insert: ["post", "device/device/insert"],
        update: ["post", "device/device/update"],
        _delete: ["post", "device/device/delete"],
    },
    iccard: {
        page: ["post", "device/ic/page"],
        pageEx: ["post", "device/ic/pageEx"],
        insert: ["post", "device/ic/insert"],
        update: ["post", "device/ic/update"],
        find: ["post", "device/ic/find"],
        _delete: ["post", "device/ic/delete"],
    },
    order: {
        page: ["post", "order/order/page"],
        pageEx: ["post", "order/order/pageEx"],
        insert: ["post", "order/order/insert"],
        update: ["post", "order/order/update"],
        sumOrder: ["post", "order/order/sumOrder", "long", "long", "int", "s"],
        export: ["post", "/order/order/exportOrder", "long", "long"],
        exportSum: ["post", "/order/order/exportSum", "long", "long"],
        forBack: ["post", "order/order/forBack", "s"],
    },
    scene: {
        page: ["post", "scene/scene/page"],
        pageEx: ["post", "scene/scene/pageEx"],
        insert: ["post", "scene/scene/insert"],
        update: ["post", "scene/scene/update"],
        _delete: ["post", "scene/scene/delete"],
        selectEx: ["post", "scene/scene/selectEx"],
        find: ["post", "scene/scene/find"],
    },
    sceneCategory: {
        page: ["post", "scene/sceneCategory/page"],
        pageEx: ["post", "scene/sceneCategory/pageEx"],
        insert: ["post", "scene/sceneCategory/insert"],
        update: ["post", "scene/sceneCategory/update"],
        _delete: ["post", "scene/sceneCategory/delete"],
    },
    region: {
        tree: ["post", "region/region/tree", "s"],
        _delete: ["post", "region/region/delete"],
        page: ["post", "region/region/page"],
        pageEx: ["post", "region/region/pageEx"],
        insert: ["post", "region/region/insert"],
        update: ["post", "region/region/update"],
        find: ["post", "region/region/find"],
    },
    organization: {
        tree: ["post", "organization/organization/tree", "s"],
        _delete: ["post", "organization/organization/delete"],
        page: ["post", "organization/organization/page"],
        pageEx: ["post", "organization/organization/pageEx"],
        insert: ["post", "organization/organization/insert"],
        update: ["post", "organization/organization/update"],
        find: ["post", "organization/organization/find"],
    }
}

export default {
    port,
    list
}