<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-06-29 22:42:51
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-06-30 15:24:03
-->
<template>
  <div style="width: 100%; height: 100%; position: relative">
    <el-form style="padding: 0 10px" :inline="true">
      <el-form-item label="组织机构">
        <el-input
          placeholder="输入关键字进行过滤"
          size="mini"
          v-model="filterText"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <el-tree
      :expand="ifExpand?true:false"
      :default-expand-all="ifExpand?true:false"
      highlight-current
      class="filter-tree"
      :data="treeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="tree"
      @node-click="nodeSelect"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    searchBox: {
      type: Boolean,
      default() {
        return false;
      },
    },
    ifExpand: {
      type: Boolean,
      default() {
        return false;
      },
    }, 
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title",
      },
      filterText: "",
    };
  },
  created() {},

  mounted: function () {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {},
  methods: {
    nodeSelect(val) {
 
      if (val) {
        this.$emit("selectObj", val);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
  },
  computed: {
    // getsearchBox(){
    //  return searchBox=false
    // }
  },
};
</script>
<style lang="less" scoped>
.names {
  position: absolute;
  top: 35px;
  left: 20px;
}
/deep/ .ivu-tree ul li {
  text-align: left;
}
.topV {
  height: 45px;
  padding: 0 15px;
  width: 80%;
}
.treeBox {
  border-top: 1px solid #ccc;
  width: 100%;
  height: 90% !important;
  display: flex;
  flex: 10;
  height: 400px;
  overflow: auto;
}
/deep/ .ivu-tree {
  width: 100% !important;
  > ul {
    padding-left: 20px;
    width: 65% !important;
  }
}
</style>
