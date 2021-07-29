<template>
  <div style="overflow: hidden" class="list-component-box" v-loading="loading">
    <!-- 表格搜索 -->
    <div class="clearfix list-component-search" v-if="search && search.length">
      <el-form
        style="padding: 0 10px"
        :inline="true"
        :model="searchForm"
        class="list-form-inline"
        @submit.native.prevent="getSearchData"
      >
        <el-form-item
          :label="item.text + ':'"
          :class="
            item.type
              ? item.type == 'checkbox'
                ? 'checkbox-form'
                : 'date-form'
              : ''
          "
          v-for="item in search"
          :key="item.key"
        >
          <el-input
            v-if="!item.type || item.type == 'input'"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请输入' + item.text
            "
          ></el-input>
          <el-input-number
            v-if="item.type == 'number'"
            controls-position="right"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请输入' + item.text
            "
          ></el-input-number>
          <el-input
            v-if="item.type == 'treeSelect'"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请输入' + item.text
            "
            @focus="item.visible = true"
          ></el-input>
          <el-input
            v-if="item.type == 'tableSelect'"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请输入' + item.text
            "
            @focus="item.visible = true"
          ></el-input>
          <el-select
            v-if="item.type == 'select' && item.option"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请选择' + item.text
            "
          >
            <el-option
              :label="item.text"
              :value="item.value"
              v-for="item in item.option"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.type == 'select' && item.remote"
            size="mini"
            v-model="searchForm[item.key]"
            :placeholder="
              item.placeholder ? item.placeholder : '请选择' + item.text
            "
          >
            <el-option
              :label="item.text"
              :value="item.value"
              v-for="item in remoteSelect[item.remote.url]"
              :key="item.value"
            >
            </el-option>
          </el-select>
          <el-checkbox-group
            v-model="searchForm[item.key]"
            v-if="item.type == 'checkbox' && item.option"
            @change="checkboxChange(item, $event)"
          >
            <el-checkbox
              :label="o.value"
              v-for="o in item.option"
              :disabled="o.value == item.disabled"
              :key="o.value"
            >
              {{ o.text }}</el-checkbox
            >
          </el-checkbox-group>
          <el-date-picker
            v-if="item.type == 'date'"
            size="mini"
            v-model="datesearch[item.key]"
            type="daterange"
            range-separator="至"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-date-picker
            v-if="item.type == 'datetime'"
            size="mini"
            v-model="datesearch[item.key]"
            type="datetimerange"
            range-separator="至"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" native-type="submit"
            >查询</el-button
          >
          <el-button size="mini" type="primary" @click="resetSearch"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <div class="line" style="margin: 0"></div>
      <BubbleTreeChoice
        v-for="item in treeList"
        :key="item.name"
        :visible.sync="item.visible"
        :config="item.choiceConfig"
        @onselect="treeDataChoice(item, $event)"
        :defaultFilter="item.defaultFilter"
        :primaryKey="item.primaryKey"
      />
      <BubbleObjectChoice
        v-for="item in tableList"
        :key="item.name"
        :visible.sync="item.visible"
        :config="item.choiceConfig"
        :selectMode="item.selectMode"
        @onselect="treeDataChoice(item, $event)"
        :defaultFilter="item.defaultFilter"
        :search="item.search"
      />
    </div>
    <!-- 表格主体 -->
    <el-table
      stripe
      ref="table"
      :data="tableData"
      default-expand-all
      style="width: 100%"
      :class="{ fulltable: noScroll }"
      :highlight-current-row="selectMode == 'single' && !!dataKey"
      v-if="loadOnSearch ? hasSearch : true"
      size="small"
      @row-click="onRowClick"
      @current-change="singleChange"
      @row-dblclick="dblclick"
      :row-key="dataKey"
      :tree-props="{ children: 'children' }"
    >
      <!-- 表格数据选择处理 -->

      <el-table-column
        width="40"
        v-if="selectMode == 'multiple' && dataKey"
        :renderHeader="renderHeader"
      >
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.tableChecked"
            @change="
              (e) => {
                multipleChange(scope.row, e);
              }
            "
          ></el-checkbox>
        </template>
      </el-table-column>

      <!-- <el-table-column type="index" width="50"> </el-table-column> -->
      <!-- 表格字段列处理 -->
      <el-table-column type="index"  label="序号" width="50"> </el-table-column>
      <el-table-column
        v-for="item in config"
        :label="item.text"
        :width="item.width"
        :key="item.key"
        :prop="item.key"
      >
        <template slot-scope="scope">
          <p v-if="item.type == 'index'">
            {{ scope.index }}
          </p>

          <p
            v-if="!item.render && !item.plugs"
            :title="
              item.ellipsis ? getRowVal(scope.row, item, true) : undefined
            "
            :class="
              item.color && item.color[getRowVal(scope.row, item)]
                ? item.color[getRowVal(scope.row, item)]
                : ''
            "
          >
            {{
              getRowVal(scope.row, item)
                ? getColText(getRowVal(scope.row, item), item)
                : item.emptyText || ""
            }}
          </p>
          <div
            style="padding-left: 10px"
            v-if="item.render && ready"
            v-html="item.render(scope.row, $bubble)"
          ></div>
          <component
            :is="plugs[item.plugs]"
            v-if="item.plugs && ready"
            :data="scope.row"
          />
        </template>
      </el-table-column>
      <!-- 表格操作列 -->
      <el-table-column
        :class-name="'operation-columns'"
        label="操作"
        :width="btnWidth"
        v-if="rowBtnAuth.length"
        :fixed="buttonFixed"
      >
        <template slot-scope="scope">
          <el-button
            :loading="scope.row.btnLoading && scope.row.btnLoading[idx]"
            @click.stop="rowbtnClick(scope.row, item, idx)"
            v-show="getBtnVisible(item, scope.row)"
            :type="item.type || 'text'"
            size="mini"
            v-for="(item, idx) in typeof rowBtnAuth === 'function'
              ? rowBtnAuth(scope.row)
              : rowBtnAuth"
            :key="item.text"
          >
            {{ item.text }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格分页 -->
    <el-pagination
      class="m m-r-none pull-right text-center"
      @size-change="handleSizeChange"
      v-if="(loadOnSearch ? hasSearch : true) && showPage"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 50, 100, 200]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :pager-count="5"
    >
    </el-pagination>
    <!-- 空提示 -->
    <p class="empty-text" v-if="loadOnSearch && !hasSearch">
      <span>请设置搜索条件</span>
    </p>
  </div>
