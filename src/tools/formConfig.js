/**
 * @name: 表格验证 配置菜单
 * @Author: liuYaoYu
 * @param {*}
 * @return {*}
 * @Date: 2021-04-20 13:21:54
 * @LastEditTime: Do not Edit
 */
function getData(content) {
  return "请选择" + content;
}
const rules = () => ({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  region: [{ required: true, message: getData("所属车间"), trigger: "blur" }],
  addr: [{ required: true, message: "请选择风险点所在位置", trigger: "blur" }],

  manufacturing: [
    {
      required: true,
      message: getData("生产工艺"),
      trigger: "blur",
    },
  ],
  longitude: [{ required: true, message: getData("经度"), trigger: "change" }],
  latitude: [{ required: true, message: getData("纬度"), trigger: "change" }],
});
module.exports = { rules };
