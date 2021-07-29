<template>
  <div>
    <BubbleBasicManage
      ref="paramSystemBasicManage"
      title="通知公告"
      :form="form"
      form-title="通知公告"
      type="noticeSystem"
      :filter="filter"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :dataKey="'noticeId'"
      :primaryKey="'noticeId'"
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
// import Fuwenben from '@/common/components/fuwenben.vue';

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
      ],
    };
    return {
      rightControl: initRightControl(auth.auth),
      selectData: [],
      form: [
        {
          type: "input",
          text: "公告标题",
          name: "noticeTitle",
          valid: { required: true },
        },
        // {
        //   type: "plugs",
        //   text: "公告内容",
        //   name: "noticeContent",
        //   valid: { required: true },
        // },
        {
          type: "plugs",
          text: "公告内容",
          plugs: "fuwenben",
          pageType: "noticeContent",
          name: "noticeContent",
          defaultSelected: (e) => {
            console.log(e);
          },
        },
        {
          type: "hidden",
          text: "公告ID",
          name: "noticeId",
          valid: { required: true },
        },
        {
          type: "radio",
          text: "类型类型",
          name: "noticeType",
          option: [
            {
              text: "通知",
              value: "1",
            },
            {
              text: "公告",
              value: "2",
            },
          ],
          valid: { required: true },
        },

        {
          type: "radio",
          text: "状态",
          name: "status",
          option: [
            {
              text: "正常",
              value: "0",
            },
            {
              text: "关闭",
              value: "1",
            },
          ],
          valid: { required: true },
        },
        
        {
          type: "tableSelect",
          text: "接收人",
          name: "receiverIds",
          selectMode: "multiple",
          tableSelectConfig: "userSystem",
          defaultSelected: (v) => {
            if (v.roleLIst instanceof Array) {
              return v.roleLIst.map((v) => {
                return { text: v.userName, value: v.userId };
              });
            }
          },
          valid: { required: true },
        },
     
        {
          type: "date",
          text: "创建时间",
          name: "createTime",
          valid: { required: true },
        },
      ],
      filter: [
        { key: "noticeTitle", text: "公告标题" },
        { key: "noticeContent", text: "公告内容" },
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