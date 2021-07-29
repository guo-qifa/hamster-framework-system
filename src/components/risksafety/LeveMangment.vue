<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :xl="6">
        <div class="top-box box1">
          <img :src="image" />
          <div class="info">
            <p class="title">
              <!--  -->
              重大风险<span>{{
                (riskLeve[3] && riskLeve[3].num ? riskLeve[3].num : 0) || 0
              }}</span
              >个
            </p>
            <p class="desc" @click="go">极其危险，必须高度关注，重点防范</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :xl="6">
        <div class="top-box box2">
          <img :src="image" />
          <div class="info">
            <p class="title">
              <!--  -->
              较大风险<span>{{
                riskLeve[2] && riskLeve[2].num ? riskLeve[2].num : 0 || 0
              }}</span
              >个
            </p>
            <p class="desc" @click="go">高度风险，应采取严密防控措施</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :xl="6">
        <div class="top-box box3">
          <img :src="image" />
          <div class="info">
            <p class="title">
              <!--  -->
              一般风险<span>{{
                (riskLeve[1] && riskLeve[1].num ? riskLeve[1].num : 0) || 0
              }}</span
              >个
            </p>
            <p class="desc" @click="go">中度风险，应采取有效防控措施</p>
          </div>
        </div>
      </el-col>
      <el-col :sm="24" :md="12" :xl="6">
        <div class="top-box box4">
          <img :src="image" />
          <div class="info">
            <p class="title">
              <!--  -->
              低风险<span>{{
                riskLeve[0] && riskLeve[0].num ? riskLeve[0].num : 0 || 0
              }}</span
              >个
            </p>
            <p class="desc" @click="go">一般危险，严格按照规章制度</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <div class="chart" ref="chart1"></div>
      </el-col>
    </el-row>
    <el-row class="lastRow" :gutter="20" style="margin-top: 20px">
      <el-col :sm="24" :md="12" :xl="6">
        <div class="chart" ref="chart2"></div>
      </el-col>
      <el-col :sm="24" :md="12" :xl="6">
        <div class="chart" ref="chart3"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import image from "@/assets/warning.png";
export default {
  name: "LeveMangment",
  data() {
    return {
      image,
      riskLeve: [],
      categroy: [],
      eiskType: [],
    };
  },
  methods: {
    go() {
      this.$router.push("/riskPointManagements");
    },
    initChart1() {
      echarts.init(this.$refs.chart1).setOption({
        color: ["#3398DB", "#288ae5"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        title: {
          text: "按事故类型分类统计",
          // subtext: '纯属虚构',
        },
        legend: {
          // orient: 'vertical',
          right: 10,
          data: ["事故"],
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
            data: ["火灾", "顶板", "机电", "水灾", "瓦斯", "运输", "其他"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "事故",
            type: "bar",
            barWidth: "40%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      });
    },
    initChart2(datas) {
      echarts.init(this.$refs.chart2).setOption({
        color: ["#f35637", "#fc9900", "#f0cb00", "#13aae1"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        title: {
          text: "按风险辨识类别统计",
          // subtext: '纯属虚构',
        },
        legend: {
          orient: "vertical",
          right: 10,
          data: datas.map((v) => v.name),
        },
        series: [
          {
            name: "风险级别",
            type: "pie",
            radius: ["60%", "45%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: datas.map((v) => {
              return {
                value: v.num,
                name: v.name,
              };
            }),
          },
        ],
      });
    },
    initChart3(data) {
      if (!data) {
        return;
      }
      for (let v of data) {
        if (v.name == "01") v.name = "低风险";
        else if (v.name == "02") v.name = "一般风险";
        else if (v.name == "03") v.name = "较大风险";
        else if (v.name == "04") v.name = "重大风险";
      }
      let xdata = data.map((v) => v.name);
      let yData = data.map((v) => {
        return { value: v.num, name: v.name };
      });
      echarts.init(this.$refs.chart3).setOption({
        color: ["#13aae1", "#f0cb00", "#fc9900", "#f35637"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        title: {
          text: "按风险类别级别统计",
        },
        legend: {
          orient: "vertical",
          right: 10,
          data: xdata || [],
        },
        series: [
          {
            name: "风险级别",
            type: "pie",
            radius: ["60%", "45%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: yData || [],
          },
        ],
      });
    },
    async getRiskLeveData() {
      const v = await this.$bubble.request("charts.riskLeve");
      let obj = {};
      v.record.forEach((v, i) => {
        if (v.num == null) v.num = 0;
        if (v.name == null) v.name = "暂无数据";
        if (v.id == null) v.id = i + 1;
        obj[i] = v;
      });
      obj = Object.values(obj);
      this.initChart3(obj);
      this.riskLeve = obj;
    },
    /**
     * @name: 获取分类数据
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-13 11:14:32
     * @LastEditTime: Do not Edit
     */
    getCategroyData() {
      this.$bubble
        .request("charts.categroy")
        .then((v) => {
          this.categroy = v.record;
          console.log(this.categroy, "this.categroy");
        })
        .catch((e) => {
          this.$alert("数据获取失败");
        });
    },
    /**
     * @name: 获取饼状图数据
     * @Author: liuYaoYu
     * @param {*}
     * @return {*}
     * @Date: 2021-04-13 11:02:41
     * @LastEditTime: Do not Edit
     */
    getData() {
      Promise.all([
        this.$bubble.request("charts.count"),
        this.$bubble.request("charts.eiskType"),
      ])
        .then(([count, data]) => {
          let u = count.record.map((v, i) => ({
            [v.subDictValue]: v.subDictName,
          }));
          let obj = {};
          u.forEach((v) => {
            for (let i in v) {
              obj[i] = v[i];
            }
          });
          for (let k in obj) {
            for (let d of data.record) {
              if (k == d.name) {
                d.name = obj[k];
              }
            }
          }
          let result = data.record;
          this.initChart2(result);
        })
        .catch((e) => {
          this.$alert("数据获取失败");
        });
    },
  },
  mounted() {
    this.initChart1();
    this.getCategroyData();
    this.getRiskLeveData();
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.lastRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-box {
  width: 100%;
  height: 130px;
  padding: 15px;
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  &.box1 {
    background-color: #f35637;
  }

  &.box2 {
    background-color: #fc9900;
  }

  &.box3 {
    background-color: #f3ca00;
  }

  &.box4 {
    background-color: #13aae1;
  }
  .info {
    color: #fff;
    height: 80px;
    padding-left: 20px;
    justify-self: flex-end;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 26px;
    }
    .desc {
      font-size: 16px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

.chart {
  height: 400px;
}
</style>