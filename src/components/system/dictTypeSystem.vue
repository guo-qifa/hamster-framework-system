<template>
  <div>
    <BubbleBasicManage
      ref="paramSystemBasicManage"
      title="字典管理"
      :form="form"
      form-title="字典"
      type="dictTypeSystem"
      :filter="filter"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :dataKey="'dictId'"
      :primaryKey="'dictId'"
      :rowbtn="rowbtn"
      :btnWidth="200"
      :noinsert="!rightControl.allowAdd"
      :noedit="!rightControl.allowEdit"
      :nodelete="!rightControl.allowDelete"
      :customImportButton="rightControl.allowImport"
      :exportButton="rightControl.allowExport"
      @customImport="customImportData"
      @export="exportData"
    />

    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      title="字典列表"
      width="70%"
      :visible.sync="DialogVisible"
    >
      <!-- <BubbleList
        ref="list"
        :search="popFilter"
        type="popUser"
        :injectionSubmit="injectionSubmit"
        rurl="empty"
      /> -->
      <BubbleBasicManage
        ref="dictDataSystemBasicManage"
        title="字典列表"
        :form="dictDataForm"
        form-title="字典列表"
        type="dictDataSystem"
        :filter="popFilter"
        :remotedict="'dictStatus'"
        :dialogFilterCode='dialogFilterCode'
        :injectionSubmit="injectionSubmit"
        @selectChange="dictDataSelectChange"
        :dataKey="'dictTypeId'"
        primaryKey="dictTypeId"
        :rowbtn="dictDataRowbtn"
        :btnWidth="120"
        :noinsert="!rightControl.allowAdd"
        :noedit="!rightControl.allowEdit"
        :nodelete="!rightControl.allowDelete"
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
      dialogFilterCode:'',
      dictType: "",
      dictDataSelect: [],

      DialogVisible: false,
      rightControl: initRightControl(auth.auth),
      selectData: [],
      dictDataForm: [
        {
          type: "hidden",
          text: "id",
          name: "dictDataId",
          valid: { required: true },
        },
         {
          type: "hidden",
          text: "dictType",
          name: "dictType",
          valid: { required: true },
        },
        {
          type: "input",
          text: "字典标签",
          name: "dictLabel",
          valid: { required: true },
        },
        {
          type: "input",
          text: "字典键值",
          name: "dictValue",
          valid: { required: true },
        },

        {
          type: "select",
          text: "字典状态",
          name: "status",
          valid: { required: true },
          option: [
            {
              text: "正常",
              value: "0",
            },
            {
              text: "停用",
              value: "1",
            },
          ],
        },
        {
          type: "number",
          text: "排序",
          name: "dictSort",
        },
       
      ],
      form: [
        {
          type: "hidden",
          text: "id",
          name: "dictId",
          valid: { required: true },
        },
        {
          type: "input",
          text: "字典名称",
          name: "dictName",
          valid: { required: true },
        }, 
        {
          type: "input",
          text: "字典类型",
          name: "dictType",
          valid: { required: true },
        },
        {
          type: "radio",
          text: "字典状态",
          name: "status",
          valid: { required: true },
          option: [
            {
              text: "正常",
              value: "0",
            },
            {
              text: "停用",
              value: "1",
            },
          ],
        },
       
        {
          type: "textarea",
          text: "备注",
          name: "remark",
          valid: { required: true },
        },
      ],
      popFilter: [{ key: "dictLabel", text: "字典标签" }],
      filter: [ 
        { key: "dictName", text: "字典名称" },
        {
          key: "dictType",
          text: "字典类型",
        },
      ],
      dictDataRowbtn: [],
      rowbtn: [
        {
          text: "字典列表",
          onclick: this.showDictData,
        },
      ],
      currentRowData: {},
      showDetailDialog: false,
      injectionSubmit(u, n, s, p) {
        var _this = this;
        _this.dictType = _this.$parent.$parent.$parent.$parent.dictType;
        //初始化请求参数
        
        p.push({
          field: "dictType",
          value: _this.dictType,
        });
        let data = {};
        p.map((param) => {
          data[param.field] = param.value;
        });
    
        return new Promise((resolve, reject) => {
          this.$bubble
            .request(u, {
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
    showDictData(v) {
      this.dictType = v.dictType; 
      this.DialogVisible = true; 
      this.dialogFilterCode = v.dictType
    
      this.$refs.list && this.$refs.list.reload();
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
    dictDataSelectChange(v) {
      this.dictDataSelect = v;
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