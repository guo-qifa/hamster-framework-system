<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="企业风险清单" name="first">
      <BubbleBasicManage
        title="风险辨识信息管理"
        type="riskIdentify"
        :filter="filter"
        primaryKey="id"
        nodelete
        noedit
        noinsert
      />
    </el-tab-pane>
    <el-tab-pane label="风险管控清单" name="second">
      <BubbleBasicManage
        title="风险管控清单"
        type="riskMeasureOrder"
        :filter="filters"
        primaryKey="id"
        nodelete
        noedit
        noinsert
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "IdentifyMangement",
  data() {
    return {
      filter: [
        { key: "riskName", text: "风险点名称" },
        {
          key: "factor",
          text: "危险有害因素",
          type: "select",
          dictionary: "hazFactor",
        },
      ],
      filters: [
        { key: "measures", text: "管控措施描述" },
        {
          key: "meaType",
          text: "管控措施分类",
          type: "select",
          dictionary: "dgType",
        },
      ],
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
</style>