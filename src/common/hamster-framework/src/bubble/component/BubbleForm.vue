<template>
  <div class="bubble-form-box">
    <!-- JSON快速编辑 -->
    <div
      class="exportwrap"
      :class="exporterror ? 'error' : ''"
      v-if="exportshow"
    >
      <div class="exportbox" :style="{ width: width ? width : '600px' }">
        <div class="export-header">导入导出</div>
        <div class="export-editbox">
          <div class="line"></div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 10 }"
            v-model="exportjson"
          ></el-input>
          <div class="line"></div>
          <div class="export-btnbox" style="overflow: hidden">
            <el-button
              class="pull-right"
              style="margin-left: 10px"
              size="medium"
              type="primary"
              @click="exportConfirm()"
              >提交
            </el-button>
            <el-button
              class="pull-right"
              size="medium"
              type="default"
              @click="exportClose()"
              >取消
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="line" v-if="steps.length > 1"></div>
    <!-- 步骤条,仅当存在多步时显示 -->
    <el-steps
      :active="stepActive"
      simple
      finish-status="success"
      v-if="steps.length > 1"
    >
      <el-step
        :title="item.text"
        v-for="(item, idx) in steps"
        style="cursor: pointer"
        ref="stepitem"
        @click="
          stepActive = idx;
          plugsRender();
        "
        :key="item.text"
      ></el-step>
    </el-steps>
    <div class="line"></div>
    <!-- 表单生成 -->
    <el-form
      :ref="'ruleForm' + idx"
      :model="data"
      v-show="idx == stepActive"
      :label-width="labelWidth ? labelWidth : '90px'"
      label-position="left"
      v-for="(step, idx) in steps"
      :key="step.text"
    >
      <div v-for="item in step.forms" :key="item.name">
        <el-form-item
          :label="item.type == 'day' ? item.text + '(天)' : item.text"
          :rules="item.validField"
          :prop="item.name"
          v-if="
            item.type != 'hidden' &&
            item.type != 'plugs' &&
            itemVisible[item.name] &&
            (item.formObjVisible ? item.formObjVisible(data, item) : true)
          "
          v-show="!hiddenList[item.name]"
        >
          <!-- 日期选择 -->
          <el-date-picker
            :disabled="item.disabled"
            v-model="data[item.name]"
            type="date"
            placeholder="选择日期"
            v-if="item.type == 'date'"
            format="yyyy - MM - dd"
            :value-format="item.format ? item.format : 'timestamp'"
          >
          </el-date-picker>
          <!-- 日期区间选择 -->
          <el-date-picker
            :disabled="item.disabled"
            v-model="dateRangeTmpData[item.name]"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            v-if="item.type == 'dateRange'"
            :value-format="item.format"
            @change="rangeChange($event, item)"
          >
          </el-date-picker>
          <!-- 单选 -->
          <template v-if="item.type == 'radio'">
            <el-radio
              :disabled="item.disabled"
              v-model="data[item.name]"
              :label="op.value"
              v-for="op in item.option
                ? item.option
                : dictionaryOption[item.name]"
              :key="op.value"
            >
              {{ op.name || op.text }}
            </el-radio>
          </template>
          <!-- 单选 -->
          <template v-if="item.type == 'radio' && item.remote">
            <el-radio-group
              :disabled="item.disabled"
              v-model="data[item.name]"
              :label="op.value"
              v-for="op in item.option
                ? item.option
                : dictionaryOption[item.name]"
              :key="op.value"
            >
              <el-option
                v-for="v in remoteRadio[item.remote.url]"
                :key="item.remote.keyValue ? v[item.remote.keyValue] : v.value"
                :label="v.text"
                :value="v.value"
              ></el-option>
            </el-radio-group>
          </template>
          <!-- 多选 -->
          <template v-if="item.type == 'checkbox'">
            <el-checkbox
              :disabled="item.disabled"
              v-model="data[item.name]"
              :label="op.value"
              v-for="op in item.option
                ? item.option
                : dictionaryOption[item.name]"
              :key="op.value"
            >
              {{ op.name || op.text }}
            </el-checkbox>
          </template>
          <!-- 树表关联数据选择 -->
          <BubbleTreeListChoiceInput
            ref="treeList"
            v-if="item.type == 'treeListSelect'"
            :tableConfig="item.tableSelectConfig"
            :treeConfig="item.treeSelectConfig"
            :selectMode="item.selectMode"
            :disabled="item.disabled"
            :search="item.search"
            :defaultSelected="item.defaultSelect"
            v-model="data[item.name]"
            @change="
              (v, all) => {
                typeChoice(v, all, item);
              }
            "
            :defaultFilter="item.defaultFilterValue"
            :linkedKey="item.linkedKey"
          />
          <!-- 表格数据选择 -->
          <BubbleObjectChoiceInput
            ref="object"
            v-if="item.type == 'tableSelect'"
            :config="item.tableSelectConfig"
            :selectMode="item.selectMode"
            :disabled="item.disabled"
            :search="item.search"
            :defaultSelected="item.defaultSelect"
            v-model="data[item.name]"
            @change="
              (v, all) => {
                typeChoice(v, all, item);
              }
            "
            :defaultFilter="item.defaultFilterValue"
            :createForm="item.createForm"
          />
          <!-- 树状数据选择 -->
          <BubbleTreeChoiceInput
            ref="tree"
            v-if="item.type == 'treeSelect'"
            :config="item.treeSelectConfig"
            :selectMode="item.selectMode"
            :disabled="item.disabled"
            v-model="data[item.name]"
            :defaultSelected="item.defaultSelect"
            @labelName="
              (v) => {
                labelName(v, item);
              }
            "
            @change="
              (v, all) => {
                typeChoice(v, all, item);
              }
            "
            :childrenKey="item.childrenKey"
            :primaryKey="item.primaryKey"
            :defaultFilter="item.defaultFilterValue"
          />
          <!-- 文本域 -->
          <el-input
            type="textarea"
            :autosize="{ minRows: item.minRows || 2 }"
            v-if="item.type == 'textarea'"
            v-model="data[item.name]"
            :disabled="item.disabled"
            :placeholder="item.placeholder || '请输入' + item.text"
          ></el-input>
          <!-- 输入框 -->
          <el-input
            size="medium"
            v-model="data[item.name]"
            v-if="item.type == 'input'"
            :class="!!item.tableSelect || !!item.treeSelect ? 'und' : ''"
            clearable
            :disabled="!!item.tableSelect || !!item.treeSelect || item.disabled"
            :placeholder="item.placeholder || '请输入' + item.text"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              v-if="item.tableSelect || item.treeSelect"
              @click="showChoice(item)"
            ></el-button>
            <el-button slot="append" v-if="item.append">{{
              item.append
            }}</el-button>
          </el-input>
          <!-- 密码框 -->
          <el-input
            size="medium"
            v-model="data[item.name]"
            v-if="item.type == 'password'"
            clearable
            show-password
            :disabled="item.disabled"
            :placeholder="item.placeholder || '请输入' + item.text"
          >
          </el-input>
          <!-- 日期天数输入 -->
          <el-input-number
            size="medium"
            v-model="data[item.name]"
            :min="item.min"
            :max="item.max"
            v-if="item.type == 'day'"
            :disabled="!!item.tableSelect || !!item.treeSelect"
            :placeholder="item.placeholder || '请输入' + item.text"
          >
          </el-input-number>
          <!-- 金额输入 -->
          <el-input-number
            size="medium"
            :precision="item.precision"
            v-model="data[item.name]"
            :min="item.min"
            :max="item.max"
            v-if="item.type == 'price'"
            :disabled="!!item.tableSelect || !!item.treeSelect"
            :placeholder="item.placeholder || '请输入' + item.text"
          >
          </el-input-number>
          <!-- 数字输入 -->
          <el-input-number
            size="medium"
            :precision="item.precision"
            v-model="data[item.name]"
            :min="item.min"
            :max="item.max"
            v-if="item.type == 'number'"
            :disabled="!!item.tableSelect || !!item.treeSelect"
            :placeholder="item.placeholder || '请输入' + item.text"
          >
          </el-input-number>
          <!-- 上传 -->
          <el-input
            size="medium"
            v-model="data[item.name]"
            v-if="item.type == 'upload'"
            :disabled="true"
          >
            <el-upload
              slot="append"
              :headers="item.headers"
              :show-file-list="false"
              class="upload-demo"
              :action="uploadPath"
              :on-success="uploadFileSuccess(item)"
              :on-error="uploadError(item.name)"
              :before-upload="uploadProgress(item.name)"
            >
              <el-button
                :icon="
                  !uploadLoading[item.name]
                    ? 'el-icon-upload2'
                    : 'el-icon-loading'
                "
              ></el-button>
            </el-upload>
          </el-input>
          <!-- 图片上传 -->
          <el-upload
            :file-list="initImageList[item.name]"
            :limit="item.multiple ? item.limit || 5 : 1"
            :multiple="item.multiple"
            style="float: left"
            v-if="item.type == 'image'"
            :headers="item.headers"
            :action="uploadPath"
            list-type="picture-card"
            :on-remove="uploadRemove(item)"
            :on-success="uploadSuccess(item, 'image')"
            :on-error="uploadError(item.name)"
            :before-upload="uploadProgress(item.name)"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 图片上传清除当前图片 -->
          <!-- <el-button style="float: left;margin-left: 10px;" v-if="item.type == 'image' && data[item.name]" type="danger" icon="el-icon-delete" size="mini" @click="data[item.name] = '';">
                        删除图片
                    </el-button> -->
          <!-- 下拉框 -->
          <el-select
            :disabled="item.disabled"
            size="medium"
            @change="selectChanged(data[item.name], item)"
            v-model="data[item.name]"
            :placeholder="'请选择' + item.text"
            v-if="item.type == 'select' && !item.remote"
          >
            <el-option
              v-for="v in item.option
                ? item.option
                : dictionaryOption[item.name]"
              :key="v.value"
              :label="v.text"
              :value="v.value"
            ></el-option>
          </el-select>
          <el-select
            :disabled="item.disabled"
            size="medium"
            @change="selectChanged(data[item.name], item)"
            v-model="data[item.name]"
            :placeholder="'请选择' + item.text"
            v-if="item.type == 'select' && item.remote"
          >
            <el-option
              v-for="v in remoteSelect[item.remote.url]"
              :key="item.remote.keyValue ? v[item.remote.keyValue] : v.value"
              :label="v.text"
              :value="v.value"
            ></el-option>
          </el-select>

          <el-switch
            v-if="item.type == 'switch'"
            v-model="data[item.name]"
            active-color="#13ce66"
            @change="rangeSwitch($event, item)"
            inactive-color="#ccc"
          >
          </el-switch>
        </el-form-item>
        <!-- 插件 -->
        <component
          :formData="formData || item.formData"
          :title="title"
          ref="plugs"
          v-if="item.type == 'plugs'"
          v-model="data[item.name]"
          :is="plugs[item.plugs]"
          :config="item"
          v-show="!hiddenList[item.name]"
          :fulldata="data"
        />
      </div>
    </el-form>
    <div class="line"></div>
    <!-- 按钮操作区 -->
    <div class="overflow-h">
      <el-button
        v-show="(steps.length > 1 && !nosubmit) || !nosubmit"
        class="pull-right"
        style="margin-left: 10px"
        size="medium"
        type="primary"
        :loading="submitloading"
        @click="validSubmit()"
      >
        {{
          steps.length > 1 && steps.length - 1 > stepActive ? "下一步" : "提交"
        }}
      </el-button>
      <el-button
        class="pull-right"
        size="medium"
        type="default"
        v-show="stepActive > 0"
        @click="
          stepActive--;
          plugsRender();
        "
        >上一步
      </el-button>
      <el-button
        v-if="close"
        class="pull-right"
        size="medium"
        type="default"
        @click="close"
        >{{ closeText || "取消" }}</el-button
      >
    </div>
    <!-- <el-button class="pull-right" size="medium" type="default" @click="exportData()">导入导出
            </el-button> -->
  </div>
