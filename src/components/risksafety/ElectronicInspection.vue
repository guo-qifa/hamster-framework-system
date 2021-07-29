<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-04-23 09:31:18
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-06-29 23:19:11
-->
<template>
  <div>
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
          ref="table"
          title="电子巡视"
          type="electronicInspection"
          formTitle="电子巡视"
          :form="form"
          :filter="filter"
          primaryKey="id"
          :defaultFilter="defaultFilter"
          :injectionSubmit="injectionSubmit"
          :beforeSubmit="beforeSubmit"
          :noinsert="!rightControl.allowAdd"
          :noedit="!rightControl.allowEdit"
          :nodelete="!rightControl.allowDelete"
          :customImportButton="rightControl.allowImport"
          :exportButton="rightControl.allowExport"
          @customImport="customImportData"
          @export="exportData"
          :rowbtn="rowbtn"
        />
      </el-col>
    </el-row>
    <!-- 第一个弹窗 -->
    <el-dialog
      title="巡检"
      :visible.sync="dialogVisible"
      modal
      close-on-click-modal
      show-close
      width="50%"
      lock-scroll
    >
      <div class="line"></div>
      <div class="addComInfo">
        <div>
          <i-form
            :label-width="100"
            style="width: 100%"
            ref="company"
            :rules="rules"
          >
            <Row>
              <i-col span="8">
                <Form-item label="巡检名称">
                  <i-input
                    size="small"
                    v-model="formObj.patName"
                    placeholder="巡检名称"
                  ></i-input>
                </Form-item>
              </i-col>
              <i-col span="8">
                <Form-item label="计划巡检时间">
                  <Date-picker
                    type="datetime"
                    size="small"
                    v-model="formObj.patTime"
                    placeholder=""
                    style="width: 200px"
                  ></Date-picker>
                </Form-item>
              </i-col>
              <i-col span="8">
                <Form-item label="状 态">
                  <Select v-model="formObj.patState" size="small">
                    <Option
                      v-for="item in stateList"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}</Option
                    >
                  </Select>
                </Form-item>
              </i-col>
            </Row>
            <Row>
              <i-col span="8">
                <Form-item label="巡检人">
                  <i-input
                    size="small"
                    v-model="formObj.patPerson"
                    placeholder="巡检人"
                  ></i-input>
                </Form-item>
              </i-col>
              <i-col span="8">
                <Form-item label="实际巡检时间">
                  <Date-picker
                    type="datetime"
                    size="small"
                    v-model="formObj.actualTime"
                    placeholder="请输入实际巡检时间"
                    style="width: 200px"
                  ></Date-picker>
                </Form-item>
              </i-col>
            </Row>
          </i-form>
        </div>
      </div>
      <!-- 手风琴  -->
      <div class="accordion">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item
            :title="getTitle(item)"
            :name="index"
            v-for="(item, index) of accordionData"
            :key="index"
          >
            <el-table :data="item.children" style="width: 100%" align="center">
              <el-table-column label="危害因素名称" width="180">
                <template v-slot="v">
                  {{ (v.row.hazardName && v.row.hazardName) || "/" }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="180">
                <template v-slot="v">
                  <!-- 00：正常，01：异常，02：未巡检 -->
                  {{
                    (v.row.status == "00" ? "未巡检" : "已巡检") +
                    (v.row.result == "00" ? "(正常)" : "(异常)")
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template v-slot="v">
                  <el-tag
                    class="tag"
                    :type="v.row.status == '00' ? '' : 'success'"
                    effect="dark"
                    @click="handleDetailsClick(v.row)"
                  >
                    {{ v.row.status == "00" ? "巡检" : "查看" }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
    <!-- 第二个弹窗 -->
    <popup ref="popup" :showSubmit="showSubmit" @reload="reload"/>
  </div>
</template>
<script>
import popup from "@/components/popup/ElectronicInspectionCpn/popup";
import { getToken, initRightControl, getToday, getQueryVariable } from "@/utils";
export default {
  components: {
    popup,
  },
  inheritAttrs: true,
  name: "ElectronicInspection",
  inheritAttrs: false,
  data() {
    var auth = this.$bubble.pageLoadArguments;
    var userType = localStorage.getItem("userType")
    return {
      rightControl: initRightControl(auth.auth),
      userType,
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
      dialogVisible: false,
      dialogVisible1: false,
      rules: {},
      popFilter: [],
      formObj: {},
      fromTwo: {},
      form: [
        {
          type: "input",
          text: "巡检名称",
          valid: { required: true },
          name: "patName",
        },
        {
          type: "tableSelect",
          text: "巡检人",
          name: "patPersonId",
          selectMode: "multiple",
          valid: { required: true },
          tableSelectConfig: "personnel",
          defaultSelected: (v) => {
            console.log(v);
            return;
          },
        },
        {
          type: "date",
          text: "巡检时间",
          name: "patTime",
          valid: { required: true },
          format: "yyyy-MM-dd 00:00:00",
        },
        {
          type: "tableSelect",
          text: "危害因素列表",
          name: "hazardRiskPojoList",
          selectMode: "multiple",
          valid: { required: true },
          tableSelectConfig: "hazardRiskPojoList",
        },
      ],
      filter: [
        { key: "patPerson", text: "巡检人" },
        { key: "patState", text: "巡检状态", type: "select", dictionary: "patState", default: ''},
        { key: "patTime", text: "计划巡检时间", type: "datetime", default: '' },
      ],
      showSubmit: true,
      rowbtn: [
        {
          text: "查看详情",
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          },
          onclick: (e) => {
            this.showSubmit = false;
            this.showDetails(e);
          },
        },
        {
          text: "巡检",
          visible: ({ patState: v }) => {
            return v == "01" && this.rightControl.allowInspect;
          },
          onclick: (e) => {
            this.showSubmit = true;
            this.showDetails(e);
          },
        },
        {
          text: "继续巡检",
          visible: ({ patState: v }) => {
            return v == "02" && this.rightControl.allowInspect;
          },
          onclick: (e) => {
            this.showSubmit = true;
            this.showDetails(e);
          },
        },
        {
          text: "催办",
          visible: v => {
            return v.patState == "04" && userType == 2 && v.urgent != 1;
          },
          onclick: (e) => {
            this.urge(e);
          },
        },
      ],
      stateList: [
        {
          label: "待巡检",
          value: "01",
        },
        {
          label: "巡检中",
          value: "02",
        },
        {
          label: "已完成",
          value: "03",
        },
        {
          label: "已延期",
          value: "04",
        },
      ],
      activeNames: ["1"],
      accordionData: [], //  手风琴展示的数据
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    /**
     * @name: 处理之前的回调
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-28 09:44:06
     * @LastEditTime: Do not Edit
     */
    beforeSubmit(p, fn) {},
    /**
     * @name: 监听表格事件里的详情按钮点击事件
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-26 15:54:56
     * @LastEditTime: Do not Edit
     */
    handleDetailsClick(info) {
      const { id } = info;
      this.$bubble.request("polling.details", { id }).then((v) => {
        if (v.code == 0) {
          console.log(v.record, "v.record")
          let fromTwo = Object.assign({}, v.record);
          let pop = this.$refs.popup;
          pop.show(fromTwo);
        }
      });
    },
    /**
     * @name: 监听手风琴变化事件
     * @Author: liuYaoYu
     * @param {*} e
     * @return {*}
     * @Date: 2021-04-26 15:42:45
     * @LastEditTime: Do not Edit
     */
    handleChange(e) {
      console.log(e);
    },
    /**
     * @name:format
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-27 15:17:52
     * @LastEditTime: Do not Edit
     */
    formatData(e) {
      this.dialogVisible = true;
      this.formObj.patName = e.patName;
      this.formObj.patTime = e.patTime;
      this.formObj.patState = e.patState;
      this.formObj.patPerson = e.patPerson + "";
      this.formObj.actualTime = e.actualTime;
      this.formObj.realityTime = e.realityTime;
    },
    /**
     * @name: 点击之后请求数据
     * @Author: liuYaoYu
     * @param {*} e
     * @return {*}
     * @Date: 2021-04-26 14:39:48
     * @LastEditTime: Do not Edit
     */
    showDetails(e) {
      const { id } = e; // 获取id
      this.currentId = id;
      let that = this;
      this.$bubble.request("polling.search", { id: id }).then((v) => {
        if (v.code == 0) {
          this.formatData.call(this, e);
          const { record } = v;
          this.accordionData = record.riskData;
        } else {
          that.$message.error("请求失败");
        }
      });
    },
    reload() {
      this.$bubble.request("polling.search", { id: this.currentId }).then((v) => {
        if (v.code == 0) {
          // this.formatData.call(this, e);
          const { record } = v;
          this.accordionData = record.riskData;
        } else {
          that.$message.error("请求失败");
        }
      });
      this.$refs.table.reload();
    },
    /**
     * @name:获取展示的数据
     * @Author: liuYaoYu
     * @param {*} item
     * @return {*}
     * @Date: 2021-04-26 16:14:16
     * @LastEditTime: Do not Edit
     */
    getTitle(item) {
      return (
        item.riskName +
        "   " +
        ((item.status && (item.status == "00" ? "未巡检" : "已巡检")) || "/")
      );
    },

    injectionSubmit(u, n, s, p) {
      console.log(u, n, s, p);
      let obj = {};
      p.forEach((v) => {
        if (v.field == "patTime") {
          let start = '';
          let end = '';
          if(typeof(v.value) == 'string') {
            start = v.value.split(",")[0];
            end = v.value.split(",")[1];
          }
          if(v.value instanceof Array && v.value.length == 2) {
            start = v.value[0];
            end = v.value[1];
          }
          let beginTime = this.$time(start).format("yyyy-MM-DD HH:mm:ss");
          let endTime = this.$time(end).format("yyyy-MM-DD HH:mm:ss");
          obj.beginTime = beginTime;
          obj.endTime = endTime;
        } else {
          obj[v.field] = v.value;
        }
      });
      return new Promise((resolve, reject) => {
        this.$bubble.request("electronicInspection.page", obj).then((v) => {
          resolve({
            data: {
              records: v.record.records,
              total: v.record.total,
            },
          });
        });
      });
    },
    urge(v) {
      this.$bubble.request("electronicInspection.urgent", { id: v.id }).then((rs) => {
        if (rs.code == 0) {
          this.$message.success('催办成功!');
          this.$refs.table.reload();
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
    customImportData() { console.log("导入") },
    exportData() { console.log("导出") },
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }
    if (getQueryVariable("today")) {
      this.filter[2]["default"] = getToday(1);
    }
    this.filter[1]["default"] = getQueryVariable("patState")
  },
};
</script>

<style scoped lang="less">
.accordion {
  padding: 0px 16px;
  padding-left: 24px;
  margin-top: 20px;
  box-sizing: border-box;
}
.addComInfo {
  height: 110px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  position: relative;
  .saveBtn {
    position: absolute;
    background: #339961;
    right: 25px;
    top: -46px;
    width: 50px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
  }
  > div {
    display: flex;
    &:nth-child(1) {
      flex: 1;
    }
    &:nth-child(2) {
      flex: 1;
    }
  }
}
.item {
  text-indent: -9999px;
}
/deep/ .el-dialog {
  overflow: auto;
  height: 80%;
}
.tag:hover {
  cursor: pointer;
}
/deep/ .cell {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/ .el-button + .el-button {
  margin-left: 0 !important;
}
</style>