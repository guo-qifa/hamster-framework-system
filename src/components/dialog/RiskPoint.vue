<template>
  <div>
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      width="80%"
      :visible.sync="DialogVisible"
    >
      <!-- 表单和地图  start  -->
      <risk :formData="rowData"/>
      <!-- 表单和地图  end  -->
      <div class="line"></div>
      <p slot="title">
        <span class="el-dialog__title">危害因素列表</span>
        <el-button style="margin-left: 30px" type="primary" size="mini" @click="showChoice">关联危害因素</el-button>
        <el-button style="margin-left: 30px" type="primary" size="mini" @click="showRecord1">关联危害因素操作记录</el-button>
        <el-button style="margin-left: 30px" type="primary" size="mini" @click="showRecord2">管控措施操作记录</el-button>
      </p>
      <BubbleList
        ref="list"
        :search="filter"
        type="dangerSourceDialog"
        rurl="empty"
        :injectionSubmit="injectionSubmit"
        :rowBtn="rowbtns"
      />
      <BubbleObjectChoice
        ref="BubbleObjectChoice"
        title="关联危害因素"
        type="dangerSource"
        rurl="dangerSource.page"
        :visible.sync="visible"
        config="dangerSource"
        @onselect="dataChoice"
        :search="filter"
        selectMode="multiple"
        :defaultSelected="input"
      />

      
      
    </el-dialog>
    <!-- 关联危害因素操作记录模态框 -->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        width="80%"
        :visible.sync="recordVisible1"
        title="危害因素操作记录"
      >
        <BubbleList
          ref="list1"
          type="dangerSourceRecordDialog"
          rurl="empty"
          :injectionSubmit="injectionDialogListSubmit1"
        />
      </el-dialog>
    <!-- 管控措施操作记录模态框 -->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        width="80%"
        :visible.sync="recordVisible2"
        title="管控措施操作记录"
      >
        <BubbleList
          ref="list2"
          type="dangerSourceRecordDialog"
          rurl="empty"
          :injectionSubmit="injectionDialogListSubmit2"
        />
      </el-dialog>
  </div>
</template>

<script>
import risk from "../../plugs/riskConfig/index";
export default {
  components: {
    risk
  },
  name: "RiskPoint",
  props: {
    hazardRiskId: {
      type: Number,
      required: true
    },
    rowData: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log(this.rowData)
  },
  data() {
    return {
      strDisable: false,
      recordVisible1: false,
      recordVisible2: false,
      rowbtns: [
        {
          text: "管控措施",
          onclick: (...arg) => {
            console.log(arg);
          },
          visible: ({ status: v }) => {
            if (v == 2) {
              console.log(this.strDisable, "strDisablestrDisable");
              this.strDisable = true;
              return true;
            }
          }
        },
        {
          text: "记录",
          onclick: (...arg) => {},
          visible: ({ status: v }) => {
            return !this.strDisable;
          }
        },
        {
          text: "巡检",
          onclick: (...arg) => {
            this.$refs.modal.show(arg);
          },
          visible: ({ status: v }) => {
            return this.strDisable;
          }
        },
        {
          text: "上报",
          onclick: (...arg) => {
            console.log(arg);
          },
          visible: ({ status: v }) => {
            return this.strDisable;
          }
        }
      ],
      DialogVisible: false,
      filter: [{ key: "name", text: "危害因素名称" }],
      defaultFilter: [
        { field: "hazardRiskId", logic: "=", value: this.hazardRiskId }
      ],
      visible: false,
      input: [],
      riskId: ""
    };
  },
  methods: {
    show() {
      this.DialogVisible = true;
    },
    showChoice() {
      this.visible = true;
    },
    showRecord1() {
      this.recordVisible1 = true;
    },
    showRecord2() {
      this.recordVisible2 = true;
    },
    dataChoice(v) {
      let o = {};
      o.id = this.riskId;
      o.hazardRiskPojoList = [];
      v.map(item => {
        o.hazardRiskPojoList.push({
          hazardId: item.value,
          riskId: this.riskId
        });
      });
      this.$bubble.request("riskPoint.cupdate", o).then(v => {
        if (v.code == 0) {
          this.visible = false;
          this.$refs.list.reload();
        }
      });
      // this.$alert("危害因素关联")
    },
    injectionSubmit(url, n, s, p) {
      var _this = this;
      return new Promise((resolve, reject) => {
        _this.$bubble
          .request("dangerSource.find", { riskId: this.hazardRiskId })
          .then(v => {
            _this.riskId = v.record[0] ? v.record[0].riskId : "";
            resolve({
              data: {
                records: v.record,
                total: v.record.length
              }
            });
          });
      });
    },
    injectionDialogListSubmit1() {
      var _this = this;
      return new Promise((resolve, reject) => {
        _this.$bubble
          .request("dangerSource.record", { businessId: Number(this.hazardRiskId), operateModule: 1 })
          .then(v => {
            resolve({
              data: {
                records: v.record,
                total: v.record.length
              }
            });
          });
      });
    },
    injectionDialogListSubmit2() {
      var _this = this;
      return new Promise((resolve, reject) => {
        _this.$bubble
          .request("dangerSource.record", { businessId: Number(this.hazardRiskId), operateModule: 2 })
          .then(v => {
            resolve({
              data: {
                records: v.record,
                total: v.record.length
              }
            });
          });
      });
    },
  }
};
</script>

<style >
</style>