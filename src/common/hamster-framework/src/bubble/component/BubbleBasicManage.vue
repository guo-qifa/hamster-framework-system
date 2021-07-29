<template>
  <div class="basic-manage-box" v-loading="delLoading">
    <el-card class="box-card">
      <div slot="header" class="clearfix overflow-h">
        <span class="title">{{ title }}</span>
        <el-button
          class="pull-right"
          style="margin-left: 10px"
          type="primary"
          size="mini"
          @click="exportData"
          v-if="exportButton"
        >
          <svg
            class="icon"
            aria-hidden="true"
            style="font-size: 11px; position: relative; top: -2px"
          >
            <use :xlink:href="'#icontubiao105'"></use>
          </svg>
          导出
        </el-button>
        <el-upload
          class="pull-right"
          v-if="importButton && importUploadUrl"
          :headers="importHeaders"
          style="margin-left: 10px"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-error="importError"
          :on-success="importSuccess"
          :action="importUploadUrl"
        >
          <el-button
            :loading="uploadLoading"
            type="primary"
            size="mini"
            @click="importData"
          >
            <svg
              class="icon"
              aria-hidden="true"
              style="font-size: 11px; position: relative; top: -2px"
            >
              <use :xlink:href="'#icondaoru'"></use>
            </svg>
            导入
          </el-button>
        </el-upload>
        <el-button
          class="pull-right"
          :loading="uploadLoading"
          v-if="customImportButton"
          type="primary"
          size="mini"
          @click="customImportData"
        >
          <svg
            class="icon"
            aria-hidden="true"
            style="font-size: 11px; position: relative; top: -2px"
          >
            <use :xlink:href="'#icondaoru'"></use>
          </svg>
          导入
        </el-button>
        <el-button
          v-show="allCheckBtnVisible"
          v-for="item in allcheckButton"
          style="margin-right: 10px"
          :key="item.text"
          class="pull-right"
          :type="item.type ? item.type : 'primary'"
          size="mini"
          :icon="item.icon"
          @click="item.onclick"
        >
          {{ item.text }}</el-button
        >
        <el-button
          class="pull-right"
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="add"
          v-if="!noinsert && form"
          >新增{{ formTitle }}</el-button
        >
        <el-button
          class="pull-right"
          type="primary"
          size="mini"
          style="margin-right: 10px"
          icon="el-icon-video-play"
          @click="run"
          v-if="noRun && form"
          >批量立即运行
        </el-button>
        <el-button
          class="pull-right"
          type="primary"
          size="mini"
          icon="el-icon-data-analysis"
          @click="resume"
          v-if="noResume && form"
          >批量恢复
        </el-button>
        <el-button
          class="pull-right"
          type="primary"
          size="mini"
          icon="el-icon-video-pause"
          @click="pause"
          v-if="noPause && form"
          >批量暂停
        </el-button>
      </div>
      <BubbleList
        @refreshTable="refreshTable"
        @selectChange="tableSelectChange"
        :dataKey="dataKey"
        :selectMode="selectMode"
        :afterLoad="afterLoad"
        :noScroll="noTableScroll"
        :remotedict="remotedict"
        ref="list"
        :rowBtn="rowButton"
        :search="filter"
	:showPage="showPage"
        :dialogFilterCode="dialogFilterCode"
        :type="type"
        :rurl="type + '.page'"
        :defaultFilter="defaultFilter"
        :updatepar="updatepar"
        :btnWidth="btnWidth"
        :loadOnSearch="loadOnSearch"
        :injectionSubmit="injectionSubmit"
        :tableTree="tableTree"
      />
    </el-card>
    <BubblePopForm
      :dialogFilterCode="dialogFilterCode"
       ref="form"
      :title="poptitle"
      :visible.sync="visible"
      :formConfig="form"
      :formData="editdata"
      :type="type"
      :width="formWidth"
      :labelWidth="labelWidth"
      v-if="form"
      :primaryKey="primaryKey"
      :submit="submit"
      :afterSubmit="afterSubmit"
      :beforeSubmit="beforeSubmit"
    />
  </div>
</template>

