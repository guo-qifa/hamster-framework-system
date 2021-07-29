<template>
  <div>
    <BubbleBasicManage
      title="隐患排查标准"
      :form="form"
      form-title="隐患排查标准"
      type="checkstandard"
      :filter="filter"
      primaryKey="id"
      :btnWidth="180"
      :rowbtn="rowbtn"
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
    >
    </showDetailTemplate>
  </div>
</template>

<script>
// @ is an alias to /src
import { initRightControl } from '@/utils';
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "CheckStandard",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    return {
      rightControl: initRightControl(auth.auth),
      form: [
        {
          type: "input",
          text: "检查项目",
          name: "name",
          valid: { required: true },
        },
        { type: "hidden", name: "id" },
        {
          type: "input",
          text: "标准描述",
          name: "description",
          valid: { required: true },
        },
        {
          type: "select",
          text: "检查类型",
          name: "category",
          dictionary: "CheckStandardData",
          valid: { required: true },
        },
        {
          type: "input",
          text: "适用对象",
          name: "checkObject",
          valid: { required: true },
        },
        {
          type: "input",
          text: "参考依据项",
          name: "reference",
          valid: { required: true },
        },
        {
          type: "input",
          text: "标准内容",
          name: "content",
          valid: { required: true },
        },
      ],
      detailsForm: [
        {
          type: "input",
          text: "标准",
          name: "checkNorm",
          valid: { required: true },
        },
        { type: "hidden", name: "id" },
        {
          type: "input",
          text: "内容",
          name: "content",
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
        { key: "name", text: "检查项目" },
        {
          key: "category",
          text: "检查类型",
          type: "select",
          dictionary: "CheckStandardData",
        },
        { key: "checkObject", text: "适用对象" },
      ],
      rowbtn: [
        { 
          text: "查看详情", 
          onclick: this.showRowDetails,
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          }
        }],
      currentRowData: {},
      showDetailDialog: false,
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
    customImportData() { console.log("导入") },
    exportData() { console.log("导出") },
  },
};
</script>

<style lang="scss">
</style>