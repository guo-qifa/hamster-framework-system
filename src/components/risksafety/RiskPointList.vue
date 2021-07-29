<script src="../../config/interface.js"></script>
<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <el-form style="padding: 0 10px" :inline="true">
        <el-form-item :label="userType == 2 ? '公司名称' : '车间名称'">
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
        :data="data"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="nodeSelect"
      >
      </el-tree>
    </el-col>
    <el-col :span="20">
      <BubbleBasicManage
        title="风险点管理"
        :form="form"
        form-title="风险点"
        type="riskPoint"
        :filter="filter"
        primaryKey="id"
        :btnWidth="200"
        :dataKey="'id'"
        :selectMode="'multiple'"
        @selectChange="tableSelectChange"
        :defaultFilter="defaultFilter"
        :noinsert="!rightControl.allowAdd"
        :noedit="!rightControl.allowEdit"
        :nodelete="!rightControl.allowDelete"
        :customImportButton="rightControl.allowImport"
        :exportButton="rightControl.allowExport"
        @customImport="customImportData"
        @export="exportData"
        :rowbtn="rowbtn"
      />
    </el-col>
    <DangerSourceDialog
      ref="dialog"
      :hazardRiskId="current.id"
      :rowData="current"
      v-if="current"
    />
  </el-row>
</template>

<script>
import DangerSourceDialog from "../dialog/RiskPoint";
import { getToken, initRightControl, importTemplateInfo, publicExportFn } from "@/utils";
import importTemplate from '../importTemplate/importTemplate';
export default {
  name: "RiskPointList",
  components: { DangerSourceDialog },
  computed: {
    importload() {
      return this.$bubble.config.Host.default + "risksafety/risk/import";
    },
    Token() {
      return {
        loginTokensAnjian: getToken``,
      };
    },
  },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    return {
      rightControl: initRightControl(auth.auth),
      selectData: [],
      userType: localStorage.getItem("userType"),
      filterText: "",
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" },{ field: "workId", logic: "=", value: "" }],
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      form: [
        {
          type: "input",
          text: "风险点名称",
          name: "riskName",
          valid: { required: true },
        },
        { type: "hidden", name: "id" },
        {
          type: "tableSelect",
          text: "所属车间",
          name: "workId",
          valid: { required: true },
          tableSelectConfig: "workPlace",
          defaultSelected: (v) => {
            return { text: this.mapData[v.workId], value: v.workId };
          },
        },
        {
          type: "input",
          text: "所在位置",
          name: "riskLocation",
          valid: { required: true },
        },
        {
          type: "select",
          text: "生产工艺",
          name: "craft",
          remote: {
            url: "remoteDict.url",
            parame: { dictCode: "scgy" },
            text: "subDictName",
            value: "subDictValue",
            valueType: "string",
          },
          valid: { required: true },
        },
        {
          type: "input",
          text: "经纬度",
          name: "coor",
          valid: { required: true },
        },
      ],
      filter: [
        { key: "riskName", text: "风险点名称" },
        {
          key: "craft",
          text: "生产工艺",
          type: "select",
          remote: {
            url: "remoteDict.url",
            parame: { dictCode: "scgy" },
            text: "subDictName",
            value: "subDictValue",
            valueType: "string",
          },
        },
        {
          key: "riskLevel",
          text: "风险点等级",
          type: "select",
          dictionary: "dangerLevel",
        },
      ],
      mapData: {},
      current: null,
      rowbtn: [{ text: "危害因素列表", onclick: this.showList }],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    tableSelectChange(v) {
      this.selectData = v;
    },
    showList(v) {
      this.current = v;
      this.$nextTick(() => {
        this.$refs.dialog.show();
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    nodeSelect(v) {
      this.$set(this.defaultFilter, this.userType == 1 ? 1 : 0, {
        field: this.userType == 1 ? "workId" : "cmyId",
        logic: "=",
        value: v.id,
      });
      
    },
    initMapData(d) {
      var data = d || this.data;
      for (let i = 0; i < data.length; i++) {
        this.mapData[data[i].id] = data[i].title;
        if (data[i].children) {
          this.initMapData(data[i].children);
        }
      }
    },
    initTreeData_1() {
      this.$bubble
      .request("workPlace.tree", {workName: this.filterText})
      .then((v) => {
        this.data = v.record;
        this.initMapData();
      })
      .catch((e) => {
        this.$alert("数据获取失败");
      });
    },
    initTreeData_2() {
      this.$bubble
      .request("searchCom.companyList", {cmyName: this.filterText})
      .then((v) => {
        this.data = v.record;
      })
      .catch((e) => {
        this.$alert("数据获取失败");
      });
    },
    customImportData() { 
      new this.$newPopup(
          importTemplate,
          {
            props: importTemplateInfo().RiskPointList,
          },
          () => {}
      );
    },
    exportData() { 
      if(!this.selectData || this.selectData.length == 0) {
        this.$message.warning('请勾选导出风险点!');
        return
      }
      publicExportFn(this.$bubble.requestExport, "exportInterface.RiskPointList", this.selectData.map(d => d.id), "风险点列表")
    },
  },
  created() {
      if(this.userType == 1) {
        this.initTreeData_1();
      } else {
        this.initTreeData_2();
      }
  },
};
</script>

<style>
</style>