<script>
export default {
  name: "BubbleBasicManage",
  props: {
    tableTree: { type: Boolean },
    form: { type: Array },
    allcheckButton: { type: Array },
    noedit: { type: Boolean },
    noinsert: { type: Boolean },
    nodelete: { type: Boolean },
    injectionSubmit: { type: Function },
    selectChange: { type: Function },
    afterSubmit: { type: Function },
    afterLoad: { type: Function },
    afterDelete: { type: Function },
    beforeSubmit: { type: Function },
    noTableScroll: { type: Boolean },
    filter: { type: Array, default: () => [] },
    dialogFilterCode: { type: String, default: () => "" },
    title: { type: String, required: true },
    formTitle: { type: String, required: false },
    rowbtn: { type: Array },
    defaultFilter: { type: Array },
    updatepar: { type: Object },
    importHeaders: { type: Object },
    primaryKey: { type: String, required: true },
    type: { type: String, required: true },
    labelWidth: { type: String, default: "100px" },
    btnWidth: { type: Number },
    formWidth: { type: String, default: "800px" },
    selectMode: { type: String },
    dataKey: { type: String },
    loadOnSearch: { type: Boolean },
    exportButton: { type: Boolean, default: false },
    showPage: { type: Boolean, default: true },
    importButton: { type: Boolean, default: false },
    customImportButton: { type: Boolean, default: false },
    importUploadUrl: { type: String },

    noRun: { type: Boolean },
    noResume: { type: Boolean },
    noPause: { type: Boolean },
    remotedict: { type: String },
  },
  created() {
    console.log(this.remotedict);

    console.log(this.noRun);
    console.log(this.noResume);
    console.log(this.noPause);
    console.log(this.noinsert);
  },

  data() {
    return {
      extendOption: {
        ex: this.formTitle,
        type: this.type,
      },
      //批量处理按钮
      allCheckBtnVisible: false,
      poptitle: "",
      editdata: null,
      visible: false,
      popType: "add",
      delLoading: false,
      uploadLoading: false,
    };
  },
  computed: {
    rowButton() {
      var rs = [];
      if (!this.noedit && this.form) {
        rs.push({ text: "编辑", onclick: this.edit });
      }
      if (!this.nodelete) {
        rs.push({ text: "删除", loadingOnClick: true, onclick: this.del });
      }

      return this.rowbtn ? rs.concat(this.rowbtn) : rs;
    },
  },
  methods: {
    refreshTable() {
      this.$emit("refreshTable");
    },
    beforeUpload(item) {
      this.uploadLoading = true;
    },
    importSuccess(item) {
      this.$emit("import", item.response.record, () => {
        this.uploadLoading = false;
        this.reload();
      });
    },
    importError(item) {
      this.$alert(item);
      this.uploadLoading = false;
    },
    updateTableData(v, cond) {
      this.$refs.list.updateTableData(v, cond);
    },
    tableSelectChange(v) {
      if (v && v.length) {
        this.allCheckBtnVisible = true;
      } else {
        this.allCheckBtnVisible = false;
      }
      this.$emit("selectChange", v);
    },
    exportData() {
      if (this._events.export) {
        this.$emit("export");
        return;
      }
    },
    customImportData() {
      if (this._events.customImport) {
        this.$emit("customImport");
        return;
      }
    },
    importData() {
      if (this._events.import) {
        this.$emit("import");
        return;
      }
    },
    getFilterData() {
      return this.$refs.list.getFilterData();
    },
    back(v) {
      this.$router.back(-1);
    },
    edit(v) {
      this.poptitle = this.poptitlekey
        ? v[this.poptitlekey]
        : "编辑" + this.extendOption.ex;
      this.editdata = [];
      this.editdata = v;
      this.visible = true;
      this.popType = "edit";
    },
    del(data, callback) {
      var _this = this;
      this.$confirm("确认删除该" + _this.extendOption.ex + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.delLoading = true; 
          var p = data[_this.primaryKey];
          if (
            _this.$bubble.globeConfig &&
            _this.$bubble.globeConfig.BubbleBasicManage &&
            _this.$bubble.globeConfig.BubbleBasicManage.deleteParame
          ) {
            p = _this.$bubble.globeConfig.BubbleBasicManage.deleteParame(
              Object.assign({}, data, _this.type),
              _this.primaryKey
            );
          }
 
          _this.$bubble
            .request(_this.type + ".delete", p)
            .then((v) => {
              _this.$refs.list.reload();
              _this.afterDelete && _this.afterDelete(data);
              callback();
            })
            .catch((v) => {
              _this.$alert("删除失败 [" + v + "]");
              callback(false);
            })
            .finally((v) => {
              _this.delLoading = false;
              callback(false);
            });
        })
        .catch((v) => {
          callback();
          this.delLoading = false;
        });
    },
    reload() {
      this.$refs.list.reload();
    },
    loading(v) {
      this.delLoading = !!v;
    },
    add() {
      this.poptitle = this.poptitlekey
        ? v[this.poptitlekey]
        : "新增" + this.extendOption.ex;
      this.visible = true;
      this.editdata = this.updatepar ? this.updatepar : null;
      this.popType = "add";
    },
    run() {
      this.$emit("run");
    },
    resume() {
      this.$emit("resume");
    },
    pause() {
      this.$emit("pause");
    },
    submit(v, callback) {
      var promise = null;
      if (this.popType == "add") {
        promise = this.$bubble.request(this.type + ".insert", v);
      } else {
        promise = this.$bubble.request(this.type + ".update", v);
      }
      promise
        .then((v) => {
          callback(v);
          this.$refs.list.reload();
          this.editdata = null;
        })
        .catch((v) => {
          this.$alert(
            (this.popType == "add" ? "新增失败" : "编辑失败") + " [" + v + "]"
          );
          callback(false);
        });
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 22px;
  font-weight: 500;
  color: #343a40;
  min-height: 30px;
}
</style>