</template>

<script>
import plugs from "../plugs/index";
import floatObj from "../lib/floatObj";

export default {
  name: "BubbleForm",
  props: ["formConfig", "formData", "labelWidth"],
  props: {
    dialogFilterCode: {
      type: String,
    },
    formConfig: {
      type: Array,
      required: true,
    },
    //隐藏提交按钮
    nosubmit: {
      type: Boolean,
      required: false,
    },
    //取消按钮文案
    closeText: {
      type: String,
      required: false,
    },
    //编辑传入源数据
    formData: {
      type: [Object, Array],
      required: false,
    },
    //文本标签宽度
    labelWidth: {
      type: [String, Number],
      required: false,
    },
    //是否存在关闭按钮
    close: {
      type: Function,
      required: false,
    },
    afterSubmit: {
      type: Function,
      required: false,
    },
    beforeSubmit: {
      type: Function,
      required: false,
    },
    title: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      plugs,
      uploadPath: this.$bubble.getUploadHost(),
      uploadLoading: {},
      //表单配置hiddenOn触发列表
      hiddenList: {},
      //用于hiddenOn监听器去重优化,防止多次监听
      hiddenWatched: {},
      //表单对象
      data: {},
      //日期区间选择临时变量
      dateRangeTmpData: {},
      //日期区间选择配置
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      status: false,
      submitloading: false,
      exportjson: "",
      exportshow: false,
      exporterror: false,
      objectChoiceVisible: {},
      objectChoiceList: {},
      objectChoiceData: {},
      treeChoiceList: {},
      dictionaryOption: {},
      formdataMap: {}, //formdata快速读取表
      steps: [],
      remoteSelect: {},
      remoteRadio: {},
      stepActive: 0,
      initImageList: [],
      initEventReady: false, //step点击事件仅注册一次
    };
  },
  computed: {
    itemVisible() {
      var rs = {};
      var stepLoop = (v) => {
        for (var i = 0; i < v.length; i++) {
          if (v[i].type == "step") {
            stepLoop(v[i].forms);
            continue;
          }
          if (v[i].visible) {
            if (v[i].visible == "add" && !this.formData) {
              rs[v[i].name] = true;
            }
            if (v[i].visible == "edit" && this.formData) {
              rs[v[i].name] = true;
            }
          } else {
            rs[v[i].name] = true;
          }
        }
      };

      stepLoop(this.formConfig);

      return rs;
    },
  },
  methods: {
    selectChanged(item, obj) {
      if (obj.onclick) {
        obj.onclick(item, () => {
          // this.$set(row.btnLoading, idx, false);
        });
      }
    },
    uploadProgress(name) {
      return () => {
        this.$set(this.uploadLoading, name, true);
      };
    },
    uploadSuccess(item, image) {
      return (response, file, fileList) => {
        this.data[item.name].push({
          url: response.record || item.onSuccess(response),
        });
        this.uploadLoading[item.name] = false;
      };
    },
    uploadFileSuccess(item) {
      return (response, file, fileList) => {
        this.data[item.name] = response.record || item.onSuccess(response);
        this.uploadLoading[item.name] = false;
      };
    },
    uploadError(name) {
      return (err, file, fileList) => {
        this.uploadLoading[name] = false;
        this.$alert("文件上传失败,请重试");
      };
    },
    uploadRemove(item) {
      var _this = this;
      return (file, filelist) => {
        _this.data[item.name] = filelist.map((v) => v.url);
      };
    },
    rangeSwitch(v, c) {
      var names = c.name;
      this.data[names] = v;
    },
    /**
     * 时间区间选择变更事件
     */
    rangeChange(v, c) {
      var names = c.name.split(",");
      this.data[names[0]] = v[0];
      this.data[names[1]] = v[1];
      this.data[c.name] = v[0];
    },
    initRemoteRadioData(v) { 
      if (this.remoteRadio[v.url]) {
        return;
      }
      var _this = this;
      this.$set(this.remoteRadio, v.url, [
        { text: "加载中", value: undefined },
      ]); 
      console.log(this.remoteRadio); 
      this.$bubble.request(v.url, v.parame).then((data) => {
        data = data.record ? data.record : data; 
        _this.$set(
          _this.remoteRadio,
          v.url,
          data.map((tmp) => {
            return {
              text: tmp[v.text],
              value:
                v.valueType == "string"
                  ? tmp[v.value].toString()
                  : tmp[v.value],
            };
          })
        ); 
      });
    },
    initRemoteSelectData(v) { 
      if (this.remoteSelect[v.url]) {
        return;
      }
      var _this = this;
      this.$set(this.remoteSelect, v.url, [
        { text: "加载中", value: undefined },
      ]);
      this.$bubble.request(v.url, v.parame).then((data) => {
        data = data.record ? data.record : data;
        _this.$set(
          _this.remoteSelect,
          v.url,
          data.map((tmp) => {
            return {
              text: tmp[v.text],
              value:
                v.valueType == "string"
                  ? tmp[v.value].toString()
                  : tmp[v.value],
            };
          })
        );
      });
    },
    getDateByFormatter(v, f) {
      return this.$bubble.dateFormat(f, v);
    },
    getDefaultValue(v) {
      var rs = "";
      if (v.default !== undefined) {
        rs =
          typeof v.default === "function"
            ? v.default(
                this.formData ? Object.assign({}, this.formData) : undefined
              )
            : v.default;
      }
      if (this.formData) {
        rs = this.formData[v.souceName ? v.souceName : v.name];
        if (v.type == "day") {
          if (v.unit && v.unit == "ms") {
            rs = parseInt(rs / (24 * 60 * 60 * 1000));
          } else {
            rs = parseInt(rs / (24 * 60 * 60));
          }
        }
        if (v.type == "dateRange") {
          var names = v.name.split(",");
          this.$set(this.dateRangeTmpData, v.name, [
            this.formData[names[0]] ? new Date(this.formData[names[0]]) : null,
            this.formData[names[1]] ? new Date(this.formData[names[1]]) : null,
          ]);
          this.$set(
            this.data,
            names[0],
            this.formData[names[0]]
              ? this.$bubble.dateFormat(
                  v.format,
                  new Date(this.formData[names[0]])
                )
              : null
          );
          this.$set(
            this.data,
            names[1],
            this.formData[names[1]]
              ? this.$bubble.dateFormat(
                  v.format,
                  new Date(this.formData[names[1]])
                )
              : null
          );
          rs = this.formData[names[0]];
        }
        if (v.type == "date") {
          rs = new Date(rs);
        }
        if (v.type == "image") {
          if (
            typeof rs == "string" &&
            rs.indexOf("[") > -1 &&
            rs.indexOf("]") > -1
          ) {
            rs = JSON.parse(rs);
          } else {
            rs = rs && rs.split ? rs.split(",") : rs instanceof Array ? rs : [];
          }
          if (rs.length > 0) {
            this.initImageList[v.name] = rs.map((url) => {
              url = typeof url == "string" ? url : url.url;
              return {
                url:
                  v.urlPrefix && url.indexOf("http") < 0
                    ? v.urlPrefix + url
                    : url,
              };
            });
          } else {
            this.initImageList[v.name] = [];
          }
        }
        if (v.type == "price" && !isNaN(this.formData[v.name])) {
          rs = floatObj.divide(
            this.formData[v.name],
            Math.pow(10, v.precision || 2)
          );
        }
      } else if (!this.formData && v.type == "image") {
        this.initImageList[v.name] = [];
      }
      return rs;
    },
    setValidField(v) {
      var rs = { trigger: "blur", message: "请输入正确的" + v.text };
      v = v.valid;
      if (!isNaN(v.min)) {
        rs.min = v.min;
        rs.message = "请输入大于" + v.min + "的数字";
      }
      if (!isNaN(v.max)) {
        rs.max = v.max;
        rs.message = "请输入小于" + v.max + "的数字";
      }
      if (!isNaN(v.min) && !isNaN(v.max)) {
        rs.message = "请输入大于" + v.min + "小于" + v.max + "的数字";
      }
      if (v.required) {
        rs.required = v.required;
      }
      if (v.pattern) {
        rs.pattern = v.pattern;
      }
      if (v.pattern && this.$bubble.Regx[v.pattern]) {
        rs.pattern = this.$bubble.Regx[v.pattern];
      }
      if (v.validator) {
        rs.validator = (rule, value, callback) => {
          var result =
            typeof v.validator === "function" &&
            v.validator.call(null, value, Object.assign({}, this.data));
          if (result) {
            rule.message = result;
          }
          callback(!result ? undefined : new Error(result));
        };
      }

      return rs;
    },
    formWatch(v, data) {
      var _this = this;
      var cb = (name, n, o) => {
        if (v.link) {
          let k = v.link.name;
          let formTableSelect = v.link.formTableSelect;
          let tmp =
            v.link.value &&
            v.link.value(
              formTableSelect
                ? this.objectChoiceData[formTableSelect.name]
                  ? this.objectChoiceData[formTableSelect.name][
                      formTableSelect.key
                    ]
                  : undefined
                : n,
              Object.assign({}, data)
            );
          if (tmp) {
            data[v.name] = tmp;
          }
        }
        if (v.hiddenOn) {
          _this.hiddenWatched[name].forEach((v) => {
            if (v.defaultFilter) {
              v.defaultFilterValue =
                typeof v.defaultFilter === "function"
                  ? v.defaultFilter(Object.assign({}, this.data))
                  : typeof v.defaultFilter === "object" &&
                    v.defaultFilter.callback
                  ? v.defaultFilter.callback(Object.assign({}, this.data))
                  : v.defaultFilter;
            }
            for (var tmp in v.hiddenOn) {
              if (_this.data[tmp] == v.hiddenOn[tmp]) {
                _this.hiddenList[v.name] = true;
                v.valid && _this.$delete(v, "validField");
                return;
              }
            }
            if (_this.hiddenList[v.name] === true) {
              _this.hiddenList[v.name] = false;
              v.valid && _this.$set(v, "validField", _this.setValidField(v));
            }
          });
        }
      };
      var names = [];
      if (v.link) {
        names = v.link.name.split(",");
      }
      if (v.hiddenOn) {
        names = Object.getOwnPropertyNames(v.hiddenOn);
      }

      if (typeof v.defaultFilter === "object" && v.defaultFilter.updateOn) {
        for (let i = 0; i < v.defaultFilter.updateOn.length; i++) {
          names.indexOf(v.defaultFilter.updateOn[i]) <= 0 &&
            names.push(v.defaultFilter.updateOn[i]);
        }
      }

      names.forEach((s) => {
        if (s == "__ob__") {
          return;
        }

        if (!this.hiddenWatched[s]) {
          this.hiddenWatched[s] = [v];
        } else {
          this.hiddenWatched[s].push(v);
          return;
        }

        this.$watch(
          "data." + s,
          (n, o) => {
            cb(s, n, o);
          },
          { deep: true }
        );
        cb(s, this.data[s]);
      });
    },
    goNextStep() {
      if (stepActive < this.steps.length) {
        this.stepActive++;
        this.plugsRender();
      }
    },
    goPrevStep() {
      if (stepActive > 0) {
        this.stepActive--;
        this.plugsRender();
      }
    },
    getCurrentStep() {
      return this.stepActive;
    },
    getStepSize() {
      return this.steps.length;
    },

    initField(v, data) {
      //校验字段填充
      v.valid && this.$set(v, "validField", this.setValidField(v));
      if (v.visible == "add") {
        return;
      }
      //设置默认值
      this.$set(data, v.name, this.getDefaultValue(v));
      if (
        v.type == "tableSelect" ||
        v.type == "treeSelect" ||
        v.type == "treeListSelect"
      ) {
        // if (this.formData && this.formData[v.name] != undefined) {
        if (this.formData) {
          v.defaultSelect =
            typeof v.defaultSelected === "function"
              ? v.defaultSelected(this.formData)
              : null;
          v.defaultFilterValue =
            typeof v.defaultFilter === "function"
              ? v.defaultFilter(this.formData)
              : typeof v.defaultFilter === "object" && v.defaultFilter.callback
              ? v.defaultFilter.callback(this.formData)
              : v.defaultFilter;
        } else {
          v.defaultSelect = null;
          v.defaultFilterValue =
            typeof v.defaultFilter === "function"
              ? v.defaultFilter(Object.assign({}, this.data))
              : typeof v.defaultFilter === "object" && v.defaultFilter.callback
              ? v.defaultFilter.callback(Object.assign({}, this.data))
              : v.defaultFilter;
        }
      }
      if (v.type == "select" && v.remote) {
        this.initRemoteSelectData(v.remote);
      }
      if (v.type == "radio" && v.remote) {  
       
        this.initRemoteRadioData(v.remote); 
        setTimeout(() => { 
          console.log(this.remoteRadio); 
        }, 15000);
      }
      if (v.type && v.dictionary) {
        var d = this.$bubble.Dictionary[v.dictionary];
        this.$set(this.dictionaryOption, v.name, []);
        for (var tmp in d) {
          this.dictionaryOption[v.name].push({
            text: d[tmp],
            value: isNaN(tmp) ? tmp : d._isNumberKey ? parseFloat(tmp) : tmp,
          });
        }
      }
      if (v.link) {
        this.formWatch(v, data);
      }
      if (v.hiddenOn) {
        this.formWatch(v, data);
      }
    },
    exportData() {
      this.exportshow = true;
      this.exportjson = JSON.stringify(this.data, 4);
    },
    exportConfirm() {
      try {
        var json = JSON.parse(this.exportjson);
      } catch (error) {
        this.exporterror = true;
        return;
      }
      this.exporterror = false;
      this.data = json;
      this.exportshow = false;
    },
    exportClose() {
      this.exportshow = false;
    },
    isAllHidden(v) {
      for (var i = 0; i < v.length; i++) {
        if (v[i].type != "hidden") {
          return false;
        }
      }
      return true;
    },
    resetStep() {
      this.stepActive = 0;
    },
    initData() {
      this.steps = [];
      var stepidx = 0;
      var idx = 0;
      var cacheidx = 0;
      var tmp = null;
      var target = this.formConfig;
      this.hiddenWatched = [];
      while ((tmp = target[idx])) {
        if (tmp.type == "step" && target !== this.formConfig) {
          continue;
        }
        if (tmp.name) {
          this.formdataMap[tmp.name] = tmp;
        }
        if (tmp.type == "step") {
          if (
            idx > cacheidx &&
            !this.isAllHidden(this.formConfig.slice(cacheidx, idx))
          ) {
            this.steps[stepidx] = {
              type: "step",
              text: "步骤" + (this.steps.length + 1),
              forms: this.formConfig.slice(cacheidx, idx),
            };
            stepidx++;
          }
          this.steps[stepidx] = tmp;
          cacheidx = idx + 1;
          idx = 0;
          target = tmp.forms;
          continue;
        }
        this.initField(tmp, this.data);
        if (!target[++idx] && target !== this.formConfig) {
          target = this.formConfig;
          idx = cacheidx;
          stepidx++;
        }
      }
      if (
        idx > cacheidx &&
        !this.isAllHidden(this.formConfig.slice(cacheidx, idx))
      ) {
        this.steps.push({
          type: "step",
          text: "步骤" + (this.steps.length + 1),
          forms: this.formConfig.slice(cacheidx, idx),
        });
      }
    },

    typeChoice(item, v) {
      this.data[v.name] = item;
      if (v.objectChoiceInputChange) {
        v.objectChoiceInputChange(this.data, d);
      }
    },
    plugsRender() {
      if (this.$refs.plugs) {
        this.$nextTick(() => {
          for (var i = 0; i < this.$refs.plugs.length; i++) {
            this.$refs.plugs[i].render && this.$refs.plugs[i].render();
          }
        });
      }
    },
    validSubmit() {
      this.$refs["ruleForm" + this.stepActive][0].validate((valid) => {
        if (valid) {
          this.stepActive == this.steps.length - 1
            ? this.submit()
            : (this.plugsRender(), this.stepActive++);
        } else {
          this.$alert(
            "请输入正确内容后" +
              (this.stepActive == this.steps.length - 1 ? "提交" : "继续")
          );
          return false;
        }
      });
    },
    getChangedData(rs) {
      for (var tmp in rs) {
        let v = this.formdataMap[tmp];
        let d = v
          ? this.formData[
              v.souceName && !(v.tableSelect || v.treeSelect)
                ? v.souceName
                : v.name
            ]
          : this.formData[tmp];
        if (rs[tmp] === d || (v && v.readOnly)) {
          delete rs[tmp];
        }
      }
    },
    submit() { 
      if (this.dialogFilterCode.length > 0) {
        this.data = Object.assign({}, this.data, {
          dictType: this.dialogFilterCode,
        });
      }

      this.submitloading = true;
      var rs = {};

      for (var tmp in this.data) {
        if (tmp.indexOf(".") > 0) {
          tmp = tmp.split(".")[1];
        }
        let c = this.formdataMap[tmp];

        //dateRange字段拆分后可能存在无对应配置的情况,忽略
        if (!c) {
          continue;
        }

        //当前状态不显示的情况下,移除
        if (!this.itemVisible[tmp]) {
          continue;
        }

        // if (this.data[tmp] && (c.type == "treeSelect" || c.type == "tableSelect")) {
        //     if (this.data[tmp] instanceof Array) {
        //         rs[tmp] = this.data[tmp].map(v => v.value).join(",")
        //     } else {
        //         rs[tmp] = this.data[tmp].value
        //     }
        //     continue;
        // }

        if (c.type == "price") {
          rs[tmp] = Math.round(this.data[tmp] * Math.pow(10, c.precision || 2));
          continue;
        }

        if (c.type == "dateRange") {
          var names = c.name.split(",");
          rs[names[0]] = this.data[names[0]];
          rs[names[1]] = this.data[names[1]];
          delete this.data[c.name];
          continue;
        }

        if (c.type == "date") {
          rs[tmp] = this.data[tmp].valueOf();
        }

        //如果为null则未选中任何数据,置空该数据
        if (
          c.type == "tableSelect" ||
          c.type == "treeSelect" ||
          c.type == "treeListSelect"
        ) {
          if (this.data[tmp] === null) {
            rs[tmp] = "";
          }
        }

        if (!c) {
          rs[tmp] = this.data[tmp];
          continue;
        }
        !c.readOnly && (rs[tmp] = this.data[tmp]);
      }

      if (Object.getOwnPropertyNames(rs).length) {
        var _this = this;
        let cb = (v) => {
          rs = v || rs;

          this.$emit("submit", rs, (v) => {
            if (_this.afterSubmit) {
              _this.afterSubmit(v, Object.assign({}, this.formData || rs));
            }
            _this.submitloading = false;
            if (v !== false) {
              _this.$emit("submitOk");
              /**
               * 清除默认选择
               */
              for (let i = 0; i < this.formConfig.length; i++) {
                const element = this.formConfig[i];
                if (
                  element.type == "tableSelect" ||
                  element.type == "treeSelect" ||
                  element.type == "treeListSelect"
                ) {
                  this.$set(this.formConfig[i], "defaultSelect", null);
                }
              }
            }
          });
        };
        if (this.beforeSubmit) {
          this.beforeSubmit(Object.assign(rs), (v) => {
            // this.formData && this.getChangedData(v);
            cb(v);
          });
        } else {
          // this.formData && this.getChangedData(rs);
          cb(rs);
        }
      } else {
        this.submitloading = false;
        this.$emit("submitOk");
      }
    },
    resetFields() {
      for (var tmp in this.$refs) {
        this.$refs[tmp][0].resetFields && this.$refs[tmp][0].resetFields();
      }
      this.data = {};
      this.dateRangeTmpData = {};
      this.$refs.treeList &&
        this.$refs.treeList.forEach((v) => {
          v.reset();
        });
      this.$refs.object &&
        this.$refs.object.forEach((v) => {
          v.reset();
        });
      this.$refs.tree &&
        this.$refs.tree.forEach((v) => {
          v.reset();
        });
    },
    initEvent() {
      this.$nextTick(() => {
        if (this.$refs.stepitem && this.initEventReady == false) {
          this.initEventReady = true;
        } else {
          return;
        }
        for (let i = 0; i < this.$refs.stepitem.length; i++) {
          this.$refs.stepitem[i].$el.addEventListener("click", () => {
            this.stepActive = i;
            this.plugsRender();
          });
        }
      });
    },
  },
  created() {
    console.log(this.data);
     
      console.log(this.formData);

    this.initData();
    this.plugsRender();
    this.initEvent();
  },
};
</script>

<style scoped>
.el-input-number {
  width: 100%;
}

.el-select {
  width: 100%;
}

.exportwrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.28);
}

.exportbox {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 50%;
  background: #fff;
  margin-top: 15vh;
}

.exportbox .export-header {
  padding: 20px 20px 10px;
}

.exportbox .export-editbox {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  padding-top: 0;
}
</style>

<style>
.bubble-form-box .und input {
  background-color: #fff !important;
}

.bubble-form-box .el-date-editor {
  width: 100% !important;
}
</style>