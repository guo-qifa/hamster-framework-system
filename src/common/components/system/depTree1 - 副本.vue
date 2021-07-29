<template>
  <div style="width:100%;height:100%; position: relative">
    <slot class="topV" name="topv"></slot>
    <slot class="tool" name="tool"></slot>
    <slot class="names" name="names"></slot>
    <div class="treeBox" :style="{ 'padding-top': searchBox ? '30px' : '0px','border-top': searchBox ? 'none' : '1px solid #ccc' }">
      <Tree
        :data="treeData"
        ref="treeBox"
        :multiple="multiple"
        :show-checkbox="checkbox"
        expand-node
        @on-check-change="checkboxChange"
        @on-select-change="selectMenu"
      ></Tree>
    </div>
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
      }
    },
    checkbox: {
      type: Boolean,
      default() {
        return false;
      }
    },
    pageType: {
      type: String,
      default() {
        return "";
      }
    },
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  created() {
    this.$emit("setTitle", "选择部门");
    this.$emit("setPageSize", 400);
    this.$emit("setPageTopSize", 50);
    this.$emit("setModalMove");
    this.$emit("setButtonCenter");
    this.$emit("setModalClass", "hidden-register-modal");
    this.$emit("setPageActions", [
      {
        text: "取消",
        action: "save",
        handle: () => {
          this.$emit("hide");
        }
      },
      {
        text: "确认",
        theme: "success",
        action: "save",
        handle: () => {
          this.save();
        }
      }
    ]);
  },

  mounted: function() {},
  watch: {},
  computed: {},
  methods: {
    async saveOrder(type) {
      const res = await this.$http.get("/user/" + localStorage.getItem("id"));
      this.$Message.success({
        content: "生成成功",
        duration: 5,
        closable: true
      });
      this.$emit("close", "ssss");
    },
    save() {
      this.saveOrder();
    },
    selectMenu(val) {
 
      if (this.checkbox && this.multiple) {
        if (this.pageType == "threeCardInfoManagement") {
          this.$emit(
            "threeCardInfoManagement",
            this.$refs.treeBox.getCheckedAndIndeterminateNodes()
          );
        }
        if (this.pageType == "dept") {
          this.$emit(
            "dept",
            this.$refs.treeBox.getCheckedAndIndeterminateNodes()
          );
        }
        if (this.pageType == "addMenu") {
          this.$emit(
            "addMenu",
            this.$refs.treeBox.getCheckedAndIndeterminateNodes()
          );
        }
        if (this.pageType == "role") {
          this.$emit(
            "role",
            this.$refs.treeBox.getCheckedAndIndeterminateNodes()
          );
        }
      } else {
        if (this.pageType == "threeCardInfoManagement") {
          this.$emit("threeCardInfoManagement", val);
        }
        if (this.pageType == "dept") {
          this.$emit("dept", val);
        }
        if (this.pageType == "addMenu") {
          this.$emit("addMenu", val);
        }
        if (this.pageType == "role") {
          this.$emit("role", val);
        }
      }
    },

    /**
     * 这里是方法起源
     * 逻辑起源
     * @param {val}  数据
     * */ 
    checkboxChange(val) {
       
      var a = this.$refs.treeBox.getCheckedAndIndeterminateNodes();
      if (this.pageType == "role") {
        this.$emit(
          "role",
          this.$refs.treeBox.getCheckedAndIndeterminateNodes()
        );
      }
    },
     selectMenu(val) {
       
      var a = this.$refs.treeBox.getCheckedAndIndeterminateNodes();
      if (this.pageType == "role") {
        this.$emit(
          "role",
          this.$refs.treeBox.getCheckedAndIndeterminateNodes()
        );
      }
    },
    
  },
  computed:{
    // getsearchBox(){
    //  return searchBox=false
    // }
  },
};
</script>
<style lang="less" scoped>
.names{
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
