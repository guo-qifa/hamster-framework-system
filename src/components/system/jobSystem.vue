<template>
  <div>
    <BubbleBasicManage
      ref="jobSystemBasicManage"
      title="定时任务"
      :form="form"
      form-title="定时任务"
      type="jobSystem"
      :defaultFilter="defaultFilter"
      :filter="filter"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :dataKey="'jobId'"
      primaryKey="jobId"
      :rowbtn="rowbtn"
      :btnWidth="230"
      :noinsert="!rightControl.allowAdd"
      :noedit="!rightControl.allowEdit"
      :nodelete="!rightControl.allowDelete"
      :customImportButton="rightControl.allowImport"
      :exportButton="rightControl.allowExport"
      @customImport="customImportData"
      @export="exportData"
      @run="run"
      @resume="resume"
      @pause="pause"
      :noRun="!rightControl.allowLjzx"
      :noResume="!rightControl.allowHf"
      :noPause="!rightControl.allowZt"
    />
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      title="定时任务日志"
      :visible.sync="DialogVisible"
    >
      <BubbleList
        ref="list"
        :search="popFilter"
        type="popJobLog"
        :injectionSubmit="injectionSubmit"
        rurl="empty"
      />
    </el-dialog>
    <!-- 查看详情 -->
    <showDetailTemplate
      :visible="showDetailDialog"
      :formData="currentRowData"
      :formConfig="form"
      :beforeClose="beforeDetailDialogClose"
    ></showDetailTemplate>
  </div>
</template>

