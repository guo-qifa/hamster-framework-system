<template>
  <div id="total" class="i-scrollbar-hide">
    <div class="title" style="margin: 1.3vw auto 0vw">
      <div class="beforeBorder"></div>
      待办统计
    </div>
    <div class="content">
      <div class="totalShow" style="">
        <div style="text-align: center">
          <img src="~@/assets/total/zongshu.png" alt="" />
          <h3>待办总数</h3>
          <h3>{{ totalNum }}</h3>
        </div>
      </div>
      <div class="totalShow" style="">
        <div style="text-align: center">
          <img src="~@/assets/total/daiban.png" alt="" />
          <h3>完成待办</h3>
          <h3>{{ finishNum }}</h3>
        </div>
      </div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none" v-if="userType == 1"></div>
    </div>
    <div class="title" style="margin: 1.3vw auto 0vw">
      <div class="beforeBorder"></div>
      待办分类
    </div>
    <div class="content">
      <Card class="cardStyle">
        <div class="card-box">
          <div class="no-hover">
            <img src="~@/assets/total/yujing-min.png" alt="" />

            <h3>预警</h3>

            <h3>{{ yujingNum }}</h3>
          </div>
          <div class="hover">
            <img src="~@/assets/total/yujing-min.png" alt="" />

            <div>
              <div @click="yujingfuToday">
                <h3>今日待办</h3>
                <h3>{{ yujingNumToday }}</h3>
              </div>
              <div @click="yujingfu">
                <h3>总待办</h3>
                <h3>{{ yujingNum }}</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card class="cardStyle">
        <div class="card-box">
          <div class="no-hover">
            <img src="~@/assets/total/shigu-min.png" alt="" />

            <h3>事故事件</h3>

            <h3>{{ shiguNum }}</h3>
          </div>
          <div class="hover">
            <img src="~@/assets/total/shigu-min.png" alt="" />

            <div>
              <div @click="shigufuToday">
                <h3>今日待办</h3>
                <h3>{{ shiguNumToday }}</h3>
              </div>
              <div @click="shigufu">
                <h3>总待办</h3>
                <h3>{{ shiguNum }}</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card class="cardStyle">
        <div class="card-box">
          <div class="no-hover">
            <img src="~@/assets/total/yinhuan-min.png" alt="" />

            <h3>隐患处理</h3>

            <h3>{{ yinhuanNum }}</h3>
          </div>
          <div class="hover">
            <img src="~@/assets/total/yinhuan-min.png" alt="" />

            <div>
              <div @click="yinhuanfuToday">
                <h3>今日待办</h3>
                <h3>{{ yinhuanNumToday }}</h3>
              </div>
              <div @click="yinhuanfu">
                <h3>总待办</h3>
                <h3>{{ yinhuanNum }}</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card class="cardStyle">
        <div class="card-box">
          <div class="no-hover">
            <img src="~@/assets/total/xunjian.png" alt="" />

            <h3>巡检记录</h3>

            <h3>{{ xunjianNum }}</h3>
          </div>
          <div class="hover">
            <img src="~@/assets/total/xunjian.png" alt="" />

            <div>
              <div @click="recorderToday">
                <h3>今日待办</h3>
                <h3>{{ xunjianNumToday }}</h3>
              </div>
              <div @click="recorder">
                <h3>总待办</h3>
                <h3>{{ xunjianNum }}</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card class="cardStyle">
        <div class="card-box">
          <div class="no-hover">
            <img src="~@/assets/total/xuexi.png" alt="" />

            <h3>学习任务</h3>

            <h3>{{ xuexiNum + xuexiIngNum }}</h3>
          </div>
          <div class="hover">
            <img src="~@/assets/total/xuexi.png" alt="" />

            <div>
              <div @click="xuexiFu">
                <h3>今日过期</h3>
                <h3>{{ xuexiNum }}</h3>
              </div>
              <div @click="xuexiIngFu">
                <h3>过期总数</h3>
                <h3>{{ xuexiIngNum }}</h3>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card class="cardStyle chengnuo-box" v-if="userType == 2">
        <div style="text-align: center" @click="chengnuoFu">
          <img src="~@/assets/total/chengnuo.png" alt="" />
          <h3>承诺卡</h3>
          <h4 v-if="promised" style="color: green">已承诺</h4>
          <h4 v-else style="color: #3acc3a">未承诺</h4>
        </div>
      </Card>
    </div>
    <div class="title" style="margin: 1.3vw auto 0vw" v-if="false">
      <div class="beforeBorder"></div>
      记分
    </div>
    <div class="content" v-if="false">
      <div class="totalShow" style="">
        <div style="text-align: center">
          <img src="~@/assets/total/zongshu.png" alt="" />
          <h3>企业记分</h3>
          <h3>0</h3>
        </div>
      </div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none"></div>
      <div class="totalShow" style="border: none" v-if="userType == 1"></div>
    </div>
    <div class="two" v-if="userType == 2">
      <div class="box">
        <div class="title" style="margin: 1.3vw auto 0vw">
          <div class="beforeBorder"></div>
          承诺率
        </div>
        <div class="cnl">
          <div id="precent" class="con"></div>
        </div>
      </div>
      <div class="box">
        <div class="title" style="margin: 1.3vw auto 0vw">
          <div class="beforeBorder"></div>
          记分
        </div>
        <div class="cnljf cnl">
          <div id="precent1" class="jfPie"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import promiseDetail from "./components/promiseDetail";
