<template>
  <div class="box">
    <div class="box_top" style="height: 54px">
      <searchCom @changeCom="changeCom" @Reset="Reset" v-if="!userType" />
    </div>
    <!-- <a href=""></a> -->
    <div class="box_content">
      <div class="_left">
        <div class="_left-top">
          <div class="_left-top-flgs2" style="background-color: white">
            <div
              class="box-left-top-ri"
              style="width: 100%; height: 100%"
              ref="chart1"
              v-show="!charts1"
            ></div>
            <div style="width: 100%" v-show="charts1">
              <h1 style="text-align: center; font-size: 18px; font-weight: 700">
                参与人数占比
              </h1>
              <div class="q">
                <p>暂无数据</p>
              </div>
            </div>
          </div>
          <div class="_left-top-flgs2" style="background-color: white">
            <div
              class="box-left-top-ri"
              style="width: 100%; height: 100%"
              ref="chart2"
              v-show="!charts2"
            ></div>
            <div v-show="charts2" class="q">
              <p>暂无数据</p>
            </div>
          </div>
        </div>
        <div class="_left-center">
          <div class="letf-center-right">
            <div
              class="box-left-top-ri"
              style="width: 100%; height: 100%"
              ref="chart"
              v-show="!charts3"
            ></div>
            <div class="q" v-show="charts3">
              <p>暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import searchCom from "@/common/components/danger/searchCom/searchcom.vue";
