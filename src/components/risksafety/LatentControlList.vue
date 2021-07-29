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
          title="隐患管控清单"
          :form="form"
          form-title="隐患管控清单"
          type="latentControlList"
          :filter="filter"
          primaryKey="id"
          :rowbtn="rowbtn"
          :btnWidth="200"
          :defaultFilter="defaultFilter"
          :injectionSubmit="injectionSubmit"
          :noinsert="!rightControl.allowAdd"
          :noedit="!rightControl.allowEdit"
          :nodelete="!rightControl.allowDelete"
          :customImportButton="rightControl.allowImport"
          :exportButton="rightControl.allowExport"
          @customImport="customImportData"
          @export="exportData"
        />
      </el-col>
    </el-row>

      <!-- 查看详情 -->
    <showDetailTemplate
        ref="detailTemplate"
        :visible="showDetailDialog"
        :formData="currentRowData"
        :formConfig="detailForm"
        :beforeClose="beforeDetailDialogClose"
    >
        <h3>隐患整改记录</h3>
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(item,index) in collapseData" :key="index" :title="item.updateInfo" :name="index">
            <i-form
                  :label-width="100"
                  ref="company"
                  label-position="right"
                  style="margin: 10px 0 0 0; padding: 10px 0 10px 0"
                >
                  <Row v-if="item.reply">
                    <i-col span="24">
                      <Form-item label="批复:">
                        <span> {{ item.reply }}</span>
                      </Form-item>
                    </i-col>
                  </Row>
                  <Row v-if="item.handleResult && item.handleResult.length > 0">
                    <i-col span="24">
                      <Form-item label="详情:">
                        <span> {{ item.handleResult }}</span>
                      </Form-item>
                    </i-col>
                  </Row>

                  <Row v-if="item.handlePic && item.handlePic.length > 0">
                    <i-col span="24">
                      <Form-item label="图片">
                        <el-upload
                          :file-list="item.handlePic"
                          action=""
                          list-type="picture-card"
                          :on-preview="handlePictureCardPreview"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </Form-item>
                    </i-col>
                  </Row>
                </i-form>
          </el-collapse-item>
        </el-collapse>
    </showDetailTemplate>

    <!-- 处理表单 -->
    <BubblePopForm
          :title="'处理'"
          :visible="handleFormVisible"
          :formData="handleFormData"
          :formConfig="publicHandleFormConfig"
          :submit="submit"
          :width="'1000px'"
          :beforeClose="beforeClose"
      >
      <slot></slot>
    </BubblePopForm>
  </div>
</template>

<script>
// @ is an alias to /src

