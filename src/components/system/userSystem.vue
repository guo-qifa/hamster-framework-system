<template>
  <div>
    <BubbleBasicManage
      ref="paramSystemBasicManage"
      title="用户"
      :form="form"
      form-title="用户"
      type="userSystem"
      :filter="filter"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :dataKey="'userId'"
      primaryKey="userId"
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
          type: "step",
          text: "用户信息",
          forms: [
            {
              type: "input",
              text: "用户姓名",
              name: "userName",
              valid: { required: true },
            },
            {
              type: "hidden",
              text: "id",
              name: "userId",
              valid: { required: true },
            },
            {
              type: "select",
              text: "性别",
              name: "sex",
              option: [
                {
                  text: "男",
                  value: "0",
                },
                {
                  text: "女",
                  value: "1",
                },
              ],
              valid: { required: true },
            },
            {
              type: "input",
              text: "登陆名",
              name: "loginName",
              valid: { required: true },
            },
          
            {
              type: "input",
              text: "手机号",
              name: "phone",
              valid: { required: true },
            },
            {
              type: "input",
              text: "邮箱",
              name: "mail",
              valid: { required: true },
            },
            {
              type: "input",
              text: "微信",
              name: "wxOpenid",
              valid: { required: true },
            },
          ],
        },
        {
          type: "step",
          text: "关联信息",
          forms: [ 
            {
              type: "tableSelect",
              text: "角色分配",
              name: "roles",
              selectMode: "multiple",
              tableSelectConfig: "roleSystem",
              defaultSelected: (v) => { 
                if (v.roleLIst instanceof Array) {
                  return v.roleLIst.map((v) => {
                    return { text: v.roleName, value: v.roleId };
                  });
                }
              },
              valid: { required: true },
            },
            {
              type: "select",
              text: "账号状态",
              name: "status",//	

              option: [
                {
                  text: "正常",
                  value: "0",
                },
                {
                  text: "停用",
                  value: "1",
                },
                {
                  text: "待审核",
                  value: "2",
                },
              ],
              valid: { required: true },
            },
            {
              type: "textarea",
              text: "备注",
              name: "remark", 
            },
          ],
        },
      ],
      filter: [
        { key: "userName", text: "用户姓名" },
        { key: "loginName", text: "登录名" },
      ],
      rowbtn: [
        // {
        //   text: "查看详情",
        //   onclick: this.showRowDetails,
        //   visible: (v) => {
        //     return initRightControl(auth.auth).allowShowDetail;
        //   },
        // },
        // {
        //   text: "绑定用户",
        //   onclick: (...arg) => {
        //     console.log(arg);
        //   },
        //   visible: ({ binding }) => {
        //     return binding == 1;
        //   },
        // },
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