</template>
<script>
import axios from "axios";
import plugs from "../plugs/index";

const http = axios.create({
  baseURL: "store.state.baseUrl ",
});

var list = [];

export default {
  name: "BubbleList",
  props: {
    /**
     * 表格选择模式
     * none | single | multiple
     * 不可选 | 单选 | 多选
     */
    selectMode: {
      type: String,
      required: false,
      default: "none",
    },
    /**
     * 单选多选所需字段,用于默认选择
     */
    dataKey: {
      type: String,
      required: false,
    },
    /**
     * 默认选中项
     * 根据dataKey传入对象|数组(根据selectMode决定)
     * 数组元素为单选对象{dataKey[0]:...., dataKey[1]:....}
     * 仅当dataKey中的所有字段均匹配时视为选中
     */
    defaultSelected: {
      type: [Array, String, Number, Boolean],
      required: false,
    },
    /**
     * 数据最后的操作按钮
     * 格式为[{text: String, onclick: Function}]
     * onclick参数为当前行数据
     */
    rowBtn: {
      type: Array,
      required: false,
    },
    //禁用左右滚动条,显示所有数据
    noScroll: {
      type: Boolean,
      required: false,
    },
    //展示分页器
    showPage: {
      type: Boolean,
      required: false,
    },
    /**
     * 表格字段配置默认通过type参数使用tableConfig.js的配置
     * 若存在tableConfig参数则
     * 该参数的配置优先级高于tableConfig.js中的配置进行mixin
     */
    tableConfig: {
      type: Function,
      required: false,
    },
    //表格请求地址,使用interface,js中的配置,如use.page
    rurl: {
      type: String,
      required: true,
    },
    /**
     * 表格数据请求的默认筛选参数Object
     * 优先级低于search表单筛选
     * 常用于经过路由参数或search中不展示的字段进行筛选
     */
    defaultFilter: {
      type: Array,
      required: false,
    },
    /**
     * 表格顶部筛选表单配置
     * 详细参见PopForm配置格式
     */
    search: {
      type: Array,
      required: false,
    },
    //表格列字段所对应tableConfig.js的配置名称
    type: {
      type: String,
      required: true,
    },
    //按钮操作列的宽度
    btnWidth: {
      type: Number,
      required: false,
      default: 150,
    },
    //使用该参数作为根节点请求树状数据,并由树状数据转为线性数据
    //业务相关-暂停使用
    treeTable: {
      type: String,
      required: false,
    },
    /**
     * 在请求数据之后,允许使用者对API返回数据根据实际情况进行修改后再渲染(不推荐使用)
     * 回调参数为请求后的数据
     */
    afterLoad: {
      type: Function,
      required: false,
    },
    /**
     * 使用者自行请求数据,返回Promise
     * 回调参数为请求的筛选对象
     */
    injectionSubmit: {
      type: Function,
      required: false,
    },
    //操作按钮列是否固定
    buttonFixed: {
      type: Boolean,
      required: false,
    },
    dialogFilterCode: { type: String, default: () => "" },
    //是否在进行至少一次筛选后才展示列表
    loadOnSearch: {
      type: Boolean,
      required: false,
    },
    remotedict: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      //树结构数据筛选选中对象
      rowbtnLoading: {},
      treeSelected: {},
      treeList: {},
      tableList: {},
      selectData: null, //多选单选数据
      allChecked: false, //全选状态
      isIndeterminate: false, //半全选状态
      remoteSelect: {},
      searchForm: {},
      tableData: [],
      searchFormType: {},
      searchValueType: {},
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      datesearch: {},
      ready: false,
      //配合loadOnSearch,true为已存在筛选条件
      hasSearch: false,
      plugs,
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
      // 表格列为remote字典值
      columnsRemoteData: {},
      rowInfo: {},
    };
  },
  computed: {
    config: function () {
      if (this.tableConfig) {
        var c = this.$bubble.TableConfig[this.type].slice();
        for (var i = 0; i < this.tableConfig.length; i++) {
          for (var n = 0; n < c.length; n++) {
            if (c[n].key == this.tableConfig[i].key) {
              c[n] = this.tableConfig[i];
            }
          }
        }
        c = c.filter((v) =>
          v.hasOwnProperty("visible")
            ? v.visible instanceof Function
              ? v.visible()
              : v.visible
            : true
        );
        return c;
      } else {
        var c = this.$bubble.TableConfig[this.type];
        c = c.filter((v) =>
          v.hasOwnProperty("visible")
            ? v.visible instanceof Function
              ? v.visible()
              : v.visible
            : true
        );
        return c;
      }
    },
    rowBtnAuth: function () {
      var rs = [];
      if (!this.rowBtn) {
        return rs;
      }

      return this.rowBtn;
    },
  },
  methods: {
    rowbtnClick(row, item, idx) {
      this.rowInfo = row;
      if (item.loadingOnClick) {
        if (!row.btnLoading) {
          this.$set(row, "btnLoading", { [idx]: true });
        } else {
          this.$set(row.btnLoading, idx, true);
        }
      }

      item.onclick(row, () => {
        this.$set(row.btnLoading, idx, false);
      });
    },
    getBtnVisible(v, d) {
      if (v.text == "编辑") {
        v = {
          ...v,
          visible: (d) => {
            return typeof d.noedit == "undefined" ? true : !d.noedit;
          },
        };
      }
      if (v.text == "删除") {
        v = {
          ...v,
          visible: (d) => {
            return typeof d.nodelete == "undefined" ? true : !d.nodelete;
          },
        };
      }
      return v.visible ? v.visible(Object.assign(d)) : true;
    },
    //因element表格头部插槽自身BUG(暂时未知),所以手动编译全选框规避数据绑定失效问题
    renderHeader(h, { column, $index }) {
      var _this = this;
      return h("el-checkbox", {
        on: {
          change: this.allCheckChange,
          input: (value) => {
            this.allChecked = value;
          },
        },
        props: {
          value: this.allChecked,
          indeterminate: this.isIndeterminate,
        },
      });
    },
    //表格多选事件
    multipleChange(v, t, notUpdate) {
      this.$set(v, "tableChecked", t);
      if (t) {
        if (!this.selectData) {
          this.selectData = [];
        }
        let notExist = true;
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i][this.dataKey] == v[this.dataKey]) {
            notExist = false;
            break;
          }
        }
        if (notExist) {
          this.selectData.push(v);
        }
      } else {
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i][this.dataKey] == v[this.dataKey]) {
            this.selectData.splice(i, 1);
            break;
          }
        }
      }
      this.initAllCheck();
      if (!notUpdate) {
        this.$emit("selectChange", JSON.parse(JSON.stringify(this.selectData)));
      }
    },
    //自行修改数据
    updateTableData(v, cond) {
      if (cond) {
        for (let i = 0; i < this.tableData.length; i++) {
          var check = true;
          for (let tmp in cond) {
            if (this.tableData[i][tmp] != cond[tmp]) {
              check = false;
            }
          }
          if (check) {
            for (let tmp1 in v) {
              this.$set(this.tableData[i], tmp1, v[tmp1]);
            }
          }
        }
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          for (let tmp in v) {
            this.$set(this.tableData[i], tmp, v[tmp]);
          }
        }
      }
    },
    getFilterData() {
      var rs = {};
      for (var tmp in this.searchForm) {
        if (tmp.indexOf("_treeid") >= 0) {
          continue;
        }
        if (this.searchForm[tmp + "_treeid"]) {
          rs[tmp] = this.searchForm[tmp + "_treeid"];
          continue;
        }
        rs[tmp] = this.searchForm[tmp];
      }
      return Object.assign({}, rs);
    },
    //全选按钮处理
    initAllCheck() {
      let allcheck = true;
      let isIndeterminate = false;
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].tableChecked) {
          allcheck = false;
        } else {
          isIndeterminate = true;
        }
      }
      if (allcheck) {
        this.isIndeterminate = false;
        this.allChecked = true;
      } else {
        this.isIndeterminate = isIndeterminate;
        this.allChecked = false;
      }
    },
    //全选事件
    allCheckChange(v) {
      if (!this.selectData) {
        this.selectData = [];
      }
      this.allChecked;
      this.isIndeterminate = false;
      if (v) {
        //全选
        for (let i = 0; i < this.tableData.length; i++) {
          let exist = false;
          for (let n = 0; n < this.selectData.length; n++) {
            if (
              this.tableData[i][this.dataKey] ==
              this.selectData[n][this.dataKey]
            ) {
              exist = true;
              break;
            }
          }
          if (!exist) {
            this.selectData.push(this.tableData[i]);
            this.multipleChange(this.tableData[i], true, true);
          }
        }
      } else {
        //全不选
        for (let i = 0; i < this.tableData.length; i++) {
          for (let n = 0; n < this.selectData.length; n++) {
            if (
              this.tableData[i][this.dataKey] ==
              this.selectData[n][this.dataKey]
            ) {
              this.selectData.splice(n, 1);
              this.multipleChange(this.tableData[i], false, true);
              break;
            }
          }
        }
      }
      this.$emit("selectChange", JSON.parse(JSON.stringify(this.selectData)));
    },
    deleteSelect(v) {
      if (this.selectMode == "single") {
        this.$refs.table.setCurrentRow();
        this.selectData = null;
      } else {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i][this.dataKey] == v) {
            this.multipleChange(
              this.tableData[i],
              !this.tableData[i]["tableChecked"],
              true
            );
            return;
          }
        }

        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i][this.dataKey] == v) {
            this.selectData.splice(i, 1);
            return;
          }
        }
      }
    },
    //表格单选事件
    singleChange(v) {
      if (this.selectMode == "single") {
        this.selectData = v;
        this.$emit("selectChange", v);
      }
    },
    clearSelection() {
      this.isIndeterminate = false;
      this.$refs.table.clearSelection();
      this.$refs.table.setCurrentRow();
      this.selectData =
        this.selectMode == "single" || this.selectMode == "none" ? null : [];
    },
    initSelected() {
      if (!this.dataKey || this.selectMode == "none") {
        return;
      }
      if (this.defaultSelected) {
        if (this.selectMode == "single") {
          let exist = false;
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i][this.dataKey] == this.defaultSelected) {
              exist = true;
              this.selectData = this.tableData[i];
              this.$refs.table.setCurrentRow(this.tableData[i]);
              break;
            }
          }
          if (!exist) {
            this.selectData = { [this.dataKey]: this.defaultSelected };
          }
        } else {
          //多选如果当前页已存在数据,则完整存储数据
          let defaultSelected = JSON.parse(
            JSON.stringify(this.defaultSelected)
          );
          for (let i = 0; i < this.tableData.length; i++) {
            this.$set(this.tableData[i], "tableChecked", false);
            for (let n = 0; n < defaultSelected.length; n++) {
              if (this.tableData[i][this.dataKey] == defaultSelected[n]) {
                this.$set(this.tableData[i], "tableChecked", true);
                if (!this.selectData) {
                  this.selectData = [];
                }
                defaultSelected.splice(n, 1);
                // this.selectData[n] = this.tableData[i];
                this.multipleChange(this.tableData[i], true, true);
                break;
              }
            }
            if (this.selectData && this.selectData.length) {
              for (let n = 0; n < this.selectData.length; n++) {
                if (
                  this.tableData[i][this.dataKey] ==
                  this.selectData[n][this.dataKey]
                ) {
                  this.$set(this.tableData[i], "tableChecked", true);
                  this.multipleChange(this.tableData[i], true, true);
                  break;
                }
              }
            }
          }
          //多选如果存在默认选择无法匹配当前页的数据,则仅存储主键dataKey
          if (defaultSelected.length) {
            if (!this.selectData) {
              this.selectData = [];
            }
            for (let n = 0; n < defaultSelected.length; n++) {
              let notExist = true;
              for (let i = 0; i < this.selectData.length; i++) {
                if (this.selectData[i][this.dataKey] == defaultSelected[n]) {
                  notExist = false;
                  break;
                }
              }
              if (notExist) {
                this.selectData.push({ [this.dataKey]: defaultSelected[n] });
              }
            }
          }
        }
      }
    },
    //表格行点击事件
    onRowClick: function (v, e, c) {
      if (e && e.label && e.label !== "操作") {
        if (this.selectMode == "multiple") {
          this.multipleChange(v, !v["tableChecked"]);
          // this.$refs.table.toggleRowSelection(v, this.selectData && this.selectData.indexOf(v) < 0)
        }
      }
    },
    dblclick(v, e, c) {
      if (e && e.label && e.label !== "操作") {
        if (this.selectMode == "single") {
          this.selectData = v;
          this.$emit("selectChange", v, true);
        }
      }
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getData(val);
    },
    getTypeHtml(type, v, config) {
      if (type == "date") {
        return (isNaN(v) ? v : v > 0)
          ? this.$bubble.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(v))
          : config.emptyText || "-";
      }
      if (type == "onlydate") {
        return v
          ? this.$bubble.dateFormat("yyyy-MM-dd HH:mm:ss", new Date(v))
          : "-";
      }
      if (type == "whether") {
        return v == "1" ? "是" : "否";
      }
    },
    getSearchData(e) {
      e.preventDefault();
      this.getData();
    },
    tree2list(v, wrap) {
      var rs = wrap || [];
      if (!(v instanceof Array)) {
        v = [v];
      }
      for (var i = 0; i < v.length; i++) {
        rs.push(v[i]);
        if (v[i]._child) {
          this.tree2list(v[i]._child, rs);
        }
      }

      return rs;
    },
    treeDataSuccess(v) {
      this.ready = true;
      v = this.afterLoad ? this.afterLoad(v) : v;
      this.tableData = this.tree2list(v.data).map((v) => {
        if (this.selectMode == "multiple") {
          v.tableChecked = false;
        }
        return v;
      });
      this.total = this.tableData.length;
      this.loading = false;
      this.pageSize = this.tableData.length;
    },
    dataSuccess(v) {
      this.ready = true;
      v = this.afterLoad ? this.afterLoad(v) : v;
 
      this.tableData = v.data.records.map((v) => {
        if (this.selectMode == "multiple") {
          v.tableChecked = false;
        }
        return v;
      });
      this.total = v.data.total;
      this.loading = false;
      this.initSelected();
      if (!v.data.records.length && this.pageNum > 1) {
        this.pageNum = 1;
        this.getData();
      }
    },
    dataError(v) {
      this.loading = false;
    },
    /**
     * 跳转至最后一页,一般用于新增数据后使用
     */
    jumpToLastPage() {
      this.getData(Math.ceil(this.total / this.pageSize));
    },
    getData: function (page) {
      var p = [];
      if (Object.getOwnPropertyNames(this.searchForm).length > 1) {
        this.hasSearch = true;
        for (var tmp in this.searchForm) {
          //树结构临时缓存数据 忽略
          if (tmp.indexOf("_treeid") >= 0) {
            continue;
          }
          if (this.searchForm[tmp] === undefined) {
            continue;
          }
          //匹配逻辑处理
          let logic = this.searchFormType[tmp].logic;
          if (!logic) {
            logic = "like";
          }
          if (this.searchFormType[tmp].type == "select") {
            logic = "=";
          }
          /**
           * 时间类型处理
           * logic为date交由请求插件处理
           */
          if (
            (this.searchFormType[tmp].type == "date" ||
              this.searchFormType[tmp].type == "datetime") &&
            this.searchForm[tmp]
          ) {
            p.push({
              value: this.searchForm[tmp],
              field: tmp,
              logic: "date",
              valueType: this.searchValueType[tmp] || undefined,
            });
            continue;
          }
          /**
           * 树结构数据处理
           */
          if (
            (this.searchFormType[tmp].type == "treeSelect" ||
              this.searchFormType[tmp].type == "tableSelect") &&
            this.searchForm[tmp]
          ) {
            p.push({
              value: this.searchForm[tmp + "_treeid"],
              field: tmp,
              logic: "=",
              valueType: this.searchValueType[tmp] || undefined,
            });
            continue;
          }
          if (
            this.searchFormType[tmp].type == "select" &&
            this.searchForm[tmp] == "all"
          ) {
            continue;
          }
          p.push({
            value: this.searchForm[tmp],
            field: tmp,
            logic: logic,
            valueType: this.searchValueType[tmp] || undefined,
          });
        }
      } else {
        this.hasSearch = false;
      }
      if (this.loadOnSearch && !this.hasSearch) {
        return;
      }
      this.defaultFilter !== undefined && (p = p.concat(this.defaultFilter));
      // if (!this.rurl) {
      //     throw new Error("缺少url参数...");
      // }

      var _this = this;
      _this.loading = true;

      if (page) {
        this.pageNum = page;
      }

      if (!this.rurl) {
        this.loading = false;
        return;
      }
      this.$emit("reload");
      this.ready = false;
      //重置选择
      // this.selectData = [];
      this.$emit("selectChange", JSON.parse(JSON.stringify(this.selectData)));
      for (let i = 0; i < this.tableData.length; i++) {
        this.$set(this.tableData[i], "tableChecked", false);
      }
      this.isIndeterminate = false;

      if (this.treeTable) {
        this.$bubble
          .request(
            this.rurl,
            JSON.stringify([
              { field: "_id", logic: "=", value: this.treeTable },
            ])
          )
          .then(this.treeDataSuccess, this.dataError);
      } else {
        // var arg = [this.rurl, {
        //     "data": {
        //         "filter": p,
        //         "orders": []
        //     },
        //     "pageNum": this.pageNum,
        //     "pageSize": this.pageSize
        // }];
        if (this.injectionSubmit) {
          this.injectionSubmit(this.rurl, this.pageNum, this.pageSize, p).then(
            this.dataSuccess,
            this.dataError
          );
        } else {
     
          this.$bubble
            .requestTable(this.rurl, this.pageNum, this.pageSize, p)
            .then(this.dataSuccess, this.dataError);
        }
      }
    },
    getColorText(v, colors, d) {
      var color = colors[v];
      if (d) {
        for (var i = 0; i < d.length; i++) {
          if (v == d[i].value) {
            return "<p class='" + color + "'>" + d[i].name + "</p>";
          }
        }
      } else {
        return color
          ? "<p class='" + color + "'>" + d[i].name + "</p>"
          : d[i].name;
      }
    },
    getRowVal(v, i, f) { 
      var k = i.key;
      var rs = "";
      if (k.indexOf(".") >= 0) {
        var s = k.split(".");
        rs = v[s[0]]
          ? v[s[0]][s[1]] == 0
            ? v[s[0]][s[1]] + ""
            : v[s[0]][s[1]]
          : "";
      } else {
        rs = v[k] == 0 ? v[k] + "" : v[k];
      }

      return !f && i.ellipsis
        ? rs.length > i.ellipsis
          ? rs.substring(0, i.ellipsis) + "..."
          : rs
        : rs;
    },
    getColText(v, i) {
      var unit = i.unit || "";

      if (i.type) {
        return this.getTypeHtml(i.type, v, i) + unit;
      }

      if (i.dictionary) {
        return this.$bubble.Dictionary[i.dictionary][v];
      }

      //remote字典处理
      if (i.remote) {
        if (this.columnsRemoteData[i.key]) {
          return this.columnsRemoteData[i.key].get(v + "");
        }
      }

      return v + unit;
    },
    reload: function () {
      this.getData();
    },
    setLoading: function (v) {
      this.loading = !!v;
    },
    resetSearch() {
      this.searchForm = {};
      this.datesearch = {};
      this.getData();
    },
    checkboxChange(v, e) {
      if (v.noEmpty && e.length <= 1) {
        this.$set(v, "disabled", e[0]);
      } else {
        this.$delete(v, "disabled");
      }
    },
    initSearchFormType() {
      for (var i = 0; i < this.search.length; i++) {
        this.searchFormType[this.search[i].key] = this.search[i];
        this.searchValueType[this.search[i].key] = this.search[i].valueType;
        if (this.search[i].type == "select" && this.search[i].dictionary) {
          this.search[i].option = [];
          this.search[i].option.push({ text: "全部", value: "all" });
          for (var tmp in this.$bubble.Dictionary[this.search[i].dictionary]) {
            this.search[i].option.push({
              text: this.$bubble.Dictionary[this.search[i].dictionary][tmp],
              value: isNaN(tmp)
                ? tmp
                : this.$bubble.Dictionary[this.search[i].dictionary]
                    ._isNumberKey
                ? parseInt(tmp)
                : tmp,
            });
          }
        }
        if (this.search[i].type == "treeSelect") {
          this.treeList[this.search[i].key] = this.search[i];
          this.$set(this.search[i], "visible", false);
        }
        if (this.search[i].type == "tableSelect") {
          this.tableList[this.search[i].key] = this.search[i];
          this.$set(this.search[i], "visible", false);
        }
      }
    },
    getRemoteDict(v) {
      var _this = this;
      var promise = null;

      promise = this.$bubble.request("remoteDict.url", {
        dictType: v,
      });
      promise.then((res) => {
        this.$bubble.Dictionary[v] = res.record;
      });
    },
    initRemoteSelectData(v) {
      var _this = this;
      this.$set(this.remoteSelect, remote.url, [
        { text: "请选择" + text, value: undefined },
      ]);
      this.$bubble.request(remote.url, remote.parame).then((data) => {
        data = data.record ? data.record : data;
        _this.$set(
          _this.remoteSelect,
          remote.url,
          data.map((tmp) => {
            return { text: tmp[remote.text], value: tmp[remote.value] };
          })
        );
        _this.$set(_this.searchForm, [remote.key], data[0][remote.value]);
        _this.$nextTick(() => {
          _this.$delete(_this.searchForm, [remote.key]);
        });
      });
    },
    treeDataChoice(config, v) {
      this.$set(this.searchForm, config.key, v.text);
      this.$set(this.searchForm, config.key + "_treeid", v.value);
    },
  },
  created: function () {
    // 表格列中有remote字典值处理
    let _this = this;
    if (this.config instanceof Array) {
      this.config.map((v) => {
        if (v.remote) {
          this.$bubble.request(v.remote.url, v.remote.parame).then((data) => {
            data = data.record ? data.record : data;
            //创建Map对象
            let dataMap = new Map();
            data.map((tmp) => {
              dataMap.set(tmp[v.remote.value] + "", tmp[v.remote.text]);
            });
            _this.$set(_this.columnsRemoteData, v.key, dataMap);
          });
        }
      });
    }
    if (this.search) {
      for (var i = 0; i < this.search.length; i++) {
        if (this.search[i].default !== undefined) {
          this.$set(
            this.searchForm,
            this.search[i].key,
            this.search[i].default
          );
          if (
            this.search[i].noEmpty &&
            this.search[i].default instanceof Array &&
            this.search[i].default.length < 2
          ) {
            this.search[i].disabled = true;
          }
          // this.searchForm[this.search[i].key] = this.search[i].default;
          if (
            this.search[i].type == "date" ||
            this.search[i].type == "datetime"
          ) {
            this.$set(
              this.datesearch,
              this.search[i].key,
              this.search[i].default
            );
          }
        }
        if (this.search[i].type == "select" && this.search[i].remote) {
          this.initRemoteSelectData(this.search[i].remote);
        }
      }
      this.initSearchFormType();
    }
    !this.loadOnSearch && this.getData();
  },
  watch: {
    dialogFilterCode: {
      handler: function (n, o) {
        this.getData();
      },
      deep: true,
    },
    defaultFilter: {
      handler: function (n, o) {
        this.getData();
      },
      deep: true,
    },
    par: {
      handler: function (n, o) {
        this.getData();
      },
      deep: true,
    },
    tableData: {
      handler: function (n, o) {
        this.$emit("refreshTable");
      },
      deep: true,
    },
    datesearch: {
      handler: function (n, o) {
        for (var tmp in n) {
          this.searchForm[tmp] = !n[tmp]
            ? undefined
            : n[tmp]
                .map((v) => {
                  return new Date(v).toISOString();
                })
                .join(",");
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
.fulltable table {
  width: 100% !important;
  table-layout: auto;
}

.list-box .el-card__body {
  padding: 0px 10px 10px 10px;
}

.list-box table {
  border-collapse: collapse;
}

.list-box table img {
  max-width: 80px;
  max-height: 80px;
}

/* .list-box .el-input__icon {
        line-height: 30px;
    } */

.list-box .tag {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  display: block;
  float: left;
  margin-top: 4px;
  margin-right: 5px;
}

#house_table_tpl p,
.list-box .el-table .cell {
  text-align: center;
}

.list-box .warm-text {
  position: absolute;
  bottom: 5px;
  left: 10px;
  color: #bdbdbd;
  font-size: 12px;
}

.list-box .list-form-inline .el-form-item {
  margin-bottom: 0;
}

.list-box .list-form-inline .el-form-item__content {
  width: 180px;
}

.list-box .list-form-inline .el-form-item.date-form .el-form-item__content {
  width: auto;
}

.list-box .list-form-inline .el-form-item.checkbox-form .el-form-item__content {
  width: auto;
  border: 1px #ddd solid;
  padding: 0 10px;
  border-radius: 5px;
  height: 26px;
  line-height: 26px;
  margin-top: 6px;
}

.el-table__row td .cell p {
  text-align: left !important;
}

.list-component-search .el-form-item {
  margin-bottom: 5px;
}

.empty-text {
  padding: 10px 0;
  text-align: center;
  color: #606266;
  font-size: 14px;
  margin-top: 15px;
}

.empty-text span {
  border: 1px #ddd solid;
  border-radius: 5px;
  padding: 5px 10px;
}
</style>