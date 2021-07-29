<template>
  <div>
      <BubblePopForm
          ref="bubblePopForm"
          :nosubmit="true"
          :title="'查看详情'"
          :visible="visible"
          :formData="formData"
          :formConfig="formConfig"
          :submit="submit"
          :width="'1000px'"
          close-text="关闭"
          :beforeClose="beforeClose"
      >
      <slot></slot>
      </BubblePopForm>
  </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        formData: {
            type: Object,
            required: true,
        },
        formConfig: {
            type: Array,
            required: true,
        },
        beforeClose: {
            type: Function,
            required: true,
        },
    },
    methods: {
        submit() {},
    }
}
</script>

<style>

</style>