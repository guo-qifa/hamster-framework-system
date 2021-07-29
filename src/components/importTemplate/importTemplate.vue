<template>
  <div class="upload">
    <Upload
      class="fileUpload"
      :multiple="true"
      :action="uploadUrl"
      ref="upload"
      :before-upload="handleUpload"
      :headers="uploadHeaders"
      :on-success="fileSuccess"
      :on-error="fileError"
      accept=".xls, .xlsx"
    >
      <Button icon="ios-cloud-upload-outline">
        <span>点击选择Excel文件</span>
      </Button>
    </Upload>
    <span class="content_text" style="margin-left: 10px;" v-if="file">{{ file.name }}</span>
    <p class="content_text">文件小于10M，内容须符合模板规范</p>
    <p class="content_text">导入文档前，请先添加好相应的类目</p>
    <a
    ref="a"
      class="downLoad"
      :href="`http://safety.rfyfb.com/bak/templete/${templateName}.xls`"
      :download="`${templateText}.xls`"
      >下载规范文档</a
    >
  </div>
</template>

<script>
import { getToken } from "@/utils";
export default {
  computed: {
    uploadHeaders() {
      return {
        loginTokensAnjian: getToken(),
      };
    },
    uploadUrl() {
        return this.$bubble.config.Host.default + this.importUrl;
    }
  },
  data() {
    return {
      file: null
    };
  },
  props: {
    templateName: {
      type: String,
      require:true
    },
    templateText: {
      type: String,
      default: '模板'
    },
    importUrl: {
      type: String,
      require:true
    },
  },
  created() {
    this.$emit("setPageSize", 500); // 弹出层的大小
    this.$emit("setPageTopSize", 200); // 弹出层 距离 顶部的距离
    this.$emit("setTitle", "导入");
    this.$emit("setButtonCenter");
    this.$emit("setPageActions", [
      {
        text: "取消",
        action: "save",
        handle: () => {
          this.$emit("hide");
        },
      },
      {
        text: "上传",
        action: "save",
        theme: "success",
        handle: () => {
          this.upload();
        },
      },
    ]);
  },
  methods: {
    //上传
    upload() {
      if(!this.file) {
        this.$Message.error({
          content: "请选择Excel文件！",
          duration: 5,
          closable: true
        });
        return
      }
      //触发上传
      this.$refs.upload.post(this.file);
    },
    //上传前验证
    handleUpload(file) {
      //验证文件类型
      if(file.name.indexOf('.xls') > -1) {
        this.file = file;
      } else {
        this.$Message.error({
          content: "请选择Excel文件！",
          duration: 5,
          closable: true
        });
      }
      return false;
    },
  
      fileSuccess(res) { 
      if (res.code == 0) {
        this.$Message.success({
          content: "导入成功！",
          duration: 5,
          closable: true,
        });
        this.$emit("close");
      } else {
        this.$Message.error({
       content: res.message,// '文件导入失败，请检查文件内容是否对应！',
          duration: 5,
          closable: true,
        });
        this.$emit("hide");
      }
    },
    fileError() {
    
      this.$Message.error({
        content: "导入失败！",
        duration: 5,
        closable: true
      });
      this.$emit("hide");
    },
  },
};
</script>

<style lang="less" scoped>
.upload {
  display: flex;
  height: 260px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  > .fileUpload {
    margin-top: 30px;
  }
}
.content_text {
  margin-top: 20px;
  font-size: 14px;
}
.downLoad {
  padding: 10px;
  box-sizing: border-box;
  margin-top: 20px;
  color: blue;
  &:hover {
    cursor: pointer;
  }
}
</style>
