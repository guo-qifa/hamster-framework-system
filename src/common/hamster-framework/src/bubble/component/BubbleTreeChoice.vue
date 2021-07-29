<template>
  <transition name="el-fade-in">
    <div class="object-choice-box" v-show="visible" @click="close($event)">
      <el-card class="wrap-card">
        <div slot="header" class="clearfix">
          <span>{{ title ? title : choiceConfig.title }}</span>
          <button
            type="button"
            aria-label="Close"
            style="float: right"
            class="el-dialog__headerbtn"
            @click="close()"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div style="overflow: hidden">
          <el-tree
            ref="tree"
            class="tree-choice-list"
            :props="defaultProps"
            v-loading="loading"
            :show-checkbox="selectMode == 'multiple'"
            :data="treeData"
            :node-key="primaryKey"
            default-expand-all
            @node-click="onRowClick"
            @check-change="checkChange"
            highlight-current
            :expand-on-click-node="false"
          >
            <!-- <span
              class="custom-tree-node custom-tree-node-content"
              slot-scope="{ data }"
            >
              {{ data[label] }}
            </span> -->
          </el-tree>
          <div class="tree-choice-select-list">
            <p class="title">已选数据</p>
            <el-table
              :data="currentSelect"
              style="width: 100%"
              size="small"
              border
            >
              <el-table-column
                prop="text"
                :label="choiceConfig.textName || '数据名'"
              >
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteSelect(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="overflow: hidden">
          <div class="line"></div>
          <el-button
            class="pull-right"
            style="margin-left: 10px"
            size="medium"
            type="primary"
            @click="submit()"
            >提交</el-button
          >
          <el-button
            class="pull-right"
            style="margin-left: 10px"
            size="medium"
            type="default"
            @click="close()"
            >关闭</el-button
          >
        </div>
      </el-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: "treeChoice",
  props: {
    //弹窗标题
    title: {
      type: String,
      required: false,
    },
    //请求地址
    rurl: {
      type: String,
      required: false,
    },
    //主键
    primaryKey: {
      type: String,
      required: true,
    },
    //choiceConfig配置
    config: {
      type: [String, Object],
      required: true,
    },
    //默认筛选参数
    defaultFilter: {
      type: [Array, Object],
      required: false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    selectMode: {
      type: String,
      required: false,
      default: "single",
    },
    //默认选中项
    defaultSelected: {
      type: [Array, Object],
      required: false,
    },
  },
  data() {
    return {
      singleSelectData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      label:
        typeof this.config === "string"
          ? this.$bubble.ChoiceConfig[this.config].textKey
          : this.config.textKey,
      svisible: false,
      loading: false,
      treeData: [
        {
          label: "一级 1",
          id: "1452",
          children: [
            {
              label: "二级 1-1",
              id: "192",
              children: [
                {
                  label: "三级 1-1-1",
                  id: "172",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          id: "162",
          children: [
            {
              label: "二级 2-1",
              id: "142",
              children: [
                {
                  label: "三级 2-1-1",
                  id: "122",
                },
              ],
            },
            {
              label: "二级 2-2",
              id: "121",
              children: [
                {
                  label: "三级 2-2-1",
                  id: "122",
                },
              ],
            },
          ],
        },
      ],
      selectData: null,
      //模拟双击
      dbclickTimeStamp: 0,
    };
  },
  computed: {
    choiceConfig() {
 
      return typeof this.config === "string"
        ? this.$bubble.ChoiceConfig[this.config]
        : this.config;
    },
    currentSelect() {
      if (!this.selectData) {
        return [];
      }
      if (this.selectData instanceof Array) {
        return this.selectData;
      }
      return [this.selectData];
    },
  },
  methods: {
    multipleHelp(v) {
      if (v[this.choiceConfig.textKey]) {
        return {
          text: v[this.choiceConfig.textKey],
          value: v[this.choiceConfig.valueKey],
        };
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          if (v[this.choiceConfig.valueKey] == this.selectData[i].value) {
            return this.selectData[i];
          }
        }
      }
    },
    onRowClick(v) {
      if (
        this.selectMode == "single" &&
        new Date().valueOf() - this.dbclickTimeStamp < 500 &&
        v[this.choiceConfig.valueKey] == this.selectData.value
      ) {
        this.submit();
        return;
      }
      this.dbclickTimeStamp = new Date().valueOf();
      if (this.selectMode == "single" && !v) {
        return;
      }
      if (this.selectMode == "single") {
        if (
          !this.selectData ||
          this.selectData.value != v[this.choiceConfig.valueKey]
        ) {
          this.selectData = {
            text: v[this.choiceConfig.textKey],
            value: v[this.choiceConfig.valueKey],
          };
          this.singleSelectData = this.selectData;
          this.svisible = true;
        }
      } else {
        let keys = this.$refs.tree.getCheckedKeys();
        if (keys.indexOf(v[this.primaryKey]) < 0) {
          this.$refs.tree.setCheckedKeys(keys.concat([v[this.primaryKey]]));
        } else {
          keys.splice(keys.indexOf(v[this.primaryKey]), 1);
          this.$refs.tree.setCheckedKeys(keys);
        }
      }
    },
    deleteSelect(v) {
      if (this.selectMode == "single") {
        this.$refs.tree.setCurrentKey();
        this.selectData = null;
      } else {
        let keys = this.$refs.tree.getCheckedKeys();
        if (keys.indexOf(v.value) < 0) {
          for (let i = 0; i < this.selectData.length; i++) {
            if (this.selectData[i].value == v.value) {
              this.selectData.splice(i, 1);
              if (!this.selectData.length) {
                this.selectData = null;
              }
              return;
            }
          }
        }
        keys.splice(keys.indexOf(v.value), 1);
        this.$refs.tree.setCheckedKeys(keys);
      }
    },
    checkChange(v) {
      if (
        this.$refs.tree.getCheckedKeys().indexOf(v[this.primaryKey]) < 0 &&
        this.selectData
      ) {
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].value == v[this.primaryKey]) {
            this.selectData.splice(i, 1);
            if (!this.selectData.length) {
              this.selectData = null;
            }
            return;
          }
        }
      } else {
        if (!this.selectData) {
          this.selectData = [];
        }
        this.selectData.push({
          text: v[this.choiceConfig.textKey],
          value: v[this.choiceConfig.valueKey],
        });
      }
    },
    submit() {
      console.log(this.selectData, "wwww");

      if (this.selectMode == "single") {
        console.log(this.singleSelectData);

        this.$emit("onselect", this.singleSelectData);
      } else {
        this.$emit(
          "onselect",
          arr instanceof Array && arr.length.length > 0 ? arr : null
        );
      }

      this.close();
    },
    close(e) {
      if (!e || e.target === e.currentTarget) {
        this.svisible = false;
        // this.$refs.tree.clearSelection();
        this.selectData = null;
      }
    },
    initTreeSouce(v, c) {
      var rs = [];
      for (var i = 0; i < v.length; i++) {
        rs.push(v[i]);
        if (
          v[i][this.choiceConfig.childrenKey] &&
          v[i][this.choiceConfig.childrenKey].length
        ) {
          rs[rs.length - 1].children = this.initTreeSouce(
            v[i][this.choiceConfig.childrenKey],
            true
          );
        }
      }
      return rs;
    },
    initData() {
      this.loading = true;

      this.$bubble
        .requestTree(
          this.rurl ? this.rurl : this.choiceConfig.url,
          this.choiceConfig.defaultFilter
        )
        .then((v) => {
          //this.defaultFilter
          if (v.errorcode) { 
            this.$alert("数据获取失败");
          } else {
            this.treeData = this.initTreeSouce(
              v.record instanceof Array ? v.record : [v.record]
            );
            console.log(this.treeData);

            this.initSelected();
            this.loading = false;
          }
        })
        .catch((v) => {});
    },
    initDefaultSelected(v) {
      try {
        this.selectData = JSON.parse(JSON.stringify(v));
      } catch (error) {
        this.selectData = null;
      }
    },
    initSelected() {
      if (this.treeData && this.treeData.length && this.defaultSelected) {
        if (this.selectMode == "single") {
          this.defaultSelected &&
            this.$refs.tree.setCurrentKey(this.defaultSelected.value);
        } else {
          this.$refs.tree.setCheckedKeys(
            this.defaultSelected.map((v) => v.value)
          );
        }
      }
    },
  },
  created() {
    this.$watch(
      "visible",
      function (n, o) {
        this["svisible"] = !!n;
        if (n) {
          this.initSelected();
          this.initDefaultSelected(this.defaultSelected);
        }
        this.$watch("svisible", (n, o) => {
          this.$emit("update:visible", !!n);
        });
      }.bind(this)
    );
    this.$watch("defaultSelected", this.initDefaultSelected);
    this.initDefaultSelected(this.defaultSelected);
    this.initData();
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.object-choice-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2080;
  overflow: auto;
  background: rgba(0, 0, 0, 0.3);
}

.object-choice-box .wrap-card {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 800px;
  margin-left: -400px;
}

.object-choice-box td {
  cursor: pointer;
}

.custom-tree-node {
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-node-content {
  float: left;
  display: block;
  width: 100px;
  height: 28px;
  line-height: 28px;
}

.tree-choice-list {
  width: 50%;
  float: left;
}

.tree-choice-select-list {
  width: 50%;
  float: left;
  padding: 0 30px;
  box-sizing: border-box;

  .title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
  }
}
</style>