import { getToken, initRightControl, getToday, getQueryVariable } from "@/utils";
import showDetailTemplate from '../showDetailTemplate/showDetailTemplate';
export default {
  name: "LatentControlList",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    var userType = localStorage.getItem("userType");
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    let firstFormArray = [
        {
          type: "input",
          text: "检查名称",
          name: "checkName",
          valid: { required: true },
        },
        { type: "hidden", name: "id" },
        {
          type: "date",
          text: "检查时间",
          name: "checkTime",
          format: "yyyy-MM-dd 00:00:00",
        },
        {
          type: "select",
          text: "检查类型",
          name: "checkType",
          dictionary: "controlCheckType",
        },
        {
          type: "input",
          text: "检查部门",
          name: "insDep",
          valid: { required: true },
        },
        {
          type: "input",
          text: "检查人员",
          name: "insPerson",
          valid: { required: true },
        },
        {
          type: "input",
          text: "检查地点",
          name: "insLocation",
          valid: { required: true },
        },
        {
          type: "input",
          text: "存在问题",
          name: "problem",
          valid: { required: true },
        },
        {
          type: "input",
          text: "潜在事故",
          name: "accident",
          valid: { required: true },
        },
        {
          type: "input",
          text: "可能后果",
          name: "consequence",
          valid: { required: true },
        },
        {
          type: "select",
          text: "隐患类型",
          name: "insType",
          dictionary: "insTypes",
        },
        {
          type: "select",
          text: "隐患发现类型",
          name: "searchType",
          dictionary: "searchType",
        },
        {
          type: "image",
          text: "隐患图片",
          name: "hidPhoto",
          headers: {
            loginTokensAnjian: getToken(),
          },
          onSuccess(res) {
            res.object.url = uploadPrefix + res.object.url;
            return res.object.url
          }
        },
    ]
    let secondFormArray = [
      { type: "input", text: "整改负责人", name: "meaUser", disabled: true},
      { type: "hidden", text: "id", name: "id" },
      { type: "date", text: "整改期限", name: "rectifyTime"},
      { type: "input", text: "整改措施", name: "measure"},
      {
        type: "textarea",
        text: "备注",
        name: "remark",
        minRows: 10,
      },
    ]
    let thirdFormArray =  [
      { type: "input", text: "处理结果", name: "handleResult", valid: { required: true },},
      { 
        type: "image",
        text: "现场处理图片",
        name: "handlePic",
        multiple: false,
        headers: {
          loginTokensAnjian: getToken(),
        },
        onSuccess(res) {
          res.object.url = uploadPrefix + res.object.url;
          return res.object.url
        }
      },
    ]
    return {
      rightControl: initRightControl(auth.auth),
      userType,
      submitType: '',
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [{ field: "cmyId", logic: "=", value: "" }],
      form: firstFormArray,
      activeNames:['0'],
      collapseData: [],
      filter: [
        { key: "checkName", text: "检查名称" },
        { text: "编号", key: "id" },
        {
          key: "insType",
          text: "隐患等级",
          type: "select",
          dictionary: "insTypes",
        },
        {
          key: "status",
          text: "状态",
          type: "select",
          dictionary: userType == 1 ? "latentControlStatus_1" : "latentControlStatus_2",
          default: ''
        },
        {
          key: "date",
          text: "检查时间",
          type: "datetime",
          default: ''
        },
      ],
      detailForm: [
        {
          type: "step",
          text: "隐患详情",
          forms: firstFormArray
        },
        {
          type: "step",
          text: "整改意见",
          forms: secondFormArray
        },
        {
          type: "step",
          text: "整改详情",
          forms: thirdFormArray
        },
      ],
      publicHandleFormConfig: [],
      handleFormConfig: [
        {
          type: "step",
          text: "建议措施",
          forms: secondFormArray
        },
        {
          type: "step",
          text: "企业整改",
          forms: thirdFormArray
        },
      ],
      suggestFormConfig: [
        { 
          type: "select",
          text: "整改负责人",
          name: "meaUser",
          remote: {
            url: "polling.personnel",
            parame: {},
            text: "name",
            value: "name",
            keyValue: 'id',
            valueType: "string",
          },
          valid: { required: true },
        },
        { type: "hidden", text: "id", name: "id"},
        { type: "date", text: "整改期限", name: "rectifyTime", valid: { required: true }},
        { type: "input", text: "整改措施", name: "measure", valid: { required: true }},
        {
          type: "textarea",
          text: "备注",
          name: "remark",
          minRows: 10,
          valid: { required: true },
        },
      ],
      replyFormConfig: [
        {type: 'input', text: '批复',  name: "reply", valid: { required: true }}
      ],
      handleFormVisible: false,
      handleFormData: {},
      rowbtn: [
        {
          text: '查看详情',
          onclick: this.showRowDetails,
          visible: v => {
            return initRightControl(auth.auth).allowShowDetail
          }
        },
        {
          text: "处理",
          onclick: this.handle,
          visible: (v) => {
            return v.status == 1 && userType == 1;
          },
        },
        {
          text: "建议",
          onclick: this.suggest,
          visible: (v) => {
            return v.status == 1 && userType == 2;
          },
        },
        {
          text: "关闭",
          onclick: this.handleClose,
          visible: (v) => {
            return v.status == 2 && userType == 2;
          },
        },
        {
          text: "驳回",
          onclick: this.handleBack,
          visible: (v) => {
            return v.status == 2 && userType == 2;
          },
        },
      ],
      currentRowData: {},
      showDetailDialog: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    showRowDetails(rowData) {
      this.$bubble
        .request("latentControlList.details", { defectId: rowData.id })
        .then((v) => {
          this.currentRowData = Object.assign({}, rowData);
          this.currentRowData.meaUser = v.record[0].meaUser;
          this.currentRowData.rectifyTime = v.record[0].rectifyTime;
          this.currentRowData.measure = v.record[0].measure;
          this.currentRowData.remark = v.record[0].remark;
          this.currentRowData.handleResult = v.record[0].handleResult;
          this.currentRowData.handlePic = v.record[0].handlePic;

          //查询流程记录
          this.$bubble
            .request("rectifyRecord.record", { serviceId: rowData.id, serviceType: 1 })
            .then((collapseData) => {
              let data = collapseData.record;
              console.log(data)
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  if (data[i].handlePic && data[i].handlePic.length > 10) {
                    var strObj = data[i].handlePic;
                    data[i].handlePic = [];
                    data[i].handlePic = this.formPictrue(strObj, data[i].handlePic);
                  }
                }
                this.collapseData = data;
                this.showDetailDialog = true;
              }
            }).catch((e) => {
              this.$alert("数据获取失败");
            })

        }).catch((v) => {
          this.$alert("数据获取失败");
        })
    },
    beforeDetailDialogClose() {
      this.showDetailDialog = false;
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
    /**
     * @name: 自行请求数据
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-09 17:39:31
     * @LastEditTime: Do not Edit
     */

    injectionSubmit(u, s, n, p) {
      console.log(u, s, n, p)
      let obj = new Object();
      p.forEach((v) => {
        if (v.field == "date" && v.value) {
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
      console.log(obj)
      return new Promise((reslove, reject) => {
          this.$bubble
            .request("latentControlList.page", {
              pageNum: s,
              pageSize: n,
              ...obj,
            })
            .then((v) => {
              reslove({
                data: {
                  records: v.record.records.map(item => {
                    if(item.status == '2' || item.status == '3') {
                      item.noedit = true;
                      item.nodelete = true;
                    }
                    return item
                  }),
                  total: v.record.total,
                },
              });
            });
      });
    },
    handle(v) {// 企业处理,先查询
      this.submitType = 'handle';
      this.handleFormData = {};
      this.currentRowData = v;
      this.publicHandleFormConfig = this.handleFormConfig;
      this.$bubble
        .request("latentControlList.details", { defectId: v.id})
        .then((handleData) => { 
          let data = handleData.record;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].handlePic && data[i].handlePic.length > 10) {
                var strObj = data[i].handlePic;
                data[i].handlePic = [];
                data[i].handlePic = this.formPictrue(strObj, data[i].handlePic);
              }
            }
            this.handleFormData = data[0];
            this.handleFormVisible = true;
          } else {
            this.handleFormData = {};
            this.handleFormVisible = true
          }
        }).catch((e) => {
          this.$alert("数据获取失败");
        })
    },
    suggest(v) {
      this.submitType = 'suggest';
      this.handleFormData = {};
      this.currentRowData = v;
      this.suggestFormConfig[0].remote.parame = {cmyId: v.cmyId};
      this.publicHandleFormConfig = this.suggestFormConfig;
      this.$bubble
        .request("latentControlList.details", { defectId: v.id})
        .then((handleData) => {
          let data = handleData.record;
          if (data.length > 0) {
            this.handleFormData = data[0];
          } else {
            this.handleFormData = {};
          }
          this.handleFormVisible = true
        }).catch((e) => {
          this.$alert("数据获取失败");
        })
    },
    handleClose(v) {
      this.submitType = 'close';
      this.currentRowData = v;
      this.publicHandleFormConfig = this.replyFormConfig;
      this.handleFormData = {};
      this.handleFormVisible = true;
    },
    handleBack(v) {
      this.submitType = 'back';
      this.currentRowData = v;
      this.publicHandleFormConfig = this.replyFormConfig;
      this.handleFormData = {};
      this.handleFormVisible = true;
    },
    submit(val, callback) {
      let urlStr = '';
      let p = {};
      switch (this.submitType) {
        case "suggest":
          var param = {};
          
          param.defect_id = this.currentRowData.id;
          param.meaUser = val.meaUser;
          param.measure = val.measure;
          param.remark = val.remark;
          param.rectifyTime = val.rectifyTime;
          if(this.handleFormData.id) {
            param.id = this.handleFormData.id;
            param.cmyId = 0;
            urlStr = 'latentControlList.suggest_update'
          } else {
            urlStr = 'latentControlList.suggest_insert'
          }
          p = Object.assign({}, param);

        break;
        case "handle":
          var param = {};

          param.defectId = this.currentRowData.id;
          param.handleResult = val.handleResult;
          param.handlePic = val.handlePic;
          if(this.handleFormData.id) {
            param.id = this.handleFormData.id;
            urlStr = 'latentControlList.suggest_update'
          } else {
            urlStr = 'latentControlList.suggest_insert'
          }
          p = Object.assign({}, param);

        break;
        case "close":
          var param = {};

          param.id = this.currentRowData.id;
          param.status = 3;
          param.reply = val.reply;
          urlStr = 'latentControlList.publish'
          p = Object.assign({}, param);
          
        break;
        case "back":
          var param = {};

          param.id = this.currentRowData.id;
          param.status = 2;
          param.reply = val.reply;
          urlStr = 'latentControlList.publish'
          p = Object.assign({}, param);

        break;
      
        default:
          return
      }

      this.$bubble.request(urlStr, p).then( rs => {
          if(rs.code == '0') {
            this.$message.success("操作成功！");
            if(this.submitType == 'suggest' || this.submitType == 'handle') {
              this.handleMessage(val.id, 3);
            }

            if(this.submitType == 'handle') {
              this.$bubble.request('latentControlList.publish', {status: 2,id: this.currentRowData.id}).then(value => {
                this.$refs.table.reload();
              }).catch((e) => {
                console.log(e, "操作失败!");
              })
            }

            if(this.submitType != 'handle') {
              this.$refs.table.reload();
            }
          } else {
            this.$message.error(rs.message || "操作失败！")
          }
          callback(val);
        }).catch((e) => {
          this.$alert("操作失败!");
        })
    },
    handleMessage(serverId, type) {
      this.$bubble.request("noticeList.enclosed", { serverId, type }).then( rs => {
          if(rs.code != '0') {
            this.$message.error(rs.message || "操作失败！")
          }
        }).catch((e) => {
          this.$alert("操作失败!");
        })
    },
    beforeClose() {this.handleFormVisible = false; this.handleFormData = {}},
    customImportData() { console.log("导入") },
    exportData() { console.log("导出") },
    handlePictureCardPreview(file) {
      window.open(file.url);
    },
    formPictrue(urlObjstr, photoList) {
      if (urlObjstr && urlObjstr.length > 10) {
        if (urlObjstr.indexOf("http") == 0) {
          var pic = urlObjstr;
          photoList = [{ url: pic }];
        } else if (
          urlObjstr.indexOf("[{") > -1 &&
          urlObjstr.indexOf("]") > -1
        ) {
          photoList = JSON.parse(urlObjstr);
        } else if (urlObjstr.indexOf("http") < 0) {
          photoList = [
            {
              url:
                `${this.$store.state.baseUrl}` +
                `${this.$store.state.ajaxUrl}` +
                "fileDownload/downloadPic?pic=/" +
                urlObjstr,
            },
          ];
        } else if (urlObjstr.indexOf("http") == 2) {
          var arr = [];
          let picLit = JSON.parse(urlObjstr);
          for (var j = 0; j < picLit.length; j++) {
            arr.push({
              url: picLit[j],
            });
          }
          photoList = arr;
        }
        return photoList;
      } else {
        photoList = [];
         return photoList;
      }
    },
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }
    if (getQueryVariable("today")) {
      this.filter[4]["default"] = getToday(1);
    }
    this.filter[3]["default"] = getQueryVariable("status")
  },
};
</script>

<style lang="scss" scoped>
</style>