<script>
import {
  getToken,
  initRightControl,
  importTemplateInfo,
  publicExportFn,
} from "@/utils";
import importTemplate from "../importTemplate/importTemplate";
import showDetailTemplate from "../showDetailTemplate/showDetailTemplate";
export default {
  name: "paramSystem",
  components: { showDetailTemplate },
  computed: {
    Token() {
      return { Authorization: getToken`` };
    },
    iuldUrl() {
      return this.$bubble.config.Host.default + "risksafety/personnel/import";
    },
  },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    var auth = {
      auth: [
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "扬州晶澳",
          createId: 66,
          createTime: "2021-02-05 10:18:32",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 299,
          menuName: "批量立即执行",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "扬州晶澳",
          updateId: 66,
          updateTime: "2021-02-05 10:18:32",
          url: "/",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "扬州晶澳",
          createId: 66,
          createTime: "2021-02-05 10:18:32",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 299,
          menuName: "批量恢复",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "扬州晶澳",
          updateId: 66,
          updateTime: "2021-02-05 10:18:32",
          url: "/",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "扬州晶澳",
          createId: 66,
          createTime: "2021-02-05 10:18:32",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 299,
          menuName: "批量暂停",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "扬州晶澳",
          updateId: 66,
          updateTime: "2021-02-05 10:18:32",
          url: "/",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "扬州晶澳",
          createId: 66,
          createTime: "2021-02-05 10:18:32",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 299,
          menuName: "新建",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "扬州晶澳",
          updateId: 66,
          updateTime: "2021-02-05 10:18:32",
          url: "/",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-05 10:27:38",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 301,
          menuName: "修改",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-05 10:27:38",
          url: "/",
        },

        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-08 09:32:26",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 358,
          menuName: "查询",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-08 09:32:26",
          url: "",
        },
        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-05 10:26:51",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 300,
          menuName: "删除",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 2,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-05 10:26:51",
          url: "/",
        },

        {
          checked: null,
          children: null,
          cmyIds: null,
          component: null,
          createBy: "管理员",
          createId: 82,
          createTime: "2021-02-08 09:32:26",
          delFlg: 0,
          deptIds: null,
          icon: null,
          id: 358,
          menuName: "查询",
          menuType: 4,
          pId: 119,
          pageNum: 1,
          pageSize: 10,
          redirect: null,
          remark: null,
          sort: 0,
          start: null,
          title: null,
          updateBy: "管理员",
          updateId: 82,
          updateTime: "2021-02-08 09:32:26",
          url: "",
        },
      ],
    };
    return {
      defaultFilter: [{ field: "jobId", logic: "=", value: null }],
      jobId: "",
      popFilter: [{ key: "name", text: "姓名" }],
      rightControl: initRightControl(auth.auth),
      selectData: [],
      DialogVisible: false,
      currentUser: null,
      form: [
        {
          type: "hidden",
          text: "id",
          name: "jobId",
          valid: { required: true },
        },
        {
          type: "input",
          text: "任务名称",
          name: "jobName",
          valid: { required: true },
        },
        {
          type: "textarea",
          text: "任务描述",
          name: "remark",
        },
        {
          type: "input",
          text: "服务名称",
          name: "serverName",
        },
        {
          type: "input",
          text: "调用目标串",
          name: "strand",
          valid: { required: true },
        },

        {
          type: "input",
          text: "cron表达式",
          name: "cron",
          valid: { required: true },
        },
        {
          type: "radio",
          text: "是否并发",
          name: "concurrent",

          option: [
            {
              text: "允许",
              value: 0,
            },
            {
              text: "禁止",
              value: 1,
            },
          ],
        },
        {
          type: "radio",
          text: "状态",
          name: "status",

          option: [
            {
              text: "正常",
              value: 0,
            },
            {
              text: "暂停",
              value: 1,
            },
          ],
        },
      ],
      filter: [{ key: "jobName", text: "定时任务名称" }],
      rowbtn: [
        {
          text: "开启",
          onclick: this.toResume,
          visible: (v) => {
            return v.status == "1";
          },
        },
        {
          text: "暂停",
          onclick: this.toPause,
          visible: (v) => {
            return v.status == "0";
          },
        },
        {
          text: "执行一次",
          onclick: this.onceRun,
        },
        {
          text: "日志",
          onclick: this.jobLog,
        },
      ],
      currentRowData: {},
      showDetailDialog: false,
      injectionSubmit(u, n, s, p) {
        //初始化请求参数
        
    
        let data = {};
        p.map((param) => {
          data[param.field] = param.value;
        });
       
        return new Promise((resolve, reject) => {
          this.$bubble
            .request("popJobLog.page", {
              ...data,
              pageNum: n,
              pageSize: s,
            })
            .then((v) => {
              resolve({
                data: {
                  records: v.record.records.map((val) => {
                    val.noedit = val.binding == 1 ? true : false;
                    return val;
                  }),
                  total: v.record.total,
                },
              });
            });
        });
      },
    };
  },
  methods: {
    refreshTable() {
      this.$set(this.defaultFilter, 0, {
        field: "jobId",
        logic: "=",
        value: null,
      });
    },
    jobLog(v) {
      this.jobId = v.jobId;
      this.DialogVisible = true;
      this.currentUser = Object.assign({}, v);
      this.popFilter = [{ key: "content", text: "日志内容" }];
      this.$refs.list && this.$refs.list.reload();
    },
    onceRun(v) {
      this.$confirm(
        "确认要立即执行一次" + " " + v.jobName + " " + "任务吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.run(v);
        })
        .catch(() => {});
    },
    toResume(v) {
      this.$confirm("确认恢复" + " " + +v.jobName + +" " + "任务吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
      
          this.resume(v);
        })
        .catch(() => {});
    },
    toPause(v) {
      this.$confirm("确认要暂停" + " " + v.jobName + " " + "任务吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.pause(v);
        })
        .catch(() => {});
    },
    showRowDetails(v) {
      this.currentRowData = v;
      this.showDetailDialog = true;
    },
    beforeDetailDialogClose() {
      this.showDetailDialog = false;
    },
    tableSelectChange(v) {
      this.selectData = v;
    },
    run(v) {
      var arr = [];
      if (v) {
        arr.push(v);
      } else {
        if (!this.selectData || this.selectData.length == 0) {
          this.$message.warning("请勾选要运行的任务!");
          return;
        } else {
          arr = this.selectData;
        }
      }

      if (arr.length > 0) {
        var arrid = arr.map((v) => {
          return v.jobId;
        });
        this.$bubble.request("jobSystem.run", arrid).then((v) => {
          if (v.code == 0) {
            this.$message({
              message: "任务立即运行成功！",
              type: "success",
            });
            this.refreshTable();
          } else {
            this.$message.error("运行失败");
          }
        });
      }
    },
    resume(v) {
      var arr = [];
      if (v) {
        arr.push(v);
        this.selectData = arr;
      } else {
        if (!this.selectData || this.selectData.length == 0) {
          this.$message.warning("请勾选要恢复的任务!");
          return;
        } else {
          arr = this.selectData;
        }
      }
      var arr = this.selectData;
      if (arr.length > 0) {
        var arrid = arr.map((v) => {
          return v.jobId;
        });
 
        this.$bubble.request("jobSystem.resume", arrid).then((v) => {
          if (v.code == 0) {
            this.$message({
              message: "任务恢复运行成功！",
              type: "success",
            });
            this.refreshTable();
          } else {
            this.$message.error("恢复失败");
          }
        });
      }
    },

    pause(v) {
      var arr = [];
      if (v) {
        arr.push(v);
        this.selectData = arr;
      } else {
        if (!this.selectData || this.selectData.length == 0) {
          this.$message.warning("请勾选要暂停的任务!");
          return;
        } else {
          arr = this.selectData;
        }
      }
      var arr = this.selectData;
      if (arr.length > 0) {
        var arrid = arr.map((v) => {
          return v.jobId;
        });
        this.$bubble.request("jobSystem.pause", arrid).then((v) => {
          if (v.code == 0) {
            this.$message({
              message: "任务暂停成功！",
              type: "success",
            });
            this.refreshTable();
          } else {
            this.$message.error("暂停失败");
          }
        });
      }
    },

    exportData() {
      if (!this.selectData || this.selectData.length == 0) {
        this.$message.warning("请勾选导出人员!");
        return;
      }
      publicExportFn(
        this.$bubble.requestExport,
        "exportInterface.UserList",
        this.selectData.map((d) => d.id),
        "人员列表"
      );
    },
    customImportData() {
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().UserList,
        },
        () => {}
      );
    },
  },
  created() {
    console.log(this.$bubble);
  },
};
</script>

<style lang="scss">
</style>