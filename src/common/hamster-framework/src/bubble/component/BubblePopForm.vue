<template>
  <div class="BubblePopFormBox">
    <el-dialog
      v-if="mode == 'dialog'"
      append-to-body
      :close-on-click-modal="false"
      :width="width ? width : '600px'"
      :title="title"
      :visible.sync="DialogVisible"
      :before-close="beforeClose"
      destroy-on-close
    >
      <BubbleForm
        ref="BubbleForm"
        :dialogFilterCode="dialogFilterCode"
        :nosubmit="nosubmit"
        :closeText="closeText"
        :formConfig="formConfig"
        :title="title"
        :formData="formData"
        @submit="submit"
        @submitOk="close"
        :close="close"
        :labelWidth="labelWidth"
        :afterSubmit="afterSubmit"
        :beforeSubmit="beforeSubmit"
      />
      <slot></slot>
    </el-dialog>
    <el-drawer
      :size="width ? width : '600'"
      v-if="mode == 'drawer'"
      :title="title"
      :visible.sync="DialogVisible"
      direction="rtl"
      :before-close="beforeClose"
    >
      <div style="padding: 0 20px">
        <BubbleForm
          ref="BubbleForm"
          :dialogFilterCode="dialogFilterCode"
          :nosubmit="nosubmit"
          :closeText="closeText"
          :title="title"
          :formConfig="formConfig"
          :formData="formData"
          @submit="submit"
          @submitOk="close"
          :close="close"
          :labelWidth="labelWidth"
          :afterSubmit="afterSubmit"
          :beforeSubmit="beforeSubmit"
        />
        <slot></slot>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "BubblePopForm",
  props: {
    dialogFilterCode: {
      type: String,
    },
    mode: {
      type: String,
      required: false,
      default: "dialog",
    },
    //隐藏提交按钮
    nosubmit: {
      type: Boolean,
      required: false,
    },
    //取消按钮文案
    closeText: {
      type: String,
      required: false,
    },
    //标题
    title: {
      type: String,
      required: false,
    },
    //弹窗是否显示
    visible: {
      type: Boolean,
      required: true,
    },
    afterSubmit: {
      type: Function,
      required: false,
    },
    beforeSubmit: {
      type: Function,
      required: false,
    },
    //弹窗宽度
    width: {
      type: [String, Number],
      required: false,
    },
    //弹窗关闭回调
    beforeClose: {
      type: Function,
      required: false,
    },
    //表单提交
    submit: {
      type: Function,
      required: true,
    },
    //以下参数详见BubbleForm
    formConfig: {
      type: Array,
      required: true,
    },
    formData: {
      type: Object,
      required: false,
    },
    labelWidth: {
      type: [String, Number],
      required: false,
    },
  },
  data() {
    return {
      DialogVisible: false,
    };
  },
  methods: {
    close() {
      if (this.beforeClose) {
        this.beforeClose(() => {
          this.DialogVisible = false;

          this.$emit("update:visible", false);
        });
      } else {
        this.DialogVisible = false;
        this.$emit("update:visible", false);
      }
    },
  },
  created() {
    this.$watch("DialogVisible", (n) => {
      this.$emit("update:visible", n);
    });
    this.$watch("visible", (n) => {
      this.DialogVisible = n;
      this.$nextTick(() => {
        if (!n) {
          this.$refs.BubbleForm.resetFields();
          this.$refs.BubbleForm.resetStep();
        } else {
          this.$refs.BubbleForm.initData();
          this.$refs.BubbleForm.plugsRender();
          this.$refs.BubbleForm.initEvent();
        }
      });
    });
  },
};
</script>

<style lang="scss">
.BubblePopFormBox {
  .el-drawer__header {
    margin-bottom: 20px;
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }
}
</style>