import comintegral from "./components/comintegral";
import $echarts from 'echarts'
export default {
  data: function () {
    return {
      wite: "",
      promised: false,

      userType: localStorage.getItem('userType'), //企业端true, 政府端false
      beginTime: "",
      endTime: "",
      yujingNum: 0,
      shiguNum: 0,
      yinhuanNum: 0,
      xunjianNum: 0,
      xuexiNum: 0,
      qitaNum: 0,

      yujingNumToday: 0,
      shiguNumToday: 0,
      yinhuanNumToday: 0,
      xunjianNumToday: 0,
      xuexiIngNum: 0,

      totalNum: 0,
      addNum: 0,
      finishNum: 0,

      total: 0,
      totle: 0,
      ring: 0,
      accident: 0,
      risk: 0,
      xuexi: 0,
      xunjian: 0,
      dayTotal: "",
      chengnuo: 0,
    };
  },
  methods: {
    yujingfu() {
      var statuVal = this.userType == 1 ? "1" : "3";
      $channel.$emit("tabs", "deviceReport");
      this.$router.push({
        name: "deviceReport",
        query: { id: 186, dealStatus: statuVal },
      });
    },
    yujingfuToday() {
      var statuVal = this.userType == 1 ? "1" : "3";
      $channel.$emit("tabs", "deviceReport");
      this.$router.push({
        name: "deviceReport",
        query: { id: 186, dealStatus: statuVal, today: 1 },
      });
    },

    shigufu() {
      var statuVal = this.userType == 1 ? "1" : "2";
      $channel.$emit("tabs", "accidentList");
      this.$router.push({
        name: "AccidentList",
        query: { id: 150, eventFlag: statuVal },
      });
    },
    shigufuToday() {
      var statuVal = this.userType == 1 ? "1" : "2";
      $channel.$emit("tabs", "accidentList");
      this.$router.push({
        name: "AccidentList",
        query: { id: 150, eventFlag: statuVal, today: 1 },
      });
    },

    yinhuanfu() {
      var statuVal = this.userType == 1 ? "1" : "2";
      $channel.$emit("tabs", "controlList");
      this.$router.push({
        name: "LatentControlList",
        query: { id: 144, status: statuVal },
      });
    },
    yinhuanfuToday() {
      var statuVal = this.userType == 1 ? "1" : "2";
      $channel.$emit("tabs", "controlList");
      this.$router.push({
        name: "LatentControlList",
        query: { id: 144, status: statuVal, today: 1 },
      });
    },

    recorder() {
      var statuVal = this.userType == 1 ? "01" : "04";
      $channel.$emit("tabs", "electronicInspection");
      this.$router.push({
        name: "ElectronicInspection",
        query: { id: 138, patState: statuVal },
      });
    },
    recorderToday() {
      var statuVal = this.userType == 1 ? "01" : "04";
      $channel.$emit("tabs", "electronicInspection");
      this.$router.push({
        name: "ElectronicInspection",
        query: { id: 138, patState: statuVal, today: 1 },
      });
    },

    xuexiFu() {
      // this.$router.push({ name: "dangerNoticeList", query: { type: 5 } });
      // window.open('http://safety.rfyfb.com/spms-front/index.html?token=' + localStorage.token + '&#/wholeprocess/train-test/taskManage?status=0')
      $channel.$emit("tabs", "taskRecord");
      this.$router.push({
        name: "taskRecord",
        query: { id: 426, missionStatus: "1", today: 1 },
      });
    },
    xuexiIngFu() {
      // this.$router.push({ name: "dangerNoticeList", query: { type: 5 } });
      // window.open('http://safety.rfyfb.com/spms-front/index.html?token=' + localStorage.token + '&#/wholeprocess/train-test/taskManage?status=0&today=1')
      $channel.$emit("tabs", "taskRecord");
      this.$router.push({
        name: "taskRecord",
        query: { id: 426, missionStatus: "1" },
      });
    },

    chengnuoFu() {
      $channel.$emit("tabs", "threeCardInfoManagement");
      this.$router.push({
        name: "threeCardInfoManagement",
        query: { id: 134 },
      });
    },
    zongshufu() {
      this.$router.push({ name: "NoticeList", query: { type: "" } });
    },

    totalUrl() {
      this.$router.push({ name: "NoticeList", query: { type: "" } });
    },
    todayfu() {
      this.$router.push({
        name: "dangerNoticeList",
        query: { type: "", beginTime: this.beginTime, endTime: this.endTime },
      });
    },

    async getNum() {
      var data = {};
      var res = await this.$bubble.request("total.info", data);
      if (res.code == 0) {
        this.yujingNum = res.record["1"] || 0;
        this.shiguNum = res.record["2"] || 0;
        this.yinhuanNum = res.record["3"] || 0;
        this.xunjianNum = res.record["4"] || 0;
        this.xuexiNum = res.record["15"] || 0; //学习中
        this.chengnuo = res.record["7"] || 0;
        this.yujingNumToday = res.record["11"] || 0;
        this.shiguNumToday = res.record["12"] || 0;
        this.yinhuanNumToday = res.record["13"] || 0;
        this.xunjianNumToday = res.record["14"] || 0;
        this.xuexiIngNum = res.record["5"] || 0; //学习中
        this.totalNum = res.record["1002"] || 0;
        this.finishNum = res.record["1001"] || 0;
        this.addNum = res.record["1003"] || 0;
      }
    },
    async getJf() {
      const res = await this.$bubble.request("total.ScoreType", {});
      if (res.code == 0) {
        var data = res.record;
        var dataLevel = [];
        var arr = [];
        for (let i = 0; i < data.length; i++) {
          var obj = {};
          if (data[i].type == 1) {
            data[i].name = "合格";
          }
          if (data[i].type == 2) {
            data[i].name = "约谈";
          }
          if (data[i].type == 3) {
            data[i].name = "教育";
          }
          if (data[i].type == 4) {
            data[i].name = "通报";
          }
          obj.value = data[i].count;
          obj.name = data[i].name;
          arr.push(obj);
          dataLevel.push(data[i].name);
        }

        this.initPieEcharts3(dataLevel, arr);
      }
    },
    async getCnl() {
      const res = await this.$bubble.request("total.Statistics", {});
      if (res.code == 0) {
        var data = res.record;
        if (data[0].name != "已承诺") {
          data.reverse();
        }
        var dataLevel = [];
        var arr = [];
        for (let i = 0; i < data.length; i++) {
          var obj = {};
          if (data[i].name == 0) {
            data[i].name = "未承诺";
          }
          if (data[i].name == 1) {
            data[i].name = "已承诺";
          }

          obj.value = data[i].num;
          obj.name = data[i].name;
          arr.push(obj);

          dataLevel.push(data[i].name);
        }

        this.initPieEcharts2(dataLevel, arr);
      }
    },
    initPieEcharts2(dataLevel, arr) {
      let _this = this;
      //计算承诺率
      var chengnuoRatio = this.getRatio(arr, "已承诺");
      var echarts1 = $echarts.init(document.getElementById("precent"));
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
        },
        legend: {
          bottom: 10,
          textStyle: {
            rich: {
              a: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["rgb(0, 2, 139)", "rgb(99,175,255)"];
                  return colorList[params.dataIndex];
                },
                fontSize: 18,
              },
              b: {
                fontSize: 14,
              },
            },
          },
          icon: "circle", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          itemWidth: 20, // 设置宽度
          itemHeight: 20, // 设置高度
          itemGap: 60,
          formatter: function (name) {
            var num = 0;
            arr.forEach((item, i) => {
              if (item.name == name) {
                num = item.value;
              }
            });
            let array = ["{a|" + num + "家}", "{b|" + name + "}"];
            return array.join("");
          },
          //   itemGap: 40 // 设置间距
        },
        series: [
          {
            name: "企业占比",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "30",
            //     fontWeight: "bold"
            //   }
            // },
            labelLine: {
              show: false,
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = ["rgb(0, 2, 139)", "rgb(99,175,255)"];
                  return colorList[params.dataIndex];
                },
              },
            },

            data: arr,
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text",
            left: "center",
            top: "center",
            style: {
              text: "承诺率" + chengnuoRatio,
              // textAlign: 'center',
              width: 30,
              height: 30,
              fontSize: 22,
            },
          },
        ],
      };
      echarts1.setOption(option);

      echarts1.on("click", function ({ data: { name } }) {
        new _this.$newPopup(
          promiseDetail,
          {
            props: {
              type: name == "已承诺" ? "1" : "0",
              vueObj: _this
            },
          },
          () => {}
        );
      });
      echarts1.on("legendselectchanged", function ({ name }) {
        new _this.$newPopup(
          promiseDetail,
          {
            props: {
              type: name == "已承诺" ? "1" : "0",
              vueObj: _this
            },
          },
          () => {}
        );
        echarts1.dispatchAction({
          type: "legendSelect",
          name: name,
        });
      });
    },
    initPieEcharts3(dataLevel, arr) {
      let _this = this;
      //计算承诺率
      var chengnuoRatio = this.getRatio(arr, "记分");
      var echarts1 = $echarts.init(document.getElementById("precent1"));
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
        },
        legend: {
          bottom: 10,
          textStyle: {
            rich: {
              a: {
                color: function (params) {
                  //自定义颜色
                  var colorList = [
                    "rgb(0, 168, 139)",
                    "rgb(132, 2, 139)",
                    "rgb(99,175,255)",
                    "rgb(0,175,255)",
                    "rgb(0,175,0)",
                  ];
                  return colorList[params.dataIndex];
                },
                fontSize: 20,
              },
              b: {
                fontSize: 16,
              },
            },
          },
          icon: "circle", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          itemWidth: 20, // 设置宽度
          itemHeight: 20, // 设置高度
          itemGap: 60,
          formatter: function (name) {
            var num = 0;
            arr.forEach((item, i) => {
              if (item.name == name) {
                num = item.value;
              }
            });
            let array = ["{a|" + num + "家}", "{b|" + name + "}"];
            return array.join("");
          },
          //   itemGap: 40 // 设置间距
        },
        series: [
          {
            name: "企业占比",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "30",
            //     fontWeight: "bold"
            //   }
            // },
            labelLine: {
              show: false,
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              normal: {
                color: function (params) {
                  //自定义颜色
                  var colorList = [
                    "rgb(0, 168, 139)",
                    "rgb(132, 2, 139)",
                    "rgb(99,175,255)",
                    "rgb(0,175,255)",
                    "rgb(0,175,0)",
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },

            data: arr,
          },
        ],
        graphic: [
          {
            //环形图中间添加文字
            type: "text",
            left: "center",
            top: "center",
            style: {
              text: "记分占比",
              textAlign: "center",
              width: 30,
              height: 30,
              fontSize: 22,
            },
          },
        ],
      };
      echarts1.setOption(option);
      echarts1.on("click", function ({ data: { name } }) {
        new _this.$newPopup(
          comintegral,
          {
            props: {
              type:
                name == "合格"
                  ? "1"
                  : name == "约谈"
                  ? "2"
                  : name == "教育"
                  ? "3"
                  : "4",
              vueObj: _this
            },
          },
          () => {}
        );
      });
      echarts1.on("legendselectchanged", function ({ name }) {
        new _this.$newPopup(
          comintegral,
          {
            props: {
              type:
                name == "合格"
                  ? "1"
                  : name == "约谈"
                  ? "2"
                  : name == "教育"
                  ? "3"
                  : "4",
              vueObj: _this
            },
          },
          () => {}
        );
        echarts1.dispatchAction({
          type: "legendSelect",
          name: name,
        });
      });
    },
    formData(fmt) {
      var date = new Date();
      var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    //计算承诺率
    getRatio(array, str) {
      var TopNumber = 0;
      var bottomNumber = 0;
      array.forEach((element) => {
        if (element.name == str) {
          TopNumber += element.value;
        }
        bottomNumber += element.value;
      });
      if (bottomNumber > 0) {
        return Math.round((TopNumber / bottomNumber) * 10000) / 100.0 + "%";
      }
      return "0%";
    },

    async getPromiseStatus() {
      var data = {
        promiseTime: this.formData("yyyy-MM-dd hh:mm:ss"),
        enterpriseId: localStorage.orgId,
      };
      const res = await this.$bubble.request("total.queryBean", data);
      if (res.code == 0) {
        var data = res.record;
        if (data.length > 0) {
          var status = data[0].status;
          if (status == 0) {
            this.promised = false;
          }
          if (status == 1) {
            this.promised = true;
          }
        }
      }
    },
  },
  mounted() {
    this.getPromiseStatus();
    var myDate = new Date();
    var year = myDate.getFullYear(); // 获取完整的年份(4位,1970-????)
    var mon = myDate.getMonth(); // 获取当前月份(0-11,0代表1月)
    var day = myDate.getDate(); // 获取当前日(1-31)

    this.beginTime = year + "-" + (mon + 1) + "-" + day;
    this.endTime = year + "-" + (mon + 1) + "-" + (day + 1);
    this.getNum();
    
    if(this.userType == 2) {
      this.getJf();
      this.getCnl();
    }
  },
};
</script>
<style lang="less" scoped>
.card-box {
  width: 100%;
  height: 100%;
  text-align: center;
  .no-hover {
    transition: all 0.2 ease;
  }
  .hover {
    display: none;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        width: 50%;
        padding-bottom: -17px;
        cursor: pointer;
      }
      div:first-child {
        border-right: 1px solid #ccc;
      }
    }
  }
}

