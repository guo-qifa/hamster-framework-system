<template>
  <div class="treebox">
    <el-tree
      v-loading="loading"
      :data="data"
      :node-key="primaryKey"
      default-expand-all
      draggable
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span
          class="custom-tree-node-content"
          :style="{ color: data.color ? data.color : '' }"
          >{{ data[choiceConfig.textKey] }}</span
        >
        <span class="custom-tree-node-btn" v-if="!nobutton">
          <el-button type="text" size="mini" @click="() => append(data)">
            {{ "添加" + title }}
          </el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data)"
            v-if="node.level != 1"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <BubblePopForm
      :title="poptitle"
      :visible.sync="visible"
      :formConfig="form"
      :formData="editdata"
      :before-close="close"
      :submit="submit"
      :labelWidth="labelWidth"
    />
  </div>
</template>

<script>
export default {
  props: {
    //主键
    primaryKey: {
      type: String,
      required: true,
    },
    //所用配置类型
    type: {
      type: String,
      required: true,
    },
    labelWidth: {
      type: String,
      default: "100px",
    },
    //父ID键名
    fatherKey: {
      type: String,
      required: true,
    },
    beforeSubmit: {
      type: Function,
    },
    beforeEdit: {
      type: Function,
    },
    //子元素键名
    childrenKey: {
      type: String,
      required: true,
    },
    formConfig: {
      type: Array,
      required: false,
    },
    nobutton: {
      type: Boolean,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
  name: "BubbleRootTree",
  data() {
    return {
      data: [],
      poptitle: "",
      visible: false,
      loading: true,
      editdata: null,
      father: { type: "hidden", text: "父ID", name: this.fatherKey },
      root: "",
      form: [],
    };
  },
  computed: {
    choiceConfig() {
   
      return this.$bubble.ChoiceConfig[this.type];
    },
  },
  methods: {
    close(callback) {
      callback();
      this.root = false;
    },
    createRoot() {
      this.editdata = null;
      this.poptitle = "新增" + this.title;
      this.visible = true;
      this.root = true;
      this.$set(this.father, "default", "root");
    },
    append(data) {
      this.editdata = null;
      this.poptitle = "新增" + this.title;
      this.visible = true;
      this.father.default = data._id;
    },
    remove(data) {
      this.$confirm("确认删除该" + this.title + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$bubble.request(this.type + ".delete", data._id).then((v) => {
          if (v.errorcode) {
            this.$alert("删除失败");
          } else {
            this.initData();
          }
        });
      });
    },
    edit(v) {
      this.poptitle = "编辑" + this.title;
      this.editdata = this.beforeEdit
        ? this.beforeEdit(Object.assign({}, v))
        : v;
      this.visible = true;
    },
    afterSubmit(v) {
      if (this.root) {
        this.root = false;
        this.$bubble
          .request(
            this.type + ".update",
            this.data[0]._id,
            this.$bubble.replaceBase64({ [this.fatherKey]: v.record })
          )
          .then((v) => {
            if (v.errorcode) {
              this.$alert("添加失败");
            } else {
              this.initData();
            }
          });
      } else {
        this.initData();
        this.editdata = null;
      }
    },
    initFromdata() {
      this.form = [].concat(this.formConfig);
      for (var i = 0; i < this.form.length; i++) {
        if (this.form[i].name == this.fatherKey) {
          this.$set(this.form, i, this.father);
          return;
        }
      }
      this.form.push(this.father);
    },
    initTreeSouce(v, c) {
      c = c ? c : 0;
      var rs = [];
      for (var i = 0; i < v.length; i++) {
        rs.push(v[i]);
        rs[rs.length - 1][this.choiceConfig.textkey] =
          v[i][this.choiceConfig.textkey];
        v[i].color = c % 2 != 0 ? "#909399" : "";
        if (c == 0) {
          rs[rs.length - 1].root = true;
        }
        if (v[i][this.childrenKey] && v[i][this.childrenKey].length) {
          rs[rs.length - 1].children = this.initTreeSouce(
            v[i][this.childrenKey],
            c + 1
          );
        }
      }
      return rs;
    },
    initData() {
      this.loading = true;
      this.$bubble
        .request(this.type + ".find", this.fatherKey, "root")
        .then((v) => {
          this.$bubble
            .requestTree(this.type + ".tree", [
              { field: "_id", logic: "=", value: v.record._id },
            ])
            .then((v) => {
              if (v.errorcode) { 
                this.$alert("数据获取失败");
              } else {
                this.data = this.initTreeSouce([v.record]);
                this.loading = false;
                this.$emit("read", this.data);
              }
            });
        })
        .catch((v) => { 
          this.$alert("数据获取失败 [" + v + "]");
        });
    },
    submit(v, callback) {
      var cb = (v) => {
        var _this = this;
        var promise = null;
        if (!this.editdata) {
          promise = this.$bubble.request(
            this.type + ".insert",
            this.$bubble.replaceBase64(v)
          );
        } else {
          promise = this.$bubble.request(
            this.type + ".update",
            this.editdata._id,
            this.$bubble.replaceBase64(v)
          );
        }
        promise
          .then((v) => {
            if (_this.root) {
              _this.root = false;
              _this.$bubble
                .request(
                  _this.type + ".update",
                  _this.data[0]._id,
                  _this.$bubble.replaceBase64({ [_this.fatherKey]: v.record })
                )
                .then((v) => {
                  _this.initData();
                })
                .catch((v) => {
                  _this.$alert("新增失败 [" + v + "]");
                });
            } else {
              _this.initData();
              _this.editdata = null;
            }
            callback();
          })
          .catch((v) => {
            _this.$alert("新增失败 [" + v + "]");
            callback(false);
          });
      };
      typeof this.beforeSubmit === "function"
        ? this.beforeSubmit(v, cb)
        : cb(v);
    },
  },
  created() {
    this.initFromdata();
    this.initData();
  },
};
</script>

<style scoped>
.treebox {
  min-height: 300px;
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

.custom-tree-node-btn {
  margin-left: 50px;
}
</style>