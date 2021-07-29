<template>
  <div>
    <BubbleBasicManage
      ref="paramSystemBasicManage"
      title="参数管理"
      :form="form"
      form-title="参数"
      type="paramSystem"
      :filter="filter"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :dataKey="'paramId'"
      primaryKey="paramId"
      :rowbtn="rowbtn"
      :btnWidth="200"
      :noinsert="!rightControl.allowAdd"
      :noedit="!rightControl.allowEdit"
      :nodelete="!rightControl.allowDelete"
      :customImportButton="rightControl.allowImport"
      :exportButton="rightControl.allowExport"
      @customImport="customImportData"
      @export="exportData"
    />

    <!-- 查看详情 -->
    <showDetailTemplate
      :visible="showDetailDialog"
      :formData="currentRowData"
      :formConfig="form"
      :beforeClose="beforeDetailDialogClose"
    ></showDetailTemplate>
  </div>
</template>

<script>
import {
  getToken,
  initRightControl,
  importTemplateInfo,
  publicExportFn,
} from "@/utils";
import importTemplate from "../importTemplate/importTemplate";
import showDetailTemplate from "../showDetailTemplate/showDetailTemplate";
export default {
  name: "paramSystem",
  components: { showDetailTemplate },
  computed: {
    Token() {
      return { Authorization: getToken`` };
    },
    iuldUrl() {
      return this.$bubble.config.Host.default + "risksafety/personnel/import";
    },
  },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    var auth = {
      auth: [
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "扬州晶澳",
          createId: 66,
          createTime: "2021-02-05 10:18:32",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 299,
          menuName: "新建",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "扬州晶澳",
          updateId: 66,
          updateTime: "2021-02-05 10:18:32",
          url: "/",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-05 10:27:38",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 301,
          menuName: "修改",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-05 10:27:38",
          url: "/",
        },
        
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-08 09:32:26",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 358,
          menuName: "查询",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-08 09:32:26",
          url: "",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-05 10:26:51",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 300,
          menuName: "删除",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 2,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-05 10:26:51",
          url: "/",
        },
        
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-08 09:32:26",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 358,
          menuName: "查询",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-08 09:32:26",
          url: "",
        },
        
      ],
    };
    return {
      rightControl: initRightControl(auth.auth),
      selectData: [],
      form: [
        {
          type: "input",
          text: "参数名称",
          name: "paramName",
          valid: { required: true },
        },
        {
          type: "hidden",
          text: "id",
          name: "paramId",
          valid: { required: true },
        },
        {
          type: "input",
          text: "参数值",
          name: "paramValue",
          valid: { required: true },
        },
        {
          type: "input",
          text: "参数编码",
          name: "paramCode",
          valid: { required: true },
        },
       
        {
          type: "input",
          text: "备注",
          name: "remark",
          valid: { required: true },
        },
      ],
      filter: [
        { key: "paramName", text: "参数名称" },
        { key: "paramValue", text: "参数值" },
        {
          key: "paramCode",
          text: "参数编码",
        },
      ],
      rowbtn: [
        {
          text: "查看详情",
          onclick: this.showRowDetails,
          visible: (v) => {
            return initRightControl(auth.auth).allowShowDetail;
          },
        },
        {
          text: "绑定用户",
          onclick: (...arg) => {
            console.log(arg);
          },
          visible: ({ binding }) => {
            return binding == 1;
          },
        },
      ],
      currentRowData: {},
      showDetailDialog: false,
      //   injectionSubmit(u, n, s, p) {
      //     //初始化请求参数
      //     let data = {};
      //     p.map(param => {data[param.field] = param.value});
      //     return new Promise((resolve, reject) => {
      //       this.$bubble.request("personnel.page", {
      //         ...data,
      //         pageNum: n,
      //         pageSize: s
      //       }).then((v) => {
      //         resolve({
      //           data: {
      //             records: v.record.records.map(val => {val.noedit = val.binding == 1 ? true : false;return val}),
      //             total: v.record.total,
      //           },
      //         });
      //       });
      //     });
      //   },
    };
  },
  methods: {
    showRowDetails(v) {
      this.currentRowData = v;
      this.showDetailDialog = true;
    },
    beforeDetailDialogClose() {
      this.showDetailDialog = false;
    },
    tableSelectChange(v) {
      this.selectData = v;
    },
    exportData() {
      if (!this.selectData || this.selectData.length == 0) {
        this.$message.warning("请勾选导出人员!");
        return;
      }
      publicExportFn(
        this.$bubble.requestExport,
        "exportInterface.UserList",
        this.selectData.map((d) => d.id),
        "人员列表"
      );
    },
    customImportData() {
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().UserList,
        },
        () => {}
      );
    },
  },
  created() {
    console.log(this.$bubble);
  },
};
</script>

<style lang="scss">
</style>