<template>
  <div class="ZsearchCom">
    <el-date-picker
      v-model="dataTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      value-format="yyyy-MM-dd"
      @change="changeTimes"
      size="small"
      unlink-panels
      :picker-options="pickerOptions"
      end-placeholder="结束日期"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  },
  data() {
    return {
      dataTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 182);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    changeTimes() {
      this.$emit("changeTime", this.dataTime);
    },

    defaultStartTime() {
      return this.startTime
        ? this.startTime
        : () => {
            var num = 365;
            let n = num;
            let d = new Date();
            let year = d.getFullYear();
            let mon = d.getMonth() + 1;
            let day = d.getDate();
            if (day <= n) {
              if (mon > 1) {
                mon = mon - 1;
              } else {
                year = year - 1;
                mon = 12;
              }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();
            let s =
              year +
              "-" +
              (mon < 10 ? "0" + mon : mon) +
              "-" +
              (day < 10 ? "0" + day : day);
            return s;
          };
    },
    defaultEndTime() {
      return this.endTime
        ? this.endTime
        : () => {
            var num = 0;
            let n = num;
            let d = new Date();
            let year = d.getFullYear();
            let mon = d.getMonth() + 1;
            let day = d.getDate();
            if (day <= n) {
              if (mon > 1) {
                mon = mon - 1;
              } else {
                year = year - 1;
                mon = 12;
              }
            }
            d.setDate(d.getDate() - n);
            year = d.getFullYear();
            mon = d.getMonth() + 1;
            day = d.getDate();
            let s =
              year +
              "-" +
              (mon < 10 ? "0" + mon : mon) +
              "-" +
              (day < 10 ? "0" + day : day);
            return s;
          };
    }
  },
  mounted() {
    let start = this.defaultStartTime()();
    let end = this.defaultEndTime()();
    this.dataTime = [start, end];
    console.log(this.dataTime);
  }
};
</script>
<style lang="less" scoped>
.ZsearchCom {
  margin: 8px 8px 0 17px;
}
</style>
<style>
.ZsearchCom .el-range-separator {
  width: 10%;
}
</style>
