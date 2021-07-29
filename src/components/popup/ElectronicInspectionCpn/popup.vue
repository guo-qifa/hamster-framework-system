<template>
  <!-- 第二个弹窗 -->
  <el-dialog
    :visible.sync="dialogVisible1"
    width="50%"
    modal
    lock-scroll
    title="巡检"
  >
    <el-form ref="form" :model="fromTwo" label-width="120px">
      <el-form-item label="关联的危害因素">
        <el-input size="mini" v-model="fromTwo.hazardName"></el-input>
      </el-form-item>
      <!-- 异常状态展示的内容  start-->
      <template v-if="flag">
        <el-form-item label="隐患类型">
          <el-select
            v-model="fromTwo.defectManageType"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in fromTwo.defectManageInsTypeLists"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隐患等级">
          <el-select
            v-model="fromTwo.defectManageInsType"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in fromTwo.defectManageInsTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隐患整改时间">
          <el-date-picker
            v-model="fromTwo.rectifyTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            size="mini"
          >
            <!-- :picker-options="pickerOptions" -->
          </el-date-picker>
        </el-form-item>
      </template>
      <!-- 异常状态展示的内容  end-->
      <el-form-item label="检查描述">
        <el-input
          size="mini"
          v-model="fromTwo.content"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改建议">
        <el-input
          size="mini"
          v-model="fromTwo.proposal"
        ></el-input>
      </el-form-item>
      <!-- 图片 start -->
      <el-form-item label="隐患图片">
        <el-upload
          :action="imgUploadUrl"
          :headers="uploadHeaders"
          :file-list="fileList"
          accept="image/png,image/jpg,image/jpeg"
          list-type="picture-card"
          :on-success="handleSuccess"
        >
          <i slot="default" class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <!-- 图片 end -->
      <el-form-item label="巡查结果">
        <el-radio-group
          size="mini"
          @change="radioChange"
          v-model="fromTwo.result"
        >
          <el-radio label="00">正常</el-radio>
          <el-radio label="01">异常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="showSubmit" style="position: absolute;right: 30px;bottom:0">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils";
export default {
  props: ['showSubmit'],
  created() {
    this.getDiotcode``;
  },
  computed: {
    uploadHeaders() {
      return {
        loginTokensAnjian: getToken(),
      };
    },
  },
  data() {
    const imgUploadUrl = this.$bubble.config.UploadHost;
    const uploadPrefix = this.$bubble.config.uploadPrefix;
    return {
      dialogVisible1: false, // 弹窗的开关
      imgUploadUrl,
      uploadPrefix,
      fileList: [],
      fromTwo: {}, // 获取的数据对象
      diotcode: {}, // 这个页面的字典
      defectManageInsTypeList: [
        {
          value: "1",
          label: "一般",
        },
        {
          value: "2",
          label: "较大",
        },
        {
          value: "3",
          label: "重大",
        },
      ],
      flag: false, // 判断是否展示的内容
    };
  },
  methods: {
    /**
     * @name:点击单选框 产生的变化
     * @Author: liuYaoYu
     * @param {status}
     * @return {*}
     * @Date: 2021-04-27 13:58:02
     * @LastEditTime: Do not Edit
     */
    radioChange(status) {
      status == "01" ? (this.flag = true) : (this.flag = false);
    },
    /**
     * @name: 点击照片 产生的事件
     * @Author: liuYaoYu
     * @param {*} file
     * @return {*}
     * @Date: 2021-04-27 09:59:16
     * @LastEditTime: Do not Edit
     */
    handlePictureCardPreview(file) {
      console.log(file);
    },
    show(e) {
      this.dialogVisible1 = true;
      let newInfo = Object.assign({}, e);
      info.call(this, newInfo);
      /**
       * @name:处理数据
       * @Author: liuYaoYu
       * @param {*} info
       * @return {*}
       * @Date: 2021-04-27 11:43:55
       * @LastEditTime: Do not Edit
       */
      async function info(info) {
        if (!info) {
          return;
        } else {
          /**
           * 处理数据图片
           */
          console.log(info.pic)
          if (info.pic && info.pic.length > 10) {
            if (typeof info.pic == 'string' && info.pic.indexOf("[") > -1 && info.pic.indexOf("]") > -1) {
              this.fileList = JSON.parse(info.pic).map((v) => ({ url: typeof v == 'string' ? v : v.url }));
            }
            if(typeof info.pic == 'string') {
              this.fileList = info.pic.split(',').map(v => ({url: v}));
            }
            if (typeof info.pic == 'object' && info.pic.length > 0) {
              this.fileList = info.pic.map((v) => ({ url: typeof v == 'string' ? v : v.url }));
            }
          } else {
            this.fileList = [];
          }
          /**
           * 处理等级
           * */
          info.defectManageInsTypeList = this.defectManageInsTypeList;
          /**
           * 处理字典显示
           * */
          info.defectManageInsTypeLists = await this.getDiotcode.call(this);
          /**
           * 判断是否展示内容  单选框判断
           * */
          this.radioChange(info.result);
          /**
           * 赋值数据进行展示
           * */
          this.$nextTick(() => {
            this.fromTwo = info;
          });
        }
      }
    },
    /**
     * @name: 获取字典
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-27 10:30:03
     * @LastEditTime: Do not Edit
     */
    async getDiotcode() {
      let { code, record } = await this.$bubble.request("polling.diotcode");
      let res = {}; // 返回的数据
      if (code == 0) {
        res = record.map((v) => {
          return { value: v.subDictValue, label: v.subDictName };
        });
      } else {
        this.$message.error("数据请求失败");
      }
      return res;
    },
    handleSuccess(res, file) {
      var url = res.object.url;

      var newUrl = this.uploadPrefix + url;

      this.fileList.push({url: newUrl});
    },
    onSubmit() {
      this.fromTwo.pic = [];
      if(this.fileList.length) {
        for(let i = 0; i < this.fileList.length; i ++) {
          this.fromTwo.pic.push(this.fileList[i].url)
        }
      }

      let p = {
        actInspectRecordId: this.fromTwo.actInspectRecordId,
        id: this.fromTwo.id,
        inspectMeasureItemPojoList: this.fromTwo.inspectMeasureItemPojoList,
        pic: this.fromTwo.pic,
        proposal: this.fromTwo.proposal,
        result: this.fromTwo.result,
        hazardName: this.fromTwo.hazardName,
        riskName: this.fromTwo.riskName,
        content: this.fromTwo.content,
        defectManageType: this.fromTwo.defectManageType,
        defectManageInsType: this.fromTwo.defectManageInsType,
        hazardRiskId: this.fromTwo.hazardRiskId,
        rectifyTime: this.fromTwo.rectifyTime,
      }

      this.$bubble.request('hazardRisk.check', p).then(rs => {
        if(rs.code == '0') {
          this.handleMessage(this.fromTwo.id, 4)
          this.$message.success("操作成功！")
          this.$emit("reload");
          this.dialogVisible1 = false;
        }
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
  },
};
</script>

<style>
</style>