<template>
  <el-dialog
    :close-on-click-modal="false"
    width="80%"
    :title="title"
    append-to-body
    :visible.sync="svisible"
    :before-close="close"
  >
    <div slot="title" class="clearfix">
      <span>{{ title || choiceConfig.title }}</span>
      <el-button
        class="object-choice-createbtn"
        type="text"
        @click="onCreate()"
        v-if="createForm"
        >{{ choiceConfig.createText }}
      </el-button>
    </div>
    <div style="overflow: hidden">
      <BubbleList
        class="object-choice-list"
        :dataKey="choiceConfig.valueKey"
        ref="table"
        :rurl="rurl || choiceConfig.url"
        :type="type || choiceConfig.type"
        :defaultFilter="defaultFilter || choiceConfig.defaultFilter"
        @selectChange="choice"
        :afterLoad="afterLoad"
        :search="search || choiceConfig.search"
        :treeTable="treeTable || choiceConfig.treeTable"
        :selectMode="selectMode || choiceConfig.selectMode"
        :radio="!choiceConfig.hideOnClick"
        :defaultSelected="tableDefaultSelect"
      />
      <div class="object-choice-select-list">
        <p class="title">已选数据</p>
        <el-table :data="currentSelect" style="width: 100%" size="small" border>
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
    <BubblePopForm
      :title="choiceConfig.createText"
      :visible.sync="createVisible"
      :formConfig="createForm"
      :submit="createSubmit"
      v-if="createForm"
    />
  </el-dialog>
</template>

<script>
export default {
  name: "objectChoice",
  props: {
    //弹窗标题
    title: {
      type: String,
      required: false,
    },
    //表格字段配置
    type: {
      type: String,
      required: false,
    },
    //新建表单配置,存在就显示新建目标表数据
    createForm: {
      type: Array,
      required: false,
    },
    //请求地址
    rurl: {
      type: String,
      required: false,
    },
    //树状结构的源数据
    treeTable: {
      type: String,
      required: false,
    },
    //choiceConfig配置
    config: {
      type: [String, Object],
      required: true,
    },
    //默认筛选参数
    defaultFilter: {
      type: [String, Object, Array],
      required: false,
    },
    //表格搜索配置
    search: {
      type: Array,
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
      svisible: false,
      loading: true,
      createVisible: false,
      selectData: null,
    };
  },
  computed: {
    choiceConfig() {
      if (typeof this.config === "string") {
        return this.$bubble.ChoiceConfig[this.config];
      } else {
        return this.config;
      }
    },
    tableDefaultSelect() {
      if (this.defaultSelected) {
        if (this.selectMode == "single") {
          return this.defaultSelected.value;
        } else {
          let l =
            this.defaultSelected instanceof Array
              ? this.defaultSelected
              : [this.defaultSelected];
          return l.map((v) => {
            return v.value;
          });
        }
      }
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
    deleteSelect(v) { 
      if (this.selectData instanceof Array) {
        for (let i = 0; i < this.selectData.length; i++) {
          const element = this.selectData[i];
          if (element.value == v.value) {
            this.$refs.table.deleteSelect(this.selectData[i].value);
            this.selectData.splice(i, 1);
            if (!this.selectData.length) {
              this.selectData = null;
            }
            break;
          }
        }
      } else {
        this.$refs.table.deleteSelect(this.selectData.value);
        this.selectData = null;
      }
    },
    afterLoad(v) {
      if (this.choiceConfig.fixed) {
        return this.choiceConfig.fixed(v);
      } else {
        return v;
      }
    },
    choice(v, dbclick) {
      if (v && v.length != undefined && v.length == 0) {
        return;
      }
      if (!v) {
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
            fullData: v,
          };
        }
      } else {
        var _this = this;
        this.selectData = v.map((v) => {
          let completeTextKey = this.choiceConfig.textKey.split(".");
          if (completeTextKey.length > 1) {
            if (v[completeTextKey[0]][completeTextKey[1]]) {
              return {
                text: v[completeTextKey[0]][completeTextKey[1]],
                value: v[_this.choiceConfig.valueKey],
              };
            }
          }
          if (v[this.choiceConfig.textKey]) {
            return {
              text: v[_this.choiceConfig.textKey],
              value: v[_this.choiceConfig.valueKey],
            };
          } else {
            for (let i = 0; i < _this.selectData.length; i++) {
              if (v[_this.choiceConfig.valueKey] == _this.selectData[i].value) {
                return _this.selectData[i];
              }
            }
          }
        });
      }
      if (dbclick) {
        this.submit();
      }
      // this.selectData = v instanceof Array ? v.map(v => { return { text: v[this.choiceConfig.textKey], value: v[this.choiceConfig.valueKey] } }) : { text: v[this.choiceConfig.textKey], value: v[this.choiceConfig.valueKey] };
      // this.$emit("onselect", v);
    },
    submit() {
      this.$emit(
        "onselect",
        this.selectData instanceof Array &&
          (!this.selectData || !this.selectData.length)
          ? null
          : this.selectData
      );
      this.close();
    },
    dblclick(v) {
      v;
    },
    close(e) {
      if (!e || e.target === e.currentTarget) {
        this.svisible = false;
        this.$refs.table.clearSelection();
        this.selectData = null;
      }
    },
    getRowVal(v, k) {
      if (k.indexOf(".") >= 0) {
        var s = k.split(".");
        return v[s[0]] ? v[s[0]][s[1]] : "";
      } else {
        return v[k];
      }
    },
    onCreate() {
      this.createVisible = true;
    },
    createSubmit(v, callback) {
      this.$bubble
        .request(
          this.choiceConfig.url.split(".")[0] + ".insert",
          this.$bubble.replaceBase64(v)
        )
        .then((v) => {
          this.$refs.table.jumpToLastPage();
          callback(v);
        })
        .catch((v) => {
          this.$alert("添加失败 [" + v + "]");
        });
    },
    onRowClick(v) {
      this.$emit("onselect", v);
    },
    initDefaultSelected(v) {
      try {
        this.selectData = JSON.parse(JSON.stringify(v));
      } catch (error) {
        this.selectData = null;
      }
    },
  },
  created() {
    this.$watch("defaultSelected", this.initDefaultSelected);
    this.initDefaultSelected(this.defaultSelected);
    this.$watch(
      "visible",
      function (n, o) {
        this["svisible"] = !!n;
        if (n) {
          this.$refs.table && this.$refs.table.initSelected();
          this.initDefaultSelected(this.defaultSelected);
        }
        this.$watch("svisible", (n, o) => {
          this.$emit("update:visible", !!n);
        });
      }.bind(this)
    );
  },
};
</script>

<style lang="scss" scoped>
.wrap-card {
  position: absolute;
  top: 15%;
  left: 10%;
  width: 80%;
}

td {
  cursor: pointer;
}

.object-choice-list {
  width: 70%;
  float: left;
}

.object-choice-select-list {
  width: 30%;
  float: left;
  padding: 0 30px;
  box-sizing: border-box;

  .title {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
  }
}

.el-dialog__headerbtn {
  top: 28px;
}

.object-choice-createbtn {
  float: right;
  margin-right: 30px;
  padding: 0;
}
</style>