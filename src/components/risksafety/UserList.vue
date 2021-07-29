<template>
  <BubbleBasicManage
      title="从业人员"
      :form="form"
      form-title="从业人员"
      type="personnel"
      :filter="filter"
      primaryKey="id"
      @import="importData"
      :importHeaders="Token"
      importButton
      :importUploadUrl="iuldUrl"
      :rowbtn="rowBtn"
  />
</template>

<script>
  import {getToken} from "@/utils";
  // @ is an alias to /src
  export default {
    name: "UserList",
    computed: {
      Token() {
        return {loginTokensAnjian: getToken``};
      },
      iuldUrl() {

                  return this.$bubble.config.Host.default + "/risksafety/personnel/import";
      },
    },
    data() {
      return {
        form: [
             {
                type: "input",
                text: "从业人员id",
                name: "id",
         
              },
             {
                type: "input",
                text: "企业id",
                name: "cmyId",
         
              },
             {
                type: "input",
                text: "用户id",
                name: "userId",
         
              },
             {
                type: "radio",
                text: "用户姓名",
                name: "userName",
                valid: {required: true},  
              },
             {
                type: "input",
                text: "车间id",
                name: "workId",
         
              },
             {
                type: "input",
                text: "姓名",
                name: "name",
         
              },
             {
                type: "select",
                text: "性别",
                name: "gender",
         
              },
             {
                type: "input",
                text: "联系方式",
                name: "phone",
         
              },
             {
                type: "select",
                text: "人员类型",
                name: "type",
         
              },
             {
                type: "select",
                text: "证件类型",
                name: "cardType",
         
              },
             {
                type: "input",
                text: "证件号码",
                name: "cardNo",
         
              },
             {
                type: "input",
                text: "备注",
                name: "remark",
         
              },
             {
                type: "datetime",
                text: "创建时间",
                name: "createTime",
         
              },
             {
                type: "input",
                text: "创建人id",
                name: "createId",
         
              },
             {
                type: "input",
                text: "创建人",
                name: "createUser",
         
              },
             {
                type: "datetime",
                text: "更新时间",
                name: "updateTime",
                valid: {required: true},  
              },
             {
                type: "input",
                text: "更新人id",
                name: "updateId",
         
              },
             {
                type: "input",
                text: "更新人",
                name: "updateUser",
         
              },
             {
                type: "input",
                text: "是否删除",
                name: "delFlag",
         
              },
             {
                type: "input",
                text: "是否已绑定",
                name: "binding",
         
              },
                    ],
        filter: [
                      {key: "user_name", text: "用户姓名"},
                          {key: "gender", text: "性别"},
                                          {key: "create_id", text: "创建人id"},
                  {key: "create_user", text: "创建人"},
                      {key: "update_id", text: "更新人id"},
                  {key: "update_user", text: "更新人"},
                      {key: "binding", text: "是否已绑定"},
                ],
        rowBtn: [
          {
            text: "导出",
            onclick: (...arg) => {
              this.exportData(arg);
            },
          },
        ],
      };
    },
    methods: {
      /**
       * 导入使用
       * 添加importButton属性
       * 添加importUploadUrl属性（文件上传地址）
       * 添加import事件
       */
      importData(url) {
        //上传导入文件后调用
        //获得文件URL调用导入接口
                  this.$message({
          message: "导入成功",
          type: "success",
        });
      },
    },
    created() {
              console.log(this.$bubble);
    },
  };
</script>

<style lang="scss">
</style>