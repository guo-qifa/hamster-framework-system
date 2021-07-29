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
          title="事故档案台账"
          :form="form"
          form-title="事故"
          type="accidentList"
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
        :visible="showDetailDialog"
        :formData="currentRowData"
        :formConfig="form"
        :beforeClose="beforeDetailDialogClose"
    >
    <h3>事故整改记录</h3>
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
                  <Form-item label="事故图片">
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
              <Row v-if="item.resultUrl && item.resultUrl.length > 0">
                <i-col span="24">
                  <Form-item label="处理图片">
                    <el-upload
                      :file-list="item.resultUrl"
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
  name: "AccidentList",
  components: { showDetailTemplate },
  data() {
    var auth = this.$bubble.pageLoadArguments;
    const userType = localStorage.getItem('userType');
    const uploadPrefix = this.$bubble.config.uploadPrefix;

    let firstFormArray = [
        {
          type: "input",
          text: "整改负责人",
          name: "meaUser",
          valid: { required: true },
        },
        {
          type: "date",
          text: "整改期限",
          name: "rectifyTime",
          format: "yyyy-MM-dd 00:00:00",
          valid: { required: true },
        },
        {
          type: "textarea",
          text: "整改措施",
          name: "measure",
          minRows: 5,
          valid: { required: true },
        },
        { type: "textarea", text: "备注", name: "remark", minRows: 5 },
        {
          type: "image",
          text: "事故现场图片",
          name: "picUrl",
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
      { type: "textarea", text: "整改描述", name: "description", minRows: 5 },
      {
        type: "image",
        text: "现场处理图片",
        name: "resultUrl",
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
      submitType: '',
      userType,
      activeNames:['0'],
      collapseData: [],
      filterText: '',
      treeData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      defaultFilter: [
        { field: "cmyId", logic: "=", value: "" },
      ],
      form: [
        {
          type: "step",
          text: "事故信息",
          forms: [
            {
              type: "input",
              text: "事故名称",
              name: "eventName",
              valid: { required: true },
            },
            { type: "hidden", name: "id" },
            {
              type: "date",
              text: "发生时间",
              name: "happenTime",
              format: "yyyy-MM-dd 00:00:00",
            },
            {
              type: "select",
              text: "发生地点",
              name: "happenLocaiton",
              valid: { required: true },
              remote: {
                url: "workPlace.map",
                parame: { cmyId: localStorage.getItem('orgId') },
                text: "workName",
                value: "id",
                valueType: "string",
              },
            },
            {
              type: "radio",
              text: "事故发生方",
              name: "eventSide",
              option: [
                { text: "本公司", value: 0 },
                { text: "相关方", value: 1 },
              ],
              default: 0,
            },
            {
              type: "checkbox",
              text: "事故类型",
              name: "eventType",
              dictionary: "hazFactor",
            },
          ],
        },
        {
          type: "step",
          text: "涉及人员",
          forms: [
            {
              type: "number",
              text: "涉险人数",
              min: 0,
              name: "dangerNum",
              valid: { required: true },
            },
            {
              type: "number",
              text: "死亡人数",
              min: 0,
              name: "deathNum",
              valid: { required: true },
            },
            {
              type: "number",
              text: "轻伤人数",
              min: 0,
              name: "woundNum",
              valid: { required: true },
            },
            {
              type: "number",
              text: "失踪人数",
              min: 0,
              name: "disappearNum",
              valid: { required: true },
            },
            {
              type: "number",
              text: "受困人数",
              min: 0,
              name: "trappedNum",
              valid: { required: true },
            },
          ],
        },
        {
          type: "step",
          text: "事故细节",
          forms: [
            { type: "input", text: "现场负责人", name: "principalName" },
            { type: "input", text: "负责人电话", name: "principalTel" },
            {
              type: "textarea",
              text: "事故简要过程",
              name: "happenContent",
              minRows: 5,
            },
            {
              type: "input",
              text: "直接经济损失",
              name: "financialLoss",
              append: "万元",
            },
          ],
        },
      ],
      filter: [
        { key: "eventName", text: "事件事故名称" },
        {
          key: "eventType",
          text: "事件类型",
          type: "select",
          dictionary: "hazFactor",
        },
        {
          key: "eventFlag",
          text: "状态",
          type: "select",
          dictionary: userType == 1 ? "accidentList_1" : "accidentList_2",
          default: ''
        },
        {
          type: "datetime",
          text: "时间段",
          key: "date",
          default: ""
        },
      ],
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
            return v.eventFlag == 1 && userType == 1;
          },
        },
        {
          text: "建议",
          onclick: this.suggest,
          visible: (v) => {
            return v.eventFlag == 1 && userType != 1;
          },
        },
        {
          text: "关闭",
          onclick: this.handleClose,
          visible: (v) => {
            return v.eventFlag == 2 && userType == 2;
          },
        },
        {
          text: "驳回",
          onclick: this.handleBack,
          visible: (v) => {
            return v.eventFlag == 2 && userType == 2;
          },
        },
        
      ],
      currentRowData: {},
      showDetailDialog: false,
      handleFormConfig_noSuggestion: secondFormArray,
      handleFormConfig_hasSuggestion: [
        {
          type: 'step',
          text: '整改建议',
          forms: firstFormArray.map(v => {v.disabled = true;return v})
        },
        {
          type: 'step',
          text: '企业整改',
          forms: secondFormArray
        }
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
        {
          type: "date",
          text: "整改期限",
          name: "rectifyTime",
          format: "yyyy-MM-dd 00:00:00",
          valid: { required: true },
        },
        {
          type: "textarea",
          text: "整改措施",
          name: "measure",
          minRows: 5,
          valid: { required: true },
        },
        { type: "textarea", text: "备注", name: "remark", minRows: 5 },
        {
          type: "image",
          text: "事故现场图片",
          name: "picUrl",
          headers: {
            loginTokensAnjian: getToken(),
          },
          onSuccess(res) {
            res.object.url = uploadPrefix + res.object.url;
            return res.object.url
          }
        },
      ],
      replyFormConfig: [
        {type: 'input', text: '批复',  name: "reply", valid: { required: true }}
      ],
      handleFormVisible: false,
      handleFormData: {},
      publicHandleFormConfig: [],
    };
  },
  methods: {
    showRowDetails(rowData) {
      //查询流程记录
      this.$bubble
        .request("rectifyRecord.record", { serviceId: rowData.id, serviceType: 2 })
        .then((collapseData) => {
          let data = collapseData.record;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].handlePic && data[i].handlePic.length > 10) {
                var strObj = data[i].handlePic;
                data[i].handlePic = [];
                data[i].handlePic = this.formPictrue(strObj, data[i].handlePic);
              }

              if (data[i].resultUrl && data[i].resultUrl.length > 10) {
                var strObj = data[i].resultUrl;
                data[i].resultUrl = [];
                data[i].resultUrl = this.formPictrue(strObj, data[i].resultUrl);
              }
            }
            this.collapseData = data;
            this.currentRowData = rowData;
            this.showDetailDialog = true;
          }
        }).catch((e) => {
          this.$alert("数据获取失败");
        })
    },
    beforeDetailDialogClose() {
      this.showDetailDialog = false;
    },
    handle(v) {
      this.submitType = 'handle';
      this.handleFormData = {};
      this.currentRowData = v;
      this.$bubble
        .request("accidentList.eventRectify", { eventId: v.id})
        .then((rs) => {
          let data = rs.record;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].picUrl && data[i].picUrl.length > 10) {
                var strObj = data[i].picUrl;
                data[i].picUrl = [];
                data[i].picUrl = this.formPictrue(strObj, data[i].picUrl);
              }

              if (data[i].resultUrl && data[i].resultUrl.length > 10) {
                var strObj = data[i].resultUrl;
                data[i].resultUrl = [];
                data[i].resultUrl = this.formPictrue(strObj, data[i].resultUrl);
              }
            }

            if(data[0].meaUser && data[0].meaUser.length > 0) {
              this.publicHandleFormConfig = this.handleFormConfig_hasSuggestion;
            } else {
              this.publicHandleFormConfig = this.handleFormConfig_noSuggestion;
            }
            this.handleFormData = data[0];
            this.handleFormVisible = true;
          } else {
            this.publicHandleFormConfig = this.handleFormConfig_noSuggestion;
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
        .request("accidentList.eventRectify", { eventId: v.id})
        .then((rs) => {
          let data = rs.record;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].picUrl && data[i].picUrl.length > 10) {
                var strObj = data[i].picUrl;
                data[i].picUrl = [];
                data[i].picUrl = this.formPictrue(strObj, data[i].picUrl);
              }
            }
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
          
          param.eventId = this.currentRowData.id;
          param.meaUser = val.meaUser;
          param.measure = val.measure;
          param.remark = val.remark;
          param.rectifyTime = val.rectifyTime;
          param.picUrl = val.picUrl;
          if(this.handleFormData.id) {
            param.id = this.handleFormData.id;
            param.cmyId = 0;
            urlStr = 'accidentList.suggest_update'
          } else {
            urlStr = 'accidentList.insert'
          }
          p = Object.assign({}, param);

        break;
        case "handle":
          var param = {};

          param.eventId = this.currentRowData.id;
          param.description = val.description;
          param.picUrl = val.picUrl;
          if(this.handleFormData.id) {
            param.id = this.handleFormData.id;
            urlStr = 'accidentList.suggest_update'
          } else {
            urlStr = 'accidentList.insert'
          }
          p = Object.assign({}, param);

        break;
        case "close":
          var param = {};

          param.id = this.currentRowData.id;
          param.submitFlag = 1;
          param.eventFlag = 3;
          param.reply = val.reply;
          urlStr = 'accidentList.publish'
          p = Object.assign({}, param);
          
        break;
        case "back":
          var param = {};

          param.id = this.currentRowData.id;
          param.submitFlag = 2;
          param.eventFlag = 3;
          param.reply = val.reply;
          urlStr = 'accidentList.publish'
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
              this.$bubble.request('accidentList.publish', {status: 2,id: this.currentRowData.id}).then(value => {
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
    injectionSubmit(u, n, s, p) {
      let obj = {};
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
      return new Promise((resolve, reject) => {
        this.$bubble.request("accidentList.page", {
          pageSize: s,
          pageNum: n,
          ...obj
        }).then((v) => {
          resolve({
            data: {
              records: v.record.records,
              total: v.record.total,
            },
          });
        });
      });
    },
    handlePictureCardPreview(file) {
      window.open(file.url);
    },
    customImportData() { console.log("导入") },
    exportData() { console.log("导出") },
  },
  created() {
    if(this.userType == 2) {
      this.initTreeData();
    }

    if (getQueryVariable("today")) {
      this.filter[3]["default"] = getToday(1);
    }
    this.filter[2]["default"] = getQueryVariable("eventFlag")
  },
};
</script>

<style lang="scss">
</style>