var port = {
    default: 8080
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
    }
}

export default {
    port,
    list
}