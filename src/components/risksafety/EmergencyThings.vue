<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-27 17:06:01
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4" v-if="userType == 2">
        <el-form style="padding: 0 10px" :inline="true">
          <el-form-item label="企业名称">
            <el-input
              placeholder="输入关键字进行过滤"
              size="mini"
              v-model="filterText"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <el-tree
          highlight-current
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          @node-click="nodeSelect"
        >
        </el-tree>
      </el-col>
      <el-col :span="userType == 2 ? 20 : 24">
        <BubbleBasicManage
          title="应急物资"
          :form="form"
          form-title="应急物资"
          type="emergencyThings"
          :filter="filter"
          primaryKey="id"
          :rowbtn="rowbtn"
          :btnWidth="250"
          :defaultFilter="defaultFilter"
          :noinsert="!rightControl.allowAdd"
          :noedit="!rightControl.allowEdit"
          :nodelete="!rightControl.allowDelete"
          :customImportButton="rightControl.allowImport"
          :exportButton="rightControl.allowExport"
          @customImport="customImportData"
          @export="exportData"
        />
      </el-col>
    </el-row>


      <!-- 查看详情 -->
    <showDetailTemplate
        :visible="showDetailDialog"
        :formData="currentRowData"
        :formConfig="form"
        :beforeClose="beforeDetailDialogClose"
    ></showDetailTemplate>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="DialogVisible"
      width="80%"
    >
      <div class="line"></div>
      <BubbleBasicManage
        ref="details"
        title="物资台账"
        :form="dialogForm"
        form-title="物资台账"
        type="emergencyThingsDetails"
        primaryKey="id"
        :injectionSubmit="injectionSubmit"
        noedit
      />
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { initRightControl } from "@/utils";
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "EmergencyThings",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    return {
      rightControl: initRightControl(auth.auth),
      userType: localStorage.getItem("userType"),
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
      form: [
        {
          type: "input",
          text: "物资名称",
          name: "name",
          valid: { required: true },
        },
        { type: "hidden", name: "id" },
        {
          type: "input",
          text: "位置",
          name: "location",
          valid: { required: true },
        },
        {
          type: "select",
          text: "物资类别",
          name: "type",
          dictionary: "emergencyThingsType",
        },
        { type: "input", text: "单位", name: "unit" },
        {
          type: "select",
          text: "物资状态",
          name: "status",
          option: [
            {
              text: "正常",
              value: "正常",
            },
            {
              text: "使用中",
              value: "使用中",
            },
            {
              text: "维修",
              value: "维修",
            },
            {
              text: "报废",
              value: "报废",
            },
          ],
          valid: { required: true },
        },
        {
          type: "input",
          text: "主要负责人",
          name: "chargePerson",
          valid: { required: true },
        },
        {
          type: "input",
          text: "联系人电话",
          name: "chargePersonTel",
          valid: { required: true },
        },

        {
          type: "date",
          text: "出厂日期",
          name: "produceDate",
        },
        {
          type: "input",
          text: "使用年限",
          name: "lifeSpan",
        },
        {
          type: "input",
          text: "出产厂家",
          name: "manufacturer",
        },
        { type: "textarea", text: "备注", name: "remark", minRows: 1 },
      ],
      filter: [
        { key: "name", text: "物资名称" },
        {
          key: "type",
          text: "物资类别",
          type: "select",
          dictionary: "emergencyThingsType",
        },
        { key: "location", text: "位置" },
      ],
      rowbtn: [
        { 
          text: "查看详情", 
          onclick: this.showRowDetails,
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          }
        },
        {
          text: "物资台账",
          onclick: this.showList,
          visible: v => {
            return initRightControl(auth.auth).allowWZTZ
          }
        },
      ],
      currentRowData: {},
      showDetailDialog: false,
      dialogForm: [
        { type: "hidden", name: "matId" },
        {
          type: "select",
          text: "记录类型",
          name: "type",
          dictionary: "emergencyThingsDetailsType",
          valid: { required: true },
        },
        {
          type: "number",
          text: "记录数量",
          name: "count",
          valid: { required: true },
        },
        {
          type: "textarea",
          text: "备注",
          name: "remark",
          minRows: 10,
          valid: { required: true },
        },
      ],
      DialogVisible: false,
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
    showList(v) {
      // this.$bubble.request("latentControlList.details", { defectId: v.id }).then((v) => {
      //     this.DialogVisible = true;
      //     this.dialogFormData = v.record[0];
      //     this.$refs.BubbleForm && this.$refs.BubbleForm.initData();
      // }).catch(v => {
      //     this.$alert("数据获取失败");
      // }).finally(() => {
      //     callback();
      // });
      this.current = v;
      this.DialogVisible = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    nodeSelect(v) {
      this.$set(this.defaultFilter, 0, {
        field: "cmyId",
        logic: "=",
        value: v.id,
      });
      
    },
    initTreeData() {
      this.$bubble
        .request("searchCom.companyList", {cmyName: this.filterText})
        .then((v) => {
          this.treeData = v.record;
        })
        .catch((e) => {
          this.$alert("数据获取失败");
        });
    },
    injectionSubmit() {
      return new Promise((resolve, reject) => {
        this.$set(this.dialogForm[0], "default", this.current.id);
        this.$bubble
          .request("emergencyThings.details", { matId: this.current.id })
          .then((v) => {
            resolve({
              data: {
                records: v.record,
                total: v.record.length,
              },
            });
          });
      });
    },
    customImportData() { console.log("导入") },
    exportData() { console.log("导出") },
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }
  },
};
</script>

<style lang="scss">
</style>