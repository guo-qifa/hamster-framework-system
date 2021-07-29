<template>
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
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="安全风险分级管控清单" name="first">
          <BubbleBasicManage
            title=""
            type="twoListInfo"
            :filter="filter"
            :defaultFilter="defaultFilter"
            primaryKey="id"
            nodelete
            noedit
            noinsert
          />
        </el-tab-pane>
        <el-tab-pane label="危险（有害）因素排查识别清单" name="second">
          <BubbleBasicManage
            title=""
            type="twoListInfos"
            :filter="filter"
            :defaultFilter="defaultFilter"
            primaryKey="id"
            nodelete
            noedit
            noinsert
          />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "TwoListInfoManagement",
  data() {
    return {
      filter: [{ key: "riskName", text: "风险点名称" }],
      activeName: "first",
      userType: localStorage.getItem("userType"),
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleClick(tag, e) {},
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
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }
  },
};
</script>

<style>
</style>