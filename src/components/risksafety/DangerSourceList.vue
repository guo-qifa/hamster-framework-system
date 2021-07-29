<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-05-18 15:34:37
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
        title="危害因素管理"
        :form="form"
        form-title="危害因素"
        type="dangerSource"
        :labelWidth="'200px'"
        :filter="filter"
        primaryKey="id"
        :dataKey="'id'"
        :selectMode="'multiple'"
        :defaultFilter="defaultFilter"
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
    </el-col>
  </el-row>
  <!-- <el-row :gutter="20">
    <el-col :span="4" v-if="userType == 2"></el-col>
    <el-col :span="userType == 2 ? 20 : 24">
    </el-col>
  </el-row> -->
  
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
import { initRightControl, importTemplateInfo, publicExportFn } from '@/utils';
import importTemplate from '../importTemplate/importTemplate';
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "DangerSourceList",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    return {
      rightControl: initRightControl(auth.auth),
      userType: localStorage.getItem("userType"),
      selectData: [],
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
      dialogVisible: false,
      form: [
        {
          type: "input",
          text: "危害因素名称",
          name: "name",
          valid: { required: true },
        },
        { type: "hidden", text: "id", name: "id" },
        {
          type: "select",
          text: "危害因素等级",
          name: "type",
          remote: {
            url: "remoteDict.url",
            parame: { dictCode: "wxyfl" },
            text: "subDictName",
            value: "subDictValue",
            valueType: "string",
          },
          valid: { required: true },
        },
        {
          type: "select",
          text: "管控层级",
          name: "controlLevel",
          remote: {
            url: "remoteDict.url",
            parame: { dictCode: "gkcj" },
            text: "subDictName",
            value: "subDictValue",
            valueType: "string",
          },
          valid: { required: true },
        },
        {
          type: "select",
          text: "发生事故的可能性",
          name: "possibility",
          dictionary: "possibility",
          valid: { required: true },
        },
        {
          type: "select",
          text: "发生事故的频率",
          name: "frequency",
          dictionary: "frequencyFixed",
          valid: { required: true },
        },
        {
          type: "select",
          text: "发生事故的后果",
          name: "ponderance",
          dictionary: "ponderance",
          valid: { required: true },
        },
        { type: "input", text: "可能导致事故", name: "accident" },
        {
          type: "radio",
          text: "危险有害因素",
          name: "hazFactor",
          dictionary: "hazFactor",
        },
        {
          type: "select",
          text: "检查频次",
          name: "checkFrequency",
          dictionary: "frequency",
        },
        {
          type: "select",
          text: "检查时间",
          name: "weekday",
          dictionary: "frequency_week",
          formObjVisible: (d) => {return d.checkFrequency == '01'}
        },
        {
          type: "select",
          text: "检查频次",
          name: "monthday",
          dictionary: "frequency_month",
          formObjVisible: (d) => {return d.checkFrequency == '02'}
        },
      ],
      filter: [
        { key: "name", text: "危害因素名称" },
        {
          key: "hazGrade",
          text: "固有等级",
          type: "select",
          // dictionary: "dangerLevel",
          remote: {
            url: "remoteDict.url",
            parame: { dictCode: "wxygydj" },
            text: "subDictName",
            value: "subDictValue",
            valueType: "string",
          },
        }
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
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
    customImportData() { 
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().DangerSourceList,
        },
        () => {}
      );
     },
    exportData() { 
      if(!this.selectData || this.selectData.length == 0) {
        this.$message.warning('请勾选导出危害因素!');
        return
      }
      publicExportFn(this.$bubble.requestExport, "exportInterface.DangerSourceList", this.selectData.map(d => d.id), "危害因素列表")
    },
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }
  },
};
</script>

<style scoped>
</style>