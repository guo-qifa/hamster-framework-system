<template>
  <div>
    <BubbleBasicManage
      ref="list"
      title="车间场所"
      :form="form"
      form-title="车间"
      type="workPlace"
      label-width="120px"
      :filter="filter"
      primaryKey="id"
      :dataKey="'id'"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :rowbtn="rowbtn"
      :btnWidth="250"
      :noinsert="!rightControl.allowAdd"
      :noedit="!rightControl.allowEdit"
      :nodelete="!rightControl.allowDelete"
      :customImportButton="rightControl.allowImport"
      :exportButton="rightControl.allowExport"
      @customImport="customImportData"
      @export="exportData"
    />
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      title="车间人员"
      :visible.sync="DialogVisible"
    >
      <BubbleList
        ref="list"
        :search="popFilter"
        type="popUser"
        :injectionSubmit="injectionSubmit"
        rurl="empty"
      />
    </el-dialog>

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
  name: "WorkPlaceList",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    return {
      rightControl: initRightControl(auth.auth),
      selectData: [],
      form: [
        {
          type: "step",
          text: "车间信息",
          forms: [
            {
              type: "input",
              text: "车间名称",
              name: "workName",
              valid: { required: true },
            },
            { type: "hidden", name: "id" },
            {
              type: "select",
              text: "风险等级",
              name: "riskLevel",
              dictionary: 'dangerLevel_descript',
              valid: { required: true },
              
            },
            {
              type: "tableSelect",
              text: "车间负责人",
              name: "charge",
              tableSelectConfig: "personnel",
              defaultSelected: (v) => {
                return { text: v.chargeName, value: parseInt(v.charge) };
              },
            },
            {
              type: "input",
              text: "联系号码",
              name: "phone",
              valid: { pattern: 11 },
              defaultSelected:(e)=>{
                  console.log(e,'联系号码联系号码联系号码联系号码联系号码联系号码');
              }
            },
            {
              type: "tableSelect",
              text: "从业人员",
              name: "workerIds",
              selectMode: "multiple",
              tableSelectConfig: "personnel",
              defaultSelected: (v) => {
                if(v.personList instanceof Array) {
                  return v.personList.map((v) => {
                    return { text: v.name, value: v.id };
                  });
                }
              },
            },
            { type: "textarea", text: "主要作业活动", name: "activity" },
            { type: "textarea", text: "职业危害活动", name: "hazardPlaces" },
            {
              type: "number",
              text: "从业人员数量",
              disabled: true,
              name: "staffSum",
              link: {
                name: "assWorkshopPersonnelList",
                value: (v) => v && v.split(",").length,
              },
            },
            {
              type: "upload",
              text: "场所检测报告",
              name: "report",
              headers: { loginTokensAnjian: getToken`` },
              onSuccess: (res) => {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              },
            },
          ],
        },
        {
          type: "step",
          text: "车间地图",
          forms: [{ type: "plugs", text: "车间地图", plugs:'map', name:"map", _this: this, defaultSelected:e=>{this.$emit} }],
        },
        {
          type: "step",
          text: "车间位置",
          forms: [{ type: "input", text: "经纬度", name: "coor", disabled: true, append: '请在上一步地图中绘制车间位置！' , valid: { required: true }}],
        },
      ],
      filter: [
        { key: "workName", text: "车间名称" },
        {
          key: "charge",
          text: "车间负责人",
          type: "tableSelect",
          choiceConfig: "personnel",
        },
        { key: "phone", text: "联系号码" },
      ],
      popFilter: [{ key: "name", text: "姓名" }],
      rowbtn: [
        {
          text: '查看详情',
          onclick: this.showRowDetails,
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          }
        },
        { 
          text: "查看人员",
          onclick: this.showUsers
        },
      ],
      DialogVisible: false,
      currentUser: null,
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
      this.currentRowData = {};
      this.showDetailDialog = false;
    },
    tableSelectChange(v) {
      this.selectData = v;
    },
    showUsers(v) {
      this.DialogVisible = true;
      this.currentUser = Object.assign({}, v);
      this.$refs.list && this.$refs.list.reload();
    },
    /**
     * 模拟导入数据,借用组件样式
     */
    injectionSubmit(url, n, s, p) {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            records:
              p.length == 0
                ? this.currentUser.personList
                  ? this.currentUser.personList
                  : []
                : this.currentUser.personList.filter(
                    (data) => data.name.indexOf(p[0].value) >= 0
                  ),
            total: this.currentUser.personList
              ? this.currentUser.personList.length
              : 0,
          },
        });
      });
    },

    customImportData() { 
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().WorkPlaceList,
        },
        () => {}
      );
     },
    exportData() { 
      if(!this.selectData || this.selectData.length == 0) {
        this.$message.warning('请勾选导出车间!');
        return
      }
      publicExportFn(this.$bubble.requestExport, "exportInterface.WorkPlaceList", this.selectData.map(d => d.id), "车间列表")
    },
  },
};
</script>

<style></style>
