<template>
<div>
  <BubbleBasicManage
    ref="personnelBasicManage"
    title="人员情况"
    :form="form"
    form-title="人员"
    type="personnel"
    :filter="filter"
    :selectMode="'multiple'"
    @selectChange="tableSelectChange"
    :dataKey="'id'"
    primaryKey="id"
    :rowbtn="rowbtn"
    :btnWidth="200"
    :injectionSubmit="injectionSubmit"
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
import { getToken, initRightControl, importTemplateInfo, publicExportFn } from "@/utils";
import importTemplate from '../importTemplate/importTemplate';
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "UserList",
  components: { showDetailTemplate },
  computed: {
    Token() {
      return { loginTokensAnjian: getToken`` };
    },
    iuldUrl() {
      return this.$bubble.config.Host.default + "risksafety/personnel/import";
    },
  },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    return {
      rightControl: initRightControl(auth.auth),
      selectData: [],
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
      ],
      filter: [
        { key: "name", text: "姓名" },
      ],
      rowbtn: [
        {
          text: '查看详情',
          onclick: this.showRowDetails,
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          }
        },
        {
          text: '绑定用户',
          onclick: (...arg) => {
            console.log(arg);
          },
          visible: ({ binding }) => {
            return binding == 1
          } 
        },
        
      ],
      currentRowData: {},
      showDetailDialog: false,
      injectionSubmit(u, n, s, p) {
        //初始化请求参数
        let data = {};
        p.map(param => {data[param.field] = param.value});
        return new Promise((resolve, reject) => {
          this.$bubble.request("personnel.page", {
            ...data,
            pageNum: n,
            pageSize: s
          }).then((v) => {
            resolve({
              data: {
                records: v.record.records.map(val => {val.noedit = val.binding == 1 ? true : false;return val}),
                total: v.record.total,
              },
            });
          });
        });
      },
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
      if(!this.selectData || this.selectData.length == 0) {
        this.$message.warning('请勾选导出人员!');
        return
      }
      publicExportFn(this.$bubble.requestExport, "exportInterface.UserList", this.selectData.map(d => d.id), "人员列表");
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