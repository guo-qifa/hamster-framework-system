<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-26 13:22:45
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-26 10:03:23
-->
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
      <BubbleBasicManage
        :injectionSubmit="injectionSubmit"
        title="巡检记录单"
        :defaultFilter="defaultFilter"
        type="hazardRisk"
        :filter="filter"
        primaryKey="id"
        :rowbtn="rowbtn"
        noinsert
        noedit
        nodelete
      />
    </el-col>
  </el-row>
</template>

<script>
// @ is an alias to /src
import pop from "@/common/content/hazardRiskPop";
export default {
  name: "hazard-risk",
  data() {
    return {
      userType: localStorage.getItem("userType"),
      filter: [
        { key: "riskName", text: "风险点名称" },
        { key: "name", text: "危害因素名称" },
        {
          type: "select",
          key: "status",
          text: "状态",
          dictionary: "hazardRiskStatus",
        },
      ],
      rowbtn: [
        {
          text: "查看详情",
          onclick: (...arg) => {
            this.showDetails(arg);
          },
        },
      ],
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
    showDetails(e) {
      const [info, func] = e; // 获取数据
      const { hazardPojo } = info; // 获取数据
      const { name } = hazardPojo; // 名称
      const { id: hazardRiskId, hazStauts: status } = info; //hazardRiskId
      const pageNum = 1,
        pageSize = 100; // 默认配置
      this.$bubble
        .request("hazardRisk.details", {
          hazardRiskId,
          status,
          pageNum,
          pageSize,
        })
        .then((v) => {
          if (v.code == 0) {
            v.record.name = name;
            const { record } = v;
            record.records.forEach((e) => {
              const { pic } = e;
              if (pic && pic.length > 9) {
                e.pic = JSON.parse(pic);
              }
            });
            new this.$newPopup(
              pop,
              {
                props: {
                  info: record,
                },
              },
              (e) => {
                console.log(e);
              }
            );
          }
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

    injectionSubmit(u, n, s, q) {
      return new Promise((resolve, reject) => {
        const name = q.length > 0 ? q.find((item) => item.field == "name") : "";
        const riskName =
          q.length > 0 ? q.find((item) => item.field == "riskName") : "";
        const status =
          q.length > 0 ? q.find((item) => item.field == "status") : "";
        var par = {
          pageNum: n,
          pageSize: s,
          hazardPojo: {
            name: name && name.value,
          },
          riskPojo: {
            riskName: riskName && riskName.value,
          },
          status: status && status.value,
          cmyId: this.defaultFilter[0].value
        };
        this.$bubble.request("hazardRisk.page", par).then((v) => {
          resolve({
            data: {
              records: v.record.records,
              total: v.record.records.length,
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