import $echarts from "echarts";
export default {
  created() {
    let type = localStorage.getItem('userType');
    if (type != 1) {
      this.userType = false;
      // console.log(true);
      this.username = "企业";
    } else {
      this.userType = true;
      this.username = "车间";
      this.cmys = localStorage.getItem('orgId');
    }
  },
  components: { searchCom },
  data() {
    return {
      userType: false,
      cmys: "",
      pociltime: "",
      charts1: false,
      charts2: false,
      charts3: false,
      // ip:'192.168.199.1:8010/',
      username: "",
    };
  },
  mounted() {
    this.getTypeData(this.cmys);
    this.getNameData(this.cmys);
    this.getCmyData(this.cmys);
  },
  methods: {
    Reset() {
      this.charts1 = false;
      this.charts2 = false;
      this.charts3 = false;

      this.getTypeData(this.cmys);
      this.getNameData(this.cmys);
      this.getCmyData(this.cmys);
    },
    ShowDate(date) {
      var num = date;
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
    },
    changeCom(e, flag) {
      console.log(e);
      var cmyId = e.cmyId;
      var wordId = e.id;
      var id = e.id;
      if (flag == "workid") {
        this.getTypeData(cmyId, wordId);
        this.getNameData(cmyId, wordId);
        this.getCmyData(cmyId, wordId);
      } else {
        this.getTypeData(id);
        this.getNameData(id);
        this.getCmyData(id);
      }
    },
    //物资合格率
    getTypeData(cmyId, workId) {
      if (!cmyId) {
        cmyId = "";
      }
      this.$bubble.request("exam.Count", { cmyId: this.cmyId }).then((res) => {
        if (res.code == 0) {
          let object = res.record;
          var dota1 = [];
          var dota2 = [];
          if (object.length > 0) {
            for (let i = 0; i < object.length; i++) {
              dota1.push(object[i].worName);
              dota2.push({
                value: object[i].count,
                name: object[i].worName,
              });
            }
            this.initCharts1(dota1, dota2);
          } else {
            this.charts1 = true;
          }
        }
      });
      /**
       *
       * */
    },
    // 物资名称
    getNameData(cmyId, wordId) {
      if (!cmyId) {
        cmyId = "";
      }
      if (!wordId) {
        wordId = "";
      }
      this.$bubble
        .request("exam.People", {
          cmyId,
          wordId,
        })
        .then((res) => {
          if (res.code == 0) {
            let object = res.record;
            this.initCharts3(object);
          }
        });
    },
    // urgentMaterialAnalyse/getCountByCmyName  根据企业统计
    getCmyData(cmyId, wordId) {
      if (!cmyId) {
        cmyId = "";
      }
      if (!wordId) {
        wordId = "";
      }
      this.$bubble.request("exam.JoinPeople", { cmyId, wordId }).then((res) => {
        if (res.code == 0) {
          let object = res.record;
          var dota1 = [];
          var dota2 = [];
          var dota3 = [];
          for (let i = 0; i < object.length; i++) {
            dota1.push(object[i].fail);
            dota2.push(object[i].pass);
            dota3.push(object[i].time);

            
          }
          this.initCharts(dota1, dota2, dota3);
        }
      });
    },
    //  柱状图
    initCharts(dota1, dota2, dota3) {
      let myChart = $echarts.init(this.$refs.chart);
      myChart.setOption({
        color: ["#00eaff", "#00a317"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          text: "人员考核统计分析",
          // subtext: '纯属虚构',
        },
        legend: {
          // orient: 'vertical',
          right: 10,
          data: ["不合格人数", "合格人数"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: dota3,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            minInterval: 1,
          },
        ],
        series: [
          {
            name: "不合格人数",
            type: "bar",
            barWidth: "20%",
            data: dota1,
          },
          {
            name: "合格人数",
            type: "bar",
            barWidth: "20%",
            data: dota2,
          },
        ],
      });
      // window.onresize = myChart.resize();
    },
    //饼状图  1  left
    initCharts1(dota1, dota2) {
      dota2 = dota2.map((v) => v.value);
      dota2 = dota2.sort((a, b) => {
        return a - b;
      });
      let myChart = $echarts.init(this.$refs.chart1);
      var option = {
        color: ["#f35637", "#fc9900", "#f0cb00", "#13aae1"],
        title: {
          text: "参与人数占比",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b}<br />{a0}：{c0}人<br />",
        },
        // legend: {
        //   data: ["参与人数"],
        // },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: dota1,
          axisLabel: {
            formatter: function (e) {
              if (e.length > 5) {
                return e.substr(0, 5) + "...";
              } else {
                return e;
              }
            },
          },
        },
        dataZoom: {
          type: "slider", //
          yAxisIndex: [0], //表示y轴折叠
          start: 100,
          end: 75,
          show: true,
        },
        series: [
          {
            name: "参与人数",
            type: "bar",
            data: dota2,
            color: ["#13aae1"],
          },
        ],
      };
      myChart.setOption(option);
    },
    //饼状图 2 right
    initCharts3(object) {
      // console.log(object)
      let myChart = $echarts.init(this.$refs.chart2);
      myChart.setOption({
        title: {
          text: "考试通过率",
          left: "center",
        },
        color: ["#b6a2df", "#2dc7c9", "#5bb0f0", "#ffb880"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
          top: 60,
          data: ["通过", "未通过"],
        },
        series: [
          {
            name: "人员通过率",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: object[0].pass, name: "通过" },
              { value: object[0].fail, name: "未通过" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>
<style lang="less" scoped>
.box {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 95%;
  display: flex;
  flex-wrap: wrap;
}
.box_top {
  width: 100%;
  height: 10px;
  display: flex;
  flex-wrap: wrap;
}

.box_top-left {
  width: 50%;
}
.box_top_text1 {
  font-size: 25px;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  margin-left: 30px;
}

.box_top_text2 {
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
  color: black;
  margin-left: 30px;
}
.box_fize {
  color: black;
  margin-left: 30px;
}
.ivu-select-selection {
  height: 35px;
  float: right;
  width: 180px;
  margin-top: 10px;
  margin-right: 220px;
  border-radius: 5px;
}

.ivu-select-selection-li {
  height: 35px;
  float: right;
  width: 180px;
  margin-top: 10px;
  margin-right: 20px;
  border-radius: 5px;
}
.box_content {
  width: 100%;
  height: 100%;
  margin-top: -10px;
  display: flex;
}
._left {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
._left-top {
  width: 100%;
  height: 48%;
  display: flex;
}
._left-top-flgs {
  width: 48%;
  height: 100%;
  margin-left: 35px;
  /* background-color:white; */
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
}
._left-top-flgs2 {
  width: 48%;
  height: 100%;
  margin-left: 10px;
  /* background-color:white; */
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
}
._left-center {
  width: 100%;
  height: 49%;
  margin-top: 30px;
  display: flex;
  /* flex-wrap: wrap; */
  /* margin-top: 10px; */
}
.letf-center-left {
  background-color: white;
  width: 48%;
  height: 100%;
  margin-top: -20px;
  margin-left: 35px;
  border-radius: 10px;
}
.letf-center-right {
  background-color: white;
  width: 98%;
  height: 100%;
  margin-top: -20px;
  margin-left: 10px;
  border-radius: 10px;
}
.top-box {
  width: 100%;
  height: 20%;
  border-radius: 10px;
  background-color: #1a386a;
  align-items: center;
  /*实现水平居中*/
  justify-content: center;
}
.botton-top {
  width: 49%;
  height: 37%;
  border-radius: 10px;
  margin-top: 10px;
}
.fizecolor {
  color: #ffffff;
}
.fizecolor1 {
  color: #ffffff;
  font-size: 25px;
}
.fizecolor2 {
  color: #ffffff;
  font-size: 30px;
}
.fizecolor3 {
  color: #ffffff;
  font-size: 16px;
  text-align: left;
  /* display: inline-block  */
}
.q {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.chartEmpty {
  /*border-radius: 5px;*/
  /*border: 1px solid rgb(221, 221, 221);*/
  text-align: center;
  font-size: 16px;
  color: rgb(51, 51, 51);
  /*position: absolute;*/
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 2px 2px 10px -1px rgb(0 0 0 / 12%);
  width: 200px;
  height: 40px;
}
</style>
