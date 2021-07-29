<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-05-11 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-05-11 15:23:44
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
          title="预案管理"
          :form="form"
          form-title="预案"
          type="planManagement"
          :filter="filter"
          primaryKey="id"
          :injectionSubmit="injectionSubmit"
          :rowbtn="rowbtn"
          :btnWidth="200"
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
  </div>
</template>

<script>
// @ is an alias to /src
import { getToken, initRightControl } from "@/utils";
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "PlanManagement",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
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
          type: "step",
          text: "基本信息",
          forms: [
            {
              type: "input",
              text: "预案名称",
              name: "name",
              valid: { required: true },
            },
            { type: "hidden", name: "id" },
            {
              type: "select",
              text: "预案级别",
              name: "levelName",
              dictionary: "planLevelList",
              valid: { required: true },
            },
            {
              type: "select",
              text: "预案类型",
              name: "typeName",
              dictionary: "planTypeList",
              valid: { required: true },
            },
            {
              type: "date",
              text: "发布日期",
              name: "publishDate",
              format: "yyyy-MM-dd",
              valid: { required: true },
            },
            {
              type: "select",
              text: "事故类型",
              name: "accidentType",
              dictionary: "hazFactor",
              valid: { required: true },
            },
            {
              type: "textarea",
              text: "预案内容",
              name: "content",
              minRows: 5,
              valid: { required: true },
            },
            { 
              type: "upload",
              text: "预案附件",
              name: "recordEnclosure",
              multiple: false,
              headers: {
                loginTokensAnjian: getToken(),
              },
              onSuccess(res) {
                res.object.url = uploadPrefix + res.object.url;
                return res.object.url
              }
            },
            {
              type: "textarea",
              text: "备注",
              name: "remark",
              minRows: 5,
              valid: { required: true },
            },
          ],
        },
        {
          type: 'step',
          text: '备案情况',
          forms: [
            {
              type: "radio",
              text: "备案情况",
              name: "filing",
              option: [{text: '未备案', value: '未备案'}, {text: '已备案', value: '已备案'}],
              valid: { required: true },
            },
            {
              type: "input",
              text: "备案单位",
              name: "filingUnit",
              valid: { required: true },
              formObjVisible: (d) => {return d.filing == '已备案'}
            },
            {
              type: "input",
              text: "备案编号",
              name: "recordNo",
              valid: { required: true },
              formObjVisible: (d) => {return d.filing == '已备案'}
            },
            {
              type: "date",
              text: "备案时间",
              name: "recordTime",
              format: "yyyy-MM-dd",
              valid: { required: true },
              formObjVisible: (d) => {return d.filing == '已备案'}
            },
            {
              type: "textarea",
              text: "备案备注",
              name: "recordNote",
              minRows: 5,
              formObjVisible: (d) => {return d.filing == '已备案'}
            },
          ]
        },
        {
          type: "step",
          text: "物资项",
          forms: [
            {
              type: "plugs",
              plugs: "PlanSupply",
              name: "urgentPlanMaterialPojoList",
            },
          ],
        },
      ],
      filter: [
        { key: "name", text: "预案名称" },
        {
          key: "status",
          text: "预案状态",
          type: "select",
          dictionary: "planManagementStatus",
        },
        { key: "content", text: "预案内容" },
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
          text: "发布",
          onclick: this.publish,
          loadingOnClick: true,
          visible: (v) => {
            return v.status == 1;
          },
        },
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
    publish(v, callback) {
      this.$confirm("确认发布吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {console.log(v)})
        .catch((v) => {})
        .finally((v) => {
          callback();
        });
    },
    valid(v, callback) {
      this.$confirm("确认审核吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch((v) => {})
        .finally((v) => {
          callback();
        });
    },
    push(v, callback) {
      this.$confirm("确认提交吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((e) => {})
        .catch((v) => {})
        .finally((v) => {
          callback();
        });
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
    injectionSubmit(u, n, s, p) {
      //初始化请求参数
      let data = {};
      p.map(param => {data[param.field] = param.value});
      return new Promise((resolve, reject) => {
        this.$bubble.request("planManagement.page", {
          ...data,
          pageNum: n,
          pageSize: s
        }).then((v) => {
          resolve({
            data: {
              records: v.record.records.map(val => {
                val.noedit = val.status == 1 ? false : true;
                val.nodelete = val.status == 1 ? false : true;
                return val
              }),
              total: v.record.total,
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