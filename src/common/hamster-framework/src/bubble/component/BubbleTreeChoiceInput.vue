<template>
  <div class="BubbleObjectChoiceInput">
    <div class="BubbleObjectChoiceAppendInput">
      <div class="inner_text" :class="{ multiple: selectMode == 'multiple' }">
        <span
          class="inner_empty"
          v-if="
            selectMode == 'single'
              ? !currentSelected || !currentSelected.text
              : !currentSelected || !currentSelected.length
          "
          :style="{ paddingLeft: selectMode == 'single' ? '0' : '10px' }"
          >请选择所需数据</span
        >
        <span v-if="selectMode == 'single' && currentSelected">{{
          currentSelected.text
        }}</span>
        <div v-if="selectMode == 'multiple' && currentSelected">
          <el-tag
            disable-transitions
            type="info"
            v-for="item in currentSelected"
            :key="item.value"
            closable
            @close="deleteSelect(item)"
            >{{ item.text }}</el-tag
          >
        </div>
      </div>
      <button
        @click="open"
        type="button"
        class="el-button BubbleObjectChoiceAppendButton el-button--primary"
      >
        <span>选择</span>
      </button>
    </div>
    <!-- <el-input class="BubbleObjectChoiceAppendInput" :disabled="true" placeholder="请选择内容" v-model="text">
            <el-button class="BubbleObjectChoiceAppendButton" type="primary" @click="open" slot="append">选择</el-button>
        </el-input> -->
    <BubbleTreeChoice
      ref="BubbleTreeChoice"
      :title="title"
      :type="type"
      :rurl="rurl"
      :visible.sync="visible"
      :config="choiceConfig"
      @onselect="dataChoice"
      :childrenKey="childrenKey"
      :selectMode="selectMode"
      :defaultSelected="currentSelected"
      :defaultFilter="defaultFilter"
      :primaryKey="primaryKey"
    />
  </div>
</template>

<script>
export default {
  name: "BubbleTreeChoiceInput",
  props: {
    value: {
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    rurl: {
      type: String,
      required: false,
    },
    childrenKey: {
      type: String,
      required: false,
      default: "children",
    },
    //默认选中项
    defaultSelected: {
      type: [Array, Object],
      required: false,
    },
    //主键
    primaryKey: {
      type: String,
      required: false,
    },
    config: {
      type: [String, Object],
      required: true,
    },
    //默认筛选参数
    defaultFilter: {
      type: Array,
      required: false,
    },
    selectMode: {
      type: String,
      required: false,
      default: "single",
    },
  },
  computed: {
    choiceConfig() {
      if (typeof this.config === "string") {
        return this.$bubble.ChoiceConfig[this.config];
      } else {
        return this.config;
      }
    },
  },
  data() {
    return {
      visible: false,
      currentSelected: null,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    deleteSelect(v) {
      this.$refs.BubbleTreeChoice.deleteSelect(v);
      if (this.selectMode == "single") {
        this.currentSelected = null;
      } else {
        this.currentSelected.splice(this.currentSelected.indexOf(v), 1);
        if (!this.currentSelected.length) {
          this.currentSelected = null;
        }
      }
      this.$emit(
        "input",
        this.currentSelected instanceof Array
          ? this.currentSelected.map((v) => v.value).join(",")
          : this.currentSelected
          ? this.currentSelected.value
          : this.currentSelected
      );

      this.$emit(
        "change",
        this.currentSelected instanceof Array
          ? this.currentSelected.map((v) => v.value).join(",")
          : this.currentSelected
          ? this.currentSelected.value
          : this.currentSelected
      );
    },
    dataChoice(v, e) {
      if (v) {
        this.currentSelected = v;
      } else {
        this.currentSelected = null;
      }
      this.$emit(
        "input",
        this.currentSelected instanceof Array
          ? this.currentSelected.map((v) => v.value).join(",")
          : this.currentSelected
          ? this.currentSelected.value
          : this.currentSelected
      );
      this.$emit(
        "labelName",
        this.currentSelected instanceof Array
          ? this.currentSelected.map((v) => v.value).join(",")
          : this.currentSelected
          ? this.currentSelected.text
          : this.currentSelected
      );
      this.$emit(
        "change",
        this.currentSelected instanceof Array
          ? this.currentSelected.map((v) => v.value).join(",")
          : this.currentSelected
          ? this.currentSelected.value
          : this.currentSelected
      );
    },
    reset() {
      this.currentSelected = null;
    },
  },
  created() {
    console.log(this.primaryKey);

    if (this.defaultSelected) {
      this.currentSelected =
        this.selectMode == "single"
          ? this.defaultSelected instanceof Array
            ? this.defaultSelected[0]
            : this.defaultSelected
          : this.defaultSelected;
    }
    this.$watch("defaultSelected", (n) => {
      this.currentSelected =
        this.selectMode == "single" ? (n instanceof Array ? n[0] : n) : n;
    });
  },
};
</script>

<style lang="scss" scoped>
.BubbleObjectChoiceInput {
  width: 100%;

  .BubbleObjectChoiceAppendInput {
    width: 100%;
    position: relative;

    .inner_text {
      background-color: #fff;
      border-color: #e4e7ed;
      color: #c0c4cc;
      -webkit-appearance: none;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      font-size: inherit;
      line-height: 37px;
      outline: 0;
      padding: 0 10px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 100%;
      word-break: break-all;
      padding-right: 85px;

      .inner_empty {
        color: #c0c4cc;
      }

      &.multiple {
        padding-left: 0;
        padding-right: 70px;
      }

      span {
        margin: 0 4px;
      }
    }

    .BubbleObjectChoiceAppendButton {
      color: #fff !important;
      background-color: #409eff !important;
      border-color: #409eff !important;
      border-radius: 0 4px 4px 0 !important;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
}
</style>