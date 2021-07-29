<template>
  <BubbleBasicManage
    title="人员情况"
    :form="form"
    form-title="人员"
    type="personnel"
    :filter="filter"
    primaryKey="id"
    @import="importData"
    :importHeaders="Token"
    importButton
    :importUploadUrl="iuldUrl"
    :rowbtn="rowBtn"
  />
</template>

<script>
import { getToken } from "@/utils";
// @ is an alias to /src
export default {
  name: "UserList",
  computed: {
    Token() {
      return { loginTokensAnjian: getToken`` };
    },
    iuldUrl() {
      return this.$bubble.config.Host.default + "risksafety/personnel/import";
    },
  },
  data() {
    return {
      form: [
        {
          type: "input",
          text: "姓名",
          name: "name",
          valid: { required: true },
        },
        { type: "hidden", text: "id", name: "id", valid: { required: true } },
        {
          type: "select",
          text: "性别",
          name: "gender",
          dictionary: "sex",
          valid: { required: true },
        },
        {
          type: "select",
          text: "职务",
          name: "type",
          dictionary: "userType",
          valid: { required: true },
        },
        {
          type: "input",
          text: "联系电话",
          name: "phone",
          valid: { required: true, pattern: 11 },
        },
        {
          type: "select",
          text: "证件类型",
          name: "cardType",
          dictionary: "cardType",
          valid: { required: true },
        },
        {
          type: "input",
          text: "证件号码",
          name: "cardNo",
          valid: { required: true },
        },
      ],
      filter: [
        { key: "name", text: "姓名" },
        { key: "cardNo", text: "证件号码" },
      ],
      rowBtn: [
        {
          text: "导出",
          onclick: (...arg) => {
            this.exportData(arg);
          },
        },
      ],
    };
  },
  methods: {
    /**
     * 导出使用
     * 添加exportButton属性
     * 添加export事件
     */
    exportData([d, callback]) {
      //点击导出按钮后调用
      //自己调用接口
      this.$bubble.request("personnel.export", [d.id],).then((v) => {
        let url = window.URL.createObjectURL(new Blob([v.data], { type: "application/octet-stream" }));
        let a = document.createElement("a");
        a.href = url;
        a.download="人员列表" + ".xls"
        console.log(a);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    /**
     * 导入使用
     * 添加importButton属性
     * 添加importUploadUrl属性（文件上传地址）
     * 添加import事件
     */
    importData(url) {
      //上传导入文件后调用
      //获得文件URL调用导入接口
      this.$message({
        message: "导入成功",
        type: "success",
      });
    },
  },
  created() {
    console.log(this.$bubble);
  },
};
</script>

<style lang="scss">
</style>