<template>
<div>
  <BubbleBasicManage
    ref="list"
    title="基本情况"
    :form="form"
    form-title="基本信息"
    type="baseInfo"
    label-width="160px"
    :filter="filter"
    primaryKey="id"
    :dataKey="'id'"
    :selectMode="'multiple'"
    @selectChange="tableSelectChange"
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
import { getToken, initRightControl, importTemplateInfo, publicExportFn } from "@/utils";
import importTemplate from '../importTemplate/importTemplate';
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "BaseInfoList",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    return {
      userType: localStorage.getItem('userType'),
      rightControl: initRightControl(auth.auth),
      selectData: [],
      form: [
        {
          type: "step",
          text: "基本信息",
          forms: [
            {
              type: "input",
              text: "企业名称",
              name: "cmyName",
              valid: { required: true },
            },
            {
              type: "hidden",
              text: "id",
              name: "id",
              valid: { required: true },
            },
            {
              type: "input",
              text: "企业简称",
              name: "cmyAsname",
              valid: { required: true },
            },
            {
              type: "input",
              text: "法人代表",
              name: "lawPerson",
              valid: { required: true },
            },
            {
              type: "input",
              text: "法人代表联系方式",
              name: "lawPhone",
              valid: { required: true, pattern: 11 },
            },
            {
              type: "input",
              text: "企业注册地址",
              name: "cmyLoginAddress",
              valid: { required: true },
            },
            {
              type: "input",
              text: "企业实际地址",
              name: "cmyAddress",
              valid: { required: true },
            },
            {
              type: "select",
              text: "所属网格",
              name: "gridId",
              remote: {
                url: "grid.select",
                parame: { userType: 2 },
                text: "name",
                value: "id",
                valueType: "string",
              },
              valid: { required: true },
            },
            {
              type: "select",
              text: "网格员",
              name: "gridUserId",
              remote: {
                url: "user.select",
                parame: { userType: 2 },
                text: "userName",
                value: "id",
              },
              valid: { required: true },
            },
            {
              type: "input",
              text: "统一社会信用代码",
              name: "uscc",
              valid: { required: true },
            },
            {
              type: "radio",
              text: "企业规模",
              name: "scale",
              valid: { required: true },
              option: [
                { text: "规模以上", value: "规模以上" },
                { text: "规模以下", value: "规模以下" },
              ],
            },
            // { type: "input", text: "企业营业现状", name: "scale", valid: { required: true } },
          ],
        },
        {
          type: "step",
          text: "行业分类",
          forms: [
            { type: "select", text: "国民经济行业分类", name: "gbt", dictionary: 'gbtType' },
            { type: "select", text: "安全监管行业分类", name: "sccoi", dictionary: 'sccoiType' },
            { type: "input", text: "行业监管部门", name: "regulators" },
            {
              type: "image",
              text: "企业四色风险分布应急疏散图",
              name: "riskEmergency",
              multiple: false,
              headers: {
                loginTokensAnjian: getToken(),
              },
              onSuccess(res) {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              }
            },
            { type: "input", text: "四色风险图出具机构", name: "riskEmergencyOrg" },
            { type: "date", text: "四色风险图出具时间", name: "riskEmergencyTime", format: 'yyyy-MM-dd' },
            { 
              type: "upload",
              text: "四色风险图制作合同",
              name: "riskEmergencyFile",
              headers: {
                loginTokensAnjian: getToken(),
              },
              onSuccess(res) {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              }
            },
          ],
        },
        {
          type: "step",
          text: "企业定位",
          forms: [
            {
              type: "radio",
              text: "企业大门朝向",
              name: "orientation",
              option: [
                { text: "东", value: "东" },
                { text: "西", value: "西" },
                { text: "南", value: "南" },
                { text: "北", value: "北" },
              ],
            },
            { type: "input", text: "企业东临", name: "east" },
            { type: "input", text: "企业西临", name: "west" },
            { type: "input", text: "企业南临", name: "south" },
            { type: "input", text: "企业北临", name: "north" },
            { type: "plugs", text: "位置", name: "BasicInfoMap", plugs:'BasicInfoMap', _this: this  },
            { type: "input", text: "经纬度", name: "coor", disabled: true, append: '请在上方地图中绘制企业位置！' },
          ],
        },
        {
          type: "step",
          text: "企业标准化",
          forms: [
            {
              type: "select",
              text: "安全生产标准化等级",
              name: "standLevel",
              dictionary: "standLevel",
            },
            {
              type: "image",
              text: "企业平面图",
              name: "plan",
              headers: {
                loginTokensAnjian: getToken(),
              },
              onSuccess(res) {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              }
            },
            { type: "input", text: "平面图出具机构", name: "planOrg" },
            { type: "date", text: "平面图出具时间", name: "planTime", format: 'yyyy-MM-dd' },
            { 
              type: "upload",
              text: "平面图制作合同",
              name: "planFile",
              multiple: false,
              headers: {
                loginTokensAnjian: getToken(),
              },
              onSuccess(res) {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              }
            },
          ],
        },
      ],
      filter: [
        { key: "cmyName", text: "公司名称" },
        { key: "gridId", text: "所属网格", type: "select",  dictionary:"gridId"},
      ],
      rowbtn: [
        {
          text: '查看详情',
          onclick: this.showRowDetails
        }
      ],
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
      tableSelectChange(v) {
        this.selectData = v;
      },
      customImportData() {
        new this.$newPopup(
          importTemplate,
          {
            props: importTemplateInfo().BaseInfoList,
          },
          () => {}
        );
      },
      exportData() { 
        if(!this.selectData || this.selectData.length == 0) {
          this.$message.warning('请勾选导出企业!');
          return
        }
        publicExportFn(this.$bubble.requestExport, "exportInterface.BaseInfoList", this.selectData.map(d => d.id), "企业列表")
      },
  },
  created() {
    console.log(this.rightControl)
  },
};
</script>

<style scoped>
</style>