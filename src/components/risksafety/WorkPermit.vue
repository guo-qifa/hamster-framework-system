<template>
<div>
  <BubbleBasicManage
      title="作业许可"
      :form="form"
      form-title="作业许可"
      type="workPermit"
      :filter="filter"
      primaryKey="id"
      :rowbtn="rightControl.allowShowDetail ? rowbtn : []"
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
// @ is an alias to /src
import { getToken, initRightControl, importTemplateInfo } from "@/utils";
import importTemplate from '../importTemplate/importTemplate';
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "WorkPermit",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    console.log(auth)
    return {
      rightControl: initRightControl(auth.auth),
      form: [
        {
          type: "input",
          text: "证书名称",
          name: "certificateName",
          valid: {required: true},
        },
        { type: "hidden", name: "id" },
        {
          type: "input",
          text: "证书编号",
          name: "cardNum",
          valid: {required: true},
        },
        {
          type: "input",
          text: "发证机构",
          name: "authority",
          valid: {required: true},
        },
        {type: "hidden", name: "id"},
        {
          type: "select",
          text: "证书类别",
          name: "certificateType",
          dictionary: "certificateType",
          valid: {required: true},
        },
        {
          type: "input",
          text: "部门名称",
          name: "deptName",
          valid: {required: true},
        },
        {
          type: "date",
          text: "发证日期",
          name: "grantTime",
          valid: {required: true},
          format: "yyyy-MM-dd",
        },
        {
          type: "input",
          text: "员工",
          name: "employee",
          valid: {required: true},
        },
        {
          type: "date",
          text: "有效期",
          name: "termDate",
          valid: {required: true},
          format: "yyyy-MM-dd",
        },
        {
          type: "date",
          text: "复审日期",
          name: "recheckTime",
          valid: {required: true},
          format: "yyyy-MM-dd",
        },
      ],
      filter: [
        {key: "certificateName", text: "证书名称"},
        {key: "deptName", text: "部门名称"},
        {key: "employee", text: "员工"},
      ],
      rowbtn: [
        {
          text: '查看详情',
          onclick: this.showRowDetails
        }
      ],
      currentRowData: {},
      showDetailDialog: false,
    }
  },
  methods: {
    showRowDetails(v) {
      this.currentRowData = v;
      this.showDetailDialog = true;
    },
    beforeDetailDialogClose() {
      this.showDetailDialog = false;
    },
    customImportData() { 
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().WorkPermit,
        },
        () => {}
      );
    },
    exportData() { console.log("导出") },
  },
  computed: {
    Token() {
      return {
        'loginTokensAnjian': getToken``
      }
    },
    importload() {
      return this.$bubble.config.Host.default + "risksafety/jobLucese/importExcelt";
    },
  }
};
</script>

<style lang="scss">
</style>