.card-box:hover .no-hover {
  display: none;
}
.card-box:hover .hover {
  display: block;
}
.cardStyle {
  width: 10.583vw;
  cursor: pointer;
}

#total {
  background-color: #ffffff;
  margin: 0 auto;
  border-radius: 15px;
  width: 90%;
  overflow-y: auto;
}
.content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 85%;
  margin: 0 auto;
  height: 150px;
  align-items: center;
  justify-content: space-between;
}

.title {
  position: relative;
  width: 85%;
  text-align: start;
  font-weight: 700;
}

.beforeBorder {
  position: absolute;
  height: 18px;
  width: 4px;
  background-color: #2d8cf0;
  top: 0px;
  left: -13px;
}

.totalShow {
  width: 9.583vw;
  padding: 17px;
  border: 1px solid #d3dade8c;
  border-radius: 0.313vw;
  img {
    width: 50px;
    height: 50px;
  }
}

.cardStyle {
  width: 9.583vw;
  padding: 17px 0;
  img {
    width: 50px;
    height: 50px;
  }
}
.cnl {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 85%;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  .con {
    display: flex;
    height: 350px;
    width: 350px;
    flex-shrink: 0;
    margin: 0 auto;
    // background: blueviolet;
    margin-top: 30px;
  }
}
.cnljf {
  display: flex;
  flex-direction: row;
  width: 90%;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  .jfPie {
    width: 100%;
    height: 350px;
    margin: 0 auto;
    margin-top: 30px;
  }
  .jfTrend {
    display: flex;
    height: 350px;
    width: 60%;
    margin-top: 30px;
  }
}
/deep/ .ivu-card-body {
  padding: 0;
}
.two {
  display: flex;
  margin: 0 auto;
  width: 91.5%;
  flex-direction: row;
  .box {
    flex-direction: column;
    display: flex;
    flex: 1;
  }
}
i-scrollbar-hide {
}
</style>
