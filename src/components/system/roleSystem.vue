<template>
  <div>
    <BubbleBasicManage
      ref="list"
      title="角色管理"
      :form="form"
      form-title="角色"
      type="roleSystem"
      label-width="120px"
      :filter="filter"
      primaryKey="roleId"
      :dataKey="'roleId'"
      :selectMode="'multiple'"
      @selectChange="tableSelectChange"
      :rowbtn="rowbtn"
      :btnWidth="250"
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
      title="数据权限"
      :visible.sync="DialogVisible"
    >
      <!-- <BubbleList
        ref="list"
        :search="popFilter"
        type="popUser"
        :injectionSubmit="injectionSubmit"
        rurl="empty"
      /> -->
      <!-- <BubbleForm
        ref="list"
        :search="popFilter"
        type="popUser"
        :injectionSubmit="injectionSubmit"
        rurl="empty"
      /> -->
      <BubbleForm
        ref="dataSorce"
        :nosubmit="true"
        :formConfig="dataSorce.forms"
        :formData="currentRowData"
        @submit="submit($event, 0)"
        labelWidth="80px"
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
  name: "WorkPlaceList",
  components: { showDetailTemplate },
  data() {
    // var auth = this.$bubble.pageLoadArguments;
    // const uploadPrefix = this.$bubble.config.uploadPrefix;
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
      rightControl: initRightControl(auth.auth),
      selectData: [],
      currentRowData: {},
      form: [
        {
          type: "step",
          text: "角色信息",
          forms: [
            {
              type: "input",
              text: "角色名称",
              name: "roleName",
              valid: { required: true },
            },
            { type: "hidden", name: "roleId" },
            {
              type: "input",
              text: "权限字符",
              name: "roleCode",
              valid: { required: true },
            },

            {
              type: "number",
              text: "显示顺序",
              name: "sort",
              valid: { required: true },
            },
            {
              type: "radio",
              text: "角色状态",
              name: "status",
              // valid: { required: false },
              // remote: {
              //   url: "remoteDict.url",
              //   parame: { "dictType": "dictStatus" },
              //   text: "dictLabel",
              //   value: "dictValue",
              //   valueType: "string",
              // },
              option: [
                {
                  text: "正常",
                  value: 0,
                },
                {
                  text: "停用",
                  value: 1,
                },
              ],
            },
            {
              type: "input",
              text: "备注",
              name: "remark",
              valid: { required: true },
            },
          ],
        },
        {
          type: "step",
          text: "角色权限",
          forms: [
            {
              type: "plugs",
              text: "权限菜单",
              plugs: "menutree",
              pageType: "menuIds",
              name: "menuIds",
              // selectData:this.selectData,
              defaultSelected: (e) => {
                console.log(e);
              },
            },
          ],
        },
      ],
      filter: [
        { key: "roleName", text: "角色名称" },
        {
          key: "roleCode",
          text: "权限字符",
        },
      ],
      popFilter: [{ key: "name", text: "姓名" }],
      rowbtn: [
        {
          text: "查看详情",
          onclick: this.showRowDetails,
          visible: (v) => {
            return initRightControl(auth.auth).allowShowDetail;
          },
        },
        // {
        //   text: "数据权限",
        //   onclick: this.showUsers,
        // },
      ],
      dataSorce: {
        forms: [
          {
            type: "input",
            text: "角色名称",
            name: "roleName",
            valid: { required: true },
          },
          {
            type: "input",
            text: "权限字符",
            name: "roleCode",
            disabled: true,
            valid: { required: true },
          },
          {
            type: "select",
            text: "数据范围",
            name: "level",
            onclick: this.dataSorceChange,
            option: [
              //0：全部数据权限 1：自定数据权限 2：本部门数据权限 3：本部门及以下数据权限4 仅个人
              {
                text: "全部数据权限",
                value: "0",
              },
              {
                text: "自定数据权限",
                value: "1",
              },
              {
                text: "本部门及以下数据权限",
                value: "3",
              },
              {
                text: "仅个人",
                value: "4",
              },
            ],
            valid: { required: true },
          },
          {
            type: "hidden",
            text: "权限菜单",
            plugs: "menutree",
            pageType: "menuIds",
            name: "menuIds",
            formData: this.currentRowData,
            // selectData:this.selectData,
            defaultSelected: (e) => {
              console.log(e);
            },
          },
        ],
      },
      DialogVisible: false,
      currentUser: null,
      showDetailDialog: false,
    };
  },
  methods: {
    dataSorceChange(v) {
      if (v == "1") {
        this.dataSorce.forms[3].type = "plugs";
      } else {
        this.dataSorce.forms[3].type = "hidden";
      }
    },
    showRowDetails(v) {
      this.currentRowData = v;
      this.showDetailDialog = true;
    },
    beforeDetailDialogClose() {
      this.currentRowData = {};
      this.showDetailDialog = false;
    },
    tableSelectChange(v) {
      this.selectData = v;
    },
    showUsers(v) {
      this.currentRowData = v;
      this.DialogVisible = true;
      // this.currentUser = Object.assign({}, v);
      // this.$refs.list && this.$refs.list.reload();
    },
    /**
     * 模拟导入数据,借用组件样式
     */
    injectionSubmit(url, n, s, p) {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            records:
              p.length == 0
                ? this.currentUser.personList
                  ? this.currentUser.personList
                  : []
                : this.currentUser.personList.filter(
                    (data) => data.name.indexOf(p[0].value) >= 0
                  ),
            total: this.currentUser.personList
              ? this.currentUser.personList.length
              : 0,
          },
        });
      });
    },

    customImportData() {
      new this.$newPopup(
        importTemplate,
        {
          props: importTemplateInfo().WorkPlaceList,
        },
        () => {}
      );
    },
    exportData() {
      if (!this.selectData || this.selectData.length == 0) {
        this.$message.warning("请勾选导出车间!");
        return;
      }
      publicExportFn(
        this.$bubble.requestExport,
        "exportInterface.WorkPlaceList",
        this.selectData.map((d) => d.id),
        "车间列表"
      );
    },
  },
};
</script>

<style></style>
