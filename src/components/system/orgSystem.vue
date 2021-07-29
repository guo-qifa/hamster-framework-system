<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-07-02 15:29:09
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4" style="height: 100%">
        <el-card class="box-card" style="height: 39vw; width: 100%">
          <!-- <el-form style="padding: 0 10px" :inline="true">
            <el-form-item label="企业名称">
              <el-input
                placeholder="输入关键字进行过滤"
                size="mini"
                v-model="filterText"
                clearable
              ></el-input>
            </el-form-item>
          </el-form> -->
          <orgTree
            :treeData="treeData"
            :ifExpand="true"
            @selectObj="selectObj"
          ></orgTree>

          <!-- <el-tree
            highlight-current
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="nodeSelect"
          >
          </el-tree> -->
        </el-card>
      </el-col>
      <el-col :span="20">
        <BubbleBasicManage
          @refreshTable="refreshTable"
          title="组织管理"
          :form="form"
          form-title="组织管理"
          type="orgSystem"
          :labelWidth="'200px'"
          :filter="filter"
          primaryKey="orgId"
          :dataKey="'id'"
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
          :tableTree="true"
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
import { initRightControl, importTemplateInfo, publicExportFn } from "@/utils";
import importTemplate from "../importTemplate/importTemplate";
import showDetailTemplate from "../showDetailTemplate/showDetailTemplate";

import orgTree from "../../../src/common/components/orgTree/index";

export default {
  name: "orgSystem",
  components: { showDetailTemplate, orgTree },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    auth = {
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
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-05 10:26:51",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 300,
          menuName: "删除",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 2,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-05 10:26:51",
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
      userType: localStorage.getItem("userType"),
      selectData: [],
      filterText: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "parentId", logic: "=", value: "" }],
      dialogVisible: false,
      form: [
        {
          type: "step",
          text: "基本信息",
          forms: [
            {
              type: "treeSelect",
              text: "上级机构",
              name: "parentId",
              nameKey: "parentName",
              treeSelectConfig: {
                url: "orgSystem.treeselect",
                textKey: "title",
                textName: "已选组织机构",
                title: "组织机构",
                valueKey: "id",
                defaultFilter: {},
              },
              defaultFilterValue: {},
              disabled: false,
              primaryKey: "title",
              defaultSelected: (v) => {
           
                return { text: v.parentName, value: v.parentId };
              },
              valid: {required: true},
            },
            {
              type: "hidden",
              text: "上级机构",
              name: "parentName",
              valid: {required: true},
            },
            {
              type: "input",
              text: "上级机构",
              type: "hidden",
              name: "parentName",
              disabled: false,
              valid: {required: true},
            },
            {
              type: "input",
              text: "组织名称",
              name: "orgName",
              valid: {required: true},
            },
            { type: "hidden", text: "orgId", name: "orgId" },
            {
              type: "input",
              text: "组织简称",
              name: "shortName",
              valid: {required: true},
            },
            {
              type: "radio",
              text: "组织状态",
              name: "orgCode",
              valid: {required: true},
              option: [
                {
                  text: "可用",
                  value: "0",
                },
                {
                  text: "停用",
                  value: "1",
                },
              ],
            },
            {
              type: "number",
              text: "显示顺序",
              name: "sort",
            },

            {
              type: "textarea",
              text: "备注",
              name: "remark",
            },
          ],
        },
      ],
      filter: [
        { key: "name", text: "组织名称" },
        {
          key: "hazGrade",
          text: "组织状态",
          type: "select",
          dictionary: "orgStatus",
        },
      ],
      rowbtn: [],
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
    refreshTable(n) {
      this.initTreeData();
    },
    selectObj(v) {
 
      this.$set(this.defaultFilter, 0, {
        field: "parentId",
        logic: "=",
        value: v.id,
      });
    },
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
        .request("orgSystem.treeselect", {})
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
      if (!this.selectData || this.selectData.length == 0) {
        this.$message.warning("请勾选导出危害因素!");
        return;
      }
      publicExportFn(
        this.$bubble.requestExport,
        "exportInterface.DangerSourceList",
        this.selectData.map((d) => d.id),
        "危害因素列表"
      );
    },
  },
  created() {
    this.initTreeData();
  },
};
</script>

<style scoped>
</style>