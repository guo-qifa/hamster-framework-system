<template>
  <div class="BubbleObjectChoiceInput">
    <div class="BubbleObjectChoiceAppendInput">
      <div class="inner_text" :class="{ multiple: selectMode == 'multiple' }">
        <span
          class="inner_empty"
          v-if="
            selectMode == 'single'
              ? !input || !input.text
              : !input || !input.length
          "
          :style="{ paddingLeft: selectMode == 'single' ? '0' : '10px' }"
          >请选择所需数据</span
        >
        <span v-if="selectMode == 'single' && input">{{ input.text }}</span>
        <div v-if="selectMode == 'multiple' && input">
          <el-tag
            disable-transitions
            type="info"
            v-for="item in input"
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
    <BubbleTreeListChoice
      ref="BubbleObjectChoice"
      :title="title"
      :type="type"
      :rurl="rurl"
      :visible.sync="visible"
      :treeConfig="treeConfig"
      :tableConfig="tableConfig"
      @onselect="dataChoice"
      :search="search"
      :treeTable="treeTable"
      :selectMode="selectMode"
      :defaultSelected="defaultSelected"
      :defaultFilter="defaultFilter"
      :linkedKey="linkedKey"
    />
  </div>
</template>

<script>
export default {
  name: "BubbleTreeListChoiceInput",
  props: {
    value: {
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    linkedKey: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
    },
    rurl: {
      type: String,
      required: false,
    },
    treeTable: {
      type: String,
      required: false,
    },
    treeConfig: {
      type: [String, Object],
      required: true,
    },
    tableConfig: {
      type: [String, Object],
      required: true,
    },
    search: {
      type: Array,
      required: false,
    },
    //默认选中项
    defaultSelected: {
      type: [Array, Object],
      required: false,
    },
    //默认选中项
    defaultFilter: {
      type: [Array, Object],
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
      input: null,
      visible: false,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    deleteSelect(v) {
      this.$refs.BubbleObjectChoice.deleteSelect(v);
      if (this.selectMode == "single") {
        this.input = null;
      } else {
        this.input.splice(this.input.indexOf(v), 1);
        if (!this.input.length) {
          this.input = null;
        }
      }
      this.$emit(
        "input",
        this.input instanceof Array
          ? this.input.map((v) => v.value).join(",")
          : this.input
          ? this.input.value
          : this.input
      );
      this.$emit(
        "change",
        this.input instanceof Array
          ? this.input.map((v) => v.value).join(",")
          : this.input
          ? this.input.value
          : this.input
      );
    },
    dataChoice(v, e) {
      if (v) {
        this.input = v;
      } else {
        this.input = null;
      }
      this.$emit(
        "input",
        this.input instanceof Array
          ? this.input.map((v) => v.value).join(",")
          : this.input
          ? this.input.value
          : this.input
      );
      this.$emit(
        "change",
        this.input instanceof Array
          ? this.input.map((v) => v.value).join(",")
          : this.input
          ? this.input.value
          : this.input
      );
    },
    reset() {
      this.input = null;
    },
  },
  created() {
    if (this.defaultSelected) {
      this.input = this.defaultSelected;
    }
    this.$watch("defaultSelected", (n) => {
      this.input = n;
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