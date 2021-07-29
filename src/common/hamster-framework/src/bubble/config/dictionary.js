var rs = {
    //-------用户-------
    checkModel: {
        1: "管理员",
        0: "普通用户",
    }
};

((v = [
    /**
     * 值类型为数字的字典表,ObjectKey无法区分字符串数字
     * 需在该数组中添加类型为数字的字典加以标识如:
     * "lastStation"
     */
]) => {
    for (var i = 0; i < v.length; i++) {
        Object.defineProperty(rs[v[i]], "_isNumberKey", {
            value: true,
            enumerable: false
        });
    }
})();


export default rs;